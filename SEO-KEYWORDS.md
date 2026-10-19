# Vectron — SEO keywords and setup

Live domain: **https://www.vectron.co.in**

**270 unique search terms** are in the keyword library (`KEYWORD_GROUPS` in `src/data.mjs`). 205 of them are written into page meta tags, and the product, brand and service terms also appear in page titles, descriptions, headings, image alt text and structured data. Run `npm run build` and this file regenerates.

> Honest note: nobody can guarantee a #1 position. Google decides rankings, and a brand-new domain needs weeks to months to be crawled and trusted. This site gives search engines every correct signal; the "Do these next" list below is what moves it up fastest.

## What was done

- Live domain set to https://www.vectron.co.in: canonical URLs, hreflang (en-IN), Open Graph and Twitter tags on every page.
- Unique title (under 64 characters) and description (under 160) per page, written around real searches like "industrial motors Chennai", "Danfoss VFD", "gearbox Chennai", "high-pressure RO pump".
- Structured data (JSON-LD): Organization + LocalBusiness (name, address, phone, email, logo, product catalogue), WebSite, WebPage, BreadcrumbList, product-category ItemLists, Services and Brands lists. This helps Google show a clear brand name, logo and, over time, sitelinks.
- `sitemap.xml` (all pages, with dates) and `robots.txt` pointing to it. The 404 page and the retired /applications stub are `noindex`.
- `vectron.co.in` redirects to `www.vectron.co.in`, plus cache and security headers (`vercel.json`).
- Geo tags for Chennai, Tamil Nadu. Language set to English (India).
- One descriptive keyword line under each product category heading; descriptive alt text on product images and brand logos.
- Search Console and Bing verification slots (`SITE.googleVerification`, `SITE.bingVerification` in `src/data.mjs`).

## Do these next (this is what actually earns the top spots)

1. **Google Search Console** → add `https://www.vectron.co.in` → verify (paste the token into `SITE.googleVerification`, rebuild, deploy) → submit `https://www.vectron.co.in/sitemap.xml`.
2. **Bing Webmaster Tools** → import from Search Console → submit the sitemap.
3. **Google Business Profile** for "Vectron, Tharapakkam, Chennai 600128" with the same phone, address and website. This is the biggest factor for "motors near me" and Chennai searches. Add photos and ask customers for reviews.
4. In Vercel → Domains, add both `vectron.co.in` and `www.vectron.co.in` (www as primary).
5. Get links from relevant places: brand partner pages, industry directories, local business listings. Keep name, address and phone identical everywhere.
6. Publish genuinely useful pages over time (for example "How to choose a VFD for a pump", "IE2 vs IE3 vs IE4 motors"); real content ranks, repeated keywords do not.

## Search terms by page (written into each page's meta keywords)

**Home** — `https://www.vectron.co.in/`  
Vectron, Vectron Chennai, industrial motors Chennai, electric motors Chennai, VFD Chennai, Danfoss VFD, gearbox Chennai, geared motor, high pressure pumps Chennai, RO pump, IE2 IE3 IE4 motors, brake motors, crane duty motor, variable frequency drive, soft starter, planetary gearbox, worm gearbox, helical gearbox, iSave energy recovery, APP pumps, motor servicing, lifecycle engineering support, electro-mechanical solutions, industrial automation, energy efficiency, Tamil Nadu, Tharapakkam

**Products** — `https://www.vectron.co.in/products/`  
Vectron, Vectron Chennai, Vectron motors, products, catalogue, industrial motors, IE2 IE3 IE4 motors, variable frequency drive, Danfoss VLT, VACON drives, gearboxes, geared motors, high-pressure pumps, reverse osmosis pump, iSave, ZLD solutions, MLD solutions, motor and gearbox supplier, motor drive and gearbox

**Motors** — `https://www.vectron.co.in/products/motors/`  
motors, industrial motors, electric motors, electric motor, AC motor, AC motors, induction motor, induction motors, three phase motor, 3 phase induction motor, squirrel cage motor, TEFC motor, industrial electric motors, industrial motors Chennai, electric motors Chennai, electric motor Chennai, motor supplier Chennai, motors Tamil Nadu, industrial electric motors India, motor enquiry, motor quotation, IE2 motor, IE3 motor, IE4 motor, IE2 IE3 IE4 motors, energy efficient motors, high efficiency motors, premium efficiency motor, energy saving motors, crane duty motor, slip ring motor, slip-ring crane duty motor, brake motor, brake motors, electromagnetic brake motor, integrated brake motor, smoke venting motor, smoke extraction motor, flameproof motor, TEFC flameproof motor, ATEX motor, explosion proof motor, cooling tower motor, dual speed motor, IE2 aluminium motor, ABB motors, CG motors, WEG motors, Innomotics motors

