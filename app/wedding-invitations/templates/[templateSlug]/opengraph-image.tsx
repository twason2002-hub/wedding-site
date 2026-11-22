import { getTemplate } from "@/lib/weddings/templates";
import { demoWeddingFor } from "@/lib/weddings/sample-data";
import { cardForWedding, marketingCard } from "@/lib/weddings/og";
import { renderOgImage, OG_SIZE } from "@/lib/weddings/og-image";

export const alt = "Wedding invitation template preview";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function TemplateOgImage({
  params,
}: {
  params: Promise<{ templateSlug: string }>;
}) {
  const { templateSlug } = await params;
  const template = getTemplate(templateSlug);
  if (!template) return renderOgImage(marketingCard());
  return renderOgImage(cardForWedding(demoWeddingFor(template.slug)));
}
