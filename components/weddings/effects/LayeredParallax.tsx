"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ParallaxLayer, ParallaxPosition } from "@/lib/weddings/template-experience";
import { useMotionScene } from "../motion";
import { prefersReducedMotion, registerWeddingPlugins } from "./gsap-setup";

const BOX: Record<Exclude<ParallaxPosition, "tilt">, string> = {
  background: "inset-0 z-0",
  frame: "inset-x-[2%] top-[1%] bottom-[3%] z-[2]",
  top: "inset-x-0 top-0 z-[4] h-[34%] sm:h-[40%]",
  bottom: "inset-x-0 bottom-0 z-[5] h-[22%] sm:h-[26%]",
  corner: "bottom-0 -left-[8%] z-[4] h-[42%] w-[78%] sm:w-[44%]",
  edges: "inset-0 z-[3]",
  overlay: "inset-0 z-[3]",
};

const FIT: Record<Exclude<ParallaxPosition, "tilt">, string> = {
  background: "object-cover",
  frame: "object-contain",
  top: "object-contain object-top",
  bottom: "object-contain object-bottom",
  corner: "object-contain object-left-bottom",
  edges: "object-cover object-top",
  overlay: "object-contain",
};

const SCRIM: Record<"dark" | "light" | "palace" | "coast", string> = {
  dark: "linear-gradient(180deg, rgba(8,6,4,0.22) 0%, rgba(8,6,4,0.58) 46%, rgba(8,6,4,0.84) 100%)",
  light: "linear-gradient(180deg, rgba(253,247,245,0.42) 0%, rgba(253,247,245,0.74) 46%, rgba(253,247,245,0.9) 100%)",
  palace: "linear-gradient(180deg, rgba(20,8,6,0.18) 0%, rgba(20,8,6,0.08) 26%, rgba(20,8,6,0.22) 58%, rgba(20,8,6,0.48) 100%)",
  coast: "linear-gradient(180deg, rgba(10,37,44,0.14) 0%, rgba(10,37,44,0.05) 22%, rgba(10,37,44,0.28) 64%, rgba(10,37,44,0.5) 100%)",
};

/**
 * Hero stack from motion.parallaxLayers. Scroll moves each layer with
 * translate3d (and a slight scale on the background). Reduced motion is static.
 * Tilt layers are drawn by ParallaxTiltCard so they don't cover the hero type.
 */
export default function LayeredParallax() {
  const scene = useMotionScene();
  const ref = useRef<HTMLDivElement>(null);
  const layers = (scene?.parallaxLayers ?? []).filter((layer) => layer.position !== "tilt");

  useEffect(() => {
    if (!layers.length || prefersReducedMotion()) return;
    const root = ref.current;
    const header = root?.parentElement;
    if (!root || !header) return;
    registerWeddingPlugins();
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const layers = root.querySelectorAll<HTMLElement>("[data-depth]");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: header,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.45,
        },
      });
      layers.forEach((layer) => {
        const depth = Number(layer.dataset.depth || 12);
        const background = layer.dataset.position === "background";
        tl.fromTo(
          layer,
          { y: depth * 0.25, scale: background ? 1.06 : 1, force3D: true },
          { y: -depth * 0.75, scale: background ? 1.01 : 1, ease: "none", force3D: true },
          0,
        );
      });
    });
    return () => mm.revert();
  }, [layers.length]);

  if (!layers.length) return null;
  const scrim = scene?.parallaxScrim && scene.parallaxScrim !== "none" ? SCRIM[scene.parallaxScrim] : null;

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" style={{ contain: "paint" }} aria-hidden="true">
      {layers.map((layer) => (
        <LayerView key={layer.src} layer={layer} />
      ))}
      {scrim && <div className="absolute inset-0 z-[6]" style={{ background: scrim }} />}
    </div>
  );
}

function LayerView({ layer }: { layer: ParallaxLayer }) {
  const position = layer.position === "tilt" ? "overlay" : layer.position;
  const priority = position === "background";
  const fit =
    layer.fit === "cover"
      ? "object-cover object-bottom"
      : layer.fit === "shore"
        ? "object-cover object-top"
        : layer.fit === "contain"
          ? "object-contain object-bottom"
          : FIT[position];
  const mask =
    layer.fade === "top"
      ? "linear-gradient(to bottom, transparent 0%, #000 46%)"
      : layer.fade === "bottom"
        ? "linear-gradient(to bottom, #000 0%, #000 18%, transparent 46%)"
        : undefined;
  return (
    <div
      data-depth={layer.depth}
      data-position={position}
      className={`wi-parallax-layer absolute ${BOX[position]}`}
      style={{ opacity: layer.opacity ?? 1, maskImage: mask, WebkitMaskImage: mask }}
    >
      <Image
        src={layer.src}
        alt=""
        fill
        sizes={priority ? "100vw" : "(max-width: 768px) 100vw, 720px"}
        priority={priority}
        draggable={false}
        className={fit}
      />
    </div>
  );
}

