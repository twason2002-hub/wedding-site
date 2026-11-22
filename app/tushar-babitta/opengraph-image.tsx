import { compactDate } from "@/lib/weddings/og";
import { renderOgImage, OG_SIZE } from "@/lib/weddings/og-image";

export const alt = "Babitta & Tushar are getting married";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function TusharBabittaOgImage() {
  return renderOgImage({
    eyebrow: "You are invited",
    title: "Babitta & Tushar",
    line: "are getting married",
    date: compactDate("15th February 2026", "February 15, 2026 00:00:00"),
    city: "New Delhi & Jalandhar",
    bg: "#140806",
    ink: "#f6ead4",
    accent: "#d4af37",
    surface: "#26100c",
    motif: "royal",
  });
}
