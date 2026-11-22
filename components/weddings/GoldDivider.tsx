"use client";

import { useEffect, useRef, useState } from "react";
import { useDelight } from "./motion";
import { prefersReducedMotion } from "./effects/gsap-setup";

/**
 * Fine rule with a centered mark. When motion.delight.dividerDraw is on,
 * the lines scale out from the centre once the rule enters view.
 * Reduced motion, and the flag off, leave the finished rule in place.
 */
export default function GoldDivider({ color, className = "" }: { color?: string; className?: string }) {
  const draw = useDelight().dividerDraw;
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!draw || prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { threshold: 0.7 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [draw]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`wi-divider mx-auto w-[min(100%,42rem)] px-6 ${shown ? "wi-divider-draw" : ""} ${className}`}
      style={color ? { color } : undefined}
    >
      <span>✦</span>
    </div>
  );
}
