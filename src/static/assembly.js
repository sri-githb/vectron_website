/* Vectron hero — realistic industrial product visualization.
   A scroll-driven exploded → assembled study of an industrial electric motor
   coupled to a gearbox — the machines Vectron supplies. Rendered as a studio
   product shot: painted motor housing with cooling fins, terminal box, end
   shields and feet; rotor with keyed shaft; flexible coupling; cast-iron
   gearbox with top cover, breather, inspection hatch, output flange and
   stepped output shaft.

   Canvas 2D, zero dependencies. Software-lit materials (key + rim light),
   metallic gradients, contact shadows and a ground plane. The drawing is
   auto-calibrated to stay large and centred at any size.

   Scroll        0 → 1  explodes → assembles
   Reduced motion       static, assembled
   Mobile               auto-assembles once in view, lighter detail
   Palette from CSS tokens so it always matches the logo-led brand. */
(() => {
  const root = document.querySelector('[data-assembly]');
  if (!root) return;

  const canvas = root.querySelector('[data-assembly-canvas]');
  const bar = document.querySelector('[data-assembly-bar]');
  const label = document.querySelector('[data-assembly-label]');
  const pin = document.querySelector('[data-hero-pin]');
  const hero = document.querySelector('[data-hero]');
  if (!canvas || !pin) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const fitter = coarse || matchMedia('(hover: none)').matches;
  let ctx = canvas.getContext('2d', { alpha: true });
  let dpr = 1, W = 0, H = 0;
  let progress = reduce ? 1 : 0;
  let target = progress;
  let raf = 0, time = 0, last = performance.now();
  let Sbase = 34;
  let originX = 0, originY = 0;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

  /* ---- palette from design tokens + product materials ---- */
  const css = () => getComputedStyle(document.documentElement);
  const C = {
    ink: css().getPropertyValue('--ink').trim() || '#17181f',
    blue: css().getPropertyValue('--acc').trim() || '#2aa0dd',
    blueD: css().getPropertyValue('--acc-d').trim() || '#1773a8',
    orange: css().getPropertyValue('--orange').trim() || '#e85020',
  };
  const M = {
    paint: '#2f7fb5',      // painted motor housing (logo blue family)
    paintD: '#1f689c',
    paintL: '#5aa4d4',
    iron: '#454c53',       // gearbox cast iron
    ironD: '#2f353b',
    ironL: '#60686f',
    steel: '#9aa5ad',      // machined steel
    steelD: '#5f676e',
    steelL: '#cdd5da',
    alum: '#b8c0c6',       // aluminium end shields
    alumD: '#8a9299',
    chrome: '#e8edf1',     // polished shaft / flange faces
    chromeD: '#aeb8c0',
    spider: C.orange,      // flexible coupling element
  };

  /* ---- parts: assembled placement + explode vectors (world units).
     x = drive axis, y = height (down-screen positive), z = depth.
     The fan, motor and its terminal box slide back (−x); the rotor & shaft,
     coupling and gearbox slide forward (+x); the terminal box and gearbox
     cover additionally lift — mechanically logical axes.
     term ships inside motor, cover inside casing (drawn last, always on top). */
  const parts = [
    { id: 'fan',    ex: -1.55, ey: 0.00, ez: 0.00, cx: -3.55, cy: 1.62, cz: 0.00 },
    { id: 'motor',  ex: -1.10, ey: 0.00, ez: 0.00, cx: -2.12, cy: 1.62, cz: 0.00 },
    { id: 'rotor',  ex:  0.95, ey: 0.00, ez: 0.00, cx: -0.45, cy: 1.62, cz: 0.00 },
    { id: 'coupler', ex:  0.95, ey: 0.00, ez: 0.00, cx:  0.30, cy: 1.62, cz: 0.00 },
    { id: 'casing', ex:  0.95, ey: 0.00, ez: 0.00, cx:  1.70, cy: 1.78, cz: 0.00 },
  ];
  const yM = 1.62;     // motor / input centreline
  const yOut = 2.20;   // gearbox output centreline
  const plateTop = 2.62;

  const ease = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 2.6);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const stepsOf = () => (fitter ? 16 : 26);
  const S = () => Sbase;

  function resize() {
    const r = root.getBoundingClientRect();
    dpr = Math.min(fitter ? 1.5 : 2, window.devicePixelRatio || 1);
    W = Math.max(240, Math.floor(r.width));
    H = Math.max(200, Math.floor(r.height));
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    calibrate();
    draw();
  }

  /* Isometric projection with a quiet pointer-driven camera drift */
  function iso(x, y, z) {
    const s = S();
    return {
      x: originX + (x - z) * s * 0.866 + pointer.x * W * 0.015,
      y: originY + y * s * 0.56 + (x + z) * s * 0.5 + pointer.y * H * 0.018,
      d: x + z + y * 0.32,
    };
  }

  const shade = (hex, k) => {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.min(255, Math.round(((n >> 16) & 255) * k));
    const g = Math.min(255, Math.round(((n >> 8) & 255) * k));
    const b = Math.min(255, Math.round((n & 255) * k));
    return `rgb(${r},${g},${b})`;
  };
  const rgba = (hex, a) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  };

  const poly = (pts, close = true) => {
    if (pts.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    if (close) ctx.closePath();
  };
  const fill = (pts, c) => { poly(pts); ctx.fillStyle = c; ctx.fill(); };
  const stroke = (pts, c = 'rgba(18,21,26,.24)', w = 1) => { poly(pts); ctx.strokeStyle = c; ctx.lineWidth = w; ctx.stroke(); };
  function strokePts(pts, c, w) { poly(pts, false); ctx.strokeStyle = c; ctx.lineWidth = w; ctx.stroke(); }
  const strokeArc = (p, r, c, w = 1) => {
    ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = c; ctx.lineWidth = w; ctx.stroke();
  };
  const fillArc = (p, r, c) => {
    ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = c; ctx.fill();
  };

  /* Face with a soft directional gradient (key light upper-left). */
  const spaint = (pts, col) => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    pts.forEach((p) => {
      x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y);
      x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y);
    });
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, shade(col, 1.18));
    g.addColorStop(0.5, col);
    g.addColorStop(1, shade(col, 0.7));
    poly(pts); ctx.fillStyle = g; ctx.fill();
  };

  /* Soft ambient / contact shadow ellipse on a surface below a part. */
  function ao(p, rx, ry, k, col = '#1a1f24') {
    if (k <= 0.003) return;
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(rx, ry));
    g.addColorStop(0, rgba(col, k));
    g.addColorStop(1, rgba(col, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ---------- primitives ---------- */
  /* Horizontal cylinder (axis along x) with machined end caps. */
  function cylH(cx, cy, cz, len, r, col, o, opt = {}) {
    const steps = opt.steps || stepsOf();
    const ox = o.x, oy = o.y, oz = o.z;
    for (let i = 0; i < steps; i++) {
      const a0 = (i / steps) * Math.PI * 2, a1 = ((i + 1) / steps) * Math.PI * 2;
      const am = (a0 + a1) / 2;
      const y0 = Math.cos(a0) * r, z0 = Math.sin(a0) * r;
      const y1 = Math.cos(a1) * r, z1 = Math.sin(a1) * r;
      const p0 = iso(cx + ox, cy + y0 + oy, cz + z0 + oz);
      const p1 = iso(cx + len + ox, cy + y0 + oy, cz + z0 + oz);
      const p3 = iso(cx + ox, cy + y1 + oy, cz + z1 + oz);
      const p2 = iso(cx + len + ox, cy + y1 + oy, cz + z1 + oz);
      const front = Math.max(0, -Math.sin(am));   // −z faces the viewer
      const top = Math.max(0, -Math.cos(am));     // −y faces up
      const lit = 0.42 + front * 0.34 + top * 0.52;
      fill([p0, p1, p2, p3], shade(col, clamp(lit, 0.4, 1.32)));
      stroke([p0, p1, p2, p3], 'rgba(20,24,30,.08)', 0.55);
    }
    /* end caps — radial "machined" gradient biased to the key light */
    [[cx, true], [cx + len, false]].forEach(([ex, fCap]) => {
      const c0 = iso(ex + ox, cy + oy, cz + oz);
      const rr = r * S();
      const g = ctx.createRadialGradient(c0.x + rr * 0.18, c0.y - rr * 0.22, rr * 0.12, c0.x, c0.y, rr * 1.02);
      const base = fCap ? shade(col, 1.06) : shade(col, 0.86);
      g.addColorStop(0, shade(col, 1.28));
      g.addColorStop(0.45, base);
      g.addColorStop(1, shade(col, 0.58));
      const pts = [];
      for (let i = 0; i <= 30; i++) {
        const a = (i / 30) * Math.PI * 2;
        pts.push(iso(ex + ox, cy + Math.cos(a) * r + oy, cz + Math.sin(a) * r + oz));
      }
      fill(pts, g);
      stroke(pts, 'rgba(20,24,30,.15)', 0.8);
      ctx.save();
      ctx.globalAlpha = 0.5;
      strokeArc(c0, rr * 0.86, 'rgba(255,255,255,.5)', 0.9);
      ctx.restore();
    });
    /* polished specular streak along the top-front */
    if (opt.gloss && !reduce) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,.30)';
      ctx.lineWidth = 1.3;
      ctx.shadowColor = 'rgba(255,255,255,.65)';
      ctx.shadowBlur = 6;
      for (let i = 0; i < 2; i++) {
        const a = -0.22 + i * 0.26;
        ctx.beginPath();
        let first = true;
        for (let k = 0; k <= 20; k++) {
          const x = cx + 0.06 + (k / 20) * (len - 0.12);
          const p = iso(x + ox, cy + Math.cos(a) * (r + 0.01) + oy, cz + Math.sin(a) * (r + 0.01) + oz);
          if (first) { ctx.moveTo(p.x, p.y); first = false; } else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  /* Vertical cylinder (axis along y) for glands, breathers, small studs. */
  function cylV(cx, y0, y1, cz, r, col, o, opt = {}) {
    const steps = opt.steps || 12;
    const ox = o.x, oy = o.y, oz = o.z;
    const a = (i) => (i / steps) * Math.PI * 2;
    for (let i = 0; i < steps; i++) {
      const x0m = Math.cos(a(i)) * r, z0m = Math.sin(a(i)) * r;
      const x1m = Math.cos(a(i + 1)) * r, z1m = Math.sin(a(i + 1)) * r;
      const am = (a(i) + a(i + 1)) / 2;
      const p0 = iso(cx + x0m + ox, y0 + oy, cz + z0m + oz);
      const p1 = iso(cx + x1m + ox, y0 + oy, cz + z1m + oz);
      const p2 = iso(cx + x1m + ox, y1 + oy, cz + z1m + oz);
      const p3 = iso(cx + x0m + ox, y1 + oy, cz + z0m + oz);
      const front = Math.max(0, -Math.sin(am));
      const left = Math.max(0, -Math.cos(am));
      const lit = 0.5 + front * 0.32 + left * 0.14;
      fill([p0, p1, p2, p3], shade(col, clamp(lit, 0.42, 1.28)));
    }
    /* top cap */
    const c0 = iso(cx + ox, y0 + oy, cz + oz);
    const rr = r * S() * 1.02;
    const g = ctx.createRadialGradient(c0.x - rr * 0.15, c0.y - rr * 0.2, rr * 0.1, c0.x, c0.y, rr);
    g.addColorStop(0, shade(col, 1.25));
    g.addColorStop(1, shade(col, 0.75));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(c0.x, c0.y, rr, rr * 0.56, 0, 0, Math.PI * 2);
    ctx.fill();
    strokeArc(c0, rr, 'rgba(20,24,30,.18)', 0.7);
  }

  /* Box with per-face light response: up bright → bottom dark. corners:
     0:(x,y,z) 1:(x+w,y,z) 2:(x+w,y+h,z) 3:(x,y+h,z)
     4:(x,y,z+d) 5:(x+w,y,z+d) 6:(x+w,y+h,z+d) 7:(x,y+h,z+d) */
  function box3(x, y, z, w, h, d, col, o, opt = {}) {
    const c = [
      [x, y, z], [x + w, y, z], [x + w, y + h, z], [x, y + h, z],
      [x, y, z + d], [x + w, y, z + d], [x + w, y + h, z + d], [x, y + h, z + d],
    ].map(([px, py, pz]) => iso(px + o.x, py + o.y, pz + o.z));
    const lit = { up: 1.16, front: 0.94, side: 0.8, back: 0.64, bottom: 0.5 };
    const faces = [
      { i: [0, 1, 5, 4], k: lit.up },
      { i: [3, 2, 6, 7], k: lit.bottom },
      { i: [0, 1, 2, 3], k: lit.front },
      { i: [4, 5, 6, 7], k: lit.back },
      { i: [0, 3, 7, 4], k: lit.side },
      { i: [1, 2, 6, 5], k: lit.side },
    ].map((f) => ({ pts: f.i.map((k) => c[k]), d: f.i.reduce((s, k) => s + c[k].d, 0) / 4, k: f.k }));
    faces.sort((a, b) => a.d - b.d);
    faces.forEach((f) => {
      spaint(f.pts, shade(col, f.k));
      stroke(f.pts, 'rgba(20,24,30,.09)', 0.7);
    });
  }

  /* ---------- small parts ---------- */
  function bolt(x, y, z, o, r = 0.05) {
    const p = iso(x + o.x, y + o.y, z + o.z);
    fillArc(p, r * S(), M.steelD);
    strokeArc(p, r * S(), 'rgba(20,24,30,.3)', 0.6);
    ctx.beginPath();
    ctx.moveTo(p.x - r * S() * 0.5, p.y);
    ctx.lineTo(p.x + r * S() * 0.5, p.y);
    ctx.strokeStyle = 'rgba(0,0,0,.3)';
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }
  function keyway(x0, x1, y, z, o, k = 0.8) {
    ctx.save();
    ctx.globalAlpha = k;
    const p0 = iso(x0 + o.x, y + o.y, z + o.z);
    const p1 = iso(x1 + o.x, y + o.y, z + o.z);
    ctx.strokeStyle = C.blueD;
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
    ctx.restore();
  }
  function ribLine(x, y0, y1, z, o, col = 'rgba(23,24,31,.35)') {
    const p0 = iso(x + o.x, y0 + o.y, z + o.z);
    const p1 = iso(x + o.x, y1 + o.y, z + o.z);
    strokePts([p0, p1], col, 1);
  }

  /* ---------- baseplate ---------- */
  function drawGround() {
    const p = iso(0, 3.06, 0);
    const g = ctx.createRadialGradient(p.x, p.y, 6, p.x, p.y, Math.max(W, H) * 0.30);
    g.addColorStop(0, 'rgba(23,24,31,.10)');
    g.addColorStop(0.55, 'rgba(23,24,31,.05)');
    g.addColorStop(1, 'rgba(23,24,31,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, W * 0.30, H * 0.10, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function boxTopFace(x, y, z, w, d, o) {
    return [iso(x + o.x, y + o.y, z + o.z), iso(x + w + o.x, y + o.y, z + o.z),
            iso(x + w + o.x, y + o.y, z + d + o.z), iso(x + o.x, y + o.y, z + d + o.z)];
  }

  function drawBaseplate() {
    box3(-4.6, plateTop, -1.05, 8.4, 0.40, 2.10, '#c9ccc6', { x: 0, y: 0, z: 0 });
    const tp = boxTopFace(-4.6, plateTop, -1.05, 8.4, 2.10, { x: 0, y: 0, z: 0 });
    spaint(tp, '#e2e4dd');
    stroke(tp, 'rgba(20,24,30,.16)', 0.8);
    for (const z of [-0.6, 0, 0.6]) {
      const a = iso(-4.5, plateTop + 0.005, z);
      const b = iso(3.7, plateTop + 0.005, z);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = 'rgba(23,24,31,.28)';
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }
  }

  /* Contact shadows that fade in as parts seat onto the plate. */
  function partAO(p, t) {
    const a = clamp((t - 0.55) / 0.45, 0, 1) * 0.16;
    if (p.id === 'motor') {
      ao(iso(-2.12, plateTop + 0.01, -0.30), 1.6 * S(), 0.24 * S(), a);
      ao(iso(-2.12, plateTop + 0.01, 0.30), 1.6 * S(), 0.24 * S(), a);
    } else if (p.id === 'casing') {
      ao(iso(1.75, plateTop + 0.01, -0.62), 1.1 * S(), 0.22 * S(), a);
      ao(iso(1.75, plateTop + 0.01, 0.62), 1.1 * S(), 0.22 * S(), a);
    }
  }

  /* ---------- parts ---------- */
  function drawFan(o) {
    const ox = o.x, oy = o.y, oz = o.z;
    cylH(-3.80, yM, 0, 0.36, 0.64, M.steel, o, { steps: 24 });
    /* rear end shield */
    cylH(-4.00, yM, 0, 0.10, 0.28, M.alum, o, { steps: 18 });
    /* louvre ring */
    const r0 = iso(-3.60 + ox, yM + oy, oz);
    strokeArc(r0, 0.60 * S(), 'rgba(23,24,31,.4)', 1.2);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const p0 = iso(-3.61 + ox, yM + Math.cos(a) * 0.42 + oy, Math.sin(a) * 0.42 + oz);
      const p1 = iso(-3.61 + ox, yM + Math.cos(a) * 0.60 + oy, Math.sin(a) * 0.60 + oz);
      strokePts([p0, p1], 'rgba(23,24,31,.38)', 1.1);
    }
    /* fan disc behind the grille */
    const fc = iso(-3.44 + ox, yM + oy, oz);
    const fr = 0.46 * S();
    const g = ctx.createRadialGradient(fc.x - fr * 0.2, fc.y - fr * 0.2, fr * 0.1, fc.x, fc.y, fr);
    g.addColorStop(0, shade(M.alum, 1.2)); g.addColorStop(1, shade(M.alum, 0.8));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(fc.x, fc.y, fr, 0, Math.PI * 2); ctx.fill();
    strokeArc(fc, fr, 'rgba(23,24,31,.3)', 1);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(fc.x, fc.y);
      ctx.lineTo(fc.x + Math.cos(a) * fr * 0.92, fc.y + Math.sin(a) * fr * 0.92);
      ctx.strokeStyle = 'rgba(23,24,31,.32)';
      ctx.lineWidth = 1.3;
      ctx.stroke();
    }
  }

  function drawMotor(o, t) {
    const ox = o.x, oy = o.y, oz = o.z;
    const k = 1 - ease(t);            // term lifts / slides with the motor
    const tox = ox, toy = oy - 0.90 * k, toz = oz;

    /* main stator housing with cooling fins */
    cylH(-3.45, yM, 0, 2.65, 0.60, M.paint, o, { steps: 26 });
    /* cast fin ridges painted over the blue body */
    for (let i = 0; i < 7; i++) {
      const x = -3.30 + (i / 6) * 2.40;
      const a = iso(x + ox, yM - 0.585 + oy, -0.42 + oz);
      const b = iso(x + ox, yM - 0.585 + oy, 0.42 + oz);
      strokePts([a, b], 'rgba(23,24,31,.22)', 0.9);
    }
    for (let i = 0; i < 9; i++) {
      const x = -3.32 + (i / 8) * 2.40;
      const f0 = iso(x + ox, yM - 0.60 + oy, oz);
      const f1 = iso(x + ox, yM + 0.60 + oy, oz);
      strokePts([f0, f1], 'rgba(255,255,255,.14)', 1.1);
    }
    /* nameplate */
    box3(-2.42, 1.24, -0.652, 0.84, 0.34, 0.05, M.alum, o);
    const nx = iso(-2.00 + ox, 1.41 + oy, -0.63 + oz);
    ctx.save();
    ctx.fillStyle = 'rgba(23,24,31,.8)';
    ctx.font = `700 ${Math.max(6, Math.min(8, W * 0.013))}px Manrope, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('VECTRON', nx.x, nx.y + 1);
    ctx.restore();
    ctx.textAlign = 'left';
    /* feet + hold-down bolts */
    box3(-3.15, 2.30, -0.62, 2.05, 0.32, 0.52, M.paintD, o);
    box3(-3.15, 2.30, 0.10, 2.05, 0.32, 0.52, M.paintD, o);
    for (const z of [-0.36, 0.36]) {
      for (const x of [-2.9, -1.4]) bolt(x, 2.30, z, o, 0.045);
    }

    /* --- terminal box (lifts during explosion, stays on the motor) --- */
    box3(-2.74, 0.99, -0.34, 0.92, 0.10, 0.68, M.paintD, o);            // pedestal
    box3(-2.66, 1.09, -0.34, 0.76, 0.48, 0.68, M.paint, { x: tox, y: toy, z: toz });
    box3(-2.74, 1.01, -0.42, 0.92, 0.10, 0.84, M.paintD, { x: tox, y: toy, z: toz }); // lid
    [[-2.6, -0.33], [-2.6, 0.33], [-1.98, -0.33], [-1.98, 0.33]].forEach(([x, z]) => bolt(x, 1.03, z, { x: tox, y: toy, z: toz }, 0.045));
    cylV(-2.28, 0.90, 1.04, 0, 0.10, M.steelL, { x: tox, y: toy, z: toz });   // gland
    cylV(-2.28, 0.98, 1.10, 0, 0.15, M.steel, { x: tox, y: toy, z: toz });    // gland nut
  }

  function drawRotor(o) {
    const ox = o.x, oy = o.y, oz = o.z;
    /* rotor core — exposed while separated, seats inside the housing */
    cylH(-3.05, yM, 0, 2.30, 0.40, M.iron, o, { steps: 22 });
    /* rear fan-mount disc */
    cylH(-3.48, yM, 0, 0.06, 0.34, M.alum, o, { steps: 18 });
    /* drive-end shield + boss */
    cylH(-0.78, yM, 0, 0.18, 0.58, M.alum, o, { steps: 24 });
    cylH(-0.60, yM, 0, 0.22, 0.26, M.alum, o, { steps: 18 });
    /* bolt circle on the shield face */
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      bolt(-0.68, yM + Math.cos(a) * 0.44, Math.sin(a) * 0.44, o, 0.035);
    }
    /* bearing web lines */
    for (let i = 0; i < 4; i++) {
      const a = -0.7 + i * 0.55;
      const p0 = iso(-0.62 + ox, yM + Math.cos(a) * 0.30 + oy, Math.sin(a) * 0.30 + oz);
      const p1 = iso(-0.62 + ox, yM + Math.cos(a) * 0.50 + oy, Math.sin(a) * 0.50 + oz);
      strokePts([p0, p1], 'rgba(23,24,31,.28)', 0.8);
    }
    /* keyed output shaft — polished */
    cylH(-0.62, yM, 0, 0.76, 0.16, M.chrome, o, { steps: 18, gloss: true });
    cylH(0.14, yM, 0, 0.12, 0.11, M.steel, o, { steps: 14 });
    keyway(0.02, 0.12, yM + 0.045, 0, o);
  }

  function drawCoupler(o) {
    const ox = o.x, oy = o.y, oz = o.z;
    /* hub 1 — rides the motor shaft end */
    cylH(0.02, yM, 0, 0.20, 0.30, M.steel, o, { steps: 20 });
    cylH(0.02, yM, 0, 0.06, 0.34, M.steelL, o, { steps: 20 });
    /* flexible element */
    cylH(0.22, yM, 0, 0.14, 0.28, M.spider, o, { steps: 18, gloss: true });
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const p0 = iso(0.24 + ox, yM + Math.cos(a) * 0.20 + oy, Math.sin(a) * 0.20 + oz);
      const p1 = iso(0.34 + ox, yM + Math.cos(a) * 0.20 + oy, Math.sin(a) * 0.20 + oz);
      strokePts([p0, p1], 'rgba(23,24,31,.18)', 1);
    }
    /* hub 2 — gearbox input */
    cylH(0.36, yM, 0, 0.20, 0.30, M.steel, o, { steps: 20 });
    cylH(0.52, yM, 0, 0.06, 0.34, M.steelL, o, { steps: 20 });
    const bc = iso(0.40 + ox, yM + oy, oz);
    strokeArc(bc, 0.10 * S(), 'rgba(23,24,31,.5)', 1);
  }

  function drawCasing(o, t) {
    const ox = o.x, oy = o.y, oz = o.z;
    const k = 1 - ease(t);            // cover lifts / slides with the housing
    const cox = ox, coy = oy - 0.85 * k, coz = oz;

    /* input bell */
    box3(0.54, 1.30, -0.56, 0.14, 0.74, 1.12, M.ironL, o);
    /* main housing */
    box3(0.68, 1.00, -0.92, 2.17, 1.55, 1.84, M.iron, o);
    /* cast ribs on the housing */
    for (const z of [-0.92, 0.92]) {
      for (let i = 0; i < 4; i++) {
        const x = 1.0 + i * 0.44;
        const p0 = iso(x + ox, 1.06 + oy, z * 0.999 + oz);
        const p1 = iso(x + ox, 2.42 + oy, z * 0.999 + oz);
        strokePts([p0, p1], 'rgba(255,255,255,.10)', 0.9);
      }
    }
    /* inspection hatch on the front face */
    box3(1.35, 1.30, -0.965, 0.50, 0.42, 0.06, M.ironL, o);
    [[1.44, 1.38], [1.44, 1.64], [1.76, 1.38], [1.76, 1.64]].forEach(([x, y]) => bolt(x, y, -0.94, o, 0.035));
    /* drain plug */
    const dp = iso(1.45 + ox, 2.53 + oy, 0.4 + oz);
    fillArc(dp, 0.10 * S(), M.ironD);
    strokeArc(dp, 0.10 * S(), 'rgba(20,24,30,.5)', 0.9);
    /* feet + hold-down bolts */
    box3(0.80, 2.55, -0.92, 1.85, 0.07, 0.55, M.ironD, o);
    box3(0.80, 2.55, 0.37, 1.85, 0.07, 0.55, M.ironD, o);
    for (const z of [-0.6, 0.6]) {
      for (const x of [1.1, 2.35]) bolt(x, 2.55, z, o, 0.042);
    }
    /* output flange + bolts */
    cylH(2.82, yOut, 0, 0.10, 0.52, M.steel, o, { steps: 22 });
    cylH(2.92, yOut, 0, 0.04, 0.46, M.steelL, o, { steps: 22 });
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      bolt(2.88, yOut + Math.cos(a) * 0.38, Math.sin(a) * 0.38, o, 0.04);
    }
    /* stepped keyed output shaft — polished */
    cylH(2.86, yOut, 0, 0.42, 0.26, M.chrome, o, { steps: 18, gloss: true });
    cylH(3.28, yOut, 0, 0.32, 0.17, M.chrome, o, { steps: 16, gloss: true });
    keyway(3.32, 3.48, yOut + 0.05, 0, o);
    strokeArc(iso(3.60 + ox, yOut + oy, oz), 0.16 * S(), 'rgba(23,24,31,.3)', 0.9);

    /* --- gearbox top cover (lifts during explosion, stays on the housing) --- */
    box3(0.54, 0.86, -0.92, 2.31, 0.14, 1.84, M.ironL, { x: cox, y: coy, z: coz });
    for (const z of [-0.92, 0.92]) {
      for (let i = 0; i < 5; i++) {
        const x = 0.85 + i * 0.42;
        const p0 = iso(x + cox, 0.87 + coy, z * 0.998 + coz);
        const p1 = iso(x + cox, 0.97 + coy, z * 0.998 + coz);
        strokePts([p0, p1], 'rgba(23,24,31,.22)', 0.8);
      }
    }
    [[0.7, -0.8], [0.7, 0.8], [2.6, -0.8], [2.6, 0.8]].forEach(([x, z]) => bolt(x, 0.90, z, { x: cox, y: coy, z: coz }, 0.042));
    /* breather on the cover */
    cylV(2.30, 0.74, 0.86, 0.30, 0.08, M.steelL, { x: cox, y: coy, z: coz });
  }

  function drawPart(p, o, t) {
    if (p.id === 'fan') drawFan(o);
    else if (p.id === 'motor') drawMotor(o, t);
    else if (p.id === 'rotor') drawRotor(o);
    else if (p.id === 'coupler') drawCoupler(o);
    else if (p.id === 'casing') drawCasing(o, t);
  }

  const partOffset = (p, t) => {
    const k = 1 - ease(t);
    return { x: p.ex * k, y: p.ey * k, z: p.ez * k };
  };

  /* ---------- callouts (exploded phase only) ---------- */
  function drawCallouts(t) {
    if (t > 0.32 || W < 540) return;
    const alpha = ((0.32 - t) / 0.32) * 0.88;
    ctx.save();
    ctx.globalAlpha = clamp(alpha, 0, 1);
    ctx.fillStyle = C.blueD;
    ctx.font = `${W < 720 ? '500' : '600'} ${Math.max(9, Math.min(11, W * 0.018))}px Manrope, system-ui, sans-serif`;
    const pts = [
      { at: () => iso(-3.55 - 1.55, yM - 1.0, 0), text: 'FAN COWL' },
      { at: () => iso(-2.12 - 1.10, yM - 1.55, 0), text: 'MOTOR' },
      { at: () => iso(-0.45 + 0.95, yM + 1.05, 0.1), text: 'ROTOR & SHAFT' },
      { at: () => iso(0.30 + 0.95, yM + 1.05, 0.1), text: 'FLEXIBLE COUPLING' },
      { at: () => iso(1.70 + 0.95, yM - 1.6, 0), text: 'GEARBOX' },
      { at: () => iso(1.70 + 0.95, yOut + 1.05, 0.2), text: 'OUTPUT FLANGE' },
    ];
    pts.forEach((c) => {
      const pt = c.at();
      const txtW = ctx.measureText(c.text).width;
      const lx = clamp(pt.x + 14, 6, W - txtW - 6);
      const ly = pt.y - 6;
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
      ctx.lineTo(lx - 3, ly);
      ctx.lineTo(lx, ly);
      ctx.strokeStyle = 'rgba(23,24,31,.5)';
      ctx.lineWidth = 0.9;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = C.orange;
      ctx.fill();
      ctx.fillText(c.text, lx, ly - 3);
    });
    ctx.restore();
  }

  /* soft light band that sweeps the unit once as the parts seat */
  function drawSweep(t) {
    if (reduce || t <= 0.02 || t >= 0.99) return;
    const x = iso(-3.2 + 6.9 * clamp(t, 0, 1), 1.8, 0).x;
    const a = (0.10 + Math.sin(time * 0.0012) * 0.03).toFixed(3);
    const g = ctx.createLinearGradient(x - 110, 0, x + 110, H);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.5, `rgba(255,255,255,${a})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - 110, 0, 220, H);
  }

  /* ---------- render ---------- */
  function render(t, mode) {
    ctx.clearRect(0, 0, W, H);
    if (mode !== 'scan') drawGround();
    const order = [...parts].sort((a, b) => {
      const oa = partOffset(a, t), ob = partOffset(b, t);
      return (a.cx + a.cz + oa.x - oa.z + a.cy * 0.32) - (b.cx + b.cz + ob.x - ob.z + b.cy * 0.32);
    });
    if (mode !== 'scan') drawBaseplate();
    order.forEach((p) => partAO(p, t));
    order.forEach((p) => drawPart(p, partOffset(p, t), t));
    if (mode === 'full') {
      drawCallouts(t);
      drawSweep(t);
    }
  }

  /* ---------- auto-calibration: keep the machine large & centred ---------- */
  let off = null, offCtx = null;
  /* measure() renders one assembly state on an oversized offscreen canvas with
     the origin shifted so nothing sits at negative coordinates (where it would
     be clipped and mis-measured). The shift is subtracted afterwards. */
  function measure(t) {
    if (!off) { off = document.createElement('canvas'); offCtx = off.getContext('2d', { willReadFrequently: true }); }
    const B = Math.ceil(14 * S() + 80);           // headroom around the projected spread
    off.width = Math.max(2, W + 2 * B);
    off.height = Math.max(2, H + 2 * B);
    const savedCtx = ctx;
    const savedOX = originX, savedOY = originY;
    ctx = offCtx;
    originX = B; originY = B;
    let r = null;
    try {
      render(t, 'scan');
      const d = offCtx.getImageData(0, 0, off.width, off.height).data;
      let minX = off.width, minY = off.height, maxX = -1, maxY = -1, n = 0;
      for (let y = 0; y < off.height; y++) {
        for (let x = 0; x < off.width; x++) {
          if (d[(y * off.width + x) * 4 + 3] > 10) {
            n++;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (n > 0) r = { minX: minX - B, maxX: maxX - B, minY: minY - B, maxY: maxY - B, w: maxX - minX + 1, h: maxY - minY + 1 };
    } finally {
      originX = savedOX; originY = savedOY;
      ctx = savedCtx;
    }
    return r;
  }

  function calibrate() {
    Sbase = Math.min(Math.min(W, H) * 0.105, W / 7.0, H / 5.4);
    originX = 0; originY = 0;
    const savedPx = pointer.x, savedPy = pointer.y;
    pointer.x = 0; pointer.y = 0;
    /* The scroll animates monotonically between the exploded state (t=0) and
       the assembled state (t=1), so fitting the union envelope of both keeps
       every intermediate frame inside the viewport. */
    for (let i = 0; i < 4; i++) {
      const ac = measure(1), ec = measure(0);
      if (!ac || !ec) break;
      const uw = Math.max(ac.maxX, ec.maxX) - Math.min(ac.minX, ec.minX) + 1;
      const uh = Math.max(ac.maxY, ec.maxY) - Math.min(ac.minY, ec.minY) + 1;
      const f = Math.min((0.90 * W) / uw, (0.86 * H) / uh, 1.15);
      if (f > 1.001 || f < 0.999) { Sbase *= f; continue; }
      break;
    }
    /* centre the assembled unit, then nudge so the exploded envelope also
       stays fully inside the canvas (it spreads asymmetrically to the left) */
    const ac = measure(1), ec = measure(0);
    if (ac && ec) {
      originX = W / 2 - (ac.minX + ac.maxX) / 2;
      originY = H / 2 - (ac.minY + ac.maxY) / 2;
      const eL = ec.minX + originX, eR = ec.maxX + originX;
      const eT = ec.minY + originY, eB = ec.maxY + originY;
      const dL = 6 - eL, dR = eR - (W - 6), dT = 6 - eT, dB = eB - (H - 6);
      if (dL > 0 && dR <= 0) originX += dL;
      else if (dR > 0 && dL <= 0) originX -= dR;
      if (dT > 0 && dB <= 0) originY += dT;
      else if (dB > 0 && dT <= 0) originY -= dB;
    } else if (ac) {
      originX = W / 2 - (ac.minX + ac.maxX) / 2;
      originY = H / 2 - (ac.minY + ac.maxY) / 2;
    }
    /* safety: if either state still splits the canvas edges, shrink once more */
    const a2 = measure(1), e2 = measure(0);
    if (a2 && e2) {
      const l = Math.min(a2.minX, e2.minX) + originX, r = Math.max(a2.maxX, e2.maxX) + originX;
      const t = Math.min(a2.minY, e2.minY) + originY, b = Math.max(a2.maxY, e2.maxY) + originY;
      const over = Math.max((6 - l) / (r - l + 1), (r - (W - 6)) / (r - l + 1),
                            (6 - t) / (b - t + 1), (b - (H - 6)) / (b - t + 1), 0);
      if (over > 0.001) {
        Sbase *= (1 - over);
        const ac3 = measure(1), ec3 = measure(0);
        if (ac3 && ec3) {
          originX = W / 2 - (Math.min(ac3.minX, ec3.minX) + Math.max(ac3.maxX, ec3.maxX)) / 2;
          originY = H / 2 - (Math.min(ac3.minY, ec3.minY) + Math.max(ac3.maxY, ec3.maxY)) / 2;
        }
      }
    }
    pointer.x = savedPx; pointer.y = savedPy;
  }

  function draw() {
    render(progress, 'full');
    if (bar) bar.style.transform = `scaleX(${progress.toFixed(4)})`;
    if (label) {
      label.textContent = progress < 0.85
        ? progress < 0.12 ? 'Exploded view' : 'Assembling mechanism'
        : '';
    }
    if (hero) hero.style.setProperty('--assemble', progress.toFixed(4));
  }

  function readScroll() {
    if (reduce) { target = 1; return; }
    const total = pin.offsetHeight - window.innerHeight;
    if (total < 80) return;
    const r = pin.getBoundingClientRect();
    const scrolled = clamp(-r.top, 0, total);
    target = scrolled / total;
  }

  function tick(now) {
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    time = now;
    readScroll();
    progress += (target - progress) * (reduce ? 1 : 0.12);
    if (Math.abs(target - progress) < 0.001) progress = target;
    draw();
    raf = requestAnimationFrame(tick);
  }

  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce;
  if (fine) {
    root.addEventListener('pointermove', (e) => {
      const r = root.getBoundingClientRect();
      pointer.tx = clamp((e.clientX - r.left) / r.width - 0.5, -1, 1);
      pointer.ty = clamp((e.clientY - r.top) / r.height - 0.5, -1, 1);
    });
    root.addEventListener('pointerleave', () => { pointer.tx = 0; pointer.ty = 0; });
  }
  function lerpPointer() {
    pointer.x += (pointer.tx - pointer.x) * 0.08;
    pointer.y += (pointer.ty - pointer.y) * 0.08;
    requestAnimationFrame(lerpPointer);
  }

  /* mobile: auto-assemble once in view, then hold */
  const isNarrow = () => window.matchMedia('(max-width:899px)').matches;
  let autoDone = false;
  function maybeAuto() {
    if (!isNarrow() || reduce || autoDone) return;
    const r = pin.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.7 && r.bottom > 0) {
      autoDone = true;
      const start = performance.now();
      const from = progress;
      const run = (now) => {
        const u = Math.min(1, (now - start) / 2400);
        target = from + (1 - from) * ease(u);
        if (u < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    }
  }

  resize();
  addEventListener('resize', resize, { passive: true });
  addEventListener('scroll', maybeAuto, { passive: true });
  root.classList.add('is-ready');
  raf = requestAnimationFrame(tick);
  if (fine) requestAnimationFrame(lerpPointer);
  maybeAuto();
})();