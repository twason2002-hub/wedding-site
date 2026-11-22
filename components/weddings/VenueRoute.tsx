"use client";

import SvgDraw from "./effects/SvgDraw";

/**
 * VenueRoute — animated dotted route from guest to venue + directions link.
 * Decorative path draws on scroll; the link does the real navigation.
 */
export default function VenueRoute({
  mapQuery,
  accent,
}: {
  mapQuery: string;
  accent: string;
  dark?: boolean;
}) {
  const mapsUrl = `https://maps.google.com/?q=${mapQuery}`;
  return (
    <div className="mx-auto mt-6 max-w-md text-center">
      <SvgDraw duration={0.55} stagger={0.04}>
        <svg viewBox="0 0 300 60" fill="none" className="mx-auto h-14 w-full max-w-[280px]" aria-hidden="true">
          <path d="M14 44 C70 40, 90 18, 150 22 S250 30, 286 16" stroke={accent} strokeWidth="1.6" strokeDasharray="1 6" strokeLinecap="round" />
          <circle cx="14" cy="44" r="5" stroke={accent} strokeWidth="1.6" fill="none" />
          <circle cx="14" cy="44" r="1.8" fill={accent} />
          <path d="M286 8 c-5 0 -8 3.5 -8 7 0 5.5 8 13 8 13 s8 -7.5 8 -13 c0 -3.5 -3 -7 -8 -7z M286 15 a2.6 2.6 0 1 0 0.1 0z" fill={accent} />
        </svg>
      </SvgDraw>
      <div className="mt-1 flex items-center justify-center gap-4 text-[11px] font-medium uppercase tracking-[0.22em]" style={{ color: accent }}>
        <span>You</span>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="wi-cta-ghost"
        >
          Open route ↗
        </a>
        <span>Venue</span>
      </div>
    </div>
  );
}
