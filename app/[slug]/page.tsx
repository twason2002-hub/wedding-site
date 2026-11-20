import { notFound } from "next/navigation";
import WeddingRenderer from "@/components/weddings/WeddingRenderer";
import { loadPublicWedding, weddingMetadata } from "@/lib/weddings/public";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return weddingMetadata(await loadPublicWedding(slug));
}

/** Root-level public wedding URL: yourdomain.com/<slug> */
export default async function WeddingRootPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const wedding = await loadPublicWedding(slug);
  if (!wedding) notFound();
  return <WeddingRenderer wedding={wedding} />;
}
