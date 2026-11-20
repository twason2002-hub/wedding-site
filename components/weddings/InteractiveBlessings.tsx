"use client";

import { useState } from "react";

/**
 * InteractiveBlessings — guests tap a diya, flower or heart to reveal a
 * blessing message. Gentle Motion-free CSS pop; reduced-motion shows text.
 */
const ICONS = [
  { key: "diya", label: "Light a diya", glyph: "🪔", fallback: "Diya" },
  { key: "flower", label: "Offer flowers", glyph: "✿", fallback: "Flower" },
  { key: "heart", label: "Send love", glyph: "❤", fallback: "Heart" },
] as const;

export default function InteractiveBlessings({
  blessings,
  accent,
  ink,
}: {
  blessings: [string, string, string];
  accent: string;
  ink: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-xl text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.3em]" style={{ color: accent }}>
        Tap to reveal a blessing
      </p>
      <div className="mt-4 flex items-center justify-center gap-4" role="group" aria-label="Reveal a blessing">
        {ICONS.map((icon, i) => (
          <button
            key={icon.key}
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            aria-label={`${icon.label} — reveal blessing ${i + 1}`}
            className="wi-action-lift inline-flex h-16 w-16 items-center justify-center rounded-full text-2xl shadow-lg transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
            style={{ background: "rgba(255,255,255,0.75)", boxShadow: `inset 0 0 0 0.75px ${accent}66, 0 12px 28px -12px rgba(0,0,0,0.3)` }}
          >
            <span aria-hidden="true">{icon.glyph}</span>
            <span className="sr-only">{icon.fallback}</span>
          </button>
        ))}
      </div>
      <div aria-live="polite" className="mt-4 min-h-[3.5rem]">
        {open !== null && (
          <p key={open} className="wi-bless-reveal font-display-luxury mx-auto max-w-md text-xl italic leading-relaxed" style={{ color: ink }}>
            “{blessings[open]}”
          </p>
        )}
      </div>
    </div>
  );
}
