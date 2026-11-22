"use client";

import { useEffect, useRef, useState } from "react";
import { OpeningClouds } from "./OpeningDecor";

/**
 * PostcardReveal — travel postcard flips to its message side as the sun sets
 * (destination-wedding). Sea/sand/terracotta, stamp + postmark, title reveal.
 */
export default function PostcardReveal({
  names,
  blessing,
  subtitle,
  onDone,
  timing,
}: {
  names: string;
  blessing?: string;
  subtitle?: string;
  onDone: () => void;
  timing: { open: number; reveal: number };
}) {
  const [phase, setPhase] = useState<"sealed" | "opening" | "revealed">("sealed");
  const timers = useRef<number[]>([]);
  const started = useRef(false);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const start = () => {
    if (started.current) {
      onDone();
      return;
    }
    started.current = true;
    setPhase("opening");
    timers.current.push(window.setTimeout(() => setPhase("revealed"), timing.open));
    timers.current.push(window.setTimeout(onDone, timing.reveal));
  };

  const phaseClass = phase === "revealed" ? "wi-pc-revealed" : phase === "opening" ? "wi-pc-open" : "";

  return (
    <div
      className={`relative z-10 mx-6 flex w-full max-w-[340px] cursor-pointer flex-col items-center outline-none ${phaseClass}`}
      onClick={start}
      role="button"
      aria-label="Flip the travel postcard"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          start();
        }
      }}
    >
      <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.34em] text-[#e6b89c]">
        {phase === "sealed" ? "Tap to flip the postcard" : "Wish you were here"}
      </p>

      <div className="wi-pc-scene relative w-full" style={{ aspectRatio: "5 / 6" }}>
        <div className="wi-pc-flip absolute inset-0">
          {/* Front — scenic side */}
          <div className="wi-pc-front absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #f9c86d 0%, #e8835a 34%, #a34a5e 58%, #144652 100%)" }} aria-hidden="true" />
            <OpeningClouds />
            <div className="wi-pc-sun absolute left-1/2 top-[30%] h-16 w-16 rounded-full bg-[#ffe9b0] shadow-[0_0_60px_20px_rgba(255,220,150,0.45)]" aria-hidden="true" />
            <svg className="absolute inset-x-0 bottom-0 h-2/5 w-full" viewBox="0 0 340 140" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 70 Q60 40 120 62 T240 58 T340 70 L340 140 L0 140 Z" fill="#0d2f38" />
              <path d="M0 95 Q70 75 150 92 T340 90 L340 140 L0 140 Z" fill="#082026" />
            </svg>
            {/* Stamp + postmark */}
            <div className="absolute right-4 top-4 h-16 w-13 bg-[#f7f3eb] p-1 shadow-md" style={{ width: 52 }} aria-hidden="true">
              <div className="flex h-full w-full items-center justify-center bg-[#e8835a] font-display-luxury text-2xl italic text-white">✦</div>
            </div>
            <div className="absolute right-2 top-12 flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/60 text-center text-[8px] font-semibold uppercase tracking-[0.2em] text-white/90" style={{ transform: "rotate(-12deg)" }} aria-hidden="true">
              Bon voyage
            </div>
            <p className="wi-couple-heading absolute inset-x-0 bottom-6 text-center font-display-luxury text-3xl italic text-white drop-shadow-md">
              {names}
            </p>
          </div>
          {/* Back — message side */}
          <div className="wi-pc-back absolute inset-0 rounded-2xl bg-[#f7f3eb] px-7 py-8 text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-[#b86b43]">
              {blessing ?? "Two souls · One journey"}
            </p>
            <h2 className="font-display-luxury wi-couple-heading mt-3 text-4xl font-normal italic text-[#0f353e]">{names}</h2>
            {subtitle && <p className="mt-2 text-[11px] uppercase tracking-[0.26em] text-[#0f353e]/70">{subtitle}</p>}
            <div className="mx-auto my-5 h-[0.75px] w-20 bg-gradient-to-r from-transparent via-[#b86b43] to-transparent" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-[#0f353e]/80">Pack your joy — the celebration awaits by the sea.</p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0f353e] px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white">
              Tap to explore →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
