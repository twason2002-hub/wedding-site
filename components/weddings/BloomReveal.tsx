"use client";

import { useEffect, useRef, useState } from "react";
import { OpeningBalloons } from "./OpeningDecor";

/**
 * BloomReveal — floral bud → petals open → card slides out (floral-romance).
 * Pastel blush/rose/ivory. ease.out entrances, ease.inOut petal travel.
 */
export default function BloomReveal({
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

  const initials = names
    .split(/[&—]|weds/i)
    .map((part) => part.trim()[0])
    .filter(Boolean)
    .join(" · ");

  const phaseClass = phase === "revealed" ? "wi-bl-revealed" : phase === "opening" ? "wi-bl-open" : "";

  return (
    <div
      className={`relative z-10 mx-6 flex w-full max-w-[340px] cursor-pointer flex-col items-center outline-none ${phaseClass}`}
      onClick={start}
      role="button"
      aria-label="Bloom the floral invitation"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          start();
        }
      }}
    >
      <p className="font-body-luxury mb-5 text-[11px] uppercase tracking-[0.34em] text-[#b36a7a]">
        {phase === "sealed" ? "Tap to bloom" : "Together in full blossom"}
      </p>

      <div className="wi-bl-scene relative flex w-full items-center justify-center" style={{ aspectRatio: "5 / 6" }}>
        <OpeningBalloons />
        {/* Bud rings */}
        <svg className="wi-bl-ring wi-bl-ring-a absolute h-64 w-64 text-[#d98a9c]" viewBox="0 0 200 200" fill="none" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
            <ellipse key={k} cx="100" cy="52" rx="22" ry="44" transform={`rotate(${k * 45} 100 100)`} stroke="currentColor" strokeWidth="1.4" opacity="0.75" />
          ))}
        </svg>
        <svg className="wi-bl-ring wi-bl-ring-b absolute h-44 w-44 text-[#e8a0b0]" viewBox="0 0 200 200" fill="none" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <ellipse key={k} cx="100" cy="58" rx="24" ry="40" transform={`rotate(${k * 60} 100 100)`} stroke="currentColor" strokeWidth="1.4" opacity="0.8" />
          ))}
        </svg>

        {/* Card rises as the bud opens */}
        <div className="wi-bl-card absolute inset-x-6 top-8 bottom-8 rounded-[2rem] bg-white/95 px-6 py-7 text-center shadow-[0_30px_80px_-20px_rgba(160,80,100,0.35),inset_0_0_0_0.75px_rgba(217,138,156,0.5)]">
          <span className="font-display-luxury block text-4xl italic text-[#d98a9c]/70" aria-hidden="true">
            {initials}
          </span>
          <p className="font-body-luxury mt-1 text-[10px] uppercase tracking-[0.32em] text-[#b36a7a]">
            {blessing ?? "Together with their families"}
          </p>
          <p className="font-script-luxury mt-2 text-3xl leading-tight text-[#c87d8a]">The Wedding of</p>
          <h2 className="font-display-luxury wi-couple-heading mt-1 text-3xl font-normal italic text-[#4a252a]">{names}</h2>
          {subtitle && <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-[#7a5a5e]">{subtitle}</p>}
          <span className="wi-seal-cta mt-4 inline-flex items-center gap-2 rounded-full bg-[#fdf5f2] px-5 py-2 text-[10px] font-medium uppercase tracking-[0.24em] text-[#7a424c] shadow-[inset_0_0_0_0.75px_rgba(217,138,156,0.5)]">
            Enter celebration ✦
          </span>
        </div>

        {/* Drifting petals on bloom */}
        {phase !== "sealed" &&
          [
            { left: "10%", delay: "0s", dur: "5s" },
            { left: "30%", delay: "0.7s", dur: "6s" },
            { left: "52%", delay: "0.3s", dur: "5.4s" },
            { left: "72%", delay: "1s", dur: "6.2s" },
            { left: "88%", delay: "0.5s", dur: "5.6s" },
          ].map((p, i) => (
            <svg
              key={i}
              className="wi-petal wi-petal-once pointer-events-none absolute top-0 h-6 w-6 text-[#d98a9c]/60"
              style={{ left: p.left, ["--delay" as string]: p.delay, ["--dur" as string]: p.dur }}
              viewBox="0 0 32 32"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M16 2C10 8 6 15 10 23C13 28 19 28 22 23C26 15 22 8 16 2Z" />
            </svg>
          ))}
      </div>

      <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-[#b36a7a]/70">
        {phase === "sealed" ? "Tap the bud" : "Blooming…"}
      </p>
    </div>
  );
}
