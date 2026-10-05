import { CONTACT } from '../config/site';
import { copy, fill } from './copy';
import { brandOf, refCode, type Product } from './content';

/** wa.me link that opens a chat with the prefilled message. */
export const whatsappUrl = (message: string = copy.site.whatsappGreeting) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;

export const instagramUrl = `https://www.instagram.com/${CONTACT.instagram}/`;
export const instagramHandle = `@${CONTACT.instagram}`;

/** "Corteiz Alcatraz Hoodie (Marrón)": how a garment is named in messages and labels. */
export function productItem(p: Product): string {
  const { name, color } = p.data;
  return [brandOf(p).name, name, color && `(${color})`].filter(Boolean).join(' ');
}

/** Message for a garment's "Consultar" button: enough for TRIM to identify it without a link. */
export const productMessage = (p: Product) =>
  fill(copy.product.message, { item: productItem(p), sizes: p.data.sizes.join(', '), ref: refCode(p) });
