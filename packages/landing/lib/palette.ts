/**
 * The page's colours, as the design kit's palette tokens. The light set is the default;
 * the dark set replaces it when the visitor's system asks for a dark scheme.
 */
export type Palette = Record<Token, string>;

type Token =
  | '--p-bg'
  | '--p-surface'
  | '--p-ink'
  | '--p-muted'
  | '--p-accent'
  | '--p-accent-ink'
  | '--p-action'
  | '--p-action-ink'
  | '--p-inv-bg'
  | '--p-inv-surface'
  | '--p-inv-ink'
  | '--p-inv-muted'
  | '--p-inv-accent'
  | '--p-inv-accent-ink'
  | '--p-inv-action'
  | '--p-inv-action-ink'
  | '--cf-ok'
  | '--cf-warm';

export const light: Palette = {
  '--p-bg': '#ffffff',
  '--p-surface': '#f4f4f4',
  '--p-ink': '#111111',
  '--p-muted': '#686868',
  '--p-accent': '#2a41ff',
  '--p-accent-ink': '#ffffff',
  '--p-action': '#2a41ff',
  '--p-action-ink': '#ffffff',
  '--p-inv-bg': '#111111',
  '--p-inv-surface': '#1e1e1e',
  '--p-inv-ink': '#ffffff',
  '--p-inv-muted': '#9a9a9a',
  '--p-inv-accent': '#ffffff',
  '--p-inv-accent-ink': '#111111',
  '--p-inv-action': '#ffffff',
  '--p-inv-action-ink': '#111111',
  // green means "ran" and the warm tone marks strings and a cancelled run
  '--cf-ok': '#0a7d55',
  '--cf-warm': '#a8400c',
};

export const dark: Palette = {
  '--p-bg': '#0e0e10',
  '--p-surface': '#17171a',
  '--p-ink': '#f1f1f1',
  '--p-muted': '#9c9ca3',
  // the brand blue is too dim for text on a dark ground: text and marks take a lighter step,
  // buttons keep the brand blue under white
  '--p-accent': '#8b98ff',
  '--p-accent-ink': '#0e0e10',
  '--p-action': '#2a41ff',
  '--p-action-ink': '#ffffff',
  '--p-inv-bg': '#f1f1f1',
  '--p-inv-surface': '#e2e2e2',
  '--p-inv-ink': '#111111',
  '--p-inv-muted': '#5c5c5c',
  '--p-inv-accent': '#111111',
  '--p-inv-accent-ink': '#ffffff',
  '--p-inv-action': '#111111',
  '--p-inv-action-ink': '#ffffff',
  '--cf-ok': '#3fca92',
  '--cf-warm': '#f0a26b',
};

const block = (palette: Palette) =>
  Object.entries(palette)
    .map(([name, value]) => `${name}: ${value};`)
    .join(' ');

/**
 * The palette as CSS: light by default, dark under a dark system scheme, and either one
 * when the visitor has chosen it (data-scheme on the root, set by the header's toggle).
 */
export function paletteCss(): string {
  const darkBlock = `color-scheme: dark; ${block(dark)}`;
  return [
    `:root { color-scheme: light; ${block(light)} }`,
    `@media (prefers-color-scheme: dark) { :root:not([data-scheme="light"]) { ${darkBlock} } }`,
    `:root[data-scheme="dark"] { ${darkBlock} }`,
  ].join('\n');
}
