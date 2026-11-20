import type { Metadata } from 'next';
import { SiteFooter, SiteNav } from '@/components/next/SiteChrome';
import SiteDocument from '@/components/next/SiteDocument';
import './(next)/next.css';

export const metadata: Metadata = {
  title: 'Page not found: CrystalFlow',
  description: 'This address does not lead to a page on crystalflow.dev.',
  icons: { icon: '/logo/crystalflow-icon-blue-light.svg' },
  robots: { index: false },
};

/** Served for every address the export has no page for (Cloudflare serves 404.html). */
export default function GlobalNotFound() {
  return (
    <SiteDocument>
      <SiteNav offHome />
      <main id="top">
        <section className="section cf-missing" aria-labelledby="missing-h">
          <div className="wrap">
            <div className="section-head">
              <h1 id="missing-h">This page does not exist</h1>
              <p>The address may be mistyped, or the page has moved.</p>
            </div>
            <div className="btn-row">
              <a className="btn btn--primary" href="/">
                Go to the homepage
              </a>
              <a className="btn btn--secondary" href="/docs/">
                Read the docs
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter offHome />
    </SiteDocument>
  );
}
