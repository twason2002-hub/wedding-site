"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SplitText } from "gsap/SplitText";

let registered = false;

/** Register GSAP plugins used across wedding effects (idempotent). */
export function registerWeddingPlugins() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, SplitText);
  registered = true;
}

/** Live check — not a one-time snapshot (respects mid-session OS setting changes). */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Token curves (Animate UI) as GSAP eases. */
export const EASE_OUT = "power3.out";
export const EASE_SOFT = "power2.out";
export const EASE_DRAW = "power1.out";