/* "Two friends, same job at 18" — story-driven glow explainer.
 * Retention structure borrowed from the smart-kid reference:
 *   paradox hook → flash-forward → "same money" mystery → micro-moments → "looked like he was winning"
 *   → "here's what nobody saw" → the hidden rule → time-skip payoff → callback twist.
 * Cues avoid numbers (the aligner writes them as digits).
 */
const cam = document.getElementById('cam');
drift(cam, 5);
const FL = 1420, MX = 330, JX = 750, END = window.DURATION;
const C = (p, o = 0, from = 0) => cue(p, o, from);
const usd = (v) => '$' + Math.round(v).toLocaleString('en-US');

bokeh(9, { parent: cam, seed: 4 });
const fl = floor(FL, { parent: cam }); show(fl, 0, END - 0.6, 0.5);

/* ---------- cast ---------- */
const marcus = figure(MX, FL, { parent: cam });
const jake = figure(JX, FL, { parent: cam });
const jakeUp = figure(JX, FL, { arm: 'up', parent: cam });
const mTag = tag('Marcus', MX, FL + 24, { parent: cam });
const jTag = tag('Jake', JX, FL + 24, { parent: cam });
const jHalo = halo(JX, FL - 160, { r: 260, parent: cam });
const mRing = ring(MX, FL, { parent: cam }), jRing = ring(JX, FL, { parent: cam });

/* 1 — "Two best friends got the same job at eighteen." */
{
  walkIn(marcus, 0.05, 1.0, -520); walkIn(jake, 0.15, 1.0, 520);
  pop(mTag, 0.9); pop(jTag, 1.0); show(mRing, 0.9); show(jRing, 1.0);
  const job = pill('Same job', 540, 470, { parent: cam }); pop(job, C('same job'));
  const age = stat('Age', '0', 540, 640, { size: 150, parent: cam });
  pop(age, C('job') + 0.1); count(age.querySelector('.gx-stat-val'), C('job') + 0.1, 0.7, 0, 18);
  out([job, age], C('years later') - 0.45, 0.2);
}

/* 2 — "Twenty years later, only one of them is rich," (flash-forward) */
{
  const s = C('years later') - 0.3, e = C('crazy') - 0.2;
  tw(cam, s, 0.25, { blur: [0, 6] }, 'in'); tw(cam, s + 0.25, 0.3, { blur: [6, 0] }, 'out');
  const yl = stat('Years later', '+0', 540, 520, { size: 140, parent: cam });
  pop(yl, s + 0.35); count(yl.querySelector('.gx-stat-val'), s + 0.35, 0.8, 0, 20, (v) => '+' + Math.round(v));
  const spot = spotlight(JX, -120, { parent: cam }); show(spot, C('only one'), e, 0.3);
  const flag = icon('flag', JX + 120, FL - 330, { size: 260, parent: cam });
  tw(flag, C('rich') - 0.1, 0.6, { opacity: [0, 1], y: [80, 0] }, 'back');
  const rich = pill('Rich', JX + 150, FL - 470, { size: 'md', parent: cam }); pop(rich, C('rich'));
  [[-110, -380], [150, -520], [-160, -200]].forEach(([dx, dy], i) => {
    const sp = icon('sparkle', JX + dx, FL + dy, { size: 50, parent: cam }); pop(sp, C('rich') + 0.1 + i * 0.12);
    tw(sp, C('rich') + 0.3, 1.2, { rotate: [0, 90], scale: [1, 0.6] }, 'inOut');
    out(sp, e - 0.3);
  });
  show(jHalo, C('only one'), null, 0.4);
  tw(marcus, C('only one'), 0.4, { opacity: [1, 0.3] }, 'inOut');
  // rewind back to 18
  tw(cam, e, 0.2, { blur: [0, 8] }, 'in'); tw(cam, e + 0.2, 0.3, { blur: [8, 0] }, 'out');
  tw(yl, e, 0.4, { opacity: [1, 0] }); count(yl.querySelector('.gx-stat-val'), e - 0.6, 0.6, 20, 0, (v) => '+' + Math.round(v));
  out([flag, rich], e, 0.2);
  tw(marcus, e + 0.1, 0.3, { opacity: [0.3, 1] });
  tw(jHalo, e, 0.3, { opacity: [1, 0] });
}

