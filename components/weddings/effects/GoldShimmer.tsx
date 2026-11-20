"use client";

import type { ReactNode } from "react";

/**
 * GoldShimmer — slow light sweep across display text (background-clip).
 * Pure CSS, token timing; frozen under reduced-motion by the global rules.
 */
export default function GoldShimmer({
  children,
  from = "#8a6d2b",
  via = "#f3df9d",
  to = "#8a6d2b",
  duration = 5,
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
      className={`wi-gold-shimmer-text bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(110deg, ${from} 20%, ${via} 40%, ${to} 60%)`,
        backgroundSize: "200% 100%",
        animationDuration: `${duration}s`,
      }}
    >
      {children}
    </span>
  );
}
