/* "The janitor and the banker" — Mode A, true story (Ronald Read; an unnamed Wall Street executive).
 * 16 sets, one per beat, each with its own composition + transition. Props interact physically:
 * coins land in buildings/jars, bills pile at his feet, nothing passes through a character.
 */
window.GX_PACE = 0.8;
const VO = window.DURATION;                       // voice length (from align.py)
window.DURATION = VO + 2.0;
const END = window.DURATION;
const C = (p, o = 0, from = 0) => cue(p, o, from);
const usd = (v) => '$' + Math.round(v).toLocaleString('en-US');
const cam = document.getElementById('cam'); drift(cam, 4);
punches('#stage', 0.035, 0.22);
const FL = 1300;

/* ============ S1 — the town: "In 2014, a janitor in a small Vermont town died, and left his library and his hospital six million dollars." ============ */
const S1 = stageSet(); enter(S1, -1, 'cut');
{
  snow(-1, C('nobody'), { parent: S1 });
  const fl = floor(FL, { parent: S1 }); show(fl, -1, null, 0.01);
  [[110, 1120, 1], [970, 1120, 2]].forEach(([x, y, s]) => show(townHouse(x, y, { parent: S1, seed: s, w: 160, h: 130 }), -1, null, 0.01));
  const lib = library(250, FL, { parent: S1 }); show(lib, -1, null, 0.01);
  const hos = hospital(830, FL, { parent: S1 }); show(hos, -1, null, 0.01);
  const jan = person(540, FL, { size: 0.8, beanie: true, mop: true, parent: S1 }); show(jan, -1, null, 0.01); jan.sweep(-1, C('died'));
  const cap = caption('Ronald Read · janitor', 540, FL, { parent: S1 }); show(cap, -1, null, 0.01);
  const hook = titleCard('The janitor<br>died rich.', { parent: S1, y: 470 }); hook.style.fontSize = '86px'; show(hook, -1, C('few years') - 0.3, 0.01);
  // he passes: rises and fades into light
  const hl = halo(540, FL - 180, { r: 220, parent: S1 }); show(hl, C('died') - 0.1, C('nobody'), 0.3);
  tw(jan, C('died'), 0.9, { opacity: [1, 0], y: [0, -60] }, 'inOut'); fade(cap, C('died'), 1, 0, 0.3);
  // his money flows into the library and the hospital, which light up gold
  const total = stat('Left behind', '$0', 540, 760, { size: 110, parent: S1 });
  pop(total, C('left')); count(total.querySelector('.gx-stat-val'), C('left'), 1.9, 0, 6000000, usd);
  [[lib, 250, C('library')], [hos, 830, C('hospital')]].forEach(([b, bx, t], k) => {
    for (let i = 0; i < 6; i++) {
      const c = goldCoin(540, FL - 200, { size: 54, parent: S1 }); const t0 = t - 0.4 + i * 0.09;
      tw(c, t0, 0.05, { opacity: [0, 1] }); arc(c, t0, 0.55, bx - 540, -40, 160 + i * 12); tw(c, t0 + 0.5, 0.06, { opacity: [1, 0] });
    }
    b.dataset.glowColor = '245,197,66'; b.dataset.glow = ''; tw(b, t + 0.1, 0.4, { glow: [0, 1.3] });
    b.querySelectorAll('.win').forEach((w) => on((tt) => w.setAttribute('fill', tt > t + 0.1 ? '#f5c542' : (w.classList.contains('on') ? '#f5d37a' : '#20232c'))));
    sfx('coin-double', t, 0.35);
  });
}

/* ============ S2 — "Nobody had any idea he had money." ============ */
const S2 = stageSet(); sceneSwap(S1, S2, C('nobody') - 0.1, 'push');
{
  const fl = floor(1360, { parent: S2 }); show(fl, -1, null, 0.01);
  [[230, 0.85], [540, 1.0], [850, 0.85]].forEach(([x, s], i) => {
    const p = person(x, 1360, { size: s, dim: i !== 1, parent: S2 }); show(p, -1, null, 0.01);
    p.pose(C('nobody') + 0.2 + i * 0.1, 'shrug', 0.25);
    const q = icon('question', x, 1360 - 440 * s - 70, { size: 90, parent: S2 }); pop(q, C('idea') + i * 0.12);
  });
  const c = caption('Nobody knew', 540, 1360, { parent: S2 }); show(c, -1, null, 0.01);
  sfx('mention-pop', C('idea'), 0.25);
}

