import { legacyCoupleMetadata } from "@/lib/weddings/og";

export const metadata = legacyCoupleMetadata({
  bride: "Babitta",
  groom: "Tushar",
  dateDisplay: "15th February 2026",
  countdown: "February 15, 2026 00:00:00",
  city: "New Delhi & Jalandhar",
  path: "/tushar-babitta",
});

export default function TusharBabittaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