/* 3 — "and the crazy part is, they earned almost exactly the same money." */
{
  const s = C('crazy');
  const mp = stat('Paid / hr', '$0', MX, 760, { size: 96, parent: cam });
  const jp = stat('Paid / hr', '$0', JX, 760, { size: 96, parent: cam });
  pop(mp, C('earned')); pop(jp, C('earned') + 0.1);
  count(mp.querySelector('.gx-stat-val'), C('earned'), 0.9, 0, 14, usd);
  count(jp.querySelector('.gx-stat-val'), C('earned') + 0.1, 0.9, 0, 14, usd);
  const eq = headline('=', 540, 770, { size: 120, parent: cam }); pop(eq, C('same money'));
  const sm = pill('Same money', 540, 560, { parent: cam }); pop(sm, C('same money') + 0.1);
  out([mp, jp, eq, sm], C('payday') - 0.3);
}

/* 4 — "On their first payday, Marcus went straight to the mall and bought new shoes." */
{
  const s = C('payday');
  const cal = card(540, 520, 300, 220, { title: 'Payday', body: '<div style="text-align:center;font-size:84px">1</div>', parent: cam });
  pop(cal, s - 0.15);
  [MX, JX].forEach((x, i) => {
    const c = goldCoin(x, 300, { size: 80, parent: cam });
    tw(c, s + 0.2 + i * 0.1, 0.15, { opacity: [0, 1] }); tw(c, s + 0.2 + i * 0.1, 0.55, { y: [0, 760] }, 'in');
    tw(c, s + 0.7 + i * 0.1, 0.1, { opacity: [1, 0] });
  });
  out(cal, C('mall'));
  tw(marcus, C('mall'), 0.6, { x: [0, -60] }, 'inOut'); bob(marcus, C('mall'), C('mall') + 0.6, 10, 11);
  const shoe = icon('shoe', MX - 60, 700, { size: 230, parent: cam }); pop(shoe, C('shoes') - 0.1);
  const sp = icon('sparkle', MX + 40, 600, { size: 60, parent: cam }); pop(sp, C('shoes'));
  const p = pill('New shoes', MX - 60, 540, { parent: cam }); pop(p, C('shoes'));
  const left = stat('Left', '$0', MX - 60, 870, { size: 64, parent: cam }); pop(left, C('shoes') + 0.3);
  window.S4 = [shoe, sp, p, left];
}

/* 5 — "Jake put two hundred dollars into an index fund, and everyone laughed at him." */
{
  const s = C('jake put');
  const r = ring(JX, 640, { w: 300, h: 300, parent: cam }); show(r, s, null, 0.3);
  const fund = icon('fund', JX, 640, { size: 200, parent: cam }); pop(fund, C('index fund') - 0.2);
  const lbl = pill('Index fund', JX, 450, { parent: cam }); pop(lbl, C('index fund'));
  for (let i = 0; i < 4; i++) {
    const c = goldCoin(JX, FL - 260, { size: 56, parent: cam }); const t0 = s + 0.15 + i * 0.22;
    tw(c, t0, 0.1, { opacity: [0, 1] }); arc(c, t0, 0.6, 0, -560, 120); tw(c, t0 + 0.5, 0.1, { opacity: [1, 0] });
  }
  const inv = stat('Invested', '$0', JX, 870, { size: 64, parent: cam }); pop(inv, s + 0.3);
  count(inv.querySelector('.gx-stat-val'), s + 0.3, 0.8, 0, 200, usd);
  // everyone laughs
  const L = C('laughed');
  const f1 = figure(110, FL, { dim: true, size: 0.75, parent: cam }), f2 = figure(980, FL, { dim: true, size: 0.75, parent: cam });
  walkIn(f1, C('everyone') - 0.3, 0.5, -200); walkIn(f2, C('everyone') - 0.3, 0.5, 200);
  const bubbles = [[110, FL - 260], [MX - 60, FL - 330], [980, FL - 260]].map(([x, y], i) => {
    const b = bubble('Ha ha', x, y, { parent: cam }); pop(b, L + i * 0.12); bob(b, L, L + 2.2, 8, 16); return b;
  });
  bob(marcus, L, L + 2.2, 6, 16); bob(f1, L, L + 2.2, 6, 16); bob(f2, L, L + 2.2, 6, 16);
  out([r, fund, lbl, inv, ...bubbles, ...window.S4], C('honestly') + 0.2);
  window.FRIENDS = [f1, f2];
  tw(marcus, C('honestly') + 0.2, 0.5, { x: [-60, 0] }, 'inOut');
}

