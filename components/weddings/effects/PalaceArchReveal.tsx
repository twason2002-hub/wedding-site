"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { registerWeddingPlugins, prefersReducedMotion, EASE_DRAW, EASE_OUT } from "./gsap-setup";

/**
 * PalaceArchReveal — jharokha arch draws itself, gold details fade in,
 * then children (names/photo) rise into the arch. aria-hidden frame.
 */
export default function PalaceArchReveal({
  children,
  color = "#d4af37",
  className = "",
}: {
  children: ReactNode;
  color?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerWeddingPlugins();
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      gsap.set(el.querySelectorAll(".wi-par-path"), { drawSVG: "100%" });
      gsap.set(el.querySelector(".wi-par-inner"), { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll(".wi-par-path"), {
        drawSVG: "0%",
        duration: 0.5,
        stagger: 0.04,
        ease: EASE_DRAW,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
      gsap.from(el.querySelector(".wi-par-inner"), {
        opacity: 0,
        y: 34,
        duration: 0.45,
        delay: 0.05,
        ease: EASE_OUT,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <svg viewBox="0 0 200 260" fill="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="none">
        <path className="wi-par-path" d="M20 250 L20 110 Q20 30 100 14 Q180 30 180 110 L180 250" stroke={color} strokeWidth="1.4" />
        <path className="wi-par-path" d="M30 250 L30 114 Q30 42 100 28 Q170 42 170 114 L170 250" stroke={color} strokeWidth="0.7" opacity="0.7" />
        <path className="wi-par-path" d="M100 4 L100 14 M60 18 L66 26 M140 18 L134 26" stroke={color} strokeWidth="1" strokeLinecap="round" />
        <circle className="wi-par-path" cx="100" cy="10" r="2.5" stroke={color} strokeWidth="1" />
      </svg>
      <div className="wi-par-inner relative px-10 pb-8 pt-20 text-center">{children}</div>
    </div>
  );
}
