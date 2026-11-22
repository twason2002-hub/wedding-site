import { loadPublicWedding } from "@/lib/weddings/public";
import { cardForWedding, marketingCard } from "@/lib/weddings/og";
import { renderOgImage, OG_SIZE } from "@/lib/weddings/og-image";

export const alt = "Wedding invitation";
export const size = OG_SIZE;
export const contentType = "image/png";
export const runtime = "nodejs";

export default async function WeddingOgImage({
  params,
}: {
  params: Promise<{ weddingSlug: string }>;
}) {
  const { weddingSlug } = await params;
  const wedding = await loadPublicWedding(weddingSlug);
  return renderOgImage(wedding ? cardForWedding(wedding) : marketingCard());
}