/* 6 — "And honestly, for years, it looked like Marcus was winning." */
{
  const s = C('looked like');
  const sb = card(540, 600, 640, 300, {
    title: 'Who is winning?',
    body: `<div class="gx-row"><span>MARCUS</span><span class="mk"></span></div><div class="gx-row"><span>JAKE</span><span class="jk"></span></div>`,
    parent: cam,
  });
  pop(sb, s);
  const ck = icon('check', 0, 0, { size: 64, parent: sb.querySelector('.mk') }); ck.style.position = 'relative'; ck.style.left = '0'; ck.style.top = '0'; ck.style.translate = '0 0';
  const xx = icon('cross', 0, 0, { size: 64, parent: sb.querySelector('.jk') }); xx.style.position = 'relative'; xx.style.left = '0'; xx.style.top = '0'; xx.style.translate = '0 0';
  pop(ck, C('winning')); pop(xx, C('winning') + 0.25);
  fade(window.FRIENDS, C('winning') + 0.3, 1, 0);
  out(sb, C('financed') - 0.3);
}

/* 7 — "He financed a car at nineteen, while Jake was still taking the bus." */
{
  const s = C('financed');
  const car = icon('car', MX, FL - 70, { size: 300, parent: cam });
  tw(car, s - 0.1, 0.8, { opacity: [0, 1], x: [-600, 0] }, 'out'); car.style.zIndex = 6;
  const beam = document.createElement('div'); beam.className = 'gx-beam'; beam.style.width = '420px'; beam.style.height = '160px';
  place(beam, MX + 330, FL - 90, { parent: cam, glow: false }); show(beam, s + 0.7, null, 0.3);
  const pay = pill('−$420 / month', MX, FL - 300, { invert: false, parent: cam }); pop(pay, C('car') + 0.2);
  const bus = icon('bus', JX, FL - 95, { size: 320, parent: cam }); bus.style.zIndex = 4;
  tw(bus, C('bus') - 0.6, 1.0, { opacity: [0, 1], x: [700, 0] }, 'out');
  tw(bus, C('bus') + 0.9, 0.8, { x: [0, -900] }, 'in'); tw(bus, C('bus') + 1.4, 0.3, { opacity: [1, 0] });
  window.CAR = [car, beam, pay];
  tw(jake, C('bus') - 0.2, 0.2, { opacity: [1, 0.4] }); tw(jake, C('bus') + 1.2, 0.3, { opacity: [0.4, 1] });
}

/* 8 — "But here's what nobody saw." */
{
  const s = C('nobody saw', -0.6);
  out(window.CAR, s, 0.4); fade([marcus, mTag, mRing], s, 1, 0);
  tw(cam, s, 1.1, { scale: [1, 1.12], x: [0, -150] }, 'inOut');
  const spot = spotlight(JX, -120, { parent: cam }); show(spot, s + 0.2, C('every night') + 0.4, 0.4);
  const p = pill('What nobody saw', JX, 520, { size: 'md', parent: cam }); pop(p, C('nobody saw'));
  out(p, C('every night'));
  show(jHalo, s + 0.3, null, 0.5);
}

/* 9 — "Every night after work, Jake was teaching himself to code." */
{
  const s = C('every night');
  const sky = skyline(FL, { parent: cam, t0: s, seed: 7 }); show(sky, s, C('stranger') - 0.2, 0.6);
  const moon = icon('moon', 900, 360, { size: 140, parent: cam }); pop(moon, s + 0.1);
  const lap = icon('laptop', JX, FL - 120, { size: 200, parent: cam }); pop(lap, C('code') - 0.5); lap.style.zIndex = 7;
  const code = card(JX - 40, 640, 560, 320, { title: 'learn_to_code.js', body: '<div class="gx-code cd"></div>', parent: cam });
  pop(code, C('teaching'));
  type(code.querySelector('.cd'), C('teaching') + 0.2, 1.4, 'let night = 1;\nwhile (true) {\n  learn();');
  const night = stat('Night', '1', JX - 40, 1000, { size: 72, parent: cam }); pop(night, C('code'));
  window.S9 = { sky, moon, lap, code, night };
}

