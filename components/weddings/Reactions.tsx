"use client";

import { useEffect, useRef, useState } from "react";

const BURSTS = ["❤", "✿", "✦"] as const;

/**
 * Reactions — floating guest reactions (hearts / flowers / sparkles).
 * Pure client delight: animated burst, no backend, no counts.
 * Keyboard + screen-reader friendly via live region.
 */
export default function Reactions({ accent }: { accent: string }) {
  const [pops, setPops] = useState<Array<{ id: number; glyph: string; x: number }>>([]);
  const [said, setSaid] = useState(false);
  const id = useRef(0);
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (!pops.length) return;
    const t = window.setTimeout(() => setPops([]), reduced ? 50 : 1400);
    return () => window.clearTimeout(t);
  }, [pops, reduced]);

  const send = (glyph: string) => {
    id.current += 1;
    setPops((p) => [...p.slice(-11), { id: id.current, glyph, x: 30 + Math.random() * 40 }]);
    setSaid(true);
  };

  return (
    <div className="text-center">
      <div aria-hidden="true" className="relative mx-auto h-16 max-w-xs overflow-visible">
        {pops.map((p) => (
          <span
            key={p.id}
            className={reduced ? "" : "wi-react-pop"}
            style={{ left: `${p.x}%`, color: accent, position: "absolute", bottom: 0, fontSize: 22 }}
          >
            {p.glyph}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-center gap-3" role="group" aria-label="Send a reaction">
        {BURSTS.map((g) => (
          <button
            key={g}
            onClick={() => send(g)}
            aria-label={`Send ${g === "❤" ? "love" : g === "✿" ? "flowers" : "blessings"}`}
            className="wi-action-lift inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-xl shadow-[inset_0_0_0_0.75px_rgba(0,0,0,0.12)]"
          >
            <span aria-hidden="true">{g}</span>
          </button>
        ))}
      </div>
      <p role="status" className="mt-3 min-h-[1.25rem] text-xs uppercase tracking-[0.22em] opacity-70">
        {said ? "Thanks for the love" : "Tap to shower love"}
      </p>
    </div>
  );
}
