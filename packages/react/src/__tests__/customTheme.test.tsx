/**
 * @jest-environment jsdom
 */
import 'reflect-metadata';
import { render } from '@testing-library/react';
import {
  WorkflowBuilder,
  createTheme,
  customThemeVariables,
  darkTheme,
  lightTheme,
} from '../index';

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

describe('customThemeVariables', () => {
  it('yields nothing for the built-in themes, which the stylesheets draw', () => {
    expect(customThemeVariables(lightTheme)).toEqual({});
    expect(customThemeVariables(darkTheme)).toEqual({});
  });

  it('yields only the colors a custom theme changes, on the variables the components read', () => {
    const theme = createTheme('dark', {
      background: { primary: '#0c1a40' },
      canvas: { background: '#0a1636', grid: '#2b4599' },
      node: { border: '#3552b5' },
      reactflow: { edge: '#8fa5ff' },
      button: { primary: '#2a41ff' },
    });

    expect(customThemeVariables(theme)).toEqual({
      '--color-bg-primary': '#0c1a40',
      '--color-bg-elevated': '#0c1a40',
      '--xy-background-color': '#0a1636',
      '--xy-background-pattern-color': '#2b4599',
      '--crystalflow-custom-node-border': '#3552b5',
      '--crystalflow-custom-edge': '#8fa5ff',
      '--color-primary-500': '#2a41ff',
    });
  });
});

describe('WorkflowBuilder with a custom theme', () => {
  const rootOf = (container: HTMLElement) =>
    container.querySelector<HTMLElement>('[data-theme]') as HTMLElement;

  it('puts the custom colors on its root, where they override the stylesheet palette', () => {
    const theme = createTheme('light', { canvas: { background: '#fbf8f1' } });
    const { container } = render(<WorkflowBuilder nodes={[]} theme={theme} />);

    const root = rootOf(container);
    expect(root.dataset.theme).toBe('light');
    expect(root.style.getPropertyValue('--xy-background-color')).toBe('#fbf8f1');
  });

  it('leaves the palette to the stylesheets for a built-in theme', () => {
    const { container } = render(<WorkflowBuilder nodes={[]} theme="dark" />);

    const root = rootOf(container);
    expect(root.style.getPropertyValue('--xy-background-color')).toBe('');
    expect(root.style.getPropertyValue('--color-bg-primary')).toBe('');
  });
});
