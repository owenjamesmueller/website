/* Glow Explainer components. Each returns an absolutely-positioned element
 * appended to `parent` (default #stage). Coordinates are in the 1080x1920 stage,
 * (x, y) = the element's anchor point (see each builder). Elements start hidden
 * (opacity 0) and are animated with tw/show/pop from engine.js.
 */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const stage = () => document.getElementById('stage');

  function place(el, x, y, { parent, anchor = 'center', z = 1, glow = true } = {}) {
    el.style.position = 'absolute';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.zIndex = z;
    el.style.opacity = 0;
    const tr = { center: '-50%,-50%', bottom: '-50%,-100%', top: '-50%,0', left: '0,-50%' }[anchor];
    el.style.translate = tr.replace(',', ' ');
    if (glow) el.dataset.glow = '';
    (parent || stage()).appendChild(el);
    return el;
  }
  function svg(w, h, inner, cls = '') {
    const d = document.createElement('div');
    d.className = 'gx-svg ' + cls;
    d.innerHTML = `<svg xmlns="${NS}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${inner}</svg>`;
    return d;
  }
  const S = 'fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"';

  // ---- the faceless figure (anchor = feet) ----------------------------
  // variant: 'plain' | 'cap' (graduation cap) ; arm: null | 'up' | 'point' | 'wave'
  function figure(x, y, { size = 1, variant = 'plain', arm = null, dim = false, parent } = {}) {
    const w = 200 * size, h = 300 * size;
    const fill = dim ? '#8a8a8a' : '#fff';
    let inner = `<g transform="scale(${size})">
      <circle cx="100" cy="70" r="38" fill="${fill}"/>
      <path d="M40 300 V185 a60 60 0 0 1 120 0 V300 Z" fill="${fill}"/>`;
    if (variant === 'cap') inner += `
      <path d="M45 42 L100 18 L155 42 L100 64 Z" fill="#0a0a0a" stroke="${fill}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M72 52 V70 Q100 82 128 70 V52" fill="#0a0a0a" stroke="${fill}" stroke-width="6"/>
      <path d="M152 44 V78" stroke="${fill}" stroke-width="5"/><circle cx="152" cy="82" r="6" fill="${fill}"/>`;
    if (arm === 'up') inner += `<path d="M150 190 L178 95" stroke="${fill}" stroke-width="22" stroke-linecap="round"/>`;
    if (arm === 'point') inner += `<path d="M150 200 L230 160" stroke="${fill}" stroke-width="22" stroke-linecap="round"/>`;
    if (arm === 'wave') inner += `<path d="M150 195 L200 130" stroke="${fill}" stroke-width="22" stroke-linecap="round"/>`;
    inner += '</g>';
    const el = svg(260 * size, h, inner, 'gx-figure');
    el.firstChild.style.overflow = 'visible';
    return place(el, x, y, { parent, anchor: 'bottom', z: 5, glow: !dim });
  }

  // ---- dashed floor line ---------------------------------------------
  function floor(y, { parent } = {}) {
    const d = document.createElement('div');
    d.className = 'gx-floor';
    return place(d, 540, y, { parent, z: 0, glow: false });
  }

  // ---- small uppercase pill label ------------------------------------
  function pill(text, x, y, { size = 'sm', invert = true, parent } = {}) {
    const d = document.createElement('div');
    d.className = `gx-pill gx-pill-${size}` + (invert ? ' gx-pill-invert' : '');
    d.textContent = text;
    return place(d, x, y, { parent, z: 8 });
  }

  // ---- big number with tiny caption above ----------------------------
  function stat(caption, value, x, y, { size = 120, parent } = {}) {
    const d = document.createElement('div');
    d.className = 'gx-stat';
    d.innerHTML = `<div class="gx-stat-cap">${caption}</div><div class="gx-stat-val" style="font-size:${size}px">${value}</div>`;
    return place(d, x, y, { parent, z: 8 });
  }

  // ---- outlined card / panel (quiz sheet, window, board) -------------
  function card(x, y, w, h, { title = '', body = '', parent } = {}) {
    const d = document.createElement('div');
    d.className = 'gx-card';
    d.style.width = w + 'px';
    d.style.height = h + 'px';
    d.innerHTML = (title ? `<div class="gx-card-title">${title}</div>` : '') + `<div class="gx-card-body">${body}</div>`;
    return place(d, x, y, { parent, z: 6 });
  }

  // ---- big headline text (two-word contrasts, "KNOW → THEN ACT") -----
  function headline(html, x, y, { size = 72, parent, boxed = false } = {}) {
    const d = document.createElement('div');
    d.className = 'gx-headline' + (boxed ? ' gx-boxed' : '');
    d.style.fontSize = size + 'px';
    d.innerHTML = html;
    return place(d, x, y, { parent, z: 8 });
  }

  // ---- spotlight cone from top (anchor = apex) ------------------------
  function spotlight(x, y, { width = 520, height = 1100, parent } = {}) {
    const d = document.createElement('div');
    d.className = 'gx-spot';
    d.style.width = width + 'px';
    d.style.height = height + 'px';
    return place(d, x, y, { parent, anchor: 'top', z: 2, glow: false });
  }

  // ---- outline icons (anchor = center) --------------------------------
  const ICONS = {
    brain: `<path ${S} d="M100 40 C70 20 30 35 32 70 C10 80 12 120 35 130 C30 160 65 175 85 160 C95 172 100 170 100 150 Z"/>
            <path ${S} d="M100 40 C130 20 170 35 168 70 C190 80 188 120 165 130 C170 160 135 175 115 160 C105 172 100 170 100 150 Z"/>
            <path ${S} d="M60 75 Q75 85 70 105 M140 75 Q125 85 130 105 M60 130 Q78 120 88 135 M140 130 Q122 120 112 135"/>`,
    wallet: `<rect ${S} x="25" y="55" width="150" height="100" rx="16"/><path ${S} d="M40 55 L140 30 L150 55"/>
             <rect ${S} x="120" y="88" width="55" height="34" rx="10"/><circle cx="138" cy="105" r="5" fill="#fff"/>`,
    coin: `<circle ${S} cx="100" cy="100" r="70"/><circle ${S} cx="100" cy="100" r="52" stroke-width="4"/>
           <text x="100" y="124" text-anchor="middle" font-family="Inter,Arial" font-weight="800" font-size="64" fill="#fff">$</text>`,
    cap: `<path ${S} d="M20 80 L100 45 L180 80 L100 115 Z"/><path ${S} d="M55 98 V135 Q100 160 145 135 V98"/><path ${S} d="M175 82 V135"/>`,
    check: `<circle ${S} cx="100" cy="100" r="70"/><path ${S} stroke-width="10" d="M68 102 L92 126 L136 78"/>`,
    cross: `<circle ${S} cx="100" cy="100" r="70"/><path ${S} stroke-width="10" d="M72 72 L128 128 M128 72 L72 128"/>`,
    clock: `<circle ${S} cx="100" cy="100" r="70"/><path ${S} class="gx-hand" d="M100 100 V52"/><path ${S} d="M100 100 L130 115"/>`,
    question: `<circle cx="100" cy="100" r="58" fill="#fff"/><text x="100" y="128" text-anchor="middle" font-family="Inter,Arial" font-weight="800" font-size="80" fill="#0a0a0a">?</text>`,
    bulb: `<path ${S} d="M70 125 C40 105 45 45 100 40 C155 45 160 105 130 125 V145 H70 Z"/><path ${S} d="M78 162 H122 M86 178 H114"/>`,
    star: `<path fill="#fff" d="M100 30 L118 78 L170 80 L129 112 L143 162 L100 133 L57 162 L71 112 L30 80 L82 78 Z"/>`,
    rocket: `<path ${S} d="M100 20 C140 50 145 110 130 150 H70 C55 110 60 50 100 20 Z"/><circle ${S} cx="100" cy="80" r="16"/>
             <path ${S} d="M70 120 L45 160 L72 152 M130 120 L155 160 L128 152"/><path ${S} d="M88 160 Q100 190 112 160"/>`,
    desk: `<path ${S} d="M20 120 H180 M40 120 V185 M160 120 V185"/><rect ${S} x="70" y="60" width="70" height="50" rx="6"/>`,
    house: `<path ${S} d="M30 95 L100 35 L170 95"/><path ${S} d="M48 82 V170 H152 V82"/><rect ${S} x="86" y="118" width="28" height="52"/>`,
    book: `<path ${S} d="M100 55 C80 40 45 40 25 48 V160 C45 152 80 152 100 167 C120 152 155 152 175 160 V48 C155 40 120 40 100 55 Z"/><path ${S} d="M100 55 V167"/>`,
    arrowUp: `<path ${S} stroke-width="8" d="M100 170 V40 M60 80 L100 35 L140 80"/>`,
    phone: `<rect ${S} x="60" y="20" width="80" height="160" rx="16"/><path ${S} d="M88 160 H112" stroke-width="5"/>`,
    car: `<path ${S} d="M15 140 V112 L42 104 L68 70 H138 L168 104 L188 112 V140 Z"/><path ${S} d="M78 80 H130 L152 104 H62 Z" stroke-width="4"/><circle ${S} cx="55" cy="142" r="20" fill="#050505"/><circle ${S} cx="150" cy="142" r="20" fill="#050505"/>`,
    bus: `<rect ${S} x="10" y="45" width="180" height="100" rx="14"/><path ${S} d="M10 95 H190" stroke-width="4"/><rect ${S} x="28" y="60" width="34" height="26" rx="4" stroke-width="4"/><rect ${S} x="76" y="60" width="34" height="26" rx="4" stroke-width="4"/><rect ${S} x="124" y="60" width="34" height="26" rx="4" stroke-width="4"/><circle ${S} cx="50" cy="150" r="15" fill="#050505"/><circle ${S} cx="150" cy="150" r="15" fill="#050505"/>`,
    shoe: `<path ${S} d="M20 140 V95 L60 88 L80 60 L110 62 Q120 100 160 108 Q185 112 185 130 V140 Z"/><path ${S} d="M20 128 H185" stroke-width="4"/><path ${S} d="M80 80 L95 90 M74 92 L88 100" stroke-width="4"/>`,
    laptop: `<rect ${S} x="40" y="40" width="120" height="84" rx="8"/><path ${S} d="M18 150 H182 L164 128 H36 Z"/><path ${S} d="M60 70 H112 M60 92 H140" stroke-width="4"/>`,
    sparkle: `<path fill="#fff" d="M100 20 Q108 92 180 100 Q108 108 100 180 Q92 108 20 100 Q92 92 100 20 Z"/>`,
    moon: `<path fill="#fff" d="M130 30 A75 75 0 1 0 170 140 A60 60 0 1 1 130 30 Z"/>`,
    fund: `<rect ${S} x="20" y="30" width="160" height="140" rx="16"/><path ${S} d="M40 140 L80 105 L110 120 L160 60"/><path ${S} d="M135 60 H160 V85" stroke-width="5"/>`,
    calendar: `<rect ${S} x="25" y="40" width="150" height="140" rx="14"/><path ${S} d="M25 80 H175 M65 25 V55 M135 25 V55"/>`,
    flag: `<path ${S} d="M40 190 V20"/><path fill="#fff" d="M46 24 H175 L150 60 L175 96 H46 Z"/>`,
    arrowR: `<path ${S} stroke-width="8" d="M30 100 H160 M120 60 L165 100 L120 140"/>`,
  };
  function icon(name, x, y, { size = 200, parent } = {}) {
    const el = svg(200, 200, ICONS[name], 'gx-icon gx-icon-' + name);
    el.firstChild.setAttribute('width', size);
    el.firstChild.setAttribute('height', size);
    return place(el, x, y, { parent, z: 7 });
  }

  // ---- line chart axes + curve (anchor = top-left of box) -------------
  function chart(x, y, w, h, { curve = 'exp', label = '', parent } = {}) {
    let d = '';
    for (let i = 0; i <= 60; i++) {
      const p = i / 60;
      const v = curve === 'exp' ? Math.pow(p, 3.2) : curve === 'bell' ? Math.exp(-Math.pow((p - 0.5) / 0.16, 2)) : p;
      d += (i ? 'L' : 'M') + (p * w).toFixed(1) + ' ' + (h - v * h * 0.92).toFixed(1) + ' ';
    }
    const el = svg(w, h, `<path ${S} stroke-width="4" class="gx-axis" d="M0 0 V${h} H${w}"/><path ${S} stroke-width="6" class="gx-curve" d="${d}"/>`, 'gx-chart');
    if (label) el.insertAdjacentHTML('beforeend', `<div class="gx-chart-label">${label}</div>`);
    return place(el, x, y, { parent, anchor: 'left', z: 6 });
  }

  // ---- light pool behind a key object (anchor = center) ----------------
  function halo(x, y, { r = 300, parent } = {}) {
    const d = document.createElement('div'); d.className = 'gx-halo';
    d.style.width = d.style.height = r * 2 + 'px';
    return place(d, x, y, { parent, z: 1, glow: false });
  }
  // ---- out-of-focus bokeh circles drifting in the background ------------
  function bokeh(n = 10, { parent, seed = 1 } = {}) {
    const els = [];
    for (let i = 0; i < n; i++) {
      const r = 40 + rand(seed + i) * 110, x = rand(seed + i * 3.1) * 1080, y = 150 + rand(seed + i * 7.7) * 1500;
      const d = document.createElement('div'); d.className = 'gx-bokeh';
      d.style.width = d.style.height = r + 'px';
      const el = place(d, x, y, { parent, z: 0, glow: false });
      el.style.opacity = 1;
      const sp = 0.1 + rand(seed + i * 1.7) * 0.25, ph = rand(i) * 6;
      on((t) => { el.style.marginTop = Math.sin(t * sp + ph) * 30 + 'px'; el.style.marginLeft = Math.cos(t * sp * 0.8 + ph) * 20 + 'px'; });
      els.push(el);
    }
    return els;
  }
  // ---- dashed ground ring under a figure (anchor = center) --------------
  function ring(x, y, { w = 300, h = 60, parent } = {}) {
    const d = document.createElement('div'); d.className = 'gx-ring';
    d.style.width = w + 'px'; d.style.height = h + 'px';
    return place(d, x, y, { parent, z: 2, glow: false });
  }
  // ---- name tag under feet (anchor = top) -------------------------------
  function tag(text, x, y, { parent } = {}) {
    const d = document.createElement('div'); d.className = 'gx-tag'; d.textContent = text;
    return place(d, x, y, { parent, anchor: 'top', z: 6 });
  }
  // ---- speech bubble, tail points down (anchor = tail tip) -------------
  function bubble(text, x, y, { fill = false, parent } = {}) {
    const d = document.createElement('div'); d.className = 'gx-bubble' + (fill ? ' gx-bubble-fill' : ''); d.innerHTML = text;
    const el = place(d, x, y - 14, { parent, anchor: 'bottom', z: 9 });
    el.style.transformOrigin = '50% 100%';
    return el;
  }
  // ---- phone-style notification (anchor = center) -----------------------
  function notify(caption, value, x, y, { iconName = 'coin', parent } = {}) {
    const d = document.createElement('div'); d.className = 'gx-notify';
    d.innerHTML = `<svg width="80" height="80" viewBox="0 0 200 200">${ICONS[iconName]}</svg><div><b>${caption}</b><span>${value}</span></div>`;
    return place(d, x, y, { parent, z: 9 });
  }

  // ---- gold money coin (the one accent colour) --------------------------
  function goldCoin(x, y, { size = 70, parent } = {}) {
    const el = icon('coin', x, y, { size, parent });
    el.dataset.glowColor = '245,197,66';
    el.querySelectorAll('[stroke]').forEach((n) => n.setAttribute('stroke', '#f5c542'));
    el.querySelectorAll('text').forEach((n) => n.setAttribute('fill', '#f5c542'));
    return el;
  }
  // ---- walk a figure from dx px away to its spot, with a step bob --------
  function walkIn(el, t0, dur = 1.0, dx = -400) {
    tw(el, t0, 0.2, { opacity: [0, 1] });
    tw(el, t0, dur, { x: [dx, 0] }, 'out');
    bob(el, t0, t0 + dur * 0.85, 12, 11);
    return el;
  }
  // ---- city skyline with windows that light up one by one (anchor = bottom-left at floor) --
  function skyline(y, { parent, seed = 3, t0 = 0, dim = 0.5 } = {}) {
    const d = document.createElement('div'); d.className = 'gx-skyline';
    let html = '', x = 0, i = 0; const wins = [];
    while (x < 1080) {
      const w = 70 + rand(seed + i) * 90, h = 220 + rand(seed + i * 2.3) * 520;
      html += `<div class="gx-bld" style="left:${x}px;width:${w - 10}px;height:${h}px">`;
      for (let r = 0; r < Math.floor(h / 46) - 1; r++) for (let c = 0; c < Math.floor((w - 24) / 26); c++) {
        const id = `w${i}_${r}_${c}`; wins.push(id);
        html += `<i id="${id}" style="left:${10 + c * 26}px;top:${18 + r * 46}px"></i>`;
      }
      html += '</div>'; x += w; i++;
    }
    d.innerHTML = html;
    const el = place(d, 0, y, { parent, anchor: 'left', z: 0, glow: false });
    el.style.translate = '0 -100%'; el.style.width = '1080px'; el.style.height = '760px';
    const nodes = wins.map((id) => el.querySelector('#' + id));
    on((t) => nodes.forEach((n, k) => { n.style.opacity = t > t0 + rand(k + 0.5) * 3 && rand(k * 1.3) > dim ? 1 : 0; }));
    return el;
  }
  // ---- vertical bar with a label that fills to `value` (0..1) ------------
  function bar(label, x, y, { h = 420, w = 120, parent } = {}) {
    const d = document.createElement('div'); d.className = 'gx-bar';
    d.style.width = w + 'px'; d.style.height = h + 'px';
    d.innerHTML = `<div class="gx-bar-fill"></div><div class="gx-bar-label">${label}</div>`;
    const el = place(d, x, y, { parent, anchor: 'bottom', z: 6 });
    el.fill = (t0, dur, a, b) => { const f = el.querySelector('.gx-bar-fill');
      on((t) => { const p = EASE.out(Math.max(0, Math.min(1, (t - t0) / dur))); f.style.height = (a + (b - a) * p) * 100 + '%'; }); };
    return el;
  }

  // ---- generic group to move several things together ------------------
  function group(x = 0, y = 0, { parent } = {}) {
    const d = document.createElement('div');
    d.className = 'gx-group';
    d.style.inset = '0';
    const g = place(d, x, y, { parent, z: 3, glow: false });
    g.style.translate = '0 0';
    g.style.width = '1080px'; g.style.height = '1920px';
    return g;
  }

  Object.assign(window, { figure, floor, pill, stat, card, headline, spotlight, icon, chart, group, halo, bokeh, ring, tag, bubble, notify, place, goldCoin, walkIn, skyline, bar, ICONS });
})();
