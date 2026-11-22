"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion, registerWeddingPlugins } from "./gsap-setup";
import { useMotionScene, useSignature } from "../motion";

/**
 * Destination signature — sea, sand and palm shift at different depths.
 * Transform only, paused once the hero has left the viewport.
 * Config: motion.signature.coastParallax
 */
export default function CoastDepth() {
  const signature = useSignature();
  const layered = (useMotionScene()?.parallaxLayers.length ?? 0) > 0;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (layered || !signature?.coastParallax || prefersReducedMotion()) return;
    const root = ref.current;
    const header = root?.parentElement;
    if (!root || !header) return;
    registerWeddingPlugins();
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      root.querySelectorAll<HTMLElement>("[data-depth]").forEach((layer) => {
        const depth = Number(layer.dataset.depth || 8);
        gsap.fromTo(
          layer,
          { yPercent: depth * 0.35 },
          {
            yPercent: -depth,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: header,
              start: "top top",
              end: "bottom top",
              scrub: 0.35,
            },
          },
        );
      });
    });
    return () => mm.revert();
  }, [layered, signature?.coastParallax]);

  if (layered || !signature?.coastParallax) return null;

  return (
    <div ref={ref} className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-24 overflow-hidden" aria-hidden="true">
      <div data-depth="16" className="absolute inset-x-0 bottom-10 h-14 bg-[#1d6f86]/80" />
      <div data-depth="10" className="absolute inset-x-0 bottom-4 h-10 bg-[#e7d3b0]" />
      <svg data-depth="6" viewBox="0 0 80 120" className="absolute bottom-3 left-[8%] h-16 w-10 text-[#0a252c]/75">
        <path d="M40 118 V48 M40 58 C18 40 10 22 22 8 M40 52 C62 34 72 16 60 4 M40 70 C16 66 8 84 18 96 M40 74 C66 68 74 86 62 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <svg data-depth="6" viewBox="0 0 80 120" className="absolute bottom-2 right-[10%] h-20 w-10 text-[#0a252c]/70">
        <path d="M40 118 V44 M40 54 C16 36 8 16 24 6 M40 50 C64 32 74 14 58 2 M40 68 C14 64 6 86 20 98" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/**
 * Shared 2–3 layer hero parallax. Decorative only, transform-only.
 * Config: motion.signature.heroParallax
 */
export function HeroDepthLayers({ tone }: { tone: "royal" | "floral" | "minimal" | "vivah" }) {
  const signature = useSignature();
  const layered = (useMotionScene()?.parallaxLayers.length ?? 0) > 0;
  const ref = useRef<HTMLDivElement>(null);
  const ink =
    tone === "floral" ? "rgba(200,125,138,0.28)" : tone === "vivah" ? "rgba(240,180,41,0.28)" : "rgba(212,175,55,0.28)";

  useEffect(() => {
    if (layered || !signature?.heroParallax || prefersReducedMotion()) return;
    const root = ref.current;
    const header = root?.parentElement;
    if (!root || !header) return;
    registerWeddingPlugins();
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      root.querySelectorAll<HTMLElement>("[data-depth]").forEach((layer) => {
        const depth = Number(layer.dataset.depth || 8);
        gsap.fromTo(
          layer,
          { y: depth },
          {
            y: -depth * 2,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: header,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.3,
            },
          },
        );
      });
    });
    return () => mm.revert();
  }, [layered, signature?.heroParallax]);

  if (layered || !signature?.heroParallax) return null;

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div data-depth="10" className="absolute -left-6 top-16 h-40 w-40 rounded-full border" style={{ borderColor: ink }} />
      <div data-depth="18" className="absolute right-4 top-28 h-24 w-24 rounded-full border" style={{ borderColor: ink }} />
      <div data-depth="6" className="absolute bottom-10 left-1/2 h-px w-40 -translate-x-1/2" style={{ background: ink }} />
    </div>
  );
}
