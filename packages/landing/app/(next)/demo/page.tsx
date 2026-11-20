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
            <div className="section-head">
              <h1 id="demo-h">Run a workflow in the WorkflowBuilder</h1>
              <p>
                Four example nodes fetch a mock API response, extract a field, format it and display
                it. Run the workflow, then change a property or rewire the nodes.
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
