import type { Metadata } from "next";
import type { WeddingData } from "./types";
import { experienceFor } from "./template-experience";

/** Absolute site origin. NEXT_PUBLIC_SITE_URL wins; otherwise the Vercel host. */
export function siteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

export function metadataBase(): URL {
  return new URL(`${siteOrigin()}/`);
}

export function compactDate(display: string, countdown?: string): string {
  if (countdown) {
    const parsed = new Date(countdown);
    if (!Number.isNaN(parsed.getTime())) {
      return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(parsed);
    }
  }
  return display.split("·")[0]?.trim() || display;
}

export function weddingCity(wedding: Pick<WeddingData, "couple" | "venue" | "events">): string {
  const fromDisplay = wedding.couple.weddingDateDisplay.split("·")[1]?.trim();
  if (fromDisplay) return fromDisplay;
  const address = wedding.venue?.address || wedding.events[0]?.address || "";
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const last = parts[parts.length - 1]?.replace(/\b\d{5,6}\b/g, "").trim();
  return last || "with both families";
}

export function inviteTitle(bride: string, groom: string, dateLabel: string): string {
  return `${bride} & ${groom} are getting married | ${dateLabel}`;
}

export function inviteDescription(bride: string, groom: string, when: string, city: string): string {
  return `You are warmly invited to celebrate ${bride} & ${groom} on ${when} in ${city}. Join the families for blessings, music, and a day you will always remember.`;
}

export interface OgCardInput {
  eyebrow: string;
  title: string;
  line: string;
  date: string;
  city: string;
  bg: string;
  ink: string;
  accent: string;
  surface: string;
  motif: "royal" | "floral" | "minimal" | "vivah" | "destination" | "brand";
}

export function cardForWedding(wedding: WeddingData): OgCardInput {
  const exp = experienceFor(wedding.templateSlug);
  const when = wedding.couple.weddingDateDisplay.split("·")[0]?.trim() || wedding.couple.weddingDateDisplay;
  const city = weddingCity(wedding);
  const motif =
    wedding.templateSlug === "floral-romance"
      ? "floral"
      : wedding.templateSlug === "modern-minimal"
        ? "minimal"
        : wedding.templateSlug === "traditional-vivah"
          ? "vivah"
          : wedding.templateSlug === "destination-wedding"
            ? "destination"
            : "royal";
  return {
    eyebrow: "You are invited",
    title: `${wedding.couple.bride} & ${wedding.couple.groom}`,
    line: "are getting married",
    date: compactDate(wedding.couple.weddingDateDisplay, wedding.couple.countdownDate),
    city,
    bg: exp.palette.bg,
    ink: exp.palette.ink,
    accent: exp.palette.accent,
    surface: exp.palette.surface,
    motif,
  };
}

export function marketingCard(): OgCardInput {
  return {
    eyebrow: "Inviteo",
    title: "Indian wedding invitations",
    line: "One beautiful link for every family group",
    date: "Five handcrafted designs",
    city: "RSVP, maps and WhatsApp sharing",
    bg: "#140806",
    ink: "#f6ead4",
    accent: "#d4af37",
    surface: "#26100c",
    motif: "brand",
  };
}

export function invitePageMetadata(wedding: WeddingData | null, path: string): Metadata {
  const base = metadataBase();
  if (!wedding) {
    return { metadataBase: base, title: "Wedding not found" };
  }
  const when = wedding.couple.weddingDateDisplay.split("·")[0]?.trim() || wedding.couple.weddingDateDisplay;
  const dateLabel = compactDate(wedding.couple.weddingDateDisplay, wedding.couple.countdownDate);
  const city = weddingCity(wedding);
  const title = inviteTitle(wedding.couple.bride, wedding.couple.groom, dateLabel);
  const description = inviteDescription(wedding.couple.bride, wedding.couple.groom, when, city);
  return pageMetadata(title, description, path);
}

export function legacyCoupleMetadata(input: {
  bride: string;
  groom: string;
  dateDisplay: string;
  countdown?: string;
  city: string;
  path: string;
}): Metadata {
  const dateLabel = compactDate(input.dateDisplay, input.countdown);
  return pageMetadata(
    inviteTitle(input.bride, input.groom, dateLabel),
    inviteDescription(input.bride, input.groom, input.dateDisplay, input.city),
    input.path,
  );
}

export function marketingMetadata(title: string, description: string, path: string): Metadata {
  return pageMetadata(title, description, path);
}

function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    metadataBase: metadataBase(),
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      siteName: "Inviteo",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${path}/opengraph-image`],
    },
  };
}
