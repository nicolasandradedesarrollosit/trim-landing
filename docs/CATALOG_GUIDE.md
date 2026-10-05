# Catalogue guide: adding, updating and selling garments

Every garment is one Markdown file in `src/content/products/`. The frontmatter is validated at build time against `src/content.config.ts`: a typo in a brand, category or status fails the build instead of publishing a broken card.

## 1. Add a garment

1. **Photo**: portrait (4:5 crop is shown), at least 900px wide, JPG or PNG, saved to `src/content/products/img/<brand>-<garment>-<color>.jpg`. Plain background, the whole garment visible, no watermarks. Astro converts it to WebP at several sizes.
2. **File**: copy `_template.md` to `<brand>-<garment>-<color>.md`, lowercase with hyphens (e.g. `corteiz-alcatraz-hoodie-negro.md`). The file name is the garment's id: it is used for the anchor `/catalogo/#<id>` and to derive its `TRM-XXXX` reference, so **do not rename a file once it is published**.
3. **Frontmatter**: fill in the fields below.
4. `npm run check && npm run build`, then commit and push to `main`.

## 2. Frontmatter reference

| Field | Required | Notes |
| --- | --- | --- |
| `name` | yes | Garment name **without** the brand, 3–60 chars ("Alcatraz Hoodie"). |
| `brand` | yes | A slug from `BRANDS` in `src/config/site.ts` (`corteiz`, `supreme`, `stussy`…). New brand? Add it there first, with its city. |
| `category` | yes | `buzos`, `remeras`, `camperas`, `pantalones`, `accesorios`. |
| `color` | no | Colourway, as the brand names it or in Spanish. |
| `season` | no | "FW25", "SS26"… |
| `sizes` | yes | Sizes in stock as on the label: `[S, M]`, `[42]`, `[Único]`. |
| `condition` | no | `nuevo` (default, new with tags) or `como-nuevo` (used, no visible wear). |
| `status` | no | `disponible` (default), `reservado` (deposit paid) or `vendido`. |
| `price` | no | Integer ARS, no dots (`289000`). Leave it out to show "A consultar". |
| `image` | yes | Relative path to the photo (`./img/…`). |
| `imageAlt` | yes | One sentence describing the photo, for screen readers. |
| `illustrative` | no | `true` while the photo is not the actual garment: the card shows "Foto ilustrativa". |
| `featured` | no | `true` to show it in the home page "En stock" block (up to 4; topped up with the newest available). |
| `addedAt` | yes | Date it entered the catalogue (`2026-10-04`). Newest first. |
| `draft` | no | `true` hides it in production (still visible in `npm run dev`). |

The Markdown body below the frontmatter is optional and not rendered yet.

The labels around the data ("Talles", "Nuevo con etiqueta", "Reservado", category names, the WhatsApp message) are in `src/config/copy.json` under `product` and `categories`.

## 3. Reserve, sell, restock

- **Reserved**: `status: reservado`. The card gets a "Reservado" flag; the button still works for questions.
- **Sold**: `status: vendido`. The card greys out, the button is disabled and it moves to the end of the shelf. Delete the file after a few weeks.
- **Size sold, others left**: remove it from `sizes`.
- **Price change**: edit `price`.

## 4. Brands and brand pages

A brand page (`/catalogo/<brand>/`) exists only while that brand has at least one garment. With fewer than 3 garments it is `noindex` and not in the sitemap, so search engines are not shown thin pages.

## 5. Checklist before pushing

- [ ] Photo is of the actual garment (or `illustrative: true`).
- [ ] Brand logos visible in the photo are fine (it is the product), but never reuse them in TRIM graphics.
- [ ] `sizes`, `condition`, `status` and `price` match reality.
- [ ] `npm run check` and `npm run build` pass.
