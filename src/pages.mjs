import {
  SITE, ASSETS, CATEGORIES, BRANDS, BRAND_LOGO_DIR, DIAGRAMS, PILLARS, PILLARS_TITLE, PILLARS_SUB,
  PILLARS_INTRO, SERVICE_LINES, MOTOR_FAMILIES, MOTOR_BRAND_RANGES, VFD_FAMILIES, GEAR_FAMILIES,
  PUMP, VALUES, MISSION, VISION, WHO_WE_ARE, WHAT_WE_DO, FLOW, wa, mail, PAGE_SEO, CATEGORY_SEO,
} from './data.mjs';
import { page, sectionHead, arrow, waIcon } from './layout.mjs';

const img = (root, file, alt, cls = '', extra = '') =>
  `<img class="${cls}" src="${root}assets/img/${file}" alt="${alt}" loading="lazy" decoding="async" ${extra}>`;
const fig = (root, path, alt, cls = '') =>
  `<img class="${cls}" src="${root}${path}" alt="${alt}" loading="lazy" decoding="async" width="1200">`;
const catByslug = (s) => CATEGORIES.find((c) => c.slug === s);
const catHref = (root, s) => `${root}products/${s}/`;

/* Logo wall: logos only — no captions, no repeated brand names. The brand name is the alt text. */
const brandTiles = (root, list, { filterable = false } = {}) =>
  `<ul class="bgrid"${filterable ? ' data-brows' : ''}>${list.map((b) =>
    `<li class="btile" data-cats="${b.cats.join(' ')}"><img src="${root}${BRAND_LOGO_DIR}${b.logo}" alt="${b.name} logo" loading="lazy" decoding="async"></li>`).join('')}</ul>`;

/* 3P icons — minimal line illustrations */
const ICONS = {
  portfolio: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="6" width="15" height="15" rx="2.5"/><rect x="27" y="6" width="15" height="15" rx="2.5"/><rect x="6" y="27" width="15" height="15" rx="2.5"/><rect x="27" y="27" width="15" height="15" rx="2.5"/></svg>',
  precision: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="24" cy="24" r="15.5" stroke-width="5" stroke-dasharray="4.9 6.1" stroke-linecap="butt"/><circle cx="24" cy="24" r="11"/><circle cx="24" cy="24" r="4"/></svg>',
  network: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="24" cy="10" r="5"/><circle cx="9" cy="37" r="5"/><circle cx="39" cy="37" r="5"/><path d="M21.6 14.4 11.4 32.6M26.4 14.4l10.2 18.2M14 37h20"/></svg>',
};

