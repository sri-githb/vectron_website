# Vectron website

Zero-dependency static site (Node 18+ only to build). Source is componentised in `src/`; output is plain HTML/CSS/JS in `dist/`.

    npm run build           # or: node build.mjs (regenerates dist/)
    npm start               # or: node serve.mjs (serves dist/ locally on port 3000)
    npm run dev             # or: node serve.mjs --watch (auto-rebuilds and serves)

## Where things live
- `src/data.mjs`    all content + `SITE`, `BRAND` (logo-sampled palette), `ASSETS` (logo, favicon, og), `DIAGRAMS` (technical SVGs). Edit here, rebuild.
- `src/layout.mjs`  head/SEO, white header + mega menu, mobile menu, footer, WhatsApp button, enquiry CTA
- `src/pages.mjs`   every page template
- `src/static/styles.css`  design system (all tokens at the top mirror `BRAND`)
- `src/static/main.js`  interactions
- `src/static/assembly.js`  homepage scroll-driven geared-motor study — kinetic technical art (Canvas 2D): gradient-lit parts, halo glow, particle field, orbit rings, assembly light sweep, idle gear motion
- `assets/img/`     product photos, enhanced in place to ~1400px (upscale + denoise + sharpen + colour grade). Products on clean light backgrounds also get `<name>-cutout.png` transparent versions used across the site for a clean studio look
- `assets/img/vectron-logo.png`  brand logo (420×235). Used by the header, footer and About page. Path + dimensions are set in `ASSETS` — swap the artwork or update the paths there.
- `assets/img/brands/`  manufacturer logos used on the Brands page (shown greyscale, brand colour on hover/focus). Each brand's file is mapped in `BRANDS[].logo` in `src/data.mjs`; drop in a replacement with the same filename to update one.
- `src/static/favicon.ico` (16/32/48) · `favicon.png` (512) · `apple-touch-icon.png` (180)  favicons, generated from the brand emblem in `assets/img/vectron-logo.png`. Copied to `dist/assets/` on build; `favicon.ico` is also copied to the site root.
- `scripts/make-diagrams.py`  regenerates the technical line-art SVGs in `assets/img/` (illustrative schematics only)
- `scripts/enhance-images.py`  regenerates the enhanced photos + cutout PNGs in `assets/img/` (Python 3 + Pillow; rerun after dropping new source photos into `assets/img/`)

## Open items (TODO)
1. Source photos are ~235–730px brochure crops. They are enhanced programmatically (upscale to ~1400px, denoise, sharpen, colour grade) and background-cut where the shot allows — drop true high-resolution photos into `assets/img/`, rerun `scripts/enhance-images.py`, and rebuild for maximum fidelity.
2. WhatsApp number confirmed as +91 98847 71672 (same as voice) — set in `src/data.mjs` -> SITE.whatsapp.
3. Set `SITE.siteUrl` to the live domain to enable canonical URLs, og:url and sitemap.xml.
4. Confirm tagline: cover says "Precision Engineering Products"; business card says "Powering Industrial Partnerships".
5. A transparent-background logo would let the header drop its white tile and give social/OG a cleaner image. For now the brochure logo (420×235, white background) is used everywhere via `ASSETS.logo`.
6. APP pump model list is cut off in the brochure after "APP 16-22"; the page asks visitors to contact Vectron for the rest.
7. Not included (unconfirmed): Danfoss DrivePro certificate / "Lord of the Drives 2022" photos, Hindustan's 50th-anniversary badge.
8. Enquiry form opens a pre-filled message in the visitor's own mail app (default) or WhatsApp, with nothing sent to a server — the visitor reviews and sends it themselves. The "Email" CTAs do the same. Add a form endpoint if you want submissions stored server-side.
9. Fonts load from Google Fonts (Manrope). Self-host them for offline use / best privacy and speed.
10. Brand logos on the Brands page are third-party trademarks, gathered from the manufacturers' own sites and Wikimedia Commons (the page carries an "owned by their respective owners" note). Replace any file in `assets/img/brands/` with the manufacturer's official artwork if you have it — filenames are mapped in `BRANDS[].logo`.
