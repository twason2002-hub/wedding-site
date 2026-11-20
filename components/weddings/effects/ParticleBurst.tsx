"use client";

import type { ReactNode } from "react";
import { Particles } from "@animate-ui/react/primitives/effects/particles";

/**
 * ParticleBurst — reusable Animate UI particle celebration.
 * Set `burst` true to play once (e.g. on scratch complete, RSVP success).
 */
export default function ParticleBurst({
  burst,
  children,
  side = "top",
  count = 14,
}: {
  burst: boolean;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  count?: number;
}) {
  return (
    <Particles animate={burst}>
      {/* Animate UI renders its own burst layer; count tuned via CSS var */}
      <span style={{ ["--wi-burst-count" as string]: count, display: "contents" }} data-side={side}>
        {children}
      </span>
    </Particles>
  );
}
