import fs from 'node:fs';
import path from 'node:path';
import { SITE_URL, pages } from '../site';

const appDir = path.join(__dirname, '..', '..', 'app', '(next)');

describe('the sitemap pages', () => {
  it('lists every page the app builds', () => {
    const built = fs
      .readdirSync(appDir, { recursive: true })
      .map(String)
      .filter((file) => path.basename(file) === 'page.tsx')
      .map((file) => {
        const dir = path.dirname(file);
        return dir === '.' ? '/' : `/${dir.split(path.sep).join('/')}/`;
      });
    expect(pages.map((page) => page.path).sort()).toEqual(built.sort());
  });

  it('uses trailing slashes, as the export does', () => {
    for (const page of pages) expect(page.path.endsWith('/')).toBe(true);
    expect(SITE_URL.endsWith('/')).toBe(false);
  });
});
