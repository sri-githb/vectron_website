// Single source of content. Everything here is drawn from the Vectron brochure
// (or the business card). Nothing is invented; unknowns are marked TODO.

export const SITE = {
  name: 'Vectron',
  tagline: 'Precision Engineering Products', // brochure cover. Business card says "Powering Industrial Partnerships" (confirm).
  phone: '+91 98847 71672',
  phoneRaw: '+919884771672',
  whatsapp: '919884771672', // +91 98847 71672 (confirmed) — same number as voice
  email: 'vectronmotors@gmail.com',
  address: ['No. 1/169A, Sri Krishna Garden', 'Tharapakkam, Chennai – 600128'],
  addressLine: 'No. 1/169A, Sri Krishna Garden, Tharapakkam, Chennai – 600128',
  siteUrl: 'https://www.vectron.co.in', // live domain: drives canonical, og:url, hreflang, sitemap.xml and structured data
  googleVerification: '', // paste the token from Google Search Console (HTML tag method), if you use it
  bingVerification: '',   // paste the token from Bing Webmaster Tools, if you use it
};

/* Central brand-asset paths — replace files in place; keep these filenames.
   To swap the logo later, only replace assets/img/vectron-logo.png (same file
   name) or update the paths here. Dimensions below keep the <img> reserved
   size honest so the header never distorts or shifts. */
export const ASSETS = {
  logo: 'assets/img/vectron-logo.png',
  logoAlt: 'Vectron — Precision Engineering Products',
  logoW: 420, // intrinsic px of vectron-logo.png (do not shrink the artwork)
  logoH: 235,
  favicon: 'assets/favicon.png',           // 512x512, transparent
  faviconIco: 'assets/favicon.ico',        // 16/32/48 multi-size
  appleTouch: 'assets/apple-touch-icon.png', // 180x180, opaque
  og: 'assets/img/og.jpg',
};

/* Brand tokens — single source of truth for the palette. Sampled from the
   logo artwork (light background, deep indigo wordmark, blue + orange marks)
   so every surface, type colour and accent complements the logo. */
export const BRAND = {
  ink: '#17181f',      // deep charcoal
  ink2: '#101117',     // deeper charcoal (dark sections)
  paper: '#f6f4ef',    // warm off-white
  white: '#ffffff',
  blue: '#2aa0dd',     // logo blue
  blueDeep: '#1773a8', // pressed / on-light accent
  purple: '#54406b',   // restrained purple detail
  orange: '#e85020',   // logo orange, used sparingly
  font: "'Manrope',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif",
};

export const wa = (text) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

/* Opens the visitor's own device mail app, pre-addressed and pre-filled, so
   they can review the message and send it themselves. Nothing is sent here. */
export const mail = (subject = 'Enquiry from website', body = '') =>
  `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`;

/* Technical line-art diagrams (SVG) owned by this project — illustrative
   schematics, not product photographs and not specifications. */
export const DIAGRAMS = {
  drive: 'assets/img/drive-line.svg',         // VFD → motor → gearbox → load
  motorCut: 'assets/img/motor-cutaway.svg',   // induction motor section study
  gears: 'assets/img/geartrain.svg',          // meshing helical gear pair
  gearbox: 'assets/img/gearbox-exploded.svg', // single-stage gearbox, exploded
  ro: 'assets/img/ro-train.svg',              // RO train with APP pump + iSave
};

/* The 3P's of Vectron — Three Pillars (approved wording). The short lines under each
   pillar are drawn only from the approved positioning and product list. */
export const PILLARS_TITLE = "3P\u2019s of Vectron";
export const PILLARS_SUB = 'Three Pillars of Vectron';
export const PILLARS_INTRO = 'Integrating a world-class product portfolio, precision engineering expertise, and a robust partner network into a collaborative ecosystem designed to optimize energy efficiency, accelerate industrial growth, and long-term operational success.';
export const PILLARS = [
  { t: 'Product Portfolio', d: 'Motors, variable frequency drives, gearboxes and high-pressure pumps.', icon: 'portfolio' },
  { t: 'Precision Engineering', d: 'Electro-mechanical solutions with lifecycle engineering support.', icon: 'precision' },
  { t: 'Partner Network', d: 'The manufacturer brands Vectron deals with and services.', icon: 'network' },
];

