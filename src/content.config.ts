import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { BRAND_SLUGS, CATEGORY_SLUGS, CONDITION_LABEL, STATUS_LABEL } from './config/site';

/**
 * Catalogue. One Markdown file per garment in src/content/products/ (files starting with
 * "_" are ignored, see _template.md). The optional body is extra detail shown nowhere yet;
 * everything the site renders comes from the frontmatter.
 */
const products = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/products' }),
  schema: ({ image }) =>
    z.object({
      /** Garment name without the brand, e.g. "Alcatraz Hoodie". */
      name: z.string().min(3).max(60),
      brand: z.enum(BRAND_SLUGS),
      category: z.enum(CATEGORY_SLUGS),
      /** Season or collection, e.g. "FW25". Optional. */
      season: z.string().max(20).optional(),
      /** Colourway as the brand names it. */
      color: z.string().max(30).optional(),
      /** Sizes in stock, as written on the label ("S", "M", "42", "Único"). */
      sizes: z.array(z.string().max(8)).min(1),
      condition: z.enum(Object.keys(CONDITION_LABEL) as [keyof typeof CONDITION_LABEL]).default('nuevo'),
      status: z.enum(Object.keys(STATUS_LABEL) as [keyof typeof STATUS_LABEL]).default('disponible'),
      /** Price in ARS. Leave empty to show "Consultar precio". */
      price: z.number().int().positive().optional(),
      /** Portrait photo, at least 900px wide; shown at 4:5. */
      image: image(),
      imageAlt: z.string().min(10),
      /**
       * True while the photo is a stock stand-in and not the actual garment: the card says
       * "Foto ilustrativa". Replace with a real photo as soon as possible.
       */
      illustrative: z.boolean().default(false),
      /** Shown in the home page "En stock" block. */
      featured: z.boolean().default(false),
      /** Date the garment entered the catalogue; newest first. */
      addedAt: z.coerce.date(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { products };
