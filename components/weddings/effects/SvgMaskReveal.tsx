"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { registerWeddingPlugins, prefersReducedMotion, EASE_OUT } from "./gsap-setup";

/**
 * SvgMaskReveal — cinematic clip reveal (circle bloom / arch rise / wipe)
 * scrubbed or played on scroll-enter. Content stays interactive after.
 */
export default function SvgMaskReveal({
  children,
  shape = "circle",
  scrub = false,
  className = "",
}: {
  children: ReactNode;
  shape?: "circle" | "arch" | "wipe";
  scrub?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerWeddingPlugins();
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      gsap.set(el, { clipPath: "none" });
      return;
    }
    // arch: pair with rounded-t-full on the element for a rising arch reveal.
    const from =
      shape === "circle" ? "circle(0% at 50% 50%)" : shape === "arch" ? "inset(100% 0 0 0)" : "inset(0 100% 0 0)";
    const to =
      shape === "circle" ? "circle(75% at 50% 50%)" : shape === "arch" ? "inset(0% 0 0 0)" : "inset(0 0% 0 0)";
    const ctx = gsap.context(() => {
      if (scrub) {
        gsap.fromTo(
          el,
          { clipPath: from },
          {
            clipPath: to,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "center center", scrub: 0.6 },
          }
        );
      } else {
        gsap.fromTo(
          el,
          { clipPath: from },
          {
            clipPath: to,
            duration: 1.2,
            ease: EASE_OUT,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );
      }
    }, el);
    return () => ctx.revert();
  }, [shape, scrub]);

  return (
    <div ref={ref} className={className} style={{ willChange: "clip-path" }}>
      {children}
    </div>
  );
}
