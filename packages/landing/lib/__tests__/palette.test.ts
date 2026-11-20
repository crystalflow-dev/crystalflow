import { dark, light, paletteCss, type Palette } from '../palette';

const channel = (value: number) => {
  const v = value / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return (
    0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255)
  );
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe.each([
  ['light', light],
  ['dark', dark],
] as [string, Palette][])('the %s palette', (_name, palette) => {
  it('keeps body text and muted text readable on both grounds', () => {
    for (const ground of [palette['--p-bg'], palette['--p-surface']]) {
      expect(contrast(palette['--p-ink'], ground)).toBeGreaterThanOrEqual(7);
      expect(contrast(palette['--p-muted'], ground)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('keeps the accent, the status green and the warm tone readable as text', () => {
    for (const name of ['--p-accent', '--cf-ok', '--cf-warm'] as const) {
      expect(contrast(palette[name], palette['--p-bg'])).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('keeps button labels readable', () => {
    expect(contrast(palette['--p-action-ink'], palette['--p-action'])).toBeGreaterThanOrEqual(4.5);
    expect(contrast(palette['--p-inv-ink'], palette['--p-inv-bg'])).toBeGreaterThanOrEqual(7);
  });
});

describe('the palette CSS', () => {
  it('defines the same tokens in both schemes', () => {
    expect(Object.keys(dark)).toEqual(Object.keys(light));
  });

  it('is light by default and dark under a dark system scheme', () => {
    const css = paletteCss();
    const [lightRule, darkRule] = css.split('\n');
    expect(lightRule).toContain('--p-bg: #ffffff;');
    expect(darkRule).toMatch(/^@media \(prefers-color-scheme: dark\)/);
    expect(darkRule).toContain(`--p-bg: ${dark['--p-bg']};`);
  });
});
