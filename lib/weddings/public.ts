import type { Metadata } from "next";
import { getPublicWedding } from "./db";
import { invitePageMetadata } from "./og";
import { getWedding } from "./sample-data";
import type { WeddingData } from "./types";

/**
 * Supabase is the source of truth. Demo weddings from sample-data remain as a
 * fallback so preview links keep working during a database outage.
 */
export async function loadPublicWedding(slug: string): Promise<WeddingData | null> {
  return (await getPublicWedding(slug)) ?? getWedding(slug) ?? null;
}

export function weddingMetadata(w: WeddingData | null, path = "/"): Metadata {
  return invitePageMetadata(w, w ? path : "/");
}
