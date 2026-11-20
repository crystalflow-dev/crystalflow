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

  it('renders to HTML without touching the browser', () => {
    const html = renderToString(<WorkflowBuilder nodes={[]} />);
    expect(html).toContain('<div');
  });
});
