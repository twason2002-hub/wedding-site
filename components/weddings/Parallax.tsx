"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./effects/gsap-setup";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero-only scroll parallax: inner layer drifts against scroll inside a clipped parent.
 * No movement and scale 1 under prefers-reduced-motion.
 */
export default function Parallax({
  children,
  depth = 10,
  className = "",
}: {
  children: ReactNode;
  /** total drift in percent of own height (sign = direction) */
  depth?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      gsap.set(ref.current, { yPercent: 0, scale: 1 });
      return;
    }
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        ref.current,
        { yPercent: depth / 2, scale: 1 },
        {
          yPercent: -depth / 2,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current?.parentElement,
            scrub: true,
            start: "top bottom",
            end: "bottom top",
          },
        }
      );
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(ref.current, { yPercent: 0, scale: 1 });
    });
    return () => mm.revert();
  }, [depth]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}