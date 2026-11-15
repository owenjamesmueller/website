/* Mode A props + SET SYSTEM. Load after engine.js, components.js, characters.js.
 *
 * Variety rule: a Mode A video is a sequence of SETS (one per beat), not one stage. Each set is a full-frame
 * group with its own composition; sets change with a transition every ~3–6 s.
 *   const S1 = stageSet();                          // full-frame group inside #cam
 *   enter(S1, t0, 'whip'|'zoom'|'push'|'cut', dir)   // bring it in at t0 (whip = fast pan with motion smear)
 *   leave(S1, t1, 'whip'|'zoom'|'push'|'cut', dir)   // take it out at t1
 *   sceneSwap(A, B, t, kind, dir)                    // leave A + enter B at the same moment
 *
 * Props (all accept { parent }):
 *   snow(t0, t1)  townHouse(x, y, {w, h})  library(x, y)  hospital(x, y)  tower(x, y, {w, h})
 *   stamp(text, x, y, t0, {color})   balance(x, y) -> .tilt(t, deg)   stairs(x, y, labels) -> .stepY(i)
 *   mansion(x, y) -> .build(t0, dur), .crack(t0), .topple(t0)   crashChart(x, y, w, h, t0, dur)
 *   billRain(x, floorY, t0, t1)   coat(x, y) -> .pin(i, t0)   jar(x, y, label) -> .add(i, t), .glow(t)
 *   oldCar(x, y)   luxury(name, x, y) (watch | yacht | car | ring)
 *   protoCamera(x, y, {size})   flash(t0)   drawer(x, y) -> .open(t, amount), .close(t)   thing(name, x, y, {scale}) (film | bottle | paper | phone | app)
 *   brandTower(x, y, label, {w, h}) -> .lightsOut(t0, dur)   brickWall(x, y, {cols, rows}) -> .rise(t0, dur)   link(x1, y1, x2, y2, t0, {cut})
 * Every prop is tagged .gx-prop so render.cjs --check flags props crossing characters.
 */
