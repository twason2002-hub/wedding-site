"use client";

import type { ReactNode } from "react";

/**
 * GoldShimmer — slow light sweep across display text (background-clip).
 * Pure CSS, token timing; frozen under reduced-motion by the global rules.
 */
export default function GoldShimmer({
  children,
  from = "#e6c56a",
  via = "#fff6d4",
  to = "#e6c56a",
  duration = 7,
  className = "",
}: {
  children: ReactNode;
  from?: string;
  via?: string;
  to?: string;
  duration?: number;
  className?: string;
}) {
  return (
    <span
      className={`wi-gold-shimmer-text wi-foil-text bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(110deg, ${from} 0%, ${from} 36%, ${via} 48%, ${from} 62%, ${to} 100%)`,
        backgroundSize: "200% 100%",
        animationDuration: `${duration}s`,
      }}
    >
      {children}
    </span>
  );
}
