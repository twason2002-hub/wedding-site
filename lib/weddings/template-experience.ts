/**
 * Template experience registry — ONE place where each template declares its
 * opening animation, visual assets, palette, fonts and motion settings.
 *
 * Admin flow: picking a templateSlug auto-loads everything via
 * `experienceFor(templateSlug)` + `<TemplateOpening/>`. No manual animation
 * config. Wedding content (names/dates/photos) stays in WeddingData.
 *
 * Text/names/dates are ALWAYS HTML. Image assets here are SVG placeholders
 * until AI art replaces them (see docs/rajasthani-vows-study.md §4).
 */

export type OpeningType = "envelope" | "bloom" | "unfold" | "scroll" | "postcard" | "ribbon";

export interface EnvelopeTheme {
  /** Envelope body gradient stops + pocket shade. */
  bodyHi: string;
  bodyLo: string;
  pocketHi: string;
  pocketLo: string;
  flapHi: string;
  flapLo: string;
  trim: string;
  /** Wax seal gradient + monogram ink. */
  sealHi: string;
  sealLo: string;
  sealInk: string;
  /** Card + card text. */
  cardHi: string;
  cardLo: string;
  cardInk: string;
  cardAccent: string;
  /** Ambient petal fall during reveal (null = none). */
  petals: "marigold" | "rose" | null;
  /** Golden light burst behind the card on reveal. */
  glow: boolean;
}

/** Motion/interaction selection — JSON only, no animation logic here. */
export interface MotionConfig {
  opening: OpeningType;
  heroEffect: "arch" | "bloom" | "unfold" | "scroll" | "postcard" | "none";
  sectionTransition: "curtain" | "fade" | "iris" | "wipe" | "none";
  galleryEffect: "reveal" | "slideshow" | "lightbox" | "masonry" | "polaroid";
  interactionEffects: Array<"blessings" | "reactions" | "qr" | "countdown" | "scratch" | "glimmer">;
  intensity: "low" | "medium" | "high";
  speed: "calm" | "normal" | "lively";
  /**
   * When enabled, this replaces `opening` — it is not played on top of it.
   * `ribbon` is a pull-down tassel with a button and keyboard fallback.
   */
  pullToReveal?: { enabled: boolean; kind: "ribbon" };
}

export interface TemplateExperience {
  slug: string;
  opening: OpeningType;
  /** Total intro timeline ms (sealed → auto-dismiss). */
  timing: { open: number; reveal: number; dismiss: number };
  envelope?: EnvelopeTheme;
  /** Shared interactive layer defaults (admin can override per website). */
  features: {
    effects: { kind: "marigold" | "rose" | "gold" | "diya" | "confetti" | "palm"; speed: "calm" | "normal" | "lively"; enabled: boolean };
    scratch: { foilHi: string; foilLo: string; cardBg: string; enabled: boolean };
    borders: { motif: "palace" | "rose" | "line" | "lotus" | "palm"; enabled: boolean };
    blessings: [string, string, string];
    wishes: boolean;
    uploads: boolean;
    reactions: boolean;
  };
  motion: MotionConfig;
  /** SVG asset paths (placeholders until art is generated). */
  assets: {
    motif?: string;
    border?: string;
    overlay?: string;
    frames?: string;
  };
  palette: { bg: string; ink: string; accent: string; surface: string };
  fonts: { display: string; body: string };
  animation: { reduced: "fade-only" };
}

const ROYAL_ENVELOPE: EnvelopeTheme = {
  bodyHi: "#5e0e20",
  bodyLo: "#2b070e",
  pocketHi: "#7a1228",
  pocketLo: "#4a0b16",
  flapHi: "#8e1b32",
  flapLo: "#5e0e20",
  trim: "#d4af37",
  sealHi: "#e8c96a",
  sealLo: "#9b7318",
  sealInk: "#3a2404",
  cardHi: "#fffdf6",
  cardLo: "#f3e2bd",
  cardInk: "#7a1228",
  cardAccent: "#8a6d2b",
  petals: "marigold",
  glow: true,
};

