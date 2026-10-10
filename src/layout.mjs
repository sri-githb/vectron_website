import { SITE, CATEGORIES, NAV, wa } from './data.mjs';

export const wordmark = (cls = '') =>
  `<span class="wordmark ${cls}"><span class="wordmark__dot" aria-hidden="true"></span>VECTRON</span>`;

export const arrow = `<svg class="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg>`;

const waIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 004.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24s-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.29z"/></svg>`;
export { waIcon };

export function head({ title, description, root, path, image = 'assets/img/og.jpg' }) {
  const full = title.includes('Vectron') ? title : `${title} | Vectron`;
  const url = SITE.siteUrl ? SITE.siteUrl.replace(/\/$/, '') + '/' + path : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${full}</title>
<meta name="description" content="${description}">
<meta name="theme-color" content="#0d0f12">
<script>document.documentElement.classList.add('js')</script>
${url ? `<link rel="canonical" href="${url}">\n<meta property="og:url" content="${url}">` : ''}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Vectron">
<meta property="og:title" content="${full}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${SITE.siteUrl ? SITE.siteUrl.replace(/\/$/, '') + '/' + image : root + image}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${root}assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@300..800&display=swap">
<link rel="stylesheet" href="${root}assets/styles.css">
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Organization', name: 'Vectron',
    slogan: SITE.tagline, telephone: SITE.phoneRaw, email: SITE.email,
    address: { '@type': 'PostalAddress', streetAddress: 'No. 1/169A, Sri Krishna Garden, Tharapakkam', addressLocality: 'Chennai', postalCode: '600128', addressCountry: 'IN' },
  })}</script>
</head>`;
}

export function header(root, current) {
  const mega = CATEGORIES.map(
    (c) => `<a class="mega__item" href="${root}products/${c.slug}/"><span class="mega__n">${c.n}</span><span class="mega__t">${c.name}</span><span class="mega__d">${c.blurb}</span></a>`
  ).join('');
  const links = NAV.map((n) => {
    const cur = current === n.href ? ' aria-current="page"' : '';
    if (n.mega)
      return `<li class="nav__item has-mega"><a class="nav__link" href="${root}${n.href}"${cur} aria-haspopup="true" aria-expanded="false" data-mega-trigger>${n.label}<span class="nav__dot" aria-hidden="true"></span></a>
<div class="mega" data-mega hidden><div class="mega__inner">${mega}</div><a class="mega__all" href="${root}products/">All products ${arrow}</a></div></li>`;
    return `<li class="nav__item"><a class="nav__link" href="${root}${n.href}"${cur}>${n.label}<span class="nav__dot" aria-hidden="true"></span></a></li>`;
  }).join('');
  const mobileProducts = CATEGORIES.map(
    (c) => `<a href="${root}products/${c.slug}/"><span>${c.n}</span>${c.short === 'Motors' ? 'Motors' : c.short === 'VFDs' ? 'Variable Frequency Drives' : c.short === 'Gearboxes' ? 'Gearboxes & Geared Motors' : 'High-Pressure Pumps'}</a>`
  ).join('');
  const mobileLinks = NAV.filter((n) => !n.mega).map((n) => `<a class="mm__big" href="${root}${n.href}">${n.label}</a>`).join('');
  return `<a class="skip" href="#main">Skip to content</a>
<div class="progress" aria-hidden="true"><span></span></div>
<header class="header" data-header>
  <div class="header__bar wrap">
    <a class="header__logo" href="${root}" aria-label="Vectron home">${wordmark()}</a>
    <nav class="nav" aria-label="Primary"><ul>${links}</ul></nav>
    <div class="header__actions">
      <a class="btn btn--accent btn--sm header__cta" href="${root}contact/" data-magnetic>Enquire</a>
      <button class="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu" data-burger><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="mm" id="mobile-menu" data-mm hidden aria-label="Menu" role="dialog" aria-modal="true">
  <div class="mm__inner">
    <p class="label">Products</p>
    <div class="mm__products">${mobileProducts}</div>
    <div class="mm__links">${mobileLinks}<a class="mm__big" href="${root}contact/">Contact</a></div>
    <div class="mm__cta">
      <a class="btn btn--accent" href="${wa('Hi Vectron, I would like to know more about your products.')}" target="_blank" rel="noopener">${waIcon} WhatsApp</a>
      <a class="btn btn--ghost" href="tel:${SITE.phoneRaw}">Call ${SITE.phone}</a>
    </div>
  </div>
