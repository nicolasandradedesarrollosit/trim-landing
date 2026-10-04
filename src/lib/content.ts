import { getCollection, type CollectionEntry } from 'astro:content';
import { BRANDS, getBrand, type Brand } from '../config/site';

export type Product = CollectionEntry<'products'>;

const isPublished = (p: Product) => import.meta.env.DEV || !p.data.draft;

/** Sold garments sink to the bottom; otherwise newest first. */
const STATUS_ORDER = { disponible: 0, reservado: 1, vendido: 2 } as const;
export const byShelfOrder = (a: Product, b: Product) =>
  STATUS_ORDER[a.data.status] - STATUS_ORDER[b.data.status] || b.data.addedAt.valueOf() - a.data.addedAt.valueOf();

/** Every published garment in catalogue order. */
export async function getProducts(): Promise<Product[]> {
  const all = await getCollection('products', isPublished);
  return all.sort(byShelfOrder);
}

export const catalogUrl = '/catalogo/';
export const brandUrl = (slug: string) => `/catalogo/${slug}/`;

export const brandOf = (p: Product): Brand => getBrand(p.data.brand)!;

/** Brands that have at least one garment in the catalogue, in config order, with their garments. */
export function brandsInStock(products: Product[]): { brand: Brand; products: Product[] }[] {
  return BRANDS.map((brand) => ({ brand, products: products.filter((p) => p.data.brand === brand.slug) })).filter(
    (b) => b.products.length > 0,
  );
}

const ars = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
export const formatPrice = (price: number | undefined) => (price ? ars.format(price) : undefined);

/**
 * Short, stable reference for a garment ("TRM-4K2P"), printed on the tag and sent in the
 * WhatsApp message so TRIM can tell which listing a chat is about. Derived from the id.
 */
export function refCode(p: Product): string {
  let h = 2166136261;
  for (const ch of p.id) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  return `TRM-${h.toString(36).toUpperCase().padStart(4, '0').slice(-4)}`;
}
