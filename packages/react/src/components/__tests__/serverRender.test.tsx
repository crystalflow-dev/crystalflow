/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { renderToString } from 'react-dom/server';
import { WorkflowBuilder } from '../WorkflowBuilder';

describe('WorkflowBuilder on the server', () => {
  it('runs with no document and no localStorage, as it does during server-side rendering', () => {
    expect(typeof document).toBe('undefined');
    expect(typeof localStorage).toBe('undefined');
  });

  // one render for both checks: React reports an unknown prop only the first time it sees it
  let html = '';
  let errors: string[] = [];
  beforeAll(() => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    html = renderToString(<WorkflowBuilder nodes={[]} />);
    errors = error.mock.calls.map((call) => String(call[0]));
    error.mockRestore();
  });

  it('renders to HTML without touching the browser', () => {
    expect(html).toContain('<div');
  });

  it('passes no unknown prop down to a DOM element', () => {
    expect(errors.filter((message) => message.includes('React does not recognize'))).toEqual([]);
  });
});
