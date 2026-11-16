/* "Kodak invented the digital camera, and kept it quiet" — Mode A, true story (Steve Sasson, 1975; Kodak Chapter 11, Jan 2012).
 * 15 sets, one per beat. Central object: the prototype camera, from the lab bench to the locked drawer (callback ending).
 */
window.GX_PACE = 0.8;
const VO = window.DURATION;
window.DURATION = VO + 2.0;
const END = window.DURATION;
const C = (p, o = 0, from = 0) => cue(p, o, from);
const cam = document.getElementById('cam'); drift(cam, 4);
punches('#stage', 0.035, 0.22);
const FL = 1300;
const S0 = (el) => show(el, -1, null, 0.01);                 // visible from the first frame of its set

/* ============ S1 — hook: "In 1975, a young engineer at Kodak invented the digital camera." ============ */
const S1 = stageSet(); enter(S1, -1, 'cut');
{
  S0(floor(FL, { parent: S1 }));
  S0(halo(760, 1150, { r: 260, parent: S1 }));
  const eng = person(320, FL, { size: 0.85, parent: S1 }); S0(eng);
  const pc = protoCamera(760, 1200, { parent: S1 }); S0(pc);
  eng.pose(-1, 'point', 0.01).pose(C('invented') - 0.1, 'up', 0.25);
  S0(caption('Young engineer', 340, FL, { parent: S1 }));
  const hook = titleCard('They invented it.<br>Then _hid it._', { parent: S1, y: 470, kicker: 'Kodak · 1975', size: 78 }); S0(hook);
  out(hook, C('digital') - 0.35, 0.2);
  flash(C('invented') + 0.15, { parent: S1 });
  pc.dataset.glowColor = '159,211,255'; pc.dataset.glow = ''; tw(pc, C('invented') + 0.15, 0.5, { glow: [0, 1.2] });
  const first = pill('The first digital camera', 540, 520, { size: 'md', parent: S1 }); pop(first, C('digital'));
}

/* ============ S2 — "Kodak kept it quiet." ============ */
const S2 = stageSet(); sceneSwap(S1, S2, C('kept') - 0.45, 'zoom');
{
  const sp = spotlight(540, 560, { width: 460, height: 800, parent: S2 }); S0(sp);
  tw(sp, C('quiet'), 0.6, { opacity: [1, 0.25] });
  const pc = protoCamera(540, 1180, { parent: S2, size: 1.2 }); S0(pc);
  tw(pc, C('quiet'), 0.6, { opacity: [1, 0.45] });
  stamp('CONFIDENTIAL', 540, 860, C('quiet') - 0.05, { parent: S2, rot: -8 });
  const t = titleCard('Kept it _quiet._', { parent: S2, y: 470, size: 84 }); pop(t, C('kept'));
}

/* ============ S3 — "It was the size of a toaster, it took twenty-three seconds to save one black and white photo," ============ */
const S3 = stageSet(); sceneSwap(S2, S3, C('size') - 0.45, 'whip');
{
  const pc = protoCamera(540, 1110, { parent: S3, size: 1.55 }); S0(pc);
  const p1 = pill('Size of a toaster', 540, 420, { size: 'md', parent: S3 }); pop(p1, C('toaster') - 0.1);
  const st = stat('Time to save one photo', '0.0s', 540, 640, { size: 96, parent: S3 }); pop(st, C('took') - 0.1);
  count(st.querySelector('.gx-stat-val'), C('took'), C('save') - C('took') + 0.4, 0, 23, (v) => v.toFixed(1) + 's');
  on((t) => st.classList.toggle('red', t >= C('save')));
  const c = caption('0.01 MP · black & white', 540, 1280, { parent: S3 }); pop(c, C('black'));
  flash(C('photo') - 0.05, { parent: S3 });
}

