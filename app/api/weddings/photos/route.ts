import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isDemoSlug } from "@/lib/weddings/demo";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

/**
 * POST /api/weddings/photos (multipart: weddingSlug, photo, caption?)
 * Guest uploads → `guest-photos` bucket + `wedding_guest_photos`
 * (approved=false; couple moderates in admin). Demo slugs: accepted, dropped.
 */
export async function POST(req: Request) {
  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }

  const weddingSlug = String(fd.get("weddingSlug") ?? "");
  const caption = String(fd.get("caption") ?? "").slice(0, 120);
  const file = fd.get("photo");

  if (!weddingSlug) return NextResponse.json({ error: "Missing wedding" }, { status: 400 });
  if (!(file instanceof File) || file.size === 0)
    return NextResponse.json({ error: "Choose a photo first" }, { status: 400 });
  if (!ALLOWED.has(file.type))
    return NextResponse.json({ error: "Only JPG, PNG or WebP photos" }, { status: 400 });
  if (file.size > MAX_BYTES)
    return NextResponse.json({ error: "Photo must be under 8MB" }, { status: 400 });

  if (isDemoSlug(weddingSlug)) return NextResponse.json({ ok: true, demo: true });

  const supabase = await createClient();
  const { data: site } = await supabase
    .from("wedding_websites")
    .select("id")
    .eq("slug", weddingSlug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();
  if (!site) return NextResponse.json({ error: "Wedding not found" }, { status: 404 });

  const path = `${weddingSlug}/${crypto.randomUUID()}.${EXT[file.type]}`;
  const { error: upErr } = await supabase.storage
    .from("guest-photos")
    .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
  if (upErr) {
    console.warn("[photos] upload failed:", upErr.message);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }

  const { error: rowErr } = await supabase
    .from("wedding_guest_photos")
    .insert({ website_id: site.id, storage_path: path, caption: caption || null });
  if (rowErr) {
    console.warn("[photos] row failed:", rowErr.message);
    await supabase.storage.from("guest-photos").remove([path]);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
