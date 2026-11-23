# nextsolutions agency — website

Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · GSAP 3.15 + ScrollTrigger · Lenis · React Hook Form + Zod (mini).
French at `/`, English at `/en` with translated slugs. Every page is statically prerendered.

## Commands

```bash
npm install
cp .env.example .env.local     # then fill in the values you have
npm run dev                    # http://localhost:3000
npm run build && npm start     # production build
npm run lint                   # ESLint
npx tsc --noEmit               # type-check
SHOW_DRAFT_PROJECTS=1 npm run dev   # preview the project showcase with layout samples (dev only)
```

Deploys to Vercel as-is (set the environment variables in the Vercel project).

## Environment variables

See `.env.example`. Nothing in the UI is invented: when a value is missing, the element is hidden.

| Variable | Effect when empty |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical/hreflang/sitemap URLs fall back to `http://localhost:3000` — **set before going live** |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | All WhatsApp links are hidden |
| `NEXT_PUBLIC_CONTACT_EMAIL`, `_PHONE`, `NEXT_PUBLIC_SOCIAL_*` | Not shown in footer / JSON-LD |
| `NEXT_PUBLIC_LEGAL_*` | Company details block hidden on the legal notice |
| `LEAD_WEBHOOK_URL` (server) | Form submissions return 503 and the form shows an honest error |
| `LEAD_WEBHOOK_SECRET` (server) | No `X-Webhook-Secret` header |

### Lead webhook payload (n8n → Google Sheets → WhatsApp notification)

`POST LEAD_WEBHOOK_URL`, JSON:

```json
{ "name": "…", "whatsapp": "+212 …", "service": "automation", "budget": "5-15k", "timeline": "asap",
  "website": "", "message": "", "locale": "fr", "source": "website", "page": "https://…/demarrer-un-projet",
  "receivedAt": "2026-11-15T20:27:05.942Z" }
```

The site reports success only if the webhook answers 2xx. Validation is shared client/server (`src/lib/lead.ts`); a honeypot field and a per-instance rate limit filter basic spam.

## Structure

```
src/
  proxy.ts                    public URLs → app/[lang] (FR unprefixed, EN translated slugs, /fr/* → 308)
  app/
    [lang]/                   one root layout per locale (fonts, header, footer, intro, Lenis)
      page.tsx                homepage — the 12 scenes
      services/[service]/     4 service pages (one template, per-service content)
      realisations/           work index + [slug] case studies
      methode-et-tarifs/  agence/  demarrer-un-projet/  mentions-legales/  confidentialite/
    api/lead/route.ts         lead endpoint (server-side forwarding, no secrets in the browser)
    sitemap.ts  robots.ts
  content/
    fr.ts  en.ts              ALL copy (typed: en must match fr's shape)
    projects.ts               case studies, metrics, testimonials (empty until verified)
  components/
    brand/                    official logo artwork inlined from the brand kit (never retyped)
    home/                     hero film, Vision, then chapters 03–08: WorkShowcase, ExpertiseShowcase, SolutionsList, ApproachTimeline, WhyStatement, Finale (+ MethodLine for the method page)
    demos/                    flat UI scenes (service pages, solution previews)
    work/                     grid, "Voir / Explorer ↗" cursor, card→page transition, project cover
    sections/ form/ layout/ motion/ ui/
  lib/                        i18n routes, site facts (env), SEO helpers, GSAP setup, lead schema
```

## Editing content

* Copy: `src/content/fr.ts` (and the same key in `en.ts`). TypeScript fails the build if English is missing a key.
* URLs: `src/lib/i18n.ts` → `routes`.
* **Projects:** add an entry to `src/content/projects.ts` with `published: true`, real captures in `public/images/work/<slug>/` (16:10 cover, optional portrait `coverMobile`, `board: true` for white documents), `title`, `category`, a one-line `summary` and the case study (`challenge`, `strategy`, `design`, `development`, `outcome`). Never invent a result or a figure. The two published entries are **studio projects** (our own site and identity, tagged “Projet studio”); client work goes first in the array once approved. The homepage shows the first two, then the “Votre projet” invitation.
* **Metrics / testimonial (scenes 8–9):** fill `metrics` / `testimonials` in the same file. Empty arrays hide the sections.

