## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Images](https://docs.astro.build/en/guides/images/)

## Project conventions

- **Adding, updating or selling a garment? Read `docs/CATALOG_GUIDE.md` and start from `src/content/products/_template.md`.**
- **Touching the look of the site? Read `docs/DESIGN.md` first** (tokens, type, the hang-tag card, logo usage).
- Code, comments and docs in English; customer-facing copy and URLs in Spanish (es-AR, voseo).
- The only conversion paths are WhatsApp and Instagram. There is no cart, checkout or form: do not add one without a decision recorded in `docs/STRATEGY.md`.
- **All customer-facing text lives in `src/config/copy.json`** (read through `src/lib/copy.ts`: `copy`, `fill()`, `rich()`); never hardcode copy in components. Data (brand, contact channels, brands, cities, category/status keys, routes) lives in `src/config/site.ts`.
- Voice: one idea per sentence, short, voseo, no filler, no explaining the UI, no selling adjectives. If a sentence can lose words, cut them.
- Catalogue lives in `src/content/products/` (schema in `src/content.config.ts`); the build fails on invalid frontmatter.
- **Never use third-party logos** (Supreme box logo, Corteiz Alcatraz, etc.) in graphics or UI. Brands appear as plain text names only. Every photo must have a licence that allows commercial use and be credited in `docs/CREDITS.md` and on the page.
- The TRIM logo SVGs are traced from `brand-src/` by `scripts/trace-logos.mjs`; regenerate with `npm run brand`, never hand-edit the paths.
- Tailwind CSS v4: tokens and shared component classes in `src/styles/index.css`; utilities for one-off layout. Monochrome palette; chrome is reserved for the star. Light page with black blocks; no dark mode. No client JS unless strictly needed (menus and FAQ use `<details>`).
- See `README.md` and `docs/`.
