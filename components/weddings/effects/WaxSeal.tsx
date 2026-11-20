"use client";

import { useState } from "react";

/**
 * WaxSeal — press to break. Seal scales down on press (scale.press),
 * cracks (two halves drift apart) and fades, revealing children.
 * Reduced-motion: instant reveal, no movement.
 */
export default function WaxSeal({
  monogram,
  sealHi = "#a9243d",
  sealLo = "#540a1b",
  ink = "#f6ead4",
  label = "Break the seal",
  children,
}: {
  monogram: string;
  sealHi?: string;
  sealLo?: string;
  ink?: string;
  label?: string;
  children: React.ReactNode;
}) {
  const [broken, setBroken] = useState(false);

  if (broken) return <>{children}</>;

  return (
    <button
      onClick={() => setBroken(true)}
      aria-label={label}
      className="wi-seal-btn group relative mx-auto flex h-20 w-20 items-center justify-center rounded-full text-2xl outline-none transition-transform duration-150 ease-out active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-4"
      style={{
        background: `radial-gradient(circle at 35% 30%, ${sealHi} 0%, ${sealLo} 70%)`,
        color: ink,
        boxShadow: `inset 0 0 0 2px ${ink}55, inset 0 2px 6px rgba(255,255,255,0.25), 0 12px 28px rgba(0,0,0,0.4)`,
        fontFamily: "Georgia, serif",
      }}
    >
      <span className="wi-seal-crack-l absolute inset-2 rounded-full border border-current opacity-0 transition-all duration-500 group-active:opacity-60" aria-hidden="true" />
      {monogram}
      <span className="sr-only"> — {label}</span>
    </button>
  );
}
