import type { ContentRow, ImageRow, WebsiteRow } from "./db";
import type { EventInput, WeddingContentMap, WebsiteInput } from "./admin-types";
import { countdownDateString } from "./form-utils";

const trimOrUndef = (s: string) => (s.trim() ? s.trim() : undefined);

/** WebsiteInput → wedding_content rows + wedding_images rows. */
export function inputToRows(input: WebsiteInput) {
  const couple = {
    bride: input.bride.trim(),
    groom: input.groom.trim(),
    brideParents: trimOrUndef(input.brideParents),
    groomParents: trimOrUndef(input.groomParents),
    grandparents: trimOrUndef(input.grandparents),
    intro: trimOrUndef(input.intro),
    loveStory: trimOrUndef(input.loveStory),
    countdownDate: countdownDateString(input.weddingDate, input.countdownTime),
    weddingDateDisplay:
      trimOrUndef(input.weddingDateDisplay) ??
      (input.weddingDate
        ? new Date(`${input.weddingDate}T00:00`).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : ""),
  };

  const events: EventInput[] = input.events.map((e, i) => ({ ...e, sortOrder: i + 1 }));

  const content: Record<string, unknown> = {
    couple,
    events,
    contacts: input.contacts,
    sections: { ...input.sections, rsvp: false },
    music: {
      enabled: input.musicEnabled,
      src: input.musicTrack.trim() || "/music/bg-music.mp3",
    },
  };
  if (input.venue.name.trim()) content.venue = input.venue;
  if (trimOrUndef(input.hashtag)) content.hashtag = input.hashtag.trim();
  if (trimOrUndef(input.blessing)) content.blessing = input.blessing.trim();
  if (trimOrUndef(input.mantra)) content.mantra = input.mantra.trim();

  const images: Omit<ImageRow, "id">[] = [];
  if (input.coupleImage?.path) {
    images.push({
      slot: "couple",
      storage_path: input.coupleImage.path,
      alt: input.coupleImage.alt || `${input.bride} and ${input.groom}`,
      caption: null,
      sort_order: 0,
    });
  }
  input.galleryImages.forEach((g, i) => {
    if (!g.path) return;
    images.push({
      slot: "gallery",
      storage_path: g.path,
      alt: g.alt || `Wedding photo ${i + 1}`,
      caption: g.caption?.trim() || null,
      sort_order: i,
    });
  });
  for (const e of events) {
    const img = input.eventImages[e.id];
    if (img?.path) {
      images.push({
        slot: `event:${e.id}`,
        storage_path: img.path,
        alt: img.alt || e.name,
        caption: null,
        sort_order: 0,
      });
    }
  }

  return { content, images };
}

/** DB rows → WebsiteInput for the edit form. */
export function websiteToInput(
  row: WebsiteRow,
  contentRows: ContentRow[],
  imageRows: ImageRow[],
): WebsiteInput {
  const c = Object.fromEntries(contentRows.map((r) => [r.key, r.value])) as WeddingContentMap;
  const couple = c.couple ?? {};
  const sorted = [...imageRows].sort((a, b) => a.sort_order - b.sort_order);
  const toRef = (i: ImageRow) => ({
    path: i.storage_path,
    alt: i.alt,
    caption: i.caption ?? undefined,
  });

  let weddingDate = row.wedding_date ?? "";
  let countdownTime = "19:00";
  if (couple.countdownDate) {
    const d = new Date(couple.countdownDate);
    if (!Number.isNaN(d.getTime())) {
      if (!weddingDate) weddingDate = d.toISOString().slice(0, 10);
      countdownTime = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    }
  }

  const events: EventInput[] = (c.events ?? []).map((e, i) => ({
    id: e.id ?? `ev-${i}`,
    name: e.name ?? "",
    date: e.date ?? "",
    time: e.time ?? "",
    venue: e.venue ?? "",
    address: e.address ?? "",
    mapQuery: e.mapQuery ?? "",
    dressCode: e.dressCode ?? "",
    description: e.description ?? "",
    calendarStart: e.calendarStart ?? "",
    calendarEnd: e.calendarEnd ?? "",
    showInVenue: e.showInVenue ?? true,
    sortOrder: e.sortOrder ?? i + 1,
  }));

  const eventImages: Record<string, { path: string; alt: string }> = {};
  for (const i of sorted) {
    if (i.slot.startsWith("event:")) {
      eventImages[i.slot.slice(6)] = { path: i.storage_path, alt: i.alt };
    }
  }

  const coupleImg = sorted.find((i) => i.slot === "couple");

  return {
    id: row.id,
    templateSlug: row.templates?.slug ?? "royal-heritage",
    slug: row.slug,
    status: row.status === "published" ? "published" : "draft",
    bride: couple.bride ?? row.bride_name ?? "",
    groom: couple.groom ?? row.groom_name ?? "",
    brideParents: couple.brideParents ?? "",
    groomParents: couple.groomParents ?? "",
    grandparents: couple.grandparents ?? "",
    intro: couple.intro ?? "",
    loveStory: couple.loveStory ?? "",
    weddingDate,
    countdownTime,
    weddingDateDisplay: couple.weddingDateDisplay ?? "",
    hashtag: c.hashtag ?? "",
    blessing: c.blessing ?? "",
    mantra: c.mantra ?? "",
    musicEnabled: c.music?.enabled ?? false,
    musicTrack: c.music?.src && c.music.src !== "/music/bg-music.mp3" ? c.music.src : "",
    events,
    venue: {
      name: c.venue?.name ?? "",
      address: c.venue?.address ?? "",
      mapQuery: c.venue?.mapQuery ?? "",
      parking: c.venue?.parking ?? "",
      hotels: c.venue?.hotels ?? [],
      travel: c.venue?.travel ?? "",
    },
    contacts: {
      numbers: c.contacts?.numbers ?? [],
      whatsapp: c.contacts?.whatsapp ?? "",
      rsvpNumber: c.contacts?.rsvpNumber ?? "",
    },
    sections: {
      gallery: c.sections?.gallery ?? true,
      story: c.sections?.story ?? true,
      music: c.sections?.music ?? true,
      venue: c.sections?.venue ?? true,
      effects: c.sections?.effects ?? true,
      effectsSpeed: c.sections?.effectsSpeed ?? "normal",
      scratch: c.sections?.scratch ?? true,
      borders: c.sections?.borders ?? true,
      wishes: c.sections?.wishes ?? true,
      uploads: c.sections?.uploads ?? true,
      reactions: c.sections?.reactions ?? true,
      blessings: (c.sections as { blessings?: boolean } | undefined)?.blessings ?? true,
    },
    rsvpEnabled: row.rsvp_enabled,
    noExpiry: row.no_expiry,
    expiryDays: row.expiry_days,
    customExpiresAt: row.custom_expires_at ? row.custom_expires_at.slice(0, 16) : null,
    coupleImage: coupleImg ? toRef(coupleImg) : couple.photo ? { path: couple.photo, alt: "" } : null,
    galleryImages: sorted.filter((i) => i.slot === "gallery").map(toRef),
    eventImages,
    removedStoragePaths: [],
  };
}
