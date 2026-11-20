/**
 * @jest-environment jsdom
 */
import { paletteCss } from '../palette';
import { STORAGE_KEY, applyScheme, resolveScheme, schemeScript } from '../theme';

describe('resolveScheme', () => {
  it('follows the system when nothing valid is stored', () => {
    expect(resolveScheme(null, true)).toBe('dark');
    expect(resolveScheme(null, false)).toBe('light');
    expect(resolveScheme('blue', true)).toBe('dark');
  });

  it('lets a stored choice win over the system', () => {
    expect(resolveScheme('light', true)).toBe('light');
    expect(resolveScheme('dark', false)).toBe('dark');
  });
});

describe('the head script', () => {
  const run = () => new Function(schemeScript)();

  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.scheme;
  });

  it('sets the stored scheme on the document', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');
    run();
    expect(document.documentElement.dataset.scheme).toBe('dark');
  });

  it('leaves the document to the system setting without a valid choice', () => {
    run();
    expect(document.documentElement.dataset.scheme).toBeUndefined();
    localStorage.setItem(STORAGE_KEY, 'sepia');
    run();
    expect(document.documentElement.dataset.scheme).toBeUndefined();
  });

  it('survives blocked storage', () => {
    const get = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(run).not.toThrow();
    get.mockRestore();
  });
});

describe('applyScheme', () => {
  it('sets the palette attribute, the page tone and the theme colour', () => {
    document.head.innerHTML =
      '<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff">' +
      '<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0e0e10">';
    applyScheme(document, 'dark', '#0e0e10');

    expect(document.documentElement.dataset.scheme).toBe('dark');
    expect(document.documentElement.dataset.tone).toBe('dark');
    const colours = [...document.querySelectorAll('meta[name="theme-color"]')].map((meta) =>
      meta.getAttribute('content')
    );
    expect(colours).toEqual(['#0e0e10', '#0e0e10']);
  });
});

describe('the palette CSS with a choice', () => {
  it('keeps a chosen light scheme light under a dark system, and applies a chosen dark one', () => {
    const css = paletteCss();
    expect(css).toContain(
      '@media (prefers-color-scheme: dark) { :root:not([data-scheme="light"]) {'
    );
    expect(css).toContain(':root[data-scheme="dark"] {');
  });
});
