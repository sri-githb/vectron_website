// Zero-dependency static build: node build.mjs  ->  dist/
import { mkdirSync, writeFileSync, cpSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { SITE, CATEGORIES } from './src/data.mjs';
import * as P from './src/pages.mjs';

const out = 'dist';
rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'assets'), { recursive: true });

const write = (path, html) => {
  const file = join(out, path, path.endsWith('.html') ? '' : 'index.html');
  mkdirSync(join(file, '..'), { recursive: true });
  writeFileSync(path.endsWith('.html') ? join(out, path) : file, html);
};

const pages = [
  ['', P.home()],
  ['products/', P.products()],
  ...CATEGORIES.map((c) => [`products/${c.slug}/`, P.category(c.slug)]),
  ['brands/', P.brands()],
  ['applications/', P.applications()],
  ['services/', P.services()],
  ['about/', P.about()],
  ['contact/', P.contact()],
];
for (const [p, html] of pages) write(p, html);
writeFileSync(join(out, '404.html'), P.notFound());

cpSync('assets/img', join(out, 'assets/img'), { recursive: true });
cpSync('src/static', join(out, 'assets'), { recursive: true });
cpSync('src/static/favicon.ico', join(out, 'favicon.ico')); // fallback for /favicon.ico requests

if (SITE.siteUrl) {
  const u = SITE.siteUrl.replace(/\/$/, '');
  writeFileSync(join(out, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(([p]) => `  <url><loc>${u}/${p}</loc></url>`).join('\n')}\n</urlset>\n`);
  writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${u}/sitemap.xml\n`);
} else {
  writeFileSync(join(out, 'robots.txt'), 'User-agent: *\nAllow: /\n');
}
console.log(`Built ${pages.length + 1} pages -> ${out}/`);