/* ============ S4 — "and his bosses thought it was cute." ============ */
const S4 = stageSet(); sceneSwap(S3, S4, C('bosses') - 0.3, 'push');
{
  S0(floor(FL, { parent: S4 }));
  const B = [[220, 0.78], [540, 0.9], [860, 0.78]].map(([x, s]) => { const p = person(x, FL, { size: s, tie: true, parent: S4 }); S0(p); p.pose(-1, 'hips', 0.01); return p; });
  const b = bubble('Cute.', 540, FL - 396 - 30, { parent: S4, fill: true }); b.style.fontSize = '58px'; pop(b, C('cute') - 0.05);
  B.forEach((p, i) => { bob(p, C('cute') + 0.05, C('cute') + 1.0, 8 + i * 2, 16); p.pose(C('cute') + i * 0.05, 'shrug', 0.2); });
  S0(caption('Kodak management', 540, FL, { parent: S4 }));
  const t = titleCard('His bosses<br>*laughed.*', { parent: S4, y: 470, size: 80 }); pop(t, C('bosses'));
}

/* ============ S5 — "But they understood exactly what it meant." ============ */
const S5 = stageSet(); sceneSwap(S4, S5, C('but they') - 0.1, 'zoom');
{
  const h = halo(540, 1120, { r: 330, parent: S5 }); h.dataset.glowColor = '255,90,95'; S0(h);
  const sp = spotlight(540, 600, { width: 520, height: 780, parent: S5 }); S0(sp);
  tw(sp, C('exactly'), 0.8, { scale: [1, 0.7] }, 'inOut');
  const boss = person(540, 1360, { size: 1.15, tie: true, parent: S5 }); S0(boss); boss.pose(-1, 'idle', 0.01);
  tw(S5, C('but they'), C('every photo') - C('but they'), { scale: [1, 1.08] }, 'linear');
  const t = titleCard('They knew _exactly_<br>what it meant.', { parent: S5, y: 470, size: 70 }); pop(t, C('understood'));
}

/* ============ S6 — "Every photo you took made Kodak money. The film. The chemicals. The paper it was printed on." ============ */
const S6 = stageSet(); sceneSwap(S5, S6, C('every photo') - 0.1, 'whip');
{
  S0(floor(FL, { parent: S6 }));
  const kt = brandTower(860, FL, 'KODAK', { parent: S6, w: 280, h: 560 }); S0(kt);
  const t = titleCard('Every photo paid *Kodak.*', { parent: S6, y: 400, size: 60 }); pop(t, C('every photo'));
  const items = [['film', 715, 'film'], ['bottle', 945, 'chemicals'], ['paper', 1190, 'paper']];
  items.forEach(([n, y, w], i) => {
    const tc = C(w, 0, C('money'));
    const o = thing(n, 250, y, { parent: S6, scale: n === 'film' ? 1.2 : n === 'bottle' ? 1.05 : 1.0 }); pop(o, tc - 0.1);
    const lb = pill(w === 'paper' ? 'Paper' : w === 'film' ? 'Film' : 'Chemicals', 520, y, { size: 'md', parent: S6 }); pop(lb, tc);
    for (let k = 0; k < 3; k++) {
      const c = goldCoin(420, y - 40, { size: 44, parent: S6 }); const t0 = tc + 0.25 + k * 0.14;
      tw(c, t0, 0.04, { opacity: [0, 1] }); arc(c, t0, 0.6, 340, 40 - k * 10, 150); tw(c, t0 + 0.56, 0.06, { opacity: [1, 0] });
    }
    tw(kt, tc + 0.8, 0.3, { scale: [1.04, 1] }, 'out');
  });
  kt.dataset.glowColor = '245,197,66'; kt.dataset.glow = ''; tw(kt, C('paper', 0, C('money')) + 0.8, 0.5, { glow: [0, 1.2] });
}

/* ============ S7 — "A camera without film was a camera that didn't need Kodak." ============ */
const S7 = stageSet(); sceneSwap(S6, S7, C('without') - 0.45, 'push');
{
  S0(floor(FL, { parent: S7 }));
  const kt = brandTower(830, FL, 'KODAK', { parent: S7, w: 300, h: 560 }); S0(kt);
  const pc = protoCamera(240, 1200, { parent: S7, size: 0.95 }); S0(pc);
  link(410, 1010, 660, 1010, C('without') - 0.2, { parent: S7, cut: C('need') });
  const p = pill('No film', 240, 990, { size: 'md', parent: S7 }); pop(p, C('film', 0, C('without')));
  const t = titleCard('No film.<br>_No Kodak._', { parent: S7, y: 470, size: 88 }); pop(t, C('need'));
  kt.lightsOut(C('need') + 0.1, 0.6);
}

