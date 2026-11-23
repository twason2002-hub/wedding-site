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

/**
 * Signature interactions. Each key is a JSON toggle.
 * Opening signatures (doors, bell, petals) replace `opening` when true.
 * The others layer onto the page and can be combined.
 */
export interface SignatureFlags {
  palaceDoors: boolean;
  diyaBell: boolean;
  petalUnfold: boolean;
  cardFlip: boolean;
  coastParallax: boolean;
  heroParallax: boolean;
  scrollTilt: boolean;
  headingDepth: boolean;
}

/**
 * Short accents. Transform or opacity only, and each template turns on a few
 * so they don't stack. Reduced motion leaves every one of these static.
 */
export interface DelightFlags {
  /** Gold motes when the opening reveals the names. */
  goldDust: boolean;
  /** Idle sway of the hanging bell, inviting a pull. */
  idleSway: boolean;
  /** One light sweep across the names as they appear. */
  nameSweep: boolean;
  /** Soft flutter of the destination ribbon at rest. */
  ribbonFlutter: boolean;
  /** RSVP card rises with a small burst. */
  rsvpLift: boolean;
  /** Countdown digits ease when they change. */
  countdownTick: boolean;
  /** Gallery photos lean toward a finger or cursor. */
  galleryTilt: boolean;
  /** Section rule draws out from the centre. */
  dividerDraw: boolean;
}

export const DELIGHT_OFF: DelightFlags = {
  goldDust: false,
  idleSway: false,
  nameSweep: false,
  ribbonFlutter: false,
  rsvpLift: false,
  countdownTick: false,
  galleryTilt: false,
  dividerDraw: false,
};

/** Where a generated layer sits in the hero. Transform-only; no layout animation. */
export type ParallaxPosition =
  | "background"
  | "frame"
  | "top"
  | "bottom"
  | "corner"
  | "edges"
  | "overlay"
  | "tilt";

export interface ParallaxLayer {
  src: string;
  /** Scroll travel in px. Larger values sit closer to the viewer. */
  depth: number;
  position: ParallaxPosition;
  opacity?: number;
  width: number;
  height: number;
  /** cover anchors a full-bleed plate to the bottom; shore keeps a waterline; contain keeps a cut-out intact. */
  fit?: "cover" | "contain" | "shore";
  /** Soften a layer into the plate behind it. */
  fade?: "top" | "bottom";
}

