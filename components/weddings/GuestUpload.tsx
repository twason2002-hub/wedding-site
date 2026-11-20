"use client";

import { useState } from "react";

/**
 * GuestUpload — guests share their photos. POSTs multipart to
 * /api/weddings/photos → `guest-photos` bucket + `wedding_guest_photos`
 * (approved=false → couple moderates in admin). 8MB cap, images only.
 */
export default function GuestUpload({
  weddingSlug,
  accent,
  ink,
}: {
  weddingSlug: string;
  accent: string;
  ink: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [caption, setCaption] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) {
      setError("Choose a photo first");
      setState("error");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Photo must be under 8MB");
      setState("error");
      return;
    }
    setState("sending");
    setError("");
    try {
      const fd = new FormData();
      fd.append("weddingSlug", weddingSlug);
      fd.append("photo", file);
      fd.append("caption", caption.trim());
      const res = await fetch("/api/weddings/photos", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setCaption("");
      if (input) input.value = "";
      setState("done");
      setTimeout(() => setState("idle"), 4000);
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-xl space-y-3 text-center">
      <label
        className="block cursor-pointer rounded-3xl border-2 border-dashed px-6 py-8 transition hover:opacity-80"
        style={{ borderColor: `${accent}88` }}
      >
        <span className="block text-3xl" aria-hidden="true">
          ◉
        </span>
        <span className="mt-2 block text-sm font-medium" style={{ color: ink }}>
          Share your celebration photos
        </span>
        <span className="mt-1 block text-xs opacity-70" style={{ color: ink }}>
          JPG / PNG / WebP · up to 8MB · shown after the couple approves
        </span>
        <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" aria-label="Choose a photo to upload" />
      </label>
      <input
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        maxLength={120}
        placeholder="Caption (optional)"
        aria-label="Photo caption"
        className="w-full rounded-xl bg-white/70 px-4 py-3 text-sm shadow-[inset_0_0_0_0.75px_rgba(0,0,0,0.12)] outline-none placeholder:text-stone-400 focus:ring-2"
        style={{ color: ink }}
      />
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="wi-action-lift inline-flex min-h-[48px] items-center rounded-full px-8 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white disabled:opacity-60"
        style={{ background: accent }}
      >
        {state === "sending" ? "Uploading…" : state === "done" ? "Thank you ✓" : "Upload photo"}
      </button>
      {state === "done" && (
        <p role="status" className="text-sm" style={{ color: ink }}>
          Received! The couple will approve it soon.
        </p>
      )}
    </form>
  );
}