/* 10 — "He was terrible at it for almost a year." */
{
  const s = C('terrible');
  const { code, night } = window.S9;
  const cd = code.querySelector('.cd');
  on((t) => { if (t >= s) cd.textContent = 'ERROR: undefined\nERROR: undefined\nERROR: ...'; });
  const xs = [[-230, -120], [180, -60], [-40, 140]].map(([dx, dy], i) => {
    const x = icon('cross', JX - 40 + dx, 640 + dy, { size: 90, parent: cam }); pop(x, s + i * 0.18); return x;
  });
  count(night.querySelector('.gx-stat-val'), s, 1.8, 1, 340);
  shake(code, s + 0.05, 0.3, 10);
  out([...xs, code, night], C('stranger') - 0.3);
}

/* 11 — "Then one day, a stranger paid him five hundred dollars for a website." */
{
  const s = C('stranger');
  const n = notify('Payment received', '+$500', JX - 60, 640, { parent: cam });
  tw(n, s, 0.5, { opacity: [0, 1], y: [-140, 0] }, 'back'); shake(cam, C('paid') + 0.05, 0.35, 10);
  tw(jake, C('paid'), 0.05, { opacity: [1, 0] }); tw(jakeUp, C('paid'), 0.05, { opacity: [0, 1] });
  tw(jakeUp, C('website') + 0.4, 0.1, { opacity: [1, 0] }); tw(jake, C('website') + 0.4, 0.1, { opacity: [0, 1] });
  for (let i = 0; i < 7; i++) {
    const c = goldCoin(JX, FL - 300, { size: 50, parent: cam }); const t0 = C('paid') + 0.05;
    tw(c, t0, 0.05, { opacity: [0, 1] }); arc(c, t0, 0.9, (i - 3) * 90, 120, 200 + rand(i) * 160); tw(c, t0 + 0.75, 0.15, { opacity: [1, 0] });
  }
  const web = pill('For a website', JX - 60, 500, { parent: cam }); pop(web, C('website'));
  out([n, web, window.S9.lap, window.S9.moon], C('income') - 0.2);
}

/* 12 — "His income doubled, and he did the one thing almost nobody does. He didn't change how he lived." */
{
  const s = C('income');
  tw(cam, s, 1.0, { scale: [1.12, 1], x: [-150, 0] }, 'inOut');
  const inc = stat('Income', '$29,000', JX, 560, { size: 104, parent: cam }); pop(inc, s);
  count(inc.querySelector('.gx-stat-val'), C('doubled'), 1.0, 29000, 58000, usd);
  const x2 = pill('×2', JX + 230, 470, { size: 'md', parent: cam }); pop(x2, C('doubled') + 0.3);
  const one = pill('The one thing nobody does', 540, 400, { parent: cam }); pop(one, C('one thing'));
  out([inc, x2], C('change') - 0.4);
  const same = card(JX - 40, 700, 520, 320, {
    title: "Didn't change",
    body: '<div class="gx-row r1" style="opacity:0"><span>SAME BUS</span><span>✓</span></div><div class="gx-row r2" style="opacity:0"><span>SAME APARTMENT</span><span>✓</span></div><div class="gx-row r3" style="opacity:0"><span>SAME PHONE</span><span>✓</span></div>',
    parent: cam,
  });
  pop(same, C('change') - 0.2);
  ['r1', 'r2', 'r3'].forEach((r, i) => tw(same.querySelector('.' + r), C('lived') - 0.4 + i * 0.3, 0.3, { opacity: [0, 1] }));
  out([one, same, jHalo], C('raises') - 0.3);
}

