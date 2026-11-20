"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { SplitText } from "gsap/SplitText";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Flip } from "gsap/Flip";
import { Observer } from "gsap/Observer";
import { CustomEase } from "gsap/CustomEase";

let registered = false;

/** Register every GSAP plugin once (idempotent across components). */
export function registerWeddingPlugins() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(
    ScrollTrigger,
    DrawSVGPlugin,
    MorphSVGPlugin,
    SplitText,
    MotionPathPlugin,
    Flip,
    Observer,
    CustomEase
  );
  registered = true;
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Token curves (Animate UI) as GSAP eases. */
export const EASE_OUT = "power3.out";
export const EASE_SOFT = "power2.out";
export const EASE_DRAW = "power1.out";
