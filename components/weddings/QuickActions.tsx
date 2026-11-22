"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { WeddingData } from "@/lib/weddings/types";
import { absoluteInviteUrl, mapsUrl, shareTextFor, whatsappShare } from "@/lib/weddings/helpers";
import { experienceFor } from "@/lib/weddings/template-experience";
import { CalendarIcon, MapPinIcon, ShareIcon } from "./WeddingIcons";
import { useWeddingMusic } from "./MusicToggle";
import { Music } from "@/components/animate-ui/icons/music";

const JUMPS: { label: string; selector: string }[] = [
  { label: "Events", selector: 'section[aria-label="Events"], section[aria-label="Itinerary"]' },
  { label: "Gallery", selector: 'section[aria-label="Gallery"]' },
  { label: "Venue", selector: 'section[aria-label="Venue"], section[aria-label="Travel and stay"]' },
  { label: "RSVP", selector: 'section[aria-label="RSVP"]' },
];

/**
 * Guest navigation: a centred action bar (RSVP, map, share, music) below the
 * large breakpoint, and a section rail above it. Hidden while the opening
 * is sealed so it never sits on the overlay.
 */
export default function QuickActions({ wedding }: { wedding: WeddingData }) {
  const [show, setShow] = useState(false);
  const [sealed, setSealed] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const accent = experienceFor(wedding.templateSlug).palette.accent;
  const hasRsvp = wedding.sections?.rsvp !== false;
  const mapQuery = wedding.venue?.mapQuery;
  const music = useWeddingMusic();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.45);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setSealed(root.dataset.invite === "sealed");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-invite"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)");
    const apply = () => setNarrow(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const on = narrow && show && !sealed;
    root.classList.toggle("wi-has-dock", on);
    return () => root.classList.remove("wi-has-dock");
  }, [narrow, show, sealed]);

  const jump = (selector: string) => {
    document.querySelector(selector)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  };

  async function shareInvite() {
    const url = absoluteInviteUrl();
    const text = shareTextFor(wedding, url);
    const shareData = { title: `${wedding.couple.bride} & ${wedding.couple.groom}`, text, url };
    if (typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    window.open(whatsappShare(text), "_blank", "noopener,noreferrer");
  }

  const items: Array<{
    key: string;
    label: string;
    icon: ReactNode;
    onClick?: () => void;
    href?: string;
    accent?: boolean;
    pressed?: boolean;
  }> = [
    hasRsvp
      ? { key: "rsvp", label: "RSVP", onClick: () => jump('section[aria-label="RSVP"]'), icon: <CalendarIcon size={18} />, accent: true }
      : null,
    mapQuery
      ? { key: "map", label: "Map", href: mapsUrl(mapQuery), icon: <MapPinIcon size={18} /> }
      : null,
    { key: "share", label: "Share", onClick: () => void shareInvite(), icon: <ShareIcon size={18} /> },
    music.enabled
      ? {
          key: "music",
          label: music.playing ? "Pause" : "Music",
          onClick: () => void music.toggle(),
          icon: <Music size={18} animateOnTap />,
          pressed: music.playing,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <>
      <nav
        aria-label="Invitation sections"
        className={`fixed right-4 top-1/2 z-[60] hidden -translate-y-1/2 flex-col gap-2 transition-opacity lg:flex ${
          show && !sealed ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {JUMPS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => jump(item.selector)}
            className="inline-flex min-h-11 items-center rounded-full bg-black/55 px-3 py-2 text-left text-xs uppercase tracking-[0.16em] text-white shadow-lg backdrop-blur-md"
          >
            {item.label}
          </button>
        ))}
      </nav>

      {!sealed && (
        <nav
          aria-label="Invitation actions"
          className={`wi-action-bar fixed inset-x-0 bottom-0 z-[60] flex justify-center lg:hidden ${
            show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
          }`}
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          aria-hidden={show ? undefined : true}
        >
          <div
            className="grid w-full bg-[#14100c]/94 text-white shadow-[0_-10px_30px_rgba(0,0,0,0.28)] backdrop-blur-md"
            style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
          >
            {items.map((item) => {
              const className =
                "inline-flex min-h-11 w-full flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-semibold uppercase tracking-[0.12em]";
              const style = item.accent ? { background: accent, color: "#140806" } : undefined;
              const inner = (
                <>
                  <span className="flex h-5 items-center justify-center" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </>
              );
              if ("href" in item && item.href) {
                return (
                  <a key={item.key} href={item.href} target="_blank" rel="noreferrer" tabIndex={show ? 0 : -1} className={className} style={style}>
                    {inner}
                  </a>
                );
              }
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => item.onClick?.()}
                  tabIndex={show ? 0 : -1}
                  aria-pressed={"pressed" in item ? item.pressed : undefined}
                  className={className}
                  style={style}
                >
                  {inner}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
