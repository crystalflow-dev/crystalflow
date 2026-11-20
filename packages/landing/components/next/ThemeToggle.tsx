'use client';

import { useEffect } from 'react';
import { dark, light } from '../../lib/palette';
import { STORAGE_KEY, applyScheme, resolveScheme, type Scheme } from '../../lib/theme';

const ground = (scheme: Scheme) => (scheme === 'dark' ? dark : light)['--p-bg'];

/**
 * Switches the page between its light and dark palette and remembers the choice.
 * Both icons are in the markup and CSS shows the one for the other scheme, so the
 * server's HTML is right for every visitor and nothing changes on hydration.
 */
export default function ThemeToggle() {
  // a stored choice is on the document before the first paint; the browser's theme colour follows here
  useEffect(() => {
    const chosen = document.documentElement.dataset.scheme;
    if (chosen === 'light' || chosen === 'dark') applyScheme(document, chosen, ground(chosen));
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const next: Scheme =
      resolveScheme(root.dataset.scheme, systemDark) === 'dark' ? 'light' : 'dark';
    applyScheme(document, next, ground(next));
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage is blocked: the choice holds for this page view
    }
  };

  return (
    <button
      type="button"
      className="cf-theme"
      onClick={toggle}
      aria-label="Switch between the light and the dark theme"
    >
      <svg className="cf-theme__moon" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
        <path
          d="M16.5 11.9A7 7 0 0 1 8.1 3.5a7 7 0 1 0 8.4 8.4Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
      <svg className="cf-theme__sun" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
        <circle cx="10" cy="10" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M10 2.2v2M10 15.8v2M2.2 10h2M15.8 10h2M4.5 4.5l1.4 1.4M14.1 14.1l1.4 1.4M4.5 15.5l1.4-1.4M14.1 5.9l1.4-1.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