(function () {
  const ST = () => document.getElementById('cam');
  const prop = (el) => { el.classList.add('gx-prop'); return el; };
  const scenery = (el) => { el.dataset.scenery = ''; return prop(el); };   // backgrounds: may sit behind characters
  const svgDiv = (w, h, inner, cls = '') => { const d = document.createElement('div'); d.className = 'gx-svg ' + cls; d.innerHTML = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="overflow:visible">${inner}</svg>`; return d; };
  const W8 = 'fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"';

  // ---------------- sets & transitions ----------------
  function stageSet() {
    const g = document.createElement('div'); g.className = 'gx-set';
    g.style.cssText = 'position:absolute;left:0;top:0;width:1080px;height:1920px;opacity:0;transform-origin:540px 960px';
    ST().appendChild(g); return g;
  }
  function enter(g, t, kind = 'whip', dir = 1) {
    if (kind === 'cut') return tw(g, t, 0.01, { opacity: [0, 1] });
    if (kind === 'whip') { tw(g, t, 0.06, { opacity: [0, 1] }); tw(g, t, 0.32, { x: [700 * dir, 0], blur: [14, 0] }, 'out'); }
    if (kind === 'zoom') { tw(g, t, 0.25, { opacity: [0, 1] }); tw(g, t, 0.45, { scale: [1.35, 1], blur: [10, 0] }, 'out'); }
    if (kind === 'push') { tw(g, t, 0.25, { opacity: [0, 1] }); tw(g, t, 0.45, { scale: [0.82, 1] }, 'out'); }
    sfx(kind === 'zoom' ? 'real/whoosh-deep-hit' : kind === 'push' ? 'real/whoosh-air' : 'real/whoosh-fast', t - 0.08, kind === 'cut' ? 0 : 0.42, 1.2);
    return g;
  }
  function leave(g, t, kind = 'whip', dir = 1) {
    if (kind === 'cut') return tw(g, t, 0.01, { opacity: [1, 0] });
    if (kind === 'whip') { tw(g, t, 0.28, { x: [0, -700 * dir], blur: [0, 14] }, 'in'); tw(g, t + 0.22, 0.06, { opacity: [1, 0] }); }
    if (kind === 'zoom') { tw(g, t, 0.35, { scale: [1, 1.6], blur: [0, 12] }, 'in'); tw(g, t + 0.2, 0.15, { opacity: [1, 0] }); }
    if (kind === 'push') { tw(g, t, 0.3, { scale: [1, 0.7] }, 'in'); tw(g, t + 0.1, 0.2, { opacity: [1, 0] }); }
    return g;
  }
  function sceneSwap(a, b, t, kind = 'whip', dir = 1) { leave(a, t, kind, dir); enter(b, t + (kind === 'cut' ? 0 : 0.12), kind, dir); }

  // ---------------- weather ----------------
  function snow(t0, t1, { parent, n = 90 } = {}) {
    const d = document.createElement('div'); d.className = 'gx-snow';
    let c = ''; for (let i = 0; i < n; i++) c += `<circle r="${(2 + rand(i) * 4).toFixed(1)}" fill="#fff" opacity="${(0.35 + rand(i * 3) * 0.5).toFixed(2)}"/>`;
    d.innerHTML = `<svg width="1080" height="1920" viewBox="0 0 1080 1920">${c}</svg>`;
    const el = place(d, 540, 960, { parent, z: 30, glow: false }); el.style.opacity = 1;
    const C = el.querySelectorAll('circle');
    on((t) => C.forEach((p, i) => { const sp = 60 + rand(i * 7) * 90; const y = ((t * sp + rand(i * 5) * 1920) % 1980) - 30; p.setAttribute('cx', (rand(i * 2) * 1080 + Math.sin(t * 0.8 + i) * 18).toFixed(1)); p.setAttribute('cy', y.toFixed(1)); }));
    return el;
  }

  // ---------------- buildings ----------------
  function windowsGrid(x0, y0, cols, rows, dx, dy, lit = 0.6, seed = 1) {
    let s = ''; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const on = rand(seed + r * 13 + c) < lit; s += `<rect class="win${on ? ' on' : ''}" x="${x0 + c * dx}" y="${y0 + r * dy}" width="${dx * 0.55}" height="${dy * 0.55}" rx="3" fill="${on ? '#f5d37a' : '#20232c'}"/>`; }
    return s;
  }
  function townHouse(x, y, { w = 170, h = 150, parent, seed = 1 } = {}) {
    const el = place(svgDiv(w, h + 90, `<path d="M8 90 L${w / 2} 10 L${w - 8} 90 V${h + 88} H8 Z" fill="#15171d" stroke="#d9d9d9" stroke-width="5" stroke-linejoin="round"/><path d="M14 92 L${w / 2} 24 L${w - 14} 92" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".85"/>${windowsGrid(28, 112, 2, 2, (w - 56) / 2, 40, 0.7, seed)}`, 'gx-house'), x, y, { parent, anchor: 'bottom', z: 4, glow: false });
    return scenery(el);
  }
  function library(x, y, { parent } = {}) {
    const el = place(svgDiv(300, 260, `<path d="M10 70 L150 10 L290 70 Z" fill="#15171d" stroke="#e6e6e6" stroke-width="6" stroke-linejoin="round"/><rect x="20" y="70" width="260" height="22" fill="#15171d" stroke="#e6e6e6" stroke-width="5"/>${[50, 100, 150, 200, 250].map((c) => `<rect x="${c - 11}" y="96" width="22" height="130" fill="#15171d" stroke="#e6e6e6" stroke-width="5"/>`).join('')}<rect x="10" y="226" width="280" height="30" fill="#15171d" stroke="#e6e6e6" stroke-width="5"/><text x="150" y="60" text-anchor="middle" font-family="Space Mono,monospace" font-weight="700" font-size="22" fill="#e6e6e6">LIBRARY</text>`, 'gx-library'), x, y, { parent, anchor: 'bottom', z: 4, glow: false });
    return scenery(el);
  }
  function hospital(x, y, { parent } = {}) {
    const el = place(svgDiv(280, 300, `<rect x="10" y="40" width="260" height="256" fill="#15171d" stroke="#e6e6e6" stroke-width="6"/>${windowsGrid(36, 150, 4, 3, 58, 46, 0.6, 7)}<rect x="110" y="62" width="60" height="60" rx="8" fill="#15171d" stroke="#e6e6e6" stroke-width="5"/><path d="M140 72 V112 M120 92 H160" stroke="#e5484d" stroke-width="12" stroke-linecap="round"/>`, 'gx-hospital'), x, y, { parent, anchor: 'bottom', z: 4, glow: false });
    return scenery(el);
  }
  function tower(x, y, { w = 300, h = 900, parent, seed = 3 } = {}) {
    const el = place(svgDiv(w, h, `<path d="M${w * 0.1} ${h} V60 L${w / 2} 0 L${w * 0.9} 60 V${h} Z" fill="#13151b" stroke="#d0d0d0" stroke-width="5"/>${windowsGrid(w * 0.18, 90, 5, Math.floor((h - 120) / 42), w * 0.13, 42, 0.55, seed)}`, 'gx-tower'), x, y, { parent, anchor: 'bottom', z: 2, glow: false });
    return scenery(el);
  }

  // ---------------- story props ----------------
  function stamp(text, x, y, t0, { parent, color = '#e5484d', rot = -12 } = {}) {
    const d = document.createElement('div'); d.className = 'gx-stamp'; d.textContent = text;
    d.style.cssText = `font-family:'Space Mono',monospace;font-weight:700;font-size:86px;letter-spacing:.08em;color:${color};border:10px solid ${color};border-radius:16px;padding:6px 30px;white-space:nowrap;background:rgba(5,5,5,.7)`;
    const el = place(d, x, y, { parent, z: 25, glow: false }); el.dataset.glowColor = '229,72,77';
    tw(el, t0, 0.01, { opacity: [0, 1] }); tw(el, t0, 0.22, { scale: [2.6, 1], rotate: [rot - 10, rot] }, 'in');
    tw(el, t0 + 0.22, 0.25, { scale: [1, 1.04] }, 'out');
    sfx('real/impact-trailer', t0 + 0.16, 0.6, 1.5);
    return el;
  }
  function balance(x, y, { parent, left = '', right = '' } = {}) {
    const g = document.createElement('div'); g.className = 'gx-balance';
    g.innerHTML = `<svg width="620" height="460" viewBox="0 0 620 460" style="overflow:visible">
      <path d="M310 440 V60 M230 440 H390" ${W8}/><circle cx="310" cy="60" r="14" fill="#fff"/>
      <g class="beam"><path d="M40 60 H580" ${W8}/></g>
      <g class="pl"><path d="M40 60 L0 200 M40 60 L80 200" stroke="#bbb" stroke-width="4"/><path d="M-20 200 H100 Q40 250 -20 200 Z" fill="#15171d" stroke="#fff" stroke-width="6"/><text class="tl" x="40" y="186" text-anchor="middle" font-family="Space Mono,monospace" font-weight="700" font-size="22" fill="#fff">${left}</text></g>
      <g class="pr"><path d="M580 60 L540 200 M580 60 L620 200" stroke="#bbb" stroke-width="4"/><path d="M520 200 H640 Q580 250 520 200 Z" fill="#15171d" stroke="#fff" stroke-width="6"/><text class="tr" x="580" y="186" text-anchor="middle" font-family="Space Mono,monospace" font-weight="700" font-size="22" fill="#fff">${right}</text></g>
      </svg>`;
    const el = place(g, x, y, { parent, anchor: 'bottom', z: 6 }); prop(el);
    const beam = el.querySelector('.beam'), pl = el.querySelector('.pl'), pr = el.querySelector('.pr');
    const keys = [[-99, 0, 0]];
    el.tilt = (t0, deg, dur = 0.6) => { keys.push([t0, deg, dur]); return el; };
    on((t) => {
      let a = 0; let prev = 0;
      for (const [k0, d, du] of keys) if (t >= k0) { const p = du ? EASE.elastic(Math.min(1, (t - k0) / du)) : 1; a = prev + (d - prev) * p; prev = d; }
      beam.setAttribute('transform', `rotate(${a.toFixed(2)} 310 60)`);
      // pans hang straight down from the beam ends
      const r = (a * Math.PI) / 180;
      pl.setAttribute('transform', `translate(${(-270 * Math.cos(r) + 270).toFixed(1)} ${(-270 * Math.sin(r)).toFixed(1)})`);
      pr.setAttribute('transform', `translate(${(270 * Math.cos(r) - 270).toFixed(1)} ${(270 * Math.sin(r)).toFixed(1)})`);
    });
    return el;
  }
  function stairs(x, y, labels, { parent, stepW = 230, stepH = 150 } = {}) {
    const n = labels.length, w = stepW * n, h = stepH * n;
    let s = '';
    labels.forEach((l, i) => { const sx = i * stepW, sy = h - (i + 1) * stepH; s += `<rect x="${sx}" y="${sy}" width="${stepW}" height="${(i + 1) * stepH}" fill="#15171d" stroke="#e6e6e6" stroke-width="6"/><text x="${sx + stepW / 2}" y="${sy + 52}" text-anchor="middle" font-family="Space Mono,monospace" font-weight="700" font-size="24" fill="#fff">${l}</text>`; });
    const el = place(svgDiv(w, h, s, 'gx-stairs'), x, y, { parent, anchor: 'bottom', z: 4, glow: false }); scenery(el);
    el.top = (i) => ({ x: x - w / 2 + i * stepW + stepW / 2, y: y - (i + 1) * stepH });   // feet position on step i
    return el;
  }
  function mansion(x, y, { parent, floors = 4, scale = 1 } = {}) {
    const W = 720, FH = 120, H = floors * FH + 120;
    let s = `<path class="roof" d="M20 120 L${W / 2} 10 L${W - 20} 120 Z" fill="#15171d" stroke="#e6e6e6" stroke-width="6" stroke-linejoin="round"/>`;
    for (let f = 0; f < floors; f++) {
      const fy = H - (f + 1) * FH;
      s += `<g class="fl fl${f}"><rect x="40" y="${fy}" width="${W - 80}" height="${FH}" fill="#15171d" stroke="#e6e6e6" stroke-width="5"/>${windowsGrid(70, fy + 26, 9, 1, 66, 60, 0.85, f * 5)}</g>`;
    }
    s += `<path class="crack" d="M${W * 0.46} 130 L${W * 0.52} 230 L${W * 0.44} 320 L${W * 0.55} 430 L${W * 0.48} ${H}" fill="none" stroke="#e5484d" stroke-width="7" stroke-linejoin="round" opacity="0"/>`;
    const d = svgDiv(W, H, s, 'gx-mansion'); d.firstChild.style.transformOrigin = '50% 100%';
    d.firstChild.setAttribute('width', W * scale); d.firstChild.setAttribute('height', H * scale);
    const el = place(d, x, y, { parent, anchor: 'bottom', z: 3, glow: false }); scenery(el);
    el.style.transformOrigin = '50% 100%';
    const fl = el.querySelectorAll('.fl'), roof = el.querySelector('.roof'), crack = el.querySelector('.crack');
    let bt0 = 99, bdur = 1, ct0 = 99;
    el.build = (t0, dur = 1.6) => { bt0 = t0; bdur = dur; tw(el, t0 - 0.05, 0.05, { opacity: [0, 1] }); for (let f = 0; f < floors; f++) sfx('real/impact-wood', t0 + (f / floors) * dur, 0.22, 0.4); return el; };
    el.crack = (t0) => { ct0 = t0; sfx('real/glass-crack', t0, 0.45, 1.2); sfx('real/rock-crumble', t0 + 0.1, 0.3, 1.5); return el; };
    // falls flat backwards like a cardboard front (squashes toward the ground; never rotates through the floor)
    el.topple = (t0, dur = 0.7) => {
      const sv = el.querySelector('svg'); sfx('real/collapse', t0 + 0.1, 0.55, 1.5);
      on((t) => { const k = Math.max(0, Math.min(1, (t - t0) / dur)); const e = EASE.in(k); sv.style.transform = `scaleY(${(1 - 0.97 * e).toFixed(3)}) skewX(${(-8 * Math.sin(Math.PI * k)).toFixed(2)}deg)`; });
      return el;
    };
    on((t) => {
      fl.forEach((g, f) => { const k = Math.max(0, Math.min(1, (t - bt0 - (f / floors) * bdur) / 0.25)); g.setAttribute('opacity', k); g.setAttribute('transform', `translate(0 ${((1 - k) * -60).toFixed(1)})`); });
      const kr = Math.max(0, Math.min(1, (t - bt0 - bdur) / 0.3)); roof.setAttribute('opacity', kr); roof.setAttribute('transform', `translate(0 ${(((1 - kr) * -60) + (H - floors * FH - 120)).toFixed(1)})`);
      crack.setAttribute('opacity', t >= ct0 ? 1 : 0);
      if (t >= ct0) { const len = 900, p = Math.min(1, (t - ct0) / 0.35); crack.style.strokeDasharray = len; crack.style.strokeDashoffset = len * (1 - p); }
    });
    el.W = W; el.H = H;
    return el;
  }
  function crashChart(x, y, w, h, t0, dur, { parent } = {}) {
    let up = '', dn = '';
    for (let i = 0; i <= 40; i++) { const p = i / 40; const v = 0.25 + 0.6 * p + Math.sin(p * 18) * 0.04; up += (i ? 'L' : 'M') + (p * w * 0.62).toFixed(1) + ' ' + (h - v * h).toFixed(1) + ' '; }
    dn = `M${(w * 0.62).toFixed(1)} ${(h - 0.85 * h).toFixed(1)} L${w * 0.7} ${h * 0.45} L${w * 0.74} ${h * 0.52} L${w * 0.82} ${h * 0.78} L${w * 0.86} ${h * 0.7} L${w} ${h * 0.97}`;
    const el = place(svgDiv(w, h, `<path d="M0 0 V${h} H${w}" stroke="#777" stroke-width="4" fill="none"/><path class="up" d="${up}" stroke="#fff" stroke-width="8" fill="none" stroke-linejoin="round"/><path class="dn" d="${dn}" stroke="#e5484d" stroke-width="10" fill="none" stroke-linejoin="round"/>`, 'gx-chart2'), x, y, { parent, z: 6 });
    prop(el); tw(el, t0 - 0.2, 0.2, { opacity: [0, 1] });
    tw(el.querySelector('.up'), t0 - 0.2, dur * 0.35, { draw: [0, 1] }, 'linear');
    tw(el.querySelector('.dn'), t0 + dur * 0.2, dur * 0.4, { draw: [0, 1] }, 'in');
    return el;
  }
  function billRain(x, floorY, t0, t1, { parent, every = 0.16, spread = 260 } = {}) {
    let i = 0;
    for (let t = t0; t < t1; t += every, i++) {
      const d = svgDiv(90, 62, `<rect x="2" y="2" width="86" height="58" rx="6" fill="#f2f2f2"/><path d="M6 8 L45 36 L84 8" stroke="#888" stroke-width="4" fill="none"/><text x="45" y="54" text-anchor="middle" font-family="Space Mono,monospace" font-weight="700" font-size="14" fill="#e5484d">BILL</text>`, 'gx-bill');
      const bx = x + (rand(i * 3.1) - 0.5) * spread, restY = floorY - 30 - Math.floor(i / 4) * 22;
      const el = place(d, bx, -80, { parent, z: 7, glow: false });
      tw(el, t, 0.05, { opacity: [0, 1] }); tw(el, t, 0.6, { y: [0, restY + 80], rotate: [rand(i) * 80 - 40, rand(i * 7) * 30 - 15] }, 'in');
      if (i % 2 === 0) sfx('real/paper-move', t + 0.5, 0.18, 0.5);
    }
  }
  function coat(x, y, { parent } = {}) {
    const el = place(svgDiv(760, 900, `<path d="M60 900 L110 140 Q380 40 650 140 L700 900 Z" fill="#2a2d36" stroke="#d6d6d6" stroke-width="8"/><path d="M380 120 L380 900" stroke="#15171d" stroke-width="10"/><path d="M380 120 L290 330 L380 420 L470 330 Z" fill="#1d2027" stroke="#d6d6d6" stroke-width="6"/><path d="M386 470 L560 520 M372 600 L190 660 M392 740 L560 800" stroke="#555a66" stroke-width="6" stroke-dasharray="14 10"/>`, 'gx-coat'), x, y, { parent, z: 4, glow: false });
    scenery(el);
    el.pin = (i, t0, px, py) => {
      const p = place(svgDiv(220, 70, `<path d="M18 35 Q18 10 45 10 H200 Q212 10 212 22 V48 Q212 60 200 60 H60" fill="none" stroke="#e8e8e8" stroke-width="8" stroke-linecap="round"/><circle cx="35" cy="35" r="20" fill="none" stroke="#e8e8e8" stroke-width="8"/><path d="M196 18 L196 52" stroke="#f5c542" stroke-width="12" stroke-linecap="round"/>`, 'gx-pin'), px, py, { parent, z: 8 });
      tw(p, t0, 0.01, { opacity: [0, 1] }); tw(p, t0, 0.25, { scale: [1.8, 1], rotate: [-30, -8 + i * 6] }, 'back');
      sfx('real/pop-click', t0 + 0.2, 0.4, 0.5);
      return p;
    };
    return el;
  }
  function jar(x, y, label, { parent, cols = 6, rows = 9 } = {}) {
    const Wd = 440, Hd = 560;
    const el = place(svgDiv(Wd, Hd + 20, `<rect class="glass" x="20" y="60" width="${Wd - 40}" height="${Hd - 60}" rx="40" fill="rgba(160,200,230,.06)" stroke="#e6e6e6" stroke-width="7"/><rect x="60" y="14" width="${Wd - 120}" height="52" rx="10" fill="#e6e6e6" stroke="#e6e6e6" stroke-width="6"/><text x="${Wd / 2}" y="50" text-anchor="middle" font-family="Space Mono,monospace" font-weight="700" font-size="26" fill="#111">${label}</text><g class="pieces"></g>`, 'gx-jar'), x, y, { parent, anchor: 'bottom', z: 6, glow: false });
    prop(el);
    const G = el.querySelector('.pieces'), bw = (Wd - 80) / cols, bh = 46;
    el.slotPos = (i) => ({ x: 40 + (i % cols) * bw, y: Hd - 30 - (Math.floor(i / cols) + 1) * bh });
    el.add = (i, t0) => {
      const s = el.slotPos(i), NS = 'http://www.w3.org/2000/svg', r = document.createElementNS(NS, 'rect');
      r.setAttribute('width', (bw - 6).toFixed(1)); r.setAttribute('height', bh - 6); r.setAttribute('rx', 6); r.setAttribute('fill', '#f5c542'); r.setAttribute('stroke', '#fff3c9'); r.setAttribute('stroke-width', 3);
      G.appendChild(r);
      on((t) => { const k = Math.max(0, Math.min(1, (t - t0) / 0.28)); r.setAttribute('opacity', k > 0 ? 1 : 0); r.setAttribute('x', (s.x + 3).toFixed(1)); r.setAttribute('y', (s.y + 3 - (1 - EASE.in(k)) * Math.min(160, s.y - 70)).toFixed(1)); });
    };
    el.glow = (t0) => { el.dataset.glowColor = '245,197,66'; el.dataset.glow = ''; tw(el, t0, 0.6, { glow: [0, 1.4] }); return el; };
    el.W = Wd; el.H = Hd;
    return el;
  }
  function oldCar(x, y, { parent } = {}) {
    const el = place(svgDiv(360, 170, `<path d="M20 130 V100 L60 92 L105 45 H230 L285 92 L340 100 V130 Z" fill="#2a2d36" stroke="#d6d6d6" stroke-width="6" stroke-linejoin="round"/><path d="M118 56 H220 L262 92 H100 Z" fill="#1b1d24" stroke="#d6d6d6" stroke-width="4"/><path d="M150 70 L168 84 M190 100 L210 112 L198 122" stroke="#8a8f9c" stroke-width="4" fill="none"/><circle cx="90" cy="132" r="30" fill="#0d0d0f" stroke="#d6d6d6" stroke-width="6"/><circle cx="275" cy="132" r="30" fill="#0d0d0f" stroke="#d6d6d6" stroke-width="6"/><rect x="292" y="70" width="64" height="30" rx="4" fill="#e6e6e6"/><text x="324" y="92" text-anchor="middle" font-family="Space Mono,monospace" font-weight="700" font-size="16" fill="#111">USED</text>`, 'gx-oldcar'), x, y, { parent, anchor: 'bottom', z: 6, glow: false });
    return prop(el);
  }
  const LUX = {
    watch: `<circle cx="60" cy="60" r="38" fill="#15171d" stroke="#f5c542" stroke-width="7"/><path d="M60 60 V36 M60 60 L76 70" stroke="#fff" stroke-width="5" stroke-linecap="round"/><rect x="44" y="0" width="32" height="22" rx="6" fill="#f5c542"/><rect x="44" y="98" width="32" height="22" rx="6" fill="#f5c542"/>`,
    yacht: `<path d="M6 80 H114 L98 104 H22 Z" fill="#fff"/><path d="M60 80 V14 L100 72 Z" fill="#f5c542"/><path d="M56 80 V24 L24 72 Z" fill="#ddd"/>`,
    car: `<path d="M6 88 V70 L28 64 L46 40 H86 L104 64 L116 70 V88 Z" fill="#f5c542"/><circle cx="34" cy="90" r="12" fill="#111" stroke="#fff" stroke-width="4"/><circle cx="90" cy="90" r="12" fill="#111" stroke="#fff" stroke-width="4"/>`,
    ring: `<circle cx="60" cy="72" r="34" fill="none" stroke="#f5c542" stroke-width="10"/><path d="M42 30 L60 8 L78 30 L60 46 Z" fill="#cfefff" stroke="#fff" stroke-width="4"/>`,
  };
  function luxury(name, x, y, { parent, size = 120 } = {}) {
    const d = svgDiv(120, 120, LUX[name], 'gx-lux'); d.firstChild.setAttribute('width', size); d.firstChild.setAttribute('height', size);
    const el = place(d, x, y, { parent, z: 8 }); el.dataset.glowColor = '245,197,66';
    return prop(el);
  }


  // ---------------- tech & business props (Kodak story; reusable) ----------------
  function protoCamera(x, y, { parent, size = 1 } = {}) {         // boxy 1970s prototype: body, lens, cassette deck
    const el = place(svgDiv(300 * size, 200 * size, `<g transform="scale(${size})"><rect x="10" y="40" width="230" height="150" rx="14" fill="#1b1d24" stroke="#e6e6e6" stroke-width="6"/><circle cx="270" cy="115" r="34" fill="#0d0e12" stroke="#e6e6e6" stroke-width="6"/><circle cx="270" cy="115" r="16" fill="none" stroke="#9fd3ff" stroke-width="4"/><rect x="34" y="70" width="120" height="66" rx="6" fill="#0d0e12" stroke="#bdbdbd" stroke-width="4"/><circle cx="66" cy="103" r="14" fill="none" stroke="#bdbdbd" stroke-width="4"/><circle cx="122" cy="103" r="14" fill="none" stroke="#bdbdbd" stroke-width="4"/><rect x="176" y="62" width="44" height="20" rx="4" fill="#e5484d"/><rect x="40" y="18" width="70" height="26" rx="6" fill="#1b1d24" stroke="#e6e6e6" stroke-width="5"/></g>`, 'gx-protocam'), x, y, { parent, z: 7, glow: false });
    return prop(el);
  }
  function flash(t0, { parent } = {}) {                                // camera flash: white screen pop
    const f = document.createElement('div'); f.style.cssText = 'width:1080px;height:1920px;background:#fff';
    const el = place(f, 540, 960, { parent: parent || document.getElementById('stage'), z: 39, glow: false });
    tw(el, t0, 0.03, { opacity: [0, 0.85] }); tw(el, t0 + 0.04, 0.35, { opacity: [0.85, 0] });
    sfx('real/pop-click', t0, 0.5, 0.4); return el;
  }
  function drawer(x, y, { parent } = {}) {                             // filing cabinet; .open(t, amount) / .close(t)
    const el = place(svgDiv(420, 560, `<rect x="10" y="10" width="400" height="540" rx="14" fill="#15171d" stroke="#e6e6e6" stroke-width="6"/><rect x="40" y="40" width="340" height="140" rx="8" fill="#1b1d24" stroke="#9a9a9a" stroke-width="4"/><rect x="40" y="380" width="340" height="140" rx="8" fill="#1b1d24" stroke="#9a9a9a" stroke-width="4"/><rect x="180" y="100" width="60" height="14" rx="7" fill="#9a9a9a"/><rect x="180" y="440" width="60" height="14" rx="7" fill="#9a9a9a"/><g class="dr"><rect x="40" y="210" width="340" height="140" rx="8" fill="#1f2229" stroke="#e6e6e6" stroke-width="5"/><rect x="180" y="270" width="60" height="14" rx="7" fill="#e6e6e6"/><text x="210" y="252" text-anchor="middle" font-family="Space Mono,monospace" font-weight="700" font-size="20" fill="#e6e6e6">1975</text></g>`, 'gx-drawer'), x, y, { parent, anchor: 'bottom', z: 5, glow: false });
    scenery(el);
    const dr = el.querySelector('.dr'), keys = [[-99, 0]];
    el.open = (t0, a = 1) => { keys.push([t0, a]); return el; }; el.close = (t0) => { keys.push([t0, 0]); return el; };
    on((t) => { let v = 0, prev = 0; for (const [k0, a] of keys) if (t >= k0) { const p = EASE.inOut(Math.min(1, (t - k0) / 0.5)); v = prev + (a - prev) * p; prev = a; } dr.setAttribute('transform', `translate(0 ${(v * 90).toFixed(1)}) scale(1 ${(1 + v * 0.06).toFixed(3)})`); });
    return el;
  }
  const OBJ = {
    film: `<circle cx="70" cy="70" r="58" fill="#1b1d24" stroke="#e6e6e6" stroke-width="7"/><circle cx="70" cy="70" r="18" fill="#0d0e12" stroke="#e6e6e6" stroke-width="5"/>${[0, 60, 120, 180, 240, 300].map((a) => `<circle cx="${70 + 38 * Math.cos(a * Math.PI / 180)}" cy="${70 + 38 * Math.sin(a * Math.PI / 180)}" r="9" fill="#0d0e12"/>`).join('')}<path d="M126 70 H230 V128 H126" fill="#2a2416" stroke="#f5c542" stroke-width="5"/>`,
    bottle: `<rect x="40" y="10" width="40" height="30" rx="4" fill="#e6e6e6"/><path d="M28 40 H92 L112 80 V200 Q112 214 98 214 H22 Q8 214 8 200 V80 Z" fill="#1b1d24" stroke="#e6e6e6" stroke-width="6"/><rect x="22" y="110" width="76" height="60" rx="6" fill="#e6e6e6"/><path d="M38 140 H82" stroke="#111" stroke-width="6"/>`,
    paper: `<rect x="14" y="14" width="160" height="190" rx="8" fill="#f2f2f2" transform="rotate(-6 94 110)"/><rect x="34" y="34" width="120" height="110" rx="4" fill="#2a2d36" transform="rotate(-6 94 110)"/><circle cx="74" cy="78" r="16" fill="#f5c542" transform="rotate(-6 94 110)"/><path d="M40 140 L80 104 L104 124 L150 84 V144 Z" fill="#9a9a9a" transform="rotate(-6 94 110)"/>`,
    phone: `<rect x="6" y="6" width="96" height="180" rx="16" fill="#0d0e12" stroke="#e6e6e6" stroke-width="6"/><rect x="16" y="22" width="76" height="140" rx="6" fill="#9fd3ff" opacity=".85"/><circle cx="54" cy="174" r="5" fill="#e6e6e6"/>`,
    app: `<rect x="10" y="10" width="160" height="160" rx="40" fill="#1b1d24" stroke="#f5c542" stroke-width="8"/><rect x="44" y="52" width="92" height="76" rx="16" fill="none" stroke="#fff" stroke-width="8"/><circle cx="90" cy="90" r="20" fill="none" stroke="#fff" stroke-width="8"/><circle cx="120" cy="64" r="5" fill="#fff"/>`,
  };
  const OBJ_SIZE = { film: [240, 140], bottle: [120, 220], paper: [190, 220], phone: [108, 192], app: [180, 180] };
  function thing(name, x, y, { parent, scale = 1, z = 7 } = {}) {      // film | bottle | paper | phone | app
    const [w, h] = OBJ_SIZE[name]; const d = svgDiv(w, h, OBJ[name], 'gx-thing gx-' + name);
    d.firstChild.setAttribute('width', w * scale); d.firstChild.setAttribute('height', h * scale);
    return prop(place(d, x, y, { parent, z, glow: false }));
  }
  function brandTower(x, y, label, { parent, w = 300, h = 640 } = {}) { // building with a name sign; .lightsOut(t0, dur)
    const el = place(svgDiv(w, h + 70, `<rect x="${w * 0.1}" y="70" width="${w * 0.8}" height="${h}" fill="#13151b" stroke="#d0d0d0" stroke-width="5"/>${windowsGrid(w * 0.18, 110, 4, Math.floor((h - 60) / 52), w * 0.17, 52, 1.0, 11)}<rect x="${w * 0.12}" y="8" width="${w * 0.76}" height="54" rx="8" fill="#e6e6e6"/><text x="${w / 2}" y="46" text-anchor="middle" font-family="Space Mono,monospace" font-weight="700" font-size="30" fill="#111">${label}</text>`, 'gx-brandtower'), x, y, { parent, anchor: 'bottom', z: 3, glow: false });
    scenery(el);
    const wins = [...el.querySelectorAll('.win')];
    el.lightsOut = (t0, dur = 1.5) => { wins.forEach((wn, i) => { const tt = t0 + rand(i * 2.7) * dur; on((t) => wn.setAttribute('fill', t >= tt ? '#20232c' : '#f5d37a')); }); return el; };
    return el;
  }
  function brickWall(x, y, { parent, cols = 6, rows = 5, bw = 92, bh = 46 } = {}) { // .rise(t0, dur): rows build up
    const NS = 'http://www.w3.org/2000/svg'; const W = cols * bw + bw / 2, H = rows * bh;
    const el = place(svgDiv(W, H, '', 'gx-wall'), x, y, { parent, anchor: 'bottom', z: 6, glow: false }); prop(el);
    const sv = el.querySelector('svg'), bricks = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const b = document.createElementNS(NS, 'rect'); const off = r % 2 ? bw / 2 : 0;
      b.setAttribute('x', c * bw + off + 3); b.setAttribute('y', H - (r + 1) * bh + 3); b.setAttribute('width', bw - 6); b.setAttribute('height', bh - 6); b.setAttribute('rx', 4);
      b.setAttribute('fill', '#2a2d36'); b.setAttribute('stroke', '#d6d6d6'); b.setAttribute('stroke-width', 3); sv.appendChild(b); bricks.push([b, r, c]);
    }
    el.rise = (t0, dur = 1.6) => { bricks.forEach(([b, r, c]) => { const tt = t0 + (r / rows) * dur + c * 0.02; on((t) => { const k = Math.max(0, Math.min(1, (t - tt) / 0.15)); b.setAttribute('opacity', k); b.setAttribute('transform', `translate(0 ${((1 - k) * -30).toFixed(1)})`); }); }); for (let r = 0; r < rows; r++) sfx('real/impact-wood', t0 + (r / rows) * dur, 0.2, 0.3); return el; };
    return el;
  }
  function link(x1, y1, x2, y2, t0, { parent, cut = 0 } = {}) {        // arrow that draws; optional red cut ✗ at time `cut`
    const el = place(svgDiv(1080, 1920, `<path class="ln" d="M${x1} ${y1} L${x2} ${y2}" stroke="#e6e6e6" stroke-width="6" stroke-dasharray="16 12" fill="none"/><path d="M${x2} ${y2} l${-18 * Math.sign(x2 - x1 || 1)} -12 M${x2} ${y2} l${-18 * Math.sign(x2 - x1 || 1)} 12" stroke="#e6e6e6" stroke-width="6" fill="none"/>${cut ? `<path class="x" d="M${(x1 + x2) / 2 - 30} ${(y1 + y2) / 2 - 30} l60 60 M${(x1 + x2) / 2 + 30} ${(y1 + y2) / 2 - 30} l-60 60" stroke="#ff5a5f" stroke-width="12" stroke-linecap="round" fill="none"/>` : ''}`, 'gx-link'), 540, 960, { parent, z: 4, glow: false });
    el.dataset.overlapOk = ''; tw(el, t0, 0.3, { opacity: [0, 1] });
    if (cut) { const xx = el.querySelector('.x'); on((t) => xx.setAttribute('opacity', t >= cut ? 1 : 0)); tw(el.querySelector('.ln'), cut, 0.3, { opacity: [1, 0.25] }); sfx('real/impact-blow', cut, 0.45, 0.8); }
    return el;
  }

  Object.assign(window, { protoCamera, flash, drawer, thing, brandTower, brickWall, link, stageSet, enter, leave, sceneSwap, snow, townHouse, library, hospital, tower, stamp, balance, stairs, mansion, crashChart, billRain, coat, jar, oldCar, luxury });
})();
