/**
 * USD → ARS pricing, used only in the browser (RateNote.astro). There is no fallback:
 * fetchRate() throws when the live rate is unavailable and callers must show an error.
 */
import { PRICING } from '../config/pricing';

export interface Rate {
  /** ARS per USD: the API's "venta" plus PRICING.rosarioAdjustment. */
  venta: number;
  /** ISO date of the quote. */
  updatedAt: string;
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

/**
 * Reads the live quote and adds PRICING.rosarioAdjustment to "venta".
 * Throws on network errors, timeouts or an unexpected payload.
 */
export async function fetchRate(): Promise<Rate> {
  const res = await fetch(PRICING.rateUrl, { cache: 'no-store', signal: AbortSignal.timeout(PRICING.timeoutMs) });
  if (!res.ok) throw new Error(`Rate API answered ${res.status}`);
  const data = (await res.json()) as { venta?: unknown; fechaActualizacion?: unknown };
  if (typeof data.venta !== 'number' || !(data.venta > 0)) throw new Error('Rate API: missing "venta"');
  if (typeof data.fechaActualizacion !== 'string') throw new Error('Rate API: missing "fechaActualizacion"');
  return { venta: data.venta + PRICING.rosarioAdjustment, updatedAt: data.fechaActualizacion };
}