/* What Vectron services (as stated in the brochure). */
export const SERVICE_LINES = [
  { t: 'Motors', d: 'Servicing for the motor brands Vectron deals with.', to: 'motors', link: 'motors' },
  { t: 'Gearboxes', d: 'Servicing for the gear and gearbox brands Vectron deals with.', to: 'gearboxes', link: 'gearboxes' },
  { t: 'Variable Frequency Drive', d: 'Servicing for the drives Vectron deals with.', to: 'vfds', link: 'variable frequency drives' },
  { t: 'High-pressure pumps', d: 'Servicing for the pump brand Vectron deals with.', to: 'pumps', link: 'high-pressure pumps' },
];

export const CATEGORIES = [
  {
    slug: 'motors',
    name: 'Motors',
    short: 'Motors',
    blurb: 'IE2, IE3 and IE4 efficiency classes, plus crane duty, smoke venting and brake motors.',
    types: ['IE2 · IE3 · IE4', 'Crane duty', 'Smoke venting', 'Brake'],
    img: 'motor-abb-std-cutout.png',
    imgAlt: 'Blue industrial induction motor shown from the shaft end',
    brands: ['ABB', 'CG', 'Innomotics', 'Hindustan Electric Motors', 'WEG', 'Havells', 'Bonfiglioli'],
  },
  {
    slug: 'vfds',
    name: 'Variable Frequency Drive',
    short: 'VFD',
    blurb: 'Danfoss VLT, iC and VACON drives, soft starters and harmonic filters for applications from basic to automated.',
    types: ['iC2 · iC7', 'VLT HVAC · AQUA', 'Automation', 'Soft starters', 'VACON'],
    img: 'vfd-danfoss.jpg',
    imgAlt: 'Range of Danfoss variable frequency drives',
    brands: ['Danfoss'],
  },
  {
    slug: 'gearboxes',
    name: 'Gearbox & Geared Motor',
    short: 'Gearboxes',
    blurb: 'Helical bevel, in-line, parallel shaft, worm and planetary units, from compact gearmotors to heavy-duty gear units.',
    types: ['Helical bevel', 'In-line', 'Worm', 'Planetary', 'Shaft mounted'],
    img: 'gearboxes-bonfiglioli-cutout.png',
    imgAlt: 'Assortment of industrial gearboxes and geared motors',
    brands: ['Bonfiglioli', 'Top Gear Transmission', 'Bauer Gear Motor'],
  },
  {
    slug: 'pumps',
    name: 'High-pressure Pumps and Related Solutions',
    short: 'Pumps',
    blurb: 'Reverse osmosis and tap water pumps, ZLD and MLD solutions, Danfoss APP pumps and iSave energy recovery solutions.',
    types: ['Reverse Osmosis Pumps', 'Tap Water Pumps', 'ZLD · MLD', 'APP Pumps', 'iSave'],
    img: 'pumps-danfoss-app.jpg',
    imgAlt: 'Stainless steel Danfoss APP high-pressure pumps',
    brands: ['Danfoss'],
  },
];

/* Manufacturer logos live in assets/img/brands/ and are the property of their
   respective owners (see the footer note). Each is shown in greyscale and
   reveals its brand colour on hover/focus. If a file is ever missing the page
   falls back to the brand name as a wordmark, so the wall never breaks. */
export const BRAND_LOGO_DIR = 'assets/img/brands/';

export const BRANDS = [
  { name: 'Danfoss', logo: 'danfoss.svg', cats: ['vfds', 'pumps'] },
  { name: 'Innomotics / Siemens', logo: 'innomotics.svg', cats: ['motors'] },
  { name: 'Bonfiglioli', logo: 'bonfiglioli.png', cats: ['gearboxes', 'motors'] },
  { name: 'CG', logo: 'cg.svg', cats: ['motors'] },
  { name: 'Havells', logo: 'havells.svg', cats: ['motors'] },
  { name: 'Hindustan Electric Motors', logo: 'hem.png', cats: ['motors'] },
  { name: 'ABB', logo: 'abb.svg', cats: ['motors'] },
  { name: 'Top Gear Transmission', logo: 'topgear.png', cats: ['gearboxes'] },
  { name: 'Bauer Gear Motor', logo: 'bauer.png', cats: ['gearboxes'] },
  { name: 'WEG', logo: 'weg.svg', cats: ['motors'] },
];

