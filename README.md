# TRIM

Landing page and garment catalogue for **TRIM**, an Argentine reseller of original hyper-brand clothing (Corteiz, Supreme, Stüssy, BAPE, Palace…). Static site built with [Astro](https://astro.build) and Tailwind CSS, deployed on Vercel. Sales happen on **WhatsApp** and **Instagram**: every garment has a "Consultar" button that opens WhatsApp with the garment already written in the message.

The customer-facing site is in Spanish (es-AR). Code, comments and documentation are in English. The architecture mirrors the `imperare-sibi` project (config-driven Astro static site, content collections, Tailwind v4 tokens, JSON-LD helpers).

- Business strategy: [`docs/STRATEGY.md`](docs/STRATEGY.md)
- **Adding/updating/selling a garment: [`docs/CATALOG_GUIDE.md`](docs/CATALOG_GUIDE.md)** + template `src/content/products/_template.md`
- Design system, Pinterest references and logo usage: [`docs/DESIGN.md`](docs/DESIGN.md)
- Photo credits and licences: [`docs/CREDITS.md`](docs/CREDITS.md)
- **Every text on the site: [`src/config/copy.json`](src/config/copy.json)** (see "Editing texts")

## Development

```sh
npm install
npm run dev      # http://localhost:4321
npm run check    # type check
npm run build    # static build to dist/ (+ .vercel/output)
npm run preview
npm run brand    # re-trace the logos and regenerate favicon, app icons and og-default.png
```

Requires Node 22.12+. Fonts are fetched from Fontsource at build time (Astro Fonts API).

## Before launch (placeholders)

These values are placeholders and must be replaced:

| What | Where |
| --- | --- |
| Production domain | `SITE.url` in `src/config/site.ts` (every canonical, sitemap and OG URL derives from it) |
| WhatsApp number (digits, international format, no `+`) | `CONTACT.whatsapp` |
| Instagram handle | `CONTACT.instagram` |
| Contact e-mail on the site's domain | `SITE.email` |
| Payment, shipping, FAQ and authenticity texts | `home.howToBuy`, `home.faq`, `home.originals` in `src/config/copy.json` |
| **Catalogue** | the 8 products in `src/content/products/` are **demo entries** with stock photos (`illustrative: true`). Replace them with real stock and real photos. |

## Editing texts

Every customer-facing text lives in **`src/config/copy.json`**: meta titles and descriptions, the hero, section titles, buying steps, FAQ, authenticity checks, product-tag labels, the WhatsApp messages, category names, photo alt texts and credits, the 404 and the legal pages. Components never hardcode copy.

- Edit a value, save: the dev server reloads. Then run `npm run check`; a missing or renamed key fails the check.
- Keep the keys, change only the values. Lists (`steps`, `checks`, FAQ `items`, legal `sections`) can grow or shrink.
- `{placeholders}` are filled in by the code; keep them when rewording: `{total}`, `{available}`, `{city}`, `{brand}`, `{count}`, `{cities}`, `{brands}`, `{item}`, `{sizes}`, `{ref}`, `{n}`, `{whatsapp}`, `{instagram}`, and `{email}` in legal pages (rendered as a link).
- `\n` inside a title forces a line break (`home.cities.title`, `home.howToBuy.title`).
- Voice: short sentences, voseo, no filler (see `docs/DESIGN.md`, "Voice").

Brand names, cities and the contact numbers are data, not copy: they stay in `src/config/site.ts`.

## Adding a garment

Follow [`docs/CATALOG_GUIDE.md`](docs/CATALOG_GUIDE.md). In short:

1. Add a portrait photo (≥900px wide) to `src/content/products/img/`.
2. Copy `src/content/products/_template.md` to `src/content/products/<brand>-<garment>-<color>.md` and fill in the frontmatter; the build fails on missing or invalid fields.
3. `npm run check && npm run build`, commit and push to `main`; Vercel deploys.

Marking a garment `reservado` or `vendido` is a one-line change to `status`.

## Architecture

```
brand-src/                # original logo PNGs (source of truth for the traced SVGs)
scripts/
  trace-logos.mjs         # PNG -> SVG (potrace) into public/brand/ and src/components/ui/paths/
  generate-brand-assets.mjs  # favicon.svg/.ico, apple-touch-icon, manifest icons, og-default.png
src/
  config/pricing.ts       # dollar-rate API URL, fallback rate, rounding step
  config/site.ts          # brand data, contact, brands + cities, category/status keys, routes
  config/copy.json        # every customer-facing text (see "Editing texts")
  content.config.ts       # `products` collection schema (frontmatter validation)
  content/products/       # one .md per garment + img/ (+ _template.md)
  assets/photos/          # editorial photos (Unsplash licence, see docs/CREDITS.md)
  styles/index.css        # Tailwind v4: @theme tokens, @utility label/display, component classes
  layouts/
    BaseLayout.astro      # <head> (fonts, SEO, JSON-LD, icons), header, footer
    PageLayout.astro      # legal pages
  components/
    ui/                   # Logo (traced paths, currentColor), Star (chrome), Barcode, Icon
    layout/               # Header (sticky, CSS-only mobile menu), Footer
    home/                 # Hero, BrandStrip, InStock, Cities, HowToBuy, Originals, Faq, FinalCta
    catalog/              # ProductCard (hang tag), CatalogView (title + brand filter + shelf)
    page/                 # LegalPage (renders pages.privacy / pages.terms from copy.json)
    seo/                  # SEO meta tags, JsonLd
  lib/
    content.ts            # getProducts, brandsInStock, URL builders, refCode
    pricing.ts            # USD -> ARS: fetchRate, getBuildRate (memoized, with fallback), toArs, formatArs
    contact.ts            # whatsappUrl, productMessage, instagramUrl
    copy.ts               # typed `copy` import, fill() for {placeholders}, rich() for legal bodies
    seo.ts                # absUrl, ClothingStore/WebSite/FAQPage/CollectionPage/Breadcrumb JSON-LD, graph()
  pages/                  # routes; folder names are URLs, so they stay in Spanish
    index.astro           # landing
    catalogo/index.astro  # full catalogue
    catalogo/[marca].astro  # one page per brand with stock (noindex under 3 garments)
    privacidad.astro  terminos.astro  404.astro
    robots.txt.ts  llms.txt.ts
public/brand/             # traced logos (+ white variants), star mark, app icons
```

**Styling**: Tailwind CSS v4. Design tokens (colours, fonts, display sizes, widths) live in `@theme` in `src/styles/index.css`, with `label` and `display` declared as `@utility` so other classes can `@apply` them, and the shared component classes (`.wrap`, `.section`, `.opener`, `.block-ink`, `.btn*`, `.chip`, `.tag*`, `.shelf`, `.marquee`, `.faq`, `.prose`). See [`docs/DESIGN.md`](docs/DESIGN.md).

**Catalogue**: products are a content collection validated at build time. Sold garments sink to the end of the shelf, reserved ones show a flag. Each garment gets a short stable reference (`TRM-XXXX`, `refCode()` in `lib/content.ts`) printed on its tag and included in its WhatsApp message, and an anchor (`/catalogo/#<id>`).

**SEO**: each page has its own title, description, canonical and OG image; JSON-LD is a single `@graph` with `ClothingStore` + `WebSite`, plus `FAQPage` on the home page and `CollectionPage`/`ItemList` + `BreadcrumbList` on catalogue pages. Brand pages with fewer than 3 garments are `noindex` and left out of the sitemap. `/llms.txt` gives AI assistants a Markdown map with the current stock. CSS is inlined. The only client-side JavaScript is the small inline price refresher on pages with garments (see "Prices"); the mobile menu and the FAQ are `<details>` elements and the marquee is pure CSS.

## Prices

Garments are priced in **USD** (`priceUsd` in each product file) and shown in **ARS** at the dollar blue "venta" rate:

- Source: [DolarAPI](https://dolarapi.com) `/v1/dolares/blue` — public, free, no key, CORS enabled. There is no public API for the Rosario blue rate (infodolar has none, and the old Rosario endpoints of other projects are offline); the national blue tracks it within a few pesos.
- **Build time**: `getBuildRate()` fetches the rate once and renders the ARS prices into the HTML, so prices work without JavaScript and search engines see them. If the API is down, `PRICING.fallbackRate` is used and the note says "referencia".
- **In the browser**: `RateNote.astro` (shown above every shelf as "Dólar blue venta $ 1.560 · 4/10, 17:52") fetches the live rate on every visit and recalculates every `[data-usd]` price. If that request fails, the build-time prices stay.
- Rounding: up to the next `PRICING.roundTo` ($1.000 by default). Change URL, fallback and rounding in `src/config/pricing.ts`; the label texts are under `pricing` and `product.priceUsd` in `copy.json`.

## Operations

- The canonical host is `SITE.url`; set the apex → `www` redirect in Vercel.
- `SITE.email` must be a generic mailbox on the site domain.
- Keep `docs/CREDITS.md` and the on-page photo captions in sync when photos change.
