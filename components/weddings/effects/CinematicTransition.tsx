"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { registerWeddingPlugins, prefersReducedMotion } from "./gsap-setup";

/**
 * CinematicTransition — a veil sweeps across once on scroll-enter, handing
 * one scene to the next (curtain parts / iris closes-opens / soft fade).
 * transform + opacity only; still frame when reduced-motion.
 */
export default function CinematicTransition({
  children,
  kind = "curtain",
  veil = "#0b192c",
  duration = 0.9,
  className = "",
}: {
  children: ReactNode;
  kind?: "curtain" | "iris" | "fade" | "wipe";
  veil?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerWeddingPlugins();
    const el = ref.current;
    if (!el) return;
    const veilEls = el.querySelectorAll(".wi-ct-veil");
    if (prefersReducedMotion()) {
      gsap.set(veilEls, { opacity: 0 });
      gsap.set(el.querySelector(".wi-ct-body"), { opacity: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
      if (kind === "curtain" || kind === "wipe") {
        const horiz = kind === "wipe";
        tl.fromTo(
          veilEls,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: horiz ? "left center" : "center center",
            duration: duration / 2,
            ease: "power2.in",
          }
        )
          .to(veilEls, {
            scaleX: 0,
            transformOrigin: horiz ? "right center" : "center center",
            duration: duration / 2,
            ease: "power2.out",
          })
          .from(el.querySelector(".wi-ct-body"), { opacity: 0, y: horiz ? 0 : 24, x: horiz ? 32 : 0, duration: 0.6, ease: "power3.out" }, "-=0.35");
      } else if (kind === "iris") {
        tl.fromTo(
          veilEls,
          { scale: 1.4, opacity: 0 },
          { scale: 1, opacity: 1, duration: duration / 2, ease: "power2.in" }
        )
          .to(veilEls, { scale: 0.2, opacity: 0, duration: duration / 2, ease: "power2.out" })
          .from(el.querySelector(".wi-ct-body"), { opacity: 0, scale: 0.97, duration: 0.6, ease: "power3.out" }, "-=0.3");
      } else {
        tl.from(el.querySelector(".wi-ct-body"), { opacity: 0, y: 30, duration, ease: "power3.out" });
        tl.to(veilEls, { opacity: 0, duration: 0.01 }, 0);
      }
    }, el);
    return () => ctx.revert();
  }, [kind, duration]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div
        className="wi-ct-veil pointer-events-none absolute inset-0 z-10"
        style={{ background: veil }}
        aria-hidden="true"
      />
      <div className="wi-ct-body relative">{children}</div>
    </div>
  );
}
