import Link from "next/link";
import { marketingMetadata } from "@/lib/weddings/og";

export const metadata = marketingMetadata(
  "Page Not Found | Inviteo",
  "This Inviteo page is not available. Browse Indian wedding invitation templates, open a live preview, or return home to share one link with both families.",
  "/wedding-invitations",
);

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-24 text-[#1c1917]">
      <p className="text-xs uppercase tracking-[0.28em] text-[#8a6d2b]">Inviteo</p>
      <h1 className="mt-3 text-4xl font-normal">This page is not available</h1>
      <p className="mt-4 text-base leading-relaxed text-[#5c5348]">
        The link may be out of date. Browse the wedding invitation templates, or go back to the Inviteo home page.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/wedding-invitations" className="rounded-full bg-[#1c1917] px-5 py-3 text-sm text-white">
          Home
        </Link>
        <Link href="/wedding-invitations/templates" className="rounded-full border border-black/15 px-5 py-3 text-sm">
          Templates
        </Link>
      </div>
    </main>
  );
}
