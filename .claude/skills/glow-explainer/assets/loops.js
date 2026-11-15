/* MODE B — wordless metaphor loops (12–16 s, music + SFX, no narration).
 * Load after engine.js, components.js. Stick figures act out one metaphor; one accent colour;
 * small monospace text: a typed headline, boxed signs, taunt bubbles, a closing quote card.
 *
 *   const s = stick(x, y, { size, color, accent, blindfold })   // anchor = feet
 *   s.walk(t0, t1, { dx, dy, speed })   s.pose(t, 'cheer'|'pull'|'reach'|'fall'|'swim'|'stand'|'point'|'sit', dur)
 *   s.path(t0, t1, fn(p) -> {x, y, s})   // move along any path (perspective roads, falls); s = scale
 *   monoHead(text, t0, { y, cps })        // typed headline at the top
 *   monoSign(text, x, y)  monoBubble(text, x, y)  quoteCard(lines, author, t0)
 *   road(): perspective road with a fork  ->  road.at(z, branch, lane) = {x, y, s}
 *   ocean({ surfaceY })  bubbles(x, y, t0, t1)  chain(a(t), b(t))  seaweed(x, y)  cliff(edgeX, y)
 */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const D = (a) => (a * Math.PI) / 180;

  // ---------------- stick figure ----------------
  // joint angles (deg, 0 = straight down, + = toward screen-right) for: armL[upper,fore], armR, legL[thigh,shin], legR, lean
  const SP = {
    stand: { aL: [-12, 0], aR: [12, 0], lL: [-6, 0], lR: [6, 0], lean: 0 },
    cheer: { aL: [-155, -10], aR: [155, 10], lL: [-10, 0], lR: [10, 0], lean: 0 },
    pull:  { aL: [60, 30], aR: [75, 20], lL: [-30, 30], lR: [20, 10], lean: -18 },
    reach: { aL: [-170, 0], aR: [-160, 10], lL: [-10, 5], lR: [15, -10], lean: 0 },
    swim:  { aL: [-160, -20], aR: [150, 30], lL: [-20, 25], lR: [25, -15], lean: 0 },
    fall:  { aL: [-120, -40], aR: [130, 50], lL: [-60, 60], lR: [40, -30], lean: 70 },
    point: { aL: [-10, 0], aR: [95, 0], lL: [-6, 0], lR: [6, 0], lean: 0 },
    sit:   { aL: [20, -60], aR: [30, -70], lL: [-90, 90], lR: [-80, 85], lean: -5 },
    blind: { aL: [55, 25], aR: [65, 15], lL: [-8, 0], lR: [8, 0], lean: 4 },   // zombie-walk, arms forward
  };
  function stick(x, y, { size = 1, color = '#ffffff', accent = null, blindfold = false, parent, z = 5 } = {}) {
    const d = document.createElement('div'); d.className = 'gx-svg gx-stick';
    d.innerHTML = `<svg xmlns="${NS}" width="${140 * size}" height="${260 * size}" viewBox="-70 -230 140 260" style="overflow:visible">
      <g fill="none" stroke="${color}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" class="body">
        <path class="lL"/><path class="lR"/><path class="tr"/><path class="aL"/><path class="aR"/>
      </g>
      <circle class="hd" r="19" fill="${color}"/>
      ${blindfold || accent ? `<rect class="bf" width="44" height="11" rx="4" fill="${accent || '#e5484d'}"/>` : ''}
    </svg>`;
    const el = place(d, x, y, { parent, anchor: 'bottom', z, glow: color === '#ffffff' });
    el.style.transformOrigin = '50% 100%';
    const q = (c) => el.querySelector('.' + c);
    const parts = { lL: q('lL'), lR: q('lR'), tr: q('tr'), aL: q('aL'), aR: q('aR'), hd: q('hd'), bf: q('bf') };
    const keys = [{ t0: -99, dur: 0, p: SP.stand }];
    const walks = [];
    const paths = [];
    el.pose = (t0, name, dur = 0.25) => { keys.push({ t0, dur, p: SP[name] || name }); keys.sort((a, b) => a.t0 - b.t0); return el; };
    el.walk = (t0, t1, { dx = 0, dy = 0, speed = 9, amp = 28 } = {}) => {
      walks.push({ t0, t1, speed, amp });
      if (dx || dy) tw(el, t0, t1 - t0, { x: [0, dx], y: [0, dy] }, 'linear');
      return el;
    };
    el.path = (t0, t1, fn, { speed = 9, amp = 26 } = {}) => { paths.push({ t0, t1, fn }); walks.push({ t0, t1, speed, amp }); return el; };
    const seg = (x0, y0, a1, a2, l1, l2) => {
      const x1 = x0 + Math.sin(D(a1)) * l1, y1 = y0 + Math.cos(D(a1)) * l1;
      const x2 = x1 + Math.sin(D(a1 + a2)) * l2, y2 = y1 + Math.cos(D(a1 + a2)) * l2;
      return `M${x0.toFixed(1)} ${y0.toFixed(1)} L${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`;
    };
    on((t) => {
      let i = 0; for (let k = 0; k < keys.length; k++) if (t >= keys[k].t0) i = k;
      const cur = keys[i], from = i ? keys[i - 1].p : cur.p;
      const pr = cur.dur ? EASE.inOut(Math.max(0, Math.min(1, (t - cur.t0) / cur.dur))) : 1;
      const L = (a, b) => a + (b - a) * pr;
      const P = { aL: [L(from.aL[0], cur.p.aL[0]), L(from.aL[1], cur.p.aL[1])], aR: [L(from.aR[0], cur.p.aR[0]), L(from.aR[1], cur.p.aR[1])],
                  lL: [L(from.lL[0], cur.p.lL[0]), L(from.lL[1], cur.p.lL[1])], lR: [L(from.lR[0], cur.p.lR[0]), L(from.lR[1], cur.p.lR[1])], lean: L(from.lean, cur.p.lean) };
      let bounce = 0;
      for (const w of walks) if (t >= w.t0 && t <= w.t1) {
        const ph = (t - w.t0) * w.speed, sw = Math.sin(ph) * w.amp;
        P.lL = [sw, Math.max(0, -Math.cos(ph)) * 35]; P.lR = [-sw, Math.max(0, Math.cos(ph)) * 35];
        if (cur.p === SP.stand || cur.p === SP.point) { P.aL = [-sw * 0.8, -10]; P.aR = [sw * 0.8, 10]; }
        bounce = Math.abs(Math.sin(ph)) * 5;
      }
      const hipY = -95 - bounce, lean = D(P.lean);
      const nx = Math.sin(lean) * 80, ny = hipY - Math.cos(lean) * 80;
      parts.lL.setAttribute('d', seg(0, hipY, P.lL[0], P.lL[1], 50, 50));
      parts.lR.setAttribute('d', seg(0, hipY, P.lR[0], P.lR[1], 50, 50));
      parts.tr.setAttribute('d', `M0 ${hipY} L${nx.toFixed(1)} ${ny.toFixed(1)}`);
      parts.aL.setAttribute('d', seg(nx, ny + 6, P.aL[0], P.aL[1], 42, 40));
      parts.aR.setAttribute('d', seg(nx, ny + 6, P.aR[0], P.aR[1], 42, 40));
      const hx = nx + Math.sin(lean) * 24, hy = ny - Math.cos(lean) * 24;
      parts.hd.setAttribute('cx', hx.toFixed(1)); parts.hd.setAttribute('cy', hy.toFixed(1));
      if (parts.bf) { parts.bf.setAttribute('x', (hx - 22).toFixed(1)); parts.bf.setAttribute('y', (hy - 8).toFixed(1)); }
      for (const pth of paths) if (t >= pth.t0) {
        const p = Math.min(1, (t - pth.t0) / (pth.t1 - pth.t0)), r = pth.fn(p);
        el.style.left = r.x + 'px'; el.style.top = r.y + 'px'; if (r.s != null) el.style.scale = r.s;
        if (r.z != null) el.style.zIndex = r.z;
      }
    });
    return el;
  }

  // ---------------- mono text ----------------
  function monoHead(text, t0, { y = 330, cps = 22, parent, size = 30 } = {}) {
    const d = document.createElement('div'); d.className = 'gx-mono gx-mono-head'; d.style.fontSize = size + 'px';
    const el = place(d, 540, y, { parent, z: 40, glow: false }); el.style.opacity = 1;
    type(el, t0, text.length / cps, text, true);
    return el;
  }
  function monoSign(text, x, y, { parent, z = 8 } = {}) {
    const d = document.createElement('div'); d.className = 'gx-mono gx-mono-sign'; d.textContent = text;
    return place(d, x, y, { parent, z, glow: false });
  }
  function monoBubble(text, x, y, { parent } = {}) {
    const d = document.createElement('div'); d.className = 'gx-mono gx-bubble gx-mono-bubble'; d.textContent = text;
    const el = place(d, x, y - 14, { parent, anchor: 'bottom', z: 20, glow: false }); el.style.transformOrigin = '50% 100%';
    return el;
  }
  function quoteCard(lines, author, t0, { parent, accentLine = -1 } = {}) {
    const d = document.createElement('div'); d.className = 'gx-mono gx-quote';
    d.innerHTML = lines.map((l, i) => `<div${i === accentLine ? ' class="acc"' : ''}>${l}</div>`).join('') + (author ? `<div class="by">— ${author}</div>` : '');
    const el = place(d, 540, 820, { parent, z: 45, glow: false });
    tw(el, t0, 0.6, { opacity: [0, 1], y: [20, 0] }, 'out');
    return el;
  }

  // ---------------- perspective road with a fork ----------------
  // z: 0 = near (bottom of frame) .. 1 = far (horizon). branch: 0 trunk, -1 left, +1 right.
  function road({ parent, horizon = 760, near = 1700, forkZ = 0.42, spread = 1100, width = 520, color = '#25252b', glowRight = null } = {}) {
    const S = (z) => 0.18 + 0.82 * Math.pow(1 - z, 1.5);
    const Y = (z) => horizon + (near - horizon) * Math.pow(1 - z, 1.7);
    const lat = (z, b) => (z <= forkZ || !b ? 0 : b * spread * (z - forkZ));
    const at = (z, b = 0, lane = 0) => { const s = S(z); return { x: 540 + (lat(z, b) + lane * width * 0.42) * s, y: Y(z), s, z: 5 + Math.round((1 - z) * 20) }; };
    const poly = (b, z0, z1) => {
      const L = [], R = [];
      for (let i = 0; i <= 24; i++) { const z = z0 + ((z1 - z0) * i) / 24, p = at(z, b), w = (width / 2) * p.s; L.push(`${(p.x - w).toFixed(1)},${p.y.toFixed(1)}`); R.unshift(`${(p.x + w).toFixed(1)},${p.y.toFixed(1)}`); }
      return L.concat(R).join(' ');
    };
    const d = document.createElement('div'); d.className = 'gx-road';
    d.innerHTML = `<svg width="1080" height="1920" viewBox="0 0 1080 1920">
      <polygon points="${poly(0, 0, forkZ + 0.04)}" fill="${color}"/>
      <polygon points="${poly(-1, forkZ, 1)}" fill="${color}"/>
      <polygon class="rr" points="${poly(1, forkZ, 1)}" fill="${color}"/>
    </svg>`;
    const el = place(d, 540, 960, { parent, z: 1, glow: false });
    el.at = at; el.S = S; el.Y = Y;
    return el;
  }

  // ---------------- ocean, bubbles, chains, seaweed, cliff ----------------
  function ocean({ parent, surfaceY = 380 } = {}) {
    const d = document.createElement('div'); d.className = 'gx-ocean';
    let rays = ''; for (let i = 0; i < 7; i++) rays += `<i style="left:${80 + i * 140}px;transform:rotate(${-14 + i * 4}deg)"></i>`;
    d.innerHTML = `<div class="sky" style="height:${surfaceY}px"></div><div class="water" style="top:${surfaceY}px">${rays}</div><div class="line" style="top:${surfaceY}px"></div>`;
    const el = place(d, 540, 960, { parent, z: 0, glow: false });
    el.querySelectorAll('.water i').forEach((r, i) => on((t) => { r.style.opacity = 0.10 + 0.07 * Math.sin(t * 0.8 + i); }));
    return el;
  }
  function bubbles(x, y, t0, t1, { parent, every = 0.12, rise = 700 } = {}) {
    for (let t = t0, i = 0; t < t1; t += every, i++) {
      const r = 6 + rand(i * 7 + x) * 14, b = document.createElement('div'); b.className = 'gx-bubble-air';
      b.style.width = b.style.height = r + 'px';
      const el = place(b, x + (rand(i + x) - 0.5) * 40, y, { parent, z: 30, glow: false });
      tw(el, t, 0.1, { opacity: [0, 0.8] }); tw(el, t, 1.6, { y: [0, -rise], x: [0, (rand(i * 3) - 0.5) * 60] }, 'out'); tw(el, t + 1.3, 0.3, { opacity: [0.8, 0] });
    }
  }
  // chain between two moving points a(t) and b(t) -> {x, y}; links are drawn along the segment
  function chain(a, b, { parent, t0 = 0, t1 = 99, z = 6 } = {}) {
    const d = document.createElement('div'); d.className = 'gx-chain';
    d.innerHTML = `<svg width="1080" height="1920" viewBox="0 0 1080 1920"><path fill="none" stroke="#e8e8e8" stroke-width="7" stroke-dasharray="20 9" stroke-linecap="round"/></svg>`;
    const el = place(d, 540, 960, { parent, z, glow: false }); const p = el.querySelector('path');
    show(el, t0, t1, 0.1);
    on((t) => { const A = a(t), B = b(t), mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2 + 30; p.setAttribute('d', `M${A.x} ${A.y} Q${mx} ${my} ${B.x} ${B.y}`); });
    return el;
  }
  function seaweed(x, y, { parent, h = 160 } = {}) {
    const d = document.createElement('div'); d.className = 'gx-svg';
    d.innerHTML = `<svg width="60" height="${h}" viewBox="0 0 60 ${h}" style="overflow:visible"><path class="sw" fill="none" stroke="#2f6b4a" stroke-width="10" stroke-linecap="round"/></svg>`;
    const el = place(d, x, y, { parent, anchor: 'bottom', z: 3, glow: false }); el.style.opacity = 1;
    const p = el.querySelector('.sw'), ph = rand(x) * 6;
    on((t) => { const w = Math.sin(t * 1.4 + ph) * 14; p.setAttribute('d', `M30 ${h} Q${30 + w} ${h * 0.6} ${30 - w * 0.5} ${h * 0.35} T${30 + w} 0`); });
    return el;
  }
  function cliff(edgeX, y, { parent } = {}) {
    const d = document.createElement('div'); d.className = 'gx-cliff';
    d.innerHTML = `<svg width="1080" height="1920" viewBox="0 0 1080 1920"><path d="M0 ${y} H${edgeX} L${edgeX + 20} ${y + 120} L${edgeX - 10} ${y + 260} L${edgeX + 15} ${y + 420} L${edgeX - 5} 1920 H0 Z" fill="#1b1b1f" stroke="#cfcfcf" stroke-width="4"/></svg>`;
    return place(d, 540, 960, { parent, z: 2, glow: false });
  }

  Object.assign(window, { stick, STICK_POSES: SP, monoHead, monoSign, monoBubble, quoteCard, road, ocean, bubbles, chain, seaweed, cliff });
})();

