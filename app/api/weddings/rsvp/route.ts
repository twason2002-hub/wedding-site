import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isDemoSlug } from "@/lib/weddings/demo";
import type { RsvpSubmission } from "@/lib/weddings/types";

/**
 * POST /api/weddings/rsvp
 * Persists to Supabase `wedding_rsvps` — only for live, RSVP-enabled websites
 * (enforced here and by RLS). RSVP is off by default per website.
 */
export async function POST(req: Request) {
  let body: Partial<RsvpSubmission>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const weddingSlug = typeof body.weddingSlug === "string" ? body.weddingSlug : "";
  const guests = Number(body.guests ?? 1);
  const eventIds = Array.isArray(body.eventIds) ? body.eventIds.filter((e) => typeof e === "string") : [];

  if (!weddingSlug) return NextResponse.json({ error: "Missing wedding" }, { status: 400 });
  if (name.length < 2 || name.length > 80)
    return NextResponse.json({ error: "Please enter your name (2–80 characters)" }, { status: 400 });
  if (!Number.isInteger(guests) || guests < 1 || guests > 10)
    return NextResponse.json({ error: "Guests must be 1–10" }, { status: 400 });
  if (typeof body.diet === "string" && body.diet.length > 120)
    return NextResponse.json({ error: "Dietary note too long" }, { status: 400 });
  if (typeof body.message === "string" && body.message.length > 500)
    return NextResponse.json({ error: "Message too long (max 500)" }, { status: 400 });

  const supabase = await createClient();
  const { data: site, error: siteErr } = await supabase
    .from("wedding_websites")
    .select("id, rsvp_enabled")
    .eq("slug", weddingSlug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();

  if (siteErr) {
    console.warn("[rsvp] lookup failed:", siteErr.message);
    return NextResponse.json({ error: "RSVP is temporarily unavailable. Please try again later." }, { status: 503 });
  }
  // Template previews render sample data with RSVP on; accept without saving.
  if (isDemoSlug(weddingSlug) && !site?.rsvp_enabled) return NextResponse.json({ ok: true, demo: true });
  if (!site) return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
  if (!site.rsvp_enabled)
    return NextResponse.json({ error: "RSVP is not enabled for this wedding" }, { status: 403 });

  // No .select() after insert: guests have no SELECT policy, so RETURNING fails RLS.
  const { error: insertErr } = await supabase
    .from("wedding_rsvps")
    .insert({
      website_id: site.id,
      name,
      attending: body.attending !== false,
      event_ids: eventIds,
      guests,
      diet: typeof body.diet === "string" ? body.diet.slice(0, 120) : null,
      message: typeof body.message === "string" ? body.message.slice(0, 500) : null,
    });

  if (insertErr) {
    console.warn("[rsvp] insert failed:", insertErr.message);
    return NextResponse.json({ error: "Could not save your RSVP. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
