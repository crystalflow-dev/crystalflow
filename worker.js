// Cloudflare Worker — request routing for crystalflow.dev
//
// Routes:
//   /.well-known/*  → static assets (pass-through)
//   /docs/*         → proxied to Mintlify (fladeed.mintlify.dev)
//   everything else → static landing page assets

const DOCS_HOSTNAME = 'fladeed.mintlify.dev';
const CUSTOM_HOSTNAME = 'crystalflow.dev';

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);

      // Pass .well-known paths through to static assets (domain verification, ACME, etc.)
      if (url.pathname.startsWith('/.well-known/')) {
        return env.ASSETS.fetch(request);
      }

      // Proxy /docs/* to Mintlify
      if (/^\/docs/.test(url.pathname)) {
        const proxyUrl = new URL(request.url);
        proxyUrl.hostname = DOCS_HOSTNAME;

        const proxyRequest = new Request(proxyUrl, request);
        proxyRequest.headers.set('Host', DOCS_HOSTNAME);
        proxyRequest.headers.set('X-Forwarded-Host', CUSTOM_HOSTNAME);
        proxyRequest.headers.set('X-Forwarded-Proto', 'https');

        const cfIp = request.headers.get('CF-Connecting-IP');
        if (cfIp) proxyRequest.headers.set('CF-Connecting-IP', cfIp);

        return fetch(proxyRequest);
      }

      // Serve static landing page assets for everything else
      return env.ASSETS.fetch(request);
    } catch {
      return env.ASSETS.fetch(request);
    }
  },
};
