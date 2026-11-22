import { renderOgImage, OG_SIZE } from "@/lib/weddings/og-image";
import { templatesGalleryCard } from "@/lib/weddings/og";

export const alt = "Wedding invitation templates by Inviteo";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function TemplatesOgImage() {
  return renderOgImage(templatesGalleryCard());
}
