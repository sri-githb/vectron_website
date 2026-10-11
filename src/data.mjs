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
  siteUrl: '', // TODO: set the live domain (enables canonical, og:url and sitemap.xml)
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

/* The 3S of Vectron (from the brochure) — the compact "what we do" line. */
export const PILLARS = [
  { t: 'Solution', d: 'Customised to your business needs' },
  { t: 'Sourcing', d: 'A variety of procured products' },
  { t: 'Service', d: 'Support across the lifecycle' },
];

/* What Vectron services (as stated in the brochure). */
export const SERVICE_LINES = [
  { k: '01', t: 'Motors', d: 'Servicing of the listed motor brands', to: 'motors' },
  { k: '02', t: 'Gearboxes', d: 'Servicing of the listed gear and gear box brands', to: 'gearboxes' },
  { k: '03', t: 'VFDs', d: 'Servicing of the listed variable frequency drives', to: 'vfds' },
  { k: '04', t: 'High-pressure pumps', d: 'Servicing of the listed pump brand', to: 'pumps' },
];

export const CATEGORIES = [
  {
    slug: 'motors',
    n: '01',
    name: 'Industrial Motors',
    short: 'Motors',
    blurb: 'IE2, IE3 and IE4 efficiency classes, plus crane, flameproof, brake and smoke venting duty.',
    types: ['IE2 · IE3 · IE4', 'Flameproof', 'Crane duty', 'Brake', 'Smoke venting'],
    img: 'motor-abb-std-cutout.png',
    imgAlt: 'Blue industrial induction motor shown from the shaft end',
    brands: ['ABB', 'CG', 'Innomotics', 'Hindustan Electric Motors', 'WEG', 'Marathon', 'Havells', 'Bonfiglioli'],
  },
  {
    slug: 'vfds',
    n: '02',
    name: 'Variable Frequency Drives',
    short: 'VFDs',
    blurb: 'Danfoss VLT, iC and VACON drives, soft starters and harmonic filters for applications from basic to automated.',
    types: ['iC2 · iC7', 'VLT HVAC · AQUA', 'Automation', 'Soft starters', 'VACON'],
    img: 'vfd-danfoss.jpg',
    imgAlt: 'Range of Danfoss variable frequency drives',
    brands: ['Danfoss'],
  },
  {
    slug: 'gearboxes',
    n: '03',
    name: 'Gearboxes & Geared Motors',
    short: 'Gearboxes',
    blurb: 'Helical bevel, in-line, parallel shaft, worm and planetary units, from compact gearmotors to heavy-duty gear units.',
    types: ['Helical bevel', 'In-line', 'Worm', 'Planetary', 'Shaft mounted'],
    img: 'gearboxes-bonfiglioli-cutout.png',
    imgAlt: 'Assortment of industrial gearboxes and geared motors',
    brands: ['Bonfiglioli', 'Shanthi Gears', 'Top Gear Transmission', 'Bauer Gear Motor'],
  },
  {
    slug: 'pumps',
    n: '04',
    name: 'High-Pressure Pumps',
    short: 'Pumps',
    blurb: 'Danfoss APP high-pressure pumps and iSave energy recovery devices for reverse osmosis and water applications.',
    types: ['APP pumps', 'iSave ERD', 'Reverse osmosis', 'ZLD · MLD'],
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
  { name: 'ABB', logo: 'abb.svg', cats: ['motors'] },
  { name: 'CG', logo: 'cg.svg', cats: ['motors'] },
  { name: 'Innomotics', logo: 'innomotics.svg', note: 'Siemens LV motors', cats: ['motors'] },
  { name: 'Hindustan Electric Motors', logo: 'hem.png', cats: ['motors'] },
  { name: 'WEG', logo: 'weg.svg', cats: ['motors'] },
  { name: 'Marathon', logo: 'marathon.svg', cats: ['motors'] },
  { name: 'Havells', logo: 'havells.svg', cats: ['motors'] },
  { name: 'Danfoss', logo: 'danfoss.svg', cats: ['vfds', 'pumps'] },
  { name: 'Bonfiglioli', logo: 'bonfiglioli.png', cats: ['gearboxes', 'motors'] },
  { name: 'Shanthi Gears', logo: 'shanthi.png', cats: ['gearboxes'] },
  { name: 'Top Gear Transmission', logo: 'topgear.png', cats: ['gearboxes'] },
  { name: 'Bauer Gear Motor', logo: 'bauer.png', cats: ['gearboxes'] },
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
  { brand: 'WEG · Marathon · Havells · Bonfiglioli', items: ['WEG India: motors, crane duty motors, industrial fan', 'Marathon Electric: motors', 'Havells: motors', 'Bonfiglioli: motors'] },
];

// ---------------- VFDs ----------------
export const VFD_FAMILIES = [
  { family: 'Micro & compact', purpose: 'Compact, competitive drives for applications with basic needs.', apps: 'Basic machine applications', range: ['iC2-Micro Frequency Converter', 'VLT Micro Drive FC 051', 'VLT Midi Drive FC 280'] },
  { family: 'Automation', purpose: 'Application-optimised drives for automated machines and processes.', apps: 'Machine automation, process control', range: ['iC7-Automation Drive', 'VLT Automation Drive FC 360, FC 361', 'VLT Automation Drive FC 301, FC 302'] },
  { family: 'HVAC & refrigeration', purpose: 'Drives named and optimised for building climate and cooling systems.', apps: 'HVAC, refrigeration', range: ['VLT HVAC Drive FC 101, FC 102', 'VLT Refrigeration Drive FC 103'] },
  { family: 'Water', purpose: 'A drive built for water applications.', apps: 'Water applications', range: ['VLT AQUA Drive FC 202'] },
  { family: 'Starting & power quality', purpose: 'Controlled motor starting and harmonic filtering.', apps: 'Motor starting, harmonic mitigation', range: ['VLT Soft Starters', 'AHF Harmonic Filter'] },
  { family: 'VACON & geared drives', purpose: 'The VACON family and the drive designed for geared systems.', apps: 'Industrial drive systems', range: ['VACON 20, 100, NXP, NXS', 'VLT One Gear Drive'] },
];

// ---------------- Gearboxes ----------------
export const GEAR_BONFIGLIOLI = [
  'Helical Bevel Gearmotors & Units',
  'In-line Gearmotors & Units',
  'Helical Parallel-Shaft Gearmotors & Units',
  'Universal Worm Gearmotors & Units',
  'Enhanced Protection Worm Gearmotors & Units',
  'Industrial Planetary Gearmotors & Units',
  'Combined Planetary/Helical Bevel Heavy Duty Gear Units',
  'Helical Bevel Heavy Duty Gear Units',
  'Helical Parallel Shaft Heavy Duty Gear Units',
];
export const GEAR_SHANTHI = [
  'Worm Gear Boxes', 'Helical Gear Boxes', 'Planetary Gear Boxes', 'Extruder Gear Boxes',
  'Bevel Helical Gear Boxes', 'Cooling Tower Gear Boxes', 'Vertical Roller Mill Gear Boxes',
];

// ---------------- Pumps ----------------
export const PUMP = {
  app: ['APP 0.6–1.0', 'APP 1.5–3.5', 'APP (W) 5.1–10.2', 'APP 16–22'], // brochure list is cropped after these; confirm full range
  isave: ['iSave 21 Plus', 'iSave 40', 'iSave 50', 'iSave 70'],
  apps: ['Reverse Osmosis', 'Tap Water', 'ZLD', 'MLD'],
  features: [
    'Extensive application know-how',
    'Highest efficiency rates in the industry',
    'Compact and small',
    'Long time between service intervals',
    'Easy and service-friendly design',
    'Simple and reliable with high uptime',
  ],
};

// ---------------- Applications (only what the brochure's products name) ----------------
export const APPLICATIONS = [
  { name: 'Cranes & material handling', uses: 'Crane duty motors · slip-ring crane duty motors', cats: ['motors'] },
  { name: 'Cooling towers', uses: 'Cooling tower motors · cooling tower gear boxes', cats: ['motors', 'gearboxes'] },
  { name: 'Hazardous areas', uses: 'Flameproof motors · ATEX-certified flameproof range (CG)', cats: ['motors'] },
  { name: 'Smoke extraction & ventilation', uses: 'Smoke venting motors · industrial fans', cats: ['motors'] },
  { name: 'Extrusion & milling', uses: 'Extruder gear boxes · vertical roller mill gear boxes', cats: ['gearboxes'] },
  { name: 'Power transmission & automation', uses: 'Gearmotors, heavy-duty gear units, shaft mounted gear boxes', cats: ['gearboxes'] },
  { name: 'HVAC & refrigeration', uses: 'VLT HVAC Drive · VLT Refrigeration Drive', cats: ['vfds'] },
  { name: 'Water & reverse osmosis', uses: 'VLT AQUA Drive · APP pumps · iSave energy recovery', cats: ['vfds', 'pumps'] },
];

export const VALUES = [
  { t: 'Resource Optimization', d: 'Driving industrial energy efficiency through modern VFDs, smart motors and high-efficiency drives.' },
  { t: 'Operational Integrity', d: 'Standard-setting quality, genuine components and transparent business ethics.' },
  { t: 'Empowered Growth', d: 'Continuous technical capability building for our engineering teams and customer technicians alike.' },
  { t: 'Enduring Partnership', d: 'Beyond supply: dedicated technical advisors who support the entire lifecycle of your machinery.' },
];

export const MISSION = 'To engineer progress by delivering dependable drive, automation and power solutions that lower energy consumption, maximize uptime, and foster long-term prosperity for our customers, team and communities.';
export const VISION = 'To build an industrial ecosystem where power, efficiency and sustainability converge, driving progress for the industries that build our world.';

export const FLOW = [
  { k: 'Power', t: 'Motors', d: 'Efficiency-class motors, IE2 to IE4, for every duty.', to: 'motors' },
  { k: 'Torque', t: 'Gearboxes', d: 'Gearmotors and gear units that turn speed into usable torque.', to: 'gearboxes' },
  { k: 'Motion', t: 'Drives', d: 'Variable frequency drives that control how machines move.', to: 'vfds' },
  { k: 'Efficiency', t: 'Less energy loss', d: 'Modern VFDs, smart motors and energy recovery for reduced consumption.', to: 'pumps' },
  { k: 'Uptime', t: 'Lifecycle support', d: 'Servicing and technical advice that keep production running.', to: 'services', top: true },
];

export const NAV = [
  { href: 'products/', label: 'Products', mega: true },
  { href: 'brands/', label: 'Brands' },
  { href: 'applications/', label: 'Applications' },
  { href: 'services/', label: 'Services' },
  { href: 'about/', label: 'About' },
];