/* ------------------------------------------------------------------ HOME */
export function home() {
  const root = '';

  /* hero category strip — the immediate "what we do" answer */
  const heroStrip = CATEGORIES.map(
    (c) => `<a href="${catHref(root, c.slug)}">${c.name} ${arrow}</a>`
  ).join('');

  /* product worlds — editorial, asymmetric, image-led */
  const worlds = CATEGORIES.map(
    (c) => `<article class="world reveal">
      <a class="world__img" href="${catHref(root, c.slug)}" aria-label="${c.name}">
        ${img(root, c.img, c.imgAlt, '', '')}
      </a>
      <div class="world__body">
        <div class="world__head">
          <a class="world__go" href="${catHref(root, c.slug)}">Explore ${arrow}</a>
        </div>
        <a class="world__t" href="${catHref(root, c.slug)}"><h3>${c.name}</h3></a>
        <ul class="tags">${c.types.map((t) => `<li>${t}</li>`).join('')}</ul>
      </div>
    </article>`
  ).join('');

  const flow = FLOW.map(
    (f) => `<li class="flow__step" data-flow-step>
      <span class="flow__dot" aria-hidden="true"></span>
      <h3>${f.k}</h3>
      <p class="flow__t">${f.t}</p>
      <a class="flow__go" href="${root}products/${f.to}/">See ${f.t} ${arrow}</a>
    </li>`
  ).join('');

  const pillars = PILLARS.map(
    (p) => `<li class="pcard reveal"><span class="pcard__ic">${ICONS[p.icon]}</span><h3>${p.t}</h3><p>${p.d}</p></li>`
  ).join('');

  const body = `
<section class="hero-pin" data-hero-pin>
  <div class="hero light" data-hero>
    <div class="wrap hero__grid">
      <div class="hero__copy">
        <p class="label hero__meta"><span class="dot dot--live"></span>Chennai, India · ${SITE.tagline}</p>
        <h1 class="display"><span class="line"><span>ENGINEERING</span></span><span class="line"><span class="accent">MOTION.</span></span><span class="line"><span>POWERING</span></span><span class="line"><span>INDUSTRY.</span></span></h1>
        <p class="hero__lead">Industrial motors, variable frequency drives, gearboxes and high-pressure pump solutions, supported by lifecycle engineering services.</p>
        <div class="hero__btns">
          <a class="btn btn--accent btn--lg" data-magnetic href="${root}products/">Explore Products ${arrow}</a>
          <a class="btn btn--ghost btn--lg" data-magnetic href="${root}contact/">Enquire Now</a>
        </div>
        <div class="hero__assemble" aria-hidden="true">
          <span class="label" data-assembly-label>Exploded view</span>
          <div class="hero__bar"><i data-assembly-bar></i></div>
        </div>
      </div>
      <div class="hero__viz" data-assembly role="img" aria-label="Interactive 3D exploded view of an industrial geared motor assembling as you scroll" data-fallback="${root}assets/img/motors-bonfiglioli-cutout.png">
        <canvas class="hero__canvas" data-assembly-canvas></canvas>
        <noscript><div class="hero__fallback">${img(root, 'motors-bonfiglioli-cutout.png', 'Geared motor and industrial motors', 'hero__fallback-img')}</div></noscript>
      </div>
    </div>
    <div class="wrap hero__strip" role="group" aria-label="Product categories">${heroStrip}</div>
  </div>
</section>

<section class="pillars" id="pillars" aria-labelledby="pillars-title">
  <div class="wrap pillars__in">
    <header class="pillars__head">
      <p class="label"><span class="dot"></span>${PILLARS_SUB}</p>
      <h2 class="display-md pillars__title reveal" id="pillars-title">${PILLARS_TITLE}</h2>
      <p class="pillars__intro reveal">${PILLARS_INTRO}</p>
    </header>
    <ul class="pillars__grid">${pillars}</ul>
  </div>
</section>

<section class="worlds light" id="products">
  <div class="wrap">
    ${sectionHead({ label: 'Products', title: 'Four worlds.<br>One partner.', lead: 'One supplier for the whole drive train: power, torque, control and pressure.' })}
    <div class="worlds__list">${worlds}</div>
  </div>
</section>

<section class="story dark" id="engineering">
  <div class="wrap story__grid">
    <figure class="diagram reveal">
      ${fig(root, DIAGRAMS.drive, 'Schematic of a drive line: VFD, motor, gearbox and load')}
    </figure>
    <div>
      ${sectionHead({ label: 'Engineering story', title: 'From power to motion.', lead: 'Every Vectron solution sits somewhere on one line: power becomes torque, and torque becomes controlled motion.' })}
      <ol class="flow" data-flow><span class="flow__line" aria-hidden="true"><i data-flow-fill></i></span>${flow}</ol>
    </div>
  </div>
</section>

<section class="brands light" id="brands">
  <div class="wrap">
    ${sectionHead({ label: 'Brands', title: 'Brands we deal with.' })}
    ${brandTiles(root, BRANDS)}
    <a class="link-arrow" href="${root}brands/">View brands by category ${arrow}</a>
  </div>
</section>`;

  return page({
    title: PAGE_SEO[''].title,
    description: PAGE_SEO[''].description,
    path: '', root, current: '', body, bodyClass: 'home',
    scripts: ['assets/motor-model.js', 'assets/assembly.js'],
    footExtra: 'Hero 3D model: Rossi MR 2IV geared motor, source Rossi S.p.A. via 3DfindIT / CADENAS, CC BY-ND 4.0. Illustrative only.',
  });
}

