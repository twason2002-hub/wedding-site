"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { registerWeddingPlugins, prefersReducedMotion, EASE_DRAW } from "./gsap-setup";

/**
 * AnimatedBorder — hairline frame draws itself on scroll-enter, corner
 * flourishes pop in after. aria-hidden decoration.
 */
export default function AnimatedBorder({
  color = "#d4af37",
  duration = 1.4,
  className = "",
}: {
  color?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerWeddingPlugins();
    const el = ref.current;
    if (!el) return;
    const frame = el.querySelectorAll(".wi-ab-frame");
    const corners = el.querySelectorAll(".wi-ab-corner");
    if (prefersReducedMotion()) {
      gsap.set([frame, corners], { drawSVG: "100%", opacity: 1, scale: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from(frame, {
        drawSVG: "0%",
        duration,
        stagger: 0.15,
        ease: EASE_DRAW,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
      gsap.from(corners, {
        opacity: 0,
        scale: 0.6,
        transformOrigin: "center",
        duration: 0.6,
        stagger: 0.1,
        delay: duration * 0.7,
        ease: "back.out(2)",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [duration]);

  const c = "absolute h-7 w-7 wi-ab-corner";
  return (
    <div ref={ref} className={`pointer-events-none absolute inset-3 ${className}`} aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full" fill="none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect className="wi-ab-frame" x="1" y="1" width="98" height="98" rx="3" stroke={color} strokeWidth="0.5" />
      </svg>
      <span className={`${c} left-0 top-0 border-l border-t`} style={{ borderColor: color }} />
      <span className={`${c} right-0 top-0 border-r border-t`} style={{ borderColor: color }} />
      <span className={`${c} bottom-0 left-0 border-b border-l`} style={{ borderColor: color }} />
      <span className={`${c} bottom-0 right-0 border-b border-r`} style={{ borderColor: color }} />
    </div>
  );
}