/* ============ S3 — Wall Street: "A few years earlier, a Harvard-educated Wall Street executive, one of the best-paid men in finance, went bankrupt." ============ */
const S3 = stageSet(); sceneSwap(S2, S3, C('few years') - 0.1, 'whip');
{
  [[930, 1100, 230, 5], [770, 1250, 300, 6], [140, 980, 220, 8]].forEach(([x, h, w, sd]) => show(tower(x, FL, { w, h, parent: S3, seed: sd }), -1, null, 0.01));
  const fl = floor(FL, { parent: S3 }); show(fl, -1, null, 0.01);
  const exe = person(430, FL, { size: 0.9, tie: true, parent: S3 }); show(exe, -1, null, 0.01);
  const h2 = titleCard('The banker<br>went broke.', { parent: S3, y: 470 }); h2.style.fontSize = '86px'; h2.classList.add('plate'); tw(h2, C('few years'), 0.3, { opacity: [0, 1] });
  out(h2, C('harvard') + 0.1, 0.2);
  // Harvard: a graduation cap flies off his head
  const capI = icon('cap', 430, FL - 420, { size: 130, parent: S3 }); tw(capI, C('harvard') - 0.1, 0.05, { opacity: [0, 1] });
  arc(capI, C('harvard') - 0.1, 0.8, 0, -120, 260); tw(capI, C('harvard') + 0.6, 0.2, { opacity: [1, 0] }); tw(capI, C('harvard') - 0.1, 0.8, { rotate: [0, 340] });
  const ph = pill('Harvard', 760, 1380, { parent: S3 }); pop(ph, C('harvard'));
  exe.pose(C('harvard'), 'up', 0.2).pose(C('wall') , 'hips', 0.3);
  const cwall = caption('Wall Street executive', 430, FL, { parent: S3 }); pop(cwall, C('wall'));
  out(ph, C('best') - 0.3, 0.2);
  const pay = stat('Pay', '$', 430, 560, { size: 110, parent: S3 }); pop(pay, C('best'));
  count(pay.querySelector('.gx-stat-val'), C('best'), 1.1, 1, 7, (v) => '$'.repeat(Math.round(v)));
  sfx('level-up', C('best'), 0.3);
  // bankrupt
  out(pay, C('went', 0, C('finance')) - 0.1, 0.15);
  stamp('BANKRUPT', 540, 760, C('bankrupt') - 0.05, { parent: S3 });
  shake(cam, C('bankrupt') + 0.15, 0.3, 12);
  exe.pose(C('bankrupt') + 0.1, 'shrug', 0.2); tw(exe, C('bankrupt') + 0.2, 0.4, { opacity: [1, 0.55] });
}

/* ============ S4 — "So how does a man who mopped floors end up richer than a man who ran Wall Street?" ============ */
const S4 = stageSet(); sceneSwap(S3, S4, C('so how') - 0.1, 'zoom');
{
  const b = balance(540, 1330, { parent: S4, left: 'MOP', right: 'WALL ST' }); show(b, -1, null, 0.01);
  b.tilt(-1, 14, 0).tilt(C('richer'), -16, 0.9);
  const h = titleCard('How?', { parent: S4, y: 520 }); h.style.fontSize = '120px'; pop(h, C('how'));
  sfx('foley-creak', C('richer'), 0.4); sfx('click-deep', C('richer') + 0.15, 0.45);
}

