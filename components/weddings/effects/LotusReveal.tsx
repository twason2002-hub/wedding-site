"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { registerWeddingPlugins, prefersReducedMotion, EASE_OUT } from "./gsap-setup";

/**
 * LotusReveal — lotus petals open one by one around a glowing gold centre.
 * transformOrigin at each petal's base; reduced-motion shows full bloom.
 */
export default function LotusReveal({
  color = "#c87d8a",
  center = "#f0b429",
  size = 300,
  className = "",
}: {
  color?: string;
  center?: string;
  size?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerWeddingPlugins();
    const el = ref.current;
    if (!el) return;
    const petals = el.querySelectorAll(".wi-lotus-petal");
    const core = el.querySelector(".wi-lotus-core");
    if (prefersReducedMotion()) {
      gsap.set([petals, core], { scale: 1, opacity: 1, transformOrigin: "50% 100%" });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from(petals, {
        scale: 0,
        opacity: 0,
        transformOrigin: "50% 100%",
        duration: 0.9,
        stagger: 0.12,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
      gsap.from(core, {
        scale: 0,
        opacity: 0,
        transformOrigin: "center",
        duration: 0.8,
        delay: 0.7,
        ease: EASE_OUT,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const petals = [-42, -28, -14, 0, 14, 28, 42];
  return (
    <div ref={ref} className={className} style={{ width: size, height: size * 0.72 }} aria-hidden="true">
      <svg viewBox="0 0 200 150" fill="none" style={{ width: "100%", height: "100%", overflow: "visible" }}>
        {petals.map((r) => (
          <g key={r} transform={`rotate(${r} 100 132)`}>
            <path
              className="wi-lotus-petal"
              d="M100 132 C82 100, 84 62, 100 30 C116 62, 118 100, 100 132 Z"
              stroke={color}
              strokeWidth="1.6"
              fill={`${color}22`}
            />
          </g>
        ))}
        <circle className="wi-lotus-core" cx="100" cy="118" r="10" fill={center} opacity="0.9" />
        <ellipse className="wi-lotus-core" cx="100" cy="118" rx="20" ry="6" fill={center} opacity="0.25" />
      </svg>
    </div>
  );
}