/* ============ S8 — "So they did what successful companies always do. They protected what was working." ============ */
const S8 = stageSet(); sceneSwap(S7, S8, C('so they') - 0.1, 'whip');
{
  S0(floor(FL, { parent: S8 }));
  const kt = brandTower(540, FL, 'KODAK', { parent: S8, w: 300, h: 600 }); S0(kt);
  const wall = brickWall(540, FL, { parent: S8, cols: 8, rows: 5, bw: 92, bh: 46 }); wall.dataset.overlapOk = ''; S0(wall);
  wall.rise(C('protected') - 0.2, 1.0);
  const t1 = titleCard('What successful<br>companies do', { parent: S8, y: 440, size: 64 }); pop(t1, C('successful'));
  out(t1, C('protected') - 0.3, 0.2);
  const t2 = titleCard('Protect what’s<br>*working.*', { parent: S8, y: 440, size: 72 }); pop(t2, C('protected'));
}

/* ============ S9 — "For years, they kept selling film." ============ */
const S9 = stageSet(); sceneSwap(S8, S9, C('years') - 0.4, 'whip');
{
  const belt = document.createElement('div'); belt.style.cssText = 'width:1200px;height:16px;border-radius:8px;background:#2a2d36;border:3px solid #9a9a9a';
  S0(place(belt, 540, 1210, { parent: S9, z: 2, glow: false }));
  for (let i = 0; i < 7; i++) {                                         // a production line of film rolls, never touching
    const f = thing('film', -200, 1125, { parent: S9, scale: 1.0 }); const t0 = C('years') - 2.2 + i * 0.6;
    tw(f, t0, 0.02, { opacity: [0, 1] }); tw(f, t0, 3.2, { x: [0, 1500] }, 'linear'); tw(f, t0 + 2.5, 0.02, { opacity: [1, 0] });
  }
  const yr = stat('Year', '1975', 540, 640, { size: 100, parent: S9, tone: 'gold' }); pop(yr, C('years'));
  count(yr.querySelector('.gx-stat-val'), C('years'), C('by the time') - C('years') - 0.2, 1975, 2003, (v) => String(Math.round(v)));
  const p = pill('Still selling film', 540, 880, { size: 'md', parent: S9 }); pop(p, C('selling'));
}

/* ============ S10 — "By the time Kodak went all in on digital, everyone already had a camera in their pocket." ============ */
const S10 = stageSet(); sceneSwap(S9, S10, C('by the time') - 0.1, 'push');
{
  S0(floor(FL, { parent: S10 }));
  const xs = [150, 345, 540, 735, 930];
  xs.forEach((x, i) => {
    const p = person(x, FL, { size: 0.58, dim: true, parent: S10 }); S0(p);
    const tp = C('everyone') + i * 0.12;
    p.pose(tp, 'up', 0.2);
    const ph = thing('phone', x + 60, FL - 255 - 70, { parent: S10, scale: 0.55 }); ph.dataset.overlapOk = ''; pop(ph, tp + 0.1);
  });
  const st = stat('Kodak goes digital', 'Too late', 540, 700, { size: 76, parent: S10, tone: 'red' }); pop(st, C('all in'));
  const t = titleCard('A camera in<br>every *pocket.*', { parent: S10, y: 420, size: 66 }); pop(t, C('pocket') - 0.2);
}

/* ============ S11 — "Film collapsed." ============ */
const S11 = stageSet(); sceneSwap(S10, S11, C('collapsed') - 0.55, 'zoom');
{
  const p = pill('Film sales', 540, 600, { size: 'md', parent: S11 }); S0(p);
  crashChart(540, 960, 760, 460, C('collapsed') - 0.45, 1.1, { parent: S11 });
  shake(cam, C('collapsed') + 0.1, 0.35, 14);
  const t = titleCard('Film _collapsed._', { parent: S11, y: 430, size: 80 }); pop(t, C('collapsed'));
}

/* ============ S12 — "In January 2012, Kodak filed for bankruptcy." ============ */
const S12 = stageSet(); sceneSwap(S11, S12, C('january') - 0.4, 'whip');
{
  S0(floor(FL, { parent: S12 }));
  const kt = brandTower(540, FL, 'KODAK', { parent: S12, w: 380, h: 700 }); S0(kt); kt.lightsOut(C('filed'), 0.9);
  const t = titleCard('Chapter 11', { parent: S12, y: 390, kicker: 'January 2012', size: 56 }); pop(t, C('january'));
  stamp('BANKRUPT', 540, 960, C('bankruptcy') - 0.05, { parent: S12 });
  shake(cam, C('bankruptcy') + 0.15, 0.3, 12);
}

