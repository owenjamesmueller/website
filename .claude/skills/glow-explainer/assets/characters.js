/* Big posable characters + metaphor props (the "settled people" reference style).
 * Load after engine.js and components.js.
 *
 *   const p = person(x, floorY, { size, dim, cap, flip })   // anchor = feet
 *   p.pose(t0, 'up', dur)        // idle | up | both | point | hold | type | shrug | wave | carry
 *   caption('YOU: WORK', x, floorY)                         // small tracked label UNDER the floor
 *   room(x, y, w, h)  lamp(x, y)  desk(x, floorY)  sign(text, x, y)  titleCard(html)
 *   tree(x, floorY, { size }) -> el.grow(t0, dur); el.rain(t0, t1, every)   // coins fall from it
 *   sprout(x, floorY)  bucket(x, y) -> el.fill(t0,t1,every) el.leak(t0,t1,every,labels)
 */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const W = 300, H = 440;                    // person viewBox; feet at (150, 440)
  const SH = { L: [82, 238], R: [218, 238] }; // shoulder joints
  const UP = 100, FORE = 90;                 // arm segment lengths
  // pose = [L upper, L fore, R upper, R fore] in degrees; 0 = straight down, + = outward
  const POSES = {
    idle:  [6, 0, 6, 0],
    up:    [6, 0, 168, 6],
    both:  [150, 12, 150, 12],
    point: [6, 0, 92, 0],
    hold:  [6, 0, 58, 32],
    type:  [-70, -18, 70, 18],
    shrug: [55, 85, 55, 85],
    wave:  [6, 0, 140, 35],
    carry: [40, 70, 40, 70],
    mop:   [6, 0, 35, -35],          // right hand on a mop handle (use with { mop: true })
    hips:  [40, 120, 40, 120],       // hands on hips
  };
  const rad = (d) => (d * Math.PI) / 180;

  function person(x, y, { size = 1, dim = false, cap = false, tie = false, beanie = false, mop = false, parent } = {}) {
    const fill = dim ? '#9a9a9a' : '#ffffff';
    const d = document.createElement('div');
    d.className = 'gx-svg gx-figure gx-person';
    d.innerHTML = `<svg xmlns="${NS}" width="${W * size}" height="${H * size}" viewBox="0 0 ${W} ${H}" style="overflow:visible">
      <path class="armL" fill="none" stroke="${fill}" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="armR" fill="none" stroke="${fill}" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>
      <path fill="${fill}" d="M58 440 V300 Q58 214 150 210 Q242 214 242 300 V440 Z"/>
      <circle cx="150" cy="128" r="58" fill="${fill}"/>
      ${cap ? `<path d="M78 62 L150 30 L222 62 L150 92 Z" fill="#050505" stroke="${fill}" stroke-width="8" stroke-linejoin="round"/>` : ''}
      ${tie ? `<path d="M116 216 L150 256 L184 216" fill="none" stroke="#0a0a0a" stroke-width="9" stroke-linejoin="round"/><path d="M140 252 H160 L170 330 L150 356 L130 330 Z" fill="#0a0a0a"/>` : ''}
      ${beanie ? `<path d="M90 112 Q90 54 150 54 Q210 54 210 112 Z" fill="#0a0a0a"/><rect x="86" y="100" width="128" height="24" rx="11" fill="#0a0a0a" stroke="${fill}" stroke-width="5"/>` : ''}
      ${mop ? `<g class="mop"><path d="M275 150 V430" stroke="#c9c9c9" stroke-width="10" stroke-linecap="round"/><path d="M235 432 H315 L300 470 H250 Z" fill="#c9c9c9"/><path d="M245 470 V500 M262 470 V505 M279 470 V505 M296 470 V500" stroke="#c9c9c9" stroke-width="7" stroke-linecap="round"/></g>` : ''}
    </svg>`;
    const el = place(d, x, y, { parent, anchor: 'bottom', z: 5, glow: !dim });
    const aL = el.querySelector('.armL'), aR = el.querySelector('.armR');
    const keys = [{ t0: -99, dur: 0, pose: mop ? POSES.mop : POSES.idle }];
    const mopEl = el.querySelector('.mop'); const sweeps = [];
    el.sweep = (t0, t1) => { sweeps.push([t0, t1]); return el; };
    el.pose = (t0, name, dur = 0.35) => { keys.push({ t0, dur, pose: POSES[name] || name }); keys.sort((a, b) => a.t0 - b.t0); return el; };
    const arm = (sx, sy, a1, a2, side) => {
      const s = side === 'L' ? -1 : 1;
      const ex = sx + s * Math.sin(rad(a1)) * UP, ey = sy + Math.cos(rad(a1)) * UP;
      const hx = ex + s * Math.sin(rad(a1 + a2)) * FORE, hy = ey + Math.cos(rad(a1 + a2)) * FORE;
      return `M${sx} ${sy} L${ex.toFixed(1)} ${ey.toFixed(1)} L${hx.toFixed(1)} ${hy.toFixed(1)}`;
    };
    on((t) => {
      let i = 0;
      for (let k = 0; k < keys.length; k++) if (t >= keys[k].t0) i = k;
      const cur = keys[i], from = i ? keys[i - 1].pose : cur.pose;
      const p = cur.dur ? EASE.inOut(Math.max(0, Math.min(1, (t - cur.t0) / cur.dur))) : 1;
      const v = cur.pose.map((b, i) => from[i] + (b - from[i]) * p);
      if (mopEl) { let a = 0; for (const [a0, a1] of sweeps) if (t >= a0 && t <= a1) a = Math.sin((t - a0) * 7) * 14; mopEl.setAttribute('transform', `rotate(${a.toFixed(1)} 275 410)`); }
      aL.setAttribute('d', arm(...SH.L, v[0], v[1], 'L'));
      aR.setAttribute('d', arm(...SH.R, v[2], v[3], 'R'));
    });
    return el;
  }

  function caption(text, x, floorY, { parent, dy = 46 } = {}) {
    const d = document.createElement('div'); d.className = 'gx-caption'; d.textContent = text;
    return place(d, x, floorY + dy, { parent, anchor: 'top', z: 8 });
  }
  function room(x, y, w, h, { parent } = {}) {
    const d = document.createElement('div'); d.className = 'gx-room';
    d.style.width = w + 'px'; d.style.height = h + 'px';
    d.innerHTML = `<div class="gx-room-lamp" style="left:${w * 0.3}px"></div><div class="gx-room-lamp" style="left:${w * 0.7}px"></div>`;
    return place(d, x, y, { parent, anchor: 'bottom', z: 2 });
  }
  function desk(x, floorY, { parent, screen = true } = {}) {
    const d = document.createElement('div'); d.className = 'gx-svg gx-desk';
    d.innerHTML = `<svg width="300" height="260" viewBox="0 0 300 260" style="overflow:visible">
      <path d="M10 120 H290 M40 120 V260 M260 120 V260" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>
      ${screen ? '<rect x="110" y="10" width="140" height="100" rx="8" fill="#050505" stroke="#fff" stroke-width="8"/><rect class="gx-screen" x="122" y="22" width="116" height="76" rx="4" fill="#fff" opacity=".18"/>' : ''}
    </svg>`;
    return place(d, x, floorY, { parent, anchor: 'bottom', z: 4 });
  }
  function sign(text, x, y, { parent, stick = 160 } = {}) {
    const d = document.createElement('div'); d.className = 'gx-sign';
    d.innerHTML = `<div class="gx-sign-board">${text}</div><div class="gx-sign-stick" style="height:${stick}px"></div>`;
    return place(d, x, y, { parent, anchor: 'bottom', z: 7 });
  }
  function titleCard(html, { parent, y = 760 } = {}) {
    const d = document.createElement('div'); d.className = 'gx-title'; d.innerHTML = html;
    return place(d, 540, y, { parent, z: 30 });
  }
  function tree(x, floorY, { size = 1, parent } = {}) {
    const d = document.createElement('div'); d.className = 'gx-svg gx-tree';
    d.innerHTML = `<svg width="${260 * size}" height="${380 * size}" viewBox="0 0 260 380" style="overflow:visible">
      <path d="M130 380 V200 M130 280 L90 240 M130 250 L175 205" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round"/>
      <circle cx="130" cy="130" r="110" fill="#050505" stroke="#fff" stroke-width="8"/>
      <circle cx="95" cy="110" r="14" fill="#f5c542"/><circle cx="160" cy="95" r="14" fill="#f5c542"/><circle cx="135" cy="165" r="14" fill="#f5c542"/>
    </svg>`;
    const el = place(d, x, floorY, { parent, anchor: 'bottom', z: 4 });
    el.style.transformOrigin = '50% 100%';
    el.grow = (t0, dur = 1.2) => { tw(el, t0, 0.2, { opacity: [0, 1] }); tw(el, t0, dur, { scale: [0.05, 1] }, 'back'); return el; };
    el.rain = (t0, t1, every = 0.5) => {
      for (let t = t0, i = 0; t < t1; t += every, i++) {
        const c = goldCoin(x + (rand(i + x) - 0.5) * 160 * size, floorY - 300 * size, { size: 38, parent });
        tw(c, t, 0.08, { opacity: [0, 1] }); tw(c, t, 0.7, { y: [0, 280 * size] }, 'in'); tw(c, t + 0.62, 0.08, { opacity: [1, 0] });
      }
      return el;
    };
    return el;
  }
  function sprout(x, floorY, { parent } = {}) {
    const d = document.createElement('div'); d.className = 'gx-svg gx-sprout';
    d.innerHTML = `<svg width="120" height="140" viewBox="0 0 120 140" style="overflow:visible">
      <path d="M60 140 V70" stroke="#fff" stroke-width="8" stroke-linecap="round"/>
      <path d="M60 85 Q20 80 18 45 Q55 45 60 85 Z M60 75 Q100 70 102 30 Q65 30 60 75 Z" fill="#fff"/>
      <ellipse cx="60" cy="140" rx="46" ry="10" fill="none" stroke="#fff" stroke-width="5"/></svg>`;
    const el = place(d, x, floorY, { parent, anchor: 'bottom', z: 4 });
    el.style.transformOrigin = '50% 100%';
    return el;
  }
  function bucket(x, y, { parent, holes = 3, size = 1 } = {}) {
    const d = document.createElement('div'); d.className = 'gx-svg gx-bucket';
    let hs = ''; for (let i = 0; i < holes; i++) hs += `<circle cx="${70 + i * 60}" cy="232" r="9" fill="#050505" stroke="#fff" stroke-width="4"/>`;
    d.innerHTML = `<svg width="${260 * size}" height="${250 * size}" viewBox="0 0 260 250" style="overflow:visible">
      <path d="M20 40 L50 240 H210 L240 40" fill="#050505" stroke="#fff" stroke-width="10" stroke-linejoin="round"/>
      <ellipse cx="130" cy="40" rx="110" ry="22" fill="#050505" stroke="#fff" stroke-width="10"/>
      <path d="M30 40 Q130 -70 230 40" fill="none" stroke="#fff" stroke-width="6"/>${hs}</svg>`;
    const el = place(d, x, y, { parent, z: 5 });
    el.fill = (t0, t1, every = 0.35) => {
      for (let t = t0, i = 0; t < t1; t += every, i++) {
        const c = goldCoin(x + (rand(i * 3.3) - 0.5) * 120 * size, y - 330 * size, { size: 40 * size, parent });
        tw(c, t, 0.08, { opacity: [0, 1] }); tw(c, t, 0.45, { y: [0, 230 * size] }, 'in'); tw(c, t + 0.4, 0.06, { opacity: [1, 0] });
      }
      return el;
    };
    el.leak = (t0, t1, every = 0.3, nh = holes) => {
      for (let t = t0, i = 0; t < t1; t += every, i++) {
        const h = i % nh, hx = x + (-60 + h * 60) * size;
        const c = goldCoin(hx, y + 110 * size, { size: 32 * size, parent });
        tw(c, t, 0.06, { opacity: [0, 1] }); tw(c, t, 0.45, { y: [0, 150] }, 'in'); tw(c, t + 0.38, 0.08, { opacity: [1, 0] });
      }
      return el;
    };
    return el;
  }

  Object.assign(window, { person, caption, room, desk, sign, titleCard, tree, sprout, bucket, POSES });
})();
