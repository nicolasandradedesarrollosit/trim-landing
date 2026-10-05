// Kept free of imports: it is bundled into the browser script that refreshes prices.

/**
 * Pricing: garments are priced in USD and shown in ARS at the dollar "venta" rate.
 * The rate is read from a public API at build time (initial HTML) and again in the
 * browser on every visit (src/components/catalog/RateNote.astro).
 * There is no public API for the Rosario blue rate; DolarAPI's national blue tracks it
 * within a few pesos.
 */
export const PRICING = {
  /** Public JSON, no key, CORS enabled. Response: { compra, venta, fechaActualizacion }. */
  rateUrl: 'https://dolarapi.com/v1/dolares/blue',
  /** Used only if the API is down during the build. Update it now and then. */
  fallbackRate: 1560,
  /** ARS prices are rounded up to this step: 1000 = to the next $1.000. */
  roundTo: 1000,
} as const;