/* 13 — "Marcus got raises too. But every raise came with a bigger car payment, a nicer apartment, a newer phone." */
{
  const s = C('raises');
  // bring Marcus back, Jake steps aside: split screen
  [marcus, mTag, mRing].forEach((e) => tw(e, s - 0.4, 0.4, { opacity: [0, 1] }));
  const split = document.createElement('div'); split.className = 'gx-split';
  place(split, 540, 1100, { parent: cam, glow: false }); show(split, s, C('whole difference') - 0.1, 0.4);
  const mi = stat('Income', '$29,000', MX, 420, { size: 72, parent: cam }); pop(mi, s);
  count(mi.querySelector('.gx-stat-val'), s + 0.2, 2.5, 29000, 61000, usd);
  const items = [['car', 'Bigger car payment', C('car payment')], ['house', 'Nicer apartment', C('apartment')], ['phone', 'Newer phone', C('phone')]];
  const els = [];
  items.forEach(([ic, txt, t], i) => {
    const y = 620 + i * 250;
    const e1 = icon(ic, 120, y, { size: 140, parent: cam }); pop(e1, t - 0.1);
    const e2 = pill(txt, 375, y, { invert: false, parent: cam }); pop(e2, t);
    const c = goldCoin(120, y - 60, { size: 44, parent: cam });
    tw(c, t, 0.1, { opacity: [0, 1] }); tw(c, t, 0.6, { x: [0, -200] }, 'in'); tw(c, t + 0.5, 0.1, { opacity: [1, 0] });
    els.push(e1, e2);
  });
  const lo = stat('Left over', '$0', MX, 1440 + 120, { size: 60, parent: cam }); pop(lo, C('phone') + 0.3);
  out([mi, lo, ...els], C('whole difference') - 0.3);
}

/* 14 — "That's the whole difference. Marcus got paid by his job. Jake kept buying things that paid him, even while he slept." */
{
  const s = C('whole difference');
  const h = headline('<span class="gx-small">The whole difference</span>', 540, 380, { size: 90, parent: cam }); pop(h, s);
  out(h, C('his job') - 0.25);
  const split = document.createElement('div'); split.className = 'gx-split';
  place(split, 540, 1100, { parent: cam, glow: false }); show(split, s + 0.3, C('still needs') - 0.2, 0.4);
  // Marcus: one pipe — job → him
  const job = icon('desk', MX, 620, { size: 200, parent: cam }); pop(job, C('his job') - 0.2);
  const jl = pill('His job', MX, 480, { parent: cam }); pop(jl, C('his job'));
  for (let i = 0; i < 3; i++) {
    const c = goldCoin(MX, 720, { size: 48, parent: cam }); const t0 = C('his job') + 0.2 + i * 0.35;
    tw(c, t0, 0.1, { opacity: [0, 1] }); tw(c, t0, 0.6, { y: [0, 480] }, 'in'); tw(c, t0 + 0.5, 0.1, { opacity: [1, 0] });
  }
  // Jake: three things that pay him, coins keep falling while he sleeps
  const srcs = [['fund', JX - 150, 560], ['house', JX + 150, 560], ['laptop', JX, 800]];
  const pe = [];
  srcs.forEach(([ic, x, y], i) => {
    const t = C('buying') + i * 0.3;
    const r = ring(x, y, { w: 190, h: 190, parent: cam }); show(r, t, null, 0.3);
    const e = icon(ic, x, y, { size: 120, parent: cam }); pop(e, t);
    pe.push(r, e);
    for (let k = 0; k < 6; k++) {
      const c = goldCoin(x, y + 60, { size: 40, parent: cam }); const t0 = t + 0.4 + k * 0.45 + i * 0.1;
      tw(c, t0, 0.1, { opacity: [0, 1] }); tw(c, t0, 0.7, { y: [0, FL - 200 - y], x: [0, JX - x] }, 'in'); tw(c, t0 + 0.6, 0.1, { opacity: [1, 0] });
    }
  });
  const pl = pill('Things that pay him', JX, 400, { parent: cam }); pop(pl, C('paid him', 0, C('buying')));
  const z = bubble('Z z z', JX + 30, FL - 320, { parent: cam }); pop(z, C('slept') - 0.1); bob(z, C('slept'), C('still needs'), 6, 4);
  const mn = icon('moon', 960, 300, { size: 110, parent: cam }); pop(mn, C('slept') - 0.1);
  window.S14 = [job, jl, ...pe, pl, z, mn];
  out(window.S14, C('years later', 0, C('slept')) - 0.3);
}