// ---------------- Motors ----------------
export const MOTOR_FAMILIES = [
  { name: 'Standard efficiency classes', meta: 'IE2 · IE3 · IE4', text: 'General-performance induction motors in IE2, IE3 and IE4 efficiency classes. They optimise energy consumption while reducing vibration and noise.', brands: 'ABB, CG, Innomotics, Hindustan' },
  { name: 'Flameproof', meta: 'IE2 · IE3', text: 'Flameproof motors in IE2 and IE3, including TEFC flameproof. CG lists a flameproof range with ATEX certification.', brands: 'ABB, CG, Hindustan' },
  { name: 'Crane duty', meta: 'Incl. slip-ring', text: 'Crane duty motors, including slip-ring crane duty motors.', brands: 'ABB, CG, WEG' },
  { name: 'Brake motors', meta: 'Integrated brake', text: 'Brake motors for applications that need controlled stopping. Innomotics lists the 1LE7 brake motor in 71–225 frame (IE2).', brands: 'ABB, CG, Innomotics, Hindustan' },
  { name: 'Smoke venting', meta: 'Smoke extraction', text: 'Smoke venting and smoke extraction motors.', brands: 'ABB, CG' },
  { name: 'Cooling tower & dual speed', meta: 'Hindustan range', text: 'Cooling tower motors and dual speed motors from Hindustan Electric Motors.', brands: 'Hindustan' },
  { name: 'Slip ring, aluminium & fan cooled', meta: 'Specialist', text: 'Slip-ring motors and the IE2 aluminium series from CG. Innomotics 1PQ8 series (separately fan cooled).', brands: 'CG, Innomotics' },
  { name: 'Industrial fans', meta: 'Fans', text: 'Industrial fans appear in the CG and WEG ranges.', brands: 'CG, WEG' },
];

export const MOTOR_BRAND_RANGES = [
  { brand: 'ABB', items: ['Standards IE2, IE3', 'Standards IE4', 'Flameproof IE2 & IE3', 'Crane duty', 'Smoke venting motors', 'Brake motors'] },
  { brand: 'Innomotics', note: 'Siemens LV motors are now Innomotics', items: ['1LE7 Global Series, 71–315 frame (IE2 & IE3)', '1LE7 Brake Motor, 71–225 frame (IE2)', '1LE7 IE4 Motor', '1PQ8 Series, separately fan cooled', '1LA8 N compact motors, 355–500 frame (IE3)'] },
  { brand: 'CG', items: ['IE4, IE3 & IE2 motors', 'IE2, IE3 flameproof motors', 'Crane duty & slip-ring crane duty', 'Smoke extraction motors', 'Industrial fans', 'Flameproof motors with ATEX certification', 'Brake motors', 'IE2 aluminium series'] },
  { brand: 'Hindustan Electric Motors', items: ['IE2 & IE3 motors', 'IE2 & IE3 TEFC flameproof motors', 'Cooling tower motors', 'Brake motors', 'Dual speed motors'] },
  { brand: 'WEG · Havells · Bonfiglioli', items: ['WEG India: motors, crane duty motors, industrial fan', 'Havells: motors', 'Bonfiglioli: motors'] },
];

// ---------------- VFDs ----------------
export const VFD_FAMILIES = [
  { family: 'Micro & compact', purpose: 'Compact, competitive drives for applications with basic needs.', range: ['iC2-Micro Frequency Converter', 'VLT Micro Drive FC 051', 'VLT Midi Drive FC 280'] },
  { family: 'Automation', purpose: 'Application-optimised drives for automated machines and processes.', range: ['iC7-Automation Drive', 'VLT Automation Drive FC 360, FC 361', 'VLT Automation Drive FC 301, FC 302'] },
  { family: 'HVAC & refrigeration', purpose: 'Drives named and optimised for building climate and cooling systems.', range: ['VLT HVAC Drive FC 101, FC 102', 'VLT Refrigeration Drive FC 103'] },
  { family: 'Water', purpose: 'A drive built for water applications.', range: ['VLT AQUA Drive FC 202'] },
  { family: 'Starting & power quality', purpose: 'Controlled motor starting and harmonic filtering.', range: ['VLT Soft Starters', 'AHF Harmonic Filter'] },
  { family: 'VACON & geared drives', purpose: 'The VACON family and the drive designed for geared systems.', range: ['VACON 20, 100, NXP, NXS', 'VLT One Gear Drive'] },
];

