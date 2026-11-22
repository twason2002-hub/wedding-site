import { renderOgImage, OG_SIZE } from "@/lib/weddings/og-image";
import { marketingCard } from "@/lib/weddings/og";

export const alt = "Inviteo — Indian wedding invitation designs";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function TemplatesOgImage() {
  return renderOgImage(marketingCard());
}