/* --------------------------------------------------------- PRODUCTS INDEX */
export function products() {
  const root = '../';
  const rows = CATEGORIES.map(
    (c) => `<a class="prow reveal" href="${catHref(root, c.slug)}">
      <span class="prow__main"><h2>${c.name}</h2><p>${c.blurb}</p></span>
      <span class="prow__img">${img(root, c.img, c.imgAlt)}</span>
      <span class="prow__go">${arrow}</span></a>`
  ).join('');

  const stage = CATEGORIES.map(
    (c, i) => `<figure class="stage__slide${i === 0 ? ' is-active' : ''}" data-slide="${i}">
      ${img(root, c.img, c.imgAlt, 'stage__img', i === 0 ? 'fetchpriority="high"' : '')}
      <figcaption>${c.name}</figcaption></figure>`
  ).join('');
  const dots = CATEGORIES.map(
    (c, i) => `<button type="button" class="stage__dot${i === 0 ? ' is-active' : ''}" data-dot="${i}" aria-label="Show ${c.name}"><span></span></button>`
  ).join('');

  const body = `
<section class="phero light"><div class="wrap">
  <p class="label"><span class="dot"></span>Products</p>
  <h1 class="display-md">Four categories.<br>One engineered system.</h1>
  <p class="lead">Browse the catalogue below, or open a category for its product families and brands.</p>
</div></section>
<section class="rail dark" aria-label="Product catalogue">
  <div class="wrap">
    <div class="rail__head">
      <p class="label"><span class="dot"></span>The catalogue</p>
      <a class="link-arrow" href="#plist">Skip to the index ${arrow}</a>
    </div>
    <div class="stage" data-stage>
      <div class="stage__frame">
        <div class="stage__bar"><span class="label">Browse</span></div>
        <div class="stage__plinth">${stage}</div>
        <div class="stage__foot"><div class="stage__dots">${dots}</div><a class="link-arrow" data-stage-link href="${catHref(root, 'motors')}">View category ${arrow}</a></div>
      </div>
    </div>
  </div>
</section>
<section class="plist light" id="plist"><div class="wrap">${rows}</div></section>`;
  return page({
    title: PAGE_SEO['products/'].title,
    description: PAGE_SEO['products/'].description,
    path: 'products/', root, current: 'products/', body,
  });
}

/* ------------------------------------------------------ CATEGORY PAGES */
const rowsDetails = (items) =>
  items.map((f, i) => `<details class="frow reveal"${i === 0 ? ' open' : ''}>
    <summary><span class="frow__t">${f.name}</span><span class="frow__m">${f.meta}</span><span class="frow__pm" aria-hidden="true"></span></summary>
    <div class="frow__b"><p>${f.text}</p>${f.brands ? `<p class="frow__br"><span class="label">Brands</span> ${f.brands}</p>` : ''}</div></details>`).join('');

const listBlock = (title, items, cls = '') =>
  `<div class="lblock reveal ${cls}"><h3>${title}</h3><ul>${items.map((i) => `<li><span class="dot"></span>${i}</li>`).join('')}</ul></div>`;

/* diagram band: image + one explanatory paragraph (no repeated bullet lists) */
const studyBand = ({ root, img: diag, alt, title, lead, label = 'Technical study' }) => `
<section class="study dark" id="study"><div class="wrap study__grid">
  <figure class="diagram reveal">${fig(root, diag, alt)}</figure>
  <div>
    <p class="label"><span class="dot"></span>${label}</p>
    <h2 class="h2 reveal">${title}</h2>
    <p class="lead reveal">${lead}</p>
  </div>
</div></section>`;

