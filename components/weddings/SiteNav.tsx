"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/weddings/site-config";

const LINKS = [
  { href: "/wedding-invitations", label: "Home" },
  { href: "/wedding-invitations#designs", label: "Our Designs" },
  { href: "/wedding-invitations#offer", label: "Features" },
  { href: "/wedding-invitations#how", label: "How It Works" },
  { href: "/wedding-invitations#about", label: "About Us" },
  { href: "/wedding-invitations#contact", label: "WhatsApp" },
];

/** Inviteo Navigation: Royal Sapphire Blue & Gold with clean Indian wedding feel. */
export default function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      aria-label="Inviteo wedding invitations navigation"
      className="sticky top-0 z-[80] border-b border-[#d4af37]/20 bg-[#0b192c]/95 text-[#f8f5ee] backdrop-blur-xl"
    >
      <div className="wi-wrap flex items-center justify-between py-4">
        <Link
          href="/wedding-invitations"
          className="inline-flex min-h-[44px] items-center gap-2 font-display-luxury text-2xl sm:text-3xl font-medium tracking-tight text-white"
        >
          <span>{SITE_CONFIG.brandName.slice(0, 6)}</span>
          <span className="-ml-2 italic text-[#d4af37]">{SITE_CONFIG.brandName.slice(6)}</span>
          <span className="hidden sm:inline-block ml-2 rounded-full bg-[#d4af37]/15 px-3 py-0.5 font-body-luxury text-[11px] uppercase tracking-[0.28em] text-[#e8cf8f] shadow-[inset_0_0_0_0.75px_rgba(212,175,55,0.45)]">
            Indian Wedding Invites
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {LINKS.slice(1).map((l) => (
            <Link key={l.label} href={l.href} className="wi-navlink text-[#e2e8f0] hover:text-white">
              {l.label}
            </Link>
          ))}
          <Link
            href="/wedding-invitations/templates"
            className="wi-btn wi-btn--gold"
            style={{ minHeight: 44, padding: "0.6rem 1.3rem", fontSize: "0.84rem" }}
          >
            <span>See All 5 Designs</span>
            <span className="wi-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>

        <button
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.25em] text-[#f8f5ee] shadow-[inset_0_0_0_0.75px_rgba(212,175,55,0.45)] lg:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? "✕ Close" : "☰ Menu"}
        </button>
      </div>

      {open && (
        <div className="wi-menu border-t border-[#d4af37]/20 bg-[#0b192c] px-6 py-6 text-white lg:hidden">
          <div className="space-y-1">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-3 font-display-luxury text-2xl text-[#f8f5ee]"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <Link
            href="/wedding-invitations/templates"
            onClick={() => setOpen(false)}
            className="wi-btn wi-btn--gold mt-5 w-full justify-center"
          >
            <span>See All 5 Designs</span>
            <span className="wi-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      )}
    </nav>
  );
}
