"use client";

import { useEffect, useRef, useState } from "react";
import type { GalleryImage } from "@/lib/weddings/types";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "./WeddingIcons";
import { prefersReducedMotion } from "./effects/gsap-setup";

export default function Gallery({
  images,
  variant = "default",
  layout: layoutProp,
}: {
  images: GalleryImage[];
  variant?: "default" | "royal" | "floral" | "minimal" | "vivah" | "coastal";
  layout?: "grid" | "masonry" | "polaroid";
}) {
  const [open, setOpen] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const touchX = useRef<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const layout = layoutProp ?? (variant === "floral" ? "polaroid" : variant === "coastal" ? "masonry" : "grid");

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((prev) => (prev === null ? null : (prev + 1) % images.length));
      if (e.key === "ArrowLeft")
        setOpen((prev) => (prev === null ? null : (prev + images.length - 1) % images.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length]);

  useEffect(() => {
    if (open === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (open === null || !playing) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setOpen((prev) => (prev === null ? prev : (prev + 1) % images.length));
    }, 4000);
    return () => window.clearInterval(id);
  }, [open, playing, images.length]);

  const toggleSlideshow = () => {
    if (prefersReducedMotion()) return;
    setPlaying((p) => !p);
  };

  if (!images.length) return null;

  const isDark = variant === "royal" || variant === "vivah";

  return (
    <>
      <div
        ref={galleryRef}
        className={`wi-gallery ${
          layout === "masonry"
            ? "columns-2 gap-5 lg:columns-3"
            : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {images.map((img, i) => {
          const featured = layout === "grid" && i === 0 && images.length >= 5 && images.length % 2 === 1;
          const tilt = layout === "polaroid" ? (i % 2 ? "sm:rotate-[1.4deg]" : "sm:-rotate-[1.4deg]") : "";
          return (
            <button
              key={i}
              data-gallery-item="true"
              onClick={() => setOpen(i)}
              className={`group relative overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform duration-300 hover:rotate-0 ${
                layout === "masonry" ? "mb-5 inline-block w-full break-inside-avoid" : ""
              } ${
                variant === "minimal"
                  ? "rounded-none shadow-[inset_0_0_0_0.75px_rgba(23,21,19,0.16)]"
                  : variant === "floral"
                  ? "rounded-[2rem] p-1.5 pb-3 bg-white shadow-[0_18px_42px_-20px_rgba(168,90,110,0.18),inset_0_0_0_0.75px_rgba(217,138,156,0.38)]"
                  : isDark
                  ? "rounded-2xl p-1.5 bg-white/[0.025] shadow-[inset_0_0_0_0.75px_rgba(212,175,55,0.32)]"
                  : "rounded-2xl p-1.5 bg-white shadow-[0_18px_42px_-20px_rgba(0,0,0,0.14),inset_0_0_0_0.75px_rgba(0,0,0,0.08)]"
              } ${featured ? "sm:col-span-2" : ""} ${tilt}`}
              aria-label={`Open photo: ${img.alt}`}
            >
              <div
                className={`wi-zoom relative overflow-hidden ${
                  variant === "minimal"
                    ? "rounded-none"
                    : variant === "floral"
                    ? "rounded-[1.65rem]"
                    : "rounded-xl"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className={`${featured ? "aspect-[16/10]" : layout === "masonry" ? "h-auto" : "aspect-[4/3]"} w-full object-cover`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-5">
                  <div>
                    <p className="font-display-luxury text-lg italic text-white">
                      {img.caption ?? img.alt}
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/85 mt-0.5">
                      View Full Frame ↗
                    </p>
                  </div>
                </div>
              </div>
              {variant === "minimal" && img.caption && (
                <div className="px-3 py-2.5 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-[#7c7267] bg-[#f6f4f0]">
                  <span>{img.caption}</span>
                  <span>0{i + 1}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {open !== null && (
        <div
          className="wi-lightbox fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/92 p-4 backdrop-blur-xl"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <div className="mb-4 flex w-full max-w-5xl items-center justify-between text-white/80 px-2">
            <span className="font-regal text-xs uppercase tracking-[0.28em]">
              Frame 0{open + 1} / 0{images.length}
            </span>
            <span className="flex items-center gap-2">
              <button
                className="wi-action-lift inline-flex items-center gap-1.5 rounded-full bg-white/10 px-5 py-2 text-xs uppercase tracking-[0.22em] text-white shadow-[inset_0_0_0_0.75px_rgba(255,255,255,0.25)]"
                onClick={toggleSlideshow}
                aria-label={playing ? "Pause slideshow" : "Play slideshow"}
                aria-pressed={playing}
              >
                <span aria-hidden="true">{playing ? "❚❚" : "▶"}</span>
                <span>{playing ? "Pause" : "Slides"}</span>
              </button>
              <button
                className="wi-action-lift inline-flex items-center gap-1.5 rounded-full bg-white/10 px-5 py-2 text-xs uppercase tracking-[0.22em] text-white shadow-[inset_0_0_0_0.75px_rgba(255,255,255,0.25)]"
                onClick={() => setOpen(null)}
                aria-label="Close viewer"
              >
                <CloseIcon size={14} />
                <span>Close</span>
              </button>
            </span>
          </div>
          <div
            className="relative flex w-full max-w-5xl items-center justify-center"
            style={{ touchAction: "pan-y" }}
            onTouchStart={(e) => {
              touchX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) < 60) return;
              setPlaying(false);
              setOpen((prev) =>
                prev === null ? prev : (prev + (dx < 0 ? 1 : images.length - 1)) % images.length
              );
            }}
          >
            <button
              className="wi-action-lift absolute left-2 md:left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white shadow-[inset_0_0_0_0.75px_rgba(255,255,255,0.22)]"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((open + images.length - 1) % images.length);
              }}
              aria-label="Previous photo"
            >
              <ChevronLeftIcon size={20} />
            </button>
            <div
              key={open}
              className="wi-lightbox-img flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[open].src}
                alt={images[open].alt}
                className="max-h-[78vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
              />
            </div>
            <button
              className="wi-action-lift absolute right-2 md:right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white shadow-[inset_0_0_0_0.75px_rgba(255,255,255,0.22)]"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((open + 1) % images.length);
              }}
              aria-label="Next photo"
            >
              <ChevronRightIcon size={20} />
            </button>
          </div>
          {images[open].caption && (
            <p className="mt-4 font-display-luxury text-xl italic text-white/90">
              {images[open].caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}