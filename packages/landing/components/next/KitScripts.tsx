'use client';

import { useEffect } from 'react';

const scripts = ['/assets/system.js', '/assets/motion/motion.js', '/assets/layout/layout.js'];

/**
 * The design kit's scripts rewrite parts of the page's markup, so they load only
 * after React has hydrated it; loaded earlier, hydration fails on the changed nodes.
 */
export default function KitScripts() {
  useEffect(() => {
    if (document.querySelector('script[data-kit]')) return;
    for (const src of scripts) {
      const el = document.createElement('script');
      el.type = 'module';
      el.src = src;
      el.dataset.kit = '';
      document.body.appendChild(el);
    }
  }, []);
  return null;
}
