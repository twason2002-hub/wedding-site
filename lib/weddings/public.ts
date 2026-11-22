import type { Metadata } from "next";
import { getPublicWedding } from "./db";
import { invitePageMetadata } from "./og";
import { getWedding } from "./sample-data";
import type { WeddingData } from "./types";

/**
 * Static demos always win for the sample slugs. A customer row in Supabase
 * must not replace a template preview, even when it uses the same slug.
 * Other slugs are real invitations and load from Supabase only.
 */
export async function loadPublicWedding(slug: string): Promise<WeddingData | null> {
  const demo = getWedding(slug);
  if (demo) return demo;
  return getPublicWedding(slug);
}

export function weddingMetadata(w: WeddingData | null, path = "/"): Metadata {
  return invitePageMetadata(w, w ? path : "/");
}