/* ============ S5 — "The executive did everything you're supposed to do. Top school. Top job. Top salary." ============ */
const S5 = stageSet(); sceneSwap(S4, S5, C('executive did') - 0.1, 'whip');
{
  const st = stairs(560, 1360, ['TOP SCHOOL', 'TOP JOB', 'TOP SALARY'], { parent: S5, stepW: 260, stepH: 170 }); show(st, -1, null, 0.01);
  const exe = person(0, 0, { size: 0.62, tie: true, parent: S5 }); show(exe, -1, null, 0.01);
  const pts = [{ x: 140, y: 1360 }, st.top(0), st.top(1), st.top(2)];
  const keys = [[-1, 0], [C('school'), 1], [C('job'), 2], [C('salary'), 3]];
  on((t) => {
    let k = 0; for (let i = 0; i < keys.length; i++) if (t >= keys[i][0]) k = i;
    const a = pts[keys[k][1]], nx = keys[k + 1], b = nx ? pts[nx[1]] : a;
    const p = nx ? Math.max(0, Math.min(1, (t - (nx[0] - 0.35)) / 0.35)) : 0;
    exe.style.left = (a.x + (b.x - a.x) * p) + 'px'; exe.style.top = (a.y + (b.y - a.y) * p - Math.sin(Math.PI * p) * 60) + 'px';
  });
  ['school', 'job', 'salary'].forEach((w, i) => { const s = st.top(i); const ck = icon('check', s.x, s.y + 115, { size: 64, parent: S5 }); pop(ck, C(w) + 0.05); sfx('checkbox-check', C(w), 0.3); });
  exe.pose(C('salary') + 0.1, 'up', 0.25);
  const h = titleCard('Did everything<br>right.', { parent: S5, y: 470 }); h.style.fontSize = '66px'; pop(h, C('everything'));
}

/* ============ S6 — "And every time his salary went up, so did his life." ============ */
const S6 = stageSet(); sceneSwap(S5, S6, C('every time') - 0.15, 'push');
{
  const fl = floor(1380, { parent: S6 }); show(fl, -1, null, 0.01);
  const b1 = bar('Salary', 300, 1290, { h: 520, w: 150, parent: S6 }); show(b1, -1, null, 0.01);
  const b2 = bar('Lifestyle', 780, 1290, { h: 520, w: 150, parent: S6 }); show(b2, -1, null, 0.01);
  b1.fill(C('every time'), 1.2, 0.15, 0.9); b2.fill(C('so did') - 0.2, 0.9, 0.15, 0.95);
  const eq = headline('=', 540, 1110, { size: 120, parent: S6 }); pop(eq, C('so did'));
  [['watch', 540, 500], ['car', 540, 690], ['yacht', 540, 880]].forEach(([n, x, y], i) => { const l = luxury(n, x, y, { parent: S6, size: 160 }); pop(l, C('went up') + i * 0.22); sfx('coin-collect', C('went up') + i * 0.22, 0.2); });
}

