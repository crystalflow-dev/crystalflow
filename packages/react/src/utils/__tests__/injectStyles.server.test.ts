/**
 * @jest-environment node
 */
import { hasStyles, injectStyles, removeStyles } from '../injectStyles';

describe('injectStyles without a DOM', () => {
  it('runs with no document, as it does during server-side rendering', () => {
    expect(typeof document).toBe('undefined');
  });

  it('does nothing when asked to inject styles', () => {
    expect(() => injectStyles('.a { color: red; }', 'server-test')).not.toThrow();
  });

  it('does not record the styles as injected, so the browser still injects them', () => {
    injectStyles('.a { color: red; }', 'server-test');
    expect(hasStyles('server-test')).toBe(false);
  });

  it('does nothing when asked to remove styles', () => {
    expect(() => removeStyles('server-test')).not.toThrow();
  });
});