**Variable Frequency Drive** — `https://www.vectron.co.in/products/vfds/`  
VFD, VFD Chennai, variable frequency drive, variable frequency drives, AC drive, AC drives, frequency converter, frequency inverter, inverter drive, variable speed drive, VSD drive, motor speed control, motor speed controller, energy saving drive, HVAC drive, pump drive, Danfoss VFD, Danfoss drives, Danfoss VFD Chennai, Danfoss VLT, VLT drives, Danfoss iC2, Danfoss iC7, iC2-Micro frequency converter, iC7-Automation drive, VLT Micro Drive FC 051, VLT Midi Drive FC 280, VLT HVAC Drive FC 102, VLT AQUA Drive FC 202, VLT Automation Drive FC 302, VLT Refrigeration Drive FC 103, VLT One Gear Drive, VACON drives, VACON 20, VACON 100, VACON NXP, VACON NXS, soft starter, soft starters, VLT soft starter, harmonic filter, AHF harmonic filter

**Gearbox & Geared Motor** — `https://www.vectron.co.in/products/gearboxes/`  
gearbox, gearboxes, gear box, industrial gearbox, gearbox Chennai, geared motor, geared motors, geared motor Chennai, gear motor, gearmotor, gear reducer, speed reducer, gear unit, helical gearbox, helical bevel gearbox, helical bevel geared motor, in-line gearbox, inline helical gearbox, parallel shaft gearbox, worm gearbox, worm gear motor, worm reduction gearbox, enhanced protection worm gearbox, planetary gearbox, planetary gear unit, heavy duty gearbox, combined planetary helical gearbox, shaft mounted gearbox, shaft mounted helical gearbox, TA series gearbox, Bonfiglioli gearbox, Top Gear Transmission, Top Gear gearbox, Bauer Gear Motor, Bauer geared motor, gearbox servicing, geared motor service

**High-pressure Pumps** — `https://www.vectron.co.in/products/pumps/`  
high pressure pump, high-pressure pumps, high pressure pumps Chennai, RO pump, reverse osmosis pump, reverse osmosis high pressure pump, seawater RO pump, desalination pump, RO plant pump, water treatment pump, tap water pump, Danfoss pumps, Danfoss APP pump, APP pumps, APP 0.6-1.0, APP 1.5-3.5, APP 5.1-10.2, APP 16-22, iSave energy recovery, iSave 21 Plus, iSave 40, iSave 50, iSave 70, energy recovery device, ZLD solutions, zero liquid discharge, MLD solutions, pump servicing

**Brands** — `https://www.vectron.co.in/brands/`  
Danfoss, ABB, Innomotics, Siemens, Bonfiglioli, CG, Havells, Hindustan, WEG, Top Gear, Bauer, ABB motors, Danfoss VFD, Bonfiglioli gearbox, WEG motors, CG motors, Havells motors, Hindustan Electric Motors, Top Gear Transmission, Bauer Gear Motor, brands, Chennai

**Services** — `https://www.vectron.co.in/services/`  
motor servicing, motor service Chennai, gearbox servicing, geared motor service, pump servicing, VFD servicing, lifecycle engineering support, lifecycle support, industrial servicing, technical advisors, maintenance, servicing of motor brands, Chennai, Tamil Nadu

**About** — `https://www.vectron.co.in/about/`  
Vectron, Vectron Chennai, Vectron Precision Engineering Products, electro-mechanical solutions, lifecycle engineering support, energy efficiency, industrial automation, plant drive systems, torque control, Tharapakkam Chennai

**Contact** — `https://www.vectron.co.in/contact/`  
Vectron contact, contact Vectron Chennai, motor enquiry, motor quotation, enquiry, quotation, Tharapakkam Chennai, Chennai 600128, motor supplier near me, VFD near me, gearbox near me

## Full keyword library by group

### Company & location (18)

Vectron, Vectron Chennai, Vectron motors, Vectron Precision Engineering Products, vectron.co.in, Chennai, Tamil Nadu, India, Tharapakkam, Tharapakkam Chennai, Chennai 600128, industrial supplier Chennai, industrial products Chennai, engineering products Chennai, motors in Chennai, drives in Chennai, gearboxes in Chennai, pumps in Chennai

### Motors (52)

