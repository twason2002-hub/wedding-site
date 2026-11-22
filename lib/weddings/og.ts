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
  const branded = `${bride} & ${groom} · ${dateLabel} | Inviteo`;
  if (branded.length <= 60) return branded;
  return `${bride} & ${groom} · ${dateLabel}`;
}

export function inviteDescription(bride: string, groom: string, when: string, city: string): string {
  return `You are invited to celebrate ${bride} and ${groom} on ${when} in ${city}. Open this Inviteo invitation for the events, maps, and RSVP.`;
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
  /** Template swatches for the gallery card. Never couple names. */
  designs?: { name: string; swatch: string }[];
}

export function cardForTemplatePreview(wedding: WeddingData, templateName: string): OgCardInput {
  return { ...cardForWedding(wedding), eyebrow: templateName };
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

/** Gallery share image: template art and design names, no couple names. */
export function templatesGalleryCard(): OgCardInput {
  return {
    eyebrow: "Inviteo",
    title: "Wedding invitation templates",
    line: "Five handcrafted designs",
    date: "Open a live preview",
    city: "Palace to beach",
    bg: "#140806",
    ink: "#f6ead4",
    accent: "#d4af37",
    surface: "#26100c",
    motif: "brand",
    designs: [
      { name: "Palace", swatch: "#6e1d22" },
      { name: "Floral", swatch: "#c87d8a" },
      { name: "Neelam", swatch: "#14315c" },
      { name: "Vivah", swatch: "#8d1d22" },
      { name: "Goa", swatch: "#b86b43" },
    ],
  };
}

const TEMPLATE_PREVIEW_COPY: Record<string, { title: string; description: string }> = {
  "royal-heritage": {
    title: "Palace Heritage Template | Inviteo",
    description:
      "Preview the Palace Heritage Inviteo template. Sample couple Diya and Aarav host a Jaipur palace wedding, with events, maps, and RSVP on one link.",
  },
  "floral-romance": {
    title: "Floral Anand Karaj Template | Inviteo",
    description:
      "Preview the Floral Anand Karaj Inviteo template. Sample couple Anaya and Kabir celebrate in Chandigarh, with mehendi, maps, and RSVP on one link.",
  },
  "modern-minimal": {
    title: "Neelam Blue Template | Inviteo",
    description:
      "Preview the Neelam Blue Inviteo template. Sample couple Isha and Vihaan share a Delhi sangeet and wedding, with events, maps, and RSVP on one link.",
  },
  "traditional-vivah": {
    title: "Shubh Vivah Template | Inviteo",
    description:
      "Preview the Shubh Vivah Inviteo template. Sample couple Aditi and Rohan host a Chennai muhurtham, with events, maps, and RSVP on one warm link.",
  },
  "destination-wedding": {
    title: "Destination Wedding Template | Inviteo",
    description:
      "Preview the destination wedding Inviteo template. Sample couple Sara and Arjun celebrate in South Goa, with travel notes, maps, and RSVP on one link.",
  },
};

export function templatePreviewMetadata(templateSlug: string, templateName: string, path: string): Metadata {
  const copy = TEMPLATE_PREVIEW_COPY[templateSlug] ?? {
    title: `${templateName} Template | Inviteo`.slice(0, 60),
    description:
      "Preview this Inviteo wedding invitation template with a static sample couple. The live page, the preview, and the share image all use the same demo.",
  };
  return pageMetadata(copy.title, copy.description, path);
}

export function invitePageMetadata(wedding: WeddingData | null, path: string): Metadata {
  if (!wedding) {
    return pageMetadata(
      "Invitation Not Found | Inviteo",
      "This Inviteo invitation link is not available. Browse the wedding invitation templates and open a live preview, or ask the couple for their link.",
      path,
    );
  }
  const when = wedding.couple.weddingDateDisplay.split("·")[0]?.trim() || wedding.couple.weddingDateDisplay;
  const dateLabel = compactDate(wedding.couple.weddingDateDisplay, wedding.couple.countdownDate);
  const city = weddingCity(wedding);
  const title = inviteTitle(wedding.couple.bride, wedding.couple.groom, dateLabel);
  const description = inviteDescription(wedding.couple.bride, wedding.couple.groom, when, city);
  return pageMetadata(title, description, path);
}

/** Metadata for the owner's own invitation. Not used by template previews. */
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
    `${input.bride} & ${input.groom} are getting married | ${dateLabel}`,
    `You are warmly invited to celebrate ${input.bride} & ${input.groom} on ${input.dateDisplay} in ${input.city}. Join the families for blessings, music, and a day you will always remember.`,
    input.path,
  );
}

export function marketingMetadata(title: string, description: string, path: string): Metadata {
  return pageMetadata(title, description, path);
}

const PRIVATE_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: { index: false, follow: false, noimageindex: true },
};

/** Admin routes: full tags, brand share image, never indexed. */
export function privatePageMetadata(title: string, description: string, path: string): Metadata {
  return pageMetadata(title, description, path, {
    image: "/opengraph-image",
    robots: PRIVATE_ROBOTS,
  });
}

function pageMetadata(
  title: string,
  description: string,
  path: string,
  options?: { image?: string | null; robots?: Metadata["robots"] },
): Metadata {
  const image = options?.image === undefined ? `${path}/opengraph-image` : options.image;
  return {
    metadataBase: metadataBase(),
    title,
    description,
    alternates: { canonical: path },
    robots: options?.robots,
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      siteName: "Inviteo",
      images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
