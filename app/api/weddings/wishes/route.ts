import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isDemoSlug } from "@/lib/weddings/demo";

/**
 * GET /api/weddings/wishes?wedding=<slug> — latest wishes for live sites.
 * POST — guests post a wish (validated, RLS-enforced, demo-safe).
 */

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("wedding") ?? "";
  if (!slug) return NextResponse.json({ error: "Missing wedding" }, { status: 400 });

  const supabase = await createClient();
  const { data: site } = await supabase
    .from("wedding_websites")
    .select("id")
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();
  if (!site) return NextResponse.json({ wishes: [] });

  const { data } = await supabase
    .from("wedding_wishes")
    .select("id, name, message, created_at")
    .eq("website_id", site.id)
    .order("created_at", { ascending: false })
    .limit(50);
  return NextResponse.json({ wishes: data ?? [] });
}

export async function POST(req: Request) {
  let body: { weddingSlug?: string; name?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const weddingSlug = typeof body.weddingSlug === "string" ? body.weddingSlug : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!weddingSlug) return NextResponse.json({ error: "Missing wedding" }, { status: 400 });
  if (name.length < 2 || name.length > 60)
    return NextResponse.json({ error: "Please enter your name (2–60 characters)" }, { status: 400 });
  if (message.length < 2 || message.length > 280)
    return NextResponse.json({ error: "Wish must be 2–280 characters" }, { status: 400 });

  const supabase = await createClient();
  const { data: site, error: siteErr } = await supabase
    .from("wedding_websites")
    .select("id")
    .eq("slug", weddingSlug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();

  if (siteErr) {
    console.warn("[wishes] lookup failed:", siteErr.message);
    return NextResponse.json({ error: "Wishes are temporarily unavailable." }, { status: 503 });
  }
  // Demo/sample sites: accept without saving (mirror RSVP behaviour).
  if (isDemoSlug(weddingSlug) && !site)
    return NextResponse.json({
      ok: true,
      demo: true,
      wish: { id: `demo-${Date.now()}`, name, message, created_at: new Date().toISOString() },
    });
  if (!site) return NextResponse.json({ error: "Wedding not found" }, { status: 404 });

  const { data, error: insertErr } = await supabase
    .from("wedding_wishes")
    .insert({ website_id: site.id, name, message })
    .select("id, name, message, created_at")
    .maybeSingle();

  if (insertErr) {
    console.warn("[wishes] insert failed:", insertErr.message);
    return NextResponse.json({ error: "Could not save your wish. Please try again." }, { status: 500 });
  }
  // RLS has no public SELECT... actually public CAN read (policy above), so
  // RETURNING works. Fall back to echo if the select is ever restricted.
  return NextResponse.json({
    ok: true,
    wish: data ?? { id: `local-${Date.now()}`, name, message, created_at: new Date().toISOString() },
  });
}
