import type { APIRoute } from 'astro';
import { BRANDS, SITE } from '../config/site';
import { instagramUrl, whatsappUrl } from '../lib/contact';
import { brandOf, brandUrl, brandsInStock, catalogUrl, getProducts } from '../lib/content';
import { formatArs, getBuildRate, toArs } from '../lib/pricing';
import { copy, fill } from '../lib/copy';
import { absUrl } from '../lib/seo';

/**
 * llms.txt (https://llmstxt.org): a plain-Markdown map of the site for AI assistants
 * and AI search engines: what TRIM is, how to buy and what is in stock.
 */
export const GET: APIRoute = async () => {
  const t = copy.llms;
  const p = copy.product;
  const products = await getProducts();
  const rate = await getBuildRate();
  const stock = products
    .filter((item) => item.data.status !== 'vendido')
    .map((item) => {
      const { name, sizes, condition, status, priceUsd } = item.data;
      const bits = [
        `${p.sizes}: ${sizes.join(', ')}`,
        p.conditions[condition],
        p.statuses[status],
        priceUsd ? `${formatArs(toArs(priceUsd, rate.venta))} (${fill(p.priceUsd, { usd: priceUsd })})` : p.priceOnRequest,
      ];
      return `- [${brandOf(item).name} ${name}](${absUrl(`${catalogUrl}#${item.id}`)}): ${bits.join('; ')}`;
    });

  const body = `# ${SITE.name}

> ${copy.site.description}

${fill(t.intro, { city: SITE.city, whatsapp: whatsappUrl(), instagram: instagramUrl })}

## ${t.brands}

${BRANDS.map((b) => b.name).join(', ')}.

## ${t.catalog}

- [${t.catalogAll}](${absUrl(catalogUrl)})
${brandsInStock(products)
  .map(({ brand }) => `- [${brand.name}](${absUrl(brandUrl(brand.slug))})`)
  .join('\n')}

## ${t.stock}

${fill(copy.pricing.rate, { rate: formatArs(rate.venta) })}.

${stock.join('\n')}

## ${t.faq}

${copy.home.faq.items.map((f) => `- **${f.question}** ${f.answer}`).join('\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
