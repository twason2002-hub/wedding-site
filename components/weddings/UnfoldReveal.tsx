"use client";

import { useEffect, useRef, useState } from "react";
import { Particles, ParticlesEffect } from "@animate-ui/react/primitives/effects/particles";

/**
 * UnfoldReveal — folded minimal card → top half unfolds → gold line draws →
 * typography reveals (modern-minimal). Navy/ivory/gold, quiet and exact.
 */
export default function UnfoldReveal({
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

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const start = () => {
    if (phase !== "sealed") {
      onDone();
      return;
    }
    setPhase("opening");
    timers.current.push(window.setTimeout(() => setPhase("revealed"), timing.open));
    timers.current.push(window.setTimeout(onDone, timing.reveal));
  };

  const phaseClass = phase === "revealed" ? "wi-uf-revealed" : phase === "opening" ? "wi-uf-open" : "";

  return (
    <div
      className={`relative z-10 mx-6 flex w-full max-w-[320px] cursor-pointer flex-col items-center outline-none ${phaseClass}`}
      onClick={start}
      role="button"
      aria-label="Unfold the minimal invitation"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          start();
        }
      }}
    >
      <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.34em] text-[#8a6d2b]">
        {phase === "sealed" ? "Tap to unfold" : "Save the date"}
      </p>

      <Particles animate={phase !== "sealed"} className="relative w-full">
        <ParticlesEffect
          side="top"
          align="center"
          count={14}
          radius={70}
          spread={360}
          duration={1}
          aria-hidden="true"
        />
      <div className="wi-uf-scene relative w-full" style={{ aspectRatio: "5 / 6.6" }}>
        {/* Inside of the card — revealed as the cover unfolds */}
        <div className="wi-uf-inside absolute inset-0 rounded-2xl bg-[#f7f3eb] px-7 py-10 text-center shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-[#8a6d2b]">
            {blessing ?? "Together with their families"}
          </p>
          <h2 className="font-display-luxury wi-couple-heading mt-4 text-4xl font-light italic text-[#171513]">{names}</h2>
          {subtitle && (
            <p className="mt-2 text-[11px] uppercase tracking-[0.26em] text-[#57534e]">{subtitle}</p>
          )}
          <div className="wi-uf-line mx-auto mt-6 h-[1px] w-24 bg-[#b98a2f]" aria-hidden="true" />
          <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.28em] text-[#8a6d2b]">
            Tap to enter →
          </p>
        </div>
        {/* Folded cover — unfolds upward */}
        <div className="wi-uf-cover absolute inset-0 rounded-2xl bg-[#10233f] px-7 py-10 text-center shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
          <p className="font-regal mt-16 text-[10px] uppercase tracking-[0.4em] text-[#e8cf8f]">N</p>
          <p className="font-display-luxury mt-3 text-2xl italic text-[#f4efe6]">You are invited</p>
          <div className="mx-auto mt-4 h-[1px] w-12 bg-[#d4af37]/70" aria-hidden="true" />
          <p className="mt-6 text-[10px] uppercase tracking-[0.28em] text-[#f4efe6]/60">Tap to unfold</p>
        </div>
      </div>
      </Particles>
    </div>
  );
}
