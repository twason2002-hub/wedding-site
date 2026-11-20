"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Cookbook parallax (web-animation-skills §5): inner layer drifts
 * against scroll while its overflow-hidden parent frames it.
 * transform-only, scrubbed, tiered for reduced motion.
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
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        ref.current,
        { yPercent: depth / 2 },
        {
          yPercent: -depth / 2,
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
      gsap.set(ref.current, { yPercent: 0 });
    });
    return () => mm.revert();
  }, [depth]);

  return (
    <div ref={ref} className={className} style={{ scale: "1.18", willChange: "transform" }}>
      {children}
    </div>
  );
}
