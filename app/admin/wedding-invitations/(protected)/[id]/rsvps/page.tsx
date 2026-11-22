import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { isUuid } from "@/lib/weddings/form-utils";
import { approveGuestPhoto as _approveGuestPhoto, deleteGuestPhoto as _deleteGuestPhoto, deleteWish as _deleteWish } from "../../../actions";
import { privatePageMetadata } from "@/lib/weddings/og";

async function removeWish(id: string, websiteId: string) {
  "use server";
  await _deleteWish(id, websiteId);
}

async function approvePhoto(id: string, websiteId: string) {
  "use server";
  await _approveGuestPhoto(id, websiteId);
}

async function removePhoto(id: string, websiteId: string, storagePath: string) {
  "use server";
  await _deleteGuestPhoto(id, websiteId, storagePath);
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return privatePageMetadata(
    "Wedding RSVPs | Inviteo Admin",
    "Review RSVPs, wishes, and guest photos for this Inviteo wedding in the private admin. Approve what belongs on the invitation and remove the rest.",
    `/admin/wedding-invitations/${id}/rsvps`,
  );
}

interface RsvpRow {
  id: string;
  name: string;
  attending: boolean;
  event_ids: string[];
  guests: number;
  diet: string | null;
  message: string | null;
  created_at: string;
}

