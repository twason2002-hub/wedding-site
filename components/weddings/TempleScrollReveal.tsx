"use client";

import { useEffect, useRef, useState } from "react";
import { OpeningDiyas } from "./OpeningDecor";

/**
 * TempleScrollReveal — temple gate + mandala + diya lighting → sacred scroll
 * unrolls with the couple's names (traditional-vivah). Sindoor red + gold.
 * Paper reveals via clip-path (no stretch, no distortion).
 */
export default function TempleScrollReveal({
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

  const phaseClass = phase === "revealed" ? "wi-sc-revealed" : phase === "opening" ? "wi-sc-open" : "";

  return (
    <div
      className={`relative z-10 mx-6 flex w-full max-w-[340px] cursor-pointer flex-col items-center outline-none ${phaseClass}`}
      onClick={start}
      role="button"
      aria-label="Light the diya and unroll the scroll"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          start();
        }
      }}
    >
      <p className="font-regal mb-5 text-[11px] uppercase tracking-[0.34em] text-[#fde68a]">
        {phase === "sealed" ? "Tap to light the diya" : "॥ शुभ विवाह ॥"}
      </p>

      <div className="wi-sc-scene relative w-full" style={{ aspectRatio: "5 / 6.6" }}>
        <OpeningDiyas flame="#F59E0B" bowl="#D4AF37" />
        {/* Spinning mandala backdrop */}
        <svg className="wi-spin-slow absolute left-1/2 top-6 h-40 w-40 -translate-x-1/2 text-[#f59e0b]/30" viewBox="0 0 200 200" fill="none" aria-hidden="true">
          <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.8" />
          <rect x="52" y="52" width="96" height="96" stroke="currentColor" strokeWidth="0.8" transform="rotate(45 100 100)" />
        </svg>

        {/* Diya */}
        <div className="absolute left-1/2 top-14 -translate-x-1/2" aria-hidden="true">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <path
              className="wi-sc-flame"
              d="M32 6C32 6 24 17 24 23C24 27.4 27.6 31 32 31C36.4 31 40 27.4 40 23C40 17 32 6 32 6Z"
              fill="url(#scFlame)"
            />
            <path d="M12 34C12 44 21 50 32 50C43 50 52 44 52 34H12Z" fill="#D4AF37" stroke="#FDE68A" strokeWidth="1" />
            <defs>
              <linearGradient id="scFlame" x1="32" y1="6" x2="32" y2="31" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FEF08A" />
                <stop offset="0.6" stopColor="#F59E0B" />
                <stop offset="1" stopColor="#DC2626" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Unrolling scroll */}
        <div className="absolute inset-x-4 bottom-4 top-40">
          <div className="wi-sc-rod mx-auto h-2.5 w-[92%] rounded-full bg-gradient-to-r from-[#8a5a1a] via-[#e8c96a] to-[#8a5a1a]" aria-hidden="true" />
          <div className="wi-sc-paper mx-auto w-[92%] overflow-hidden bg-[#fdf3d8] px-6 text-center shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
            <div className="py-7">
              <p className="font-regal text-[9px] uppercase tracking-[0.3em] text-[#a16207]">
                {blessing ?? "॥ श्री गणेशाय नमः ॥"}
              </p>
              <h2 className="font-regal wi-couple-heading mt-3 text-3xl leading-tight text-[#7f1d1d]">{names}</h2>
              {subtitle && <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-[#92400e]">{subtitle}</p>}
              <div className="mx-auto my-4 h-[0.75px] w-16 bg-gradient-to-r from-transparent via-[#b45309] to-transparent" aria-hidden="true" />
              <p className="font-regal text-[9px] uppercase tracking-[0.3em] text-[#a16207]">Tap to enter ✦</p>
            </div>
          </div>
          <div className="wi-sc-rod mx-auto h-2.5 w-[92%] rounded-full bg-gradient-to-r from-[#8a5a1a] via-[#e8c96a] to-[#8a5a1a]" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
