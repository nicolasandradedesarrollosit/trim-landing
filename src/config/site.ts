/**
 * Central site configuration. Brand, contact channels, brands, categories and FAQ live
 * here: components and pages read from this file and never hardcode them.
 * User-facing strings are Spanish (es-AR); identifiers are English.
 */

export const SITE = {
  name: 'TRIM',
  tagline: 'Hyper-brands originales en Argentina.',
  description:
    'Corteiz, Supreme, Stüssy, BAPE y más: ropa original de hyper-brands en Argentina. Mirá el catálogo y consultá talle y precio por WhatsApp.',
  // TODO: set the production domain before launch. Every canonical, sitemap and OG URL derives from it.
  url: 'https://www.trim.com.ar',
  locale: 'es-AR',
  ogLocale: 'es_AR',
  timeZone: 'America/Argentina/Buenos_Aires',
  city: 'Buenos Aires',
  country: 'AR',
  defaultOgImage: '/og-default.png',
  logo: '/brand/logo-badge.svg',
  logoPng: '/brand/icon-512.png',
  foundingDate: '2026',
  // TODO: generic mailbox on the site's own domain.
  email: 'hola@trim.com.ar',
  /** Shown in the footer: TRIM resells, it is not affiliated with the brands it carries. */
  disclaimer:
    'TRIM es un revendedor independiente. No está afiliado ni asociado a las marcas que comercializa; los nombres y marcas pertenecen a sus respectivos dueños.',
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
  /** Prefilled message for the generic "Escribinos" buttons. */
  greeting: 'Hola TRIM! Quiero hacer una consulta.',
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

export const CATEGORIES = [
  { slug: 'buzos', name: 'Buzos' },
  { slug: 'remeras', name: 'Remeras' },
  { slug: 'camperas', name: 'Camperas' },
  { slug: 'pantalones', name: 'Pantalones' },
  { slug: 'accesorios', name: 'Accesorios' },
] as const;
export type CategorySlug = (typeof CATEGORIES)[number]['slug'];
export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug) as [CategorySlug, ...CategorySlug[]];
export const getCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug);

export const CONDITION_LABEL = {
  nuevo: 'Nuevo con etiqueta',
  'como-nuevo': 'Usado, como nuevo',
} as const;
export type Condition = keyof typeof CONDITION_LABEL;

export const STATUS_LABEL = {
  disponible: 'Disponible',
  reservado: 'Reservado',
  vendido: 'Vendido',
} as const;
export type Status = keyof typeof STATUS_LABEL;

/** In-page anchors of the home page, used by the header and the hero index. */
export const NAV = [
  { href: '/catalogo/', label: 'Catálogo' },
  { href: '/#como-comprar', label: 'Cómo comprar' },
  { href: '/#originales', label: 'Originales' },
  { href: '/#preguntas', label: 'Preguntas' },
] as const;

export const LEGAL_NAV = [
  { href: '/privacidad/', label: 'Privacidad' },
  { href: '/terminos/', label: 'Términos' },
] as const;

/**
 * Buying steps (home "Cómo comprar"). They are a real sequence, hence numbered.
 * TODO: confirm payment and shipping options with the business before launch.
 */
export const STEPS = [
  {
    title: 'Elegís',
    body: 'Mirá el catálogo. Cada prenda muestra marca, talles y si está disponible.',
  },
  {
    title: 'Consultás',
    body: 'Tocá “Consultar” y se abre WhatsApp con la prenda ya escrita. Te confirmamos talle y precio.',
  },
  {
    title: 'Te llega',
    body: 'Pagás por transferencia o en efectivo y coordinamos el envío a todo el país, o la entrega en CABA.',
  },
] as const;

/** Home FAQ (also emitted as FAQPage JSON-LD). TODO: confirm every answer with the business. */
export const FAQ = [
  {
    question: '¿Las prendas son originales?',
    answer:
      'Sí. Todo se compra en tiendas oficiales o en los drops de cada marca, y te mostramos el comprobante de compra si lo pedís. Si no podemos comprobar que algo es original, no entra al catálogo.',
  },
  {
    question: '¿Cómo compro?',
    answer:
      'Tocá “Consultar” en la prenda que te guste: se abre WhatsApp con el mensaje armado. Te confirmamos talle, stock y precio, y coordinamos pago y envío por ahí mismo.',
  },
  {
    question: '¿Hacen envíos?',
    answer:
      'Sí, a todo el país. En CABA también coordinamos entregas en mano. El costo y el plazo dependen del destino; te los pasamos cuando consultás.',
  },
  {
    question: '¿Cómo puedo pagar?',
    answer: 'Por transferencia bancaria o en efectivo en entregas en mano. Te pasamos los datos por WhatsApp.',
  },
  {
    question: 'No encuentro lo que busco, ¿lo pueden conseguir?',
    answer:
      'Escribinos con la marca, la prenda y tu talle. Si entra en un próximo drop o la podemos conseguir, te avisamos con precio y fecha estimada.',
  },
  {
    question: '¿Qué significa “Usado, como nuevo”?',
    answer:
      'Que la prenda tuvo un dueño anterior pero no tiene marcas, manchas ni desgaste visible. Siempre te mandamos fotos reales antes de que pagues.',
  },
] as const;
