"use client";

import { useEffect, useState } from "react";
import type { WeddingData } from "@/lib/weddings/types";
import { mapsUrl } from "@/lib/weddings/helpers";
import { experienceFor } from "@/lib/weddings/template-experience";
import { CalendarIcon, MapPinIcon } from "./WeddingIcons";

const JUMPS: { label: string; selector: string }[] = [
  { label: "Events", selector: 'section[aria-label="Events"], section[aria-label="Itinerary"]' },
  { label: "Gallery", selector: 'section[aria-label="Gallery"]' },
  { label: "Venue", selector: 'section[aria-label="Venue"], section[aria-label="Travel and stay"]' },
  { label: "RSVP", selector: 'section[aria-label="RSVP"]' },
];

/**
 * Guest navigation: desktop section rail + mobile RSVP / map / jump menu.
 */
export default function QuickActions({ wedding }: { wedding: WeddingData }) {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const accent = experienceFor(wedding.templateSlug).palette.accent;
  const hasRsvp = wedding.sections?.rsvp !== false;
  const mapQuery = wedding.venue?.mapQuery;

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.45);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const jump = (selector: string) => {
    document.querySelector(selector)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
    setOpen(false);
  };

  return (
    <>
      <nav
        aria-label="Invitation sections"
        className={`fixed right-4 top-1/2 z-[60] hidden -translate-y-1/2 flex-col gap-2 transition-opacity md:flex ${
          show ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {JUMPS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => jump(item.selector)}
            className="rounded-full bg-black/55 px-3 py-2 text-left text-xs uppercase tracking-[0.16em] text-white shadow-lg backdrop-blur-md"
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div
        className={`fixed inset-x-4 bottom-4 z-[60] transition-all duration-300 sm:hidden ${
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        {open && (
          <div className="mb-2 rounded-2xl bg-[#14100c]/95 p-2 text-white shadow-2xl backdrop-blur-md">
            {JUMPS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => jump(item.selector)}
                className="block min-h-11 w-full rounded-xl px-4 text-left text-sm tracking-wide"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
        <div
          className="mr-16 flex w-full items-center gap-2 rounded-full bg-[#14100c]/92 p-2 text-white shadow-2xl backdrop-blur-md"
          style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
        >
          {hasRsvp && (
            <button
              onClick={() => jump('section[aria-label="RSVP"]')}
              tabIndex={show ? 0 : -1}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-4 text-xs font-bold uppercase tracking-[0.16em] text-[#140806]"
              style={{ background: accent }}
            >
              <CalendarIcon size={15} />
              <span>RSVP</span>
            </button>
          )}
          {mapQuery && (
            <a
              href={mapsUrl(mapQuery)}
              target="_blank"
              rel="noreferrer"
              tabIndex={show ? 0 : -1}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-white/12 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-[inset_0_0_0_0.75px_rgba(255,255,255,0.3)]"
            >
              <MapPinIcon size={15} />
              <span>Map</span>
            </a>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex min-h-12 items-center justify-center rounded-full px-4 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-[inset_0_0_0_0.75px_rgba(255,255,255,0.3)]"
          >
            {open ? "Close" : "Jump"}
          </button>
        </div>
      </div>
    </>
  );
}