The data shape mirrors what a Sanity schema would return; swapping `getProjects()` for a Sanity query is a contained change.

## Motion map

| Where | What | Notes |
|---|---|---|
| Scene 0 | N draws, arrow slides in, mark flies to header (1.2s) | Pure CSS, first homepage visit per session, ends on its own |
| Scene 1 ★ | Full-bleed film (`public/videos/hero-nextsolutions.mp4`, 720p `-mobile.mp4` under 768px, poster `public/images/hero-poster.webp`) with Ink scrims (left → right on desktop, bottom-up on mobile). Eyebrow, two masked headline lines (line 2 in #79CFFF), lead and white CTA rise in with a stagger. Proportions follow the golden ratio (`.hero` in globals.css: lead = eyebrow·φ, title = eyebrow·φ⁴, gaps φ/φ² rem, 61.8% copy column, free space φ:1 above/below, φ³:1 on phones); CTA and pause control share one 48px row. Normal scroll (no pin): as the hero leaves, the copy drifts up 60px and fades while the film moves 18% slower than the page | Entrance is CSS. Film starts after `load`, plays only on screen, pause/play control (WCAG 2.2.2). Reduced motion / Save-Data: poster only, no video download unless the visitor presses play |
| Trust bar | `TrustBar.tsx` (server component) — « Ils nous font confiance » on #081522, in normal flow between the hero and the vision: CSS marquee of two identical halves sliding by 50% (60s, pause on hover), edge fade masks | Confirmed client logos only (`public/images/clients/`); repeats are aria-hidden. Reduced motion: static row |
| Scene 2 ★ | `Vision.tsx` — « Notre vision », two columns on Cloud (stacked on mobile, text first). Left: label, headline read word by word with the scroll (opacity + light blur + a few px up, scrub), paragraph and « Voir nos réalisations » follow. Right: a business owner, the website on a laptop, three impact cards (more clients / sales / profitability, no numbers) and a blue growth line, all placed in % of one fixed-ratio box (cards in container units). Visual settles in once (photos → line draws → end point → cards), then a ±3% parallax. Fine pointer: 100px Next Blue sphere turns headline letters white (white copy rendered twice, `inert`, same timeline). Exit: Cloud clears to white | Photos `public/images/vision/*.webp` re-masked from the supplied PNGs (clean rounded edges, 60–80 KB). Illustrations, not client work. Reduced motion: static |
| Scene 2b ★ | `Expertises.tsx` — « Nos expertises » (title for screen readers only), three slides in one frame (sites web, IA & automatisation, SaaS), one at a time. Each slide: service name (blue, no number), two masked headline lines (line 2 in Next Blue), key phrases in Ink separated by blue dots, one large visual built in HTML/SVG (`expertises/visuals.tsx`): a browser/phone with a responsive demo site that scrolls to its second section; a workflow (order → automation → WhatsApp confirmation + Google Sheets) whose lines draw; a SaaS dashboard revealed by a mask, its module code behind it, a « Facturation » module snapping into its slot, an access-control badge. Chapter change ≈ 0.75s, layers animated independently (headline exits up through its masks, visual drifts 32px and fades, next one enters from the other side through a widening mask, counter rolls). Rotates on its own: each slide plays its demonstration, stays 3 s (`DWELL`), then the next one (≈ 6 s per slide, loops); the bar under the current service name fills during the wait. Only while on screen and the tab visible; pauses on keyboard focus; pause/play button (WCAG 2.2.2). Navigation: the three service names, arrows, ← → keys, swipe; locked while animating; no scroll-jacking. Visual size follows the screen height so copy + visual + navigation fit on a laptop. All slides share one subgrid cell, so the height never changes. Background: white at both edges, Cloud while the slides fill the screen | Per-slide choreography in `expertises/motion.ts` (fromTo toward the CSS default, so a killed intro = finished composition). Reduced motion: no rotation unless the visitor presses play, instant swap, complete visuals. Only raster: `public/images/expertises/riad-courtyard.webp` (cropped from the supplied Riad mockup). Riad El Fès and dashboard data are fictional and captioned as such. Serif of the demo site: Cormorant Garamond (OFL, `src/fonts`, not preloaded) |
| 04 Réalisations ★ | `Realisations.tsx` on Cloud (continues Nos expertises, no seam). Centred label « 04 / RÉALISATIONS » and two-line headline (line 2 Next Blue). A centred device carousel: one project at a time in the same 3D laptop + phone (renders in `public/images/realisations/`), neighbours small and faded on the left and right, cut by the screen edges. Every 4.5 s (`DWELL`) it slides to the next one (≈1 s move, the incoming phone lagging a beat for depth; a project wrapping round leaves on one side and comes back on the other). Under it: category · tag, then the project name as the link with a round arrow (old caption leaves upward, new one rises). Navigation: swipe / drag, click a neighbour, ← → keys, arrows, one progress bar per project, counter, pause button. Pauses on hover, keyboard focus, off screen and hidden tab. Entrance once on arrival (laptop up, 0.94 → 1 with a few degrees of perspective, then the phone from the right); desktop fine pointer: restrained parallax. No custom cursor (client: “cheap”). | Projects: `src/content/showcase.ts` (only `published` items with a laptop render; links = real routes). Renders for any site: `python scripts/device-mockup.py <id> --desktop d.png [--mobile m.png]` maps captures onto the La Maison des Amis devices (perspective, rounded screen, Dynamic Island kept, 6% status bar). La Maison des Amis is temporary client content (CTA → /realisations). SAO Eleven, Vert Marine, Traiteur, Awda: unpublished slots. Reduced motion: no rotation unless play is pressed, instant changes |
| 05 Notre approche ★ | `Approche.tsx` (+ `approche/demos.tsx`, `approche/story.ts`), on white after the Cloud of Réalisations. Label « 05 / NOTRE APPROCHE », masked two-line headline, one-line lead, then four chapters separated by hairlines, each in three zones on ≥1100px (headline + copy + service link · demonstration · compact list), stacked below. One fictional client (Maison Safran, caterer, captioned) runs through all four: 01 site — browser goes brief → wireframe (strokes draw) → designed site (mask wipe) → working site (load bar, cursor, hover, scroll) → desktop steps back and the phone arrives; 02 SEO — query typed, results (ours among others, no position claimed), site opens, internal link, quote form filled and sent, « Nouvelle demande reçue » toast; the four foundations highlight their place in the journey; 03 automation — an order runs through six nodes (waiting → running → done, connector fills, WhatsApp message, Sheets row), « traitée sans intervention manuelle »; 04 SaaS — product → its four layers → « Facturation » module plugged in → security frame (authentication, roles, activity log, encrypted traffic) → product with the new module. Each demo plays once when visible, then: replay button, stage bars, and the side list opens any stage | Timelines: labels `s{k}`/`h{k}`, initial states set at 0, CSS default = final result (no-JS / reduced motion show the finished demos; the lists still switch stages instantly). No pin. Only raster: `public/images/approche/plat.webp` (cropped from the supplied caterer mockup). The search is illustrative: no ranking or result promised (caption) |
| 06 L’agence | `Agence.tsx` on Cloud. Label « 06 / L’AGENCE », masked two-line headline (« vision. » Next Blue), one-line lead on the right. The two co-founders with equal treatment, kept small and quiet (client: photos small and minimal): compact 4:5 portrait, beside it « Cofondateur · 0N », name, specialty, degree; under both, a hairline and « EXPÉRIENCES » + colour logos at one optical height. Side by side with a hairline axis from 1024px, stacked below. Entrance once: portraits open with a vertical clip, text then logos rise. Hover (fine pointer): photo 1.025, short blue line under the name | Data: `src/content/founders.ts`. Logos in `public/images/experience/` are past experience of each founder, never clients — not in the trust bar. GEB Analysis is a PROVISIONAL typographic stand-in: replace `geb-analysis.png` with the official mark. Portraits: `public/images/team/*.webp` 1000×1250 |
| 07 Le prochain chapitre ★ | `Finale.tsx` (`id="contact"`). The Ink panel rises out of the Cloud founders section inset with rounded top corners and opens to full bleed (scrubbed, no pin). « On a parlé de nous. / Parlons de vous. » (line 2 Sky Soft #79CFFF), one per line on ≥768px, two lines each on phones; each sentence rises out of its mask, then the sentence and one CTA. « The blue response »: white pill « Démarrer un projet » with a Next Blue circle (the Vision sphere, small) that scales in, leans ≤4px toward a nearby pointer; the button follows the pointer ≤5px; hover / focus fills the button from the circle and steps the arrow up-right; touch: same on press | CTA → start page (form → /api/lead webhook). Reduced motion: static, instant fill |
| Footer | `Footer.tsx`, every page, same Ink: hairline, official logo once (small) + « Turn problems into solutions. », navigation in two columns (Accueil, Expertises, Réalisations, Notre approche, L’agence → home anchors; Contact → start page), Contact (Casablanca, Maroc + only the contact points / socials configured in `lib/site.ts`), bottom line © year Next Solutions Agency · legal pages · Retour en haut. No oversized wordmark (client: too much « Next Solutions ») | Social icons render only when `NEXT_PUBLIC_SOCIAL_*` are set |
| Scene 11 | Official compact logo full width, glyphs rise 40ms apart | Glyphs split from the kit SVG, coordinates untouched |

Chapter transitions — each one says something:

| Where | Transition | Meaning |
|---|---|---|
| Hero → Vision | Normal scroll: the film slows and its copy fades, the trust bar closes the first screen, the vision statement rises into place | From the film to the statement, with proof (the clients) in between |
| Vision → Expertises → Réalisations | As Vision leaves, its Cloud background clears to white (scrub); Nos expertises turns Cloud once its top edge has passed mid-screen and stays Cloud into Réalisations (same ground), where the centred devices come up out of the page | From the statement to the proof |
| Réalisations → … → Différence | Light surfaces alternate (Cloud 04, White 05, Cloud 06, White 07, Cloud 08), no dark page in between (2026-11-22) | One calm, light story between the two Ink bookends (film and finale) |
| Différence → À vous de jouer | Lights down: the white layer under the finale fades out, the sphere returns | « À vous de jouer » |
| Every section title | `<SplitTitle>`: real lines rise out of masks (SplitText, re-split on resize / font load) | Every chapter opens the same way as the hero |

`<Rise>` (`components/motion/Rise.tsx`, currently unused on the homepage) wraps an incoming section and acts on its previous sibling (which must be at least one screen tall). The header picks its tone from whatever is painted under it (`elementsFromPoint`), so overlapping chapters are handled.

Design system (2026-11-22, taken from sections 01–03 and applied site-wide):
- Section header: `<ChapterLabel>` « NN / LABEL » (hairline + blue overline), then a two-line `t-display` title at the Vision scale (34→52px phones, 40→68px desktop, weight 800, −0.042em) with line 2 in Next Blue (Sky Soft on Ink), then a Slate `t-lead`.
- `t-h1` / `t-h2` are weight 800 with tight tracking; no more 6–10rem display numbers.
- Surfaces: `frame` (rounded 20px clip, replaces the 45° `cut` on media), `card` (white, hairline, 16px radius, `--shadow-card`), `orb-btn` (round arrow control), tokens `--radius-card`, `--radius-frame`, `--shadow-card`, `--shadow-float`. The 45° cut lives on in the logo and arrow only.

Buttons: one size everywhere — `btn` utility (48px, 6px radius `rounded-btn`, 15px label) and `btn-icon` (48px square). Use `<Button>`; it has no size prop.

Header: transparent over the hero film (white CTA with inline arrow over Ink), Ink when scrolled over any `[data-header-dark]` section, white elsewhere.

Global: brand curve `cubic-bezier(0.22,1,0.36,1)`, header hides on scroll down / returns on scroll up, reading-progress arrow, links draw their underline, 500ms page fade. `prefers-reduced-motion`: no pinning, no loops, content static and fully readable. Lenis loads only on fine-pointer devices.


Performance: below-the-fold sections build their GSAP setup with `whenNear()` (lib/gsap.ts) and section titles split lazily, so page load does not pay for tweens that read and write styles; pins are always created at load.
