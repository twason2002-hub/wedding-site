"use client";

/**
 * OpeningDecor — tiny theme-matched SVG ambience for the sealed opening
 * scenes (stars for the midnight-unfold, clouds + balloon for the postcard,
 * diyas for the envelope/scroll). CSS-only motion; still under
 * prefers-reduced-motion via the global reduced-motion rules.
 */

export function OpeningStars() {
  const stars = [
    { left: "12%", top: "12%", size: 14, delay: "0s" },
    { left: "26%", top: "28%", size: 10, delay: "0.9s" },
    { left: "82%", top: "16%", size: 12, delay: "0.4s" },
    { left: "70%", top: "34%", size: 9, delay: "1.4s" },
    { left: "18%", top: "62%", size: 9, delay: "1.9s" },
    { left: "86%", top: "58%", size: 11, delay: "0.7s" },
    { left: "45%", top: "8%", size: 8, delay: "1.1s" },
  ];
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {/* crescent moon */}
      <svg
        className="wi-float-slow absolute right-[12%] top-[6%] h-10 w-10 text-[#e8cf8f]/80"
        viewBox="0 0 40 40"
        fill="currentColor"
      >
        <path d="M27 4A16 16 0 1 0 36 26 12.5 12.5 0 0 1 27 4Z" />
      </svg>
      {stars.map((s, i) => (
        <svg
          key={i}
          className="wi-pulse-glow absolute text-[#f3df9d]"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay }}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
        </svg>
      ))}
    </div>
  );
}

export function OpeningClouds() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        className="wi-wave-drift absolute left-[6%] top-[8%] h-8 w-24 text-white/85"
        viewBox="0 0 96 32"
        fill="currentColor"
      >
        <ellipse cx="30" cy="22" rx="20" ry="10" />
        <ellipse cx="52" cy="17" rx="22" ry="12" />
        <ellipse cx="72" cy="23" rx="16" ry="8" />
      </svg>
      <svg
        className="wi-wave-drift wi-wave-drift--slow absolute right-[4%] top-[22%] h-6 w-20 text-white/70"
        viewBox="0 0 96 32"
        fill="currentColor"
      >
        <ellipse cx="30" cy="22" rx="20" ry="10" />
        <ellipse cx="52" cy="17" rx="22" ry="12" />
        <ellipse cx="72" cy="23" rx="16" ry="8" />
      </svg>
      {/* tiny celebration balloon */}
      <svg
        className="wi-float-slow absolute right-[16%] top-[30%] h-12 w-8 text-[#e8835a]"
        viewBox="0 0 32 48"
        fill="currentColor"
      >
        <ellipse cx="16" cy="13" rx="11" ry="13" />
        <path d="M16 26 L14 30 L18 30 Z" />
        <path d="M16 30 C 14 36, 18 40, 16 46" stroke="currentColor" strokeWidth="1.2" fill="none" />
      </svg>
    </div>
  );
}

export function OpeningBalloons({ color = "#d98a9c" }: { color?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        className="wi-float-slow absolute left-[4%] top-[6%] h-16 w-10"
        style={{ color }}
        viewBox="0 0 32 48"
        fill="currentColor"
      >
        <ellipse cx="16" cy="13" rx="11" ry="13" opacity="0.85" />
        <path d="M16 26 L14 30 L18 30 Z" opacity="0.85" />
        <path d="M16 30 C 14 36, 18 40, 16 46" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" />
      </svg>
      <svg
        className="wi-float-slow absolute right-[3%] top-[22%] h-12 w-8"
        style={{ color, animationDelay: "1.2s" }}
        viewBox="0 0 32 48"
        fill="currentColor"
      >
        <ellipse cx="16" cy="13" rx="11" ry="13" opacity="0.7" />
        <path d="M16 26 L14 30 L18 30 Z" opacity="0.7" />
        <path d="M16 30 C 14 36, 18 40, 16 46" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
      </svg>
    </div>
  );
}

export function OpeningDiyas({ flame = "#F59E0B", bowl = "#D4AF37" }: { flame?: string; bowl?: string }) {
  const diya = (cls: string, delay: string) => (
    <div className={`wi-pulse-glow absolute flex items-center justify-center ${cls}`} style={{ animationDelay: delay }} aria-hidden="true">
      <svg
        width="34"
        height="34"
        viewBox="0 0 64 64"
        fill="none"
        style={{ filter: "drop-shadow(0 0 7px rgba(245,158,11,0.85))" }}
      >
        <path d="M32 8C32 8 24 19 24 25C24 29.4 27.6 33 32 33C36.4 33 40 29.4 40 25C40 19 32 8 32 8Z" fill={flame} />
        <path d="M12 36C12 46 21 52 32 52C43 52 52 46 52 36H12Z" fill={bowl} />
      </svg>
    </div>
  );
  return (
    <>
      {diya("bottom-6 left-5 opacity-90", "0s")}
      {diya("bottom-6 right-5 opacity-90", "1.2s")}
    </>
  );
}
