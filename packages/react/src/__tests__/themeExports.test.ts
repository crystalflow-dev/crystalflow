import { createTheme, darkTheme, lightTheme, type Theme } from '../index';

describe('the theme API of the package', () => {
  it('exports the built-in themes', () => {
    expect(lightTheme.mode).toBe('light');
    expect(darkTheme.mode).toBe('dark');
  });

  it('derives a theme from a few colors and keeps the rest of the base theme', () => {
    const theme: Theme = createTheme('light', {
      canvas: { background: '#fbf8f1' },
      reactflow: { edge: '#2a41ff' },
    });

    expect(theme.mode).toBe('light');
    expect(theme.colors.canvas.background).toBe('#fbf8f1');
    expect(theme.colors.canvas.grid).toBe(lightTheme.colors.canvas.grid);
    expect(theme.colors.reactflow.edge).toBe('#2a41ff');
    expect(theme.colors.reactflow.handle).toBe(lightTheme.colors.reactflow.handle);
    expect(theme.colors.text).toEqual(lightTheme.colors.text);
  });

  it('builds on the dark theme too', () => {
    const theme = createTheme('dark', { node: { border: '#ff00aa' } });
    expect(theme.colors.node.border).toBe('#ff00aa');
    expect(theme.colors.node.background).toBe(darkTheme.colors.node.background);
  });
});
