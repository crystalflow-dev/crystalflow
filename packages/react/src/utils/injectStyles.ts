/**
 * CSS-in-JS utility for injecting styles at runtime
 * Lightweight approach without external dependencies
 */

const injectedStyles = new Set<string>();

/**
 * Inject CSS into the document head
 * Only injects once per unique styleId
 */
export function injectStyles(css: string, styleId: string): void {
  if (typeof document === 'undefined') {
    return; // No DOM: server-side rendering or plain Node
  }

  if (injectedStyles.has(styleId)) {
    return; // Already injected
  }

  const style = document.createElement('style');
  style.setAttribute('data-crystalflow-style', styleId);
  style.textContent = css;
  document.head.appendChild(style);
  injectedStyles.add(styleId);
}

/**
 * Remove injected styles (useful for cleanup)
 */
export function removeStyles(styleId: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  const style = document.querySelector(`[data-crystalflow-style="${styleId}"]`);
  if (style) {
    style.remove();
    injectedStyles.delete(styleId);
  }
}

/**
 * Check if styles are already injected
 */
export function hasStyles(styleId: string): boolean {
  return injectedStyles.has(styleId);
}
