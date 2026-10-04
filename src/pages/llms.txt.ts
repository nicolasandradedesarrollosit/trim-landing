import type { APIRoute } from 'astro';
import { BRANDS, CONDITION_LABEL, FAQ, SITE, STATUS_LABEL } from '../config/site';
import { instagramUrl, whatsappUrl } from '../lib/contact';
import { brandOf, brandUrl, brandsInStock, catalogUrl, formatPrice, getProducts } from '../lib/content';
import { absUrl } from '../lib/seo';

/**
 * llms.txt (https://llmstxt.org): a plain-Markdown map of the site for AI assistants
 * and AI search engines: what TRIM is, how to buy and what is in stock.
 */
export const GET: APIRoute = async () => {
  const products = await getProducts();
  const stock = products
    .filter((p) => p.data.status !== 'vendido')
    .map((p) => {
      const { name, sizes, condition, status, price } = p.data;
      const bits = [`talles ${sizes.join(', ')}`, CONDITION_LABEL[condition], STATUS_LABEL[status], formatPrice(price) ?? 'precio a consultar'];
      return `- [${brandOf(p).name} ${name}](${absUrl(`${catalogUrl}#${p.id}`)}): ${bits.join('; ')}`;
    });

  const body = `# ${SITE.name}

> ${SITE.description}

${SITE.name} es un revendedor independiente de ropa original de hyper-brands con base en ${SITE.city}, Argentina. No está afiliado a las marcas. Las compras se coordinan por WhatsApp (${whatsappUrl()}) o Instagram (${instagramUrl}); envíos a todo el país.

## Marcas que trabajamos

${BRANDS.map((b) => b.name).join(', ')}.

## Catálogo

- [Catálogo completo](${absUrl(catalogUrl)})
${brandsInStock(products)
  .map(({ brand }) => `- [${brand.name}](${absUrl(brandUrl(brand.slug))})`)
  .join('\n')}

## En stock

${stock.join('\n')}

## Preguntas frecuentes

${FAQ.map((f) => `- **${f.question}** ${f.answer}`).join('\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
