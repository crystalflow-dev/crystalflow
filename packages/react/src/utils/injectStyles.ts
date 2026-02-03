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
  if (injectedStyles.has(styleId)) {
    return; // Already injected
  }

  const style = document.createElement('style');
  style.setAttribute('data-reactflo-style', styleId);
  style.textContent = css;
  document.head.appendChild(style);
  injectedStyles.add(styleId);
}

/**
 * Remove injected styles (useful for cleanup)
 */
export function removeStyles(styleId: string): void {
  const style = document.querySelector(`[data-reactflo-style="${styleId}"]`);
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
