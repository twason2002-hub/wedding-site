import type { TemplateDefinition, WeddingData } from "@/lib/weddings/types";

/**
 * MiniInvite — featherweight live preview of a wedding invitation.
 * Real content (names, dates, events, venue, photos) + the template's own
 * palette/fonts, typeset for a ~250px phone viewport (NOT desktop sizes).
 * No intervals, no observers, no navigation — pure static DOM that the
 * carousel scrolls natively (overflow-y) or via the auto-tour.
 *
 * Type scale (audited for 250px width — desktop template sizes like
 * text-4xl/5xl names would blow out the phone, so everything is re-set here):
 * names 25px · section titles 13px · body 11px · eyebrows 8.5px · chips 15px.
 */
export default function MiniInvite({
  template: t,
  wedding: w,
}: {
  template: TemplateDefinition;
  wedding: WeddingData;
}) {
  const names = `${w.couple.bride} & ${w.couple.groom}`;

  const ink = t.palette.ink;
  const accent = t.palette.accent;
  const photos = w.gallery.slice(0, 3);
  const events = w.events.slice(0, 4);

  return (
    <div style={{ background: t.palette.surface, color: ink }} className="min-h-full pb-6">
      {/* Hero art */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={t.thumbnail} alt="" aria-hidden="true" className="aspect-[16/10] w-full object-cover" loading="lazy" />
      <div className="px-4 pt-4 text-center">
        <p style={{ color: accent, fontSize: 8.5, letterSpacing: "0.28em" }} className="font-medium uppercase">
          {w.blessing ?? "॥ शुभ विवाह ॥"}
        </p>
        <h4
          style={{ fontFamily: t.fonts.display, fontSize: 24, lineHeight: 1.15, color: ink }}
          className="wi-couple-heading mt-1.5 font-normal"
        >
          {names}
        </h4>
        <p style={{ fontSize: 10.5, letterSpacing: "0.18em", color: accent }} className="mt-1.5 font-medium uppercase">
          {w.couple.weddingDateDisplay}
        </p>

        {/* Contents strip (static — the full demo has the live countdown) */}
        <div
          className="mx-auto mt-3 grid max-w-[210px] grid-cols-3 gap-1.5"
          style={{ fontSize: 15, fontWeight: 700 }}
        >
          {[
            [`${events.length}`, "Events"],
            [`${photos.length}`, "Photos"],
            ["1", "RSVP"],
          ].map(([v, l]) => (
            <div
              key={l}
              className="rounded-lg px-1 py-2"
              style={{ boxShadow: `inset 0 0 0 0.75px ${accent}66` }}
            >
              {v}
              <span className="mt-0.5 block" style={{ fontSize: 7.5, letterSpacing: "0.2em", fontWeight: 500, color: accent }}>
                {l}
              </span>
            </div>
          ))}
        </div>

        {/* Events */}
        <p style={{ color: accent, fontSize: 8.5, letterSpacing: "0.28em" }} className="mt-5 font-medium uppercase">
          Celebrations
        </p>
        <div className="mt-2 space-y-1.5 text-left">
          {events.map((e) => (
            <div
              key={e.id}
              className="rounded-xl px-3 py-2"
              style={{ boxShadow: `inset 0 0 0 0.75px ${accent}44` }}
            >
              <p style={{ fontSize: 12 }} className="font-semibold leading-snug">
                {e.name}
              </p>
              <p style={{ fontSize: 10, opacity: 0.75 }} className="mt-0.5 leading-snug">
                {e.date} · {e.time}
              </p>
              <p style={{ fontSize: 10, opacity: 0.75 }} className="leading-snug">
                {e.venue}
              </p>
            </div>
          ))}
        </div>

        {/* Gallery strip */}
        {photos.length > 0 && (
          <>
            <p style={{ color: accent, fontSize: 8.5, letterSpacing: "0.28em" }} className="mt-5 font-medium uppercase">
              Gallery
            </p>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {photos.map((g) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img key={g.src} src={g.src} alt="" aria-hidden="true" loading="lazy" className="aspect-square w-full rounded-lg object-cover" />
              ))}
            </div>
          </>
        )}

        {/* Venue */}
        {w.venue && (
          <div
            className="mt-4 rounded-xl px-3 py-3"
            style={{ boxShadow: `inset 0 0 0 0.75px ${accent}44` }}
          >
            <p style={{ color: accent, fontSize: 8.5, letterSpacing: "0.28em" }} className="font-medium uppercase">
              Venue
            </p>
            <p style={{ fontSize: 12 }} className="mt-1 font-semibold leading-snug">
              {w.venue.name}
            </p>
            <p style={{ fontSize: 10, opacity: 0.75 }} className="mt-0.5 leading-snug">
              {w.venue.address}
            </p>
            <span
              className="mt-2 inline-block rounded-full px-4 py-1.5"
              style={{ background: ink, color: t.palette.bg, fontSize: 9, letterSpacing: "0.18em", fontWeight: 700 }}
            >
              GET DIRECTIONS →
            </span>
          </div>
        )}

        {/* RSVP visual */}
        <span
          className="mt-4 inline-block w-full rounded-full py-2.5"
          style={{ boxShadow: `inset 0 0 0 0.75px ${accent}88`, fontSize: 9.5, letterSpacing: "0.22em", fontWeight: 700, color: accent }}
        >
          RSVP ✦
        </span>
        <p style={{ fontSize: 9, opacity: 0.6 }} className="mt-3">
          {t.name} · Inviteo
        </p>
      </div>
    </div>
  );
}
