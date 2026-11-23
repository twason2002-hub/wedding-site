"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin";
import { inputToRows } from "@/lib/weddings/admin-map";
import { isUuid } from "@/lib/weddings/form-utils";
import { isValidSlug, slugifyCouple, uniqueSlug } from "@/lib/weddings/slug";
import { isDemoSlug } from "@/lib/weddings/demo";
import type { SaveResult, WebsiteInput } from "@/lib/weddings/admin-types";
import {
  isEmailSet,
  isValidWhatsappNumber,
  normalizeInstagramUrl,
  normalizeWhatsappNumber,
  type SiteContact,
} from "@/lib/weddings/site-config";

export async function signOut() {
  const { supabase } = await requireAdmin();
  await supabase.auth.signOut();
  redirect("/admin/wedding-invitations/login");
}

export async function saveWebsite(input: WebsiteInput, mode: "create" | "edit"): Promise<SaveResult> {
  const { supabase, user } = await requireAdmin();

  if (!input.bride.trim() || !input.groom.trim()) {
    return { ok: false, error: "Bride and groom names are required." };
  }
  for (const [label, raw] of [
    ["WhatsApp number", input.contacts.whatsapp],
    ["RSVP WhatsApp number", input.contacts.rsvpNumber],
  ] as const) {
    const trimmed = raw.trim();
    if (trimmed && !isValidWhatsappNumber(normalizeWhatsappNumber(trimmed))) {
      return { ok: false, error: `${label} should be digits with a country code, for example 919056314930.` };
    }
  }

  const { data: template } = await supabase
    .from("templates")
    .select("id, slug")
    .eq("slug", input.templateSlug)
    .eq("active", true)
    .maybeSingle();
  if (!template) return { ok: false, error: "Pick an active template." };

  const baseSlug = input.slug.trim() || slugifyCouple(input.groom, input.bride);
  if (!isValidSlug(baseSlug)) {
    return { ok: false, error: "Slug may only contain lowercase letters, numbers and hyphens (3–80 chars)." };
  }

  let websiteId: string;
  let slug: string;
  let lockedNoExpiry = false;

  if (mode === "create") {
    if (!input.id || !isUuid(input.id)) return { ok: false, error: "Invalid website id." };
    websiteId = input.id;
    slug = await uniqueSlug(supabase, baseSlug);
  } else {
    if (!input.id || !isUuid(input.id)) return { ok: false, error: "Invalid website id." };
    websiteId = input.id;
    const { data: existing } = await supabase
      .from("wedding_websites")
      .select("id, slug, no_expiry")
      .eq("id", websiteId)
      .maybeSingle();
    if (!existing) return { ok: false, error: "Website not found." };
    lockedNoExpiry = isDemoSlug(existing.slug) || existing.no_expiry === true;
    if (baseSlug !== existing.slug) {
      const { data: clash } = await supabase
        .from("wedding_websites")
        .select("id")
        .eq("slug", baseSlug)
        .neq("id", websiteId)
        .maybeSingle();
      if (clash) return { ok: false, error: `Slug "${baseSlug}" is already taken.` };
    }
    slug = baseSlug;
  }

  const expiryDays = Math.min(365, Math.max(1, Math.round(input.expiryDays || 7)));
  const row = {
    id: websiteId,
    slug,
    template_id: template.id,
    status: input.status,
    bride_name: input.bride.trim(),
    groom_name: input.groom.trim(),
    wedding_date: input.weddingDate || null,
    expiry_days: expiryDays,
    custom_expires_at: input.customExpiresAt ? new Date(input.customExpiresAt).toISOString() : null,
    rsvp_enabled: input.rsvpEnabled,
    no_expiry: lockedNoExpiry || input.noExpiry,
    created_by: user.id,
  };

  const { error: upsertErr } = await supabase
    .from("wedding_websites")
    .upsert(row, { onConflict: "id" });
  if (upsertErr) return { ok: false, error: upsertErr.message };

  const { content, images } = inputToRows(input);
  const contentRows = Object.entries(content).map(([key, value]) => ({
    website_id: websiteId,
    key,
    value,
  }));
  const { error: contentErr } = await supabase
    .from("wedding_content")
    .upsert(contentRows, { onConflict: "website_id,key" });
  if (contentErr) return { ok: false, error: contentErr.message };

  const keys = contentRows.map((r) => r.key);
  await supabase
    .from("wedding_content")
    .delete()
    .eq("website_id", websiteId)
    .not("key", "in", `(${keys.map((k) => `"${k}"`).join(",")})`);

  await supabase.from("wedding_images").delete().eq("website_id", websiteId);
  if (images.length > 0) {
    const { error: imgErr } = await supabase
      .from("wedding_images")
      .insert(images.map((i) => ({ ...i, website_id: websiteId })));
    if (imgErr) return { ok: false, error: imgErr.message };
  }

  const removable = input.removedStoragePaths.filter(
    (p) => p.startsWith(`${websiteId}/`) && !p.startsWith("/") && !p.startsWith("http"),
  );
  if (removable.length > 0) {
    await supabase.storage.from("wedding-images").remove(removable);
  }

  revalidatePath("/admin/wedding-invitations");
  revalidatePath(`/${slug}`);
  revalidatePath(`/wedding-invitations/${slug}`);

  if (mode === "create") {
    redirect(`/admin/wedding-invitations?created=${encodeURIComponent(slug)}`);
  }
  return { ok: true, slug };
}