/* ============ S7+S8 — "He borrowed heavily, and bought a mansion with eleven bathrooms and two elevators. Then the crash hit. The money stopped. The bills didn't." ============ */
const S7 = stageSet(); sceneSwap(S6, S7, C('borrowed') - 0.1, 'whip');
{
  const fl = floor(FL, { parent: S7 }); show(fl, -1, null, 0.01);
  const m = mansion(610, FL, { parent: S7, floors: 4 }); m.build(C('mansion') - 0.2, 1.1);
  const exe = person(170, FL, { size: 0.7, tie: true, parent: S7 }); show(exe, -1, null, 0.01); exe.pose(C('mansion'), 'hips', 0.3);
  const debt = pill('Borrowed heavily', 540, 470, { parent: S7 }); debt.style.background = '#e5484d'; debt.style.borderColor = '#e5484d'; debt.style.color = '#fff'; pop(debt, C('borrowed'));
  out(debt, C('bathrooms') - 0.2, 0.2);
  const ba = stat('Bathrooms', '0', 380, 470, { size: 96, parent: S7 }); pop(ba, C('bathrooms') - 0.15);
  count(ba.querySelector('.gx-stat-val'), C('bathrooms') - 0.15, 0.7, 0, 11);
  const el = stat('Elevators', '0', 720, 470, { size: 96, parent: S7 }); pop(el, C('elevators') - 0.1);
  count(el.querySelector('.gx-stat-val'), C('elevators') - 0.1, 0.4, 0, 2);
  out([ba, el], C('crash') - 0.25, 0.15);
  // the crash: red chart plunges, the house cracks, income goes to zero, bills keep coming
  const flash = document.createElement('div'); flash.style.cssText = 'width:1080px;height:1920px;background:#e5484d';
  const fx = place(flash, 540, 960, { parent: S7, z: 40, glow: false }); tw(fx, C('crash'), 0.04, { opacity: [0, 0.35] }); tw(fx, C('crash') + 0.06, 0.3, { opacity: [0.35, 0] });
  shake(cam, C('crash'), 0.4, 16);
  const ch = crashChart(200, 330, 680, 300, C('crash'), 1.2, { parent: S7 });
  m.crack(C('crash') + 0.3);
  exe.pose(C('crash') + 0.2, 'shrug', 0.2);
  const inc = stat('Income', '$$$$$$', 540, 760, { size: 90, parent: S7 }); pop(inc, C('money stopped') - 0.2);
  on((t) => { inc.querySelector('.gx-stat-val').textContent = t >= C('stopped') ? '$0' : '$$$$$$'; });
  billRain(470, FL, C('bills') - 0.1, C('janitor did') - 0.2, { parent: S7, spread: 170 });
  const cb = caption('The bills didn’t stop', 540, FL, { parent: S7 }); pop(cb, C('bills'));
  sfx('foley-boom', C('crash'), 0.6); sfx('foley-pad-dark', C('crash'), 0.35); sfx('error-soft-thud', C('stopped'), 0.4);
}

/* ============ S9 — "The janitor did something so boring, nobody noticed." ============ */
const S9 = stageSet(); sceneSwap(S7, S9, C('janitor did') - 0.1, 'zoom');
{
  const rm = room(540, 1340, 860, 720, { parent: S9 }); show(rm, -1, null, 0.01);
  const jan = person(540, 1340, { size: 0.85, beanie: true, mop: true, parent: S9 }); show(jan, -1, null, 0.01); jan.sweep(C('janitor did'), C('drove'));
  const c = caption('Boring', 540, 1340, { parent: S9 }); pop(c, C('boring'));
  const h = titleCard('Nobody<br>noticed.', { parent: S9, y: 470 }); h.style.fontSize = '72px'; pop(h, C('nobody', 0, C('boring')));
  sfx('foley-sea-bed', C('janitor did'), 0.12);
}

/* ============ S10 — "He drove a used Toyota." ============ */
const S10 = stageSet(); sceneSwap(S9, S10, C('drove') - 0.1, 'whip');
{
  snow(C('drove') - 0.3, C('held') + 0.4, { parent: S10, n: 60 });
  const fl = floor(FL, { parent: S10 }); show(fl, -1, null, 0.01);
  const car = oldCar(540, FL, { parent: S10 }); car.style.transformOrigin = '50% 100%'; tw(car, -1, 0.01, { scale: [1.9, 1.9] });
  tw(car, C('drove') - 0.1, 0.05, { opacity: [0, 1] }); tw(car, C('drove') - 0.1, 0.9, { x: [-900, 0] }, 'out');
  const head = document.createElement('div'); head.style.cssText = 'width:44px;height:44px;border-radius:50%;background:#fff';
  const hd = place(head, 0, 0, { parent: car.firstElementChild ? car : S10, z: 7, glow: true }); hd.style.left = '178px'; hd.style.top = '74px'; hd.style.opacity = 1; hd.dataset.overlapOk = '';
  const p = pill('Used Toyota', 540, 820, { size: 'md', parent: S10 }); pop(p, C('used'));
  sfx('transition-glide', C('drove') - 0.1, 0.35);
}