const catContent = {
  motors(root) {
    return {
      nav: [['families', 'Families'], ['study', 'Technical study'], ['range', 'Ranges by brand']],
      sections: `
<section class="sec light" id="families"><div class="wrap">
  ${sectionHead({ label: 'Product families', title: 'Motors by duty and efficiency.', lead: 'Efficiency classes IE2, IE3 and IE4, and application-specific motors for demanding duties.' })}
  <div class="frows">${rowsDetails(MOTOR_FAMILIES)}</div></div></section>
${studyBand({ root, img: DIAGRAMS.motorCut, alt: 'Cross-section study of an induction motor: stator, rotor, shaft, fan and terminal box', title: 'Inside every motor.', lead: 'The architecture is always the same: a stator, a rotor and a shaft in a rugged frame. What changes with the duty is the efficiency class, the enclosure, the cooling and the extras like brakes.' })}
<section class="sec light" id="range"><div class="wrap">
  ${sectionHead({ label: 'Range by brand', title: 'What each brand offers.' })}
  <div class="lgrid">${MOTOR_BRAND_RANGES.map((b) => listBlock(b.brand + (b.note ? `<small>${b.note}</small>` : ''), b.items)).join('')}</div></div></section>`,
      gallery: [['motor-abb-std-cutout.png', 'IE2 / IE3'], ['motor-hindustan-cutout.png', 'Hindustan Electric Motors'], ['motors-bonfiglioli-cutout.png', 'Bonfiglioli'], ['motor-abb-brake-cutout.png', 'Brake duty']],
      brandsTheme: 'light', relatedTheme: 'dark',
    };
  },
  vfds(root) {
    const rows = VFD_FAMILIES.map((f) => `<article class="vrow reveal">
      <div class="vrow__main"><h3>${f.family}</h3><p>${f.purpose}</p></div>
      <div class="vrow__col"><span class="label">Product range</span><ul>${f.range.map((r) => `<li>${r}</li>`).join('')}</ul></div>
      <a class="vrow__go" href="${wa(`Hi Vectron, I would like to know more about Danfoss ${f.family} drives.`)}" target="_blank" rel="noopener" aria-label="Enquire about ${f.family}">Enquire ${arrow}</a></article>`).join('');
    return {
      nav: [['families', 'Drive families'], ['study', 'Technical study']],
      sections: `
<section class="sec light" id="families"><div class="wrap">
  ${sectionHead({ label: 'Drive families', title: 'The Danfoss drive ecosystem, organised.', lead: 'A compact and competitive solution for applications with basic needs, and application-optimised drives for the rest.' })}
  <div class="vrows">${rows}</div></div></section>
${studyBand({ root, img: DIAGRAMS.drive, alt: 'Schematic of a drive line with a variable frequency drive', title: 'Where the drive sits.', lead: 'The drive sits between the power supply and the motor, shaping voltage and frequency so the machine runs exactly as the process needs.' })}`,
      gallery: [['vfd-danfoss.jpg', 'VLT range'], ['vfd-ic7-ic2.jpg', 'iC7 · iC2']],
      brandsTheme: 'light', relatedTheme: 'dark',
    };
  },
  gearboxes(root) {
    return {
      nav: [['families', 'Product families'], ['study', 'Technical study']],
      sections: `
<section class="sec light" id="families"><div class="wrap">
  ${sectionHead({ label: 'Product families', title: 'Complete solutions for power transmission & automation.', lead: 'Gearmotors and gear units, from compact in-line and worm designs to heavy-duty planetary and helical units.' })}
  <div class="gear-feature">
    <ul class="gfam reveal">${GEAR_FAMILIES.map((g) => `<li><span class="dot"></span>${g}</li>`).join('')}</ul>
    <div class="plinth reveal">${img(root, 'gearboxes-bonfiglioli-cutout.png', 'Assortment of Bonfiglioli gearboxes and geared motors')}</div>
  </div></div></section>
${studyBand({ root, img: DIAGRAMS.gearbox, alt: 'Exploded study of a single-stage gearbox and gear pair', title: 'How a gearbox earns its keep.', lead: 'A gear train turns high speed and low torque into low speed and high torque. The housing keeps the pair meshed, aligned and lubricated, and the rest is engineering judgement about size, duty and service life.' })}`,
      gallery: [],
      brandsTheme: 'light', relatedTheme: 'dark',
    };
  },
  pumps(root) {
    return {
      nav: [['solutions', 'Pump solutions'], ['study', 'Technical study'], ['range', 'APP & iSave']],
      sections: `
<section class="sec light" id="solutions"><div class="wrap">
  ${sectionHead({ label: 'Pump solutions', title: 'Pressure, engineered for water.', lead: 'Danfoss offers high-pressure pumps for a wide range of industries, plus energy recovery devices and valves for various applications.' })}
  <ul class="appchips reveal">${PUMP.solutions.map((a) => `<li><span class="dot"></span>${a}</li>`).join('')}</ul></div></section>
${studyBand({ root, img: DIAGRAMS.ro, alt: 'Reverse osmosis train with a high-pressure APP pump, membranes and iSave energy recovery', title: 'The RO train, in one line.', lead: 'Raw water is raised to membrane pressure by the APP pump, then split into permeate and concentrate, while the iSave device recovers energy from the concentrate stream and puts it back into the process.' })}
<section class="sec light" id="range"><div class="wrap">
  ${sectionHead({ label: 'APP pumps & iSave', title: 'Pumps and energy recovery.' })}
  <div class="pump-grid">
    <div class="pump-card reveal"><p class="label"><span class="dot"></span>APP Pumps</p>
      <p>An extensive range of high-pressure pumps and accessories to power seawater RO applications.</p>
      <ul class="tags tags--lg">${PUMP.app.map((a) => `<li>${a}</li>`).join('')}</ul>
      <p class="fine">Further models in the APP range: contact Vectron for the full list.</p></div>
    <div class="pump-card reveal"><p class="label"><span class="dot"></span>iSave Energy Recovery Solutions</p>
      <p>The 3-in-1 energy recovery device (ERD), optimised for seawater reverse osmosis.</p>
      <ul class="tags tags--lg">${PUMP.isave.map((a) => `<li>${a}</li>`).join('')}</ul></div>
  </div></div></section>`,
      gallery: [],
      brandsTheme: 'dark', relatedTheme: 'light',
    };
  },
};

