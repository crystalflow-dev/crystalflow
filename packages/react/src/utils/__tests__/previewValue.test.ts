import { previewValue, PREVIEW_LENGTH } from '../previewValue';

describe('previewValue', () => {
  it('shows text and numbers as they are', () => {
    expect(previewValue('John Doe')).toBe('John Doe');
    expect(previewValue(165)).toBe('165');
    expect(previewValue(false)).toBe('false');
  });

  it('shows a list as its size', () => {
    expect(previewValue([{ id: 1 }, { id: 2 }, { id: 3 }])).toBe('3 items');
    expect(previewValue(['only'])).toBe('1 item');
    expect(previewValue([])).toBe('0 items');
  });

  it('shows an object as JSON, never as [object Object]', () => {
    expect(previewValue({ status: 200 })).toBe('{"status":200}');
  });

  it('shows empty values by name', () => {
    expect(previewValue(null)).toBe('null');
    expect(previewValue(undefined)).toBe('undefined');
  });

  it('cuts long text at the limit', () => {
    const long = 'x'.repeat(PREVIEW_LENGTH + 5);
    expect(previewValue(long)).toBe(`${'x'.repeat(PREVIEW_LENGTH)}...`);
    expect(previewValue('x'.repeat(PREVIEW_LENGTH))).toHaveLength(PREVIEW_LENGTH);
    expect(previewValue({ name: 'a long enough name to pass the limit' })).toMatch(/\.\.\.$/);
  });

  it('does not throw on an object that points back at itself', () => {
    const loop: Record<string, unknown> = {};
    loop.self = loop;
    expect(previewValue(loop)).toBe('[object Object]');
  });
});
