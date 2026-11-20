const GITHUB = 'https://github.com/crystalflow-dev/crystalflow';

function Logo({ href }: { href: string }) {
  return (
    <a className="nav__logo" href={href}>
      {/* the wordmark is dark ink on a light ground and white on a dark one */}
      <picture>
        <source
          srcSet="/logo/crystalflow-logo-blue-dark.svg"
          media="(prefers-color-scheme: dark)"
        />
        <img
          src="/logo/crystalflow-logo-blue-light.svg"
          alt="CrystalFlow"
          width={150}
          height={32}
        />
      </picture>
    </a>
  );
}

type Where = {
  /** the demo page: its link is marked as the current page */
  onDemo?: boolean;
  /** any page but the homepage: the section links and the logo lead back to it */
  offHome?: boolean;
};

/** The header of every page. Off the homepage the section links lead back to it. */
export function SiteNav({ onDemo = false, offHome = onDemo }: Where) {
  const home = offHome ? '/' : '';
  return (
    <header className="nav nav--centre">
      <div className="wrap nav__bar">
        <a className="skip-link" href="#top">
          Skip to content
        </a>
        <Logo href={offHome ? '/' : '#top'} />
        <nav className="nav__links" aria-label="Main">
          <div className="nav__item">
            <a className="nav__link" href={`${home}#workflow`}>
              Workflow
            </a>
          </div>
          <div className="nav__item">
            <a className="nav__link" href={`${home}#uses`}>
              Uses
            </a>
          </div>
          <div className="nav__item">
            <a className="nav__link" href={`${home}#start`}>
              Setup
            </a>
          </div>
          <div className="nav__item">
            <a className="nav__link" href={`${home}#roadmap`}>
              Roadmap
            </a>
          </div>
          <div className="nav__item">
            <a className="nav__link" href="/demo/" aria-current={onDemo ? 'page' : undefined}>
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
  );
}

/** The closing call to action and the footer links of every page. */
export function SiteFooter({ onDemo = false, offHome = onDemo }: Where) {
  return (
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
              <Logo href={offHome ? '/' : '#top'} />
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
              &copy; 2026 CrystalFlow &nbsp; <a href="https://www.fladeed.com">Built by Fladeed</a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