export function category(slug) {
  const root = '../../';
  const c = catByslug(slug);
  const { nav, sections, gallery, brandsTheme, relatedTheme } = catContent[slug](root);
  const related = CATEGORIES.filter((x) => x.slug !== slug);
  const brandsHere = BRANDS.filter((b) => b.cats.includes(slug));
  const galleryHtml = gallery.length
    ? `<section class="sec dark"><div class="wrap">
  ${sectionHead({ label: 'From the catalogue', title: 'The range, up close.' })}
  <div class="cgallery">${gallery.map(([file, tag], i) => `<figure class="cgal cgal--${i + 1} reveal">${img(root, file, tag, '', '')}<figcaption><span class="label">${tag}</span></figcaption></figure>`).join('')}</div>
</div></section>`
    : '';
  const body = `
<section class="chero light">
  <div class="wrap chero__grid">
    <div class="chero__copy">
      <p class="crumb"><a href="${root}products/">Products</a></p>
      <h1 class="display-md">${c.name}</h1>
      <p class="lead">${CATEGORY_SEO[slug].lead}</p>
      <div class="cta__btns">
        <a class="btn btn--accent btn--lg" data-magnetic href="${wa(`Hi Vectron, I would like to know more about ${c.name}.`)}" target="_blank" rel="noopener">${waIcon} Enquire on WhatsApp</a>
        <a class="btn btn--ghost btn--lg" data-magnetic href="${root}contact/?product=${encodeURIComponent(c.name)}">Request product details</a>
      </div>
    </div>
    <div class="plinth plinth--hero" data-parallax="0.04">${img(root, c.img, c.imgAlt, '', 'loading="eager" fetchpriority="high"').replace('loading="lazy" ', '')}</div>
  </div>
</section>
<nav class="subnav subnav--light" aria-label="On this page" data-subnav><div class="wrap"><ul>${nav.map(([id, l]) => `<li><a href="#${id}">${l}</a></li>`).join('')}<li><a href="#brands-here">Brands</a></li></ul></div></nav>
${sections}
${galleryHtml}
<section class="sec ${brandsTheme}" id="brands-here"><div class="wrap">
  ${sectionHead({ label: 'Brands', title: 'Brands in this category.' })}
  ${brandTiles(root, brandsHere)}</div></section>
<section class="sec ${relatedTheme}"><div class="wrap">
  ${sectionHead({ label: 'Related solutions', title: 'Often specified together.' })}
  <div class="related">${related.map((r) => `<a class="related__i reveal" href="${catHref(root, r.slug)}"><b>${r.name}</b>${arrow}</a>`).join('')}</div></div></section>`;
  return page({
    title: CATEGORY_SEO[slug].title,
    description: CATEGORY_SEO[slug].description,
    path: `products/${slug}/`, root, current: 'products/', body, bodyClass: 'cat',
  });
}

