# Rajasthani Vows (Inviteque) — study, gaps, plan

Source: `https://www.inviteque.com/templates/rajasthani-vows?preview=true`.
Method: SPA shell, so structure + copy extracted from their JS bundles
(`index`, `TemplateRoute`, `RajasthaniVowsCountdown`, `southern-serenade`
as the shared section architecture — same engine, different skin).
NOT copied — patterns only.

## 1. How theirs is done

**Section order (all forced ON in `?preview=true`):**
1. Splash / cover — "Wedding Invitation Cover", "A Royal Invitation", tap-to-open
2. Hero — couple names, "ARE GETTING MARRIED", date + venue, hero artwork
3. Countdown — "COUNTING DOWN TO {date}", days/hrs/min/sec, padded digits
4. Sacred story — 3 rotating love quotes + "Moments in Time" photo gallery
5. Welcome / invitation — "Dear Friends & Family / JOIN US IN CELEBRATION & BLESSINGS"
6. Schedule — "TIMELINE OF EVENTS", per-event time + title + 1-line desc
   (Haldi → Wedding Vows → Grand Reception), SVG curve connectors between items
7. Venue — "CELEBRATION VENUE", venue illustration, address, **QR "Scan for Directions"**
8. RSVP + footer + bg music toggle
9. Preview bar (builder only): device toggle, edit/share actions

**Design tokens (Rajasthani skin):** deep maroon `#7A1228` + gold, ivory ground,
Cormorant Garamond, dashed gold dividers, layered soft shadows
(`0 24px 60px rgba(maroon,0.12)`), inline SVG line-art motifs
(lotus / paisley / leaf paths, maroon `1.5px` strokes), per-template
Cloudinary asset mappings (palace bg, thumbnails).

**Animation (framer-motion, from bundle):**
- `whileInView` reveals ×8–11 per page + `variants` ×17–45 + 1 stagger group
- `ease` curves ×18, `scale` ×12, `rotate` ×2 (countdown digits)
- Countdown digits padded (`padStart`) with scale/rotate tick on change
- No scroll-jacking, no parallax-on-text seen — reveals are section-local

## 2. What we already have (parity — don't rebuild)

| Theirs | Ours |
|---|---|
| Splash cover | `OpeningOverlay` (curtain/petals/fade/diya/waves) ✓ |
| Hero arch portrait | jharokha arch + draw-on SVG + sheen ✓ (better) |
| Countdown | `Countdown.tsx` 5 variants ✓ (missing label + digit pop) |
| Story + gallery | story sections + `Gallery` ✓ |
| Schedule | `EventCard` ✓ (missing SVG connectors) |
| Venue + maps | venue blocks + 1-tap Maps ✓ (missing QR) |
| RSVP / music / share | `RsvpForm` / `MusicToggle` / `ShareBar` ✓ |
| Preview mode | sample weddings per template ✓ (no `?preview` force-on) |

## 3. Gaps worth implementing (ranked)

1. **QR "Scan for Directions" venue card** — biggest functional gap. QR encodes the
   Google Maps URL next to the 1-tap button. Elder-friendly, print-friendly.
2. **Countdown label + digit transition** — add "COUNTING DOWN TO {date}" eyebrow
   and a scale tick on the seconds digit (`wi-tick` exists; extend to all digits).
3. **Schedule SVG connectors** — curved dashed line threading event cards
   (their `M 200 … C …` path pattern), desktop only, hidden <md.
4. **Rajasthani motif set** — lotus + paisley gold line-art SVGs as section
   dividers (we have filigree corners + mandala; motifs are the skin-level win).
5. **`?preview=true` force-on** — PreviewBar equivalent: query param that forces
   all sections visible with sample data for sharing drafts.
6. **Rotating story quotes** — 3-quote fade cycle in story section (cheap, high feel).

NOT adopting: per-guest paid RSVP gating, builder auth flows, Cloudinary —
out of scope for our static templates.

## 4. Placeholders (generate real AI images later)

Dir: `public/weddings/placeholders/` — all SVG stand-ins, wired NOWHERE
(no live visual change). Swap each with generated art when ready:

| Placeholder | Future generated image | Used in (when wired) |
|---|---|---|
| `rajasthani-hero.svg` | 3:4 arch couple portrait, maroon/gold attire | new `RajasthaniVows` hero (gap: we have no maroon-skin template) |
| `rajasthani-palace-bg.svg` | 16:9 palace courtyard dusk | hero backdrop / venue card |
| `rajasthani-motif-lotus.svg` | gold lotus line-art, transparent | section dividers |
| `rajasthani-motif-paisley.svg` | gold paisley line-art, transparent | schedule connectors, footer |
| `rajasthani-venue-qr.svg` | real QR (generate at build from Maps URL) | venue card, next to Maps button |

Suggested prompts kept with each asset request: "flat gold line-art on
transparent, Rajasthani lotus, 1.5px strokes, no background" etc.

## 5. Implementation order (surgical, existing components first)

Their splash cover ("A Royal Invitation", tap-to-open) → our `envelope`
`OpeningOverlay` variant: sealed shagun envelope + wax-seal monogram →
tap → seal breaks → flap rotateX opens → card rises out → overlay fades.
Wired on RoyalHeritage + TraditionalVivah (one-prop switch for the rest).

