import type { WeddingData, WeddingEvent } from "./types";

/** Typed view of the wedding_content key/value document. */
export interface WeddingContentMap {
  couple?: Partial<WeddingData["couple"]>;
  events?: Partial<WeddingEvent>[];
  venue?: WeddingData["venue"];
  contacts?: WeddingData["contacts"];
  sections?: WeddingData["sections"];
  hashtag?: string;
  music?: WeddingData["music"];
  blessing?: string;
  blessingHi?: string;
  mantra?: string;
  videoUrl?: string;
}

export interface EventInput {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapQuery: string;
  dressCode: string;
  description: string;
  calendarStart: string;
  calendarEnd: string;
  showInVenue: boolean;
  sortOrder: number;
}

export interface ImageRef {
  path: string;
  alt: string;
  caption?: string;
}

export interface WebsiteInput {
  id?: string;
  templateSlug: string;
  slug: string;
  status: "draft" | "published";
  bride: string;
  groom: string;
  brideParents: string;
  groomParents: string;
  grandparents: string;
  intro: string;
  loveStory: string;
  weddingDate: string;
  countdownTime: string;
  weddingDateDisplay: string;
  hashtag: string;
  blessing: string;
  mantra: string;
  musicEnabled: boolean;
  events: EventInput[];
  venue: {
    name: string;
    address: string;
    mapQuery: string;
    parking: string;
    hotels: string[];
    travel: string;
  };
  contacts: { numbers: string[]; whatsapp: string; rsvpNumber: string };
  sections: {
    gallery: boolean;
    story: boolean;
    music: boolean;
    venue: boolean;
    effects: boolean;
    effectsSpeed: "calm" | "normal" | "lively";
    scratch: boolean;
    borders: boolean;
    wishes: boolean;
    uploads: boolean;
    reactions: boolean;
    blessings: boolean;
  };
  musicTrack: string;
  rsvpEnabled: boolean;
  noExpiry: boolean;
  expiryDays: number;
  customExpiresAt: string | null;
  coupleImage: ImageRef | null;
  galleryImages: ImageRef[];
  eventImages: Record<string, ImageRef>;
  removedStoragePaths: string[];
}

export type SaveResult = { ok: true; slug: string } | { ok: false; error: string };
