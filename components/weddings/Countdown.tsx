"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./effects/gsap-setup";
import { useDelight } from "./motion";

type Units = { d: number; h: number; m: number; s: number; over: boolean; thanked: boolean };

export default function Countdown({
  target,
  dark = false,
  variant,
  label,
}: {
  target: string;
  dark?: boolean;
  variant?: "royal" | "floral" | "minimal" | "vivah" | "coastal";
  label?: string;
}) {
  const [t, setT] = useState<Units>({ d: 0, h: 0, m: 0, s: 0, over: false, thanked: false });
  const [flipKey, setFlipKey] = useState<string | null>(null);
  const tickOn = useDelight().countdownTick;
  const prev = useRef<Pick<Units, "d" | "h" | "m" | "s"> | null>(null);

  useEffect(() => {
    const end = new Date(target).getTime();
    const tick = () => {
      const dist = end - Date.now();
      if (dist <= 0) {
        setT({ d: 0, h: 0, m: 0, s: 0, over: true, thanked: dist < -86400000 });
        prev.current = { d: 0, h: 0, m: 0, s: 0 };
        return;
      }
      const next = {
        d: Math.floor(dist / 86400000),
        h: Math.floor((dist % 86400000) / 3600000),
        m: Math.floor((dist % 3600000) / 60000),
        s: Math.floor((dist % 60000) / 1000),
        over: false,
        thanked: false,
      };
      const p = prev.current;
      if (p && !prefersReducedMotion()) {
        if (next.s !== p.s) setFlipKey(`s-${next.s}`);
        else if (next.m !== p.m) setFlipKey(`m-${next.m}`);
        else if (next.h !== p.h) setFlipKey(`h-${next.h}`);
        else if (next.d !== p.d) setFlipKey(`d-${next.d}`);
      }
      prev.current = { d: next.d, h: next.h, m: next.m, s: next.s };
      setT(next);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const pad = (n: number) => String(n).padStart(2, "0");

  const prettyDate = (() => {
    const d = new Date(target);
    if (Number.isNaN(d.getTime())) return null;
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  })();
  const eyebrow = `COUNTING DOWN TO${label ? ` · ${label}` : prettyDate ? ` · ${prettyDate}` : ""}`;

  if (t.over) {
    return (
      <p className="font-display-luxury text-center text-2xl italic" suppressHydrationWarning>
        {t.thanked ? "Thank you for celebrating with us ✦" : "The celebration has arrived ✦"}
      </p>
    );
  }

  const units = [
    ["d", t.d, "Days"],
    ["h", pad(t.h), "Hours"],
    ["m", pad(t.m), "Minutes"],
    ["s", pad(t.s), "Seconds"],
  ] as const;

  const digitClass = (id: string, extra: string) => {
    const flip = tickOn && flipKey?.startsWith(`${id}-`) ? " wi-digit-tick" : "";
    return `${extra}${flip}`;
  };

  if (variant === "minimal") {
    return (
      <>
        <p className="mb-6 text-center text-[11px] font-medium uppercase tracking-[0.32em] text-[#7c7267]">
          {eyebrow}
        </p>
        <div
          className="grid grid-cols-2 sm:grid-cols-4 border-y border-[#171513]/12 divide-y sm:divide-y-0 sm:divide-x divide-[#171513]/12"
          role="timer"
          aria-label="Wedding countdown"
        >
          {units.map(([id, v, l]) => (
            <div key={l} className="py-8 px-6 text-center">
              <span
                key={`${l}-${v}`}
                suppressHydrationWarning
                className={digitClass(
                  id,
                  "font-display-luxury block text-5xl sm:text-6xl font-light tabular-nums tracking-tight text-[#171513]"
                )}
              >
                {v}
              </span>
              <span className="mt-2 block text-[11px] uppercase tracking-[0.32em] text-[#7c7267]">{l}</span>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (variant === "floral") {
    return (
      <>
        <p className="wi-soft mb-6 text-center text-[11px] font-medium uppercase tracking-[0.32em]">
          {eyebrow}
        </p>
        <div className="mx-auto grid max-w-2xl grid-cols-2 sm:grid-cols-4 gap-4" role="timer" aria-label="Wedding countdown">
          {units.map(([id, v, l]) => (
            <div
              key={l}
              className="rounded-[2rem] bg-white/95 px-4 py-6 text-center"
            >
              <span
                key={`${l}-${v}`}
                suppressHydrationWarning
                className={digitClass(
                  id,
                  "font-display-luxury block text-4xl sm:text-5xl italic text-[#4a252a] tabular-nums"
                )}
              >
                {v}
              </span>
              <span className="wi-soft mt-1.5 block text-[11px] uppercase tracking-[0.28em]">{l}</span>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (variant === "royal" || variant === "vivah" || dark) {
    return (
      <>
        <p className="wi-soft mb-6 text-center text-[11px] font-medium uppercase tracking-[0.32em]">
          {eyebrow}
        </p>
        <div className="mx-auto grid max-w-2xl grid-cols-2 sm:grid-cols-4 gap-4" role="timer" aria-label="Wedding countdown">
          {units.map(([id, v, l]) => (
            <div
              key={l}
              className="rounded-2xl px-4 py-6 text-center"
            >
              <span
                key={`${l}-${v}`}
                suppressHydrationWarning
                className={digitClass(
                  id,
                  "font-regal wi-gold-shimmer block text-4xl sm:text-5xl font-medium tabular-nums"
                )}
              >
                {v}
              </span>
              <span className="wi-soft mt-2 block text-[11px] uppercase tracking-[0.32em]">{l}</span>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <p className="wi-soft mb-6 text-center text-[11px] font-medium uppercase tracking-[0.32em]">
        {eyebrow}
      </p>
      <div className="mx-auto grid max-w-2xl grid-cols-2 sm:grid-cols-4 gap-4" role="timer" aria-label="Wedding countdown">
        {units.map(([id, v, l]) => (
          <div
            key={l}
            className="rounded-2xl bg-white px-4 py-6 text-center"
          >
            <span
              key={`${l}-${v}`}
              suppressHydrationWarning
              className={digitClass(
                id,
                "font-display-luxury block text-4xl sm:text-5xl font-medium tabular-nums text-[#0f353e]"
              )}
            >
              {v}
            </span>
            <span className="wi-soft mt-1.5 block text-[11px] uppercase tracking-[0.28em]">{l}</span>
          </div>
        ))}
      </div>
    </>
  );
}