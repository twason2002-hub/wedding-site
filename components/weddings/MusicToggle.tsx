"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Music } from "@/components/animate-ui/icons/music";

type MusicApi = { enabled: boolean; playing: boolean; toggle: () => void };

const MusicContext = createContext<MusicApi>({ enabled: false, playing: false, toggle: () => {} });

export function useWeddingMusic() {
  return useContext(MusicContext);
}

/** One audio element for the invitation. The bar and the desktop button share it. */
export function WeddingMusicProvider({
  src,
  enabled,
  children,
}: {
  src?: string;
  enabled: boolean;
  children: ReactNode;
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return () => audio.current?.pause();
  }, []);

  const toggle = useCallback(async () => {
    const el = audio.current;
    if (!el) return;
    if (!el.paused && el.volume > 0) {
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
      return;
    }
    el.volume = 0;
    try {
      await el.play();
      setPlaying(true);
      const id = window.setInterval(() => {
        if (!audio.current) {
          window.clearInterval(id);
          return;
        }
        audio.current.volume = Math.min(0.25, audio.current.volume + 0.03);
        if (audio.current.volume >= 0.25) window.clearInterval(id);
      }, 60);
    } catch {
      /* playback blocked — the guest can tap again */
    }
  }, []);

  return (
    <MusicContext.Provider value={{ enabled, playing, toggle }}>
      {enabled && src ? <audio ref={audio} src={src} loop preload="none" /> : null}
      {children}
    </MusicContext.Provider>
  );
}

function useSealed() {
  const [sealed, setSealed] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setSealed(root.dataset.invite === "sealed");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-invite"] });
    return () => observer.disconnect();
  }, []);
  return sealed;
}

/** Desktop music button. On smaller screens the action bar owns the control. */
export default function MusicToggle({ dark = false }: { dark?: boolean }) {
  const { enabled, playing, toggle } = useWeddingMusic();
  const [show, setShow] = useState(false);
  const sealed = useSealed();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!enabled || sealed) return null;
  const visible = show;

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      aria-label={playing ? "Pause wedding music" : "Play wedding music"}
      aria-pressed={playing}
      tabIndex={visible ? 0 : -1}
      aria-hidden={visible ? undefined : true}
      className={`wi-action-lift fixed right-5 bottom-5 z-[70] hidden min-h-11 min-w-11 items-center justify-center rounded-full shadow-lg lg:flex ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
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
  );
}
