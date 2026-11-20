"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { registerWeddingPlugins, prefersReducedMotion, EASE_OUT } from "./gsap-setup";

/**
 * PhotoReveal — cinematic photo reveal: clip wipes open while the image
 * settles from a gentle zoom. transform/opacity/clip only.
 */
export default function PhotoReveal({
  src,
  alt,
  shape = "rect",
  duration = 1.1,
  className = "",
  imgClassName = "",
}: {
  src: string;
  alt: string;
  shape?: "rect" | "arch" | "circle";
  duration?: number;
  className?: string;
  imgClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerWeddingPlugins();
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    const img = el.querySelector("img");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: "inset(12% 8% 12% 8% round 24px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 24px)",
          duration,
          ease: EASE_OUT,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }
      );
      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.12 },
          {
            scale: 1,
            duration: duration * 1.2,
            ease: EASE_OUT,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      }
    }, el);
    return () => ctx.revert();
  }, [duration]);

  const rounded = shape === "arch" ? "rounded-t-full rounded-b-3xl" : shape === "circle" ? "rounded-full aspect-square" : "rounded-3xl";
  return (
    <div ref={ref} className={`overflow-hidden ${rounded} ${className}`} style={{ willChange: "clip-path" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" decoding="async" className={`h-full w-full object-cover ${imgClassName}`} />
    </div>
  );
}
