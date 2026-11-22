"use client";

import { useEffect, useRef, useState } from "react";
import type { EnvelopeTheme } from "@/lib/weddings/template-experience";

/**
 * EnvelopeReveal — sealed shagun envelope → wax seal breaks → flap opens →
 * wedding card rises out → overlay dismisses into the site.
 *
 * Themed per template via `theme` (paper/trim/seal/petals/glow).
 * Motion (Animate UI path C, subtle): token curves as CSS —
 * ease.out `cubic-bezier(0.23,1,0.32,1)` entrances, ease.inOut flap travel,
 * press `scale(0.97)`. Compositor-only transform/opacity.
 */
export default function EnvelopeReveal({
  names,
  blessing,
  subtitle,
  theme,
  timing,
  onDone,
}: {
  names: string;
  blessing?: string;
  subtitle?: string;
  theme: EnvelopeTheme;
  timing: { open: number; reveal: number };
  onDone: () => void;
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

  const phaseClass =
    phase === "revealed" ? "wi-env-revealed" : phase === "opening" ? "wi-env-open" : "";

  const petalColor = theme.petals === "marigold" ? "#e8a020" : "#d98a9c";

  return (
    <div
      className={`wi-env-tap relative z-10 mx-6 flex w-full max-w-[min(92vw,28rem)] cursor-pointer flex-col items-center outline-none ${phaseClass}`}
      onClick={start}
      role="button"
      aria-label="Open the wedding envelope"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          start();
        }
      }}
    >
      <p
        className="font-regal mb-5 text-xs uppercase tracking-[0.28em] sm:text-sm"
        style={{ color: "#e8cf8f" }}
      >
        {phase === "sealed" ? "Tap the envelope to open" : "॥ शुभ विवाह ॥"}
      </p>

      <div className="wi-env-scene relative w-full" style={{ aspectRatio: "5 / 6.4" }}>
        {theme.glow && <div className="wi-env-glow absolute inset-0" aria-hidden="true" />}
        {/* Back panel */}
        <div
          className="wi-env-back absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(160deg, ${theme.bodyHi} 0%, ${theme.bodyLo} 100%)`,
            boxShadow: `inset 0 0 0 0.75px ${theme.trim}66, 0 35px 90px rgba(0,0,0,0.8)`,
          }}
          aria-hidden="true"
        />

        {/* The wedding card — rises out of the pocket */}
        <div
          className="wi-env-card absolute inset-x-5 top-5 bottom-8 rounded-xl px-6 py-7 text-center sm:inset-x-6 sm:px-9 sm:py-9"
          style={{
            background: `linear-gradient(175deg, ${theme.cardHi} 0%, ${theme.cardLo} 100%)`,
            boxShadow: `inset 0 0 0 0.75px ${theme.trim}, 0 18px 50px rgba(0,0,0,0.45)`,
          }}
        >
          <p
            className="font-regal text-[11px] uppercase tracking-[0.28em] sm:text-xs"
            style={{ color: theme.cardAccent }}
          >
            {blessing ?? "॥ श्री गणेशाय नमः ॥"}
          </p>
          <p
            className="mt-3 font-script-luxury leading-tight sm:mt-4"
            style={{ color: theme.cardInk, fontSize: "clamp(1.5rem, 5vw, 1.875rem)" }}
          >
            {names}
          </p>
          {subtitle && (
            <p
              className="mt-2 font-regal text-xs uppercase tracking-[0.22em]"
              style={{ color: theme.cardAccent }}
            >
              {subtitle}
            </p>
          )}
          <div className="mx-auto my-4 h-[0.75px] w-16 bg-gradient-to-r from-transparent via-[#b98a2f] to-transparent" />
          <div
            className="mx-auto mb-1 h-8 w-8 opacity-80"
            style={{ color: theme.cardAccent }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M16 4 C11 12, 9 19, 16 26 C23 19, 21 12, 16 4 Z" />
              <path d="M16 12 L16 22 M11 16 L21 16" strokeWidth="1" />
            </svg>
          </div>
          <p
            className="font-regal text-xs uppercase tracking-[0.28em]"
            style={{ color: theme.cardAccent }}
          >
            You are cordially invited
          </p>
        </div>

        {/* Front pocket */}
        <div
          className="wi-env-pocket absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(to bottom right, transparent 49.4%, ${theme.trim}38 49.8%, transparent 50.4%), linear-gradient(to bottom left, transparent 49.4%, ${theme.trim}38 49.8%, transparent 50.4%), linear-gradient(170deg, ${theme.pocketHi} 0%, ${theme.pocketLo} 100%)`,
            boxShadow: `inset 0 0 0 0.75px ${theme.trim}88, 0 -8px 24px rgba(60,20,5,0.25)`,
          }}
          aria-hidden="true"
        >
          <span
            className="absolute inset-x-0 bottom-5 text-center font-regal text-[10px] uppercase tracking-[0.4em]"
            style={{ color: theme.trim }}
          >
            ✦ ✦ ✦
          </span>
        </div>

        {/* Top flap */}
        <div
          className="wi-env-flap absolute inset-x-0 top-0"
          style={{
            background: `linear-gradient(180deg, ${theme.flapHi} 0%, ${theme.flapLo} 100%)`,
            filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.35))",
          }}
          aria-hidden="true"
        />

        {/* Wax seal + ribbon tails */}
        <div className="wi-env-sealwrap absolute inset-x-0 top-[30%] flex justify-center" aria-hidden="true">
          <span className="flex flex-col items-center">
            <span
              className="wi-env-seal font-regal flex h-16 w-16 items-center justify-center rounded-full text-lg sm:h-20 sm:w-20 sm:text-xl"
              style={{
                background: `radial-gradient(circle at 35% 30%, ${theme.sealHi} 0%, ${theme.sealLo} 70%)`,
                color: theme.sealInk,
                boxShadow: `inset 0 0 0 2px ${theme.sealInk}55, inset 0 2px 6px rgba(255,255,255,0.25), 0 10px 24px rgba(0,0,0,0.5)`,
              }}
            >
              {initials}
            </span>
            <span className="flex gap-1.5" style={{ marginTop: -4 }}>
              {[0, 1].map((k) => (
                <span
                  key={k}
                  className="block h-6 w-3"
                  style={{
                    background: theme.trim,
                    opacity: 0.9,
                    transform: k === 0 ? "rotate(8deg)" : "rotate(-8deg)",
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)",
                  }}
                />
              ))}
            </span>
          </span>
        </div>

        {/* Ambient petal fall (royal marigold / rose) */}
        {theme.petals &&
          [
            { left: "8%", delay: "0s", dur: "6s" },
            { left: "22%", delay: "1.1s", dur: "7.5s" },
            { left: "38%", delay: "0.4s", dur: "6.4s" },
            { left: "55%", delay: "1.6s", dur: "7s" },
            { left: "70%", delay: "0.8s", dur: "6.8s" },
            { left: "86%", delay: "1.9s", dur: "7.4s" },
          ].map((p, i) => (
            <svg
              key={i}
              className="wi-petal wi-petal-once pointer-events-none absolute top-0 h-5 w-5"
              style={{ left: p.left, color: petalColor, ["--delay" as string]: p.delay, ["--dur" as string]: p.dur }}
              viewBox="0 0 32 32"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M16 2C10 8 6 15 10 23C13 28 19 28 22 23C26 15 22 8 16 2Z" />
            </svg>
          ))}
      </div>

      <p className="mt-5 text-xs uppercase tracking-[0.22em] text-[#f3e5c3]/85">
        {phase === "sealed" ? "Or scroll · Esc to enter" : "Opening…"}
      </p>
    </div>
  );
}
