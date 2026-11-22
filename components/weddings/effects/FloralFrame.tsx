"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { registerWeddingPlugins, prefersReducedMotion, EASE_DRAW } from "./gsap-setup";

/**
 * FloralFrame — botanical corner branches that grow on scroll-enter,
 * with leaves fading in along the stems. aria-hidden decoration.
 */
export default function FloralFrame({
  color = "#c87d8a",
  leaf = "#7ba05b",
  className = "",
}: {
  color?: string;
  leaf?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerWeddingPlugins();
    const el = ref.current;
    if (!el) return;
    const stems = el.querySelectorAll(".wi-ff-stem");
    const leaves = el.querySelectorAll(".wi-ff-leaf");
    if (prefersReducedMotion()) {
      gsap.set(stems, { drawSVG: "100%" });
      gsap.set(leaves, { opacity: 1, scale: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from(stems, {
        drawSVG: "0%",
        duration: 0.5,
        stagger: 0.04,
        ease: EASE_DRAW,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
      gsap.from(leaves, {
        opacity: 0,
        scale: 0,
        transformOrigin: "center",
        duration: 0.5,
        stagger: 0.07,
        ease: "back.out(2)",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const corner = (pos: string, flip: string) => (
    <svg viewBox="0 0 120 120" fill="none" className={`absolute h-28 w-28 ${pos}`} style={{ transform: flip }} aria-hidden="true">
      <path className="wi-ff-stem" d="M8 112 C30 80, 44 60, 48 20 M8 112 C40 100, 70 92, 96 96" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      {[
        [34, 78, -20],
        [52, 58, 15],
        [78, 80, 30],
        [96, 92, -10],
      ].map(([x, y, r], i) => (
        <g key={i} transform={`rotate(${r} ${x} ${y})`}>
          <ellipse className="wi-ff-leaf" cx={x} cy={y} rx="7" ry="4.5" fill={leaf} opacity="0.9" />
        </g>
      ))}
      <circle className="wi-ff-leaf" cx="48" cy="20" r="5" fill={color} />
    </svg>
  );

  return (
    <div ref={ref} className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {corner("left-2 top-2", "none")}
      {corner("right-2 top-2", "scaleX(-1)")}
      {corner("bottom-2 left-2", "scaleY(-1)")}
      {corner("bottom-2 right-2", "scale(-1)")}
    </div>
  );
}
