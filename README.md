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
- `src/static/assembly.js`  homepage hero — real 3D geared motor in WebGL (zero dependencies): per-part PBR-style shading from the CSS brand tokens, scroll-driven exploded → assembled sequence (staggered per part, camera dollies in), drag / arrow-key orbit, hover part names, double-click reset, adaptive resolution, mobile auto-assemble, reduced-motion and no-WebGL fallbacks
- `src/static/motor-model.js`  the mesh: Rossi MR 2IV geared motor converted from the supplied STEP file (12 solids, ~62k triangles, ~1.5 MB / ~0.6 MB gzipped). Geometry is unchanged; colours are applied at render time (see `P` and `MAT` at the top of `assembly.js` to repaint or retune each part's explode distance / arrival order)
- `src/static/smooth.js`  dependency-free inertial smooth scrolling (wheel, keyboard, in-page anchors). Desktop pointers only; touch, reduced-motion and nested scrollers stay native. Tune `RATE` (higher = snappier)
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
11. Hero 3D model licence: the STEP file is marked CC BY-ND 4.0 (Rossi S.p.A. via 3DfindIT / CADENAS). A credit line is in the footer. Re-colouring and web-converting the model is arguably a derivative, which CC BY-ND does not allow you to publish — get Rossi's written OK, or swap in a model you may use (replace `motor-model.js`, keep the same format). Rossi is not one of the brochure's brands, so the hero is labelled illustrative; avoid implying a Rossi partnership.
12. Content rules applied site-wide: no statistics, percentages or decorative numbering; each category paragraph appears once (Products page); Home shows category names with short chips; Services and Products use text heroes; no "Applications", "Features", "Efficiency Rates", "At a Glance", "Talk to an Engineer" or "Enquire Gearbox" sections. Marathon and Shanthi Gears are removed from the brand list.
13. SEO: live domain is https://www.vectron.co.in (set in `SITE.siteUrl`, `src/data.mjs`). See `SEO-KEYWORDS.md` (auto-generated on every build) for the full keyword list, what was optimised and the Search Console / Google Business Profile steps. Titles, descriptions and keywords live in `PAGE_SEO`, `CATEGORY_SEO`, `PAGE_KEYWORDS` and `KEYWORD_GROUPS` in `src/data.mjs`.