/* ---------------- STORM KIT: sea, sky, rain, lightning, boat, raft ----------------
 * All driven by a storm curve: storm(t) -> 0 (calm) .. 1 (full storm). Pass the same function everywhere.
 *   const W = sea({ y: 1180, storm })        // W.y(x, t) = water surface height; front layer occludes what is below it
 *   sky({ storm, goldAt })  rain({ storm })  lightning(t, x)
 *   const B = boat({ x, w, sea: W, draft: t => px, tilt: t => deg })   // B.group = parent for figures; B.toScreen(px,py,t)
 *   B.hole(px, label, t0)   raft(x, sea, { planks, mastAt })
 */
(function () {
  function sea({ y = 1180, storm = () => 0.3, parent } = {}) {
    const A = (t) => 8 + 46 * storm(t);
    const Y = (x, t) => y + A(t) * (0.6 * Math.sin(x * 0.011 + t * 1.7) + 0.4 * Math.sin(x * 0.026 - t * 2.4));
    const mk = (z, fill, stroke, off) => {
      const d = document.createElement('div'); d.className = 'gx-sea';
      d.innerHTML = `<svg width="1080" height="1920" viewBox="0 0 1080 1920"><path fill="${fill}" stroke="${stroke}" stroke-width="5"/></svg>`;
      const el = place(d, 540, 960, { parent, z, glow: false }); el.style.opacity = 1;
      const p = el.querySelector('path');
      on((t) => { let s = `M-20 1940 L-20 ${Y(-20, t + off) + off * 30}`; for (let x = 0; x <= 1100; x += 20) s += ` L${x} ${(Y(x, t + off) + off * 30).toFixed(1)}`; p.setAttribute('d', s + ' L1100 1940 Z'); });
      return el;
    };
    const back = mk(1, '#0b1c2c', 'rgba(170,210,235,.25)', -0.6);
    const front = mk(30, 'rgba(9,26,41,.95)', 'rgba(210,235,250,.75)', 0);
    return { y: Y, back, front, base: y };
  }

  function sky({ storm = () => 0.5, goldAt = 99, parent } = {}) {
    const d = document.createElement('div'); d.className = 'gx-sky';
    let clouds = '';
    for (let i = 0; i < 9; i++) clouds += `<i style="left:${-200 + rand(i) * 1300}px;top:${80 + rand(i * 3) * 520}px;width:${380 + rand(i * 5) * 420}px;height:${150 + rand(i * 7) * 140}px"></i>`;
    d.innerHTML = `<div class="gold"></div><div class="clouds">${clouds}</div>`;
    const el = place(d, 540, 960, { parent, z: 0, glow: false }); el.style.opacity = 1;
    const cl = el.querySelectorAll('.clouds i'), gold = el.querySelector('.gold');
    on((t) => {
      cl.forEach((c, i) => { c.style.transform = `translateX(${((t * (12 + i * 3)) % 400) - 100}px)`; c.style.opacity = (0.35 + 0.5 * storm(t)) * Math.max(0, 1 - (t - goldAt) / 1.2); });
      gold.style.opacity = Math.max(0, Math.min(1, (t - goldAt) / 1.2));
    });
    return el;
  }

  function rain({ storm = () => 0.5, parent, n = 150 } = {}) {
    const d = document.createElement('div'); d.className = 'gx-rain';
    let ls = ''; for (let i = 0; i < n; i++) ls += '<line/>';
    d.innerHTML = `<svg width="1080" height="1920" viewBox="0 0 1080 1920"><g stroke="rgba(200,220,240,.55)" stroke-width="2.5" stroke-linecap="round">${ls}</g></svg>`;
    const el = place(d, 540, 960, { parent, z: 40, glow: false }); el.style.opacity = 1;
    const L = el.querySelectorAll('line');
    on((t) => {
      const k = storm(t);
      L.forEach((l, i) => {
        const vis = rand(i * 1.37) < k; l.style.display = vis ? '' : 'none'; if (!vis) return;
        const sp = 1700 + rand(i) * 900, y = ((t * sp + rand(i * 9) * 1920) % 2100) - 100, x = (rand(i * 4.1) * 1300 - 110) - y * 0.22;
        l.setAttribute('x1', x.toFixed(1)); l.setAttribute('y1', y.toFixed(1)); l.setAttribute('x2', (x - 14).toFixed(1)); l.setAttribute('y2', (y + 60).toFixed(1));
      });
    });
    return el;
  }

  function lightning(t0, x, { parent, yEnd = 1150 } = {}) {
    let p = `M${x} -20`, cx = x, cy = -20, i = 0;
    while (cy < yEnd) { cy += 70 + rand(t0 + i) * 60; cx += (rand(t0 * 3 + i) - 0.5) * 140; p += ` L${cx.toFixed(0)} ${cy.toFixed(0)}`; i++; }
    const d = document.createElement('div'); d.className = 'gx-bolt';
    d.innerHTML = `<svg width="1080" height="1920" viewBox="0 0 1080 1920"><path d="${p}" fill="none" stroke="#fff" stroke-width="7" stroke-linejoin="round"/></svg>`;
    const el = place(d, 540, 960, { parent, z: 35, glow: true });
    tw(el, t0, 0.04, { opacity: [0, 1] }); tw(el, t0 + 0.08, 0.05, { opacity: [1, 0.2] }); tw(el, t0 + 0.14, 0.04, { opacity: [0.2, 1] }); tw(el, t0 + 0.24, 0.3, { opacity: [1, 0] });
    const f = document.createElement('div'); f.style.cssText = 'width:1080px;height:1920px;background:#dfe9ff';
    const fl = place(f, 540, 960, { parent: document.getElementById('stage'), z: 39, glow: false });
    tw(fl, t0, 0.03, { opacity: [0, 0.55] }); tw(fl, t0 + 0.05, 0.35, { opacity: [0.55, 0] });
    return el;
  }

  function sunbeam(x, t0, { parent } = {}) {
    const d = document.createElement('div'); d.className = 'gx-sunbeam';
    const el = place(d, x, -200, { parent, anchor: 'top', z: 3, glow: false });
    tw(el, t0, 1.4, { opacity: [0, 1] }, 'inOut');
    return el;
  }

  function boat({ x = 400, w = 600, sea: W, draft = () => 0, tilt = () => 0, parent } = {}) {
    const H = 560, HULL = 190, gun = H - HULL;                 // group height; gunwale y in group coords
    const g = document.createElement('div'); g.className = 'gx-boat';
    g.style.width = w + 'px'; g.style.height = H + 'px';
    g.innerHTML = `<svg class="hull" width="${w}" height="${HULL + 10}" viewBox="0 0 ${w} ${HULL + 10}" style="position:absolute;left:0;top:${gun}px;z-index:10;overflow:visible">
      <path d="M0 4 H${w} L${w - 55} ${HULL - 20} Q${w - 68} ${HULL} ${w - 100} ${HULL} H100 Q68 ${HULL} 55 ${HULL - 20} Z" fill="#15171e" stroke="#e8e8e8" stroke-width="6" stroke-linejoin="round"/>
      <path d="M22 60 H${w - 22} M40 115 H${w - 40}" stroke="#3b3f4c" stroke-width="4"/></svg>`;
    const el = place(g, x, W.base + 120, { parent, anchor: 'bottom', z: 20, glow: false }); el.style.opacity = 1;
    el.style.transformOrigin = '50% 100%';
    const motion = (t) => ({ dy: W.y(x, t) - W.base + draft(t), rot: tilt(t) + Math.sin(t * 1.5) * (1.5 + 3 * ((W.y(x + 40, t) - W.y(x - 40, t)) / 40)) });
    on((t) => { const m = motion(t); el.style.transform = `translate(0px, ${m.dy.toFixed(1)}px) rotate(${m.rot.toFixed(2)}deg)`; });
    // group coords (px from left, py from top) -> screen at time t
    el.toScreen = (px, py, t) => {
      const m = motion(t), r = (m.rot * Math.PI) / 180, ox = x, oy = W.base + 120 + m.dy;
      const lx = px - w / 2, ly = py - H;
      return { x: ox + lx * Math.cos(r) - ly * Math.sin(r), y: oy + lx * Math.sin(r) + ly * Math.cos(r) };
    };
    el.gun = gun; el.W = w; el.H = H;
    // a leak: jet of water spraying up from inside the boat + a label on the hull
    el.hole = (px, label, t0) => {
      const j = document.createElement('div'); j.className = 'gx-jet';
      j.innerHTML = `<svg width="80" height="200" viewBox="0 0 80 200" style="overflow:visible"><path d="M40 200 Q30 90 40 10 M40 200 Q55 100 62 40 M40 200 Q22 110 16 50" fill="none" stroke="#bfe3f5" stroke-width="7" stroke-linecap="round" stroke-dasharray="14 10"/></svg>`;
      const je = place(j, px, gun + 40, { parent: el, anchor: 'bottom', z: 8, glow: false });
      je.style.transformOrigin = '50% 100%';
      tw(je, t0, 0.25, { opacity: [0, 1], scale: [0.2, 1] }, 'back');
      const p = je.querySelector('svg'); on((t) => { p.style.strokeDashoffset = (-t * 140).toFixed(0); je.style.scale = t > t0 ? 0.9 + 0.12 * Math.sin(t * 18 + px) : ''; });
      const s = monoSign(label, px, gun + 95, { parent: el, z: 12 }); pop(s, t0 + 0.1, 0.3);
      return { jet: je, sign: s };
    };
    return el;
  }

  function raft(x, W, { parent, planks = 5, w = 250 } = {}) {
    const d = document.createElement('div'); d.className = 'gx-raft';
    d.style.width = w + 'px'; d.style.height = '330px';
    let ps = ''; for (let i = 0; i < planks; i++) ps += `<rect class="pl pl${i}" x="${i * (w / planks) + 2}" y="292" width="${w / planks - 4}" height="30" rx="5" fill="#8a6a3f" stroke="#e8d3a8" stroke-width="3"/>`;
    d.innerHTML = `<svg width="${w}" height="330" viewBox="0 0 ${w} 330" style="overflow:visible">
      <g class="mast" opacity="0"><path d="M${w / 2} 292 V40" stroke="#e8d3a8" stroke-width="7"/><path d="M${w / 2 + 4} 50 Q${w / 2 + 120} 120 ${w / 2 + 6} 250 Z" fill="#f5c542" stroke="#fff3c9" stroke-width="3"/></g>${ps}</svg>`;
    const el = place(d, x, W.base + 20, { parent, anchor: 'bottom', z: 22, glow: false }); el.style.opacity = 1;
    el.style.transformOrigin = '50% 100%';
    on((t) => { const dy = W.y(x, t) - W.base, r = (W.y(x + 60, t) - W.y(x - 60, t)) * 0.25; el.style.transform = `translate(0px, ${dy.toFixed(1)}px) rotate(${r.toFixed(2)}deg)`; });
    el.querySelectorAll('.pl').forEach((p) => (p.style.opacity = 0));
    el.addPlank = (i, t0) => { const p = el.querySelector('.pl' + i); on((t) => { const k = Math.max(0, Math.min(1, (t - t0) / 0.18)); p.style.opacity = k; p.setAttribute('transform', `translate(0 ${((1 - k) * -40).toFixed(1)})`); }); };
    el.mast = (t0) => { const m = el.querySelector('.mast'); on((t) => m.setAttribute('opacity', Math.max(0, Math.min(1, (t - t0) / 0.4)))); };
    el.deck = (t) => ({ x, y: W.y(x, t) + 20 - 38 });   // feet position on the raft
    return el;
  }

  Object.assign(window, { sea, sky, rain, lightning, sunbeam, boat, raft });
})();
