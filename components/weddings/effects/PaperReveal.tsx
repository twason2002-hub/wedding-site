"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { registerWeddingPlugins, prefersReducedMotion, EASE_OUT } from "./gsap-setup";

/**
 * PaperReveal — invitation paper unrolls downward (clip-path, no distortion)
 * with rods top and bottom. Children = the message.
 */
export default function PaperReveal({
  children,
  rod = "#b98a2f",
  paper = "#fffdf6",
  className = "",
}: {
  children: ReactNode;
  rod?: string;
  paper?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerWeddingPlugins();
    const el = ref.current;
    if (!el) return;
    const sheet = el.querySelector(".wi-paper-sheet");
    if (!sheet || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sheet,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 1.3,
          ease: EASE_OUT,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const rodCls = "mx-auto h-2.5 w-[94%] rounded-full";
  const rodBg = `linear-gradient(90deg, ${rod}88, ${rod}, ${rod}88)`;
  return (
    <div ref={ref} className={className}>
      <div className={rodCls} style={{ background: rodBg }} aria-hidden="true" />
      <div
        className="wi-paper-sheet mx-auto w-[94%] px-6 py-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.25)]"
        style={{ background: paper, willChange: "clip-path" }}
      >
        {children}
      </div>
      <div className={rodCls} style={{ background: rodBg }} aria-hidden="true" />
    </div>
  );
}
