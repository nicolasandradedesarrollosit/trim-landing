/**
 * Central site configuration: brand data, contact channels, brands, cities, categories
 * and routes. Customer-facing text does NOT live here: it is in ./copy.json (read through
 * src/lib/copy.ts). Identifiers are English.
 */
import copy from './copy.json';

export const SITE = {
  name: 'TRIM',
  // TODO: set the production domain before launch. Every canonical, sitemap and OG URL derives from it.
  url: 'https://www.trim.com.ar',
  locale: 'es-AR',
  ogLocale: 'es_AR',
  // IANA zone for Santa Fe province (there is no Rosario zone); same UTC-3 as the rest of Argentina.
  timeZone: 'America/Argentina/Cordoba',
  city: 'Rosario',
  region: 'Santa Fe',
  country: 'AR',
  defaultOgImage: '/og-default.png',
  logo: '/brand/logo-badge.svg',
  logoPng: '/brand/icon-512.png',
  foundingDate: '2026',
  // TODO: generic mailbox on the site's own domain.
  email: 'hola@trim.com.ar',
} as const;

/**
 * Contact channels: the only conversion paths of the site.
 * `whatsapp` holds digits only, in international format without "+" (54 9 11 ...).
 */
export const CONTACT = {
  // TODO: real Instagram handle (without "@").
  instagram: 'trim.ar',
  // TODO: real WhatsApp Business number.
  whatsapp: '5491100000000',
} as const;

/** Cities the brands come from (the stair-step block on the home page). */
export const CITIES = [
  { code: 'LDN', name: 'Londres' },
  { code: 'NYC', name: 'Nueva York' },
  { code: 'TYO', name: 'Tokio' },
  { code: 'LA', name: 'Los Ángeles' },
] as const;
export type CityCode = (typeof CITIES)[number]['code'];

/** Brands TRIM carries. `city` is where the brand is from. Names only: never their logos. */
export const BRANDS = [
  { slug: 'corteiz', name: 'Corteiz', city: 'LDN' },
  { slug: 'palace', name: 'Palace', city: 'LDN' },
  { slug: 'trapstar', name: 'Trapstar', city: 'LDN' },
  { slug: 'broken-planet', name: 'Broken Planet', city: 'LDN' },
  { slug: 'supreme', name: 'Supreme', city: 'NYC' },
  { slug: 'denim-tears', name: 'Denim Tears', city: 'NYC' },
  { slug: 'kith', name: 'Kith', city: 'NYC' },
  { slug: 'bape', name: 'BAPE', city: 'TYO' },
  { slug: 'human-made', name: 'Human Made', city: 'TYO' },
  { slug: 'stussy', name: 'Stüssy', city: 'LA' },
  { slug: 'sp5der', name: 'Sp5der', city: 'LA' },
] as const satisfies readonly { slug: string; name: string; city: CityCode }[];

export type Brand = (typeof BRANDS)[number];
export type BrandSlug = Brand['slug'];
export const BRAND_SLUGS = BRANDS.map((b) => b.slug) as [BrandSlug, ...BrandSlug[]];
export const getBrand = (slug: string): Brand | undefined => BRANDS.find((b) => b.slug === slug);

/** Category slugs; their display names are in copy.json (`categories`). */
export type CategorySlug = keyof typeof copy.categories;
export const CATEGORY_SLUGS = Object.keys(copy.categories) as [CategorySlug, ...CategorySlug[]];
export const categoryName = (slug: CategorySlug) => copy.categories[slug];

/** Condition and status keys; their labels are in copy.json (`product.conditions` / `product.statuses`). */
export type Condition = keyof typeof copy.product.conditions;
export const CONDITIONS = Object.keys(copy.product.conditions) as [Condition, ...Condition[]];
export type Status = keyof typeof copy.product.statuses;
export const STATUSES = Object.keys(copy.product.statuses) as [Status, ...Status[]];

/** Header links. Labels come from copy.json (`nav`). */
export const NAV = [
  { href: '/catalogo/', label: copy.nav.catalog },
  { href: '/#como-comprar', label: copy.nav.howToBuy },
  { href: '/#originales', label: copy.nav.originals },
  { href: '/#preguntas', label: copy.nav.faq },
] as const;

export const LEGAL_NAV = [
  { href: '/privacidad/', label: copy.nav.privacy },
  { href: '/terminos/', label: copy.nav.terms },
] as const;