const CLASSIC_ENVELOPE: EnvelopeTheme = {
  bodyHi: "#2c1009",
  bodyLo: "#1c0a05",
  pocketHi: "#fbf3df",
  pocketLo: "#e3cb9c",
  flapHi: "#e9d3a3",
  flapLo: "#c49a52",
  trim: "#b98a2f",
  sealHi: "#a9243d",
  sealLo: "#540a1b",
  sealInk: "#f6ead4",
  cardHi: "#fffdf6",
  cardLo: "#f6ead4",
  cardInk: "#7a1228",
  cardAccent: "#8a6d2b",
  petals: null,
  glow: false,
};

export const TEMPLATE_EXPERIENCES: Record<string, TemplateExperience> = {
  "royal-heritage": {
    slug: "royal-heritage",
    opening: "envelope",
    timing: { open: 780, reveal: 1900, dismiss: 1900 },
    features: {
      effects: { kind: "marigold", speed: "normal", enabled: true },
      scratch: { foilHi: "#e8c96a", foilLo: "#9b7318", cardBg: "#26100c", enabled: true },
      borders: { motif: "palace", enabled: true },
      wishes: true, uploads: true, reactions: true,

      blessings: [
        "May your union be as timeless as heritage itself.",
        "Two families, one royal celebration.",
        "Blessed today, blessed always.",
      ],
    },
    envelope: ROYAL_ENVELOPE,
    assets: {
      motif: "/weddings/placeholders/rajasthani-motif-lotus.svg",
      border: "/weddings/placeholders/rajasthani-motif-paisley.svg",
      overlay: "/weddings/placeholders/rajasthani-palace-bg.svg",
    },

    motion: {
      opening: "envelope",
      heroEffect: "arch",
      sectionTransition: "curtain",
      galleryEffect: "reveal",
      interactionEffects: ["blessings", "reactions", "qr", "countdown", "scratch", "glimmer"],
      intensity: "medium",
      speed: "normal",
    },    palette: { bg: "#140806", ink: "#f6ead4", accent: "#d4af37", surface: "#26100c" },
    fonts: { display: "Cinzel, Cormorant Garamond, serif", body: "Plus Jakarta Sans, sans-serif" },
    animation: { reduced: "fade-only" },
  },
  "floral-romance": {
    slug: "floral-romance",
    opening: "bloom",
    timing: { open: 700, reveal: 1800, dismiss: 1800 },
    features: {
      effects: { kind: "rose", speed: "calm", enabled: true },
      scratch: { foilHi: "#f6c9d4", foilLo: "#c87d8a", cardBg: "#ffffff", enabled: true },
      borders: { motif: "rose", enabled: true },
      wishes: true, uploads: true, reactions: true,

      blessings: [
        "May your love bloom brighter every season.",
        "Rooted in joy, blossoming forever.",
        "Two souls, one beautiful garden.",
      ],
    },
    assets: {
      motif: "/weddings/placeholders/floral-motif-bloom.svg",
      border: "/weddings/placeholders/floral-border-vine.svg",
      overlay: "/weddings/placeholders/floral-garden-bg.svg",
    },

    motion: {
      opening: "bloom",
      heroEffect: "bloom",
      sectionTransition: "fade",
      galleryEffect: "polaroid",
      interactionEffects: ["blessings", "reactions", "countdown", "scratch"],
      intensity: "medium",
      speed: "normal",
    },    palette: { bg: "#fdf7f5", ink: "#4a252a", accent: "#c87d8a", surface: "#ffffff" },
    fonts: { display: "Cormorant Garamond, Playfair Display, serif", body: "Plus Jakarta Sans, sans-serif" },
    animation: { reduced: "fade-only" },
  },
  "modern-minimal": {
    slug: "modern-minimal",
    opening: "unfold",
    timing: { open: 650, reveal: 1600, dismiss: 1600 },
    features: {
      effects: { kind: "gold", speed: "calm", enabled: true },
      scratch: { foilHi: "#e8cf8f", foilLo: "#8a6d2b", cardBg: "#10233f", enabled: true },
      borders: { motif: "line", enabled: true },
      wishes: true, uploads: true, reactions: true,

      blessings: [
        "Less noise, more love.",
        "A lifetime of quiet, certain joy.",
        "Two names, one story.",
      ],
    },
    assets: {
      motif: "/weddings/placeholders/minimal-line-mono.svg",
      border: "/weddings/placeholders/minimal-hairline.svg",
    },

    motion: {
      opening: "unfold",
      heroEffect: "unfold",
      sectionTransition: "fade",
      galleryEffect: "lightbox",
      interactionEffects: ["reactions", "countdown", "qr", "scratch"],
      intensity: "low",
      speed: "normal",
    },    palette: { bg: "#091526", ink: "#f4efe6", accent: "#d4af37", surface: "#10233f" },
    fonts: { display: "Cormorant Garamond, serif", body: "Plus Jakarta Sans, sans-serif" },
    animation: { reduced: "fade-only" },
  },
  "traditional-vivah": {
    slug: "traditional-vivah",
    opening: "scroll",
    timing: { open: 850, reveal: 2000, dismiss: 2000 },
    features: {
      effects: { kind: "diya", speed: "normal", enabled: true },
      scratch: { foilHi: "#fbbf24", foilLo: "#b45309", cardBg: "#4a0b0d", enabled: true },
      borders: { motif: "lotus", enabled: true },
      wishes: true, uploads: true, reactions: true,

      blessings: [
        "Shubh Vivah — may your bond be eternal.",
        "Blessed by family, guided by tradition.",
        "Seven steps into lifelong happiness.",
      ],
    },
    envelope: CLASSIC_ENVELOPE,
    assets: {
      motif: "/weddings/placeholders/vivah-mandala.svg",
      border: "/weddings/placeholders/vivah-toran.svg",
      overlay: "/weddings/placeholders/vivah-temple-bg.svg",
    },

    motion: {
      opening: "scroll",
      heroEffect: "scroll",
      sectionTransition: "curtain",
      galleryEffect: "reveal",
      interactionEffects: ["blessings", "reactions", "qr", "countdown", "scratch", "glimmer"],
      intensity: "medium",
      speed: "normal",
    },    palette: { bg: "#4a0b0d", ink: "#fdf1d6", accent: "#f0b429", surface: "#631215" },
    fonts: { display: "Cinzel, Playfair Display, serif", body: "Plus Jakarta Sans, sans-serif" },
    animation: { reduced: "fade-only" },
  },
  "destination-wedding": {
    slug: "destination-wedding",
    opening: "postcard",
    timing: { open: 700, reveal: 1800, dismiss: 1800 },
    features: {
      effects: { kind: "palm", speed: "normal", enabled: true },
      scratch: { foilHi: "#f9c86d", foilLo: "#b86b43", cardBg: "#ffffff", enabled: true },
      borders: { motif: "palm", enabled: true },
      wishes: true, uploads: true, reactions: true,

      blessings: [
        "Adventure begins — together.",
        "Sun, sea and a lifetime of love.",
        "The journey of forever starts here.",
      ],
    },
    assets: {
      motif: "/weddings/placeholders/dest-stamp.svg",
      border: "/weddings/placeholders/dest-postmark.svg",
      overlay: "/weddings/placeholders/dest-coast-bg.svg",
    },

    motion: {
      opening: "postcard",
      heroEffect: "postcard",
      sectionTransition: "wipe",
      galleryEffect: "masonry",
      interactionEffects: ["blessings", "reactions", "countdown", "scratch"],
      intensity: "medium",
      speed: "normal",
      pullToReveal: { enabled: true, kind: "ribbon" },
    },    palette: { bg: "#f7f3eb", ink: "#0f353e", accent: "#b86b43", surface: "#ffffff" },
    fonts: { display: "Cormorant Garamond, serif", body: "Plus Jakarta Sans, sans-serif" },
    animation: { reduced: "fade-only" },
  },
};

const FALLBACK = TEMPLATE_EXPERIENCES["royal-heritage"];

/** Experience config for a template slug (falls back to royal, never throws). */
export function experienceFor(templateSlug: string): TemplateExperience {
  return TEMPLATE_EXPERIENCES[templateSlug] ?? FALLBACK;
}
