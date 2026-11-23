import { useSyncExternalStore } from 'react';
import { resolveScheme, type Scheme } from './theme';

const DARK_SYSTEM = '(prefers-color-scheme: dark)';

/** The scheme on screen now: the visitor's choice on the document, else the system's. */
export function schemeOnScreen(): Scheme {
  return resolveScheme(
    document.documentElement.dataset.scheme,
    window.matchMedia(DARK_SYSTEM).matches
  );
}

/** Calls back when the header's toggle changes the choice or the system setting changes. */
export function subscribeScheme(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-scheme'],
  });
  const media = window.matchMedia(DARK_SYSTEM);
  media.addEventListener('change', onChange);
  return () => {
    observer.disconnect();
    media.removeEventListener('change', onChange);
  };
}

/**
 * The page's current scheme, for components that take a theme as a prop (the live builders).
 * The static HTML is rendered light; the client corrects it on hydration.
 */
export function useScheme(): Scheme {
  return useSyncExternalStore(subscribeScheme, schemeOnScreen, () => 'light');
}
