# Design system

## 1. Direction

**Swiss editorial + chrome.** Giant condensed headlines that run edge to edge, mono micro-labels, hard rectangles and rules, in the logo's black and white. The only non-monochrome element is the four-point star from the "R" of the logo, rendered in chrome.

### References (Pinterest)

Researched on Pinterest while defining the direction (October 2026):

- **Layout**: pin "Hauss Website Page Template for Webflow" — <https://ar.pinterest.com/pin/1125968743678190/>. Taken from it: the full-width wordmark as headline, mono index labels in a row above it, and giant condensed section titles.
- **Graphic system**: Pinterest search "y2k streetwear graphic design poster star chrome" — chrome four-point stars and orbit ellipses. It maps directly onto TRIM's own assets: the star in the "R" and the racing oval of the badge logo. We draw our own star (`public/brand/mark.svg`, `Star.astro`); nothing is copied from the pins.

Deliberately avoided: the neon-green-on-black "BUILT DIFFERENT" streetwear template that dominates the same searches.

### Signature element

**The hang tag.** Every garment card is a white tag under the photo: punched hole, dashed perforation, mono spec sheet (sizes, condition, colour, season), a barcode stub with the `TRM-XXXX` reference, the price and the "Consultar" button. The authenticity block on the home page reuses the same language as an oversized tag. It encodes what the business sells: verified, labelled, original garments.

## 2. Tokens (`src/styles/index.css`)

| Token | Value | Use |
| --- | --- | --- |
| `paper` | `#edeeef` | Page background (cool, not cream) |
| `tag` | `#ffffff` | Hang tags |
| `ink` | `#0b0b0c` | Text, black blocks, buttons |
| `graphite` | `#2b2c2e` | Body copy |
| `steel` | `#63666b` | Secondary labels on paper |
| `fog` | `#a7abb0` | Secondary labels on ink |
| `rule` / `rule-dark` | `#c4c7cb` / `#313236` | Hairlines on paper / on ink |
| chrome | gradient in `Star.astro` | The star only |

Radius is 0 everywhere; the only rounded shapes are the logo's own corners, the oval sticker and the tag hole.

## 3. Type

| Role | Face | Where |
| --- | --- | --- |
| Display | Big Shoulders Display 800/900, uppercase, line-height 0.86 (`display` utility) | Section titles, product names, giant numerals |
| Body | Archivo 400/500/700 | Paragraphs, FAQ |
| Utility | IBM Plex Mono 400/500, uppercase, tracked (`label` utility) | Labels, specs, prices, buttons |

Display sizes: `text-mega` (hero-scale words), `text-giant` (section openers), `text-headline`, `text-title`. The TRIM wordmark itself is never typeset: it is the traced logo.

## 4. Voice

All text is in `src/config/copy.json`. Write like a reseller's Instagram, not like a brochure:

- One idea per sentence, about 12 words max. Fragments are fine ("Tienda oficial o drop.").
- Voseo, plain verbs: "Mirá", "Tocá", "Escribinos".
- Do not explain the interface or repeat what the layout already shows.
- No selling adjectives ("increíble", "exclusivo", "premium") and no hype slogans.

## 5. Layout

- Container `.wrap`: max 90rem, fluid gutter.
- Sections alternate paper and full-bleed black blocks (`.block-ink`, with a faint SVG film grain): hero → brand marquee (ink) → En stock → cómo comprar → originales (ink) → preguntas → escribinos (ink, photo) → footer (ink).
- Section opener (`.opener`): giant title left, mono aside right, rule underneath.
- Shelf (`.shelf`): 1 → 2 → 3 → 4 columns; cards in a row end on the same line.

## 6. Photography

- Editorial photos are shown in black and white (`.photo-mono`) so they sit inside the palette; product photos stay in colour.
- Every photo carries a mono credit caption; licences are listed in `docs/CREDITS.md`.

## 7. Motion

Three moments only: the brand marquee (pauses on hover), the slow spin of the hero and closing stars, and a small zoom on product photos on hover. All disabled under `prefers-reduced-motion`.

## 8. Logo usage

- `Logo.astro` `variant="wordmark"`: header and giant hero type. `variant="badge"`: footer, OG image.
- Logos inherit `currentColor`: black on paper, paper on ink. Never recolour to anything else, never add the chrome gradient to the wordmark.
- Files: `public/brand/logo-badge(.svg|-white.svg)`, `wordmark(.svg|-white.svg)`, `mark.svg` (star). Regenerate everything with `npm run brand` after replacing `brand-src/*.png`.
- App icon / favicon: white star on a black rounded tile.

## 9. Accessibility floor

Visible focus outlines, skip link, sticky header offset for anchors, `<details>` for menu and FAQ (keyboard-friendly, no JS), decorative SVGs `aria-hidden`, every product button has an accessible name with the garment, contrast ≥ 4.5:1 for text.
