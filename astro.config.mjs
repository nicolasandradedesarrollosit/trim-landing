// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import { existsSync, readFileSync } from 'node:fs';

import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { SITE } from './src/config/site.ts';

/**
 * Reads a page already rendered to dist/. The sitemap integration runs after the
 * build, so indexability can be derived from the final HTML.
 * @param {string} page absolute page URL
 */
function renderedHtml(page) {
  const file = `./dist${new URL(page).pathname}index.html`;
  return existsSync(file) ? readFileSync(file, 'utf8') : '';
}

/** @param {string} page */
const isIndexable = (page) => !/<meta name="robots" content="noindex/.test(renderedHtml(page));

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  trailingSlash: 'always',
  output: 'static',
  adapter: vercel(),

  image: {
    // Optimised at build time with sharp (static output); AVIF/WebP with real srcsets.
    responsiveStyles: false,
  },

  fonts: [
    {
      // Display: condensed grotesque for the giant headlines.
      provider: fontProviders.fontsource(),
      name: 'Big Shoulders Display',
      cssVariable: '--font-shoulders',
      weights: [800, 900],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Arial Narrow', 'sans-serif'],
    },
    {
      // Body copy.
      provider: fontProviders.fontsource(),
      name: 'Archivo',
      cssVariable: '--font-archivo',
      weights: [400, 500, 700],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Arial', 'sans-serif'],
    },
    {
      // Labels, specs, prices: the hang-tag voice.
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-plex-mono',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Courier New', 'monospace'],
    },
  ],

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404') && isIndexable(page),
    }),
  ],

  // Small CSS bundle: inlining it removes render-blocking requests (faster FCP/LCP).
  build: { inlineStylesheets: 'always' },

  vite: {
    plugins: [tailwindcss()],
  },
});
