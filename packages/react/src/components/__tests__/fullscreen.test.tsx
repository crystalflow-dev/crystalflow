/**
 * @jest-environment jsdom
 */
import 'reflect-metadata';
import { fireEvent, render, screen } from '@testing-library/react';
import { WorkflowBuilder } from '../WorkflowBuilder';

// jsdom has no ResizeObserver, which the React Flow canvas needs to mount
beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('WorkflowBuilder in fullscreen', () => {
  it('covers the host page with an opaque background, and drops it on exit', () => {
    const { container } = render(<WorkflowBuilder nodes={[]} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.position).not.toBe('fixed');
    expect(root.style.background).toBe('');

    fireEvent.click(screen.getByTitle('Enter fullscreen'));
    expect(root.style.position).toBe('fixed');
    expect(root.style.background).toBe('var(--color-bg-primary)');

    fireEvent.click(screen.getByTitle('Exit fullscreen'));
    expect(root.style.position).not.toBe('fixed');
    expect(root.style.background).toBe('');
  });
});
