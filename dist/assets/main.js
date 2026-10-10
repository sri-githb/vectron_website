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
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle('is-solid', y > 24);
    const open = document.body.classList.contains('mm-open');
    header.classList.toggle('is-hidden', !open && y > 480 && y > lastY + 4 && !$('[data-mega]:not([hidden])'));
    if (y < lastY - 4) header.classList.remove('is-hidden');
    lastY = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.parentElement.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    if (bar) bar.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    const wa = $('[data-wa]');
    if (wa) wa.classList.toggle('is-away', y < 200 && !!$('.hero'));
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
    const count = $('[data-stage-count]', stage), link = $('[data-stage-link]', stage);
    const hrefs = ['motors', 'vfds', 'gearboxes', 'pumps'];
    let i = 0, timer;
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
      dots.forEach((d, k) => { d.classList.toggle('is-active', k === i); d.setAttribute('aria-current', k === i); });
      count.textContent = `0${i + 1} / 0${slides.length}`;
      link.href = `${document.body.dataset.root}products/${hrefs[i]}/`;
    };
    const play = () => { if (!reduce) timer = setInterval(() => go(i + 1), 4800); };
    dots.forEach((d, k) => d.addEventListener('click', () => { clearInterval(timer); go(k); }));
    stage.addEventListener('mouseenter', () => clearInterval(timer));
    stage.addEventListener('mouseleave', () => { clearInterval(timer); play(); });
    stage.addEventListener('focusin', () => clearInterval(timer));
    play();
  }

  /* solution universe accordion (desktop hover/focus; stacked on mobile) */
  const uni = $('[data-uni]');
  if (uni) {
    const ps = $$('[data-uni-p]', uni);
    const act = (p) => ps.forEach((x) => x.classList.toggle('is-active', x === p));
    ps.forEach((p) => { p.addEventListener('mouseenter', () => act(p)); p.addEventListener('focus', () => act(p)); });
  }

  /* engineering flow: line fills with scroll, steps light up in turn */
  const flow = $('[data-flow]');
  const flowSteps = flow ? $$('[data-flow-step]', flow) : [];
  function flowProgress() {
    if (!flow) return;
    const r = flow.getBoundingClientRect();
    const vertical = getComputedStyle($('.flow__line', flow)).width === '1px';
    const p = Math.min(1, Math.max(0, (innerHeight * 0.72 - r.top) / (vertical ? r.height : innerHeight * 0.42)));
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
      $$('.brow', rows).forEach((r) => { r.hidden = !(f === 'all' || r.dataset.cats.split(' ').includes(f)); });
    }));
  }

  /* magnetic CTAs + subtle cursor (fine pointers only) */
  if (fine && !reduce) {
    $$('[data-magnetic]').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1)}px,${((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1)}px)`;
      });
      b.addEventListener('pointerleave', () => (b.style.transform = ''));
    });
    const cur = $('[data-cursor]');
    if (cur) {
      document.documentElement.classList.add('has-cursor');
      let x = 0, y = 0, cx = 0, cy = 0;
      addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; cur.classList.add('is-on'); });
      document.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
      const tick = () => { cx += (x - cx) * 0.22; cy += (y - cy) * 0.22; cur.style.transform = `translate3d(${cx}px,${cy}px,0)`; requestAnimationFrame(tick); };
      tick();
      document.addEventListener('pointerover', (e) => cur.classList.toggle('is-big', !!e.target.closest('a,button,summary,[data-uni-p]')));
    }
  }

  /* enquiry form: composes a WhatsApp or email message; nothing is sent to a server */
  const form = $('[data-enquiry]');
  if (form) {
    const q = new URLSearchParams(location.search).get('product');
    const sel = form.elements.product;
    if (q) { [...sel.options].some((o) => o.text === q && (sel.value = o.value)) || (form.elements.message.value = `I would like to know more about ${q}.`); }
    const err = $('[data-form-err]', form);
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
      const lines = [
        'Hi Vectron, I would like to enquire.',
        `Name: ${f.name.value.trim()}`,
        f.company.value.trim() && `Company: ${f.company.value.trim()}`,
        `Phone / email: ${f.contact.value.trim()}`,
        f.product.value && `Requirement: ${f.product.value}`,
        f.message.value.trim() && `Message: ${f.message.value.trim()}`,
      ].filter(Boolean).join('\n');
      const via = form.querySelector('[name=via]:checked').value;
      if (via === 'email') location.href = `mailto:${MAIL}?subject=${encodeURIComponent('Enquiry from website' + (f.product.value ? ': ' + f.product.value : ''))}&body=${encodeURIComponent(lines)}`;
      else window.open(`https://wa.me/${WA}?text=${encodeURIComponent(lines)}`, '_blank', 'noopener');
    });
  }

  onScroll();
})();