/* ------------------------------------------------------------------ BRANDS */
export function brands() {
  const root = '../';
  const filters = [['all', 'All'], ...CATEGORIES.map((c) => [c.slug, c.short])];
  const body = `
<section class="phero light"><div class="wrap">
  <p class="label"><span class="dot"></span>Brands</p>
  <h1 class="display-md">The brands<br>we deal with.</h1>
  <p class="lead">Motors, drives, gearboxes and pumps from the manufacturers below, with servicing across the same categories.</p>
</div></section>
<section class="sec light"><div class="wrap">
  <div class="filters" role="group" aria-label="Filter brands by category">${filters.map(([k, l], i) => `<button type="button" class="chip${i === 0 ? ' is-active' : ''}" data-filter="${k}" aria-pressed="${i === 0}"><span class="dot"></span>${l}</button>`).join('')}</div>
  ${brandTiles(root, BRANDS, { filterable: true })}
  <p class="fine">Brand names and logos belong to their respective owners. They appear here to show the products Vectron deals with and services, and do not imply any dealership or partnership.</p>
</div></section>`;
  return page({
    title: PAGE_SEO['brands/'].title,
    description: PAGE_SEO['brands/'].description,
    path: 'brands/', root, current: 'brands/', body,
  });
}

/* ---------------------------------------------------------------- SERVICES */
export function services() {
  const root = '../';
  const lines = SERVICE_LINES.map(
    (s) => `<li class="reveal"><b>${s.t}</b><span>${s.d}</span><a href="${catHref(root, s.to)}">View ${s.link} ${arrow}</a></li>`
  ).join('');
  const body = `
<section class="phero light"><div class="wrap">
  <p class="label"><span class="dot"></span>Services</p>
  <h1 class="display-md">Lifecycle<br>engineering support.</h1>
  <p class="lead">Technical advice and servicing that stay with your machinery long after supply.</p>
</div></section>
<section class="sec light svc-sec"><div class="wrap svc__grid">
  <div>${sectionHead({ label: 'Servicing', title: 'What we service.' })}</div>
  <ul class="svc">${lines}</ul>
</div></section>`;
  return page({
    title: PAGE_SEO['services/'].title,
    description: PAGE_SEO['services/'].description,
    path: 'services/', root, current: 'services/', body,
  });
}

/* ------------------------------------------------------------------- ABOUT */
export function about() {
  const root = '../';
  const body = `
<section class="phero light"><div class="wrap">
  <p class="label"><span class="dot"></span>About</p>
  <h1 class="display-md">Continuously engineered.<br>Built for reliability.</h1>
</div></section>
<section class="sec light"><div class="wrap about2">
  <article class="about2__col reveal"><h2 class="about2__h">Who We Are</h2><p class="about2__p">${WHO_WE_ARE}</p></article>
  <article class="about2__col reveal"><h2 class="about2__h">What We Do</h2><p class="about2__p">${WHAT_WE_DO}</p></article>
</div></section>
<section class="sec light about-mv"><div class="wrap two">
  <div><p class="label"><span class="dot"></span>Mission</p><p class="mv__t mv__t--ink reveal">${MISSION}</p></div>
  <div><p class="label"><span class="dot"></span>Vision</p><p class="mv__t mv__t--ink reveal">${VISION}</p></div>
</div></section>
<section class="sec dark"><div class="wrap">
  ${sectionHead({ label: 'Our guiding commitments', title: 'Four values we work by.' })}
  <ul class="vals">${VALUES.map((v) => `<li class="reveal"><h3>${v.t}</h3><p>${v.d}</p></li>`).join('')}</ul>
</div></section>
<section class="sec light"><div class="wrap head-office">
  <p class="label"><span class="dot"></span>Head office</p>
  <p class="lead reveal">${SITE.address.join('<br>')}</p>
  <p class="lead reveal"><a href="tel:${SITE.phoneRaw}">${SITE.phone}</a><br><a href="mailto:${SITE.email}">${SITE.email}</a></p>
</div></section>`;
  return page({
    title: PAGE_SEO['about/'].title,
    description: PAGE_SEO['about/'].description,
    path: 'about/', root, current: 'about/', body,
  });
}

