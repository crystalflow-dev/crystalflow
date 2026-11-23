/** The visitor's choice of scheme. Without one the page follows the system setting. */
export type Scheme = 'light' | 'dark';

export const STORAGE_KEY = 'cf-theme';

const isScheme = (value: unknown): value is Scheme => value === 'light' || value === 'dark';

/** The scheme on screen: the stored choice if there is one, else the system's. */
export function resolveScheme(stored: unknown, systemDark: boolean): Scheme {
  return isScheme(stored) ? stored : systemDark ? 'dark' : 'light';
}

/**
 * Applies a scheme to the document: the palette's attribute, the kit's page tone
 * (it reads the palette once on load and would not notice a later change) and the browser's theme colour.
 */
export function applyScheme(doc: Document, scheme: Scheme, ground: string): void {
  doc.documentElement.dataset.scheme = scheme;
  doc.documentElement.dataset.tone = scheme;
  for (const meta of doc.querySelectorAll('meta[name="theme-color"]')) {
    meta.setAttribute('content', ground);
  }
}

/**
 * Runs in the head before the first paint, so a stored choice never flashes the other scheme.
 * Storage can be blocked (a private window, site data turned off): the page then follows the system.
 */
export const schemeScript = `try{var t=localStorage.getItem('${STORAGE_KEY}');if(t==='light'||t==='dark')document.documentElement.dataset.scheme=t}catch(e){}`;
