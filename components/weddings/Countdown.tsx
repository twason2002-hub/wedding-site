"use client";

import { useEffect, useState } from "react";

export default function Countdown({
  target,
  dark = false,
  variant,
  label,
}: {
  target: string;
  dark?: boolean;
  variant?: "royal" | "floral" | "minimal" | "vivah" | "coastal";
  /** Override the "COUNTING DOWN TO · {date}" eyebrow (defaults to target date). */
  label?: string;
}) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0, over: false, thanked: false });

  useEffect(() => {
    const end = new Date(target).getTime();
    const tick = () => {
      const dist = end - Date.now();
      if (dist <= 0) {
        // Day-of → celebration message; 24h+ later → thank-you note.
        setT({ d: 0, h: 0, m: 0, s: 0, over: true, thanked: dist < -86400000 });
        return;
      }
      setT({
        d: Math.floor(dist / 86400000),
        h: Math.floor((dist % 86400000) / 3600000),
        m: Math.floor((dist % 3600000) / 60000),
        s: Math.floor((dist % 60000) / 1000),
        over: false,
        thanked: false,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const pad = (n: number) => String(n).padStart(2, "0");

  // Inviteque-study: "COUNTING DOWN TO {date}" eyebrow above the digits.
  // Manual formatting (not toLocaleDateString): server Node ICU and the
  // browser can disagree on locale output, which breaks hydration (#418).
  const prettyDate = (() => {
    const d = new Date(target);
    if (Number.isNaN(d.getTime())) return null;
    const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
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
    [t.d, "Days"],
    [pad(t.h), "Hours"],
    [pad(t.m), "Minutes"],
    [pad(t.s), "Seconds"],
  ] as const;

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
        {units.map(([v, l]) => (
          <div key={l} className="py-8 px-6 text-center">
            <span
              key={`${l}-${v}`}
                        suppressHydrationWarning
              className={`font-display-luxury block text-5xl sm:text-6xl font-light tabular-nums tracking-tight text-[#171513] wi-pop`}
            >
              {v}
            </span>
            <span className="mt-2 block text-[11px] uppercase tracking-[0.32em] text-[#7c7267]">
              {l}
            </span>
          </div>
        ))}
      </div>
      </>
    );
  }

  if (variant === "floral") {
    return (
      <>
        <p className="mb-6 text-center text-[11px] font-medium uppercase tracking-[0.32em] text-[#b36a7a]">
          {eyebrow}
        </p>
      <div
        className="mx-auto grid max-w-2xl grid-cols-2 sm:grid-cols-4 gap-4"
        role="timer"
        aria-label="Wedding countdown"
      >
        {units.map(([v, l]) => (
          <div
            key={l}
            className="rounded-[2rem] bg-white/90 px-4 py-6 text-center shadow-[0_16px_40px_-18px_rgba(180,100,120,0.18),inset_0_0_0_0.75px_rgba(217,138,156,0.35)]"
          >
            <span
              key={`${l}-${v}`}
                        suppressHydrationWarning
              className={`font-display-luxury block text-4xl sm:text-5xl italic text-[#4a252a] tabular-nums wi-pop`}
            >
              {v}
            </span>
            <span className="mt-1.5 block text-[11px] uppercase tracking-[0.28em] text-[#b36a7a]">
              {l}
            </span>
          </div>
        ))}
      </div>
      </>
    );
  }

  if (variant === "royal" || variant === "vivah" || dark) {
    return (
      <>
        <p className="mb-6 text-center text-[11px] font-medium uppercase tracking-[0.32em] text-[#f3e5c3]/65">
          {eyebrow}
        </p>
      <div
        className="mx-auto grid max-w-2xl grid-cols-2 sm:grid-cols-4 gap-4"
        role="timer"
        aria-label="Wedding countdown"
      >
        {units.map(([v, l]) => (
          <div
            key={l}
            className="rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.015] px-4 py-6 text-center shadow-[inset_0_0_0_0.75px_rgba(212,175,55,0.32)]"
          >
            <span
              key={`${l}-${v}`}
                        suppressHydrationWarning
              className={`font-regal wi-gold-shimmer block text-4xl sm:text-5xl font-medium tabular-nums wi-pop`}
            >
              {v}
            </span>
            <span className="mt-2 block text-[11px] uppercase tracking-[0.32em] text-[#f3e5c3]/65">
              {l}
            </span>
          </div>
        ))}
      </div>
      </>
    );
  }

  return (
    <>
      <p className="mb-6 text-center text-[11px] font-medium uppercase tracking-[0.32em] text-[#0f353e]/70">
        {eyebrow}
      </p>
    <div
      className="mx-auto grid max-w-2xl grid-cols-2 sm:grid-cols-4 gap-4"
      role="timer"
      aria-label="Wedding countdown"
    >
      {units.map(([v, l]) => (
        <div
          key={l}
          className="rounded-2xl bg-white px-4 py-6 text-center shadow-[0_14px_34px_-18px_rgba(15,53,62,0.16),inset_0_0_0_0.75px_rgba(15,53,62,0.14)]"
        >
          <span
            key={`${l}-${v}`}
                        suppressHydrationWarning
            className={`font-display-luxury block text-4xl sm:text-5xl font-medium tabular-nums text-[#0f353e] wi-pop`}
          >
            {v}
          </span>
          <span className="mt-1.5 block text-[11px] uppercase tracking-[0.28em] text-[#0f353e]/70">
            {l}
          </span>
        </div>
      ))}
    </div>
    </>
  );
}
