# Vectron website

Zero-dependency static site (Node 18+ only to build). Source is componentised in `src/`; output is plain HTML/CSS/JS in `dist/`.

    node build.mjs          # regenerates dist/
    npx serve dist          # or any static host; upload the contents of dist/

## Where things live
- `src/data.mjs`    all content (categories, families, brands, applications, contact). Edit here, rebuild.
- `src/layout.mjs`  head/SEO, header + mega menu, mobile menu, footer, WhatsApp button, enquiry CTA
- `src/pages.mjs`   every page template
- `src/static/styles.css`  design system (tokens at the top)   `src/static/main.js`  interactions
- `assets/img/`     product images (cropped from the brochure; replace with high-res photos, same filenames)

## Open items (TODO)
1. Replace brochure-cropped images in `assets/img/` with high-resolution photography.
2. Confirm WhatsApp number (currently the phone number) in `src/data.mjs` -> SITE.whatsapp.
3. Set `SITE.siteUrl` to the live domain to enable canonical URLs, og:url and sitemap.xml.
4. Confirm tagline: cover says "Precision Engineering Products"; business card says "Powering Industrial Partnerships".
5. Supply a transparent-background logo; header currently uses a text wordmark. The brochure logo (white background) is used on the About page only.
6. APP pump model list is cut off in the brochure after "APP 16-22"; the page asks visitors to contact Vectron for the rest.
7. Not included (unconfirmed): Danfoss DrivePro certificate / "Lord of the Drives 2022" photos, Hindustan's 50th-anniversary badge.
8. Enquiry form opens a pre-filled WhatsApp or email message (no server). Add a form endpoint if you want submissions stored.
9. Fonts load from Google Fonts (Manrope). Self-host them for offline use / best privacy and speed.