// ---------------- Gearboxes ----------------
export const GEAR_FAMILIES = [
  'Helical Bevel Gearboxes',
  'In-line Gearboxes',
  'Parallel Shaft Gearboxes',
  'Worm Gearboxes',
  'Enhanced Protection Worm Gearboxes',
  'Planetary Gearboxes',
  'Combined Planetary / Helical Heavy-duty Gearboxes',
  'TA Series Shaft Mounted Helical Gearboxes',
];

// ---------------- Pumps ----------------
export const PUMP = {
  app: ['APP 0.6–1.0', 'APP 1.5–3.5', 'APP (W) 5.1–10.2', 'APP 16–22'], // brochure list is cropped after these; confirm full range
  isave: ['iSave 21 Plus', 'iSave 40', 'iSave 50', 'iSave 70'],
  solutions: ['Reverse Osmosis Pumps', 'Tap Water Pumps', 'ZLD Solutions', 'MLD Solutions'],
};

export const VALUES = [
  { t: 'Resource Optimization', d: 'Driving industrial energy efficiency through modern VFDs, smart motors, and high-efficiency drives.' },
  { t: 'Operational Integrity', d: 'Guaranteeing standard-setting quality, genuine components, and transparent business ethics.' },
  { t: 'Empowered Growth', d: 'Investing in continuous technical capability building for our engineering teams and customer technicians alike.' },
  { t: 'Enduring Partnership', d: 'Beyond supply, serving as dedicated technical advisors who support the entire lifecycle of your machinery.' },
];

export const MISSION = 'To engineer progress by delivering dependable drive, automation, and power solutions that lower energy consumption, maximize uptime, and foster long-term prosperity for our customers, team, and communities.';
export const VISION = 'To build an industrial ecosystem where power, efficiency, and sustainability converge\u2014driving progress for the industries that build our world.';

export const WHO_WE_ARE = 'As a brand committed to continuous innovation and heavy-duty reliability, Vectron turns complex mechanical challenges into smooth, uninterrupted motion.';
export const WHAT_WE_DO = 'We bridge state-of-the-art torque control with rugged outer durability. From individual machine automation to plant-wide drive systems, Vectron empowers industries to operate with higher efficiency, reduced energy consumption, and zero unnecessary downtime.';

export const FLOW = [
  { k: 'Power', t: 'Motors', to: 'motors' },
  { k: 'Torque', t: 'Gearbox & Geared Motor', to: 'gearboxes' },
  { k: 'Control', t: 'Variable Frequency Drive', to: 'vfds' },
];

export const NAV = [
  { href: 'products/', label: 'Products', mega: true },
  { href: 'brands/', label: 'Brands' },
  { href: 'services/', label: 'Services' },
  { href: 'about/', label: 'About' },
];


/* =====================================================================
   SEO — search-term library
   Grouped so each page can use the terms that match what it actually shows.
   Rules followed: only products, brands and facts that already appear on the
   site; no "authorised dealer / distributor" wording; no prices, ratings,
   certifications or guarantees. Brand names are used descriptively
   (the site states it deals with and services these brands).
   ===================================================================== */
