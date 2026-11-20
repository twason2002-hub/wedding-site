# Interactive upgrade plan (all 5 templates)

Research deltas (Zola/WithJoy vs ours): personalised guest URLs, shared guest
photo albums + live slideshow, virtual guestbook, guest Q&A, password pages,
registry, thank-you notes. Ours leads on cinematic openings; gaps are guest
participation + a few premium interactions (scratch, timeline, borders, ambient
effects). Animate UI mapping: ParticlesEffect (scratch + RSVP bursts), Shine
enableOnHover (primary CTAs), animated icons (done: music/map-pin/check);
no other primitives — custom CSS system stays (compositor-only, 60fps).

## Architecture

- `template-experience.ts` += per-template `features` (effects kind/speed,
  scratch foil/card colors, border motif, defaults on/off).
- `WeddingData.sections` += optional flags (effects/scratch/borders/wishes/
  uploads/reactions) — additive, old rows still render.
- `WeddingRenderer` (single point): SideBorders + FloatingEffects + GuestGreeting.
- Per-template inserts (same anchors in all 5): ScratchReveal before countdown;
  Timeline replaces the events grid; GuestSections (Wishes + Reactions +
  GuestUpload) before RSVP.
- Shared comps, no duplication: ScratchReveal, SideBorders, Timeline,
  FloatingEffects, GuestGreeting, Wishes, Reactions, GuestUpload.
- Backend (mirror `wedding_rsvps` RLS pattern): `wedding_wishes` table +
  `wedding_guest_photos` table + `guest-photos` bucket (public read, anon
  insert-only to live sites, admin moderate). API: /api/weddings/wishes
  (GET/POST), /api/weddings/photos (POST multipart).
- Admin: feature toggles card (defaults from template config), music track URL,
  effect speed; wishes list + photo moderation on the rsvps page.
- Gallery (shared, zero template edits): touch swipe in lightbox, auto
  slideshow toggle, masonry/polaroid layouts mapped from existing variant.
- MusicToggle: WebAudio-style volume fade in/out + admin track URL field.
- Countdown: post-wedding thank-you state (>24h past).
- Travel gaps: Minimal + Vivah venue blocks gain hotels list (others render it).
- Taste rules: no new emojis, one primary action per screen, reduced-motion
  everywhere, mobile-first, lazy + offscreen pause.

## Deferred (out of scope, noted not built)

Registry/gifting, password pages, per-guest event visibility, SMS/OTP login —
need product + payments decisions.

## Built (this pass)

Shared: ScratchReveal (canvas + Particles burst + fallback), SideBorders
(5 motifs, desktop-only), Timeline (scroll-drawn spine + staggered EventCards),
FloatingEffects (6 kinds, IO + visibility paused), GuestGreeting (?guest=/`g=`),
Wishes (+API+table), Reactions (client burst), GuestUpload (+API+table+bucket),
MusicToggle fade, Countdown thank-you, Gallery swipe/slideshow/masonry/polaroid,
TravelInfo hotel gaps closed, admin feature toggles + music track + wishes/
photo moderation, `experienceFor` config per template (effects/scratch/borders
+ defaults). Wired in all 5 templates + WeddingRenderer. tsc/eslint clean;
SSR-verified on all 5 samples.

## Operator step (needs a human with Supabase access)

Migrations `0008_wedding_wishes.sql` + `0009_guest_photos.sql` are written
but NOT applied (new tables/policies/bucket — needs your confirm). Apply with
the Supabase CLI (`supabase db push`) or SQL editor, then wishes/uploads go
live. Until then those sections render empty states and POSTs 503 — by design,
no crash.

## Templates page: simple cards (done)

`/wedding-invitations/templates` redesigned from large alternating detail
cards to a compact responsive grid (1/2/3 col): thumbnail + category pill,
name, 2-line description, palette dots, sample link, stacked CTAs
(Open Live Preview / See Full Wedding). ArchCarousel index removed;
`ArchCarousel.tsx` deleted (no remaining references).

## Timeline elegance pass + guest sections trimmed (done)

- Timeline redesigned: single centered max-w-2xl column, scroll-drawn spine,
  numbered medallions, chapter eyebrows, staggered ScrollReveal entrances
  (110ms steps), closing flourish. Same EventCard content, more air.
- Wishes + GuestUpload removed from render (components, APIs, migrations,
  admin moderation kept for later). Reactions stay. Admin never had
  wishes/uploads switches — no admin change needed.

## Mobile audit (real-device emulation, 390px)

- Borders now show on mobile too: slim 16px rails, single medallion rhythm,
  0.7 opacity (desktop keeps full rails). Verified in DOM on a live template.
- Hero verified clean on mobile: no overflow (scrollWidth == viewport),
  viewport meta correct, type wraps properly.
- The black "N" circle seen in dev screenshots is the Next.js DEV badge
  (fixed bottom-left, dev-only). Proof: absent in `next start` production
  screenshots. Not a site bug — never ships.
- PhoneCarousel widened on mobile (82vw/300px) for presence; MiniInvite type
  scale unchanged (audited readable).

## Premium animation upgrade — Phase 1 audit (done)

Reuse: WeddingRenderer + template-experience config + TemplateOpening +
all 8 opening scenes (improve, don't replace) + Parallax (GSAP ST) +
ScrollReveal/StaggerReveal + Timeline + Gallery/lightbox + Countdown +
FloatingEffects + SideBorders + VenueQR + ShareBar + MusicToggle + Reactions +
RsvpForm + GuestSections + admin toggles + wishes/photos backend (parked).
Improve:EnvelopeReveal art polish; openings gain GSAP-drawn SVG layers;
heroes gain signature effects; sections gain cinematic transitions; gallery
gains SVG-mask reveals. New: components/weddings/effects/* (16 primitives) +
svg/* (5 motif sets) + motion-config extension + interactions (Blessings,
VenueRoute, MusicVisualizer, ShareFeedback).
Deps: NONE — gsap 3.15.1 ships DrawSVG/MorphSVG/SplitText/MotionPath/Flip/
Observer/CustomEase/ScrollTrigger free; motion 14 + @animate-ui/react present;
dotLottie skipped (hand SVG wins here); no Framer/Anime/Spring/Lenis/Three.
Risks: React 19 double-mount → gsap.context + revert everywhere; many
ScrollTriggers → register once, kill on unmount; reduced-motion gates every
effect with static end-states; mobile counts capped; transform/opacity only.

## Phase 7 — verification (done)

- `tsc --noEmit` clean; `eslint` clean (project rules).
- `npm run build` green (Turbopack), all routes incl. new API routes.
- All 5 templates SSR-verified: unique opening markers, timeline, scratch,
  guest sections, countdown, venue route, QR, borders, floating effects.
- Real-browser interaction test (royal): sealed envelope → tap → flap/card
  reveal → hero visible, zero JS errors. Fixed `ctx.paused` bug found this way.
- Reduced-motion emulation: overlay gone, hero + countdown visible, no errors.
- Hydration: found + fixed two races — locale-dependent `toLocaleDateString`
  (now manual JAN–DEC formatting) and ticking seconds straddling a second
  boundary (now `suppressHydrationWarning` on live digits). Re-verified zero
  hydration errors on all 5 templates.
- Mobile 390px emulation: no horizontal overflow, phone + templates verified
  with screenshots; side rails slim on mobile.
- Left for human: `supabase db push` for 0008/0009; real AI art for the 16
  placeholders; device-lab pass (gestures on real phones).
