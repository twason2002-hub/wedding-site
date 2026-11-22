"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { registerWeddingPlugins, prefersReducedMotion, EASE_DRAW } from "./gsap-setup";

/**
 * BloomEffect — stem draws upward, leaves fade in, petals pop open in a
 * staggered ring. Original generative art for floral moments.
 */
export default function BloomEffect({
  stem = "#7ba05b",
  petal = "#c87d8a",
  leaf = "#7ba05b",
  size = 280,
  className = "",
}: {
  stem?: string;
  petal?: string;
  leaf?: string;
  size?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerWeddingPlugins();
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      gsap.set(el.querySelectorAll(".wi-bloom-draw"), { drawSVG: "100%" });
      gsap.set(el.querySelectorAll(".wi-bloom-pop"), { scale: 1, opacity: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll(".wi-bloom-draw"), {
        drawSVG: "0%",
        duration: 0.5,
        stagger: 0.05,
        ease: EASE_DRAW,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
      gsap.from(el.querySelectorAll(".wi-bloom-pop"), {
        scale: 0,
        opacity: 0,
        transformOrigin: "center",
        duration: 0.45,
        stagger: 0.04,
        delay: 0.08,
        ease: "back.out(1.8)",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const petals = [0, 1, 2, 3, 4];
  return (
    <div ref={ref} className={className} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 200 200" fill="none" style={{ width: "100%", height: "100%", overflow: "visible" }}>
        <path className="wi-bloom-draw" d="M100 190 C100 150, 98 120, 100 84" stroke={stem} strokeWidth="2" strokeLinecap="round" />
        <path className="wi-bloom-draw" d="M100 150 C80 142, 66 142, 54 150 M100 150 C120 142, 134 142, 146 150" stroke={stem} strokeWidth="1.6" strokeLinecap="round" />
        <path className="wi-bloom-pop" d="M54 150 C46 136, 48 126, 58 124 C64 134, 62 144, 54 150 Z" fill={leaf} opacity="0.9" />
        <path className="wi-bloom-pop" d="M146 150 C154 136, 152 126, 142 124 C136 134, 138 144, 146 150 Z" fill={leaf} opacity="0.9" />
        {petals.map((k) => (
          <g key={k} transform={`rotate(${k * 72} 100 78)`}>
            <ellipse
              className="wi-bloom-pop"
              cx="100"
              cy="48"
              rx="16"
              ry="30"
              fill={`${petal}55`}
              stroke={petal}
              strokeWidth="1.4"
            />
          </g>
        ))}
        <circle className="wi-bloom-pop" cx="100" cy="78" r="9" fill={petal} />
      </svg>
    </div>
  );
}
