/**
 * @jest-environment jsdom
 */
import { hasStyles, injectStyles, removeStyles } from '../injectStyles';

const styleTag = (id: string) => document.querySelector(`[data-crystalflow-style="${id}"]`);

describe('injectStyles in a browser', () => {
  it('adds one style tag with the given CSS', () => {
    injectStyles('.a { color: red; }', 'browser-test');
    expect(styleTag('browser-test')?.textContent).toBe('.a { color: red; }');
    expect(hasStyles('browser-test')).toBe(true);
  });

  it('adds the tag once when called twice with the same id', () => {
    injectStyles('.a { color: red; }', 'browser-test');
    expect(document.querySelectorAll('[data-crystalflow-style="browser-test"]')).toHaveLength(1);
  });

  it('removes the tag again', () => {
    removeStyles('browser-test');
    expect(styleTag('browser-test')).toBeNull();
    expect(hasStyles('browser-test')).toBe(false);
  });
});