export const KEYWORD_GROUPS = {
  'Company & location': [
    'Vectron', 'Vectron Chennai', 'Vectron motors', 'Vectron Precision Engineering Products', 'vectron.co.in',
    'Chennai', 'Tamil Nadu', 'India', 'Tharapakkam', 'Tharapakkam Chennai', 'Chennai 600128',
    'industrial supplier Chennai', 'industrial products Chennai', 'engineering products Chennai',
    'motors in Chennai', 'drives in Chennai', 'gearboxes in Chennai', 'pumps in Chennai',
  ],
  'Motors': [
    'motors', 'industrial motors', 'electric motors', 'electric motor', 'AC motor', 'AC motors', 'induction motor',
    'induction motors', 'three phase motor', '3 phase induction motor', 'squirrel cage motor', 'TEFC motor',
    'industrial electric motors', 'industrial motors Chennai', 'electric motors Chennai', 'electric motor Chennai',
    'motor supplier Chennai', 'motors Tamil Nadu', 'industrial electric motors India', 'motor enquiry', 'motor quotation',
    'IE2 motor', 'IE3 motor', 'IE4 motor', 'IE2 IE3 IE4 motors', 'energy efficient motors', 'high efficiency motors',
    'premium efficiency motor', 'energy saving motors', 'crane duty motor', 'slip ring motor', 'slip-ring crane duty motor',
    'brake motor', 'brake motors', 'electromagnetic brake motor', 'integrated brake motor', 'smoke venting motor',
    'smoke extraction motor', 'flameproof motor', 'TEFC flameproof motor', 'ATEX motor', 'explosion proof motor',
    'cooling tower motor', 'dual speed motor', 'IE2 aluminium motor', 'fan cooled motor', 'separately fan cooled motor',
    'industrial fans', 'motor servicing', 'motor service Chennai', 'motor repair Chennai', 'motor maintenance',
  ],
  'Motor brands': [
    'ABB motors', 'ABB motor Chennai', 'ABB IE4 motors', 'ABB crane duty motors', 'ABB flameproof motors',
    'CG motors', 'CG Power motors', 'Siemens motors', 'Siemens LV motors', 'Innomotics motors', '1LE7 motor',
    '1PQ8 motor', 'Hindustan Electric Motors', 'HEM motors', 'WEG motors', 'WEG India motors', 'Havells motors',
    'Bonfiglioli motors',
  ],
  'Variable frequency drives': [
    'VFD', 'VFD Chennai', 'variable frequency drive', 'variable frequency drives', 'AC drive', 'AC drives',
    'frequency converter', 'frequency inverter', 'inverter drive', 'variable speed drive', 'VSD drive',
    'motor speed control', 'motor speed controller', 'energy saving drive', 'HVAC drive', 'pump drive',
    'Danfoss VFD', 'Danfoss drives', 'Danfoss VFD Chennai', 'Danfoss VLT', 'VLT drives', 'Danfoss iC2', 'Danfoss iC7',
    'iC2-Micro frequency converter', 'iC7-Automation drive', 'VLT Micro Drive FC 051', 'VLT Midi Drive FC 280',
    'VLT HVAC Drive FC 102', 'VLT AQUA Drive FC 202', 'VLT Automation Drive FC 302', 'VLT Refrigeration Drive FC 103',
    'VLT One Gear Drive', 'VACON drives', 'VACON 20', 'VACON 100', 'VACON NXP', 'VACON NXS',
    'soft starter', 'soft starters', 'VLT soft starter', 'harmonic filter', 'AHF harmonic filter',
  ],
  'Gearboxes & geared motors': [
    'gearbox', 'gearboxes', 'gear box', 'industrial gearbox', 'gearbox Chennai', 'geared motor', 'geared motors',
    'geared motor Chennai', 'gear motor', 'gearmotor', 'gear reducer', 'speed reducer', 'gear unit',
    'helical gearbox', 'helical bevel gearbox', 'helical bevel geared motor', 'in-line gearbox', 'inline helical gearbox',
    'parallel shaft gearbox', 'worm gearbox', 'worm gear motor', 'worm reduction gearbox', 'enhanced protection worm gearbox',
    'planetary gearbox', 'planetary gear unit', 'heavy duty gearbox', 'combined planetary helical gearbox',
    'shaft mounted gearbox', 'shaft mounted helical gearbox', 'TA series gearbox', 'Bonfiglioli gearbox',
    'Top Gear Transmission', 'Top Gear gearbox', 'Bauer Gear Motor', 'Bauer geared motor', 'gearbox servicing',
    'geared motor service',
  ],
  'High-pressure pumps & water': [
    'high pressure pump', 'high-pressure pumps', 'high pressure pumps Chennai', 'RO pump', 'reverse osmosis pump',
    'reverse osmosis high pressure pump', 'seawater RO pump', 'desalination pump', 'RO plant pump', 'water treatment pump',
    'tap water pump', 'Danfoss pumps', 'Danfoss APP pump', 'APP pumps', 'APP 0.6-1.0', 'APP 1.5-3.5', 'APP 5.1-10.2',
    'APP 16-22', 'iSave energy recovery', 'iSave 21 Plus', 'iSave 40', 'iSave 50', 'iSave 70', 'energy recovery device',
    'ZLD solutions', 'zero liquid discharge', 'MLD solutions', 'pump servicing',
  ],
  'Brands': [
    'Danfoss', 'ABB', 'Innomotics', 'Siemens', 'Bonfiglioli', 'CG', 'Havells', 'Hindustan', 'WEG', 'Top Gear', 'Bauer',
  ],
  'Services & positioning': [
    'lifecycle engineering support', 'lifecycle support', 'electro-mechanical solutions', 'precision engineering products',
    'industrial automation', 'drive solutions', 'power transmission', 'energy efficiency', 'industrial energy efficiency',
    'reduced energy consumption', 'maximize uptime', 'industrial servicing', 'technical advisors', 'plant drive systems',
    'machine automation', 'torque control', 'industrial drives', 'industrial equipment supplier',
    'industrial products supplier', 'servicing of motor brands',
  ],
  'Everyday search words': [
    'motor', 'pump', 'gear', 'drive', 'speed control', 'power', 'energy', 'industrial', 'industry', 'factory', 'plant',
    'machine', 'machinery', 'automation', 'engineering', 'electrical', 'mechanical', 'electric', 'three phase',
    'supplier', 'suppliers', 'quotation', 'enquiry', 'contact', 'service', 'servicing', 'maintenance', 'brands',
    'products', 'catalogue', 'near me', 'motor supplier near me', 'VFD near me', 'gearbox near me', 'pump near me',
    'where to buy motors', 'where to buy VFD', 'motor and gearbox supplier', 'motor drive and gearbox',
    'water treatment', 'HVAC', 'refrigeration', 'cooling tower', 'crane',
  ],
};
const uniq = (a) => [...new Set(a)];
export const ALL_KEYWORDS = uniq(Object.values(KEYWORD_GROUPS).flat());