/* 15 — "Twenty years later, Marcus still needs every paycheck. Jake doesn't need his at all." */
{
  const s = C('years later', 0, C('slept'));
  tw(cam, s - 0.3, 0.25, { blur: [0, 6] }, 'in'); tw(cam, s - 0.05, 0.3, { blur: [6, 0] }, 'out');
  const yl = stat('Years later', '+0', 540, 380, { size: 120, parent: cam }); pop(yl, s - 0.1);
  count(yl.querySelector('.gx-stat-val'), s - 0.1, 0.8, 0, 20, (v) => '+' + Math.round(v));
  const mb = bar('Savings', MX, 1060, { h: 360, parent: cam }); pop(mb, C('still needs')); mb.fill(C('still needs'), 0.6, 0, 0.03);
  const jb = bar('Earns while asleep', JX, 1060, { h: 360, parent: cam }); pop(jb, C('doesnt')); jb.fill(C('doesnt'), 1.2, 0, 0.95);
  const pc = pill('Needs every paycheck', MX, 640, { invert: false, parent: cam }); pop(pc, C('paycheck'));
  const na = pill("Doesn't need it", JX, 640, { parent: cam }); pop(na, C('at all') - 0.2);
  tw(marcus, C('paycheck'), 0.5, { opacity: [1, 0.35] });
  show(jHalo, C('at all') - 0.2, null, 0.4);
  out([yl, mb, jb, pc, na], C('nobody noticed') - 0.3);
}

/* 16 — "And nobody noticed the moment Jake got rich." */
{
  const s = C('nobody noticed');
  fade([marcus, mTag, mRing], s - 0.2, 0.35, 0);
  tw(cam, s, 1.4, { scale: [1, 1.15], x: [0, -160] }, 'inOut');
  const spot = spotlight(JX, -120, { parent: cam }); show(spot, s, C('happened') - 0.1, 0.4);
  const p = pill('Nobody noticed', JX, 560, { size: 'md', parent: cam }); pop(p, C('noticed'));
  const q = icon('question', JX, FL - 360, { size: 110, parent: cam }); pop(q, C('moment'));
  out([p, q], C('happened') - 0.2);
}

/* 17 — "It happened on that very first payday, while everyone was laughing." (callback) */
{
  const s = C('happened');
  tw(cam, s - 0.1, 0.25, { blur: [0, 10] }, 'in'); tw(cam, s + 0.15, 0.35, { blur: [10, 0] }, 'out');
  tw(cam, s, 0.6, { scale: [1.15, 1], x: [-160, 0] }, 'inOut');
  const rw = pill('◀◀ First payday', 540, 400, { invert: false, parent: cam }); pop(rw, s + 0.1);
  // the payday scene again, all in grey except Jake
  [marcus, mTag].forEach((e) => tw(e, s + 0.1, 0.3, { opacity: [0, 0.4] }));
  const f1 = figure(110, FL, { dim: true, size: 0.75, parent: cam }), f2 = figure(980, FL, { dim: true, size: 0.75, parent: cam });
  show(f1, s + 0.2); show(f2, s + 0.2);
  const L = C('laughing') - 0.5;
  const bs = [[110, FL - 260], [MX, FL - 330], [980, FL - 260]].map(([x, y], i) => {
    const b = bubble('Ha ha', x, y, { parent: cam }); pop(b, L + i * 0.1); bob(b, L, END, 8, 16); tw(b, L + 0.4, 0.4, { opacity: [1, 0.45] }); return b;
  });
  const fund = icon('fund', JX, 640, { size: 180, parent: cam }); pop(fund, C('payday', 0, s));
  const c = goldCoin(JX, FL - 260, { size: 60, parent: cam }); tw(c, C('payday', 0, s) + 0.2, 0.1, { opacity: [0, 1] });
  arc(c, C('payday', 0, s) + 0.2, 0.7, 0, -520, 120); tw(c, C('payday', 0, s) + 0.85, 0.1, { opacity: [1, 0] });
  const spot = spotlight(JX, -120, { parent: cam }); show(spot, C('laughing'), null, 0.4);
  const m = pill('The moment he got rich', JX - 120, 470, { size: 'md', parent: cam }); pop(m, C('laughing') + 0.2);
  tw(fund, C('laughing') + 0.2, 0.6, { scale: [1, 1.15] }, 'elastic');
  // fade out at the very end
  const black = document.createElement('div'); black.style.cssText = 'width:1080px;height:1920px;background:#000';
  place(black, 540, 960, { glow: false, z: 60 }); tw(black, END - 0.5, 0.5, { opacity: [0, 1] });
}
