import HeroDemo from '@/components/next/HeroDemo';

const GITHUB = 'https://github.com/crystalflow-dev/crystalflow';

function Logo() {
  return (
    <a className="nav__logo" href="#top">
      <img src="/logo/crystalflow-logo-blue-light.svg" alt="CrystalFlow" width={150} height={32} />
    </a>
  );
}

export default function NextHome() {
  return (
    <>
      <header className="nav nav--centre">
        <div className="wrap nav__bar">
          <a className="skip-link" href="#top">
            Skip to content
          </a>
          <Logo />
          <nav className="nav__links" aria-label="Main">
            <div className="nav__item">
              <a className="nav__link" href="/demo/">
                Demo
              </a>
            </div>
            <div className="nav__item">
              <a className="nav__link" href={GITHUB}>
                GitHub
              </a>
            </div>
          </nav>
          <div className="nav__actions">
            <a className="btn btn--primary" href="/docs/">
              Read the docs
            </a>
          </div>
          <button className="nav__toggle" type="button" aria-expanded="false" aria-label="Menu">
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path
                d="M2 5h14M2 13h14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </header>

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
      </main>

      <footer className="footer closing" id="contact" aria-labelledby="close-h">
        <div className="wrap">
          <div className="closing__cta close--type">
            <div className="section-head">
              <h2 id="close-h">Start with one node class</h2>
              <p>The guide builds a working editor from a single decorated class.</p>
            </div>
            <a className="btn btn--primary btn--xl btn--wide" href="/docs/">
              Read the docs
              <svg className="m-arrow" viewBox="0 0 12 12" aria-hidden="true">
                <path className="m-arrow__stem" d="M1 6h8" />
                <path className="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5" />
              </svg>
            </a>
          </div>
          <div className="closing__links">
            <div className="grid">
              <div className="span-4 stack-4">
                <Logo />
                <p className="footer__lede">
                  An open-source TypeScript framework for building visual workflow editors.
                </p>
              </div>
              <div className="span-2 start-9 footer__col">
                <h3>Framework</h3>
                <ul>
                  <li>
                    <a href="/docs/">Docs</a>
                  </li>
                  <li>
                    <a href="/demo/">Demo</a>
                  </li>
                </ul>
              </div>
              <div className="span-2 footer__col">
                <h3>Project</h3>
                <ul>
                  <li>
                    <a href={GITHUB}>GitHub</a>
                  </li>
                  <li>
                    <a href={`${GITHUB}/issues`}>Issues</a>
                  </li>
                  <li>
                    <a href={`${GITHUB}/blob/main/LICENSE`}>License</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer__legal">
              <span>
                &copy; 2026 CrystalFlow &nbsp;{' '}
                <a href="https://www.fladeed.com">Built by Fladeed</a>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