/* ============ S11 — close-up: "He held his coat together with safety pins." ============ */
const S11 = stageSet(); sceneSwap(S10, S11, C('held') - 0.1, 'zoom');
{
  const ct = coat(540, 1000, { parent: S11 }); show(ct, -1, null, 0.01);
  [[C('safety') - 0.1, 760], [C('pins'), 930], [C('pins') + 0.3, 1100]].forEach(([t, y], i) => ct.pin(i, t, 560, y));
  const c = titleCard('Safety pins.', { parent: S11, y: 420 }); c.style.fontSize = '64px'; pop(c, C('safety'));
}

/* ============ S12+S13 — "And for decades, he quietly bought small pieces of big companies, and never sold them. Every piece paid him a little. Those payments bought more pieces." ============ */
const S12 = stageSet(); sceneSwap(S11, S12, C('decades') - 0.2, 'whip');
{
  const fl = floor(1400, { parent: S12 }); show(fl, -1, null, 0.01);
  const J = jar(600, 1400, 'NEVER SELL', { parent: S12 }); show(J, -1, null, 0.01);
  const jan = person(180, 1400, { size: 0.62, beanie: true, parent: S12 }); show(jan, -1, null, 0.01);
  const yr = stat('Year', '1950', 600, 470, { size: 100, parent: S12 }); pop(yr, C('decades'));
  count(yr.querySelector('.gx-stat-val'), C('decades'), C('one man') - C('decades') - 0.6, 1950, 2014, (v) => String(Math.round(v)));
  // slow, boring buying: one piece at a time
  let n = 0;
  for (let t = C('quietly'); t < C('every piece') - 0.1; t += 0.32, n++) { J.add(n, t); jan.pose(t - 0.12, 'point', 0.1).pose(t + 0.12, 'idle', 0.12); sfx('tap-light', t + 0.25, 0.25); }
  const ns = pill('Never sold', 600, 640, { parent: S12 }); pop(ns, C('never sold'));
  out(ns, C('every piece') - 0.1, 0.15);
  // dividends: each piece pays a coin, the coins buy more pieces
  const dv = caption('Every piece pays', 600, 1400, { parent: S12 }); pop(dv, C('every piece'));
  for (let i = 0; i < 6; i++) {
    const c = goldCoin(470 + i * 52, 1000, { size: 42, parent: S12 }); const t0 = C('paid', 0, C('every piece')) + i * 0.12;
    tw(c, t0, 0.05, { opacity: [0, 1] }); tw(c, t0, 0.35, { y: [0, -220] }, 'out'); tw(c, t0 + 0.35, 0.35, { y: [-220, -60] }, 'in'); tw(c, t0 + 0.68, 0.06, { opacity: [1, 0] });
    sfx('coin-collect', t0 + 0.05, 0.15);
  }
  // compounding: pieces arrive faster and faster
  let t = C('payments'), dt = 0.18;
  while (n < 54 && t < C('one man') - 0.3) { J.add(n++, t); t += dt; dt = Math.max(0.035, dt * 0.86); }
  const val = stat('Worth', '$0', 600, 640, { size: 96, parent: S12 }); pop(val, C('payments'));
  count(val.querySelector('.gx-stat-val'), C('payments'), C('one man') - C('payments') - 0.2, 0, 8000000, usd);
  J.glow(C('more pieces'));
  sfx('foley-pad-hope', C('payments') - 0.2, 0.35); sfx('level-up', C('more pieces'), 0.3);
}

/* ============ S14 — "One man looked rich, and was broke." ============ */
const S14 = stageSet(); sceneSwap(S12, S14, C('one man') - 0.1, 'whip', -1);
{
  const fl = floor(FL, { parent: S14 }); show(fl, -1, null, 0.01);
  const m = mansion(640, FL, { parent: S14, floors: 4 }); m.build(-1, 0.01); m.topple(C('broke') - 0.15);
  m.style.zIndex = 2;
  const exe = person(200, FL, { size: 0.75, tie: true, parent: S14 }); show(exe, -1, null, 0.01);
  exe.pose(-1, 'hips', 0.01).pose(C('broke'), 'shrug', 0.2);
  const c1 = caption('Looked rich', 200, FL, { parent: S14 }); show(c1, -1, null, 0.01);
  on((t) => { c1.textContent = t >= C('broke') ? 'Was broke' : 'Looked rich'; });
  const h = titleCard('It was a<br>front.', { parent: S14, y: 470 }); h.style.fontSize = '70px'; pop(h, C('broke') + 0.1);
}

