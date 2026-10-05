import { SITE } from '../config/site';
import { copy } from './copy';
import { instagramUrl, whatsappUrl } from './contact';
import { brandOf, type Product } from './content';

export const absUrl = (path: string) => new URL(path, SITE.url).href;

type JsonLd = Record<string, unknown>;

const ORG_ID = `${SITE.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;

/** TRIM as a clothing store that sells online, without a public street address. */
export function organizationLd(): JsonLd {
  return {
    '@type': 'ClothingStore',
    '@id': ORG_ID,
    name: SITE.name,
    url: SITE.url,
    description: copy.site.description,
    logo: { '@type': 'ImageObject', url: absUrl(SITE.logoPng), width: 512, height: 512 },
    image: absUrl(SITE.defaultOgImage),
    foundingDate: SITE.foundingDate,
    email: SITE.email,
    address: { '@type': 'PostalAddress', addressLocality: SITE.city, addressCountry: SITE.country },
    areaServed: { '@type': 'Country', name: 'Argentina' },
    currenciesAccepted: 'ARS',
    sameAs: [instagramUrl],
    contactPoint: { '@type': 'ContactPoint', contactType: 'sales', url: whatsappUrl(), availableLanguage: 'es' },
  };
}

export function websiteLd(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE.url,
    name: SITE.name,
    description: copy.site.description,
    inLanguage: SITE.locale,
    publisher: { '@id': ORG_ID },
  };
}

export function faqLd(): JsonLd {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE.url}/#faq`,
    mainEntity: copy.home.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export interface Crumb {
  name: string;
  href: string;
}

/** Breadcrumb trail that always starts at the home page. */
export const crumbs = (...items: Crumb[]): Crumb[] => [{ name: copy.pages.breadcrumbHome, href: '/' }, ...items];

export function breadcrumbLd(items: Crumb[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absUrl(it.href),
    })),
  };
}

/**
 * Catalogue pages: CollectionPage + ItemList of the garments. Items are plain names (no
 * Product nodes): there is no per-garment page, and Product rich results need an offer
 * page Google can verify.
 */
export function collectionLd(args: { name: string; description: string; path: string; products: Product[] }): JsonLd {
  const url = absUrl(args.path);
  return {
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    url,
    name: args.name,
    description: args.description,
    inLanguage: SITE.locale,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: args.products.length,
      itemListElement: args.products.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `${brandOf(p).name} ${p.data.name}`,
        url: `${url}#${p.id}`,
      })),
    },
  };
}

/** Wraps nodes in a single @graph that always includes the store and the website. */
export function graph(...nodes: JsonLd[]): JsonLd {
  return { '@context': 'https://schema.org', '@graph': [organizationLd(), websiteLd(), ...nodes] };
}
