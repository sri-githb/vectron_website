/* Vectron: small, dependency-free interactions. Everything degrades gracefully without JS. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const WA = '919884771672';
  const MAIL = 'vectronmotors@gmail.com';

  /* header: solid after scroll, hide on scroll-down, progress bar */
  const header = $('[data-header]');
  const bar = $('.progress span');
  let lastY = 0, ticking = false;
  /* cached flow rect — invalidated on resize to avoid layout thrash */
  let flowRect = null;
  let flowRectStale = true;
  addEventListener('resize', () => { flowRectStale = true; }, { passive: true });
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle('is-solid', y > 24);
    header.classList.remove('is-hidden');   // header stays visible at all times
    lastY = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    const wa = $('[data-wa]');
    if (wa) wa.classList.toggle('is-away', y < 280 && !!$('[data-hero-pin], .hero'));
    parallax();
    flowProgress();
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  /* mega menu: hover with intent, click/Enter/Esc for keyboard */
  const item = $('.has-mega');
  if (item) {
    const trig = $('[data-mega-trigger]', item), mega = $('[data-mega]', item);
    let t;
    const open = () => { clearTimeout(t); mega.hidden = false; trig.setAttribute('aria-expanded', 'true'); };
    const close = () => { t = setTimeout(() => { mega.hidden = true; trig.setAttribute('aria-expanded', 'false'); }, 140); };
    item.addEventListener('mouseenter', open);
    item.addEventListener('mouseleave', close);
    item.addEventListener('focusin', open);
    item.addEventListener('focusout', (e) => { if (!item.contains(e.relatedTarget)) close(); });
    trig.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown') { e.preventDefault(); open(); $('.mega__item', mega)?.focus(); } });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !mega.hidden) { mega.hidden = true; trig.setAttribute('aria-expanded', 'false'); trig.focus(); } });
  }

  /* mobile menu */
  const burger = $('[data-burger]'), mm = $('[data-mm]');
  if (burger && mm) {
    const setMenu = (on) => {
      mm.hidden = false;
      burger.setAttribute('aria-expanded', on);
      burger.setAttribute('aria-label', on ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('mm-open', on);
      mm.classList.toggle('is-open', on);
      mm.inert = !on;
      if (on) $('a', mm)?.focus({ preventScroll: true });
    };
    mm.inert = true;
    burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && mm.classList.contains('is-open')) { setMenu(false); burger.focus(); } });
    $$('a', mm).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    matchMedia('(min-width:1000px)').addEventListener('change', (e) => e.matches && setMenu(false));
  }

  /* reveal on scroll */
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    : null;
  $$('.reveal').forEach((el) => (io ? io.observe(el) : el.classList.add('is-in')));

  /* hero entrance */
  const hero = $('[data-hero]');
  if (hero) requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('is-ready')));

  /* hero stage: rotating category index with dot selectors */
  const stage = $('[data-stage]');
  if (stage) {
    const slides = $$('[data-slide]', stage), dots = $$('[data-dot]', stage);
    const link = $('[data-stage-link]', stage);
    const hrefs = ['motors', 'vfds', 'gearboxes', 'pumps'];
    let i = 0, timer;
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
      dots.forEach((d, k) => { d.classList.toggle('is-active', k === i); d.setAttribute('aria-current', k === i); });
      link.href = `${document.body.dataset.root}products/${hrefs[i]}/`;
    };
    const play = () => { if (!reduce) timer = setInterval(() => go(i + 1), 4800); };
    dots.forEach((d, k) => d.addEventListener('click', () => { clearInterval(timer); go(k); }));
    stage.addEventListener('mouseenter', () => clearInterval(timer));
    stage.addEventListener('mouseleave', () => { clearInterval(timer); play(); });
    stage.addEventListener('focusin', () => clearInterval(timer));
    play();
  }

  /* engineering flow: line fills with scroll, steps light up in turn */
  const flow = $('[data-flow]');
  const flowSteps = flow ? $$('[data-flow-step]', flow) : [];
  function flowProgress() {
    if (!flow) return;
    if (flowRectStale) { flowRect = flow.getBoundingClientRect(); flowRectStale = false; }
    const r = flowRect;
    /* re-get top every call since scroll moves it; only width/height are cached */
    const liveTop = r.top + scrollY - (flow._scrollSnapshot || 0) + scrollY - scrollY;
    const liveR = flow.getBoundingClientRect();
    const vertical = getComputedStyle($('.flow__line', flow)).width === '1px';
    const p = Math.min(1, Math.max(0, (innerHeight * 0.72 - liveR.top) / (vertical ? liveR.height : innerHeight * 0.42)));
    flow.style.setProperty('--fp', p.toFixed(3));
    flowSteps.forEach((s, k) => s.classList.toggle('is-on', p >= (k + 0.15) / flowSteps.length));
  }

  /* gentle image parallax */
  const par = $$('[data-parallax]');
  function parallax() {
    if (reduce || !par.length) return;
    par.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > innerHeight + 100) return;
      const f = parseFloat(el.dataset.parallax) || 0.05;
      el.style.transform = `translate3d(0,${((r.top + r.height / 2 - innerHeight / 2) * -f).toFixed(1)}px,0)`;
    });
  }

  /* sticky sub-nav highlighting */
  const sub = $('[data-subnav]');
  if (sub && io) {
    const links = $$('a', sub);
    const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    const so = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { links.forEach((l) => l.classList.remove('is-on')); map.get(e.target.id)?.classList.add('is-on'); }
    }), { rootMargin: '-40% 0px -55% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) so.observe(s); });
  }

  /* brands filter */
  const rows = $('[data-brows]');
  if (rows) {
    const chips = $$('[data-filter]');
    chips.forEach((c) => c.addEventListener('click', () => {
      const f = c.dataset.filter;
      chips.forEach((x) => { const on = x === c; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', on); });
      $$('.btile', rows).forEach((r) => { r.hidden = !(f === 'all' || r.dataset.cats.split(' ').includes(f)); });
    }));
  }

  /* magnetic CTAs (fine pointers only) */
  if (fine && !reduce) {
    $$('[data-magnetic]').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1)}px,${((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1)}px)`;
      });
      b.addEventListener('pointerleave', () => (b.style.transform = ''));
    });
  }

  /* enquiry form: opens the visitor's own mail app or WhatsApp, pre-filled;
     nothing is sent to a server */
  const form = $('[data-enquiry]');
  if (form) {
    const q = new URLSearchParams(location.search).get('product');
    const sel = form.elements.product;
    if (q) { [...sel.options].some((o) => o.text === q && (sel.value = o.value)) || (form.elements.message.value = `I would like to know more about ${q}.`); }
    const err = $('[data-form-err]', form);
    const submitLabel = $('[data-submit-label]', form);
    const viaInputs = $$('[name=via]', form);
    const syncSubmit = () => {
      const v = (form.querySelector('[name=via]:checked') || {}).value;
      if (submitLabel) submitLabel.textContent = v === 'whatsapp' ? 'Send enquiry on WhatsApp' : 'Send enquiry by email';
    };
    viaInputs.forEach((i) => i.addEventListener('change', syncSubmit));
    syncSubmit();
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = form.elements;
      const bad = [f.name, f.contact].filter((el) => !el.value.trim());
      $$('.field', form).forEach((d) => d.classList.remove('has-err'));
      if (bad.length) {
        bad.forEach((el) => el.closest('.field').classList.add('has-err'));
        err.hidden = false; err.textContent = 'Please add your name and a phone number or email so we can reply.';
        bad[0].focus(); return;
      }
      err.hidden = true;
      const name = f.name.value.trim();
      const product = f.product.value;
      const lines = [
        'Hi Vectron, I would like to enquire.',
        `Name: ${name}`,
        f.company.value.trim() && `Company: ${f.company.value.trim()}`,
        `Phone / email: ${f.contact.value.trim()}`,
        product && `Requirement: ${product}`,
        f.message.value.trim() && `Message: ${f.message.value.trim()}`,
      ].filter(Boolean).join('\n');
      const subject = `Enquiry from website — ${product || name}`;
      const via = (form.querySelector('[name=via]:checked') || {}).value;
      const note = $('[data-form-note]', form);
      const gmail = $('[data-gmail]', form);
      if (gmail) gmail.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${MAIL}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`;
      if (via === 'whatsapp') {
        const wurl = `https://wa.me/${WA}?text=${encodeURIComponent(lines)}`;
        const w = window.open(wurl, '_blank');
        if (w) { try { w.opener = null; } catch (_) {} } else { location.href = wurl; }   // pop-up blocked: open in this tab instead
      } else {
        location.href = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`;
        if (note) note.hidden = false;   // visitors without a mail app still have a way to reach us
      }
    });
  }

  onScroll();
})();