/* ============ S15 — "The other looked broke, and was rich the whole time." ============ */
const S15 = stageSet(); sceneSwap(S14, S15, C('the other') - 0.1, 'whip');
{
  const fl = floor(FL, { parent: S15 }); show(fl, -1, null, 0.01);
  const J = jar(760, FL, 'NEVER SELL', { parent: S15 }); for (let i = 0; i < 54; i++) J.add(i, -2);
  J.style.zIndex = 2; tw(J, C('the other') - 0.1, 0.01, { opacity: [0, 0] }); tw(J, C('rich', 0, C('the other')) - 0.2, 0.6, { opacity: [0, 1], y: [80, 0] }, 'out'); J.glow(C('rich', 0, C('the other')));
  const sb = halo(760, 1000, { r: 320, parent: S15 }); sb.dataset.glowColor = '245,197,66'; show(sb, C('rich', 0, C('the other')), null, 0.6);
  const jan = person(330, FL, { size: 0.85, beanie: true, parent: S15 }); show(jan, -1, null, 0.01);
  const c = caption('Looked broke', 330, FL, { parent: S15 }); show(c, -1, null, 0.01);
  on((t) => { c.textContent = t >= C('rich', 0, C('the other')) ? 'Was rich' : 'Looked broke'; });
  jan.pose(C('whole time'), 'up', 0.3);
  sfx('foley-heartbeat', C('the other') - 0.1, 0.45); sfx('success-warm-chime', C('rich', 0, C('the other')), 0.45);
}

/* ============ S16 — "Because wealth isn't what you see. It's what you don't." (callback: he walks into the library he funded) ============ */
const S16 = stageSet(); sceneSwap(S15, S16, C('because') - 0.1, 'push');
{
  const fl = floor(FL, { parent: S16 }); show(fl, -1, null, 0.01);
  snow(C('because') - 0.3, END, { parent: S16, n: 50 });
  const lib = library(700, FL, { parent: S16 }); show(lib, -1, null, 0.01);
  lib.dataset.glowColor = '245,197,66'; lib.dataset.glow = ''; tw(lib, C('because') + 0.3, 1.2, { glow: [0, 1.3] });
  const spot = spotlight(700, -120, { parent: S16 }); show(spot, C('because'), null, 0.5);
  const jan = person(150, FL, { size: 0.6, beanie: true, parent: S16 }); show(jan, -1, null, 0.01);
  // walks up to the library steps (stops before the columns: never through scenery), then fades as he goes in
  jan.style.zIndex = 5; tw(jan, C('because'), END - C('because') - 1.3, { x: [0, 320] }, 'out'); bob(jan, C('because'), END - 1.4, 7, 10);
  tw(jan, END - 1.2, 0.6, { opacity: [1, 0] });
  for (let i = 0; i < 14; i++) {                                        // gold dust rising from the library
    const c = goldCoin(560 + rand(i) * 280, 1180, { size: 18, parent: S16 }); const t0 = C('because') + 0.4 + i * 0.28;
    tw(c, t0, 0.2, { opacity: [0, 0.9] }); tw(c, t0, 2.4, { y: [0, -380 - rand(i * 3) * 200], x: [0, (rand(i * 5) - 0.5) * 120] }, 'out'); tw(c, t0 + 1.8, 0.6, { opacity: [0.9, 0] });
  }
  tw(S16, C('because') + 0.4, END - C('because'), { scale: [1, 1.07] }, 'linear');
  const t1 = titleCard('Wealth is what<br>you don\u2019t see.', { parent: S16, y: 640 }); t1.style.fontSize = '78px';
  tw(t1, C('wealth') - 0.1, 0.5, { opacity: [0, 1], scale: [0.94, 1] }, 'out');
  sfx('loading-complete-chord', C('dont'), 0.45); sfx('foley-pad-hope', C('because') - 0.2, 0.3);
}
