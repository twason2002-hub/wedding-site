import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_SITE_CONTACT,
  isValidWhatsappNumber,
  normalizeWhatsappNumber,
  type SiteContact,
} from "./site-config";
import type { TemplateDefinition, WeddingData, WeddingEvent } from "./types";
import type { WeddingContentMap } from "./admin-types";
import { resolveImage } from "./form-utils";

export { resolveImage };

export interface TemplateRow {
  id: string;
  slug: string;
  name: string;
  category: TemplateDefinition["category"];
  description: string;
  thumbnail: string;
  fonts: TemplateDefinition["fonts"];
  palette: TemplateDefinition["palette"];
  sections: string[];
  animation: TemplateDefinition["animation"];
  active: boolean;
  sort_order: number;
}

export interface WebsiteRow {
  id: string;
  slug: string;
  template_id: string;
  status: "draft" | "published" | "expired" | "deleted";
  bride_name: string;
  groom_name: string;
  wedding_date: string | null;
  expiry_days: number;
  custom_expires_at: string | null;
  expires_at: string | null;
  rsvp_enabled: boolean;
  no_expiry: boolean;
  locale_default: "en" | "hi";
  created_at: string;
  updated_at: string;
  published_at: string | null;
  deleted_at: string | null;
  templates?: { slug: string; name: string } | null;
}

export interface ContentRow {
  key: string;
  value: unknown;
}

export interface ImageRow {
  id: string;
  slot: string;
  storage_path: string;
  alt: string;
  caption: string | null;
  sort_order: number;
}

const WEBSITE_SELECT =
  "*, templates(slug, name), wedding_content(key, value), wedding_images(id, slot, storage_path, alt, caption, sort_order)";

export function mapTemplate(row: TemplateRow): TemplateDefinition {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    description: row.description,
    thumbnail: resolveImage(row.thumbnail),
    fonts: row.fonts,
    palette: row.palette,
    sections: row.sections,
    animation: row.animation,
    active: row.active,
    sortOrder: row.sort_order,
  };
}

/** DB rows → the exact WeddingData shape the template renderer consumes. */
export function assembleWedding(
  row: WebsiteRow,
  content: ContentRow[],
  images: ImageRow[],
): WeddingData {
  const c = Object.fromEntries(content.map((r) => [r.key, r.value])) as WeddingContentMap;
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);

  const couple = { ...(c.couple ?? {}) } as WeddingData["couple"];
  const coupleImg = sorted.find((i) => i.slot === "couple");
  if (coupleImg) couple.photo = resolveImage(coupleImg.storage_path);

  const events: WeddingEvent[] = (c.events ?? [])
    .map((e) => {
      const img = sorted.find((i) => i.slot === `event:${e.id}`);
      return { ...e, image: img ? resolveImage(img.storage_path) : e.image } as WeddingEvent;
    })
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const gallery = sorted
    .filter((i) => i.slot === "gallery")
    .map((i) => ({ src: resolveImage(i.storage_path), alt: i.alt, caption: i.caption ?? undefined }));

  return {
    slug: row.slug,
    templateSlug: row.templates?.slug ?? "royal-heritage",
    status: row.status === "published" ? "published" : "draft",
    localeDefault: row.locale_default ?? "en",
    hashtag: c.hashtag,
    music: c.music,
    couple,
    blessing: c.blessing,
    blessingHi: c.blessingHi,
    mantra: c.mantra,
    events,
    venue: c.venue,
    gallery,
    videoUrl: c.videoUrl,
    contacts: c.contacts ?? { numbers: [], whatsapp: "", rsvpNumber: "" },
    sections: { ...(c.sections ?? {}), rsvp: row.rsvp_enabled },
  };
}

/** Public fetch: RLS already restricts to live published sites. */
export async function getPublicWedding(slug: string): Promise<WeddingData | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("wedding_websites")
      .select(WEBSITE_SELECT)
      .eq("slug", slug)
      .eq("status", "published")
      .is("deleted_at", null)
      .maybeSingle();
  if (error || !data) return null;
  if (data.expires_at && new Date(data.expires_at) <= new Date()) return null;
  const wedding = assembleWedding(data, data.wedding_content ?? [], data.wedding_images ?? []);
  // Approved guest photos join the gallery (couple-moderated).
  const { data: guestPhotos } = await supabase
    .from("wedding_guest_photos")
    .select("storage_path, caption")
    .eq("website_id", data.id)
    .eq("approved", true)
    .order("created_at", { ascending: true });
  if (guestPhotos?.length) {
    wedding.gallery = [
      ...wedding.gallery,
      ...guestPhotos.map((g) => ({
        src: supabase.storage.from("guest-photos").getPublicUrl(g.storage_path).data.publicUrl,
        alt: "Guest celebration photo",
        caption: g.caption ?? undefined,
      })),
    ];
  }
  return wedding;
  } catch (err) {
    console.warn("[weddings:db] public fetch failed:", (err as Error).message);
    return null;
  }
}

export async function listAdminWebsites(): Promise<WebsiteRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wedding_websites")
    .select("*, templates(slug, name)")
    .neq("status", "deleted")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAdminWebsite(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wedding_websites")
    .select(WEBSITE_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return {
    row: data as WebsiteRow,
    content: (data.wedding_content ?? []) as ContentRow[],
    images: (data.wedding_images ?? []) as ImageRow[],
  };
}

export async function listDbTemplates(): Promise<TemplateDefinition[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapTemplate);
}

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return fallback;
    const supabase = await createClient();
    const { data } = await supabase.from("app_settings").select("value").eq("key", key).maybeSingle();
    return data ? (data.value as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Marketing contact: Supabase `app_settings.site_contact`, else the code default. */
export async function getSiteContact(): Promise<SiteContact> {
  const stored = await getSetting<Partial<SiteContact>>("site_contact", DEFAULT_SITE_CONTACT);
  const whatsappNumber = normalizeWhatsappNumber(stored?.whatsappNumber ?? "");
  return {
    whatsappNumber: isValidWhatsappNumber(whatsappNumber)
      ? whatsappNumber
      : DEFAULT_SITE_CONTACT.whatsappNumber,
    email: typeof stored?.email === "string" ? stored.email.trim() : "",
    instagramUrl: typeof stored?.instagramUrl === "string" ? stored.instagramUrl.trim() : "",
  };
}
