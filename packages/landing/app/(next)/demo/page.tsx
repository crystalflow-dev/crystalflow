import type { Metadata } from 'next';
import DemoBuilder from '@/components/next/DemoBuilder';
import { SiteFooter, SiteNav } from '@/components/next/SiteChrome';

export const metadata: Metadata = {
  title: 'CrystalFlow demo: build and run a workflow in the browser',
  description:
    'A live WorkflowBuilder with four example nodes. Wire them on the canvas, change their properties and run the workflow.',
};

export default function DemoPage() {
  return (
    <>
      <SiteNav onDemo />
      <main id="top">
        <section className="section cf-demo" aria-labelledby="demo-h">
          <div className="wrap">
            <div className="cf-demo__head">
              <h1 id="demo-h">Run a workflow in the WorkflowBuilder</h1>
              <p>
                Four example nodes are wired up. Run them, change a property or rewire the canvas.
              </p>
            </div>
            <DemoBuilder />
          </div>
        </section>
      </main>
      <SiteFooter onDemo />
    </>
  );
}