export default async function RsvpsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const { supabase } = await requireAdmin();

  const [{ data: site }, { data: events }, { data: rsvps, error }] = await Promise.all([
    supabase.from("wedding_websites").select("slug, bride_name, groom_name, rsvp_enabled").eq("id", id).maybeSingle(),
    supabase.from("wedding_content").select("value").eq("website_id", id).eq("key", "events").maybeSingle(),
    supabase
      .from("wedding_rsvps")
      .select("id, name, attending, event_ids, guests, diet, message, created_at")
      .eq("website_id", id)
      .order("created_at", { ascending: false }),
  ]);
  if (!site) notFound();

  const [{ data: wishes }, { data: guestPhotos }] = await Promise.all([
    supabase
      .from("wedding_wishes")
      .select("id, name, message, created_at")
      .eq("website_id", id)
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("wedding_guest_photos")
      .select("id, storage_path, caption, approved, created_at")
      .eq("website_id", id)
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const eventName = new Map(
    ((events?.value ?? []) as { id: string; name: string }[]).map((e) => [e.id, e.name]),
  );
  const rows = (rsvps ?? []) as RsvpRow[];
  const yes = rows.filter((r) => r.attending);
  const stats = [
    ["Responses", rows.length],
    ["Attending", yes.length],
    ["Total guests", yes.reduce((n, r) => n + r.guests, 0)],
    ["Declined", rows.length - yes.length],
  ] as const;

  const csv = [
    ["Guest", "Reply", "Guests", "Events", "Dietary", "Message", "Received"],
    ...rows.map((r) => [
      r.name,
      r.attending ? "Attending" : "Declined",
      String(r.guests),
      r.event_ids.map((e) => eventName.get(e) ?? e).join("; "),
      r.diet ?? "",
      r.message ?? "",
      r.created_at,
    ]),
  ]
    .map((line) => line.map(csvCell).join(","))
    .join("\r\n");
  // BOM so Excel reads Devanagari/Gurmukhi names as UTF-8.
  const csvHref = `data:text/csv;charset=utf-8,${encodeURIComponent(`\uFEFF${csv}`)}`;

  return (
    <main className="adm-wrap pb-20 pt-8">
      <Link href="/admin/wedding-invitations" className="adm-link text-sm">
        ← All websites
      </Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="adm-eyebrow adm-eyebrow--gold">RSVP responses</p>
          <h1 className="adm-h1 mt-2">
            {site.bride_name} &amp; {site.groom_name}
          </h1>
          <p className="mt-1 font-mono text-xs" style={{ color: "var(--adm-faint)" }}>/{site.slug}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`adm-pill ${site.rsvp_enabled ? "adm-pill--blue" : "adm-pill--grey"}`}>
            RSVP {site.rsvp_enabled ? "on" : "off"}
          </span>
          {rows.length > 0 && (
            <a href={csvHref} download={`${site.slug}-rsvps.csv`} className="adm-btn adm-btn--outline adm-btn--sm">
              Export CSV
            </a>
          )}
        </div>
      </div>

      <section aria-label="Summary" className="adm-stats mt-6">
        {stats.map(([label, value]) => (
          <div key={label} className="adm-card adm-stat">
            <p className="adm-stat-value">{value}</p>
            <p className="adm-eyebrow adm-stat-label">{label}</p>
          </div>
        ))}
      </section>

      {error && (
        <div className="adm-banner adm-banner--err mt-4" role="alert">
          {error.message}
        </div>
      )}

      <div className="adm-card mt-4 overflow-x-auto">
        {rows.length === 0 ? (
          <div className="adm-empty">
            <p className="adm-h2">No RSVPs yet</p>
            <p className="adm-hint">
              {site.rsvp_enabled
                ? "Responses appear here as guests reply from the website."
                : (
                  <>
                    RSVP is off.{" "}
                    <Link href={`/admin/wedding-invitations/${id}/edit`} className="adm-link">
                      Turn it on in the website editor
                    </Link>
                    .
                  </>
                )}
            </p>
          </div>
        ) : (
          <table className="adm-table min-w-[900px]">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Reply</th>
                <th>Guests</th>
                <th>Events</th>
                <th>Dietary</th>
                <th>Message</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="font-semibold">{r.name}</td>
                  <td>
                    <span className={`adm-pill ${r.attending ? "adm-pill--green" : "adm-pill--red"}`}>
                      {r.attending ? "attending" : "declined"}
                    </span>
                  </td>
                  <td>{r.guests}</td>
                  <td>{r.event_ids.map((e) => eventName.get(e) ?? e).join(", ") || "—"}</td>
                  <td>{r.diet || "—"}</td>
                  <td style={{ maxWidth: 280 }}>{r.message || "—"}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {new Date(r.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <h2 className="adm-h2 mt-10">Guest wishes {(wishes ?? []).length > 0 && `(${(wishes ?? []).length})`}</h2>
      <div className="adm-card mt-4">
        {(wishes ?? []).length === 0 ? (
          <div className="adm-empty">
            <p className="adm-hint" style={{ margin: 0 }}>No wishes yet. They appear here as guests post them.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {(wishes ?? []).map((w: { id: string; name: string; message: string; created_at: string }) => (
              <li key={w.id} className="flex items-start justify-between gap-3 border-b border-black/5 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm">“{w.message}”</p>
                  <p className="adm-hint mt-1" style={{ marginBottom: 0 }}>
                    — {w.name} · {new Date(w.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
                <form action={removeWish.bind(null, w.id, id)}>
                  <button type="submit" className="adm-btn adm-btn--outline adm-btn--sm" aria-label={`Delete wish from ${w.name}`}>
                    Delete
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>

      <h2 className="adm-h2 mt-10">Guest photos {(guestPhotos ?? []).length > 0 && `(${(guestPhotos ?? []).length})`}</h2>
      <div className="adm-card mt-4">
        {(guestPhotos ?? []).length === 0 ? (
          <div className="adm-empty">
            <p className="adm-hint" style={{ margin: 0 }}>No uploads yet. Approve photos here and they show on the website.</p>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(guestPhotos ?? []).map((g: { id: string; storage_path: string; caption: string | null; approved: boolean; created_at: string }) => (
              <li key={g.id} className="rounded-2xl border border-black/10 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/guest-photos/${g.storage_path}`}
                  alt={g.caption ?? "Guest photo"}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                />
                <p className="mt-2 text-sm">{g.caption || <span className="opacity-50">No caption</span>}</p>
                <p className="adm-hint mt-1" style={{ marginBottom: 8 }}>
                  {new Date(g.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })} ·{" "}
                  <span className={`adm-pill ${g.approved ? "adm-pill--green" : "adm-pill--amber"}`}>
                    {g.approved ? "live" : "pending"}
                  </span>
                </p>
                <div className="flex gap-2">
                  {!g.approved && (
                    <form action={approvePhoto.bind(null, g.id, id)}>
                      <button type="submit" className="adm-btn adm-btn--gold adm-btn--sm">
                        Approve
                      </button>
                    </form>
                  )}
                  <form action={removePhoto.bind(null, g.id, id, g.storage_path)}>
                    <button type="submit" className="adm-btn adm-btn--outline adm-btn--sm" aria-label="Delete guest photo">
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

/** Quote for CSV; prefix guest text that spreadsheets would run as a formula. */
function csvCell(v: string) {
  const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
  return `"${safe.replace(/"/g, '""')}"`;
}