const G = KEYWORD_GROUPS;
const pick = (...names) => uniq(names.flatMap((n) => G[n]));
/* meta keywords per page (Google ignores this tag; kept for other engines and for the record) */
export const PAGE_KEYWORDS = {
  '': uniq(['Vectron', 'Vectron Chennai', 'industrial motors Chennai', 'electric motors Chennai', 'VFD Chennai', 'Danfoss VFD',
    'gearbox Chennai', 'geared motor', 'high pressure pumps Chennai', 'RO pump', 'IE2 IE3 IE4 motors', 'brake motors',
    'crane duty motor', 'variable frequency drive', 'soft starter', 'planetary gearbox', 'worm gearbox', 'helical gearbox',
    'iSave energy recovery', 'APP pumps', 'motor servicing', 'lifecycle engineering support', 'electro-mechanical solutions',
    'industrial automation', 'energy efficiency', 'Tamil Nadu', 'Tharapakkam']),
  'products/': uniq([...G['Company & location'].slice(0, 3), 'products', 'catalogue', 'industrial motors', 'IE2 IE3 IE4 motors',
    'variable frequency drive', 'Danfoss VLT', 'VACON drives', 'gearboxes', 'geared motors', 'high-pressure pumps',
    'reverse osmosis pump', 'iSave', 'ZLD solutions', 'MLD solutions', 'motor and gearbox supplier', 'motor drive and gearbox']),
  'products/motors/': uniq([...G['Motors'].slice(0, 45), 'ABB motors', 'CG motors', 'WEG motors', 'Innomotics motors']),
  'products/vfds/': uniq([...G['Variable frequency drives'], 'motor speed control']),
  'products/gearboxes/': uniq([...G['Gearboxes & geared motors']]),
  'products/pumps/': uniq([...G['High-pressure pumps & water']]),
  'brands/': uniq([...G['Brands'], 'ABB motors', 'Danfoss VFD', 'Bonfiglioli gearbox', 'WEG motors', 'CG motors', 'Havells motors',
    'Hindustan Electric Motors', 'Top Gear Transmission', 'Bauer Gear Motor', 'brands', 'Chennai']),
  'services/': uniq(['motor servicing', 'motor service Chennai', 'gearbox servicing', 'geared motor service', 'pump servicing',
    'VFD servicing', 'lifecycle engineering support', 'lifecycle support', 'industrial servicing', 'technical advisors',
    'maintenance', 'servicing of motor brands', 'Chennai', 'Tamil Nadu']),
  'about/': uniq(['Vectron', 'Vectron Chennai', 'Vectron Precision Engineering Products', 'electro-mechanical solutions',
    'lifecycle engineering support', 'energy efficiency', 'industrial automation', 'plant drive systems', 'torque control',
    'Tharapakkam Chennai']),
  'contact/': uniq(['Vectron contact', 'contact Vectron Chennai', 'motor enquiry', 'motor quotation', 'enquiry', 'quotation',
    'Tharapakkam Chennai', 'Chennai 600128', 'motor supplier near me', 'VFD near me', 'gearbox near me']),
};

