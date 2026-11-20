import type { Metadata } from 'next';
import AdvancedBuilder from '@/components/next/AdvancedBuilder';
import { SiteFooter, SiteNav } from '@/components/next/SiteChrome';

export const metadata: Metadata = {
  title: 'CrystalFlow advanced example: conditional execution in the browser',
  description:
    'A live WorkflowBuilder that routes an order with an If and a Switch node. Only the branch that is taken runs.',
};

export default function AdvancedDemoPage() {
  return (
    <>
      <SiteNav onDemo />
      <main id="top">
        <section className="section cf-demo" aria-labelledby="demo-h">
          <div className="wrap">
            <div className="cf-demo__head">
              <h1 id="demo-h">Route an order with If and Switch</h1>
              <p>Only the branch that is taken runs. Pick another order or move the limit.</p>
              <a className="cf-demo__more" href="/demo/">
                Basic example
              </a>
            </div>
            <AdvancedBuilder />
          </div>
        </section>
      </main>
      <SiteFooter onDemo />
    </>
  );
}
