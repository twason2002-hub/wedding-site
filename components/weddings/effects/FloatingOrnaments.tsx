"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { registerWeddingPlugins, prefersReducedMotion } from "./gsap-setup";

/**
 * FloatingOrnaments — template SVG motifs drifting gently (y bob + sway).
 * IO-gated so offscreen ornaments rest; still under reduced-motion.
 */
export default function FloatingOrnaments({
  children,
  duration = 5,
  drift = 14,
  className = "",
}: {
  children: ReactNode;
  duration?: number;
  drift?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerWeddingPlugins();
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      gsap.set(el, { clearProps: "transform" });
      return;
    }
    const tweens: gsap.core.Tween[] = [];
    const ctx = gsap.context(() => {
      tweens.push(
        gsap.to(el, {
          y: -drift,
          duration,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }),
        gsap.to(el, {
          rotation: 3,
          transformOrigin: "center",
          duration: duration * 1.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      );
    }, el);
    const io = new IntersectionObserver(([e]) => {
      tweens.forEach((t) => t.paused(!e.isIntersecting));
    });
    io.observe(el);
    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, [duration, drift]);

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {children}
    </div>
  );
}