/* ----------------------------------------------------------------- CONTACT */
export function contact() {
  const root = '../';
  const opts = CATEGORIES.map((c) => `<option>${c.name}</option>`).join('');
  const body = `
<section class="phero light"><div class="wrap">
  <p class="label"><span class="dot"></span>Contact</p>
  <h1 class="display-md">Get in<br>touch.</h1>
  <p class="lead">Call, WhatsApp, email or send an enquiry below. Tell us the product or requirement and we will get back to you.</p>
</div></section>
<section class="sec light"><div class="wrap contact__grid">
  <div class="contact__info">
    <ul>
      <li><span class="label">Phone</span><a href="tel:${SITE.phoneRaw}">${SITE.phone}</a></li>
      <li><span class="label">WhatsApp</span><a href="${wa('Hi Vectron, I would like to know more about your products.')}" target="_blank" rel="noopener">${waIcon} Message us</a></li>
      <li><span class="label">Email</span><a href="${mail('Enquiry from website')}">${SITE.email}</a></li>
      <li><span class="label">Head office</span><address>${SITE.address.join('<br>')}</address></li>
    </ul>
  </div>
  <form class="form" data-enquiry novalidate>
    <div class="field"><label for="f-name">Name <i aria-hidden="true">*</i></label><input id="f-name" name="name" autocomplete="name" required></div>
    <div class="field"><label for="f-company">Company</label><input id="f-company" name="company" autocomplete="organization"></div>
    <div class="field"><label for="f-contact">Phone or email <i aria-hidden="true">*</i></label><input id="f-contact" name="contact" autocomplete="tel" required></div>
    <div class="field"><label for="f-product">Product / requirement</label>
      <select id="f-product" name="product"><option value="">Select a category</option>${opts}<option>Servicing</option><option>Something else</option></select></div>
    <div class="field"><label for="f-msg">Message</label><textarea id="f-msg" name="message" rows="4"></textarea></div>
    <fieldset class="via"><legend class="label">Send via</legend>
      <label><input type="radio" name="via" value="email" checked><span>Email</span></label>
      <label><input type="radio" name="via" value="whatsapp"><span>WhatsApp</span></label></fieldset>
    <p class="form__err" role="alert" data-form-err hidden></p>
    <button class="btn btn--accent btn--lg" type="submit" data-magnetic><span data-submit-label>Send enquiry by email</span> ${arrow}</button>
    <p class="fine">Your details open, pre-filled, in your email app (or WhatsApp) — review them there, then send.</p>
    <p class="form__note" role="status" data-form-note hidden>No email app opened? Write to <a href="mailto:${SITE.email}">${SITE.email}</a>, <a href="#" data-gmail target="_blank" rel="noopener">open Gmail with your message</a>, or <a href="${wa('Hi Vectron, I would like to enquire.')}" target="_blank" rel="noopener">send it on WhatsApp</a>.</p>
  </form>
</div></section>`;
  return page({
    title: PAGE_SEO['contact/'].title,
    description: PAGE_SEO['contact/'].description,
    path: 'contact/', root, current: 'contact/', body,
  });
}

export function notFound() {
  const root = '';
  return page({
    title: 'Page not found | Vectron',
    description: 'This page could not be found.',
    path: '404.html', root, current: '', noindex: true,
    body: `<section class="phero light"><div class="wrap"><p class="label"><span class="dot"></span>404</p><h1 class="display-md">Off the<br>shaft.</h1><p class="lead">That page does not exist. Head back to the start.</p><a class="btn btn--accent btn--lg" href="/">Home</a></div></section>`,
  }).replace('href="/"', 'href="index.html"');
}
