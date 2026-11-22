import { getTemplate } from "@/lib/weddings/templates";
import { demoWeddingFor } from "@/lib/weddings/sample-data";
import { cardForTemplatePreview, templatesGalleryCard } from "@/lib/weddings/og";
import { renderOgImage, OG_SIZE } from "@/lib/weddings/og-image";

export const alt = "Inviteo wedding invitation template preview";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function TemplateOgImage({
  params,
}: {
  params: Promise<{ templateSlug: string }>;
}) {
  const { templateSlug } = await params;
  const template = getTemplate(templateSlug);
  const wedding = template ? demoWeddingFor(template.slug) : null;
  if (!template || !wedding) return renderOgImage(templatesGalleryCard());
  return renderOgImage(cardForTemplatePreview(wedding, template.name));
}
