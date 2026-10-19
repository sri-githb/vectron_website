// Zero-dependency static build: node build.mjs  ->  dist/
import { mkdirSync, writeFileSync, cpSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { SITE, CATEGORIES, KEYWORD_GROUPS, ALL_KEYWORDS, PAGE_KEYWORDS } from './src/data.mjs';
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
  ['services/', P.services()],
  ['about/', P.about()],
  ['contact/', P.contact()],
];
for (const [p, html] of pages) write(p, html);
writeFileSync(join(out, '404.html'), P.notFound());

// The standalone Applications page was retired: keep the old URL working (static hosts + Vercel).
mkdirSync(join(out, 'applications'), { recursive: true });
writeFileSync(join(out, 'applications', 'index.html'),
  '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Products | Vectron</title>' +
  '<meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=../products/">' +
  '<link rel="canonical" href="../products/"></head><body><a href="../products/">Products</a></body></html>');

cpSync('assets/img', join(out, 'assets/img'), { recursive: true });
cpSync('src/static', join(out, 'assets'), { recursive: true });
cpSync('src/static/favicon.ico', join(out, 'favicon.ico')); // fallback for /favicon.ico requests

// ---- SEO files: sitemap.xml, robots.txt ----
const u = SITE.siteUrl.replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(out, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map(([p]) => `  <url>\n    <loc>${u}/${p}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p === '' ? 'weekly' : 'monthly'}</changefreq>\n    <priority>${p === '' ? '1.0' : p.split('/').filter(Boolean).length === 1 ? '0.8' : '0.7'}</priority>\n  </url>`)
    .join('\n')}\n</urlset>\n`);
writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /applications/\n\nSitemap: ${u}/sitemap.xml\n`);

// ---- SEO-KEYWORDS.md (generated from src/data.mjs, so it is always in sync with the site) ----
const kwSection = Object.entries(KEYWORD_GROUPS).map(([g, list]) => `### ${g} (${list.length})\n\n${list.join(', ')}\n`).join('\n');
const pageNames = { '': 'Home', 'products/': 'Products', 'products/motors/': 'Motors', 'products/vfds/': 'Variable Frequency Drive', 'products/gearboxes/': 'Gearbox & Geared Motor', 'products/pumps/': 'High-pressure Pumps', 'brands/': 'Brands', 'services/': 'Services', 'about/': 'About', 'contact/': 'Contact' };
const pageSection = Object.entries(PAGE_KEYWORDS).map(([p, list]) => `**${pageNames[p]}** — \`${u}/${p}\`  \n${list.join(', ')}\n`).join('\n');
const used = new Set(Object.values(PAGE_KEYWORDS).flat());
writeFileSync('SEO-KEYWORDS.md', `# Vectron — SEO keywords and setup

Live domain: **${u}**

**${ALL_KEYWORDS.length} unique search terms** are in the keyword library (\`KEYWORD_GROUPS\` in \`src/data.mjs\`). ${used.size} of them are written into page meta tags, and the product, brand and service terms also appear in page titles, descriptions, headings, image alt text and structured data. Run \`npm run build\` and this file regenerates.

> Honest note: nobody can guarantee a #1 position. Google decides rankings, and a brand-new domain needs weeks to months to be crawled and trusted. This site gives search engines every correct signal; the "Do these next" list below is what moves it up fastest.

## What was done

- Live domain set to ${u}: canonical URLs, hreflang (en-IN), Open Graph and Twitter tags on every page.
- Unique title (under 64 characters) and description (under 160) per page, written around real searches like "industrial motors Chennai", "Danfoss VFD", "gearbox Chennai", "high-pressure RO pump".
- Structured data (JSON-LD): Organization + LocalBusiness (name, address, phone, email, logo, product catalogue), WebSite, WebPage, BreadcrumbList, product-category ItemLists, Services and Brands lists. This helps Google show a clear brand name, logo and, over time, sitelinks.
- \`sitemap.xml\` (all pages, with dates) and \`robots.txt\` pointing to it. The 404 page and the retired /applications stub are \`noindex\`.
- \`vectron.co.in\` redirects to \`www.vectron.co.in\`, plus cache and security headers (\`vercel.json\`).
- Geo tags for Chennai, Tamil Nadu. Language set to English (India).
- One descriptive keyword line under each product category heading; descriptive alt text on product images and brand logos.
- Search Console and Bing verification slots (\`SITE.googleVerification\`, \`SITE.bingVerification\` in \`src/data.mjs\`).

## Do these next (this is what actually earns the top spots)

1. **Google Search Console** → add \`${u}\` → verify (paste the token into \`SITE.googleVerification\`, rebuild, deploy) → submit \`${u}/sitemap.xml\`.
2. **Bing Webmaster Tools** → import from Search Console → submit the sitemap.
3. **Google Business Profile** for "Vectron, Tharapakkam, Chennai 600128" with the same phone, address and website. This is the biggest factor for "motors near me" and Chennai searches. Add photos and ask customers for reviews.
4. In Vercel → Domains, add both \`vectron.co.in\` and \`www.vectron.co.in\` (www as primary).
5. Get links from relevant places: brand partner pages, industry directories, local business listings. Keep name, address and phone identical everywhere.
6. Publish genuinely useful pages over time (for example "How to choose a VFD for a pump", "IE2 vs IE3 vs IE4 motors"); real content ranks, repeated keywords do not.

## Search terms by page (written into each page's meta keywords)

${pageSection}
## Full keyword library by group

${kwSection}
## Rules followed

- Only products, brands and facts that already exist on the site.
- No "authorised dealer / distributor" wording, no prices, ratings, certifications or guarantees.
- Brand names are used descriptively (the site states Vectron deals with and services these brands).
- Note: Google ignores the meta keywords tag. It is kept for other engines and for reference; the ranking value comes from titles, headings, body text, structured data and links.
`);
console.log(`Built ${pages.length + 1} pages -> ${out}/`);
