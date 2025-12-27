import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

export const metadata: Metadata = {
  title: "Tushar & Babitta | Wedding Invitation",
  description: "You're cordially invited to join us on a day of love and celebration as we tie the knot on 15th Feb! 🥳💕 It would mean the world to us if you could be there to share in the joy, laughter, and happily-ever-after vibes 😊. Looking forward to seeing you there! 🎉",
  icons: {
    icon: '/images/back-5.jpg',
  },
  openGraph: {
    title: "Tushar & Babitta | Wedding Invitation",
    description: "You're cordially invited to join us on a day of love and celebration as we tie the knot on 15th Feb! 🥳💕 It would mean the world to us if you could be there to share in the joy, laughter, and happily-ever-after vibes 😊. Looking forward to seeing you there! 🎉",
    images: ['/images/back-5.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Tushar & Babitta | Wedding Invitation",
    description: "You're cordially invited to join us on a day of love and celebration as we tie the knot on 15th Feb! 🥳💕 It would mean the world to us if you could be there to share in the joy, laughter, and happily-ever-after vibes 😊. Looking forward to seeing you there! 🎉",
    images: ['/images/back-5.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfairDisplay.variable} ${montserrat.variable}`}>
        {children}
      </body>
    </html>
  );
}
