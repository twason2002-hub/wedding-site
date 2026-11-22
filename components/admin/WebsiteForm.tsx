"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { TemplateDefinition } from "@/lib/weddings/types";
import type { EventInput, ImageRef, WebsiteInput } from "@/lib/weddings/admin-types";
import { fromIcs, resolveImage, slugifyCouple, toIcs } from "@/lib/weddings/form-utils";
import { isDemoSlug } from "@/lib/weddings/demo";
import { demoWeddingFor } from "@/lib/weddings/sample-data";
import { saveWebsite, deleteWebsite } from "@/app/admin/wedding-invitations/actions";
import UploadButton from "./UploadButton";

function blankInput(templateSlug: string, expiryDays: number): WebsiteInput {
  return {
    templateSlug,
    slug: "",
    status: "draft",
    bride: "",
    groom: "",
    brideParents: "",
    groomParents: "",
    grandparents: "",
    intro: "",
    loveStory: "",
    weddingDate: "",
    countdownTime: "19:00",
    weddingDateDisplay: "",
    hashtag: "",
    blessing: "",
    mantra: "",
    musicEnabled: false,
    musicTrack: "",
    events: [],
    venue: { name: "", address: "", mapQuery: "", parking: "", hotels: [], travel: "" },
    contacts: { numbers: [], whatsapp: "", rsvpNumber: "" },
    sections: {
      gallery: true,
      story: true,
      music: true,
      venue: true,
      effects: true,
      effectsSpeed: "normal",
      scratch: true,
      borders: true,
      wishes: true,
      uploads: true,
      reactions: true,
      blessings: true,
    },
    rsvpEnabled: false,
    noExpiry: false,
    expiryDays,
    customExpiresAt: null,
    coupleImage: null,
    galleryImages: [],
    eventImages: {},
    removedStoragePaths: [],
  };
}

