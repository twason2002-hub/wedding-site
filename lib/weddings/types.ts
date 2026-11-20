/**
 * Wedding platform core types.
 * File-first: weddings live in `lib/weddings/sample-data.ts`.
 * Supabase-ready: every interface maps 1:1 to the proposed tables
 * (see public/weddings/README-ASSETS.md § "Supabase schema (deferred)").
 * Changing wedding data must never require touching template components.
 */

export type Locale = "en" | "hi";

export interface WeddingEvent {
  id: string;
  name: string;
  nameHi?: string;
  date: string; // display string, e.g. "15 February 2026"
  time: string;
  venue: string;
  address: string;
  mapQuery: string; // encoded query for Google Maps link
  calendarStart: string; // ICS basic format: 20260215T190000
  calendarEnd: string;
  dressCode?: string;
  description?: string;
  image?: string;
  showInVenue?: boolean;
  sortOrder: number;
}

export interface VenueInfo {
  name: string;
  address: string;
  mapQuery: string;
  parking?: string;
  hotels?: string[];
  travel?: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface RsvpSubmission {
  id?: string;
  weddingSlug: string;
  name: string;
  attending: boolean;
  eventIds: string[];
  guests: number;
  diet?: string;
  message?: string;
  createdAt?: string;
}

export interface WeddingData {
  slug: string;
  templateSlug: string;
  status: "draft" | "published";
  localeDefault: Locale;
  hashtag?: string;
  music?: { enabled: boolean; src: string };
  couple: {
    bride: string;
    groom: string;
    brideParents?: string;
    groomParents?: string;
    grandparents?: string;
    intro?: string;
    introHi?: string;
    loveStory?: string;
    photo?: string;
    countdownDate: string; // parseable date string
    weddingDateDisplay: string;
  };
  blessing?: string;
  blessingHi?: string;
  mantra?: string;
  events: WeddingEvent[];
  venue?: VenueInfo;
  gallery: GalleryImage[];
  videoUrl?: string;
  contacts: { numbers: string[]; whatsapp: string; rsvpNumber: string };
  sections?: {
    gallery?: boolean;
    story?: boolean;
    rsvp?: boolean;
    music?: boolean;
    venue?: boolean;
    /** Premium interactive layer — all optional, default ON when undefined. */
    effects?: boolean;
    effectsSpeed?: "calm" | "normal" | "lively";
    scratch?: boolean;
    borders?: boolean;
    wishes?: boolean;
    uploads?: boolean;
    reactions?: boolean;
    blessings?: boolean;
  };
}

export interface TemplateDefinition {
  id: string;
  slug: string;
  name: string;
  category: "royal" | "floral" | "minimal" | "traditional" | "destination";
  description: string;
  thumbnail: string; // preview image path
  fonts: { display: string; body: string };
  palette: { bg: string; ink: string; accent: string; surface: string };
  sections: string[]; // available section ids
  animation: "curtain" | "petals" | "fade" | "diya" | "waves" | "envelope" | "bloom" | "unfold" | "scroll" | "postcard";
  active: boolean;
  sortOrder: number;
}
