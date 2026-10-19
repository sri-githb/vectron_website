/* Vectron hero — real 3D geared motor (WebGL, zero dependencies).

   The mesh is the supplied Rossi MR 2IV geared-motor STEP model, converted to
   triangles (see motor-model.js). 12 separate solids: gearbox housing, motor
   adapter flange, motor frame, B5 shield, fan covers, terminal box, rating
   plate, shafts, seals.

   Scroll        0 → 1  exploded → assembled (staggered, eased per part)
   Drag          orbit the model (touch: horizontal drag; vertical still scrolls)
   Hover         part highlight + name
   Double-click  reset view
   Reduced motion  static, assembled
   Mobile        auto-assembles once in view
   Colours come from the site's CSS tokens so the model always matches the brand. */
(() => {
  const root = document.querySelector('[data-assembly]');
  const MODEL = window.VECTRON_MOTOR;
  if (!root) return;
  const canvas = root.querySelector('[data-assembly-canvas]');
  const bar = document.querySelector('[data-assembly-bar]');
  const label = document.querySelector('[data-assembly-label]');
  const pin = document.querySelector('[data-hero-pin]');
  const hero = document.querySelector('[data-hero]');
  if (!canvas || !pin) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const mix = (a, b, t) => a + (b - a) * t;
  const easeOut = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
  const easeIO = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };

  /* ---- graceful fallback (no WebGL / no model) ---- */
  function fallback() {
    root.classList.add('is-fallback');
    const src = root.getAttribute('data-fallback');
    if (src && !root.querySelector('.hero__fallback-img')) {
      const im = new Image();
      im.src = src; im.alt = ''; im.className = 'hero__fallback-img';
      root.appendChild(im);
    }
    canvas.style.display = 'none';
    if (bar) bar.style.transform = 'scaleX(1)';
    if (label) label.textContent = '';
  }
  const gl = MODEL && canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: 'high-performance' });
  if (!gl) { fallback(); return; }

  /* ---- palette from design tokens ---- */
  const css = getComputedStyle(document.documentElement);
  const tok = (n, d) => (css.getPropertyValue(n).trim() || d);
  const hex = (h) => { const n = parseInt(h.replace('#', '').slice(0, 6), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255); };
  const lin = (c) => c.map((v) => Math.pow(v, 2.2));
  const C = {
    blue: hex(tok('--acc-d', '#1773a8')),
    blueL: hex(tok('--acc', '#2aa0dd')),
    ink: hex(tok('--ink', '#17181f')),
    purple: hex(tok('--purple', '#54406b')),
    orange: hex(tok('--orange', '#e85020')),
  };
  const lift = (c, k) => c.map((v) => clamp(v * k, 0, 1));
  /* material: [r,g,b (sRGB), metallic, roughness, clearcoat] */
  const MAT = {
    blue: [...lift(C.blue, 1.04), 0.30, 0.34, 0.65],
    char: [...mix3(C.ink, [0.30, 0.32, 0.40], 0.62), 0.45, 0.36, 0.55],
    steel: [0.86, 0.89, 0.92, 1.0, 0.22, 0],
    zinc: [0.76, 0.80, 0.84, 0.88, 0.36, 0],
    rubber: [0.07, 0.075, 0.09, 0.0, 0.62, 0],
    plate: [0.93, 0.94, 0.96, 0.6, 0.30, 0],
  };
  function mix3(a, b, t) { return [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)]; }

  /* ---- parts (index = order in the model file) ----
     mats: how the 4 source colours (brochure blue, light grey, black, mid grey) are painted
     ex:   explode offset in mm (x = motor axis, y up, z = output-shaft axis)
     d:    arrival delay 0..1 (0 arrives first) */
  const P = [
    { n: 'Gearbox housing',        mats: ['char', 'zinc', 'rubber', 'steel'], ex: [0, 0, 0], d: 0 },
    { n: 'Motor adapter flange',   mats: ['char', 'zinc', 'rubber', 'steel'], ex: [-60, 0, 0], d: 0.42 },
    { n: 'Motor frame',            mats: ['blue', 'zinc', 'rubber', 'steel'], ex: [-170, 0, 0], d: 0.66 },
    { n: 'B5 drive-end shield',    mats: ['blue', 'zinc', 'rubber', 'steel'], ex: [-115, 0, 0], d: 0.54 },
    { n: 'Motor shaft',            mats: ['steel', 'steel', 'steel', 'steel'], ex: [-40, 175, 0], d: 0.32 },
    { n: 'Motor fan cover',        mats: ['blue', 'zinc', 'rubber', 'steel'], ex: [-235, 0, 0], d: 1.0 },
    { n: 'Rating plate',           mats: ['plate', 'plate', 'plate', 'plate'], ex: [-170, 0, -70], d: 0.82 },
    { n: 'Terminal box',           mats: ['blue', 'zinc', 'rubber', 'steel'], ex: [-170, 150, 0], d: 0.88 },
    { n: 'Shaft seals',            mats: ['rubber', 'rubber', 'rubber', 'rubber'], ex: [0, 0, 150], d: 0.12 },
    { n: 'Hollow output shaft',    mats: ['steel', 'steel', 'steel', 'steel'], ex: [0, 0, 300], d: 0.02 },
    { n: 'Worm shaft',             mats: ['steel', 'steel', 'steel', 'steel'], ex: [230, 0, 0], d: 0.14 },
    { n: 'Gearbox fan cover',      mats: ['char', 'zinc', 'rubber', 'steel'], ex: [440, 0, 0], d: 0.26 },
  ];

  /* ---------------- decode mesh ---------------- */
  const bin = atob(MODEL.data);
  const buf = new ArrayBuffer(bin.length);
  { const u8 = new Uint8Array(buf); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i); }
  const E = MODEL.extent;
  const parts = MODEL.parts.map((m, i) => {
    const o = m.off;
    const pos = new Int16Array(buf, o, m.nv * 4);
    const nrm = new Int8Array(buf, o + m.nv * 8, m.nv * 4);
    const idx = new Uint16Array(buf, o + m.nv * 12, m.nt * 3);
    const cfg = P[i] || { n: m.name, mats: ['blue', 'zinc', 'rubber', 'steel'], ex: [0, 0, 0], d: 0 };
    const vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);
    const nb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, nb); gl.bufferData(gl.ARRAY_BUFFER, nrm, gl.STATIC_DRAW);
    const ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
    const base = new Float32Array(12), mp = new Float32Array(16);
    cfg.mats.forEach((k, s) => {
      const m4 = MAT[k]; const c = lin(m4.slice(0, 3));
      base.set(c, s * 3); mp.set([m4[3], m4[4], m4[5], 0], s * 4);
    });
    return {
      i, name: cfg.n, nt: m.nt, vb, nb, ib, base, mp,
      ex: cfg.ex.map((v) => v / E), delay: cfg.d,
      lo: m.lo, hi: m.hi, hi_t: 0,
    };
  });
  /* the model is stored in the assembled pose; ground sits under the lowest point */
  let minY = Infinity;
  parts.forEach((p) => { minY = Math.min(minY, p.lo[1]); });
  const groundY = minY - 0.004;

  /* ---------------- shaders ---------------- */
  const VS = `
  attribute vec4 aPos; attribute vec4 aNrm;
  uniform mat4 uVP; uniform vec3 uOff; uniform vec3 uBase[4]; uniform vec4 uMP[4]; uniform vec2 uPan;
  varying vec3 vN; varying vec3 vW; varying vec3 vBase; varying vec4 vMP;
  void main(){
    vec3 p = aPos.xyz / 32767.0 + uOff;
    vW = p; vN = aNrm.xyz / 127.0;
    int m = int(aNrm.w + 0.5);
    vec3 b = uBase[0]; vec4 q = uMP[0];
    if (m == 1) { b = uBase[1]; q = uMP[1]; }
    else if (m == 2) { b = uBase[2]; q = uMP[2]; }
    else if (m == 3) { b = uBase[3]; q = uMP[3]; }
    vBase = b; vMP = q;
    vec4 c = uVP * vec4(p, 1.0);
    c.xy += uPan * c.w;
    gl_Position = c;
  }`;
  const FS = `
  precision highp float;
  varying vec3 vN; varying vec3 vW; varying vec3 vBase; varying vec4 vMP;
  uniform vec3 uEye; uniform float uHi; uniform float uSweep; uniform float uSweepAmt;
  uniform vec3 uBlue; uniform vec3 uBlueL; uniform vec3 uPurple; uniform vec3 uOrange;
  const float PI = 3.14159265;
  vec3 env(vec3 r, float rough){
    float y = r.y;
    vec3 sky = mix(vec3(0.80,0.85,0.93), vec3(1.05,1.05,1.08), smoothstep(0.0,1.0,y));
    vec3 gnd = mix(vec3(0.50,0.50,0.54), vec3(0.74,0.75,0.79), smoothstep(-1.0,0.0,y));
    vec3 c = mix(gnd, sky, smoothstep(-0.18,0.18,y));
    float b1 = smoothstep(0.50,0.93, dot(r, normalize(vec3(-0.55,0.75,0.55))));
    float b2 = smoothstep(0.66,0.97, dot(r, normalize(vec3(0.85,0.35,-0.30))));
    float b3 = smoothstep(0.80,0.99, dot(r, normalize(vec3(0.0,0.30,1.0))));
    c += vec3(1.25)*b1*(1.0-0.65*rough) + (uBlueL*0.9+0.2)*b2*(1.0-0.5*rough) + vec3(0.7)*b3*(1.0-0.7*rough);
    c *= mix(vec3(1.0), vec3(0.97,0.94,1.03), 1.0 - abs(y));
    return mix(c, vec3(0.72,0.74,0.80), rough*rough*0.55);
  }
  float D_ggx(float nh, float a){ float a2=a*a; float d = nh*nh*(a2-1.0)+1.0; return a2/(PI*d*d); }
  vec3 shadeLight(vec3 N, vec3 V, vec3 L, vec3 col, vec3 F0, vec3 alb, float rough){
    vec3 H = normalize(L+V);
    float nl = max(dot(N,L),0.0), nh = max(dot(N,H),0.0), lh = max(dot(L,H),0.0);
    vec3 F = F0 + (1.0-F0)*pow(1.0-lh,5.0);
    float a = max(rough*rough, 0.045);
    vec3 spec = D_ggx(nh,a) * F / (4.0*lh*lh + 1e-3) * 0.55;
    return (alb*(1.0-F0) / PI + spec) * col * nl;
  }
  vec3 aces(vec3 x){ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14),0.0,1.0); }
  void main(){
    vec3 N = normalize(vN);
    vec3 V = normalize(uEye - vW);
    if (!gl_FrontFacing) N = -N;
    float metal = vMP.x, rough = vMP.y, coat = vMP.z;
    vec3 alb = vBase * (1.0 - metal);
    vec3 F0 = mix(vec3(0.04), vBase, metal);
    float nv = max(dot(N,V),0.0);
    /* lights */
    vec3 Lk = normalize(vec3(-0.55,0.85,0.70));
    vec3 Lf = normalize(vec3(0.90,0.25,0.35));
    vec3 Lr = normalize(vec3(0.15,0.55,-0.95));
    vec3 col = vec3(0.0);
    col += shadeLight(N,V,Lk,vec3(3.4,3.3,3.2),F0,alb,rough);
    col += shadeLight(N,V,Lf,uBlueL*1.5+0.25,F0,alb,rough);
    col += shadeLight(N,V,Lr,uPurple*3.2+vec3(0.55,0.60,0.85),F0,alb,rough);
    /* hemispheric ambient */
    float up = N.y*0.5+0.5;
    vec3 amb = mix(vec3(0.34,0.33,0.37), vec3(0.78,0.82,0.92), up);
    col += alb * amb * 0.62;
    /* environment reflection */
    vec3 R = reflect(-V, N);
    vec3 Fe = F0 + (max(vec3(1.0-rough),F0)-F0)*pow(1.0-nv,5.0);
    col += env(R, rough) * Fe * mix(0.55, 1.0, metal);
    /* clear-coat */
    if (coat > 0.0) {
      vec3 Fc = vec3(0.04) + 0.96*pow(1.0-nv,5.0);
      col += env(R, 0.08) * Fc * coat * 1.15;
      vec3 H = normalize(Lk+V); col += vec3(1.0) * pow(max(dot(N,H),0.0), 220.0) * 0.9 * coat;
    }
    /* soft cavity darkening toward the ground, brand rim */
    col *= mix(0.80, 1.0, smoothstep(-0.5, 0.2, vW.y*2.2 + 0.35));
    float rim = pow(1.0-nv, 3.0);
    col += mix(uBlueL, uPurple*2.2, 0.35) * rim * 0.26;
    /* assembly light sweep */
    float s = exp(-pow((vW.x - uSweep) * 5.0, 2.0));
    col += (uBlueL*1.1+0.15) * s * uSweepAmt * (0.22 + 0.5*rim);
    /* hover highlight */
    col = col * (1.0 + 0.22*uHi) + uBlueL * 0.05 * uHi;
    col += uOrange * (0.10 + 1.1*rim) * uHi * 0.55;
    col = aces(col*0.92);
    col = pow(col, vec3(1.0/2.2));
    gl_FragColor = vec4(col, 1.0);
  }`;
  const PICK_FS = `
  precision mediump float;
  uniform float uId;
  void main(){ gl_FragColor = vec4(uId/255.0, 0.0, 0.0, 1.0); }`;
  const GVS = `
  attribute vec2 aQ; uniform mat4 uVP; uniform vec2 uPan; uniform float uY; uniform float uSize; varying vec2 vP;
  void main(){ vec3 p = vec3(aQ.x*uSize, uY, aQ.y*uSize); vP = p.xz; vec4 c = uVP*vec4(p,1.0); c.xy += uPan*c.w; gl_Position = c; }`;
  const GFS = `
  precision mediump float;
  varying vec2 vP; uniform vec2 uC; uniform vec2 uR; uniform float uA; uniform float uRing; uniform vec3 uBlue; uniform vec3 uOrange;
  void main(){
    vec2 q = (vP-uC)/uR; float d = length(q);
    float sh = smoothstep(1.0,0.0,d); sh *= sh*sh;
    float core = exp(-d*d*3.4);
    float a = (0.12*sh + 0.22*core) * uA;
    float ring = (smoothstep(0.010,0.0,abs(d*0.82-0.92)) * 0.55 + smoothstep(0.006,0.0,abs(d*0.82-1.10)) * 0.30) * uRing;
    float fade = smoothstep(1.35,0.55,d);
    vec3 rc = mix(uBlue, uOrange, 0.0);
    vec3 col = vec3(0.05,0.06,0.10)*a + rc*ring*fade;
    gl_FragColor = vec4(col, a + ring*fade);
  }`;
  function prog(vs, fs) {
    const mk = (t, s) => { const sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh); if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh)); return sh; };
    const p = gl.createProgram(); gl.attachShader(p, mk(gl.VERTEX_SHADER, vs)); gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {}; const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) { const a = gl.getActiveUniform(p, i); u[a.name.replace('[0]', '')] = gl.getUniformLocation(p, a.name); }
    return { p, u };
  }
  let main, pick, ground;
  try { main = prog(VS, FS); pick = prog(VS, PICK_FS); ground = prog(GVS, GFS); } catch (e) { console.warn('Vectron hero shader error', e); fallback(); return; }
  const quad = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  /* ---------------- matrices ---------------- */
  const persp = (f, a, n, fa) => { const t = 1 / Math.tan(f / 2); return [t / a, 0, 0, 0, 0, t, 0, 0, 0, 0, (fa + n) / (n - fa), -1, 0, 0, 2 * fa * n / (n - fa), 0]; };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const nrm3 = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const look = (e, t, up) => {
    const z = nrm3(sub(e, t)), x = nrm3(cross(up, z)), y = cross(z, x);
    return [x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot3(x, e), -dot3(y, e), -dot3(z, e), 1];
  };
  const mul = (a, b) => { const o = new Array(16); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s; } return o; };

  /* ---------------- state ---------------- */
  const FOV = 0.46;                         // ~26°
  const TARGET = [0.03, 0.02, 0]; // look-at (normalised model units)
  let W = 0, H = 0, dpr = 1;
  let dist = 4.2, pan = [0, 0];
  let progress = reduce ? 1 : 0, target = progress;
  let yawU = 0, pitchU = 0, vYaw = 0, vPitch = 0, dragging = false, lastInput = 0;
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  let last = performance.now(), raf = 0, visible = true, hoverIdx = -1, hoverWant = -1, pickAt = null, tipEl = null;
  let pinTop = 0, pinTotal = 1, quality = 1, slow = 0, lastPick = 0;

  /* camera orbit as a function of scroll progress: starts wider/higher, settles to the hero angle */
  function camAngles(p, includeUser) {
    const e = easeIO(p);
    let yaw = mix(0.82, 0.50, e) + (includeUser ? yawU + ptr.x * 0.16 : 0);
    let pitch = mix(0.40, 0.25, e) + (includeUser ? pitchU - ptr.y * 0.07 : 0);
    if (includeUser && !reduce && p > 0.985 && !dragging) yaw += Math.sin(last * 0.00045) * 0.035;
    return [yaw, clamp(pitch, -0.15, 1.15)];
  }
  function viewProj(p, includeUser, d = dist, pn = pan) {
    const [yaw, pitch] = camAngles(p, includeUser);
    const eye = [TARGET[0] + d * Math.cos(pitch) * Math.sin(yaw), TARGET[1] + d * Math.sin(pitch), TARGET[2] + d * Math.cos(pitch) * Math.cos(yaw)];
    const v = look(eye, TARGET, [0, 1, 0]);
    return { vp: mul(persp(FOV, W / H, 0.1, 40), v), eye };
  }

  /* per-part explode offset (normalised units) at progress p */
  function offsetOf(part, p, out) {
    const a = part.delay * 0.5, t = easeOut((p - a) / 0.5);
    const k = 1 - t;
    out[0] = part.ex[0] * k; out[1] = part.ex[1] * k; out[2] = part.ex[2] * k;
  }

  /* fit: for each stage of the assembly the visible parts are framed on their own, so the camera
     slowly dollies in as the motor comes together (exploded state stays fully in view). */
  const FIT_N = 12;
  let fitTab = [];
  function fitAt(pp) {
    let d = 4.2, pn = [0, 0];
    const tmp = [0, 0, 0];
    for (let iter = 0; iter < 7; iter++) {
      let x0 = 9, x1 = -9, y0 = 9, y1 = -9;
      const { vp } = viewProj(pp, false, d);
      for (const part of parts) {
        offsetOf(part, pp, tmp);
        for (let c = 0; c < 8; c++) {
          const x = (c & 1 ? part.hi[0] : part.lo[0]) + tmp[0];
          const y = (c & 2 ? part.hi[1] : part.lo[1]) + tmp[1];
          const z = (c & 4 ? part.hi[2] : part.lo[2]) + tmp[2];
          const cw = vp[3] * x + vp[7] * y + vp[11] * z + vp[15];
          const nx = (vp[0] * x + vp[4] * y + vp[8] * z + vp[12]) / cw;
          const ny = (vp[1] * x + vp[5] * y + vp[9] * z + vp[13]) / cw;
          x0 = Math.min(x0, nx); x1 = Math.max(x1, nx); y0 = Math.min(y0, ny); y1 = Math.max(y1, ny);
        }
      }
      const f = Math.max((x1 - x0) / 1.86, (y1 - y0) / 1.72);
      pn = [-(x0 + x1) / 2, -(y0 + y1) / 2 - 0.015];
      if (Math.abs(f - 1) < 0.003) break;
      d *= f;
    }
    return { d, pn };
  }
  function fit() {
    fitTab = [];
    for (let i = 0; i <= FIT_N; i++) fitTab.push(fitAt(i / FIT_N));
    applyFit(progress);
  }
  function applyFit(p) {
    const f = clamp(p, 0, 1) * FIT_N, i = Math.min(FIT_N - 1, Math.floor(f)), t = f - i;
    const A = fitTab[i], B = fitTab[i + 1];
    dist = mix(A.d, B.d, t);
    pan = [mix(A.pn[0], B.pn[0], t), mix(A.pn[1], B.pn[1], t)];
  }

  /* ---------------- sizing ---------------- */
  let pickFB = null, pickTex = null, pickDepth = null, PW = 0, PH = 0;
  function makePickTarget() {
    PW = 192; PH = Math.max(64, Math.round(PW * H / W));
    if (pickFB) { gl.deleteFramebuffer(pickFB); gl.deleteTexture(pickTex); gl.deleteRenderbuffer(pickDepth); }
    pickTex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, pickTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PW, PH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    pickDepth = gl.createRenderbuffer(); gl.bindRenderbuffer(gl.RENDERBUFFER, pickDepth);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, PW, PH);
    pickFB = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, pickFB);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, pickTex, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, pickDepth);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
  function measurePin() {
    pinTop = pin.getBoundingClientRect().top + window.scrollY;
    pinTotal = Math.max(1, pin.offsetHeight - window.innerHeight);
  }
  function resize() {
    const r = root.getBoundingClientRect();
    const maxDpr = fine ? 2 : 1.75;
    dpr = Math.min(maxDpr, window.devicePixelRatio || 1) * quality;
    W = Math.max(240, Math.floor(r.width));
    H = Math.max(200, Math.floor(r.height));
    canvas.width = Math.floor(W * dpr); canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    measurePin();
    fit();
    makePickTarget();
    draw(0);
  }

  /* ---------------- drawing ---------------- */
  const off = [0, 0, 0];
  function bindMain(prog_, withMat) {
    const a = gl.getAttribLocation(prog_.p, 'aPos'), b = gl.getAttribLocation(prog_.p, 'aNrm');
    return [a, b];
  }
  function drawParts(pr, vp, pickMode) {
    gl.useProgram(pr.p);
    gl.uniformMatrix4fv(pr.u.uVP, false, vp);
    gl.uniform2fv(pr.u.uPan, pan);
    const aP = gl.getAttribLocation(pr.p, 'aPos'), aN = gl.getAttribLocation(pr.p, 'aNrm');
    gl.enableVertexAttribArray(aP); gl.enableVertexAttribArray(aN);
    for (const part of parts) {
      offsetOf(part, progress, off);
      gl.uniform3fv(pr.u.uOff, off);
      if (pickMode) gl.uniform1f(pr.u.uId, part.i + 1);
      else {
        gl.uniform3fv(pr.u.uBase, part.base); gl.uniform4fv(pr.u.uMP, part.mp);
        gl.uniform1f(pr.u.uHi, part.hi_t);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, part.vb); gl.vertexAttribPointer(aP, 4, gl.SHORT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, part.nb); gl.vertexAttribPointer(aN, 4, gl.BYTE, false, 0, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, part.ib);
      gl.drawElements(gl.TRIANGLES, part.nt * 3, gl.UNSIGNED_SHORT, 0);
    }
  }
  /* shadow ellipse follows the spread of the parts */
  function groundParams() {
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    for (const part of parts) {
      offsetOf(part, progress, off);
      if (part.ex[1] > 0.05) continue;     // parts that lift off do not widen the footprint
      x0 = Math.min(x0, part.lo[0] + off[0]); x1 = Math.max(x1, part.hi[0] + off[0]);
      z0 = Math.min(z0, part.lo[2] + off[2]); z1 = Math.max(z1, part.hi[2] + off[2]);
    }
    const k = mix(0.62, 0.50, progress);
    return [(x0 + x1) / 2, (z0 + z1) / 2, Math.max(0.3, (x1 - x0) * k), Math.max(0.28, (z1 - z0) * k * 1.15)];
  }
  function draw(t) {
    applyFit(progress);
    const { vp, eye } = viewProj(progress, true);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);
    gl.disable(gl.CULL_FACE);
    /* ground shadow + ring */
    for (let i = 0; i < 4; i++) gl.disableVertexAttribArray(i);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false);
    gl.useProgram(ground.p);
    gl.uniformMatrix4fv(ground.u.uVP, false, vp); gl.uniform2fv(ground.u.uPan, pan);
    const g = groundParams();
    gl.uniform1f(ground.u.uY, groundY); gl.uniform1f(ground.u.uSize, 4);
    gl.uniform2f(ground.u.uC, g[0], g[1]); gl.uniform2f(ground.u.uR, g[2], g[3]);
    gl.uniform1f(ground.u.uA, mix(0.55, 1.0, progress));
    gl.uniform1f(ground.u.uRing, mix(0.16, 0.5, easeIO(progress)));
    gl.uniform3fv(ground.u.uBlue, C.blueL); gl.uniform3fv(ground.u.uOrange, C.orange);
    const aQ = gl.getAttribLocation(ground.p, 'aQ');
    gl.bindBuffer(gl.ARRAY_BUFFER, quad); gl.enableVertexAttribArray(aQ); gl.vertexAttribPointer(aQ, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.disableVertexAttribArray(aQ);
    gl.depthMask(true); gl.disable(gl.BLEND);
    /* model */
    gl.useProgram(main.p);
    gl.uniform3fv(main.u.uEye, eye);
    gl.uniform3fv(main.u.uBlue, C.blue); gl.uniform3fv(main.u.uBlueL, C.blueL);
    gl.uniform3fv(main.u.uPurple, C.purple); gl.uniform3fv(main.u.uOrange, C.orange);
    const sweep = mix(-1.1, 1.3, progress);
    gl.uniform1f(main.u.uSweep, sweep);
    gl.uniform1f(main.u.uSweepAmt, progress > 0.02 && progress < 0.985 ? 1 : 0);
    drawParts(main, vp, false);
  }
  function pickDraw(px, py) {
    applyFit(progress);
    const { vp } = viewProj(progress, true);
    gl.bindFramebuffer(gl.FRAMEBUFFER, pickFB);
    gl.viewport(0, 0, PW, PH);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); gl.disable(gl.BLEND);
    drawParts(pick, vp, true);
    const x = clamp(Math.floor(px * PW), 0, PW - 1), y = clamp(Math.floor((1 - py) * PH), 0, PH - 1);
    const o = new Uint8Array(4); gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, o);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return o[0] ? o[0] - 1 : -1;
  }

  /* ---------------- scroll → progress ---------------- */
  function readScroll() {
    if (reduce) { target = 1; return; }
    if (autoRunning) return;
    if (autoDone && isNarrow()) { target = 1; return; }      // phones: assemble once, then hold
    const y = window.scrollY;
    target = clamp((y - pinTop) / pinTotal, 0, 1);
  }
  const isNarrow = () => matchMedia('(max-width:899px)').matches;
  let autoDone = false, autoRunning = false;
  function maybeAuto() {
    if (!isNarrow() || reduce || autoDone) return;
    const r = pin.getBoundingClientRect();
    if (r.top < innerHeight * 0.7 && r.bottom > 0) {
      autoDone = true; autoRunning = true;
      const t0 = performance.now(), from = target;
      const run = (now) => {
        const u = Math.min(1, (now - t0) / 2600);
        target = from + (1 - from) * easeIO(u);
        if (u < 1) requestAnimationFrame(run); else { autoRunning = false; target = 1; }
      };
      requestAnimationFrame(run);
    }
  }

  /* ---------------- HUD ---------------- */
  let lastLabel = '', lastBar = -1;
  function hud() {
    if (bar && Math.abs(progress - lastBar) > 0.0005) { lastBar = progress; bar.style.transform = 'scaleX(' + progress.toFixed(4) + ')'; }
    if (hero && Math.abs(progress - (hud.p || -1)) > 0.0005) { hud.p = progress; hero.style.setProperty('--assemble', progress.toFixed(4)); }
    if (label) {
      const s = progress < 0.04 ? 'Exploded view' : progress < 0.985 ? 'Assembling geared motor' : (fine ? 'Assembled · drag to rotate' : 'Assembled');
      if (s !== lastLabel) { lastLabel = s; label.textContent = s; }
    }
  }

  /* ---------------- main loop ---------------- */
  function tick(now) {
    const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
    last = now;
    readScroll();
    const k = window.__vectronSmooth ? 15 : 9;       // global smooth-scroll already eases; keep this light
    progress += (target - progress) * (reduce ? 1 : 1 - Math.exp(-dt * k));
    if (Math.abs(target - progress) < 0.0004) progress = target;
    if (fine) { const a = 1 - Math.exp(-dt * 5); ptr.x += (ptr.tx - ptr.x) * a; ptr.y += (ptr.ty - ptr.y) * a; }
    /* inertia + slow return of the user's orbit */
    if (!dragging) {
      yawU += vYaw * dt; pitchU += vPitch * dt;
      const damp = Math.exp(-dt * 3.2); vYaw *= damp; vPitch *= damp;
      if (now - lastInput > 3500) { const r = 1 - Math.exp(-dt * 0.9); yawU -= yawU * r; pitchU -= pitchU * r; }
    }
    pitchU = clamp(pitchU, -0.5, 0.7);
    for (const p of parts) p.hi_t += ((p.i === hoverIdx ? 1 : 0) - p.hi_t) * (1 - Math.exp(-dt * 12));
    if (pickAt && !dragging && now - lastPick > 70) {
      lastPick = now;
      const idx = pickDraw(pickAt.x, pickAt.y); pickAt = null;
      if (idx !== hoverIdx) { hoverIdx = idx; canvas.style.cursor = idx >= 0 ? 'pointer' : 'grab'; showTip(); }
    }
    draw(now);
    hud();
    /* adaptive resolution */
    if (dt > 0.034) slow++; else slow = Math.max(0, slow - 1);
    if (slow > 40 && quality > 0.6) { quality = Math.max(0.6, quality - 0.15); slow = 0; resize(); }
    raf = visible ? requestAnimationFrame(tick) : 0;
  }

  /* ---------------- interaction ---------------- */
  function showTip() {
    if (!tipEl) { tipEl = document.createElement('div'); tipEl.className = 'hero__tip'; tipEl.setAttribute('aria-hidden', 'true'); root.appendChild(tipEl); }
    if (hoverIdx < 0) { tipEl.classList.remove('is-on'); return; }
    tipEl.textContent = parts[hoverIdx].name;
    tipEl.classList.add('is-on');
    moveTip();
  }
  let tipXY = [0, 0];
  function moveTip() { if (tipEl) tipEl.style.transform = 'translate(' + (tipXY[0] + 14) + 'px,' + (tipXY[1] + 16) + 'px)'; }
  let dragX = 0, dragY = 0, moved = 0;
  canvas.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragging = true; moved = 0; dragX = e.clientX; dragY = e.clientY; vYaw = vPitch = 0; lastInput = performance.now();
    try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
    canvas.style.cursor = 'grabbing';
    hoverIdx = -1; showTip();
  });
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    if (fine) { ptr.tx = clamp(px - 0.5, -0.5, 0.5) * 2; ptr.ty = clamp(py - 0.5, -0.5, 0.5) * 2; }
    tipXY = [e.clientX - r.left, e.clientY - r.top]; moveTip();
    if (dragging) {
      const dx = e.clientX - dragX, dy = e.clientY - dragY; dragX = e.clientX; dragY = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      const s = 0.0075;
      yawU -= dx * s; pitchU += dy * s * 0.8;
      const now = performance.now(); const dtm = Math.max(8, now - lastInput) / 1000; lastInput = now;
      vYaw = clamp(-dx * s / dtm, -4, 4); vPitch = clamp(dy * s * 0.8 / dtm, -3, 3);
    } else if (e.pointerType === 'mouse') {
      pickAt = { x: px, y: py };
    }
  });
  const endDrag = (e) => { if (!dragging) return; dragging = false; canvas.style.cursor = 'grab'; try { canvas.releasePointerCapture(e.pointerId); } catch (_) {} };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('pointerleave', () => { ptr.tx = ptr.ty = 0; hoverIdx = -1; showTip(); });
  canvas.addEventListener('dblclick', () => { yawU = pitchU = vYaw = vPitch = 0; });
  canvas.addEventListener('keydown', (e) => {
    const s = 0.12;
    if (e.key === 'ArrowLeft') yawU += s; else if (e.key === 'ArrowRight') yawU -= s;
    else if (e.key === 'ArrowUp') pitchU -= s * 0.7; else if (e.key === 'ArrowDown') pitchU += s * 0.7;
    else if (e.key === 'Home' || e.key === 'Escape') yawU = pitchU = 0; else return;
    lastInput = performance.now(); e.preventDefault();
  });
  canvas.setAttribute('tabindex', '0');
  canvas.setAttribute('aria-label', 'Interactive 3D geared motor. Scroll to assemble. Drag or use arrow keys to rotate.');
  canvas.style.cursor = fine ? 'grab' : 'default';
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); cancelAnimationFrame(raf); raf = 0; }, false);
  canvas.addEventListener('webglcontextrestored', () => location.reload(), false);

  /* ---------------- boot ---------------- */
  resize();
  let rt = 0;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 120); }, { passive: true });
  addEventListener('load', () => { measurePin(); }, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(() => measurePin()).observe(document.body);
  addEventListener('scroll', maybeAuto, { passive: true });
  root.classList.add('is-ready');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((es) => {
      const was = visible; visible = es[0].isIntersecting;
      if (visible && !was && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    }, { rootMargin: '160px' }).observe(root);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
    else if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
  });
  raf = requestAnimationFrame(tick);
  maybeAuto();
  /* test hook */
  window.__vectronHero = { set: (p) => { progress = target = p; }, state: () => ({ progress, target, dist, pan }) };
})();
