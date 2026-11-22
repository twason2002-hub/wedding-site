import { loadPublicWedding } from "@/lib/weddings/public";
import { cardForWedding, marketingCard } from "@/lib/weddings/og";
import { renderOgImage, OG_SIZE } from "@/lib/weddings/og-image";

export const alt = "Wedding invitation";
export const size = OG_SIZE;
export const contentType = "image/png";
export const runtime = "nodejs";

export default async function RootWeddingOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const wedding = await loadPublicWedding(slug);
  return renderOgImage(wedding ? cardForWedding(wedding) : marketingCard());
}
