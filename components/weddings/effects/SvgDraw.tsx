"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { registerWeddingPlugins, prefersReducedMotion, EASE_DRAW } from "./gsap-setup";

/**
 * SvgDraw — draws SVG strokes (paths, circles, lines…) on scroll-enter
 * or on mount. Colors via currentColor. Static final state without motion.
 */
export default function SvgDraw({
  children,
  duration = 1.6,
  stagger = 0.12,
  trigger = "scroll",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  duration?: number;
  stagger?: number;
  trigger?: "mount" | "scroll";
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerWeddingPlugins();
    const el = ref.current;
    if (!el) return;
    const shapes = el.querySelectorAll("path, circle, rect, line, ellipse, polygon, polyline");
    if (!shapes.length) return;
    if (prefersReducedMotion()) {
      gsap.set(shapes, { drawSVG: "100%" });
      return;
    }
    const ctx = gsap.context(() => {
      const tween: gsap.TweenVars = {
        drawSVG: "100%",
        duration,
        stagger,
        delay,
        ease: EASE_DRAW,
      };
      if (trigger === "scroll") {
        Object.assign(tween, {
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      }
      gsap.from(shapes, { drawSVG: "0%", ...tween } as gsap.TweenVars);
    }, el);
    return () => ctx.revert();
  }, [duration, stagger, trigger, delay]);

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {children}
    </div>
  );
}
