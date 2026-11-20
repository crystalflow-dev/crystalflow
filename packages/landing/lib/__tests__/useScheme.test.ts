/**
 * @jest-environment jsdom
 */
import { schemeOnScreen, subscribeScheme } from '../useScheme';

let systemDark = false;
const listeners = new Set<() => void>();
const nextTick = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeAll(() => {
  window.matchMedia = ((query: string) => ({
    media: query,
    get matches() {
      return systemDark;
    },
    addEventListener: (_: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
  })) as unknown as typeof window.matchMedia;
});

beforeEach(() => {
  systemDark = false;
  delete document.documentElement.dataset.scheme;
});

describe('schemeOnScreen', () => {
  it('is the system setting without a choice', () => {
    expect(schemeOnScreen()).toBe('light');
    systemDark = true;
    expect(schemeOnScreen()).toBe('dark');
  });

  it('is the choice on the document, over the system', () => {
    systemDark = true;
    document.documentElement.dataset.scheme = 'light';
    expect(schemeOnScreen()).toBe('light');
  });
});

describe('subscribeScheme', () => {
  it('reports a change of the choice and a change of the system setting', async () => {
    const onChange = jest.fn();
    const stop = subscribeScheme(onChange);

    document.documentElement.dataset.scheme = 'dark';
    await nextTick();
    expect(onChange).toHaveBeenCalledTimes(1);

    listeners.forEach((listener) => listener());
    expect(onChange).toHaveBeenCalledTimes(2);
    stop();
  });

  it('ignores other attributes of the document and stops when asked', async () => {
    const onChange = jest.fn();
    const stop = subscribeScheme(onChange);

    document.documentElement.dataset.tone = 'dark';
    await nextTick();
    expect(onChange).not.toHaveBeenCalled();

    stop();
    expect(listeners.size).toBe(0);
    document.documentElement.dataset.scheme = 'light';
    await nextTick();
    expect(onChange).not.toHaveBeenCalled();
  });
});