/* Per-page titles/descriptions for category pages (kept here so the SEO text lives in one place) */
export const CATEGORY_SEO = {
  motors: {
    title: 'Industrial Electric Motors in Chennai: IE2, IE3, IE4 | Vectron',
    description: 'Industrial electric motors in Chennai: IE2, IE3 and IE4 efficiency classes, crane duty, brake, smoke venting and flameproof motors from ABB, CG, WEG and more.',
    lead: 'Industrial electric motors in Chennai from ABB, CG, Innomotics, Hindustan Electric Motors, WEG, Havells and Bonfiglioli, including brake, crane duty and smoke venting motors.',
  },
  vfds: {
    title: 'Danfoss VFD & Variable Frequency Drives, Chennai | Vectron',
    description: 'Danfoss VLT, iC and VACON variable frequency drives for motor speed control, plus soft starters and harmonic filters. Enquire with Vectron, Chennai.',
    lead: 'Variable frequency drives (VFDs) for motor speed control: Danfoss VLT, iC and VACON drives, with soft starters and harmonic filters.',
  },
  gearboxes: {
    title: 'Industrial Gearboxes & Geared Motors in Chennai | Vectron',
    description: 'Helical bevel, in-line, parallel shaft, worm and planetary gearboxes and geared motors from Bonfiglioli, Top Gear Transmission and Bauer Gear Motor, Chennai.',
    lead: 'Industrial gearboxes and geared motors from Bonfiglioli, Top Gear Transmission and Bauer Gear Motor, including helical, worm, planetary and shaft mounted units.',
  },
  pumps: {
    title: 'High-Pressure RO Pumps, Danfoss APP & iSave | Vectron Chennai',
    description: 'High-pressure pumps for reverse osmosis: Danfoss APP pumps, iSave energy recovery, tap water pumps, ZLD and MLD solutions. Vectron, Chennai.',
    lead: 'High-pressure pumps for reverse osmosis, including Danfoss APP pumps and iSave energy recovery, plus tap water pumps, ZLD and MLD solutions.',
  },
};

export const PAGE_SEO = {
  '': {
    title: 'Vectron | Industrial Motors, VFDs, Gearboxes & Pumps in Chennai',
    description: 'Industrial electric motors (IE2, IE3, IE4), Danfoss VFDs, gearboxes, geared motors and high-pressure pumps in Chennai, with servicing and lifecycle support.',
  },
  'products/': {
    title: 'Industrial Motors, VFDs, Gearboxes & Pumps | Vectron Chennai',
    description: 'Vectron product range in Chennai: IE2, IE3, IE4, brake and crane duty motors, Danfoss VFDs, gearboxes and geared motors, RO and APP high-pressure pumps.',
  },
  'brands/': {
    title: 'ABB, Danfoss, WEG, CG & Bonfiglioli Brands | Vectron Chennai',
    description: 'Brands Vectron deals with and services: Danfoss, ABB, Innomotics / Siemens, Bonfiglioli, CG, Havells, Hindustan Electric Motors, WEG, Top Gear and Bauer.',
  },
  'services/': {
    title: 'Motor, Gearbox, VFD & Pump Servicing in Chennai | Vectron',
    description: 'Servicing and lifecycle engineering support for motors, gearboxes, variable frequency drives and pumps from the brands Vectron deals with, in Chennai.',
  },
  'about/': {
    title: 'About Vectron | Precision Engineering Products, Chennai',
    description: 'Vectron, Chennai: precision engineering products, electro-mechanical solutions and lifecycle engineering support. Our mission, vision and values.',
  },
  'contact/': {
    title: 'Contact Vectron Chennai | Phone, WhatsApp & Email Enquiry',
    description: 'Contact Vectron, Tharapakkam, Chennai 600128: call +91 98847 71672, WhatsApp or email vectronmotors@gmail.com for motors, VFDs, gearboxes and pumps.',
  },
};
