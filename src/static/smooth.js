/* Vectron smooth scroll — dependency-free, inertial, frame-rate independent.
   Eases mouse-wheel / trackpad / keyboard / in-page anchor scrolling on desktop.
   Touch devices, reduced-motion users and nested scrollers keep native behaviour.
   Sets window.__vectronSmooth so the hero knows scroll is already being eased. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduce || !fine) return;

  const doc = document.documentElement;
  doc.classList.add('smooth');
  window.__vectronSmooth = true;

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const limit = () => Math.max(0, doc.scrollHeight - innerHeight);
  let cur = scrollY, tgt = scrollY, expected = scrollY, raf = 0, last = 0;
  let sent = [scrollY];           // recent positions we set ourselves (scroll events arrive a frame late)
  const RATE = 9;                 // higher = snappier, lower = silkier

  function frame(now) {
    const dt = Math.min(0.12, Math.max(0.001, (now - last) / 1000));
    last = now;
    cur += (tgt - cur) * (1 - Math.exp(-dt * RATE));
    if (Math.abs(tgt - cur) < 0.5) cur = tgt;
    expected = cur;
    sent.push(cur); if (sent.length > 6) sent.shift();
    window.scrollTo({ top: cur, left: 0, behavior: 'instant' });
    raf = cur === tgt ? 0 : requestAnimationFrame(frame);
  }
  function go(y) {
    tgt = clamp(y, 0, limit());
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
  }
  window.__smoothScrollTo = (y) => go(y);

  /* native scrolls we did not start (scrollbar drag, find-in-page, focus jumps) re-sync */
  addEventListener('scroll', () => {
    const y = scrollY;
    if (!sent.some((v) => Math.abs(v - y) <= 2)) {
      cancelAnimationFrame(raf); raf = 0;
      cur = tgt = expected = y; sent = [y];
    }
  }, { passive: true });
  addEventListener('resize', () => { tgt = clamp(tgt, 0, limit()); cur = clamp(cur, 0, limit()); }, { passive: true });

  /* let nested scrollable areas (menus, textareas) scroll on their own */
  function nestedScroller(el, dy) {
    for (; el && el !== document.body && el !== doc; el = el.parentElement) {
      if (el.hasAttribute && el.hasAttribute('data-native-scroll')) return true;
      const s = getComputedStyle(el);
      if ((s.overflowY === 'auto' || s.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 1) {
        if ((dy < 0 && el.scrollTop > 0) || (dy > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1)) return true;
      }
    }
    return false;
  }

  addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.metaKey || e.defaultPrevented) return;      // pinch-zoom / browser zoom
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;           // horizontal gestures stay native
    if (document.body.classList.contains('mm-open')) return;       // mobile menu open
    if (nestedScroller(e.target, e.deltaY)) return;
    let dy = e.deltaY;
    if (e.deltaMode === 1) dy *= 34; else if (e.deltaMode === 2) dy *= innerHeight;
    e.preventDefault();
    if (!raf) { cur = tgt = expected = scrollY; sent = [scrollY]; }
    go(tgt + clamp(dy, -480, 480));
  }, { passive: false });

  /* keyboard */
  addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON|A|SUMMARY)$/.test(t.tagName) && e.key === ' ')) return;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (t && t.getAttribute && t.getAttribute('role') === 'slider') return;
    if (t === document.querySelector('[data-assembly-canvas]') && /^Arrow/.test(e.key)) return;
    const page = innerHeight * 0.86;
    let d = null;
    switch (e.key) {
      case 'ArrowDown': d = 64; break;
      case 'ArrowUp': d = -64; break;
      case 'PageDown': d = page; break;
      case 'PageUp': d = -page; break;
      case ' ': d = e.shiftKey ? -page : page; break;
      case 'Home': if (!raf) { cur = tgt = expected = scrollY; sent = [scrollY]; } e.preventDefault(); return go(0);
      case 'End': if (!raf) { cur = tgt = expected = scrollY; sent = [scrollY]; } e.preventDefault(); return go(limit());
      default: return;
    }
    e.preventDefault();
    if (!raf) { cur = tgt = expected = scrollY; sent = [scrollY]; }
    go(tgt + d);
  });

  /* in-page anchors */
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href*="#"]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    let u; try { u = new URL(a.href, location.href); } catch (_) { return; }
    if (u.origin !== location.origin || u.pathname !== location.pathname || !u.hash || u.hash === '#') return;
    const el = document.getElementById(decodeURIComponent(u.hash.slice(1)));
    if (!el) return;
    e.preventDefault();
    const pad = parseFloat(getComputedStyle(doc).scrollPaddingTop) || 0;
    if (!raf) { cur = tgt = expected = scrollY; sent = [scrollY]; }
    go(el.getBoundingClientRect().top + scrollY - pad);
    history.pushState(null, '', u.hash);
  });
})();