- `components/weddings/EnvelopeReveal.tsx` (new) + `wi-env-*` CSS
- Skill used for motion rules (tokens as CSS curves), not components:
  no Radix/shadcn primitives in project; Motion pkg would fight the
  compositor-only CSS system → deviation recorded below
- Placeholders: none needed (pure CSS/SVG, no art)

- [x] 1. `Countdown.tsx` — eyebrow label (`COUNTING DOWN TO · {date}`, override via
  `label` prop) + `wi-pop` digit pop on every digit (was seconds-only `wi-tick`)
- [x] 2. Venue blocks — `VenueQR` component added to all 5 templates next to the
  Maps button; `data-qr="placeholder"` faux-QR tile until real QR (qrcode pkg)
- [x] 3b. Home carousel — `ArchCarousel` (arch cards + `wi-arch-wave` staggered
  float) replaced `DesignCarousel` on `/wedding-invitations` (old file deleted)
- [ ] 3a. `EventCard` schedule connectors — SVG curve, desktop-only (needs design)
- [ ] 4. Motifs — placeholders in `public/weddings/placeholders/`, swap with
  generated art, use as dividers
- [ ] 5. `RajasthaniVows.tsx` template — only after hero art generated
- [ ] 6. `?preview` param — needs product decision on draft sharing

## 6. Envelope → wedding-card reveal (done, Animate UI path C)

Superseded by §7: envelope is now one of five engine-driven openings.

## 7. Reusable invitation experience engine (done)

- `lib/weddings/template-experience.ts` — per-template config: opening type,
  envelope theme, timing, asset manifest, palette, fonts. `experienceFor(slug)`
  with royal fallback. Admin picks slug → everything loads, no manual config.
- `components/weddings/TemplateOpening.tsx` — shared mapper; all 5 templates
  render `<TemplateOpening wedding/>` instead of hardcoded overlay variants.
- Unique openings: royal `envelope` (maroon/gold, petals, glow) · floral `bloom`
  · minimal `unfold` · vivah `scroll` (temple + diya + clip-path unroll) ·
  destination `postcard` (flip + sunset). Old curtain/diya/waves/fade/petals
  variants retained in code, unwired.
- Envelope polished: themed papers/seals, ribbon tails, embossed medallion,
  flap drop-shadow, glow burst, marigold petal fall.
- Placeholders: 16 SVGs in `public/weddings/placeholders/` (all 5 templates);
  text stays HTML. Real AI art swaps in per the manifest in §4/`template-experience.ts`.
- Admin: template picker unchanged (works) + "Open sample invitation ↗" link
  (full published-style preview via `demoWeddingFor`) beside structure preview.
- Motion: Animate UI path C, token curves as CSS, compositor-only;
  reduced-motion returns null overlay + CSS zeroes travel; skip = tap/scroll/Esc.

## 8. Left for later (needs tools not available here)

- AI raster art for the 16 placeholders (no image tool in this env).
- Real QR (qrcode pkg) replacing `VenueQR` faux tile.
- Screenshots + device testing (no browser automation here — belt login blocked);
  verified via SSR markup curl on all 5 samples + admin route status instead.

## 9. Homepage phone showcase (done, v2 — no iframes)

- `PhoneCarousel` + `MiniInvite` — 5 templates in phone mockups. v1 used live
  iframes (too heavy: 5 full Next pages with overlays/intervals). v2 renders
  featherweight static DOM: real names/dates/events/venue/photos + the
  template's own palette/fonts, zero intervals/observers/navigation.
- Default focus = middle template (Neelam Blue, index 2).
- `touch-action: pan-y` → vertical pans scroll natively, horizontal pans drive
  the carousel (axis-locked, 60px to switch). Active phone auto-tours;
  interaction pauses 8s; offscreen/hidden/reduced-motion stop everything.
- Type audit (250px viewport): desktop template sizes (text-4xl/5xl names)
  would blow out the phone — MiniInvite re-sets everything: names 25px,
  eyebrows 8.5px, body 10–12px, chips 15px, buttons 9–9.5px uppercase.
- Info panel: name, category, description, View Demo (sample invitation),
  Choose This Template (`/admin/.../new?template=`). `?preview=auto` +
  RSVP-disabled previews retained for full demos (zero iframe weight now).

## 10. Home cleanup, ₹499 pricing, Animate UI icons (done)

- Removed the duplicate `LIVE SAMPLE INVITATIONS` grid from home (View Demo
  buttons + templates page already cover samples).
- Price: `₹499 one-time · cheapest` in hero trust line, comparison table
  (`✓ ₹499 one-time · zero waste` vs `₹₹₹ · waste` paper), CTA headline
  (`Just ₹499 one-time — the cheapest way to invite everyone`).
- Free animated icons from Animate UI's Lucide registry (MIT-style free):
  `components/animate-ui/icons/{map-pin,music,check}.tsx` + `@animate-ui/react`
  + `motion` deps. Wired: `Music` (tap) in MusicToggle, `MapPin` (on view) in
  VenueQR caption, `Check` (on view) replacing ✓ glyphs in the comparison table.
- Deliberately NOT iconified: WhatsApp brand glyph (real logos keep their own
  artwork), carousel/text arrows (typographic, fine at small sizes), offer ✦
  dividers (decorative rhythm, icons would add noise).
