import { notFound } from "next/navigation";
import WeddingRenderer from "@/components/weddings/WeddingRenderer";
import { loadPublicWedding, weddingMetadata } from "@/lib/weddings/public";

export async function generateMetadata({ params }: { params: Promise<{ weddingSlug: string }> }) {
  const { weddingSlug } = await params;
  return weddingMetadata(await loadPublicWedding(weddingSlug), `/wedding-invitations/${weddingSlug}`);
}

/** Published wedding website, loaded from Supabase by slug. */
export default async function WeddingSitePage({ params }: { params: Promise<{ weddingSlug: string }> }) {
  const { weddingSlug } = await params;
  const wedding = await loadPublicWedding(weddingSlug);
  if (!wedding) notFound();
  return <WeddingRenderer wedding={wedding} />;
}
