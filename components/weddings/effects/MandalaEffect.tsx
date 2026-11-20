"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { registerWeddingPlugins, prefersReducedMotion } from "./gsap-setup";

/**
 * MandalaEffect — generative layered mandala: dashed rings rotate slowly
 * in opposite directions, petal ring draws on scroll-enter. Original art,
 * no assets. aria-hidden decoration.
 */
export default function MandalaEffect({
  color = "#d4af37",
  size = 480,
  spinSeconds = 60,
  className = "",
}: {
  color?: string;
  size?: number;
  spinSeconds?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerWeddingPlugins();
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const tweens: gsap.core.Tween[] = [];
    const ctx = gsap.context(() => {
      tweens.push(
        gsap.to(".wi-mandala-a", { rotation: 360, duration: spinSeconds, repeat: -1, ease: "none", transformOrigin: "center" }),
        gsap.to(".wi-mandala-b", { rotation: -360, duration: spinSeconds * 0.7, repeat: -1, ease: "none", transformOrigin: "center" })
      );
      const petals = el.querySelectorAll(".wi-mandala-petal");
      if (petals.length) {
        gsap.from(petals, {
          drawSVG: "0%",
          duration: 1.6,
          stagger: 0.08,
          ease: "power1.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      }
    }, el);
    const io = new IntersectionObserver(([e]) => tweens.forEach((t) => t.paused(!e.isIntersecting)));
    io.observe(el);
    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, [spinSeconds]);

  const petals = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <div ref={ref} className={className} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 200 200" fill="none" style={{ width: "100%", height: "100%" }}>
        <g className="wi-mandala-a" stroke={color} strokeWidth="0.6">
          <circle cx="100" cy="100" r="94" strokeDasharray="3 4" opacity="0.7" />
          <circle cx="100" cy="100" r="78" opacity="0.8" />
        </g>
        <g className="wi-mandala-b" stroke={color} strokeWidth="0.6">
          <circle cx="100" cy="100" r="60" strokeDasharray="6 4" opacity="0.7" />
          {petals.map((k) => (
            <ellipse key={k} className="wi-mandala-petal" cx="100" cy="52" rx="14" ry="30" transform={`rotate(${k * 45} 100 100)`} opacity="0.85" />
          ))}
        </g>
        <circle cx="100" cy="100" r="10" stroke={color} strokeWidth="0.8" opacity="0.9" />
      </svg>
    </div>
  );
}
