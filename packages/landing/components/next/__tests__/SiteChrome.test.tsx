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

describe('the theme toggle in the header', () => {
  it('is a labelled button with both icons in the markup, so the server HTML fits either scheme', () => {
    const html = renderToStaticMarkup(<SiteNav />);
    expect(html).toContain('aria-label="Switch between the light and the dark theme"');
    expect(html).toContain('cf-theme__moon');
    expect(html).toContain('cf-theme__sun');
  });

  it('renders both wordmarks for CSS to choose from', () => {
    const html = renderToStaticMarkup(<SiteNav />);
    expect(html).toContain('crystalflow-logo-blue-light.svg');
    expect(html).toContain('crystalflow-logo-blue-dark.svg');
  });
});