/* ============ S13 — "Three months later, a photo app with thirteen employees sold for one billion dollars." ============ */
const S13 = stageSet(); sceneSwap(S12, S13, C('months') - 0.45, 'whip');
{
  S0(floor(FL, { parent: S13 }));
  const p = pill('Three months later', 540, 340, { size: 'md', parent: S13 }); S0(p);
  const app = thing('app', 540, 560, { parent: S13, scale: 1.15 }); pop(app, C('app') - 0.1);
  app.dataset.glowColor = '245,197,66'; app.dataset.glow = '';
  const row = (n, fl, x0) => Array.from({ length: n }, (_, i) => { const q = person(x0 + i * 115, fl, { size: 0.27, parent: S13 }); return q; });
  const ppl = [...row(7, 1140, 195), ...row(6, FL, 252)];
  ppl.forEach((q, i) => pop(q, C('employees') - 0.3 + i * 0.04));
  const c = caption('13 employees', 540, FL, { parent: S13 }); pop(c, C('employees'));
  const st = stat('Sold for', '$0', 540, 800, { size: 92, parent: S13, tone: 'gold' }); pop(st, C('sold'));
  count(st.querySelector('.gx-stat-val'), C('sold'), 1.2, 0, 1000, (v) => (v >= 999.5 ? '$1 BILLION' : '$' + Math.round(v) + 'M'));
  tw(app, C('sold') + 1.1, 0.6, { glow: [0, 1.4] });
}

/* ============ S14 — "Kodak didn't miss the future. It invented the future, and locked it in a drawer." ============ */
const S14 = stageSet(); sceneSwap(S13, S14, C('miss') - 0.55, 'zoom');
{
  S0(floor(1360, { parent: S14 }));
  const d = drawer(540, 1360, { parent: S14 }); S0(d);
  d.open(C('invented', 0, C('miss')) - 0.1, 1).close(C('drawer') - 0.1);
  const pc = protoCamera(540, 700, { parent: S14, size: 0.55 }); S0(pc); pc.dataset.overlapOk = '';
  pc.dataset.glowColor = '159,211,255'; pc.dataset.glow = ''; tw(pc, C('future') , 0.5, { glow: [0, 1.2] });
  tw(pc, C('locked') - 0.2, 0.45, { y: [0, 390], scale: [1, 0.8] }, 'in'); tw(pc, C('locked') + 0.2, 0.12, { opacity: [1, 0] });
  const t1 = titleCard('It saw the *future.*', { parent: S14, y: 430, size: 70 }); pop(t1, C('future'));
  out(t1, C('locked') - 0.3, 0.2);
  const t2 = titleCard('Then _locked it away._', { parent: S14, y: 430, size: 66 }); pop(t2, C('locked'));
  shake(cam, C('drawer') + 0.25, 0.25, 10);
}

/* ============ S15 — "What ends you is rarely the thing you never saw. It's the thing you saw, and hoped would wait." ============ */
const S15 = stageSet(); sceneSwap(S14, S15, C('what ends') - 0.1, 'push');
{
  S0(floor(1360, { parent: S15 }));
  const h = halo(540, 1080, { r: 300, parent: S15 }); h.dataset.glowColor = '245,197,66'; show(h, C('saw', 0, C('its')), null, 0.6);
  const d = drawer(540, 1360, { parent: S15 }); S0(d); d.open(C('saw', 0, C('its')), 0.18);
  for (let i = 0; i < 12; i++) {                                        // light leaking out of the drawer
    const c = goldCoin(400 + rand(i) * 280, 1060, { size: 16, parent: S15 }); const t0 = C('saw', 0, C('its')) + 0.2 + i * 0.22;
    tw(c, t0, 0.2, { opacity: [0, 0.9] }); tw(c, t0, 2.2, { y: [0, -160 - rand(i * 3) * 80], x: [(rand(i * 5) - 0.5) * 60, (rand(i * 7) - 0.5) * 160] }, 'out'); tw(c, t0 + 1.6, 0.5, { opacity: [0.9, 0] });
  }
  tw(S15, C('what ends'), END - C('what ends'), { scale: [1, 1.06] }, 'linear');
  const t1 = titleCard('What ends you isn’t<br>what you _missed._', { parent: S15, y: 520, size: 62 }); pop(t1, C('ends'));
  out(t1, C('its') - 0.25, 0.2);
  const t2 = titleCard('It’s what you saw<br>and hoped would *wait.*', { parent: S15, y: 520, kicker: 'The lesson', size: 62 });
  tw(t2, C('its') - 0.05, 0.45, { opacity: [0, 1], scale: [0.94, 1] }, 'out');
}