/**
 * Minimal suite: scroll rotateX on the outer card, pointer rotateX/Y on the
 * inner face. Separate nodes so this doesn't overwrite scrollTilt elsewhere.
 */
export function ParallaxTiltCard({ className = "" }: { className?: string }) {
  const scene = useMotionScene();
  const layer = scene?.parallaxLayers.find((item) => item.position === "tilt");
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!layer || prefersReducedMotion()) return;
    const el = outer.current;
    if (!el) return;
    registerWeddingPlugins();
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(el, { transformPerspective: 900, force3D: true });
      gsap.fromTo(
        el,
        { rotateX: 7, y: 10, force3D: true },
        {
          rotateX: -7,
          y: -14,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            end: "bottom 18%",
            scrub: 0.4,
          },
        },
      );
    });
    return () => mm.revert();
  }, [layer]);

  if (!layer) return null;

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion() || e.pointerType !== "mouse") return;
    const el = inner.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg) translate3d(0,0,0)`;
  }

  function onLeave() {
    const el = inner.current;
    if (!el) return;
    el.style.transform = "rotateX(0deg) rotateY(0deg) translate3d(0,0,0)";
  }

  return (
    <div ref={outer} className={`wi-parallax-tilt ${className}`} style={{ transformStyle: "preserve-3d" }}>
      <div
        ref={inner}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="relative aspect-[539/700] w-full"
        style={{ transform: "translate3d(0,0,0)", opacity: layer.opacity ?? 1 }}
      >
        <Image
          src={layer.src}
          alt=""
          fill
          sizes="(max-width: 768px) 46vw, 280px"
          draggable={false}
          className="object-contain drop-shadow-[0_18px_28px_rgba(4,10,24,0.55)]"
        />
      </div>
    </div>
  );
}

/** Gold line-art crest above the couple names. Royal and Vivah only. */
export function GaneshCrest() {
  const src = useMotionScene()?.accents.crest;
  if (!src) return null;
  return (
    <Image
      src={src}
      alt=""
      width={617}
      height={870}
      sizes="96px"
      className="mx-auto mb-3 h-20 w-auto sm:h-24"
    />
  );
}

/** Transparent gold border around a details card. Lazy, non-interactive. */
export function GoldFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  const src = useMotionScene()?.accents.frame;
  if (!src) return <>{children}</>;
  return (
    <div className={`wi-hair-frame relative isolate px-1.5 py-3 sm:px-2 sm:py-4 ${className}`}>
      {children}
      <Image
        src={src}
        alt=""
        width={815}
        height={1102}
        sizes="(max-width: 768px) 100vw, 720px"
        className="wi-hair-frame-art pointer-events-none absolute inset-1 z-[2] h-[calc(100%-0.5rem)] w-[calc(100%-0.5rem)] max-w-none"
      />
    </div>
  );
}

/**
 * RSVP rises out of the open envelope as it scrolls in.
 * Reduced motion leaves the card fully in view.
 */
export function EnvelopeRsvp({ children }: { children: ReactNode }) {
  const src = useMotionScene()?.accents.envelope;
  const root = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!src || prefersReducedMotion()) return;
    const el = card.current;
    const trigger = root.current;
    if (!el || !trigger) return;
    registerWeddingPlugins();
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el,
        { y: 84, force3D: true },
        {
          y: 0,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger,
            start: "top 88%",
            end: "top 42%",
            scrub: 0.4,
          },
        },
      );
    });
    return () => mm.revert();
  }, [src]);

  if (!src) return <>{children}</>;

  return (
    <div ref={root} className="wi-envelope relative">
      <Image
        src={src}
        alt=""
        width={726}
        height={806}
        sizes="(max-width: 768px) 100vw, 560px"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 mx-auto w-full max-w-xl"
      />
      <div ref={card} className="wi-envelope-card relative z-[1]">
        {children}
      </div>
    </div>
  );
}
