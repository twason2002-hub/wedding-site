import type { Metadata } from "next";
// Self-hosted fonts (@fontsource) — no next/font, so Turbopack AND webpack
// builds work. Variables are defined in globals.css (:root).
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/400-italic.css";
import "@fontsource/playfair-display/500-italic.css";
import "@fontsource/playfair-display/600-italic.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/cormorant-garamond/300-italic.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/cormorant-garamond/600-italic.css";
import "@fontsource/cinzel/400.css";
import "@fontsource/cinzel/500.css";
import "@fontsource/cinzel/600.css";
import "@fontsource/cinzel/700.css";
import "@fontsource/plus-jakarta-sans/300.css";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/great-vibes/400.css";
import "@fontsource/noto-serif-devanagari/400.css";
import "@fontsource/noto-serif-devanagari/500.css";
import "@fontsource/noto-serif-devanagari/600.css";
import "@fontsource/noto-serif-gurmukhi/400.css";
import "@fontsource/noto-serif-gurmukhi/500.css";
import "@fontsource/noto-serif-gurmukhi/600.css";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tushar & Babitta | Wedding Invitation",
  description: "You're cordially invited to join us on a day of love and celebration as we tie the knot on 15th Feb! 🥳💕 It would mean the world to us if you could be there to share in the joy, laughter, and happily-ever-after vibes 😊. Looking forward to seeing you there! 🎉",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/images/back-5.jpg',
  },
  openGraph: {
    title: "Tushar & Babitta | Wedding Invitation",
    description: "You're cordially invited to join us on a day of love and celebration as we tie the knot on 15th Feb! 🥳💕 It would mean the world to us if you could be there to share in the joy, laughter, and happily-ever-after vibes 😊. Looking forward to seeing you there! 🎉",
    images: ['/weddings/hero-evening.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Tushar & Babitta | Wedding Invitation",
    description: "You're cordially invited to join us on a day of love and celebration as we tie the knot on 15th Feb! 🥳💕 It would mean the world to us if you could be there to share in the joy, laughter, and happily-ever-after vibes 😊. Looking forward to seeing you there! 🎉",
    images: ['/weddings/hero-evening.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