export async function setWebsiteStatus(id: string, status: "draft" | "published") {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("wedding_websites").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/wedding-invitations");
  return { ok: true };
}

/** Soft delete: site goes offline immediately; storage + rows purged after retention. */
export async function deleteWebsite(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("wedding_websites")
    .update({ status: "deleted", deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/wedding-invitations");
  return { ok: true };
}

/** Guestbook moderation. */
export async function deleteWish(id: string, websiteId: string) {
  if (!isUuid(id) || !isUuid(websiteId)) return { ok: false, error: "Bad id" };
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("wedding_wishes").delete().eq("id", id).eq("website_id", websiteId);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/admin/wedding-invitations/${websiteId}/rsvps`);
  return { ok: true };
}

/** Guest photo moderation: approve shows it on the site; delete purges file + row. */
export async function approveGuestPhoto(id: string, websiteId: string) {
  if (!isUuid(id) || !isUuid(websiteId)) return { ok: false, error: "Bad id" };
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("wedding_guest_photos")
    .update({ approved: true })
    .eq("id", id)
    .eq("website_id", websiteId);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/admin/wedding-invitations/${websiteId}/rsvps`);
  return { ok: true };
}

export async function deleteGuestPhoto(id: string, websiteId: string, storagePath: string) {
  if (!isUuid(id) || !isUuid(websiteId)) return { ok: false, error: "Bad id" };
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("wedding_guest_photos").delete().eq("id", id).eq("website_id", websiteId);
  if (error) return { ok: false, error: error.message };
  if (storagePath) await supabase.storage.from("guest-photos").remove([storagePath]);
  revalidatePath(`/admin/wedding-invitations/${websiteId}/rsvps`);
  return { ok: true };
}

export async function saveSiteContact(
  input: SiteContact,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { supabase } = await requireAdmin();
  const whatsappNumber = normalizeWhatsappNumber(input.whatsappNumber);
  if (!isValidWhatsappNumber(whatsappNumber)) {
    return { ok: false, error: "Enter a WhatsApp number with country code, for example 919056314930." };
  }
  const email = input.email.trim();
  if (email && !isEmailSet(email)) {
    return { ok: false, error: "Email looks incomplete. Leave it blank to hide it on the site." };
  }
  const instagramRaw = input.instagramUrl.trim();
  const instagramUrl = normalizeInstagramUrl(instagramRaw);
  if (instagramRaw && instagramUrl === null) {
    return { ok: false, error: "Instagram must be a https://instagram.com/… profile link, or left blank." };
  }
  const { error } = await supabase.from("app_settings").upsert(
    {
      key: "site_contact",
      value: { whatsappNumber, email, instagramUrl: instagramUrl ?? "" },
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );
  if (error) return { ok: false, error: error.message };
  revalidatePath("/wedding-invitations");
  revalidatePath("/wedding-invitations/templates");
  revalidatePath("/admin/wedding-invitations/settings");
  return { ok: true };
}
