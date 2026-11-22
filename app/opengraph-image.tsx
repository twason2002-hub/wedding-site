import { renderOgImage, OG_SIZE } from "@/lib/weddings/og-image";
import { marketingCard } from "@/lib/weddings/og";

export const alt = "Inviteo — Indian wedding invitation websites";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Default share image. Template and invitation routes override this. */
export default function RootOgImage() {
  return renderOgImage(marketingCard());
}