/* ================= SOUND DESIGN (real recordings: assets/sfx/real) ================= */
{
  const R = (n, t, v, d = 0) => sfx('real/' + n, t, v, d);
  // S1 the lab: night hum, the invention reveal, the flash
  R('night-ambience', 0, 0.22, C('kept'));
  R('logo-reveal', 0.05, 0.35, 2.5);
  R('achievement', C('digital') - 0.05, 0.3, 1.4);
  // S2 kept quiet
  R('tension-drone', C('kept') - 0.3, 0.3, C('size') - C('kept') + 0.3); R('door-slam', C('quiet') - 0.05, 0.3, 0.8);
  // S3 the toaster camera
  R('typing', C('took'), 0.18, 1.4); R('score-count', C('took'), 0.3, C('save') - C('took') + 0.3); R('impact-quick', C('save') + 0.1, 0.35, 0.8);
  // S4 the bosses
  R('crowd-laugh', C('cute') - 0.05, 0.4, 1.6);
  // S5 the turn
  R('heartbeat', C('but they'), 0.45, C('every photo') - C('but they')); R('whoosh-deep-hit', C('exactly') - 0.1, 0.35, 1.5);
  // S6 money machine
  ['film', 'chemicals', 'paper'].forEach((w, i) => { const t = C(w, 0, C('money')); R('pop-click', t - 0.1, 0.3, 0.5); R('coins-clink', t + 0.55, 0.3 + i * 0.05, 1); });
  R('money-bag', C('paper', 0, C('money')) + 0.8, 0.4, 1);
  // S7 the threat
  R('swell-suspense', C('without') - 0.2, 0.28, 2.4); R('glitch', C('need') + 0.1, 0.25, 0.6);
  // S8 the wall
  R('impact-stomp', C('protected') + 0.75, 0.4, 1);
  // S9 years of film
  R('rewind', C('years') - 0.2, 0.2, 2.2); R('typing', C('selling'), 0.12, 1.2);
  // S10 the phones
  for (let i = 0; i < 5; i++) R('msg-pop', C('everyone') + i * 0.12 + 0.1, 0.3, 0.5);
  R('lose-piano', C('all in') + 0.1, 0.3, 1.6);
  // S11 collapse
  R('impact-big', C('collapsed') - 0.05, 0.55, 2.2); R('collapse', C('collapsed') + 0.1, 0.3, 1.8);
  // S12 bankruptcy
  R('wind-winter', C('january') - 0.3, 0.22, C('months') - C('january') + 0.3);
  // S13 the app
  R('riser-short', C('app') - 0.4, 0.3, 1.6); R('notify-positive', C('app'), 0.35, 1);
  R('banknote-counter', C('sold'), 0.3, 1.4); R('win-chimes', C('sold') + 1.15, 0.35, 1.6); R('cinematic-boom', C('sold') + 1.15, 0.4, 2);
  // S14 the drawer
  R('swell-rumble', C('miss') - 0.3, 0.25, 2.5); R('door-creak', C('invented', 0, C('miss')), 0.3, 1.2);
  R('impact-wood', C('drawer') + 0.2, 0.55, 1.2); R('dun-dun-dun', C('drawer') + 0.3, 0.3, 2);
  // S15 the lesson
  R('tension-drone', C('what ends'), 0.2, C('its') - C('what ends'));
  R('reveal-impact', C('its') - 0.1, 0.45, 2); R('swell-heaven', C('saw', 0, C('its')), 0.3, 2.5); R('piano-chord', C('wait') + 0.1, 0.45, 2.5);
}
