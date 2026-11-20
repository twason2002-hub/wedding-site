export const isUuid = (v: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

export function slugifyCouple(groom: string, bride: string): string {
  const s = `${groom}-and-${bride}`
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
  return s.length >= 3 ? s : "wedding";
}

/** datetime-local ("2027-02-13T19:00") → ICS basic ("20270213T190000"). */
export function toIcs(local: string): string {
  return local ? local.replace(/[-:]/g, "") + "00" : "";
}

export function fromIcs(ics: string): string {
  if (!ics || ics.length < 15) return "";
  return `${ics.slice(0, 4)}-${ics.slice(4, 6)}-${ics.slice(6, 8)}T${ics.slice(9, 11)}:${ics.slice(11, 13)}`;
}

export function countdownDateString(weddingDate: string, time: string): string {
  if (!weddingDate) return "";
  const d = new Date(`${weddingDate}T${time || "19:00"}`);
  if (Number.isNaN(d.getTime())) return "";
  const month = d.toLocaleString("en-US", { month: "long" });
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${month} ${d.getDate()}, ${d.getFullYear()} ${hh}:${mm}:00`;
}

/** Storage path or legacy public path → renderable URL (client-safe). */
export function resolveImage(path: string): string {
  if (!path) return "";
  if (path.startsWith("/") || path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/wedding-images/${path}`;
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
