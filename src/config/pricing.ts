// Kept free of imports: it is bundled into the browser script that fills in prices.

/**
 * Pricing: garments are priced in USD and shown in ARS at the dollar blue "venta" rate.
 * The rate is fetched in the browser on every visit (src/components/catalog/RateNote.astro).
 * There is deliberately NO fallback rate and NO build-time ARS price: if the live rate
 * cannot be read, the site shows an error instead of a peso amount that may be wrong.
 * There is no public API for the Rosario blue rate; DolarAPI's national blue tracks it
 * within a few pesos.
 */
export const PRICING = {
  /** Public JSON, no key, CORS enabled. Response: { compra, venta, fechaActualizacion }. */
  rateUrl: 'https://dolarapi.com/v1/dolares/blue',
  /** Give up and show the error after this many milliseconds. */
  timeoutMs: 8000,
  /** ARS prices are rounded up to this step: 1000 = to the next $1.000. */
  roundTo: 1000,
} as const;
