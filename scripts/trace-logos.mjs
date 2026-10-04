// Vectorises the two source logos in brand-src/ into the SVGs under public/brand/.
// Usage: node scripts/trace-logos.mjs (or `npm run brand`, which also regenerates the icons)
//
// brand-src/trim-badge.png     -> public/brand/logo-badge.svg     (wordmark inside the racing oval)
// brand-src/trim-wordmark.png  -> public/brand/wordmark.svg       (wordmark alone)
// Each also gets a white variant (`*-white.svg`) for dark backgrounds.
import sharp from 'sharp';
import potrace from 'potrace';
import { writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const trace = promisify(potrace.trace);
const src = new URL('../brand-src/', import.meta.url);
const out = new URL('../public/brand/', import.meta.url);

/** Width the bitmap is normalised to before tracing: enough detail, few nodes. */
const TRACE_WIDTH = 2400;

async function vectorise(input, name) {
  // Crop the white page margins, flatten to pure black/white and normalise the size.
  const bitmap = await sharp(fileURLToPath(new URL(input, src)))
    .flatten({ background: '#ffffff' })
    .grayscale()
    .trim({ threshold: 40 })
    .resize({ width: TRACE_WIDTH })
    .threshold(128)
    .png()
    .toBuffer();

  const svg = await trace(bitmap, { threshold: 128, turdSize: 8, optTolerance: 0.4, color: '#0a0a0a' });
  const [, w, h] = svg.match(/width="(\d+)" height="(\d+)"/);
  // One decimal is plenty at this size and halves the path data.
  const path = svg.match(/ d="([^"]+)"/)[1].replace(/\d+\.\d+/g,(n) => String(Math.round(+n * 10) / 10));
  const file = (fill) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="TRIM"><path fill="${fill}" fill-rule="evenodd" d="${path}"/></svg>\n`;

  await writeFile(new URL(`${name}.svg`, out), file('#0a0a0a'));
  await writeFile(new URL(`${name}-white.svg`, out), file('#ffffff'));
  // Raw path data for the inline Logo component (currentColor fill).
  await writeFile(new URL(`../src/components/ui/paths/${name}.json`, import.meta.url), JSON.stringify({ w: +w, h: +h, d: path }));
  console.log(`${name}: ${w}x${h}, ${path.length} chars of path data`);
}

await vectorise('trim-badge.png', 'logo-badge');
await vectorise('trim-wordmark.png', 'wordmark');