function displayDate(local: string): string {
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function displayTime(local: string): string {
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} Onwards`;
}

function Switch({ checked, onChange, label, disabled = false }: { checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="adm-switch"
      disabled={disabled}
      onClick={() => onChange(!checked)}
    />
  );
}

function Field({
  label,
  hint,
  children,
  span2,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  span2?: boolean;
}) {
  return (
    <label className={span2 ? "adm-span-2" : undefined}>
      <span className="adm-label">{label}</span>
      {children}
      {hint && <p className="adm-hint">{hint}</p>}
    </label>
  );
}

export default function WebsiteForm({
  mode,
  templates,
  initial,
  defaultExpiryDays,
  preselectTemplate,
}: {
  mode: "create" | "edit";
  templates: TemplateDefinition[];
  initial?: WebsiteInput;
  defaultExpiryDays: number;
  preselectTemplate?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const websiteId = useMemo(() => initial?.id ?? crypto.randomUUID(), [initial?.id]);
  const [form, setForm] = useState<WebsiteInput>(
    initial ?? blankInput(preselectTemplate ?? templates[0]?.slug ?? "", defaultExpiryDays),
  );
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  const noExpiryLocked = mode === "edit" && (isDemoSlug(initial?.slug ?? "") || initial?.noExpiry === true);

  const set = <K extends keyof WebsiteInput>(key: K, value: WebsiteInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function setNames(bride: string, groom: string) {
    setForm((f) => ({
      ...f,
      bride,
      groom,
      slug: mode === "create" && !slugTouched ? slugifyCouple(groom, bride) : f.slug,
    }));
  }

  function patchEvent(id: string, patch: Partial<EventInput>) {
    setForm((f) => ({
      ...f,
      events: f.events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  }

  function setEventStart(id: string, local: string) {
    patchEvent(id, {
      calendarStart: toIcs(local),
      date: displayDate(local),
      time: displayTime(local),
    });
  }

  function addEvent() {
    const start = form.weddingDate ? `${form.weddingDate}T19:00` : "";
    const end = form.weddingDate ? `${form.weddingDate}T23:00` : "";
    const ev: EventInput = {
      id: `ev-${Math.random().toString(36).slice(2, 8)}`,
      name: "",
      date: displayDate(start),
      time: displayTime(start),
      venue: "",
      address: "",
      mapQuery: "",
      dressCode: "",
      description: "",
      calendarStart: toIcs(start),
      calendarEnd: toIcs(end),
      showInVenue: true,
      sortOrder: form.events.length + 1,
    };
    setForm((f) => ({ ...f, events: [...f.events, ev] }));
  }

  function removeEvent(id: string) {
    setForm((f) => {
      const img = f.eventImages[id];
      const eventImages = { ...f.eventImages };
      delete eventImages[id];
      return {
        ...f,
        events: f.events.filter((e) => e.id !== id),
        eventImages,
        removedStoragePaths: img ? [...f.removedStoragePaths, img.path] : f.removedStoragePaths,
      };
    });
  }

  function trackRemoved(path?: string) {
    if (path && !path.startsWith("/") && !path.startsWith("http")) {
      setForm((f) => ({ ...f, removedStoragePaths: [...f.removedStoragePaths, path] }));
    }
  }

  function setCoupleImage(refs: ImageRef[]) {
    trackRemoved(form.coupleImage?.path);
    set("coupleImage", refs[0] ?? null);
  }

  function addGallery(refs: ImageRef[]) {
    setForm((f) => ({ ...f, galleryImages: [...f.galleryImages, ...refs] }));
  }

  function removeGallery(i: number) {
    trackRemoved(form.galleryImages[i]?.path);
    setForm((f) => ({ ...f, galleryImages: f.galleryImages.filter((_, j) => j !== i) }));
  }

  function moveGallery(i: number, dir: -1 | 1) {
    setForm((f) => {
      const arr = [...f.galleryImages];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return f;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...f, galleryImages: arr };
    });
  }

  function setEventImage(id: string, refs: ImageRef[]) {
    trackRemoved(form.eventImages[id]?.path);
    setForm((f) => ({ ...f, eventImages: { ...f.eventImages, [id]: refs[0] } }));
  }

  const expiryPreview = noExpiryLocked || form.noExpiry
    ? "No expiry — this website stays live until you delete it (demo mode)."
    : form.customExpiresAt
      ? `Custom expiry: ${displayDate(form.customExpiresAt)}`
      : form.weddingDate
        ? `Expires ${form.expiryDays} day${form.expiryDays === 1 ? "" : "s"} after the wedding (${displayDate(`${form.weddingDate}T00:00`) } + ${form.expiryDays}d)`
        : "Set a wedding date (or custom expiry) to schedule automatic expiry.";

  function submit(status: "draft" | "published") {
    setError("");
    setSaved(false);
    if (!form.bride.trim() || !form.groom.trim()) {
      setError("Enter the bride's and groom's names first.");
      return;
    }
    if (!form.templateSlug) {
      setError("Pick a template first.");
      return;
    }
    if (status === "published" && !form.noExpiry && !form.weddingDate && !form.customExpiresAt) {
      setError("Set the wedding date before publishing — it drives the automatic expiry.");
      return;
    }
    const payload: WebsiteInput = {
      ...form,
      id: websiteId,
      status,
      slug: form.slug.trim() || slugifyCouple(form.groom, form.bride),
      contacts: { ...form.contacts, numbers: form.contacts.numbers.map((n) => n.trim()).filter(Boolean) },
      venue: { ...form.venue, hotels: form.venue.hotels.map((h) => h.trim()).filter(Boolean) },
    };
    startTransition(async () => {
      const res = await saveWebsite(payload, mode);
      if (res && !res.ok) {
        setError(res.error);
        return;
      }
      if (mode === "edit") {
        setSaved(true);
        router.refresh();
      }
    });
  }

  function removeWebsite() {
    startTransition(async () => {
      const res = await deleteWebsite(websiteId);
      if (!res.ok) setError(res.error ?? "Delete failed.");
      else router.push("/admin/wedding-invitations");
    });
  }

  const selectedTemplate = templates.find((t) => t.slug === form.templateSlug);

  return (
    <div>
      <div className="adm-actionbar">
        <div className="adm-wrap adm-actionbar-inner">
          <div className="flex items-center gap-3">
            <h1 className="adm-h2" style={{ fontSize: "1.3rem" }}>
              {mode === "create" ? "Create website" : `Edit — ${form.bride || "…"} & ${form.groom || "…"}`}
            </h1>
            <span className={`adm-pill ${form.status === "published" ? "adm-pill--green" : "adm-pill--amber"}`}>
              {form.status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/admin/wedding-invitations" className="adm-btn adm-btn--outline adm-btn--sm">Cancel</Link>
            {mode === "edit" && form.status === "published" && (
              <button className="adm-btn adm-btn--outline adm-btn--sm" disabled={pending} onClick={() => submit("draft")}>
                Unpublish
              </button>
            )}
            <button className="adm-btn adm-btn--outline adm-btn--sm" disabled={pending} onClick={() => submit("draft")}>
              {pending ? "Saving…" : mode === "create" ? "Save draft" : "Save changes"}
            </button>
            <button className="adm-btn adm-btn--gold adm-btn--sm" disabled={pending} onClick={() => submit("published")}>
              {pending ? "Working…" : form.status === "published" ? "Save & keep live" : "Publish website"}
            </button>
          </div>
        </div>
      </div>

      <main className="adm-wrap pb-36 pt-8">
        {error && <div className="adm-banner adm-banner--err mb-5" role="alert">{error}</div>}
        {saved && <div className="adm-banner adm-banner--ok mb-5" role="status">Changes saved.</div>}

        {/* 01 — Template */}
        <section className="adm-card adm-form-section" aria-label="Template">
          <div className="adm-section-head">
            <span className="adm-section-num">01</span>
            <h2 className="adm-h2">Choose a template</h2>
          </div>
          <div className="adm-tpl-grid">
            {templates.map((t) => (
              <button
                key={t.slug}
                type="button"
                className="adm-tpl adm-card"
                aria-pressed={form.templateSlug === t.slug}
                onClick={() => set("templateSlug", t.slug)}
              >
                <span className="adm-tpl-check" aria-hidden="true">✓</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.thumbnail} alt={`${t.name} preview`} className="adm-tpl-img" loading="lazy" />
                <span className="adm-tpl-body block">
                  <span className="adm-eyebrow block">{t.category}</span>
                  <span className="mt-1 block font-semibold" style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.2rem" }}>
                    {t.name}
                  </span>
                  <span className="adm-hint mt-1 block" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {t.description}
                  </span>
                </span>
              </button>
            ))}
          </div>
          {selectedTemplate && (
            <p className="adm-hint mt-4">
              Selected: <strong>{selectedTemplate.name}</strong> ·{" "}
              <a className="adm-link" href={`/wedding-invitations/templates/${selectedTemplate.slug}`} target="_blank" rel="noreferrer">
                Open full preview ↗
              </a>{" "}
              ·{" "}
              <a
                className="adm-link"
                href={`/wedding-invitations/${demoWeddingFor(selectedTemplate.slug).slug}`}
                target="_blank"
                rel="noreferrer"
              >
                Open sample invitation ↗
              </a>
            </p>
          )}
        </section>

        {/* 02 — Couple */}
        <section className="adm-card adm-form-section" aria-label="Couple">
          <div className="adm-section-head">
            <span className="adm-section-num">02</span>
            <h2 className="adm-h2">The couple</h2>
          </div>
          <div className="adm-form-grid adm-form-grid--2">
            <Field label="Bride's name">
              <input className="adm-field" value={form.bride} onChange={(e) => setNames(e.target.value, form.groom)} placeholder="Bride's full name" />
            </Field>
            <Field label="Groom's name">
              <input className="adm-field" value={form.groom} onChange={(e) => setNames(form.bride, e.target.value)} placeholder="Groom's full name" />
            </Field>
            <Field label="Bride's parents">
              <input className="adm-field" value={form.brideParents} onChange={(e) => set("brideParents", e.target.value)} placeholder="Bride's parents" />
            </Field>
            <Field label="Groom's parents">
              <input className="adm-field" value={form.groomParents} onChange={(e) => set("groomParents", e.target.value)} placeholder="Groom's parents" />
            </Field>
            <Field label="Grandparents / elders blessing" span2>
              <input className="adm-field" value={form.grandparents} onChange={(e) => set("grandparents", e.target.value)} placeholder="With the loving blessings of…" />
            </Field>
            <Field label="Invitation intro" span2>
              <textarea className="adm-field" value={form.intro} onChange={(e) => set("intro", e.target.value)} placeholder="With the blessings of Lord Ganesha and our elders, we invite you…" />
            </Field>
            <Field label="Love story" span2>
              <textarea className="adm-field" value={form.loveStory} onChange={(e) => set("loveStory", e.target.value)} placeholder="How the two met…" />
            </Field>
            <Field label="Wedding hashtag">
              <input className="adm-field" value={form.hashtag} onChange={(e) => set("hashtag", e.target.value)} placeholder="#TheWedding" />
            </Field>
            <Field label="Blessing line (Sanskrit / Gurbani)">
              <input className="adm-field" value={form.blessing} onChange={(e) => set("blessing", e.target.value)} placeholder="॥ श्री गणेशाय नमः ॥" />
            </Field>
            <Field label="Mantra / shloka" span2>
              <textarea className="adm-field" value={form.mantra} onChange={(e) => set("mantra", e.target.value)} placeholder="वक्रतुण्ड महाकाय…" />
            </Field>
          </div>
        </section>

        {/* 03 — Dates & expiry */}
        <section className="adm-card adm-form-section" aria-label="Dates and expiry">
          <div className="adm-section-head">
            <span className="adm-section-num">03</span>
            <h2 className="adm-h2">Wedding date & expiry</h2>
          </div>
          <div className="adm-form-grid adm-form-grid--2">
            <Field label="Wedding date">
              <input className="adm-field" type="date" value={form.weddingDate} onChange={(e) => set("weddingDate", e.target.value)} />
            </Field>
            <Field label="Countdown time (main ceremony)">
              <input className="adm-field" type="time" value={form.countdownTime} onChange={(e) => set("countdownTime", e.target.value)} />
            </Field>
            <Field label="Date display text" hint="Shown on the invitation, e.g. “15th February 2027 · Jaipur”. Auto-generated if left empty.">
              <input className="adm-field" value={form.weddingDateDisplay} onChange={(e) => set("weddingDateDisplay", e.target.value)} placeholder="15th February 2027 · Jaipur" />
            </Field>
            <Field label="Keep live for (days after wedding)" hint="Default 7. The website goes offline automatically after this.">
              <input className="adm-field" type="number" min={1} max={365} value={form.expiryDays} disabled={noExpiryLocked || form.noExpiry} onChange={(e) => set("expiryDays", Number(e.target.value) || 7)} />
            </Field>
            <Field label="Custom expiry date (optional)" hint="Overrides the days-after-wedding rule. Leave empty to use the rule.">
              <input className="adm-field" type="datetime-local" value={form.customExpiresAt ?? ""} onChange={(e) => set("customExpiresAt", e.target.value || null)} disabled={noExpiryLocked || form.noExpiry} />
            </Field>
            <div className="adm-span-2">
              <div className="adm-switch-row" style={{ borderBottom: "none", paddingTop: 0 }}>
                <div>
                  <p className="font-semibold text-sm">Never expire (demo)</p>
                  <p className="adm-hint" style={{ margin: 0 }}>
                    {noExpiryLocked
                      ? "This is a demo website — it never expires and cannot be changed."
                      : "Keeps the website live indefinitely — use for demo websites."}
                  </p>
                </div>
                <Switch label="Never expire" checked={noExpiryLocked || form.noExpiry} disabled={noExpiryLocked} onChange={(v) => set("noExpiry", v)} />
              </div>
              <p className="adm-hint" style={{ marginTop: 0 }}>{expiryPreview}</p>
            </div>
          </div>
        </section>

        {/* 04 — Events */}
        <section className="adm-card adm-form-section" aria-label="Events">
          <div className="adm-section-head">
            <span className="adm-section-num">04</span>
            <h2 className="adm-h2">Events</h2>
          </div>
          {form.events.length === 0 && (
            <p className="adm-lead">No events yet — add the Sagan, Mehendi, Sangeet, Pheras, Reception…</p>
          )}
          {form.events.map((ev, idx) => (
            <div key={ev.id} className="adm-event">
              <div className="adm-event-head">
                <p className="adm-eyebrow">Event {idx + 1}</p>
                <button type="button" className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => removeEvent(ev.id)}>
                  Remove event
                </button>
              </div>
              <div className="adm-form-grid adm-form-grid--2">
                <Field label="Event name" span2>
                  <input className="adm-field" value={ev.name} onChange={(e) => patchEvent(ev.id, { name: e.target.value })} placeholder="Sangeet & Cocktail Night" />
                </Field>
                <Field label="Starts" hint="Generates the display date/time and calendar entry below.">
                  <input className="adm-field" type="datetime-local" value={fromIcs(ev.calendarStart)} onChange={(e) => setEventStart(ev.id, e.target.value)} />
                </Field>
                <Field label="Ends">
                  <input className="adm-field" type="datetime-local" value={fromIcs(ev.calendarEnd)} onChange={(e) => patchEvent(ev.id, { calendarEnd: toIcs(e.target.value) })} />
                </Field>
                <Field label="Display date">
                  <input className="adm-field" value={ev.date} onChange={(e) => patchEvent(ev.id, { date: e.target.value })} placeholder="14 February 2027" />
                </Field>
                <Field label="Display time">
                  <input className="adm-field" value={ev.time} onChange={(e) => patchEvent(ev.id, { time: e.target.value })} placeholder="8:00 PM Onwards" />
                </Field>
                <Field label="Venue">
                  <input className="adm-field" value={ev.venue} onChange={(e) => patchEvent(ev.id, { venue: e.target.value })} placeholder="Grand Durbar Lawn" />
                </Field>
                <Field label="Address">
                  <input className="adm-field" value={ev.address} onChange={(e) => patchEvent(ev.id, { address: e.target.value })} placeholder="Amer Road, Jaipur" />
                </Field>
                <Field label="Google Maps search query" hint="Words joined with +, e.g. Rambagh+Palace+Jaipur">
                  <input className="adm-field" value={ev.mapQuery} onChange={(e) => patchEvent(ev.id, { mapQuery: e.target.value })} placeholder="Rambagh+Palace+Jaipur" />
                </Field>
                <Field label="Dress code">
                  <input className="adm-field" value={ev.dressCode} onChange={(e) => patchEvent(ev.id, { dressCode: e.target.value })} placeholder="Indo-Western Shimmer & Royal Blue" />
                </Field>
                <Field label="Description" span2>
                  <textarea className="adm-field" value={ev.description} onChange={(e) => patchEvent(ev.id, { description: e.target.value })} placeholder="What happens at this event…" />
                </Field>
                <div className="adm-span-2">
                  <span className="adm-label">Event photo (optional)</span>
                  {form.eventImages[ev.id] ? (
                    <div className="adm-thumb" style={{ maxWidth: 180 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={resolveImage(form.eventImages[ev.id].path)} alt={form.eventImages[ev.id].alt} />
                      <div className="adm-thumb-bar">
                        <span className="adm-hint" style={{ margin: 0 }}>Event photo</span>
                        <button type="button" className="adm-thumb-btn adm-thumb-btn--danger" onClick={() => { trackRemoved(form.eventImages[ev.id]?.path); setForm((f) => { const ei = { ...f.eventImages }; delete ei[ev.id]; return { ...f, eventImages: ei }; }); }}>
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : (
                    <UploadButton websiteId={websiteId} slot={`event-${ev.id}`} label="Upload event photo" onUploaded={(refs) => setEventImage(ev.id, refs)} />
                  )}
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="adm-btn adm-btn--outline mt-4" onClick={addEvent}>
            Add event
          </button>
        </section>

        {/* 05 — Venue & travel */}
        <section className="adm-card adm-form-section" aria-label="Venue and travel">
          <div className="adm-section-head">
            <span className="adm-section-num">05</span>
            <h2 className="adm-h2">Venue & travel</h2>
          </div>
          <div className="adm-form-grid adm-form-grid--2">
            <Field label="Main venue name">
              <input className="adm-field" value={form.venue.name} onChange={(e) => set("venue", { ...form.venue, name: e.target.value })} placeholder="Rambagh Palace, Jaipur" />
            </Field>
            <Field label="Venue address">
              <input className="adm-field" value={form.venue.address} onChange={(e) => set("venue", { ...form.venue, address: e.target.value })} placeholder="Bhawani Singh Road, Jaipur" />
            </Field>
            <Field label="Maps search query">
              <input className="adm-field" value={form.venue.mapQuery} onChange={(e) => set("venue", { ...form.venue, mapQuery: e.target.value })} placeholder="Rambagh+Palace+Jaipur" />
            </Field>
            <Field label="Parking note">
              <input className="adm-field" value={form.venue.parking} onChange={(e) => set("venue", { ...form.venue, parking: e.target.value })} placeholder="Valet parking at the main gate…" />
            </Field>
            <Field label="Hotels (one per line)" span2>
              <textarea className="adm-field" value={form.venue.hotels.join("\n")} onChange={(e) => set("venue", { ...form.venue, hotels: e.target.value.split("\n") })} placeholder={"Rambagh Palace (Main Venue)\nITC Rajputana, Jaipur"} />
            </Field>
            <Field label="Travel / airport pickup note" span2>
              <textarea className="adm-field" value={form.venue.travel} onChange={(e) => set("venue", { ...form.venue, travel: e.target.value })} placeholder="25 minutes from Jaipur Airport (JAI)…" />
            </Field>
          </div>
        </section>

        {/* 06 — Photos */}
        <section className="adm-card adm-form-section" aria-label="Photos">
          <div className="adm-section-head">
            <span className="adm-section-num">06</span>
            <h2 className="adm-h2">Photos</h2>
          </div>
          <div className="adm-form-grid adm-form-grid--2">
            <div>
              <span className="adm-label">Couple photo (hero)</span>
              {form.coupleImage ? (
                <div className="adm-thumb" style={{ maxWidth: 220 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resolveImage(form.coupleImage.path)} alt={form.coupleImage.alt || "Couple"} />
                  <div className="adm-thumb-bar">
                    <span className="adm-hint" style={{ margin: 0 }}>Hero photo</span>
                    <button type="button" className="adm-thumb-btn adm-thumb-btn--danger" onClick={() => { trackRemoved(form.coupleImage?.path); set("coupleImage", null); }}>
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <UploadButton websiteId={websiteId} slot="couple" label="Upload couple photo" onUploaded={setCoupleImage} />
              )}
            </div>
            <div>
              <span className="adm-label">Gallery photos</span>
              <UploadButton websiteId={websiteId} slot="gallery" label="Add gallery photos" multiple onUploaded={addGallery} />
            </div>
          </div>
          {form.galleryImages.length > 0 && (
            <div className="adm-thumbs mt-5">
              {form.galleryImages.map((g, i) => (
                <div key={`${g.path}-${i}`} className="adm-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resolveImage(g.path)} alt={g.alt || `Gallery photo ${i + 1}`} />
                  <input
                    className="adm-field"
                    style={{ minHeight: 38, borderRadius: 0, border: "none", borderTop: "1px solid var(--adm-line)", fontSize: "0.8rem" }}
                    value={g.caption ?? ""}
                    placeholder="Caption (optional)"
                    aria-label={`Caption for photo ${i + 1}`}
                    onChange={(e) => setForm((f) => ({ ...f, galleryImages: f.galleryImages.map((x, j) => (j === i ? { ...x, caption: e.target.value } : x)) }))}
                  />
                  <div className="adm-thumb-bar">
                    <span className="adm-hint" style={{ margin: 0 }}>{i + 1}</span>
                    <span>
                      <button type="button" className="adm-thumb-btn" aria-label="Move earlier" disabled={i === 0} onClick={() => moveGallery(i, -1)}>↑</button>
                      <button type="button" className="adm-thumb-btn" aria-label="Move later" disabled={i === form.galleryImages.length - 1} onClick={() => moveGallery(i, 1)}>↓</button>
                      <button type="button" className="adm-thumb-btn adm-thumb-btn--danger" aria-label="Remove photo" onClick={() => removeGallery(i)}>✕</button>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 07 — Sections & RSVP */}
        <section className="adm-card adm-form-section" aria-label="Sections and RSVP">
          <div className="adm-section-head">
            <span className="adm-section-num">07</span>
            <h2 className="adm-h2">Sections & RSVP</h2>
          </div>
          <div className="adm-switch-row">
            <div>
              <p className="font-semibold text-sm">Photo gallery</p>
              <p className="adm-hint" style={{ margin: 0 }}>Show the gallery section on the website.</p>
            </div>
            <Switch label="Photo gallery" checked={form.sections.gallery} onChange={(v) => set("sections", { ...form.sections, gallery: v })} />
          </div>
          <div className="adm-switch-row">
            <div>
              <p className="font-semibold text-sm">Love story</p>
              <p className="adm-hint" style={{ margin: 0 }}>Show the couple&apos;s story section.</p>
            </div>
            <Switch label="Love story" checked={form.sections.story} onChange={(v) => set("sections", { ...form.sections, story: v })} />
          </div>
          <div className="adm-switch-row">
            <div>
              <p className="font-semibold text-sm">Venue & travel</p>
              <p className="adm-hint" style={{ margin: 0 }}>Show venue, parking, hotels and travel details.</p>
            </div>
            <Switch label="Venue and travel" checked={form.sections.venue} onChange={(v) => set("sections", { ...form.sections, venue: v })} />
          </div>
          <div className="adm-switch-row">
            <div>
              <p className="font-semibold text-sm">Background music</p>
              <p className="adm-hint" style={{ margin: 0 }}>Music toggle with the default invitation track.</p>
            </div>
            <Switch label="Background music" checked={form.musicEnabled} onChange={(v) => { setForm((f) => ({ ...f, musicEnabled: v, sections: { ...f.sections, music: v } })); }} />
          </div>
          {form.musicEnabled && (
            <div className="mt-3">
              <Field label="Custom music track URL (optional)" hint="MP3 link. Empty = default invitation track.">
                <input className="adm-field" value={form.musicTrack} onChange={(e) => set("musicTrack", e.target.value)} placeholder="https://…/your-song.mp3" inputMode="url" />
              </Field>
            </div>
          )}
          <div className="adm-switch-row">
            <div>
              <p className="font-semibold text-sm">RSVP</p>
              <p className="adm-hint" style={{ margin: 0 }}>Off by default. When on, guests can reply from the website.</p>
            </div>
            <Switch label="RSVP" checked={form.rsvpEnabled} onChange={(v) => set("rsvpEnabled", v)} />
          </div>
        </section>

        {/* 07b — Interactive features */}
        <section className="adm-card adm-form-section" aria-label="Interactive features">
          <div className="adm-section-head">
            <span className="adm-section-num">07b</span>
            <h2 className="adm-h2">Interactive features</h2>
          </div>
          <p className="adm-hint" style={{ marginTop: 0 }}>Premium touches per website. Defaults come from the chosen template.</p>
            {(
              [
                ["effects", "Floating effects", "Petals, golden dust, diya embers — matched to the template."],
                ["scratch", "Scratch-to-reveal date", "Foil card guests scratch to reveal the wedding date."],
                ["borders", "Decorative side borders", "Template motifs framing the page on desktop."],
                ["blessings", "Interactive blessings", "Guests tap to reveal blessing messages."],
                ["reactions", "Floating reactions", "Hearts and flowers guests can send."],
              ] as const
          ).map(([key, label, hint]) => (
            <div className="adm-switch-row" key={key}>
              <div>
                <p className="font-semibold text-sm">{label}</p>
                <p className="adm-hint" style={{ margin: 0 }}>{hint}</p>
              </div>
              <Switch
                label={label}
                checked={form.sections[key]}
                onChange={(v) => set("sections", { ...form.sections, [key]: v })}
              />
            </div>
          ))}
          {form.sections.effects && (
            <div className="mt-3 max-w-xs">
              <label className="adm-label" htmlFor="fx-speed">Effect intensity</label>
              <select
                id="fx-speed"
                className="adm-field"
                value={form.sections.effectsSpeed}
                onChange={(e) =>
                  set("sections", {
                    ...form.sections,
                    effectsSpeed: e.target.value as "calm" | "normal" | "lively",
                  })
                }
              >
                <option value="calm">Calm</option>
                <option value="normal">Normal</option>
                <option value="lively">Lively</option>
              </select>
            </div>
          )}
        </section>

        {/* 08 — Contacts */}
        <section className="adm-card adm-form-section" aria-label="Contacts">
          <div className="adm-section-head">
            <span className="adm-section-num">08</span>
            <h2 className="adm-h2">Family contacts</h2>
          </div>
          <div className="adm-form-grid adm-form-grid--2">
            <Field label="Phone numbers (one per line)" span2 hint="Shown on the invitation, for example +91 95829 15979 (Inviteo)">
              <textarea className="adm-field" value={form.contacts.numbers.join("\n")} onChange={(e) => set("contacts", { ...form.contacts, numbers: e.target.value.split("\n") })} />
            </Field>
            <Field label="WhatsApp number" hint="Digits with country code, for example 919582915979">
              <input className="adm-field" inputMode="tel" value={form.contacts.whatsapp} onChange={(e) => set("contacts", { ...form.contacts, whatsapp: e.target.value })} placeholder="919582915979" />
            </Field>
            <Field label="RSVP WhatsApp number">
              <input className="adm-field" inputMode="tel" value={form.contacts.rsvpNumber} onChange={(e) => set("contacts", { ...form.contacts, rsvpNumber: e.target.value })} placeholder="919582915979" />
            </Field>
          </div>
        </section>

        {/* 09 — Link */}
        <section className="adm-card adm-form-section" aria-label="Website link">
          <div className="adm-section-head">
            <span className="adm-section-num">09</span>
            <h2 className="adm-h2">Website link</h2>
          </div>
          <div className="adm-form-grid adm-form-grid--2">
            <Field label="Slug" hint="Lowercase letters, numbers and hyphens. Auto-generated from the couple's names; a free variant is picked if taken.">
              <input
                className="adm-field"
                value={form.slug}
                onChange={(e) => { setSlugTouched(true); set("slug", e.target.value.toLowerCase()); }}
                placeholder="couple-names"
              />
            </Field>
            <div>
              <span className="adm-label">Public URL</span>
              <p className="adm-field flex items-center font-mono text-sm" style={{ background: "rgba(11,25,44,0.03)", overflowWrap: "anywhere" }}>
                {origin || ""}/{form.slug || slugifyCouple(form.groom, form.bride) || "…"}
              </p>
            </div>
          </div>
          {mode === "edit" && (
            <div className="mt-6 flex items-center gap-3">
              {confirmDelete ? (
                <>
                  <button className="adm-btn adm-btn--danger" disabled={pending} onClick={removeWebsite}>Confirm delete</button>
                  <button className="adm-btn adm-btn--outline" onClick={() => setConfirmDelete(false)}>Cancel</button>
                  <span className="adm-hint" style={{ margin: 0 }}>Goes offline now; photos purged after the retention window.</span>
                </>
              ) : (
                <button className="adm-btn adm-btn--danger" onClick={() => setConfirmDelete(true)}>Delete website</button>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
