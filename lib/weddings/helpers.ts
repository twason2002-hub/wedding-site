import type { WeddingEvent, WeddingData } from "./types";

export function icsForEvent(event: WeddingEvent, couple: WeddingData["couple"]): string {
  const escapeICS = (t: string) =>
    t.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  const dtStamp = new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//WeddingInvitations//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}-${Date.now()}@wedding-invitations`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${event.calendarStart}`,
    `DTEND:${event.calendarEnd}`,
    `SUMMARY:${escapeICS(`${event.name} — ${couple.bride} & ${couple.groom}`)}`,
    `LOCATION:${escapeICS(`${event.venue}, ${event.address}`)}`,
    `DESCRIPTION:${escapeICS(event.description ?? `Join us for ${event.name}`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n") + "\r\n";
}

export function downloadICS(event: WeddingEvent, couple: WeddingData["couple"]) {
  const blob = new Blob([icsForEvent(event, couple)], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.id}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export function googleCalendarUrl(event: WeddingEvent, couple: WeddingData["couple"]): string {
  const text = encodeURIComponent(`${event.name} — ${couple.bride} & ${couple.groom}`);
  const details = encodeURIComponent(event.description ?? `Join us for ${event.name}`);
  const location = encodeURIComponent(`${event.venue}, ${event.address}`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${event.calendarStart}/${event.calendarEnd}&details=${details}&location=${location}`;
}

export function mapsUrl(mapQuery: string): string {
  return `https://maps.google.com/?q=${mapQuery}`;
}

export function whatsappShare(text: string, phone?: string): string {
  const base = phone ? `https://wa.me/${phone}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function shareTextFor(w: WeddingData, siteUrl: string): string {
  return `${w.couple.bride} & ${w.couple.groom} are getting married on ${w.couple.weddingDateDisplay}! ${w.hashtag ?? ""} ${siteUrl}`;
}