motors, industrial motors, electric motors, electric motor, AC motor, AC motors, induction motor, induction motors, three phase motor, 3 phase induction motor, squirrel cage motor, TEFC motor, industrial electric motors, industrial motors Chennai, electric motors Chennai, electric motor Chennai, motor supplier Chennai, motors Tamil Nadu, industrial electric motors India, motor enquiry, motor quotation, IE2 motor, IE3 motor, IE4 motor, IE2 IE3 IE4 motors, energy efficient motors, high efficiency motors, premium efficiency motor, energy saving motors, crane duty motor, slip ring motor, slip-ring crane duty motor, brake motor, brake motors, electromagnetic brake motor, integrated brake motor, smoke venting motor, smoke extraction motor, flameproof motor, TEFC flameproof motor, ATEX motor, explosion proof motor, cooling tower motor, dual speed motor, IE2 aluminium motor, fan cooled motor, separately fan cooled motor, industrial fans, motor servicing, motor service Chennai, motor repair Chennai, motor maintenance

### Motor brands (18)

ABB motors, ABB motor Chennai, ABB IE4 motors, ABB crane duty motors, ABB flameproof motors, CG motors, CG Power motors, Siemens motors, Siemens LV motors, Innomotics motors, 1LE7 motor, 1PQ8 motor, Hindustan Electric Motors, HEM motors, WEG motors, WEG India motors, Havells motors, Bonfiglioli motors

### Variable frequency drives (42)

VFD, VFD Chennai, variable frequency drive, variable frequency drives, AC drive, AC drives, frequency converter, frequency inverter, inverter drive, variable speed drive, VSD drive, motor speed control, motor speed controller, energy saving drive, HVAC drive, pump drive, Danfoss VFD, Danfoss drives, Danfoss VFD Chennai, Danfoss VLT, VLT drives, Danfoss iC2, Danfoss iC7, iC2-Micro frequency converter, iC7-Automation drive, VLT Micro Drive FC 051, VLT Midi Drive FC 280, VLT HVAC Drive FC 102, VLT AQUA Drive FC 202, VLT Automation Drive FC 302, VLT Refrigeration Drive FC 103, VLT One Gear Drive, VACON drives, VACON 20, VACON 100, VACON NXP, VACON NXS, soft starter, soft starters, VLT soft starter, harmonic filter, AHF harmonic filter

### Gearboxes & geared motors (37)

gearbox, gearboxes, gear box, industrial gearbox, gearbox Chennai, geared motor, geared motors, geared motor Chennai, gear motor, gearmotor, gear reducer, speed reducer, gear unit, helical gearbox, helical bevel gearbox, helical bevel geared motor, in-line gearbox, inline helical gearbox, parallel shaft gearbox, worm gearbox, worm gear motor, worm reduction gearbox, enhanced protection worm gearbox, planetary gearbox, planetary gear unit, heavy duty gearbox, combined planetary helical gearbox, shaft mounted gearbox, shaft mounted helical gearbox, TA series gearbox, Bonfiglioli gearbox, Top Gear Transmission, Top Gear gearbox, Bauer Gear Motor, Bauer geared motor, gearbox servicing, geared motor service

### High-pressure pumps & water (28)

high pressure pump, high-pressure pumps, high pressure pumps Chennai, RO pump, reverse osmosis pump, reverse osmosis high pressure pump, seawater RO pump, desalination pump, RO plant pump, water treatment pump, tap water pump, Danfoss pumps, Danfoss APP pump, APP pumps, APP 0.6-1.0, APP 1.5-3.5, APP 5.1-10.2, APP 16-22, iSave energy recovery, iSave 21 Plus, iSave 40, iSave 50, iSave 70, energy recovery device, ZLD solutions, zero liquid discharge, MLD solutions, pump servicing

### Brands (11)

Danfoss, ABB, Innomotics, Siemens, Bonfiglioli, CG, Havells, Hindustan, WEG, Top Gear, Bauer

### Services & positioning (20)

lifecycle engineering support, lifecycle support, electro-mechanical solutions, precision engineering products, industrial automation, drive solutions, power transmission, energy efficiency, industrial energy efficiency, reduced energy consumption, maximize uptime, industrial servicing, technical advisors, plant drive systems, machine automation, torque control, industrial drives, industrial equipment supplier, industrial products supplier, servicing of motor brands

### Everyday search words (44)

motor, pump, gear, drive, speed control, power, energy, industrial, industry, factory, plant, machine, machinery, automation, engineering, electrical, mechanical, electric, three phase, supplier, suppliers, quotation, enquiry, contact, service, servicing, maintenance, brands, products, catalogue, near me, motor supplier near me, VFD near me, gearbox near me, pump near me, where to buy motors, where to buy VFD, motor and gearbox supplier, motor drive and gearbox, water treatment, HVAC, refrigeration, cooling tower, crane

## Rules followed

- Only products, brands and facts that already exist on the site.
- No "authorised dealer / distributor" wording, no prices, ratings, certifications or guarantees.
- Brand names are used descriptively (the site states Vectron deals with and services these brands).
- Note: Google ignores the meta keywords tag. It is kept for other engines and for reference; the ranking value comes from titles, headings, body text, structured data and links.
