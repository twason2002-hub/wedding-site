"use client";

import { useEffect, useState } from "react";
import type { WeddingData } from "@/lib/weddings/types";
import { mapsUrl } from "@/lib/weddings/helpers";
import { CalendarIcon, MapPinIcon } from "./WeddingIcons";

/**
 * QuickActions — mobile guest pill: RSVP + Venue Map.
 * Appears after the hero so elders always have the two key actions
 * without hunting through the page. Desktop keeps the inline buttons.
 */
export default function QuickActions({ wedding }: { wedding: WeddingData }) {
  const [show, setShow] = useState(false);
  const hasRsvp = wedding.sections?.rsvp !== false;
  const mapQuery = wedding.venue?.mapQuery;

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!hasRsvp && !mapQuery) return null;

  const goRsvp = () => {
    document
      .querySelector('section[aria-label="RSVP"]')
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className={`fixed inset-x-4 bottom-4 z-[60] flex transition-all duration-300 sm:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div
        className="mr-16 flex w-full items-center gap-2 rounded-full bg-[#14100c]/92 p-2 text-white shadow-2xl backdrop-blur-md"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        {hasRsvp && (
          <button
            onClick={goRsvp}
            tabIndex={show ? 0 : -1}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-[#d4af37] px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#140806]"
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
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-white/12 px-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-[inset_0_0_0_0.75px_rgba(255,255,255,0.3)]"
          >
            <MapPinIcon size={15} />
            <span>Venue Map</span>
          </a>
        )}
      </div>
    </div>
  );
}