</div>`;
}

export function footer(root) {
  return `<footer class="footer">
  <div class="wrap footer__grid">
    <div class="footer__brand">
      ${wordmark('wordmark--lg')}
      <p>${SITE.tagline}. Electro-mechanical solutions and lifecycle engineering support: motors, drives, gearboxes and high-pressure pumps.</p>
    </div>
    <nav aria-label="Footer"><p class="label">Explore</p>
      <ul>${NAV.map((n) => `<li><a href="${root}${n.href}">${n.label}</a></li>`).join('')}<li><a href="${root}contact/">Contact</a></li></ul></nav>
    <nav aria-label="Products"><p class="label">Products</p>
      <ul>${CATEGORIES.map((c) => `<li><a href="${root}products/${c.slug}/">${c.name}</a></li>`).join('')}</ul></nav>
    <div><p class="label">Contact</p>
      <ul class="footer__contact">
        <li><a href="tel:${SITE.phoneRaw}">${SITE.phone}</a></li>
        <li><a href="${wa('Hi Vectron, I would like to know more about your products.')}" target="_blank" rel="noopener">WhatsApp</a></li>
        <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
        <li><address>${SITE.address.join('<br>')}</address></li>
      </ul></div>
  </div>
  <div class="wrap footer__legal"><span>© 2026 Vectron. All rights reserved.</span><span>Brand names and logos belong to their respective owners.</span></div>
</footer>
<a class="wa-float" href="${wa('Hi Vectron, I would like to know more about your products.')}" target="_blank" rel="noopener" aria-label="Chat with Vectron on WhatsApp" data-wa>${waIcon}<span>WhatsApp</span></a>
<div class="cursor" aria-hidden="true" data-cursor></div>`;
}

export function page({ title, description, path, root, current, body, bodyClass = '' }) {
  return `${head({ title, description, root, path })}
<body class="${bodyClass}" data-root="${root}">
${header(root, current)}
<main id="main">
${body}
</main>
${footer(root)}
<script src="${root}assets/main.js" defer></script>
</body>
</html>
`;
}

export const sectionHead = ({ n, label, title, lead = '', cls = '' }) => `
<div class="shead ${cls}">
  <p class="label"><span class="dot"></span>${n ? n + ' — ' : ''}${label}</p>
  <h2 class="h2 reveal">${title}</h2>
  ${lead ? `<p class="lead reveal">${lead}</p>` : ''}
</div>`;

export const enquiryCta = ({ root, topic, heading = 'Talk to an engineer.', sub = 'Tell us what you need. We will come back with the right product and details.' }) => `
<section class="cta dark">
  <div class="wrap cta__in">
    <p class="label"><span class="dot"></span>Enquire</p>
    <h2 class="display-md reveal">${heading}</h2>
    <p class="lead reveal">${sub}</p>
    <div class="cta__btns">
      <a class="btn btn--accent btn--lg" data-magnetic href="${wa(`Hi Vectron, I would like to know more about ${topic}.`)}" target="_blank" rel="noopener">${waIcon} Enquire on WhatsApp</a>
      <a class="btn btn--ghost btn--lg" data-magnetic href="${root}contact/?product=${encodeURIComponent(topic)}">Request product details</a>
      <a class="btn btn--text" href="tel:${SITE.phoneRaw}">Call ${SITE.phone}</a>
    </div>
  </div>
</section>`;
