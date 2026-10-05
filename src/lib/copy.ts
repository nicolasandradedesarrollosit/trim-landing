/**
 * Customer-facing text. Every string shown on the site lives in src/config/copy.json so it
 * can be edited without touching components. The JSON import is typed: a missing or
 * renamed key fails `npm run check`.
 */
import copy from '../config/copy.json';
import { SITE } from '../config/site';

export { copy };

/** Replaces `{name}` placeholders: fill('Ver catálogo ({total})', { total: 8 }). */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** HTML for legal-page bodies: escapes the text, then turns `{email}` into a mailto link. */
export function rich(template: string): string {
  return escapeHtml(template).replace(/\{email\}/g, `<a href="mailto:${SITE.email}">${SITE.email}</a>`);
}
