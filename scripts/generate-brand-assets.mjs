// Generates the favicon, app icons, manifest icons and default Open Graph image from the
// traced logo (src/components/ui/paths/*.json) and the star mark.
// Usage: node scripts/generate-brand-assets.mjs (run trace-logos.mjs first; `npm run brand` runs both)
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const pub = new URL('../public/', import.meta.url);
const out = (file) => fileURLToPath(new URL(file, pub));
const badge = JSON.parse(await readFile(new URL('../src/components/ui/paths/logo-badge.json', import.meta.url), 'utf8'));

const INK = '#0b0b0c';
const PAPER = '#edeeef';
const STAR = 'M50 6C52 34 56 46 94 50 56 54 52 66 50 94 48 66 44 54 6 50 44 46 48 34 50 6Z';

/** Chrome gradient shared by the star in every asset (same stops as Star.astro). */
const chrome = `
  <linearGradient id="chrome" x1="18" y1="10" x2="82" y2="92" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".26" stop-color="#b8bdc3"/>
    <stop offset=".44" stop-color="#555a61"/><stop offset=".52" stop-color="#f4f6f8"/>
    <stop offset=".7" stop-color="#8b9198"/><stop offset=".86" stop-color="#e3e6e9"/>
    <stop offset="1" stop-color="#6d737a"/>
  </linearGradient>`;

/**
 * App icon: black tile with the white star. `inset` is the star's margin as a share of
 * the tile (maskable icons need a larger safe zone).
 */
const iconSvg = (size, { radius = 0.18, inset = 0.16 } = {}) => {
  const s = size * (1 - inset * 2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * radius}" fill="${INK}"/>
  <g transform="translate(${size * inset} ${size * inset}) scale(${s / 100})"><path d="${STAR}" fill="#ffffff"/></g>
</svg>`;
};

await writeFile(out('favicon.svg'), iconSvg(64));
await sharp(Buffer.from(iconSvg(180, { radius: 0 }))).png().toFile(out('apple-touch-icon.png'));
await sharp(Buffer.from(iconSvg(192))).png().toFile(out('brand/icon-192.png'));
await sharp(Buffer.from(iconSvg(512))).png().toFile(out('brand/icon-512.png'));
await sharp(Buffer.from(iconSvg(512, { radius: 0, inset: 0.26 }))).png().toFile(out('brand/icon-maskable-512.png'));

// favicon.ico wrapping a 32px PNG (a valid ICO container).
const png32 = await sharp(Buffer.from(iconSvg(32, { inset: 0.12 }))).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6);
header.writeUInt8(32, 7);
header.writeUInt8(0, 8);
header.writeUInt8(0, 9);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png32.length, 14);
header.writeUInt32LE(22, 18);
await writeFile(out('favicon.ico'), Buffer.concat([header, png32]));

// Default Open Graph image (1200x630): black, white badge logo, chrome star, mono labels.
const logoW = 860;
const logoH = (badge.h / badge.w) * logoW;
const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>${chrome}</defs>
  <rect width="1200" height="630" fill="${INK}"/>
  <g font-family="'IBM Plex Mono', 'Courier New', monospace" font-size="22" letter-spacing="2" fill="#a7abb0">
    <text x="70" y="86">TRIM®</text>
    <text x="1130" y="86" text-anchor="end">ROSARIO, AR</text>
    <text x="70" y="566">HYPER-BRANDS ORIGINALES</text>
    <text x="1130" y="566" text-anchor="end">CORTEIZ · SUPREME · STÜSSY · BAPE</text>
  </g>
  <line x1="70" y1="110" x2="1130" y2="110" stroke="#313236" stroke-width="2"/>
  <line x1="70" y1="530" x2="1130" y2="530" stroke="#313236" stroke-width="2"/>
  <g transform="translate(${(1200 - logoW) / 2} ${315 - logoH / 2}) scale(${logoW / badge.w})">
    <path fill="${PAPER}" fill-rule="evenodd" d="${badge.d}"/>
  </g>
  <g transform="translate(990 118) scale(1.5)"><path d="${STAR}" fill="url(#chrome)"/></g>
</svg>`;
await sharp(Buffer.from(og)).png().toFile(out('og-default.png'));

console.log('Brand assets generated.');
