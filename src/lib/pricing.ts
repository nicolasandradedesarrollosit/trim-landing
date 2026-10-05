/**
 * USD → ARS pricing. Pure helpers are shared by the build (initial HTML) and the browser
 * script that refreshes prices on every visit (RateNote.astro), so both round the same way.
 */
import { PRICING } from '../config/pricing';

export interface Rate {
  /** ARS per USD, "venta". */
  venta: number;
  /** ISO date of the quote. */
  updatedAt: string;
  /** False when the API failed and PRICING.fallbackRate was used. */
  live: boolean;
}

/** USD price → ARS, rounded up to PRICING.roundTo. */
export const toArs = (usd: number, venta: number) => Math.ceil((usd * venta) / PRICING.roundTo) * PRICING.roundTo;

const ars = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
export const formatArs = (value: number) => ars.format(value);

const time = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'America/Argentina/Buenos_Aires',
});
/** "4/10, 17:52" in Buenos Aires time. */
export const formatRateTime = (iso: string) => time.format(new Date(iso));

/** Reads the quote from PRICING.rateUrl. Throws on network errors or an unexpected payload. */
export async function fetchRate(timeoutMs = 5000): Promise<Rate> {
  const res = await fetch(PRICING.rateUrl, { signal: AbortSignal.timeout(timeoutMs) });
  if (!res.ok) throw new Error(`Rate API answered ${res.status}`);
  const data = (await res.json()) as { venta?: unknown; fechaActualizacion?: unknown };
  if (typeof data.venta !== 'number' || data.venta <= 0) throw new Error('Rate API: missing "venta"');
  return {
    venta: data.venta,
    updatedAt: typeof data.fechaActualizacion === 'string' ? data.fechaActualizacion : new Date().toISOString(),
    live: true,
  };
}

let buildRate: Promise<Rate> | undefined;

/** The rate used for the static HTML: fetched once per build, falling back to PRICING.fallbackRate. */
export function getBuildRate(): Promise<Rate> {
  buildRate ??= fetchRate().catch((error: unknown) => {
    console.warn(`[pricing] ${String(error)}; using fallback rate ${PRICING.fallbackRate}`);
    return { venta: PRICING.fallbackRate, updatedAt: new Date().toISOString(), live: false };
  });
  return buildRate;
}
