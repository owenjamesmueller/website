/* Mode A STORY SETS — full-frame places a character story happens in, so beats don't float on black.
 * Load after props.js. All accept { parent }. Backdrops are marked data-overlap-ok (characters stand in front of them).
 *
 *   classroom({ board })            chalkboard wall + clock + window   -> .write(text, t0, dur)  (chalk handwriting)
 *   schoolDesk(x, floorY, {size})   front-view desk; put a person at floorY-40*size behind it (desk hides the legs)
 *   bedroom()                       night wall: window with moon/stars, poster, bed      -> .clock(text)
 *   deskFront(x, floorY, {laptop})  desk seen from the front, laptop back glowing          -> .glow(t0)
 *   codeScreen(x, y, {w, h})        laptop close-up: .code(t0, t1, every), .crack(t0), .crash(t0, t1), .ok(t0, text), .video(t0, t1)
 *   nightHouse(x, floorY)           house at night, one lit window                         -> .lamp(t0)
 *   nightSky()                      moon + twinkling stars
 *   tvGlow(x, floorY)               TV on a stand flickering game colours
 *   bakery(x, floorY, {sign})       storefront with striped awning                         -> .lights(t0)
 *   shopRow(floorY, n, {w, y0})     a street of small shops                                -> .light(i, t0)
 *   officeWindow()                  floor-to-ceiling window with a lit skyline
 *   testPaper(x, y, {grade})        graded test with a circled red grade
 *   bigPhone(x, y)                  phone close-up                                         -> .order(i, text, t0)
 *   appForm(x, y)                   job application (photo, fields)                        -> .fill(i, text, t0, dur), .photo(t0)
 *   tears(x, y, t0, t1)             falling tear drops
 *   rejectWall(x, y, {cols, rows})  wall filling with rejection letters  -> .add(i, t), .fill(t0, t1, n), .highlight(i, t)
 *   inbox(x, y, {w, h})             email app                              -> .mail(i, from, subject, t, tone), .open(t0, t1, from, lines, hlWord)
 *   storefront(x, floorY, sign)     a named shop (sign text shrinks to fit) -> .lights(t0)      siteCard(x, y, label)  a small website
 *   network(x, y, {levels})         referral tree that grows 1 -> 3 -> 9  -> .grow(t0, every), .count
 *   diningTable(x, floorY)          family table with plates (people sit behind it)
 *   All SVG text here auto-shrinks to fit its box (fit()); render.cjs --check verifies it.
 */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const sv = (w, h, inner, cls) => { const d = document.createElement('div'); d.className = 'gx-svg gx-prop ' + cls; d.innerHTML = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="overflow:visible">${inner}</svg>`; return d; };
  const back = (el) => { el.dataset.overlapOk = ''; el.dataset.scenery = ''; return el; };
  const node = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); parent && parent.appendChild(n); return n; };
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  // colour fade (never snap a colour: a 1-frame switch reads as a stutter)
  const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const mixc = (a, b, p) => { const A = hex(a), B = hex(b); return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * clamp01(p))).join(',') + ')'; };
  const MONO = "font-family=\"Space Mono,monospace\" font-weight=\"700\"";

  function classroom({ parent, board = '' } = {}) {
    const el = back(place(sv(1080, 760, `
      <rect x="150" y="70" width="780" height="300" rx="10" fill="#0f1a16" stroke="#e6e6e6" stroke-width="8"/>
      <rect x="130" y="370" width="820" height="16" rx="6" fill="#e6e6e6"/>
      <rect x="250" y="360" width="60" height="12" rx="4" fill="#f2f2f2"/>
      <g class="chalk"></g>
      <circle cx="1000" cy="130" r="48" fill="#0d0e12" stroke="#e6e6e6" stroke-width="6"/><path class="hand" d="M1000 130 V98 M1000 130 L1022 140" stroke="#e6e6e6" stroke-width="6" stroke-linecap="round"/>
      <rect x="18" y="80" width="96" height="230" rx="6" fill="#141820" stroke="#9a9a9a" stroke-width="5"/><path d="M66 80 V310 M18 195 H114" stroke="#9a9a9a" stroke-width="4"/>
      <path d="M0 640 H1080" stroke="#2a2d36" stroke-width="4"/>`, 'gx-classroom'), 540, 1300, { parent, anchor: 'bottom', z: 1, glow: false }));
    const ch = el.querySelector('.chalk'); let line = 0;
    el.write = (text, t0, dur = 0.8, { size = 64, color = '#f2f2f2' } = {}) => {
      const y = 150 + line++ * 90, id = 'clip' + Math.round(rand(t0 + line) * 1e9);
      const cp = node('clipPath', { id }, ch); const r = node('rect', { x: 180, y: y - 70, width: 0, height: 100 }, cp);
      const tx = node('text', { x: 190, y, 'font-family': 'Space Mono,monospace', 'font-weight': 700, 'font-size': size, fill: color, 'clip-path': `url(#${id})`, 'font-style': 'italic' }, ch); tx.textContent = text;
      on((t) => r.setAttribute('width', 720 * clamp01((t - t0) / dur)));
      sfx('real/chalk-line', t0, 0.25, dur);
      return el;
    };
    if (board) el.write(board, -1, 0.01);
    return el;
  }
  function schoolDesk(x, floorY, { parent, size = 1 } = {}) {
    const el = place(sv(260 * size, 170 * size, `<g transform="scale(${size})"><rect x="0" y="0" width="260" height="24" rx="6" fill="#1b1d24" stroke="#e6e6e6" stroke-width="6"/><rect x="22" y="24" width="216" height="96" rx="4" fill="#111318" stroke="#bdbdbd" stroke-width="5"/><path d="M34 120 V170 M226 120 V170" stroke="#bdbdbd" stroke-width="8" stroke-linecap="round"/></g>`, 'gx-schooldesk'), x, floorY, { parent, anchor: 'bottom', z: 6, glow: false });
    el.dataset.overlapOk = '';
    return el;
  }
  function nightSky({ parent, moonX = 860, moonY = 420 } = {}) {
    let st = ''; for (let i = 0; i < 40; i++) st += `<circle class="star" cx="${(rand(i * 3.7) * 1080).toFixed(0)}" cy="${(280 + rand(i * 5.1) * 520).toFixed(0)}" r="${(1.5 + rand(i) * 2.5).toFixed(1)}" fill="#fff"/>`;
    const el = back(place(sv(1080, 1920, `${st}<circle cx="${moonX}" cy="${moonY}" r="70" fill="#f2efe0"/><circle cx="${moonX + 32}" cy="${moonY - 20}" r="62" fill="#050505"/>`, 'gx-sky'), 540, 960, { parent, z: 0, glow: false }));
    const stars = [...el.querySelectorAll('.star')];
    on((t) => stars.forEach((s, i) => s.setAttribute('opacity', (0.35 + 0.65 * Math.abs(Math.sin(t * (0.8 + rand(i) * 1.5) + i))).toFixed(2))));
    return el;
  }
  function bedroom({ parent } = {}) {
    let st = ''; for (let i = 0; i < 9; i++) st += `<circle cx="${150 + rand(i * 2.3) * 200}" cy="${110 + rand(i * 4.1) * 180}" r="2.5" fill="#fff"/>`;
    const el = back(place(sv(1080, 760, `
      <rect x="100" y="60" width="300" height="300" rx="10" fill="#0a0f1c" stroke="#e6e6e6" stroke-width="8"/><path d="M250 60 V360 M100 210 H400" stroke="#e6e6e6" stroke-width="6"/>
      ${st}<circle cx="330" cy="130" r="38" fill="#f2efe0"/><circle cx="348" cy="118" r="34" fill="#0a0f1c"/>
      <rect x="640" y="80" width="190" height="250" rx="6" fill="#16181f" stroke="#9a9a9a" stroke-width="5" transform="rotate(4 735 205)"/><path d="M680 150 L735 120 L790 150 L735 280 Z" fill="none" stroke="#f5c542" stroke-width="5" transform="rotate(4 735 205)"/>
      <path d="M0 640 H1080" stroke="#2a2d36" stroke-width="4"/>`, 'gx-bedroom'), 540, 1300, { parent, anchor: 'bottom', z: 1, glow: false }));
    return el;
  }
  function deskFront(x, floorY, { parent, laptop = true, clock = '' } = {}) {
    const el = place(sv(560, 300, `
      ${laptop ? `<path class="lid" d="M170 10 H390 L400 150 H160 Z" fill="#1b1d24" stroke="#e6e6e6" stroke-width="6" stroke-linejoin="round"/><circle cx="280" cy="80" r="14" fill="none" stroke="#bdbdbd" stroke-width="4"/>` : ''}
      ${clock ? `<rect x="440" y="100" width="110" height="50" rx="8" fill="#0d0e12" stroke="#bdbdbd" stroke-width="4"/><text x="495" y="134" text-anchor="middle" ${MONO} font-size="24" fill="#ff5a5f">${clock}</text>` : ''}
      <rect x="0" y="150" width="560" height="30" rx="6" fill="#1b1d24" stroke="#e6e6e6" stroke-width="6"/><rect x="30" y="180" width="500" height="80" fill="#111318" stroke="#bdbdbd" stroke-width="5"/><path d="M50 260 V300 M510 260 V300" stroke="#bdbdbd" stroke-width="8" stroke-linecap="round"/>`, 'gx-deskfront'), x, floorY, { parent, anchor: 'bottom', z: 6, glow: false });
    el.dataset.overlapOk = '';
    el.glow = (t0) => { el.dataset.glowColor = '159,211,255'; el.dataset.glow = ''; tw(el, t0, 0.5, { glow: [0, 0.9] }); return el; };
    return el;
  }
  function codeScreen(x, y, { parent, w = 880, h = 620, file = 'app.js' } = {}) {
    const el = place(sv(w, h + 60, `
      <rect x="0" y="0" width="${w}" height="${h}" rx="26" fill="#0b0d12" stroke="#e6e6e6" stroke-width="8"/>
      <rect x="22" y="22" width="${w - 44}" height="${h - 44}" rx="10" fill="#0e1320"/>
      <rect x="22" y="22" width="${w - 44}" height="54" rx="10" fill="#161c2b"/><circle cx="56" cy="49" r="9" fill="#ff5a5f"/><circle cx="86" cy="49" r="9" fill="#f5c542"/><circle cx="116" cy="49" r="9" fill="#4ade80"/>
      <text x="${w / 2}" y="58" text-anchor="middle" ${MONO} font-size="24" fill="#9aa4b8">${file}</text>
      <clipPath id="cs${x}${y}"><rect x="22" y="80" width="${w - 44}" height="${h - 104}"/></clipPath>
      <g clip-path="url(#cs${x}${y})"><g class="lines"></g></g>
      <path class="crackp" d="M${w * 0.62} 22 L${w * 0.55} ${h * 0.3} L${w * 0.66} ${h * 0.42} L${w * 0.58} ${h * 0.7} L${w * 0.64} ${h - 22} M${w * 0.55} ${h * 0.3} L${w * 0.42} ${h * 0.36} M${w * 0.58} ${h * 0.7} L${w * 0.75} ${h * 0.78}" stroke="#e6e6e6" stroke-width="4" fill="none" opacity="0"/>
      <g class="vid" opacity="0"><rect x="${w * 0.22}" y="${h * 0.22}" width="${w * 0.56}" height="${h * 0.5}" rx="14" fill="#1b2235" stroke="#9fd3ff" stroke-width="5"/><path d="M${w * 0.46} ${h * 0.36} L${w * 0.58} ${h * 0.47} L${w * 0.46} ${h * 0.58} Z" fill="#fff"/><rect x="${w * 0.25}" y="${h * 0.66}" width="${w * 0.5}" height="8" rx="4" fill="#2a3450"/><rect class="vbar" x="${w * 0.25}" y="${h * 0.66}" width="0" height="8" rx="4" fill="#ff5a5f"/></g>
      <g class="crash" opacity="0"><rect x="22" y="22" width="${w - 44}" height="${h - 44}" rx="10" fill="#3a0d10"/><text x="${w / 2}" y="${h * 0.48}" text-anchor="middle" ${MONO} font-size="84" fill="#ff5a5f">CRASHED</text><text x="${w / 2}" y="${h * 0.62}" text-anchor="middle" ${MONO} font-size="28" fill="#ffb3b5">fatal error · 4,612 problems</text></g>
      <g class="okp" opacity="0"><rect x="${w * 0.18}" y="${h * 0.34}" width="${w * 0.64}" height="${h * 0.3}" rx="20" fill="#0f2a1a" stroke="#4ade80" stroke-width="6"/><text class="okt" x="${w / 2}" y="${h * 0.52}" text-anchor="middle" ${MONO} font-size="44" fill="#4ade80">IT WORKS</text></g>
      <path d="M${-40} ${h + 6} H${w + 40} L${w + 10} ${h + 50} H-10 Z" fill="#1b1d24" stroke="#e6e6e6" stroke-width="6" stroke-linejoin="round"/>`, 'gx-codescreen'), x, y, { parent, z: 6, glow: false });
    const L = el.querySelector('.lines'), lh = 40, maxL = Math.floor((h - 110) / lh), cols = ['#9fd3ff', '#f5c542', '#ff8fa3', '#b8f5c4', '#c7cbd6', '#c4a7ff'];
    el.code = (t0, t1, every = 0.12, { errs = [] } = {}) => {
      const n = Math.ceil((t1 - t0) / every), rows = [];
      for (let i = 0; i < n; i++) {
        const g = node('g', {}, L), ind = [0, 1, 2, 1, 2, 3, 1, 0][i % 8] * 34, segs = 1 + Math.floor(rand(i * 1.7 + t0) * 3);
        let xx = 70 + ind;
        node('text', { x: 34, y: 112 + i * lh, 'font-family': 'Space Mono,monospace', 'font-size': 20, fill: '#4b5468' }, g).textContent = String(i + 1);
        for (let k = 0; k < segs; k++) { const sw = 60 + rand(i * 3 + k + t0) * 160; node('rect', { x: xx, y: 96 + i * lh, width: sw.toFixed(0), height: 18, rx: 6, fill: cols[Math.floor(rand(i * 7 + k) * cols.length)] }, g); xx += sw + 18; if (xx > w - 160) break; }
        if (errs.includes(i)) node('path', { d: `M70 ${120 + i * lh} q12 8 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0`, stroke: '#ff5a5f', 'stroke-width': 4, fill: 'none' }, g);
        rows.push([g, t0 + i * every]);
      }
      on((t) => {
        let shown = 0; rows.forEach(([g, tt]) => { const p = clamp01((t - tt) / 0.14), e = EASE.out(p); g.setAttribute('opacity', p.toFixed(3)); g.setAttribute('transform', `translate(${((1 - e) * -24).toFixed(1)} 0)`); shown += e; });
        L.setAttribute('transform', `translate(0 ${(-Math.max(0, shown - maxL) * lh).toFixed(1)})`);
      });
      return el;
    };
    el.crack = (t0) => { const c = el.querySelector('.crackp'); on((t) => c.setAttribute('opacity', (0.85 * clamp01((t - t0) / 0.08)).toFixed(3))); sfx('real/glass-crack', t0, 0.22, 0.8); return el; };
    el.video = (t0, t1) => { const v = el.querySelector('.vid'), b = el.querySelector('.vbar'); on((t) => { v.setAttribute('opacity', (clamp01((t - t0) / 0.15) * clamp01((t1 - t) / 0.15)).toFixed(3)); b.setAttribute('width', (w * 0.5 * clamp01((t - t0) / (t1 - t0))).toFixed(0)); }); return el; };
    el.crash = (t0, t1 = 1e9) => { const c = el.querySelector('.crash'); on((t) => c.setAttribute('opacity', (clamp01((t - t0) / 0.12) * clamp01((t1 - t) / 0.12)).toFixed(3))); sfx('real/key-press', t0, 0.4, 0.4); return el; };
    el.ok = (t0, text = 'IT WORKS') => { const o = el.querySelector('.okp'); el.querySelector('.okt').textContent = text; on((t) => o.setAttribute('opacity', clamp01((t - t0) / 0.2))); sfx('real/win-notify', t0, 0.4, 1.2); return el; };
    return el;
  }
  function nightHouse(x, floorY, { parent, size = 1 } = {}) {
    const el = back(place(sv(520 * size, 520 * size, `<g transform="scale(${size})"><path d="M30 230 L260 40 L490 230" fill="#13151b" stroke="#e6e6e6" stroke-width="8" stroke-linejoin="round"/><rect x="60" y="230" width="400" height="290" fill="#13151b" stroke="#e6e6e6" stroke-width="8"/><rect x="220" y="370" width="90" height="150" rx="6" fill="#0d0e12" stroke="#bdbdbd" stroke-width="6"/><rect x="100" y="290" width="90" height="80" rx="4" fill="#20232c" stroke="#bdbdbd" stroke-width="5"/><rect class="lit" x="340" y="280" width="100" height="90" rx="4" fill="#20232c" stroke="#e6e6e6" stroke-width="5"/><path d="M390 280 V370 M340 325 H440" stroke="#0d0e12" stroke-width="5"/><rect x="380" y="80" width="40" height="90" fill="#13151b" stroke="#e6e6e6" stroke-width="6"/></g>`, 'gx-house'), x, floorY, { parent, anchor: 'bottom', z: 2, glow: false }));
    el.lamp = (t0, color = '#9fd3ff') => { const w = el.querySelector('.lit'); on((t) => w.setAttribute('fill', mixc('#20232c', color, (t - t0) / 0.25))); return el; };
    return el;
  }
  function tvGlow(x, floorY, { parent } = {}) {
    const el = place(sv(360, 300, `<rect x="10" y="10" width="340" height="200" rx="14" fill="#0b0d12" stroke="#e6e6e6" stroke-width="7"/><rect class="scr" x="26" y="26" width="308" height="168" rx="6" fill="#4f46e5"/><path d="M180 210 V250 M110 250 H250" stroke="#bdbdbd" stroke-width="8" stroke-linecap="round"/><rect x="40" y="250" width="280" height="50" rx="6" fill="#16181f" stroke="#9a9a9a" stroke-width="5"/>`, 'gx-tv'), x, floorY, { parent, anchor: 'bottom', z: 4, glow: false });
    const s = el.querySelector('.scr'), C = ['#4f46e5', '#e11d48', '#16a34a', '#f59e0b', '#06b6d4'];
    on((t) => { const u = t * 1.2 + Math.sin(t * 0.7), i = Math.floor(u), f = u - i; s.setAttribute('fill', mixc(C[i % C.length], C[(i + 1) % C.length], EASE.inOut(f))); });
    return el;
  }
  function bakery(x, floorY, { parent, sign = 'MOM’S BAKERY', size = 1 } = {}) {
    let aw = ''; for (let i = 0; i < 10; i++) aw += `<path d="M${40 + i * 56} 190 h56 v70 q-28 26 -56 0 z" fill="${i % 2 ? '#f2f2f2' : '#f5c542'}"/>`;
    const el = back(place(sv(640 * size, 700 * size, `<g transform="scale(${size})"><rect x="30" y="60" width="580" height="640" fill="#13151b" stroke="#e6e6e6" stroke-width="8"/><rect x="60" y="90" width="520" height="80" rx="10" fill="#e6e6e6"/><text x="320" y="146" text-anchor="middle" ${MONO} font-size="40" fill="#111">${sign}</text>${aw}
      <rect class="bw" x="70" y="320" width="300" height="230" rx="8" fill="#1a1d25" stroke="#e6e6e6" stroke-width="6"/>
      <path d="M100 520 q40 -60 80 0 z M200 520 q50 -80 100 0 z" fill="#d9a35b"/><rect x="290" y="470" width="60" height="50" rx="8" fill="#f2c6d0"/><path d="M290 470 q30 -24 60 0" fill="#fff"/>
      <rect x="420" y="380" width="150" height="320" rx="8" fill="#0d0e12" stroke="#bdbdbd" stroke-width="6"/><circle cx="445" cy="540" r="7" fill="#f5c542"/></g>`, 'gx-bakery'), x, floorY, { parent, anchor: 'bottom', z: 2, glow: false }));
    el.lights = (t0) => { const w = el.querySelector('.bw'); on((t) => w.setAttribute('fill', mixc('#1a1d25', '#3a2f14', (t - t0) / 0.3))); el.dataset.glowColor = '245,197,66'; el.dataset.glow = ''; tw(el, t0, 0.4, { glow: [0, 0.8] }); return el; };
    return el;
  }
  function shopRow(floorY, n, { parent, w = 200, y0 = 0, scale = 1, x0 } = {}) {
    let s = ''; const W = n * w;
    for (let i = 0; i < n; i++) { const X = i * w; s += `<rect x="${X + 8}" y="40" width="${w - 16}" height="250" fill="#13151b" stroke="#d0d0d0" stroke-width="5"/><path d="M${X + 4} 70 H${X + w - 4} L${X + w - 14} 110 H${X + 14} Z" fill="${i % 2 ? '#e6e6e6' : '#9a9a9a'}"/><rect class="sw" x="${X + 26}" y="140" width="${w * 0.45}" height="100" rx="5" fill="#20232c" stroke="#bdbdbd" stroke-width="4"/><rect x="${X + w * 0.62}" y="150" width="${w * 0.26}" height="140" rx="4" fill="#0d0e12" stroke="#9a9a9a" stroke-width="4"/>`; }
    const el = back(place(sv(W * scale, 290 * scale, `<g transform="scale(${scale})">${s}</g>`, 'gx-shoprow'), x0 ?? 540, floorY + y0, { parent, anchor: 'bottom', z: 2, glow: false }));
    const ws = [...el.querySelectorAll('.sw')];
    el.light = (i, t0) => { on((t) => ws[i].setAttribute('fill', mixc('#20232c', '#f5c542', (t - t0) / 0.22))); return el; };
    el.n = n;
    return el;
  }
  function officeWindow({ parent } = {}) {
    let b = '';
    for (let i = 0; i < 9; i++) { const bx = 80 + i * 105, bh = 160 + rand(i * 3.3) * 300, by = 640 - bh; b += `<rect x="${bx}" y="${by}" width="90" height="${bh}" fill="#11131a" stroke="#3a3f4c" stroke-width="3"/>`; for (let r = 0; r < bh / 34 - 1; r++) for (let c = 0; c < 3; c++) if (rand(i * 31 + r * 7 + c) < 0.5) b += `<rect x="${bx + 12 + c * 26}" y="${by + 14 + r * 34}" width="14" height="16" fill="#f5d37a" opacity=".8"/>`; }
    return back(place(sv(1080, 760, `<rect x="40" y="40" width="1000" height="600" rx="8" fill="#0a0d16" stroke="#e6e6e6" stroke-width="8"/>${b}<path d="M373 40 V640 M706 40 V640" stroke="#e6e6e6" stroke-width="8"/><path d="M0 640 H1080" stroke="#2a2d36" stroke-width="4"/>`, 'gx-office'), 540, 1300, { parent, anchor: 'bottom', z: 1, glow: false }));
  }
  function testPaper(x, y, { parent, grade = 'F', rot = 0 } = {}) {
    const el = place(sv(320, 400, `<g transform="rotate(${rot} 160 200)"><rect x="10" y="10" width="300" height="380" rx="8" fill="#f2f2f2"/><text x="30" y="60" ${MONO} font-size="26" fill="#333">MATH TEST</text>${[100, 140, 180, 220, 260, 300, 340].map((yy, i) => `<path d="M30 ${yy} H${200 + rand(i) * 80}" stroke="#9a9a9a" stroke-width="6" stroke-linecap="round"/><path d="M${230 + rand(i * 3) * 30} ${yy - 12} l20 20 m0 -20 l-20 20" stroke="#e5484d" stroke-width="5"/>`).join('')}<circle cx="240" cy="90" r="58" fill="none" stroke="#e5484d" stroke-width="8"/><text x="240" y="122" text-anchor="middle" font-family="Inter,Arial" font-weight="900" font-size="92" fill="#e5484d">${grade}</text></g>`, 'gx-test'), x, y, { parent, z: 8, glow: false });
    return el;
  }
  function bigPhone(x, y, { parent, title = 'ORDERS' } = {}) {
    const el = place(sv(420, 820, `<rect x="5" y="5" width="410" height="810" rx="60" fill="#0b0d12" stroke="#e6e6e6" stroke-width="8"/><rect x="30" y="30" width="360" height="760" rx="40" fill="#10141f"/><rect x="160" y="44" width="100" height="22" rx="11" fill="#0b0d12"/><text x="210" y="130" text-anchor="middle" ${MONO} font-size="30" fill="#9aa4b8">${title}</text><g class="cards"></g>`, 'gx-bigphone'), x, y, { parent, z: 6, glow: false });
    const G = el.querySelector('.cards');
    el.order = (i, text, t0) => {
      const g = node('g', {}, G), yy = 170 + i * 120;
      node('rect', { x: 50, y: yy, width: 320, height: 100, rx: 20, fill: '#1b2235', stroke: '#f5c542', 'stroke-width': 4 }, g);
      node('circle', { cx: 100, cy: yy + 50, r: 26, fill: '#f5c542' }, g);
      const fs = Math.min(24, Math.floor(212 / (text.length * 0.62)));   // shrink to fit the card (mono: 0.6 em per letter)
      const a = node('text', { x: 142, y: yy + 44, 'font-family': 'Space Mono,monospace', 'font-weight': 700, 'font-size': fs, fill: '#fff' }, g); a.textContent = text;
      const b = node('text', { x: 142, y: yy + 76, 'font-family': 'Space Mono,monospace', 'font-size': 20, fill: '#9aa4b8' }, g); b.textContent = 'just now';
      on((t) => { const k = clamp01((t - t0) / 0.25); g.setAttribute('opacity', k); g.setAttribute('transform', `translate(${((1 - EASE.out(k)) * 60).toFixed(1)} 0)`); });
      sfx('real/notify-bubble', t0, 0.3, 0.6);
      return el;
    };
    return el;
  }
  function appForm(x, y, { parent, title = 'JOB APPLICATION', labels = ['NAME', 'LAST JOB', 'REASON FOR LEAVING'] } = {}) {
    const el = place(sv(720, 940, `<rect x="10" y="10" width="700" height="920" rx="12" fill="#f2f2f2"/><text x="50" y="96" ${MONO} font-size="40" fill="#111">${title}</text><path d="M50 122 H670" stroke="#111" stroke-width="5"/>
      <rect x="470" y="160" width="200" height="240" rx="6" fill="#d9d9d9" stroke="#555" stroke-width="4"/><g class="ph" opacity="0"><circle cx="570" cy="215" r="24" fill="#555"/><circle cx="570" cy="262" r="44" fill="#555"/><path d="M500 400 Q500 318 570 314 Q640 318 640 400 Z" fill="#555"/><g fill="none" stroke="#d9d9d9" stroke-width="5"><circle cx="553" cy="264" r="12"/><circle cx="587" cy="264" r="12"/></g></g>
      ${labels.map((l, i) => `<text x="50" y="${200 + i * 170}" ${MONO} font-size="24" fill="#666">${l}</text><path d="M50 ${262 + i * 170} H${i ? 670 : 440}" stroke="#999" stroke-width="4"/><text class="f${i}" x="54" y="${250 + i * 170}" font-family="Inter,Arial" font-weight="800" font-size="${i === 2 ? 34 : 44}" fill="#111"></text>`).join('')}
      <path d="M50 820 H360" stroke="#999" stroke-width="4"/><text x="50" y="860" ${MONO} font-size="22" fill="#666">SIGNATURE</text>`, 'gx-form'), x, y, { parent, z: 6, glow: false });
    el.fill = (i, text, t0, dur = 0.6) => { const f = el.querySelector('.f' + i); on((t) => { f.textContent = text.slice(0, Math.floor(text.length * clamp01((t - t0) / dur))); }); sfx('real/typing', t0, 0.25, dur); return el; };
    el.photo = (t0) => { const p = el.querySelector('.ph'); on((t) => p.setAttribute('opacity', clamp01((t - t0) / 0.5))); return el; };
    return el;
  }
  function tears(x, y, t0, t1, { parent, every = 0.28 } = {}) {
    for (let t = t0, i = 0; t < t1; t += every, i++) {
      const side = i % 2 ? 1 : -1;
      const d = place(sv(22, 32, `<path d="M11 2 Q20 18 11 30 Q2 18 11 2 Z" fill="#9fd3ff"/>`, 'gx-tear'), x + side * 34, y, { parent, z: 9, glow: false });
      d.classList.remove('gx-prop'); d.dataset.overlapOk = '';
      tw(d, t, 0.05, { opacity: [0, 1] }); tw(d, t, 0.7, { y: [0, 150] }, 'in'); tw(d, t + 0.55, 0.15, { opacity: [1, 0] });
    }
  }


  // ---------------- more places (job-hunt / small-business stories) ----------------
  const fit = (text, maxW, size, em = 0.6) => Math.max(12, Math.min(size, Math.floor(maxW / (Math.max(1, text.length) * em))));   // shrink-to-fit font size
  function rejectWall(x, y, { parent, cols = 9, rows = 6, pw = 84, ph = 104, gap = 10 } = {}) {   // .add(i, t) .fill(t0, t1, n) .highlight(i, t)
    const W = cols * (pw + gap), H = rows * (ph + gap);
    const el = back(place(sv(W, H, '<g class="ps"></g>', 'gx-rwall'), x, y, { parent, z: 2, glow: false }));
    const G = el.querySelector('.ps'), cards = [];
    el.add = (i, t0) => {
      const c = i % cols, r = Math.floor(i / cols) % rows, px = c * (pw + gap) + gap / 2, py = r * (ph + gap) + gap / 2, rot = (rand(i * 3.3) - 0.5) * 8;
      const g = node('g', {}, G);
      node('rect', { x: px, y: py, width: pw, height: ph, rx: 4, fill: '#ececec' }, g);
      for (let k = 0; k < 4; k++) node('path', { d: `M${px + 10} ${py + 20 + k * 14} H${px + pw - 14 - rand(i + k) * 20}`, stroke: '#a0a0a0', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
      node('path', { d: `M${px + 22} ${py + 64} l${pw - 44} 30 M${px + pw - 22} ${py + 64} l${-(pw - 44)} 30`, stroke: '#e5484d', 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
      const hl = node('rect', { x: px - 3, y: py - 3, width: pw + 6, height: ph + 6, rx: 6, fill: 'none', stroke: '#f5c542', 'stroke-width': 6, opacity: 0 }, g);
      cards[i] = { g, hl };
      on((t) => { const k = clamp01((t - t0) / 0.18), e = EASE.out(k); g.setAttribute('opacity', k.toFixed(3)); g.setAttribute('transform', `rotate(${rot.toFixed(1)} ${px + pw / 2} ${py + ph / 2}) translate(${px + pw / 2} ${py + ph / 2}) scale(${(1.35 - 0.35 * e).toFixed(3)}) translate(${-px - pw / 2} ${-py - ph / 2})`); });
      return el;
    };
    el.fill = (t0, t1, n = cols * rows, from = 0) => { for (let i = from; i < n; i++) { const u = (i - from) / Math.max(1, n - from - 1); el.add(i, t0 + (t1 - t0) * Math.pow(u, 0.7)); } return el; };
    el.highlight = (i, t0) => { const h = cards[i] && cards[i].hl; if (h) on((t) => h.setAttribute('opacity', clamp01((t - t0) / 0.2).toFixed(3))); return el; };
    return el;
  }
  function inbox(x, y, { parent, w = 860, h = 780, title = 'Inbox' } = {}) {      // .mail(i, from, subject, t, tone) .open(t0, t1, from, lines, hlWord)
    const el = place(sv(w, h, `<rect x="0" y="0" width="${w}" height="${h}" rx="28" fill="#0e1118" stroke="#e6e6e6" stroke-width="8"/><rect x="0" y="0" width="${w}" height="90" rx="28" fill="#161b27"/><rect x="0" y="60" width="${w}" height="30" fill="#161b27"/>
      <text x="40" y="60" ${MONO} font-size="34" fill="#fff">${title}</text><circle cx="${w - 60}" cy="45" r="20" fill="#2a3245"/><g class="rows"></g><g class="openm" opacity="0"></g>`, 'gx-inbox'), x, y, { parent, z: 6, glow: false });
    const R = el.querySelector('.rows'), O = el.querySelector('.openm'), rh = 104, maxR = Math.floor((h - 110) / rh);
    const rows = [];
    el.mail = (i, from, subject, t0, tone = 'red') => {
      const g = node('g', {}, R), col = tone === 'gold' ? '#f5c542' : tone === 'green' ? '#4ade80' : '#ff5a5f';
      node('rect', { x: 24, y: 0, width: w - 48, height: rh - 14, rx: 16, fill: '#171c28', stroke: '#2a3245', 'stroke-width': 3 }, g);
      node('circle', { cx: 66, cy: (rh - 14) / 2, r: 22, fill: col }, g);
      const a = node('text', { x: 106, y: 40, 'font-family': 'Inter,Arial', 'font-weight': 800, 'font-size': fit(from, w - 170, 28, 0.58), fill: '#fff' }, g); a.textContent = from;
      const b = node('text', { x: 106, y: 74, 'font-family': 'Inter,Arial', 'font-weight': 500, 'font-size': fit(subject, w - 170, 24, 0.52), fill: '#9aa4b8' }, g); b.textContent = subject;
      rows.push([g, t0]); rows.sort((p, q) => p[1] - q[1]);
      sfx('real/notify-bubble', t0, 0.25, 0.6);
      return el;
    };
    on((t) => {   // newest on top, rows slide down as mail arrives
      const vis = rows.filter(([, t0]) => t >= t0 - 0.0001);
      rows.forEach(([g, t0]) => { if (t < t0) { g.setAttribute('opacity', 0); return; }
        const k = vis.length - 1 - vis.findIndex((r) => r[0] === g); const newer = vis.filter((r) => r[1] > t0);
        let yy = 110; newer.forEach((r) => { yy += rh * EASE.out(clamp01((t - r[1]) / 0.25)); });
        const p = clamp01((t - t0) / 0.25); g.setAttribute('opacity', (p * (yy < 110 + rh * maxR ? 1 : 0)).toFixed(3)); g.setAttribute('transform', `translate(${((1 - EASE.out(p)) * -40).toFixed(1)} ${yy.toFixed(1)})`); });
    });
    el.open = (t0, t1, from, lines, hl = '') => {
      node('rect', { x: 24, y: 110, width: w - 48, height: h - 134, rx: 18, fill: '#f2f2f2' }, O);
      const f = node('text', { x: 60, y: 170, 'font-family': 'Inter,Arial', 'font-weight': 800, 'font-size': fit(from, w - 130, 30, 0.58), fill: '#111' }, O); f.textContent = from;
      node('path', { d: `M60 196 H${w - 60}`, stroke: '#ccc', 'stroke-width': 3 }, O);
      lines.forEach((ln, i) => {
        const tx = node('text', { x: 60, y: 260 + i * 62, 'font-family': 'Inter,Arial', 'font-weight': 700, 'font-size': fit(ln, w - 130, 40, 0.55), fill: '#222' }, O);
        if (hl && ln.includes(hl)) { const [a, b] = ln.split(hl); const t1s = document.createElementNS(NS, 'tspan'); t1s.textContent = a; const t2 = document.createElementNS(NS, 'tspan'); t2.textContent = hl; t2.setAttribute('fill', '#c98a00'); t2.setAttribute('class', 'hlw'); const t3 = document.createElementNS(NS, 'tspan'); t3.textContent = b; tx.append(t1s, t2, t3); }
        else tx.textContent = ln;
      });
      on((t) => { const k = clamp01((t - t0) / 0.2) * clamp01((t1 - t) / 0.2); O.setAttribute('opacity', k.toFixed(3)); O.setAttribute('transform', `translate(0 ${((1 - EASE.out(clamp01((t - t0) / 0.25))) * 40).toFixed(1)})`); });
      sfx('real/mouse-click', t0 - 0.05, 0.3, 0.3);
      return el;
    };
    return el;
  }
  function storefront(x, floorY, sign, { parent, color = '#f5c542', size = 1 } = {}) {   // .lights(t0)
    const W = 300, H = 380;
    let aw = ''; for (let i = 0; i < 6; i++) aw += `<path d="M${20 + i * 43.3} 120 h43.3 v40 q-21.6 18 -43.3 0 z" fill="${i % 2 ? '#f2f2f2' : color}"/>`;
    const el = back(place(sv(W * size, H * size, `<g transform="scale(${size})"><rect x="12" y="30" width="${W - 24}" height="${H - 30}" fill="#13151b" stroke="#e6e6e6" stroke-width="6"/><rect x="28" y="46" width="${W - 56}" height="60" rx="8" fill="#e6e6e6"/>
      <text x="${W / 2}" y="${46 + 30 + fit(sign, W - 80, 30) * 0.35}" text-anchor="middle" ${MONO} font-size="${fit(sign, W - 80, 30)}" fill="#111">${sign}</text>${aw}
      <rect class="sw" x="34" y="200" width="140" height="120" rx="6" fill="#1a1d25" stroke="#e6e6e6" stroke-width="5"/><rect x="194" y="210" width="72" height="170" rx="6" fill="#0d0e12" stroke="#bdbdbd" stroke-width="5"/></g>`, 'gx-store'), x, floorY, { parent, anchor: 'bottom', z: 2, glow: false }));
    el.lights = (t0) => { const w = el.querySelector('.sw'); on((t) => w.setAttribute('fill', mixc('#1a1d25', '#3a2f14', (t - t0) / 0.3))); return el; };
    return el;
  }
  function siteCard(x, y, label, { parent, color = '#f5c542', scale = 1 } = {}) {        // a little website in a browser window
    const W = 260, H = 190;
    const el = place(sv(W * scale, H * scale, `<g transform="scale(${scale})"><rect x="0" y="0" width="${W}" height="${H}" rx="16" fill="#0e1320" stroke="#e6e6e6" stroke-width="5"/><rect x="0" y="0" width="${W}" height="34" rx="16" fill="#1b2235"/><rect x="0" y="20" width="${W}" height="14" fill="#1b2235"/><circle cx="20" cy="17" r="6" fill="#ff5a5f"/><circle cx="40" cy="17" r="6" fill="#f5c542"/><circle cx="60" cy="17" r="6" fill="#4ade80"/>
      <text x="${W / 2}" y="78" text-anchor="middle" font-family="Inter,Arial" font-weight="900" font-size="${fit(label, W - 40, 30, 0.62)}" fill="#fff">${label}</text><rect x="70" y="98" width="120" height="34" rx="17" fill="${color}"/><rect x="40" y="148" width="80" height="22" rx="6" fill="#2a3450"/><rect x="140" y="148" width="80" height="22" rx="6" fill="#2a3450"/></g>`, 'gx-site'), x, y, { parent, z: 7, glow: false });
    return el;
  }
  function network(x, y, { parent, levels = 3, r0 = 120, step = 120, color = '#f5c542' } = {}) {   // .grow(t0, every): 1 -> 3 -> 9 ... ("every client told two more")
    const S = (r0 + step * levels) * 2 + 80;
    const el = place(sv(S, S, '<g class="ln"></g><g class="nd"></g>', 'gx-net'), x, y, { parent, z: 5, glow: false });
    const L = el.querySelector('.ln'), N = el.querySelector('.nd'), c = S / 2, nodes = [{ x: c, y: c, lv: 0, a: 0 }];
    for (let lv = 1; lv <= levels; lv++) {
      const parents = nodes.filter((n) => n.lv === lv - 1), k = parents.length * 2 + (lv === 1 ? 1 : 0);
      const R = r0 + step * (lv - 1); let j = 0;
      parents.forEach((p) => { const kids = lv === 1 ? 3 : 2; for (let q = 0; q < kids; q++, j++) { const a = (j / k) * Math.PI * 2 + lv * 0.35; nodes.push({ x: c + Math.cos(a) * R, y: c + Math.sin(a) * R, lv, p }); } });
    }
    el.count = nodes.length;
    el.grow = (t0, every = 0.5) => {
      nodes.forEach((n, i) => {
        const tt = t0 + n.lv * every + (rand(i * 1.7) * every * 0.5);
        if (n.p) { const l = node('path', { d: `M${n.p.x} ${n.p.y} L${n.x} ${n.y}`, stroke: '#6b7280', 'stroke-width': 4, fill: 'none' }, L); const len = Math.hypot(n.x - n.p.x, n.y - n.p.y); l.setAttribute('stroke-dasharray', len); on((t) => l.setAttribute('stroke-dashoffset', (len * (1 - EASE.out(clamp01((t - tt + 0.15) / 0.25)))).toFixed(1))); }
        const g = node('circle', { cx: n.x, cy: n.y, r: n.lv ? 22 - n.lv * 3 : 34, fill: n.lv ? '#e6e6e6' : color, stroke: '#0b0d12', 'stroke-width': 4 }, N);
        on((t) => { const k = clamp01((t - tt) / 0.22); g.setAttribute('opacity', k.toFixed(3)); g.setAttribute('r', ((n.lv ? 22 - n.lv * 3 : 34) * EASE.back(k)).toFixed(2)); });
        if (n.lv && i % 3 === 0) sfx('real/pop', tt, 0.12, 0.3);
      });
      return el;
    };
    return el;
  }
  function diningTable(x, floorY, { parent, w = 620 } = {}) {
    const el = place(sv(w, 230, `<path d="M20 60 H${w - 20}" stroke="#e6e6e6" stroke-width="10" stroke-linecap="round"/><path d="M40 66 H${w - 40} V150 Q${w / 2} 180 40 150 Z" fill="#1b1d24" stroke="#bdbdbd" stroke-width="5"/><path d="M80 150 V230 M${w - 80} 150 V230" stroke="#bdbdbd" stroke-width="10" stroke-linecap="round"/>
      <ellipse cx="${w * 0.3}" cy="52" rx="58" ry="12" fill="#e6e6e6"/><ellipse cx="${w * 0.7}" cy="52" rx="58" ry="12" fill="#e6e6e6"/><ellipse cx="${w * 0.5}" cy="48" rx="40" ry="10" fill="#9a9a9a"/>`, 'gx-table'), x, floorY, { parent, anchor: 'bottom', z: 6, glow: false });
    el.dataset.overlapOk = '';
    return el;
  }

  Object.assign(window, { rejectWall, inbox, storefront, siteCard, network, diningTable, classroom, schoolDesk, nightSky, bedroom, deskFront, codeScreen, nightHouse, tvGlow, bakery, shopRow, officeWindow, testPaper, bigPhone, appForm, tears });
})();
