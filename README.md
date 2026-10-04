# TRIM

Landing page and garment catalogue for **TRIM**, an Argentine reseller of original hyper-brand clothing (Corteiz, Supreme, Stüssy, BAPE, Palace…). Static site built with [Astro](https://astro.build) and Tailwind CSS, deployed on Vercel. Sales happen on **WhatsApp** and **Instagram**: every garment has a "Consultar" button that opens WhatsApp with the garment already written in the message.

The customer-facing site is in Spanish (es-AR). Code, comments and documentation are in English. The architecture mirrors the `imperare-sibi` project (config-driven Astro static site, content collections, Tailwind v4 tokens, JSON-LD helpers).

- Business strategy: [`docs/STRATEGY.md`](docs/STRATEGY.md)
- **Adding/updating/selling a garment: [`docs/CATALOG_GUIDE.md`](docs/CATALOG_GUIDE.md)** + template `src/content/products/_template.md`
- Design system, Pinterest references and logo usage: [`docs/DESIGN.md`](docs/DESIGN.md)
- Photo credits and licences: [`docs/CREDITS.md`](docs/CREDITS.md)

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
| Payment, shipping and FAQ answers | `STEPS` and `FAQ` in `src/config/site.ts`, `src/components/home/Originals.astro` |
| **Catalogue** | the 8 products in `src/content/products/` are **demo entries** with stock photos (`illustrative: true`). Replace them with real stock and real photos. |

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
  config/site.ts          # brand, contact, brands + cities, categories, steps, FAQ: single source of truth
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
    seo/                  # SEO meta tags, JsonLd
  lib/
    content.ts            # getProducts, brandsInStock, URL builders, formatPrice, refCode
    contact.ts            # whatsappUrl, productMessage, instagramUrl
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

**SEO**: each page has its own title, description, canonical and OG image; JSON-LD is a single `@graph` with `ClothingStore` + `WebSite`, plus `FAQPage` on the home page and `CollectionPage`/`ItemList` + `BreadcrumbList` on catalogue pages. Brand pages with fewer than 3 garments are `noindex` and left out of the sitemap. `/llms.txt` gives AI assistants a Markdown map with the current stock. CSS is inlined and no client-side JavaScript ships at all: the mobile menu and the FAQ are `<details>` elements and the marquee is pure CSS.

## Operations

- The canonical host is `SITE.url`; set the apex → `www` redirect in Vercel.
- `SITE.email` must be a generic mailbox on the site domain.
- Keep `docs/CREDITS.md` and the on-page photo captions in sync when photos change.
