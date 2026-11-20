import { renderToStaticMarkup } from 'react-dom/server';
import { SiteNav } from '../SiteChrome';

describe('SiteNav', () => {
  it('links to its own sections on the homepage', () => {
    const html = renderToStaticMarkup(<SiteNav />);
    expect(html).toContain('href="#workflow"');
    expect(html).not.toContain('aria-current');
  });

  it('marks the demo link on the demo page and leads back to the homepage', () => {
    const html = renderToStaticMarkup(<SiteNav onDemo />);
    expect(html).toContain('href="/#workflow"');
    expect(html).toMatch(/href="\/demo\/" aria-current="page"/);
  });

  it('leads back to the homepage from any other page without marking a link', () => {
    const html = renderToStaticMarkup(<SiteNav offHome />);
    expect(html).toContain('href="/#workflow"');
    expect(html).not.toContain('aria-current');
  });
});
