"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ImageRef } from "@/lib/weddings/admin-types";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_BYTES = 10 * 1024 * 1024;

export default function UploadButton({
  websiteId,
  slot,
  multiple = false,
  label,
  onUploaded,
}: {
  websiteId: string;
  slot: string;
  multiple?: boolean;
  label: string;
  onUploaded: (refs: ImageRef[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError("");
    setBusy(true);
    try {
      const supabase = createClient();
      const refs: ImageRef[] = [];
      for (const file of Array.from(files)) {
        if (!ALLOWED.includes(file.type)) {
          throw new Error(`${file.name}: only JPG, PNG, WebP or AVIF allowed.`);
        }
        if (file.size > MAX_BYTES) {
          throw new Error(`${file.name}: max size is 10 MB.`);
        }
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const safeSlot = slot.replace(/[^a-zA-Z0-9-]/g, "-");
        const path = `${websiteId}/${safeSlot}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("wedding-images")
          .upload(path, file, { cacheControl: "3600", upsert: false });
        if (upErr) throw new Error(upErr.message);
        refs.push({ path, alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") });
      }
      onUploaded(refs);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <button
        type="button"
        className="adm-upload"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
      >
        <span aria-hidden="true" style={{ fontSize: "1.3rem" }}>⇪</span>
        <span>{busy ? "Uploading…" : label}</span>
        <span className="adm-hint" style={{ marginTop: 0 }}>JPG, PNG, WebP or AVIF · up to 10 MB</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED.join(",")}
        multiple={multiple}
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && <p className="adm-field-error" role="alert">{error}</p>}
    </div>
  );
}