export interface SceneAccents {
  crest?: string;
  frame?: string;
  envelope?: string;
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
  signature: SignatureFlags;
  /**
   * Layered hero art. `depth` is scroll travel; `position` places the cut-out.
   * Omitted layers stay off so a template can keep the older depth ornaments.
   */
  parallaxLayers?: ParallaxLayer[];
  /** Scrim behind names and the date so type stays at least 4.5:1. */
  parallaxScrim?: "dark" | "light" | "palace" | "coast" | "none";
  accents?: SceneAccents;
  /** Omitted means every accent is off. */
  delight?: DelightFlags;
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

const ART = "/weddings/parallax";

function art(
  file: string,
  depth: number,
  position: ParallaxPosition,
  opacity: number,
  width: number,
  height: number,
  fit?: "cover" | "contain" | "shore",
): ParallaxLayer {
  return { src: `${ART}/${file}.webp`, depth, position, opacity, width, height, fit };
}

const ROYAL_LAYERS: ParallaxLayer[] = [
  art("royal-skyline-bg", 36, "background", 1, 720, 1280, "cover"),
  art("royal-arch-frame", 14, "frame", 0.92, 689, 1179),
  art("royal-lanterns", 64, "top", 0.82, 627, 1024),
];

const VIVAH_LAYERS: ParallaxLayer[] = [
  art("vivah-mandap-bg", 32, "background", 1, 720, 1280),
  art("vivah-toran", 18, "top", 1, 1280, 362),
  art("vivah-kalash", 52, "bottom", 1, 588, 768),
];

const FLORAL_LAYERS: ParallaxLayer[] = [
  art("floral-garden-bg", 30, "background", 1, 720, 1280),
  art("floral-cluster", 58, "corner", 1, 898, 947),
  art("floral-petals", 84, "overlay", 0.58, 608, 1161),
];

const DESTINATION_LAYERS: ParallaxLayer[] = [
  art("destination-sky-bg", 34, "background", 1, 720, 1280),
  { ...art("destination-palms", 22, "edges", 0.92, 720, 1258), fade: "bottom" },
  { ...art("destination-sand", 36, "bottom", 1, 720, 493, "shore"), fade: "top" },
];

const MINIMAL_LAYERS: ParallaxLayer[] = [art("minimal-suite", 12, "tilt", 1, 539, 700)];

const CREST_FRAME_ENVELOPE: SceneAccents = {
  crest: `${ART}/shared-ganesh-crest.webp`,
  frame: `${ART}/shared-gold-frame.webp`,
  envelope: `${ART}/shared-envelope.webp`,
};

const FRAME_ENVELOPE: SceneAccents = {
  frame: `${ART}/shared-gold-frame.webp`,
  envelope: `${ART}/shared-envelope.webp`,
};

function delight(flags: Partial<DelightFlags>): DelightFlags {
  return { ...DELIGHT_OFF, ...flags };
}

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
      signature: {
        palaceDoors: true,
        diyaBell: false,
        petalUnfold: false,
        cardFlip: false,
        coastParallax: false,
        heroParallax: true,
        scrollTilt: true,
        headingDepth: true,
      },
      parallaxLayers: ROYAL_LAYERS,
      parallaxScrim: "palace",
      accents: CREST_FRAME_ENVELOPE,
      delight: delight({
        goldDust: true,
        nameSweep: true,
        rsvpLift: true,
        countdownTick: true,
        galleryTilt: true,
        dividerDraw: true,
      }),
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
      signature: {
        palaceDoors: false,
        diyaBell: false,
        petalUnfold: true,
        cardFlip: false,
        coastParallax: false,
        heroParallax: true,
        scrollTilt: true,
        headingDepth: true,
      },
      parallaxLayers: FLORAL_LAYERS,
      parallaxScrim: "light",
      accents: FRAME_ENVELOPE,
      delight: delight({
        nameSweep: true,
        rsvpLift: true,
        countdownTick: true,
        galleryTilt: true,
        dividerDraw: true,
      }),
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
      signature: {
        palaceDoors: false,
        diyaBell: false,
        petalUnfold: false,
        cardFlip: true,
        coastParallax: false,
        heroParallax: true,
        scrollTilt: true,
        headingDepth: true,
      },
      parallaxLayers: MINIMAL_LAYERS,
      parallaxScrim: "none",
      accents: FRAME_ENVELOPE,
      delight: delight({
        nameSweep: true,
        rsvpLift: true,
        countdownTick: true,
        galleryTilt: true,
      }),
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
      signature: {
        palaceDoors: false,
        diyaBell: true,
        petalUnfold: false,
        cardFlip: false,
        coastParallax: false,
        heroParallax: true,
        scrollTilt: true,
        headingDepth: true,
      },
      parallaxLayers: VIVAH_LAYERS,
      parallaxScrim: "dark",
      accents: CREST_FRAME_ENVELOPE,
      delight: delight({
        goldDust: true,
        idleSway: true,
        nameSweep: true,
        rsvpLift: true,
        countdownTick: true,
        dividerDraw: true,
      }),
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
      signature: {
        palaceDoors: false,
        diyaBell: false,
        petalUnfold: false,
        cardFlip: false,
        coastParallax: true,
        heroParallax: false,
        scrollTilt: true,
        headingDepth: true,
      },
      parallaxLayers: DESTINATION_LAYERS,
      parallaxScrim: "coast",
      accents: FRAME_ENVELOPE,
      delight: delight({
        nameSweep: true,
        ribbonFlutter: true,
        rsvpLift: true,
        countdownTick: true,
        galleryTilt: true,
        dividerDraw: true,
      }),
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
