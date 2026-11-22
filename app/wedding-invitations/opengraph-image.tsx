import { renderOgImage, OG_SIZE } from "@/lib/weddings/og-image";
import { marketingCard } from "@/lib/weddings/og";

export const alt = "Inviteo — Indian wedding invitation websites";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Marketing preview. Public, no auth, image/png, no redirect. */
export default function MarketingOgImage() {
  return renderOgImage(marketingCard());
}
