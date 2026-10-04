import { CONTACT } from '../config/site';
import { brandOf, refCode, type Product } from './content';

/** wa.me link that opens a chat with the prefilled message. */
export const whatsappUrl = (message: string = CONTACT.greeting) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;

export const instagramUrl = `https://www.instagram.com/${CONTACT.instagram}/`;
export const instagramHandle = `@${CONTACT.instagram}`;

/** Message for a garment's "Consultar" button: enough for TRIM to identify it without a link. */
export function productMessage(p: Product): string {
  const { name, sizes, color } = p.data;
  const item = [brandOf(p).name, name, color && `(${color})`].filter(Boolean).join(' ');
  return `Hola TRIM! Quiero consultar por: ${item}. Talles publicados: ${sizes.join(', ')}. Ref: ${refCode(p)}`;
}
