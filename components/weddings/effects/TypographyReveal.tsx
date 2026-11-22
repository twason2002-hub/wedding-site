"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { registerWeddingPlugins, prefersReducedMotion, EASE_OUT } from "./gsap-setup";

if (typeof window !== "undefined") {
  registerWeddingPlugins();
  gsap.registerPlugin(SplitText);
}

/**
 * TypographyReveal — SplitText mask reveal (chars/words rise out of
 * overflow masks). Reduced-motion: text simply appears.
 */
export default function TypographyReveal({
  text,
  as: Tag = "span",
  type = "words",
  stagger = 0.02,
  duration = 0.5,
  className = "",
}: {
  text: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  type?: "chars" | "words" | "lines";
  stagger?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      try {
        split = new SplitText(el, {
          type: type === "chars" ? "chars,words" : type,
          mask: type === "chars" ? "chars" : "words",
        });
        const parts =
          type === "chars" ? split.chars : type === "lines" ? split.lines : split.words;
        gsap.from(parts ?? [], {
          yPercent: 110,
          duration,
          stagger,
          ease: EASE_OUT,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      } catch {
        gsap.from(el, {
          opacity: 0,
          y: 18,
          duration: 0.7,
          ease: EASE_OUT,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      }
    }, el);
    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [text, type, stagger, duration]);

  const Cmp = Tag as "span";
  return (
    <Cmp ref={ref as React.RefObject<HTMLSpanElement>} className={className}>
      {text}
    </Cmp>
  );
}
