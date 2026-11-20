/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { Toolbar } from '../Toolbar';

describe('Toolbar in a narrow container', () => {
  it('wraps its buttons, so none is pushed out of reach', () => {
    const { container } = render(<Toolbar onToggleFullscreen={() => {}} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.flexWrap).toBe('wrap');

    // the action buttons are laid out by the root, so each one can wrap on its own
    const actions = screen.getByTitle('Save workflow').parentElement as HTMLElement;
    expect(actions.style.display).toBe('contents');
    expect(screen.getByTitle('Enter fullscreen')).toBeTruthy();
  });
});
