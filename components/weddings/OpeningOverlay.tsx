"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { FiligreeCorners } from "./LuxuryOrnaments";
import { OpeningDiyas, OpeningStars } from "./OpeningDecor";
import EnvelopeReveal from "./EnvelopeReveal";
import BloomReveal from "./BloomReveal";
import UnfoldReveal from "./UnfoldReveal";
import TempleScrollReveal from "./TempleScrollReveal";
import PostcardReveal from "./PostcardReveal";
import RibbonPull from "./RibbonPull";
import PalaceDoors from "./effects/PalaceDoors";
import DiyaBell from "./effects/DiyaBell";
import PetalUnfold from "./effects/PetalUnfold";
import CardFlip from "./effects/CardFlip";
import type { EnvelopeTheme } from "@/lib/weddings/template-experience";
import { experienceFor } from "@/lib/weddings/template-experience";

/**
 * Bespoke Luxury Opening Overlay per Template.
 * - Ultra-fine hairline filigree frames (no bulky borders).
 * - Outlined monogram watermark behind couple names.
 * - Compositor-only 60fps transitions.
 */
export default function OpeningOverlay({
  variant,
  names,
  blessing,
  subtitle,
  theme,
  timing,
}: {
  variant: "curtain" | "petals" | "fade" | "diya" | "waves" | "envelope" | "bloom" | "unfold" | "scroll" | "postcard" | "ribbon" | "doors" | "bell" | "petal" | "flip";
  names: string;
  blessing?: string;
  subtitle?: string;
  theme?: EnvelopeTheme;
  timing?: { open: number; reveal: number };
}) {
  const [open, setOpen] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const dismissTimer = useRef<number | undefined>(undefined);

  const dismiss = useCallback(() => {
    setLeaving((prev) => {
      if (prev) return prev;
      // Releases the paused hero entrance so it plays as the gates part.
      delete document.documentElement.dataset.invite;
      if (dismissTimer.current) window.clearTimeout(dismissTimer.current);
      dismissTimer.current = window.setTimeout(() => setOpen(false), 820);
      return true;
    });
  }, []);

  // A visible scrollbar shifts fixed `left: 50%` off the viewport centre.
  useLayoutEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [open]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Deferred to satisfy react-hooks/set-state-in-effect; overlay is skipped entirely.
      const id = requestAnimationFrame(() => setOpen(false));
      return () => cancelAnimationFrame(id);
    }
    const root = document.documentElement;
    root.dataset.invite = "sealed";

    // Isolated iframe previews (?preview=auto) auto-open after the entrance.
    let auto: number | undefined;
    try {
      if (new URLSearchParams(window.location.search).get("preview") === "auto") {
        auto = window.setTimeout(() => dismiss(), 1600);
      }
    } catch {
      /* non-browser — ignore */
    }

    let touchY = 0;
    const tactile = variant === "ribbon" || variant === "doors" || variant === "bell" || variant === "petal";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 8) dismiss();
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY - e.touches[0].clientY > 40) dismiss();
    };
    window.addEventListener("keydown", onKey);
    if (!tactile) {
      window.addEventListener("wheel", onWheel, { passive: true });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
    }
    return () => {
      delete root.dataset.invite;
      if (auto) window.clearTimeout(auto);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [dismiss, variant]);

  useEffect(() => () => {
    if (dismissTimer.current) window.clearTimeout(dismissTimer.current);
  }, []);

  if (!open) return null;

  const depth =
    variant === "ribbon" || variant === "doors" || variant === "bell" || variant === "petal" || variant === "flip";
  const wrap = `fixed inset-0 z-[90] flex items-center justify-center cursor-pointer ${
    depth ? "overflow-visible" : "overflow-hidden"
  } wi-enter-stage touch-none${leaving ? " wi-leaving" : ""}`;

  const initials = names
    .split(/[&—]|weds/i)
    .map((part) => part.trim()[0])
    .filter(Boolean)
    .join(" · ");

  const gateVars: Record<string, React.CSSProperties> = {
    curtain: {
      "--gate-a": "#150804",
      "--gate-b": "#2c1009",
      "--gate-c": "#451708",
    } as React.CSSProperties,
    petals: {
      "--gate-a": "#fdf5f2",
      "--gate-b": "#f8e1e7",
      "--gate-c": "#f0c6d1",
      "--gate-shade": "rgba(168, 90, 110, 0.28)",
      "--gate-line": "rgba(200, 125, 138, 0.4)",
      "--gate-seam-a": "#c87d8a",
      "--gate-seam-b": "#fbe3e8",
    } as React.CSSProperties,
    diya: {
      "--gate-a": "#2d0507",
      "--gate-b": "#3f080a",
      "--gate-c": "#560d0f",
      "--gate-line": "rgba(251, 191, 36, 0.22)",
    } as React.CSSProperties,
    waves: {
      "--gate-a": "#082026",
      "--gate-b": "#0c2b33",
      "--gate-c": "#114049",
      "--gate-line": "rgba(230, 184, 156, 0.22)",
      "--gate-seam-a": "#b86b43",
      "--gate-seam-b": "#f3d5c1",
    } as React.CSSProperties,
    fade: {
      "--gate-a": "#050c17",
      "--gate-b": "#091526",
      "--gate-c": "#10233f",
      "--gate-line": "rgba(212, 175, 55, 0.2)",
    } as React.CSSProperties,
    envelope: {
      "--gate-a": "#150804",
      "--gate-b": "#2c1009",
      "--gate-c": "#451708",
      "--gate-line": "rgba(212, 175, 55, 0.22)",
    } as React.CSSProperties,
    bloom: {
      "--gate-a": "#fdf5f2",
      "--gate-b": "#f8e1e7",
      "--gate-c": "#f0c6d1",
      "--gate-line": "rgba(200, 125, 138, 0.4)",
    } as React.CSSProperties,
    unfold: {
      "--gate-a": "#050c17",
      "--gate-b": "#091526",
      "--gate-c": "#10233f",
      "--gate-line": "rgba(212, 175, 55, 0.2)",
    } as React.CSSProperties,
    scroll: {
      "--gate-a": "#2d0507",
      "--gate-b": "#3f080a",
      "--gate-c": "#560d0f",
      "--gate-line": "rgba(251, 191, 36, 0.22)",
    } as React.CSSProperties,
    postcard: {
      "--gate-a": "#082026",
      "--gate-b": "#0c2b33",
      "--gate-c": "#114049",
      "--gate-line": "rgba(230, 184, 156, 0.22)",
    } as React.CSSProperties,
  };

  const enterHint = (
    <p className="pointer-events-none absolute bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white">
      Scroll or press Esc
    </p>
  );

  const gates = (
    <>
      <div className="wi-gate-panel wi-gate-l" aria-hidden="true" />
      <div className="wi-gate-panel wi-gate-r" aria-hidden="true" />
      {enterHint}
    </>
  );

  if (variant === "doors") {
    return (
      <div className={`${wrap} bg-[#110604]`} style={{ background: "#110604", cursor: "default" }}>
        <PalaceDoors names={names} blessing={blessing} subtitle={subtitle} onDone={dismiss} />
      </div>
    );
  }

  if (variant === "bell") {
    return (
      <div className={`${wrap} bg-[#380709]`} style={{ background: "#380709", cursor: "default" }}>
        <DiyaBell names={names} blessing={blessing} subtitle={subtitle} onDone={dismiss} />
      </div>
    );
  }

  if (variant === "petal") {
    return (
      <div className={`${wrap} bg-[#fdf5f2]`} style={{ background: "#fdf5f2", cursor: "default" }}>
        <PetalUnfold names={names} blessing={blessing} subtitle={subtitle} onDone={dismiss} />
      </div>
    );
  }

  if (variant === "flip") {
    return (
      <div className={`${wrap} bg-[#d9d3cb]`} style={{ background: "#d9d3cb", cursor: "default" }}>
        <CardFlip names={names} blessing={blessing} subtitle={subtitle} onDone={dismiss} />
      </div>
    );
  }

  if (variant === "envelope") {
    const exp = experienceFor("royal-heritage");
    return (
      <div className={`${wrap} bg-[#110604]`} style={gateVars[variant]}>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, rgba(212,175,55,0.16), transparent 60%)",
          }}
        />
        <OpeningDiyas flame="#FEF08A" bowl="#a9243d" />
        <EnvelopeReveal
          names={names}
          blessing={blessing}
          subtitle={subtitle}
          theme={theme ?? exp.envelope!}
          timing={timing ?? { open: 780, reveal: 1900 }}
          onDone={dismiss}
        />
      </div>
    );
  }

  if (variant === "ribbon") {
    return (
      <div className={`${wrap} bg-[#0d2f38]`} style={{ background: "#0d2f38", cursor: "default" }}>
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(circle at 50% 20%, rgba(214,138,89,0.28), transparent 58%)" }}
        />
        <RibbonPull names={names} blessing={blessing} subtitle={subtitle} onDone={dismiss} />
      </div>
    );
  }

  const SCENES = {
    bloom: { bg: "#fdf5f2", glow: "radial-gradient(circle at 50% 35%, rgba(232,160,180,0.35), transparent 62%)" },
    unfold: { bg: "#091526", glow: "radial-gradient(circle at 50% 35%, rgba(212,175,55,0.2), transparent 60%)" },
    scroll: { bg: "#380709", glow: "radial-gradient(circle at 50% 30%, rgba(245,158,11,0.22), transparent 60%)" },
    postcard: { bg: "#0d2f38", glow: "radial-gradient(circle at 50% 25%, rgba(214,138,89,0.3), transparent 55%)" },
  } as const;

  if (variant === "bloom" || variant === "unfold" || variant === "scroll" || variant === "postcard") {
    const exp = experienceFor(
      variant === "bloom" ? "floral-romance" : variant === "unfold" ? "modern-minimal" : variant === "scroll" ? "traditional-vivah" : "destination-wedding"
    );
    const t = timing ?? { open: exp.timing.open, reveal: exp.timing.reveal };
    const scene = SCENES[variant];
    return (
      <div className={`${wrap}`} style={{ ...gateVars[variant], background: scene.bg }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: scene.glow }} />
        {variant === "unfold" && <OpeningStars />}
        {variant === "bloom" && (
          <BloomReveal names={names} blessing={blessing} subtitle={subtitle} timing={t} onDone={dismiss} />
        )}
        {variant === "unfold" && (
          <UnfoldReveal names={names} blessing={blessing} subtitle={subtitle} timing={t} onDone={dismiss} />
        )}
        {variant === "scroll" && (
          <TempleScrollReveal names={names} blessing={blessing} subtitle={subtitle} timing={t} onDone={dismiss} />
        )}
        {variant === "postcard" && (
          <PostcardReveal names={names} blessing={blessing} subtitle={subtitle} timing={t} onDone={dismiss} />
        )}
        {enterHint}
      </div>
    );
  }

  if (variant === "curtain") {
    return (
      <div
        className={`${wrap} bg-[#110604]`}
        style={gateVars[variant]}
        onClick={dismiss}
        role="button"
        aria-label="Open wedding invitation"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") dismiss();
        }}
      >
        {gates}

        <svg
          className="wi-spin-slow pointer-events-none absolute h-[480px] w-[480px] text-[#d4af37]/15"
          viewBox="0 0 200 200"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="100" cy="100" r="94" stroke="currentColor" strokeWidth="0.4" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="78" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.4" strokeDasharray="6 4" />
        </svg>

        <div className="wi-invite-card wi-frame-fine relative z-10 mx-6 max-w-lg rounded-3xl bg-[#190906]/92 px-10 py-14 text-center shadow-[0_35px_95px_rgba(0,0,0,0.85)] backdrop-blur-md">
          <FiligreeCorners color="rgba(212,175,55,0.65)" />
          <span
            aria-hidden="true"
            className="font-regal wi-text-outline-gold pointer-events-none block text-6xl sm:text-7xl leading-none -mb-6 opacity-45"
          >
            {initials}
          </span>
          <p className="font-regal relative z-10 text-[11px] uppercase tracking-[0.34em] text-[#e8cf8f]/85">
            {blessing ?? "॥ श्री गणेशाय नमः ॥"}
          </p>
          <h2 className="font-regal wi-couple-heading wi-gold-shimmer relative z-10 mt-4 text-3xl leading-tight sm:text-5xl">
            {names}
          </h2>
          {subtitle && (
            <p className="mt-2 font-display-luxury italic text-lg text-[#f3e5c3]/75">{subtitle}</p>
          )}
          <div className="wi-seal-cta mt-8 inline-flex items-center gap-2 rounded-full bg-[#d4af37]/12 px-6 py-2.5 text-[11px] uppercase tracking-[0.32em] text-[#f3e5c3] shadow-[inset_0_0_0_0.75px_rgba(212,175,55,0.45)]">
            <span>Open Invitation</span>
            <span aria-hidden="true">✦</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "petals") {
    return (
      <div
        className={`${wrap} bg-[#fdf5f2]`}
        style={gateVars[variant]}
        onClick={dismiss}
        role="button"
        aria-label="Open floral invitation"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") dismiss();
        }}
      >
        {gates}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(232,160,180,0.22), transparent 50%), radial-gradient(circle at 80% 80%, rgba(212,175,55,0.12), transparent 55%)",
          }}
        />
        {[
          { left: "10%", delay: "0s", dur: "7s" },
          { left: "26%", delay: "0.8s", dur: "8.5s" },
          { left: "44%", delay: "0.3s", dur: "6.5s" },
          { left: "62%", delay: "1.2s", dur: "8s" },
          { left: "78%", delay: "0.5s", dur: "7.2s" },
          { left: "90%", delay: "1.5s", dur: "9s" },
        ].map((p, i) => (
          <svg
            key={i}
            className="wi-petal pointer-events-none absolute top-0 h-7 w-7 text-[#d98a9c]/50"
            style={
              {
                left: p.left,
                "--delay": p.delay,
                "--dur": p.dur,
              } as React.CSSProperties
            }
            viewBox="0 0 32 32"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M16 2C10 8 6 15 10 23C13 28 19 28 22 23C26 15 22 8 16 2Z" />
          </svg>
        ))}

        <div className="wi-invite-card relative z-10 mx-6 max-w-lg rounded-[2.75rem] bg-white/90 px-10 py-14 text-center shadow-[0_30px_80px_-20px_rgba(160,80,100,0.2),inset_0_0_0_0.75px_rgba(217,138,156,0.45)] backdrop-blur-md">
          <FiligreeCorners color="rgba(200,125,138,0.55)" />
          <span
            aria-hidden="true"
            className="font-display-luxury wi-text-outline-rose pointer-events-none block text-6xl sm:text-7xl italic leading-none -mb-5 opacity-55"
          >
            {initials}
          </span>
          <p className="font-body-luxury text-[11px] uppercase tracking-[0.34em] text-[#b36a7a]">
            {blessing ?? "Together with their families"}
          </p>
          <p className="font-script-luxury mt-3 text-4xl text-[#c87d8a]">The Wedding of</p>
          <h2 className="font-display-luxury wi-couple-heading mt-1 text-4xl font-normal italic text-[#4a252a] sm:text-5xl">
            {names}
          </h2>
          <div className="mx-auto my-5 h-[0.75px] w-24 bg-gradient-to-r from-transparent via-[#d98a9c] to-transparent" />
          <span className="wi-seal-cta inline-flex items-center gap-2 rounded-full bg-[#fdf5f2] px-6 py-2.5 text-[11px] uppercase tracking-[0.28em] text-[#7a424c] shadow-[inset_0_0_0_0.75px_rgba(217,138,156,0.45)]">
            Unseal Invitation ✦
          </span>
        </div>
      </div>
    );
  }

  if (variant === "diya") {
    return (
      <div
        className={`${wrap} bg-[#380709]`}
        style={gateVars[variant]}
        onClick={dismiss}
        role="button"
        aria-label="Open sacred vivah invitation"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") dismiss();
        }}
      >
        {gates}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(245,158,11,0.22) 0%, transparent 62%)",
          }}
        />
        <svg
          className="wi-spin-slow pointer-events-none absolute h-[480px] w-[480px] text-[#f59e0b]/15"
          viewBox="0 0 200 200"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="72" stroke="currentColor" strokeWidth="0.6" />
          <rect
            x="50"
            y="50"
            width="100"
            height="100"
            stroke="currentColor"
            strokeWidth="0.5"
            transform="rotate(45 100 100)"
          />
        </svg>

        <div className="wi-invite-card wi-frame-fine relative z-10 mx-6 max-w-lg rounded-3xl bg-[#4a0b0d]/95 px-10 py-14 text-center shadow-[0_30px_90px_rgba(0,0,0,0.75)]">
          <FiligreeCorners color="rgba(251,191,36,0.65)" />
          <div className="wi-pulse-glow mx-auto mb-4 flex h-18 w-18 items-center justify-center">
            <svg width="58" height="58" viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <path
                d="M32 8C32 8 24 19 24 25C24 29.4 27.6 33 32 33C36.4 33 40 29.4 40 25C40 19 32 8 32 8Z"
                fill="url(#flameGrad)"
              />
              <path
                d="M12 36C12 46 21 52 32 52C43 52 52 46 52 36H12Z"
                fill="#D4AF37"
                stroke="#FDE68A"
                strokeWidth="1"
              />
              <defs>
                <linearGradient id="flameGrad" x1="32" y1="8" x2="32" y2="33" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FEF08A" />
                  <stop offset="0.6" stopColor="#F59E0B" />
                  <stop offset="1" stopColor="#DC2626" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p className="font-regal text-xs tracking-[0.32em] text-[#fde68a]">
            {blessing ?? "॥ शुभ विवाह · श्री गणेशाय नमः ॥"}
          </p>
          <h2 className="font-regal wi-couple-heading wi-gold-shimmer mt-4 text-3xl sm:text-5xl">{names}</h2>
          <p className="wi-seal-cta mt-7 inline-flex items-center gap-2 rounded-full bg-[#f59e0b]/15 px-6 py-2.5 text-[11px] uppercase tracking-[0.28em] text-[#fef3c7] shadow-[inset_0_0_0_0.75px_rgba(253,230,138,0.45)]">
            Seek Blessings &amp; Enter ✦
          </p>
        </div>
      </div>
    );
  }

  if (variant === "waves") {
    return (
      <div
        className={`${wrap} bg-[#0d2f38] text-[#f7f3eb]`}
        style={gateVars[variant]}
        onClick={dismiss}
        role="button"
        aria-label="Open destination wedding invitation"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") dismiss();
        }}
      >
        {gates}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 25%, rgba(214,138,89,0.28), transparent 55%), linear-gradient(to bottom, #0d2f38, #144652)",
          }}
        />
        <div className="wi-invite-card relative z-10 mx-6 max-w-lg rounded-[2.25rem] bg-white/[0.08] px-10 py-14 text-center shadow-[0_30px_80px_rgba(0,0,0,0.45),inset_0_0_0_0.75px_rgba(247,243,235,0.25)] backdrop-blur-md">
          <FiligreeCorners color="rgba(230,184,156,0.5)" />
          <span
            aria-hidden="true"
            className="font-display-luxury wi-text-outline-light pointer-events-none block text-6xl sm:text-7xl italic leading-none -mb-5 opacity-45"
          >
            {initials}
          </span>
          <p className="font-body-luxury text-[11px] uppercase tracking-[0.34em] text-[#e6b89c]">
            Boarding Pass · Coastal Celebration
          </p>
          <h2 className="font-display-luxury wi-couple-heading mt-4 text-4xl font-normal italic text-white sm:text-6xl">
            {names}
          </h2>
          <p className="mt-2 text-xs uppercase tracking-[0.28em] text-white/70">
            {blessing ?? "Two cultures · One coastline"}
          </p>
          <div className="my-6 flex items-center justify-center gap-3 text-xs tracking-[0.25em] text-[#e6b89c]">
            <span>GOI</span>
            <span className="h-[0.75px] w-12 bg-[#e6b89c]/50" />
            <span>✦</span>
            <span className="h-[0.75px] w-12 bg-[#e6b89c]/50" />
            <span>FOREVER</span>
          </div>
          <span className="wi-seal-cta inline-flex items-center gap-2 rounded-full bg-[#f7f3eb] px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.25em] text-[#0d2f38]">
            Explore Itinerary →
          </span>
        </div>
      </div>
    );
  }

  // Royal Neelam Blue Opening Reveal
  return (
    <div
      className={`${wrap} bg-[#091526] text-[#f4efe6]`}
      style={gateVars[variant]}
      onClick={dismiss}
      role="button"
      aria-label="Open wedding invitation"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") dismiss();
      }}
    >
      {gates}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(212,175,55,0.22) 0%, rgba(16,35,63,0.6) 50%, transparent 75%)",
        }}
      />
      <div className="wi-invite-card wi-frame-fine relative z-10 mx-6 max-w-xl rounded-3xl bg-[#10233f]/95 px-10 py-14 text-center shadow-[0_30px_90px_rgba(0,0,0,0.7)]">
        <FiligreeCorners color="rgba(212,175,55,0.6)" />
        <span
          aria-hidden="true"
          className="font-regal wi-text-outline-gold pointer-events-none block text-6xl sm:text-7xl leading-none -mb-5 opacity-45"
        >
          {initials}
        </span>
        <p className="font-regal text-xs uppercase tracking-[0.34em] text-[#e8cf8f]">
          {blessing ?? "॥ श्री गणेशाय नमः · शुभ विवाह ॥"}
        </p>
        <h2 className="font-display-luxury wi-couple-heading wi-gold-shimmer mt-4 text-4xl italic sm:text-5xl">
          {names}
        </h2>
        <div className="mx-auto my-5 h-[0.75px] w-24 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
        <p className="wi-seal-cta inline-flex items-center gap-2 rounded-full bg-[#d4af37]/15 px-6 py-2.5 text-xs uppercase tracking-[0.28em] text-[#f4efe6] shadow-[inset_0_0_0_0.75px_rgba(212,175,55,0.45)]">
          Tap to Open Invitation ✦
        </p>
      </div>
    </div>
  );
}
