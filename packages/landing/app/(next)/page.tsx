import Execution from '@/components/next/Execution';
import HeroDemo from '@/components/next/HeroDemo';
import QuickStart from '@/components/next/QuickStart';
import RoadmapRows from '@/components/next/RoadmapRows';
import { SiteFooter, SiteNav } from '@/components/next/SiteChrome';
import Themes from '@/components/next/Themes';
import ThreeForms from '@/components/next/ThreeForms';
import Uses from '@/components/next/Uses';

export default function NextHome() {
  return (
    <>
      <SiteNav />

      <main id="top">
        <section className="hero hero--split" data-enter="" aria-labelledby="hero-h">
          <div className="wrap">
            <div className="hero-text grid hero__grid">
              <div className="hero__text span-6">
                <p className="hero__kicker">
                  <span className="dot" aria-hidden="true"></span>Version 0.1, MIT licensed
                </p>
                <h1 id="hero-h">TypeScript framework for workflow editors</h1>
                <p className="hero__lead">
                  Write each node as a decorated class. CrystalFlow draws it on a React Flow canvas,
                  runs the graph and saves it as JSON.
                </p>
                <div className="btn-row">
                  <a className="btn btn--primary" href="/docs/">
                    Read the docs
                  </a>
                  <a className="btn btn--secondary" href="/demo/">
                    Try the builder
                  </a>
                </div>
              </div>
              <div className="hero__media span-6 start-7">
                <HeroDemo />
              </div>
            </div>
          </div>
        </section>

        <ThreeForms />
        <Execution />
        <Uses />
        <Themes />
        <QuickStart />
        <RoadmapRows />
      </main>

      <SiteFooter />
    </>
  );
}
