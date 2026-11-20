"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { prefersReducedMotion, registerWeddingPlugins } from "./effects/gsap-setup";

/**
 * One slow Ken Burns zoom (scale 1 → 1.06) on the hero photo; paused offscreen.
 */
export default function HeroKenBurns({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = ref.current;
    if (!wrap || prefersReducedMotion()) return;
    const img = wrap.querySelector("img");
    if (!img) return;
    registerWeddingPlugins();
    let tween: gsap.core.Tween | undefined;
    const ctx = gsap.context(() => {
      tween = gsap.fromTo(img, { scale: 1 }, { scale: 1.06, duration: 22, ease: "none" });
    }, wrap);
    const io = new IntersectionObserver(([e]) => tween?.paused(!e.isIntersecting));
    io.observe(wrap);
    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}