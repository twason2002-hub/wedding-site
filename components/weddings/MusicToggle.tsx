"use client";

import { useEffect, useRef, useState } from "react";
import { Music } from "@/components/animate-ui/icons/music";

/**
 * Optional background music toggle. Renders only when the wedding
 * enables music. Never autoplays — starts on explicit guest tap.
 */
export default function MusicToggle({ src, dark = false }: { src: string; dark?: boolean }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      audio.current?.pause();
    };
  }, []);

  async function toggle() {
    const el = audio.current;
    if (!el) return;
    if (playing) {
      // Fade out, then pause.
      const step = el.volume / 8;
      const id = window.setInterval(() => {
        if (!audio.current) {
          window.clearInterval(id);
          return;
        }
        audio.current.volume = Math.max(0, audio.current.volume - step);
        if (audio.current.volume <= 0) {
          window.clearInterval(id);
          audio.current.pause();
          setPlaying(false);
        }
      }, 60);
    } else {
      el.volume = 0;
      try {
        await el.play();
        setPlaying(true);
        // Fade in to full volume.
        const id = window.setInterval(() => {
          if (!audio.current) {
            window.clearInterval(id);
            return;
          }
          audio.current.volume = Math.min(0.25, audio.current.volume + 0.03);
          if (audio.current.volume >= 0.25) window.clearInterval(id);
        }, 60);
      } catch {
        /* autoplay blocked — guest taps again */
      }
    }
  }

  return (
    <>
      <audio ref={audio} src={src} loop preload="none" />
      <button
        onClick={toggle}
        aria-label={playing ? "Pause wedding music" : "Play wedding music"}
        aria-pressed={playing}
        className={`wi-action-lift fixed right-4 z-[70] flex min-h-[52px] min-w-[52px] items-center justify-center rounded-full shadow-lg bottom-[calc(5.75rem+env(safe-area-inset-bottom))] transition-opacity sm:bottom-5 sm:right-5 ${
          show ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        tabIndex={show ? 0 : -1}
        aria-hidden={show ? undefined : true}
        style={{
          background: dark ? "rgba(212,175,55,.95)" : "rgba(36,26,16,.92)",
          color: dark ? "#1a0f08" : "#fdfaf3",
        }}
      >
        <span className="flex items-center justify-center gap-1.5" aria-hidden="true">
          <Music size={20} animateOnTap />
          <span className="wi-eq-live" data-playing={playing}>
            <i />
            <i />
            <i />
            <i />
          </span>
        </span>
      </button>
    </>
  );
}
