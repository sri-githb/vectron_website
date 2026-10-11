import {
  SITE, ASSETS, CATEGORIES, BRANDS, BRAND_LOGO_DIR, DIAGRAMS, PILLARS, SERVICE_LINES,
  MOTOR_FAMILIES, MOTOR_BRAND_RANGES, VFD_FAMILIES, GEAR_BONFIGLIOLI,
  GEAR_SHANTHI, PUMP, APPLICATIONS, VALUES, MISSION, VISION, FLOW, wa, mail,
} from './data.mjs';
import { page, sectionHead, enquiryCta, arrow, waIcon } from './layout.mjs';

const img = (root, file, alt, cls = '', extra = '') =>
  `<img class="${cls}" src="${root}assets/img/${file}" alt="${alt}" loading="lazy" decoding="async" ${extra}>`;
const fig = (root, path, alt, cls = '') =>
  `<img class="${cls}" src="${root}${path}" alt="${alt}" loading="lazy" decoding="async" width="1200">`;
const catByslug = (s) => CATEGORIES.find((c) => c.slug === s);
const catHref = (root, s) => `${root}products/${s}/`;

/* ------------------------------------------------------------------ HOME */
export function home() {
  const root = '';

  /* hero category strip — the immediate "what we do" answer */
  const heroStrip = CATEGORIES.map(
    (c) => `<a href="${catHref(root, c.slug)}"><span>${c.n}</span>${c.name} ${arrow}</a>`
  ).join('');

  /* product worlds — editorial, asymmetric, image-led */
  const worlds = CATEGORIES.map(
    (c, i) => `<article class="world reveal">
      <a class="world__img" href="${catHref(root, c.slug)}" aria-label="${c.name}">
        ${img(root, c.img, c.imgAlt, '', '')}
        <span class="world__tag label">${c.n} / 04 · ${c.short}</span>
      </a>
      <div class="world__body">
        <div class="world__head">
          <span class="world__n">${c.n}</span>
          <a class="world__go" href="${catHref(root, c.slug)}">Explore ${arrow}</a>
        </div>
        <a class="world__t" href="${catHref(root, c.slug)}"><h3>${c.name}</h3></a>
        <p>${c.blurb}</p>
        <ul class="tags">${c.types.map((t) => `<li>${t}</li>`).join('')}</ul>
      </div>
    </article>`
  ).join('');

  const flow = FLOW.map(
    (f, i) => `<li class="flow__step" data-flow-step>
      <span class="flow__dot" aria-hidden="true"></span>
      <span class="flow__k">0${i + 1}</span>
      <h3>${f.k}</h3>
      <p class="flow__t">${f.t}</p>
      <p>${f.d}</p>
      ${f.to ? `<a class="flow__go" href="${root}${f.top ? f.to : 'products/' + f.to}/">See ${f.t} ${arrow}</a>` : ''}
    </li>`
  ).join('');

  const apps = APPLICATIONS.map(
    (a, i) => `<li class="idx__row reveal"><span class="idx__n">${String(i + 1).padStart(2, '0')}</span><span class="idx__t">${a.name}</span><span class="idx__d">${a.uses}</span></li>`
  ).join('');
  const brandWall = BRANDS.map((b) => `<li class="bw__i"><span>${b.name}</span>${b.note ? `<small>${b.note}</small>` : ''}</li>`).join('');
  const pillars = PILLARS.map((p) => `<li><b>${p.t}</b><span>${p.d}</span></li>`).join('');

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
      <div class="hero__viz" data-assembly role="img" aria-label="Scroll-driven exploded assembly study of an industrial electric motor coupled to a gearbox">
        <canvas class="hero__canvas" data-assembly-canvas></canvas>
        <noscript><div class="hero__fallback">${img(root, 'motors-bonfiglioli-cutout.png', 'Geared motor and industrial motors', 'hero__fallback-img')}</div></noscript>
      </div>
    </div>
    <div class="wrap hero__strip" role="group" aria-label="Product categories">${heroStrip}</div>
  </div>
</section>

<section class="intro light">
  <div class="wrap intro__grid">
    <p class="label"><span class="dot"></span>Vectron</p>
    <div>
      <p class="statement reveal">Complex mechanical challenges, turned into <em>smooth, uninterrupted motion.</em></p>
      <div class="intro__cols">
        <p class="reveal">Vectron bridges state-of-the-art torque control with rugged outer durability — from individual machine automation to plant-wide drive systems. We help industries run with higher efficiency, reduced energy consumption and fewer unplanned stops.</p>
        <ul class="threeS reveal" aria-label="The 3S of Vectron">${pillars}</ul>
      </div>
    </div>
  </div>
</section>

<section class="worlds light" id="products">
  <div class="wrap">
    ${sectionHead({ n: '01', label: 'Products', title: 'Four worlds.<br>One partner.', lead: 'One supplier for the whole drive train — power, torque, control and pressure — backed by lifecycle servicing.' })}
    <div class="worlds__list">${worlds}</div>
  </div>
</section>

<section class="story dark" id="engineering">
  <div class="wrap story__grid">
    <figure class="diagram reveal">
      ${fig(root, DIAGRAMS.drive, 'Schematic of a drive line: VFD, motor, gearbox and load')}
      <figcaption><span class="label">The drive line</span>Power is shaped, turned into torque, then into controlled motion.</figcaption>
    </figure>
    <div>
      ${sectionHead({ n: '02', label: 'Engineering story', title: 'From power to uptime.', lead: 'Every Vectron solution sits somewhere on one line: power becomes torque, torque becomes controlled motion, and well-chosen motion saves energy and keeps lines running.' })}
      <ol class="flow" data-flow><span class="flow__line" aria-hidden="true"><i data-flow-fill></i></span>${flow}</ol>
    </div>
  </div>
</section>

<section class="feature light">
  <div class="wrap feature__grid">
    <div class="feature__copy">
      <p class="label"><span class="dot"></span>Featured · ${catByslug('motors').n}</p>
      <h2 class="display-md reveal">INDUSTRIAL<br>MOTORS</h2>
      <p class="lead reveal">Available in IE2, IE3 and IE4 efficiency classes, they optimise energy consumption while reducing vibration and noise — with crane duty, flameproof, brake and smoke venting variants.</p>
      <ul class="tags tags--lg reveal">${['IE2', 'IE3', 'IE4', 'Crane duty', 'Smoke venting', 'Brake'].map((t) => `<li>${t}</li>`).join('')}</ul>
      <a class="btn btn--accent btn--lg" data-magnetic href="${catHref(root, 'motors')}">Explore motors ${arrow}</a>
    </div>
    <div class="feature__imgs">
      <div class="plinth plinth--a" data-parallax="0.05">${img(root, 'motor-abb-std-cutout.png', 'Standard IE2 and IE3 industrial motor')}<span class="label">IE2 · IE3</span></div>
      <div class="plinth plinth--b" data-parallax="-0.04">${img(root, 'motor-abb-brake-cutout.png', 'Brake motor with release lever')}<span class="label">Brake</span></div>
      <div class="plinth plinth--c" data-parallax="0.03">${img(root, 'motor-abb-crane-cutout.png', 'Crane duty motor assembly')}<span class="label">Crane duty</span></div>
    </div>
  </div>
</section>

<section class="apps dark">
  <div class="wrap">
    ${sectionHead({ n: '03', label: 'Applications', title: 'Where it runs.', lead: 'Applications named by the products themselves, from crane duty motors to reverse osmosis pumps.' })}
    <ul class="idx">${apps}</ul>
  </div>
</section>

<section class="brands light">
  <div class="wrap">
    ${sectionHead({ n: '04', label: 'Brands', title: 'The brands we deal with.', lead: 'Motors, drives, gearboxes and pumps from the manufacturers below. We also service the brands shown.' })}
    <ul class="bw">${brandWall}</ul>
    <a class="link-arrow" href="${root}brands/">Brands by category ${arrow}</a>
  </div>
</section>

<section class="life dark">
  <div class="wrap life__grid">
    <div>
      ${sectionHead({ label: 'Lifecycle support', title: 'Beyond supply.', lead: 'Vectron serves as a dedicated technical advisor across the entire lifecycle of your machinery, and services the motor, gear, drive and pump brands we deal with.' })}
      <a class="btn btn--accent btn--lg" data-magnetic href="${root}services/">Our services ${arrow}</a>
    </div>
    <ol class="life__list">
      <li class="reveal"><span class="dot"></span><b>Servicing</b><span>Motors, gearboxes, VFDs and pumps</span></li>
      <li class="reveal"><span class="dot"></span><b>Technical advice</b><span>Dedicated advisors, not just a supplier</span></li>
      <li class="reveal"><span class="dot"></span><b>Capability building</b><span>For our teams and customer technicians</span></li>
      <li class="reveal"><span class="dot"></span><b>Sourcing & solutions</b><span>Customised to your specific needs</span></li>
    </ol>
  </div>
</section>

<section class="mv light">
  <div class="wrap mv__grid">
    <div><p class="label"><span class="dot"></span>Mission</p><p class="mv__t reveal">${MISSION}</p></div>
    <div><p class="label"><span class="dot"></span>Vision</p><p class="mv__t mv__t--dim reveal">${VISION}</p></div>
  </div>
</section>

<section class="finale dark">
  <div class="wrap">
    <p class="label"><span class="dot"></span>Talk to Vectron</p>
    <h2 class="display-md finale__t reveal">Master your motion.<br>Minimize energy loss.<br><span class="accent">Keep production running.</span></h2>
    <div class="cta__btns">
      <a class="btn btn--accent btn--lg" data-magnetic href="${wa('Hi Vectron, I would like to know more about your products.')}" target="_blank" rel="noopener">${waIcon} WhatsApp</a>
      <a class="btn btn--ghost btn--lg" data-magnetic href="tel:${SITE.phoneRaw}">Call ${SITE.phone}</a>
      <a class="btn btn--ghost btn--lg" data-magnetic href="${mail('Enquiry from website', 'Hi Vectron,\n\nI would like to enquire about:\n\n')}">Email</a>
    </div>
  </div>
</section>`;

  return page({
    title: 'Vectron | Motors, Drives, Gearboxes & High-Pressure Pumps, Chennai',
    description: 'Vectron: precision engineering products and lifecycle support. Industrial motors, variable frequency drives, gearboxes and high-pressure pumps. Chennai.',
    path: '', root, current: '', body, bodyClass: 'home',
    scripts: ['assets/assembly.js'],
  });
}

/* --------------------------------------------------------- PRODUCTS INDEX */
export function products() {
  const root = '../';
  const rows = CATEGORIES.map(
    (c) => `<a class="prow reveal" href="${catHref(root, c.slug)}">
      <span class="prow__n">${c.n} / 04</span>
      <span class="prow__main"><h2>${c.name}</h2><p>${c.blurb}</p><ul class="tags">${c.types.map((t) => `<li>${t}</li>`).join('')}</ul></span>
      <span class="prow__img">${img(root, c.img, c.imgAlt)}</span>
      <span class="prow__go">${arrow}</span></a>`
  ).join('');

  const stage = CATEGORIES.map(
    (c, i) => `<figure class="stage__slide${i === 0 ? ' is-active' : ''}" data-slide="${i}">
      ${img(root, c.img, c.imgAlt, 'stage__img', i === 0 ? 'fetchpriority="high"' : '')}
      <figcaption><span>${c.n}</span> ${c.name}</figcaption></figure>`
  ).join('');
  const dots = CATEGORIES.map(
    (c, i) => `<button type="button" class="stage__dot${i === 0 ? ' is-active' : ''}" data-dot="${i}" aria-label="Show ${c.name}"><span></span></button>`
  ).join('');

  const body = `
<section class="phero light"><div class="wrap phero__grid">
  <div>
    <p class="label"><span class="dot"></span>Products · 01 — 04</p>
    <h1 class="display-md">Four categories.<br>One engineered system.</h1>
    <p class="lead">Power, drive control, torque and pressure — four categories, covering what industrial motion needs. Browse the catalogue below, or tell us about the machine and we will point you to the right product.</p>
    <div class="cta__btns">
      <a class="btn btn--accent btn--lg" data-magnetic href="${wa('Hi Vectron, I would like to know more about your products.')}" target="_blank" rel="noopener">${waIcon} Enquire on WhatsApp</a>
      <a class="btn btn--ghost btn--lg" data-magnetic href="${root}contact/">Request product details</a>
    </div>
  </div>
  <figure class="diagram reveal">${fig(root, DIAGRAMS.drive, 'Schematic of a drive line')}<figcaption><span class="label">The drive line</span>Power → torque → motion → efficiency</figcaption></figure>
</div></section>
<section class="rail dark" aria-label="Product catalogue">
  <div class="wrap">
    <div class="rail__head">
      <p class="label"><span class="dot"></span>The catalogue</p>
      <a class="link-arrow" href="#plist">Skip to the index ${arrow}</a>
    </div>
    <div class="stage" data-stage>
      <div class="stage__frame">
        <div class="stage__bar"><span class="label">Browse</span><span class="label stage__count" data-stage-count>01 / 04</span></div>
        <div class="stage__plinth">${stage}</div>
        <div class="stage__foot"><div class="stage__dots">${dots}</div><a class="link-arrow" data-stage-link href="${catHref(root, 'motors')}">View category ${arrow}</a></div>
      </div>
    </div>
    <ul class="strip strip--rail">${CATEGORIES.map((c) => `<li><a href="${catHref(root, c.slug)}"><span>${c.n}</span>${c.short}</a></li>`).join('')}</ul>
  </div>
</section>
<section class="plist light" id="plist"><div class="wrap">${rows}</div></section>
${enquiryCta({ root, topic: 'your products', heading: 'Not sure where to start?', sub: 'Describe the machine or the problem. We will recommend the right product category.' })}`;
  return page({
    title: 'Products | Motors, VFDs, Gearboxes, High-Pressure Pumps',
    description: 'Explore Vectron product categories: industrial motors, variable frequency drives, gearboxes and geared motors, and high-pressure pumps.',
    path: 'products/', root, current: 'products/', body,
  });
}

/* ------------------------------------------------------ CATEGORY PAGES */
const rowsDetails = (items) =>
  items.map((f, i) => `<details class="frow reveal"${i === 0 ? ' open' : ''}>
    <summary><span class="frow__i">${String(i + 1).padStart(2, '0')}</span><span class="frow__t">${f.name}</span><span class="frow__m">${f.meta}</span><span class="frow__pm" aria-hidden="true"></span></summary>
    <div class="frow__b"><p>${f.text}</p>${f.brands ? `<p class="frow__br"><span class="label">Brands</span> ${f.brands}</p>` : ''}</div></details>`).join('');

const listBlock = (title, items, cls = '') =>
  `<div class="lblock reveal ${cls}"><h3>${title}</h3><ul>${items.map((i) => `<li><span class="dot"></span>${i}</li>`).join('')}</ul></div>`;

function specPanel(rows, note = true) {
  return `<div class="spec reveal"><p class="label"><span class="dot"></span>Technical information</p>
    <dl>${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
    ${note ? `<div class="spec__note"><dt>Detailed specifications</dt><dd>Contact Vectron for detailed specifications.</dd></div>` : ''}</dl></div>`;
}

const studyBand = ({ root, img: diag, alt, title, lead, points, label = 'Technical study' }) => `
<section class="study dark"><div class="wrap study__grid">
  <figure class="diagram reveal">${fig(root, diag, alt)}<figcaption><span class="label">${label}</span>${title}</figcaption></figure>
  <div>
    <p class="label"><span class="dot"></span>${label}</p>
    <h2 class="h2 reveal">${title}</h2>
    <p class="lead reveal">${lead}</p>
    <ul class="stdy reveal">${points.map((p) => `<li><span class="dot"></span>${p}</li>`).join('')}</ul>
  </div>
</div></section>`;

const catContent = {
  motors(root) {
    return {
      nav: [['families', 'Families'], ['study', 'Technical study'], ['range', 'Ranges by brand'], ['specs', 'Specifications']],
      sections: `
<section class="sec light" id="families"><div class="wrap">
  ${sectionHead({ label: 'Product families', title: 'Motors by duty and efficiency.', lead: 'Efficiency classes IE2, IE3 and IE4, and application-specific motors for demanding duties.' })}
  <div class="frows">${rowsDetails(MOTOR_FAMILIES)}</div></div></section>
${studyBand({ root, img: DIAGRAMS.motorCut, alt: 'Cross-section study of an induction motor: stator, rotor, shaft, fan and terminal box', title: 'Inside every motor.', lead: 'The architecture is always the same — a stator, a rotor and a shaft in a rugged frame. What changes with the duty is the efficiency class, the enclosure, the cooling and the extras like brakes.', label: 'Technical study', points: ['Efficiency classes IE2, IE3 and IE4', 'Flameproof and TEFC flameproof variants', 'Crane duty, brake and smoke venting motors', 'Cooling tower and dual-speed ranges'] })}
<section class="sec dark" id="range"><div class="wrap">
  ${sectionHead({ label: 'Range by brand', title: 'What each brand offers.', lead: 'Product lines as listed in the Vectron brochure.' })}
  <div class="lgrid">${MOTOR_BRAND_RANGES.map((b) => listBlock(b.brand + (b.note ? `<small>${b.note}</small>` : ''), b.items)).join('')}</div></div></section>
<section class="sec light" id="specs"><div class="wrap spec__grid">
  ${sectionHead({ label: 'At a glance', title: 'Know what you are choosing.' })}
  ${specPanel([['Efficiency classes', 'IE2 · IE3 · IE4'], ['Variants', 'Flameproof · Crane duty · Slip-ring crane duty · Brake · Smoke venting · Cooling tower · Dual speed'], ['Brands', 'ABB, CG, Innomotics, Hindustan Electric Motors, WEG, Marathon, Havells, Bonfiglioli']])}</div></section>`,
      gallery: [['motor-abb-std-cutout.png', 'IE2 / IE3'], ['motor-hindustan-cutout.png', 'Hindustan Electric Motors'], ['motors-bonfiglioli-cutout.png', 'Bonfiglioli'], ['motor-abb-brake-cutout.png', 'Brake duty']],
    };
  },
  vfds(root) {
    const rows = VFD_FAMILIES.map((f, i) => `<article class="vrow reveal">
      <span class="vrow__n">${String(i + 1).padStart(2, '0')}</span>
      <div class="vrow__main"><h3>${f.family}</h3><p>${f.purpose}</p></div>
      <div class="vrow__col"><span class="label">Applications</span><p>${f.apps}</p></div>
      <div class="vrow__col"><span class="label">Product range</span><ul>${f.range.map((r) => `<li>${r}</li>`).join('')}</ul></div>
      <a class="vrow__go" href="${wa(`Hi Vectron, I would like to know more about Danfoss ${f.family} drives.`)}" target="_blank" rel="noopener" aria-label="Enquire about ${f.family}">Enquire ${arrow}</a></article>`).join('');
    return {
      nav: [['families', 'Drive families'], ['study', 'Technical study'], ['specs', 'Specifications']],
      sections: `
<section class="sec light" id="families"><div class="wrap">
  ${sectionHead({ label: 'Drive families', title: 'The Danfoss drive ecosystem, organised.', lead: 'A compact and competitive solution for applications with basic needs, and application-optimised drives for the rest. Each family below lists the products from the brochure.' })}
  <div class="vrows">${rows}</div></div></section>
${studyBand({ root, img: DIAGRAMS.drive, alt: 'Schematic of a drive line with a variable frequency drive', title: 'Where the drive sits.', lead: 'The drive sits between the power supply and the motor, shaping voltage and frequency so the machine runs exactly as the process needs — from basic machine applications to HVAC, refrigeration, water and automation.', label: 'Technical study', points: ['Micro and compact drives for basic applications', 'Automation drives for machines and processes', 'HVAC, refrigeration and water-optimised drives', 'Soft starters and harmonic filters for power quality'] })}
<section class="sec dark" id="specs"><div class="wrap spec__grid">
  ${sectionHead({ label: 'At a glance', title: 'Servicing included.', lead: 'Vectron also services the VFDs listed here.' })}
  ${specPanel([['Brand', 'Danfoss'], ['Product groups', 'iC, VLT, VACON drives · Soft starters · AHF harmonic filter'], ['Control panels', 'Variable frequency drives / control panels']])}</div></section>`,
      gallery: [['vfd-danfoss.jpg', 'VLT range'], ['vfd-ic7-ic2.jpg', 'iC7 · iC2']],
    };
  },
  gearboxes(root) {
    return {
      nav: [['families', 'Product families'], ['study', 'Technical study'], ['range', 'Ranges by brand'], ['specs', 'Specifications']],
      sections: `
<section class="sec light" id="families"><div class="wrap">
  ${sectionHead({ label: 'Product families', title: 'Complete solutions for power transmission & automation.', lead: 'Gearmotors and gear units, from compact in-line and worm designs to heavy-duty planetary and helical units.' })}
  <div class="gear-feature">
    <div class="plinth reveal">${img(root, 'gearboxes-bonfiglioli-cutout.png', 'Assortment of Bonfiglioli gearboxes and geared motors')}<span class="label">Bonfiglioli range</span></div>
    <div class="plinth reveal">${img(root, 'gearbox-shanthi-helical-cutout.png', 'Blue Shanthi Gears helical gearbox')}<span class="label">Shanthi Gears</span></div>
  </div></div></section>
${studyBand({ root, img: DIAGRAMS.gearbox, alt: 'Exploded study of a single-stage gearbox and gear pair', title: 'How a gearbox earns its keep.', lead: 'A gear train turns high speed and low torque into low speed and high torque. The housing keeps the pair meshed, aligned and lubricated — and the rest is engineering judgement about size, duty and service life.', label: 'Technical study', points: ['Helical, bevel, worm and planetary configurations', 'Compact gearmotors to heavy-duty gear units', 'Shaft-mounted and foot-mounted arrangements', 'Combined planetary / helical heavy duty units'] })}
<section class="sec dark" id="range"><div class="wrap">
  ${sectionHead({ label: 'Range by brand', title: 'Choose the family. We help match the unit.', lead: 'Product lines as listed in the Vectron brochure.' })}
  <div class="lgrid lgrid--2">
    ${listBlock('Bonfiglioli<small>Gearboxes & geared motors</small>', GEAR_BONFIGLIOLI.concat(['‘TA’ series Shaft Mounted Helical Gear Box']))}
    ${listBlock('Shanthi Gears<small>Wide range of gearboxes for power transmission</small>', GEAR_SHANTHI)}
    ${listBlock('Top Gear Transmission<small>Gearbox</small>', ['Gearbox range (shaft mounted type shown in brochure)'])}
    ${listBlock('Bauer Gear Motor<small>Gearbox & geared motors</small>', ['Gearbox and geared motor range'])}
  </div></div></section>
<section class="sec light" id="specs"><div class="wrap spec__grid">
  ${sectionHead({ label: 'At a glance', title: 'Find your perfect industrial gear-motor.' })}
  ${specPanel([['Families', 'Helical bevel · In-line · Parallel shaft · Worm · Enhanced protection worm · Planetary · Heavy-duty combined planetary/helical · Shaft mounted helical'], ['Brands', 'Bonfiglioli, Shanthi Gears, Top Gear Transmission, Bauer Gear Motor']])}</div></section>`,
      gallery: [],
    };
  },
  pumps(root) {
    return {
      nav: [['apps', 'Applications'], ['study', 'Technical study'], ['range', 'APP & iSave'], ['features', 'Features']],
      sections: `
<section class="sec light" id="apps"><div class="wrap">
  ${sectionHead({ label: 'Applications', title: 'Pressure, engineered for water.', lead: 'Danfoss offers high-pressure pumps for a wide range of industries, plus energy recovery devices and valves for various applications.' })}
  <ul class="appchips reveal">${PUMP.apps.map((a) => `<li><span class="dot"></span>${a}</li>`).join('')}</ul></div></section>
${studyBand({ root, img: DIAGRAMS.ro, alt: 'Reverse osmosis train with a high-pressure APP pump, membranes and iSave energy recovery', title: 'The RO train, in one line.', lead: 'Raw water is raised to membrane pressure by the APP pump, then split into permeate and concentrate — while the iSave device recovers energy from the concentrate stream and puts it back into the process.', label: 'Technical study', points: ['High-pressure APP pumps for seawater RO', 'iSave energy recovery devices', 'Compact footprint with long service intervals', 'Simple, service-friendly design with high uptime'] })}
<section class="sec dark" id="range"><div class="wrap">
  ${sectionHead({ label: 'APP pumps & iSave', title: 'Pumps and energy recovery.' })}
  <div class="pump-grid">
    <div class="pump-card reveal"><p class="label"><span class="dot"></span>APP pumps</p>
      <p>An extensive range of high-pressure pumps and accessories to power seawater RO applications.</p>
      <ul class="tags tags--lg">${PUMP.app.map((a) => `<li>${a}</li>`).join('')}</ul>
      <p class="fine">Further models in the APP range: contact Vectron for the full list.</p>
      <p class="stat"><b>90%</b><span>efficiency at all operation points, as stated by Danfoss for APP pumps</span></p></div>
    <div class="pump-card reveal"><p class="label"><span class="dot"></span>iSave energy recovery device</p>
      <p>The 3-in-1 energy recovery device (ERD), optimised for seawater reverse osmosis.</p>
      <ul class="tags tags--lg">${PUMP.isave.map((a) => `<li>${a}</li>`).join('')}</ul></div>
  </div></div></section>
<section class="sec light" id="features"><div class="wrap spec__grid">
  ${sectionHead({ label: 'Features & benefits', title: 'Simple, reliable, high uptime.' })}
  <ul class="featlist reveal">${PUMP.features.map((f) => `<li><span class="dot"></span>${f}</li>`).join('')}</ul></div></section>`,
      gallery: [],
    };
  },
};

export function category(slug) {
  const root = '../../';
  const c = catByslug(slug);
  const { nav, sections, gallery } = catContent[slug](root);
  const apps = APPLICATIONS.filter((a) => a.cats.includes(slug));
  const related = CATEGORIES.filter((x) => x.slug !== slug);
  const brandsHere = BRANDS.filter((b) => b.cats.includes(slug));
  const tilt = c.n === '04' ? 'High-Pressure Pumps' : c.name === 'Variable Frequency Drives' ? 'Variable Frequency Drives' : c.short === 'Motors' ? 'Industrial Motors' : 'Gearboxes & Geared Motors';
  const galleryHtml = gallery.length
    ? `<section class="sec light"><div class="wrap">
  ${sectionHead({ label: 'From the catalogue', title: 'The range, up close.', lead: '' })}
  <div class="cgallery">${gallery.map(([file, tag], i) => `<figure class="cgal cgal--${i + 1} reveal">${img(root, file, tag, '', '')}<figcaption><span class="label">${tag}</span></figcaption></figure>`).join('')}</div>
</div></section>`
    : '';
  const body = `
<section class="chero light">
  <div class="wrap chero__grid">
    <div class="chero__copy">
      <p class="crumb"><a href="${root}products/">Products</a><span class="dot"></span>${c.n} / 04</p>
      <h1 class="display-md">${tilt.replace(' & ', ' & ')}</h1>
      <p class="lead">${c.blurb} We also service this category.</p>
      <div class="cta__btns">
        <a class="btn btn--accent btn--lg" data-magnetic href="${wa(`Hi Vectron, I would like to know more about ${c.name}.`)}" target="_blank" rel="noopener">${waIcon} Enquire on WhatsApp</a>
        <a class="btn btn--ghost btn--lg" data-magnetic href="${root}contact/?product=${encodeURIComponent(c.name)}">Request product details</a>
      </div>
    </div>
    <div class="plinth plinth--hero" data-parallax="0.04">${img(root, c.img, c.imgAlt, '', 'loading="eager" fetchpriority="high"').replace('loading="lazy" ', '')}<span class="label">${c.n} · ${tilt}</span></div>
  </div>
</section>
<nav class="subnav subnav--light" aria-label="On this page" data-subnav><div class="wrap"><ul>${nav.map(([id, l]) => `<li><a href="#${id}">${l}</a></li>`).join('')}<li><a href="#apps-here">Applications</a></li><li><a href="#brands-here">Brands</a></li></ul></div></nav>
${sections}
${galleryHtml}
<section class="sec light" id="apps-here"><div class="wrap">
  ${sectionHead({ label: 'Applications', title: apps.length ? 'Where these products work.' : 'Applications.' })}
  ${apps.length ? `<ul class="idx">${apps.map((a, i) => `<li class="idx__row reveal"><span class="idx__n">${String(i + 1).padStart(2, '0')}</span><span class="idx__t">${a.name}</span><span class="idx__d">${a.uses}</span></li>`).join('')}</ul>` : '<p class="lead">Contact Vectron to discuss your application.</p>'}
</div></section>
<section class="sec dark" id="brands-here"><div class="wrap">
  ${sectionHead({ label: 'Relevant brands', title: 'Brands in this category.', lead: 'We also service the brands shown in this category.' })}
  <ul class="bw bw--sm">${brandsHere.map((b) => `<li class="bw__i"><span>${b.name}</span>${b.note ? `<small>${b.note}</small>` : ''}</li>`).join('')}</ul></div></section>
<section class="sec light"><div class="wrap">
  ${sectionHead({ label: 'Related solutions', title: 'Often specified together.' })}
  <div class="related">${related.map((r) => `<a class="related__i reveal" href="${catHref(root, r.slug)}"><span>${r.n}</span><b>${r.name}</b>${arrow}</a>`).join('')}</div></div></section>
${enquiryCta({ root, topic: c.name })}`;
  return page({
    title: `${c.name} | Vectron`,
    description: `${c.name} from Vectron, Chennai. ${c.blurb}`,
    path: `products/${slug}/`, root, current: 'products/', body, bodyClass: 'cat',
  });
}

/* ------------------------------------------------------------------ BRANDS */
export function brands() {
  const root = '../';
  const filters = [['all', 'All'], ...CATEGORIES.map((c) => [c.slug, c.short])];
  const rows = BRANDS.map((b) => {
    const logo = b.logo
      ? `<span class="brow__logo"><img src="${root}${BRAND_LOGO_DIR}${b.logo}" alt="" aria-hidden="true" loading="lazy" decoding="async"></span>`
      : '';
    return `<li class="brow" data-cats="${b.cats.join(' ')}"><span class="brow__id">${logo}<span class="brow__n">${b.name}</span></span>${b.note ? `<small>${b.note}</small>` : ''}<span class="brow__c">${b.cats.map((s) => `<a href="${catHref(root, s)}">${catByslug(s).short}</a>`).join('')}</span></li>`;
  }).join('');
  const body = `
<section class="phero light"><div class="wrap">
  <p class="label"><span class="dot"></span>Brands</p>
  <h1 class="display-md">The brands<br>we deal with.</h1>
  <p class="lead">A focused ecosystem of motors, drives, gearboxes and pumps — and a servicing partner across the same categories.</p>
</div></section>
<section class="sec light"><div class="wrap">
  <div class="filters" role="group" aria-label="Filter brands by category">${filters.map(([k, l], i) => `<button type="button" class="chip${i === 0 ? ' is-active' : ''}" data-filter="${k}" aria-pressed="${i === 0}"><span class="dot"></span>${l}</button>`).join('')}</div>
  <ul class="brows" data-brows>${rows}</ul>
  <p class="fine">Brand names and logos belong to their respective owners and appear here to show the products Vectron deals with and services.</p>
</div></section>
${enquiryCta({ root, topic: 'your brand requirement' })}`;
  return page({
    title: 'Brands | ABB, Danfoss, Bonfiglioli, CG, Innomotics & more',
    description: 'Brands Vectron deals with and services: ABB, CG, Innomotics, Hindustan Electric Motors, WEG, Marathon, Havells, Danfoss, Bonfiglioli, Shanthi Gears, Top Gear Transmission and Bauer Gear Motor.',
    path: 'brands/', root, current: 'brands/', body,
  });
}

/* ------------------------------------------------------------ APPLICATIONS */
export function applications() {
  const root = '../';
  const rows = APPLICATIONS.map(
    (a, i) => {
      const primary = catByslug(a.cats[0]);
      return `<article class="arow reveal">
      <span class="idx__n">${String(i + 1).padStart(2, '0')}</span>
      <div class="arow__main"><h2>${a.name}</h2><p>${a.uses}</p>
      <span class="arow__l">${a.cats.map((s) => `<a href="${catHref(root, s)}">${catByslug(s).short} ${arrow}</a>`).join('')}</span></div>
      <div class="arow__img">${img(root, primary.img, primary.imgAlt)}</div>
    </article>`;
    }
  ).join('');
  const body = `
<section class="phero light"><div class="wrap phero__grid">
  <div>
    <p class="label"><span class="dot"></span>Applications</p>
    <h1 class="display-md">Built for the<br>work that matters.</h1>
    <p class="lead">From individual machine automation to plant-wide drive systems. These are the applications named by the products in our ranges.</p>
  </div>
  <figure class="diagram reveal">${fig(root, DIAGRAMS.drive, 'Schematic of a drive line')}<figcaption><span class="label">Drive line</span>One line of motion, many applications.</figcaption></figure>
</div></section>
<section class="sec light"><div class="wrap arows">${rows}</div></section>
${enquiryCta({ root, topic: 'my application', heading: 'Tell us your application.', sub: 'Describe the machine and the duty. We will suggest the right solution.' })}`;
  return page({
    title: 'Applications | Cranes, Cooling Towers, HVAC, Water & More',
    description: 'Applications supported by Vectron products: crane duty, cooling towers, hazardous areas, smoke extraction, extrusion, HVAC, refrigeration and reverse osmosis.',
    path: 'applications/', root, current: 'applications/', body,
  });
}

/* ---------------------------------------------------------------- SERVICES */
export function services() {
  const root = '../';
  const lines = SERVICE_LINES.map(
    (s) => `<li class="reveal"><span class="idx__n">${s.k}</span><b>${s.t}</b><span>${s.d}</span><a href="${catHref(root, s.to)}">View ${s.t.toLowerCase()} ${arrow}</a></li>`
  ).join('');
  const body = `
<section class="phero light"><div class="wrap phero__grid">
  <div>
    <p class="label"><span class="dot"></span>Services</p>
    <h1 class="display-md">Lifecycle<br>engineering support.</h1>
    <p class="lead">Beyond supply, Vectron serves as a dedicated technical advisor who supports the entire lifecycle of your machinery.</p>
  </div>
  <figure class="diagram reveal">${fig(root, DIAGRAMS.motorCut, 'Cross-section study of an induction motor')}<figcaption><span class="label">Serviced by Vectron</span>Motors, gearboxes, VFDs and pumps.</figcaption></figure>
</div></section>
<section class="sec light"><div class="wrap svc__grid">
  <div>${sectionHead({ label: 'Servicing', title: 'We service what we supply.', lead: 'Vectron services the motor, gear, VFD and pump brands shown in our brochure.' })}</div>
  <ul class="svc">${lines}</ul>
</div></section>
<section class="sec dark"><div class="wrap">
  ${sectionHead({ label: 'The 3S of Vectron', title: 'Solution. Sourcing. Service.', lead: 'A comprehensive platform of procured products and services to meet the diverse needs of your business, and to customise a solution to suit your specific requirements.' })}
  <ol class="s3 reveal">${PILLARS.map((p) => `<li><span class="dot"></span><b>${p.t}</b><span>${p.d}</span></li>`).join('')}</ol>
</div></section>
<section class="sec light"><div class="wrap">
  ${sectionHead({ label: 'Capability building', title: 'Growing technical skill, on both sides.', lead: 'Empowered Growth: investing in continuous technical capability building for our engineering teams and customer technicians alike.' })}
</div></section>
${enquiryCta({ root, topic: 'servicing', heading: 'Need a motor, drive or gearbox serviced?', sub: 'Tell us the brand and the issue. We will take it from there.' })}`;
  return page({
    title: 'Services | Servicing & Lifecycle Engineering Support',
    description: 'Vectron services the motor, gearbox, VFD and pump brands it deals with, and supports machinery across its lifecycle with technical advice.',
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
  <p class="lead">A brand committed to continuous innovation and heavy-duty reliability, turning complex mechanical challenges into smooth, uninterrupted motion.</p>
</div></section>
<section class="sec light"><div class="wrap two">
  <div><p class="label"><span class="dot"></span>Who we are</p><p class="statement statement--sm reveal">Vectron bridges state-of-the-art torque control with rugged outer durability.</p></div>
  <div><p class="label"><span class="dot"></span>What we do</p><p class="reveal lead">From individual machine automation to plant-wide drive systems, Vectron empowers industries to operate with higher efficiency, reduced energy consumption, and zero unnecessary downtime.</p>
  <ul class="threeS reveal">${PILLARS.map((p) => `<li><b>${p.t}</b><span>${p.d}</span></li>`).join('')}</ul></div>
</div></section>
<section class="sec light"><div class="wrap">
  ${sectionHead({ label: 'Business background', title: 'Three starting points.' })}
  <div class="bg3 reveal">
    <div><span class="bg3__n">01</span><b>Variable Frequency Drive</b><p>A compact and competitive solution for applications with basic needs.</p>${fig(root, DIAGRAMS.drive, 'Drive line schematic')}</div>
    <div><span class="bg3__n">02</span><b>Motor & Gearbox</b><p>A wide range for all your industrial application needs.</p>${fig(root, DIAGRAMS.gears, 'Meshing gear pair schematic')}</div>
    <div><span class="bg3__n">03</span><b>Geared Motor</b><p>Find your perfect industrial gear-motor.</p>${fig(root, DIAGRAMS.gearbox, 'Exploded gearbox schematic')}</div>
  </div>
</div></section>
<section class="sec light"><div class="wrap two">
  <div><p class="label"><span class="dot"></span>Mission</p><p class="mv__t mv__t--ink reveal">${MISSION}</p></div>
  <div><p class="label"><span class="dot"></span>Vision</p><p class="mv__t mv__t--ink mv__t--dim reveal">${VISION}</p></div>
</div></section>
<section class="sec dark"><div class="wrap">
  ${sectionHead({ label: 'Our guiding commitments', title: 'Four values we work by.' })}
  <ol class="vals">${VALUES.map((v, i) => `<li class="reveal"><span class="vals__n">0${i + 1}</span><h3>${v.t}</h3><p>${v.d}</p></li>`).join('')}</ol>
</div></section>
<section class="sec light"><div class="wrap two two--center">
  <div class="plinth reveal logo-plinth"><img src="${root}${ASSETS.logo}" alt="${ASSETS.logoAlt}" width="${ASSETS.logoW}" height="${ASSETS.logoH}" loading="lazy"></div>
  <div><p class="label"><span class="dot"></span>Head office</p><p class="lead reveal">${SITE.address.join('<br>')}</p><p class="lead reveal"><a href="tel:${SITE.phoneRaw}">${SITE.phone}</a><br><a href="mailto:${SITE.email}">${SITE.email}</a></p></div>
</div></section>
${enquiryCta({ root, topic: 'Vectron' })}`;
  return page({
    title: 'About Vectron | Who We Are, Mission, Vision & Values',
    description: 'Vectron turns complex mechanical challenges into smooth, uninterrupted motion. Our mission, vision and four guiding commitments.',
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
  <h1 class="display-md">Talk to<br>Vectron.</h1>
  <p class="lead">Call, WhatsApp, email or send an enquiry below. Tell us the product or requirement and we will get back to you.</p>
</div></section>
<section class="sec light"><div class="wrap howto">
  <ol class="hows">
    <li class="reveal"><span>01</span><b>Describe the need</b><p>Product, application or machine issue.</p></li>
    <li class="reveal"><span>02</span><b>Get a recommendation</b><p>We match the right motor, drive, gearbox or pump.</p></li>
    <li class="reveal"><span>03</span><b>Supply & support</b><p>Delivery with technical follow-up and servicing.</p></li>
  </ol>
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
  </form>
</div></section>`;
  return page({
    title: 'Contact Vectron | Enquiries, Phone, WhatsApp & Email',
    description: 'Contact Vectron in Chennai: phone +91 98847 71672, email vectronmotors@gmail.com or WhatsApp. Send an enquiry about motors, VFDs, gearboxes or pumps.',
    path: 'contact/', root, current: 'contact/', body,
  });
}

export function notFound() {
  const root = '';
  return page({
    title: 'Page not found | Vectron',
    description: 'This page could not be found.',
    path: '404.html', root, current: '',
    body: `<section class="phero light"><div class="wrap"><p class="label"><span class="dot"></span>404</p><h1 class="display-md">Off the<br>shaft.</h1><p class="lead">That page does not exist. Head back to the start.</p><a class="btn btn--accent btn--lg" href="/">Home</a></div></section>`,
  }).replace('href="/"', 'href="index.html"');
}