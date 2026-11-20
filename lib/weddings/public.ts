import type { Metadata } from "next";
import { getPublicWedding } from "./db";
import { getWedding } from "./sample-data";
import type { WeddingData } from "./types";

/**
 * Supabase is the source of truth. Demo weddings from sample-data remain as a
 * fallback so preview links keep working during a database outage.
 */
export async function loadPublicWedding(slug: string): Promise<WeddingData | null> {
  return (await getPublicWedding(slug)) ?? getWedding(slug) ?? null;
}

export function weddingMetadata(w: WeddingData | null): Metadata {
  if (!w) return { title: "Wedding not found" };
  return {
    title: `${w.couple.bride} & ${w.couple.groom} — Wedding Invitation`,
    description: `Join ${w.couple.bride} and ${w.couple.groom} on ${w.couple.weddingDateDisplay}. ${w.hashtag ?? ""}`,
    openGraph: {
      title: `${w.couple.bride} & ${w.couple.groom}`,
      description: `We invite you to celebrate our wedding — ${w.couple.weddingDateDisplay}`,
      images: [w.couple.photo ?? "/weddings/royal-couple.jpg"],
    },
  };
}
