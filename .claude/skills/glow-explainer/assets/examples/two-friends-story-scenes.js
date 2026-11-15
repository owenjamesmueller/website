/* "Two friends, same job at 18" — v3: big posed characters + visual metaphors.
 *   Jake's index fund = a seed he plants while everyone laughs → trees that rain coins.
 *   Marcus's raises = a bucket that leaks through CAR / RENT / PHONE.
 *   Ends on a title card: PLANT IT EARLY.
 * Captions sit UNDER the floor (one idea each); 1–3 things on screen at a time.
 */
window.GX_PACE = 0.72;                                    // fast-paced: all motion ~28% quicker
window.DURATION = (window.DURATION || 60) + 1.9;           // room for the title card
punches('#stage', 0.04, 0.22);
const cam = document.getElementById('cam');
drift(cam, 5);
const FL = 1300, MX = 300, JX = 780, JC = 690, END = window.DURATION, VO = END - 1.9;
const C = (p, o = 0, from = 0) => cue(p, o, from);
const usd = (v) => '$' + Math.round(v).toLocaleString('en-US');
const capSwap = (() => {                                  // one caption slot per character
  const slots = {};
  return (key, text, x, t, tEnd) => {
    if (slots[key]) fade(slots[key], t - 0.15, 1, 0, 0.15);
    const c = caption(text, x, FL, { parent: cam }); tw(c, t, 0.3, { opacity: [0, 1], y: [10, 0] }, 'out');
    if (tEnd) fade(c, tEnd, 1, 0, 0.2);
    slots[key] = c; return c;
  };
})();

bokeh(8, { parent: cam, seed: 4 });
const fl = floor(FL, { parent: cam }); show(fl, -0.5, END - 0.3, 0.3);
const marcus = person(MX, FL, { size: 0.9, parent: cam });
const jake = person(JX, FL, { size: 0.9, parent: cam });
const jHalo = halo(JX, FL - 200, { r: 300, parent: cam });

/* 1 — "Two best friends got the same job at eighteen."
 * RETENTION: frame 0 is the thumbnail — both characters already on stage + a text hook, so the
 * scroll stops before a word is spoken (many viewers start muted). */
{
  walkIn(marcus, -0.3, 0.45, -160); walkIn(jake, -0.3, 0.45, 160);
  marcus.pose(0.6, 'wave', 0.25).pose(1.4, 'idle', 0.25);
  capSwap('m', 'Marcus', MX, -0.2); capSwap('j', 'Jake', JC, -0.2);
  window.HOOK = titleCard('Same job.<br>Same pay.', { parent: cam, y: 470 });
  window.HOOK.style.fontSize = '84px'; tw(window.HOOK, -0.2, 0.2, { opacity: [0, 1] });
  const age = stat('Age', '0', 540, 760, { size: 120, parent: cam });
  pop(age, C('job') + 0.1); count(age.querySelector('.gx-stat-val'), C('job') + 0.1, 0.6, 0, 18);
  out([window.HOOK, age], C('years later') - 0.35, 0.2);
}

/* 2 — "Twenty years later, only one of them is rich,"
 * RETENTION: open loop — show THAT one gets rich, hide WHICH one. The tree glows between them, a
 * question mark over each head, "Guess which one?" invites a comment. Revealed only at the payoff. */
{
  const s = C('years later') - 0.3, e = C('crazy') - 0.2;
  tw(cam, s, 0.25, { blur: [0, 6] }, 'in'); tw(cam, s + 0.25, 0.3, { blur: [6, 0] }, 'out');
  const h2 = titleCard('20 years later:<br>only one is rich.', { parent: cam, y: 470 }); h2.style.fontSize = '72px';
  tw(h2, s + 0.25, 0.25, { opacity: [0, 1], scale: [0.94, 1] }, 'out');
  const tr = tree(540, FL, { size: 1.0, parent: cam }); tr.dataset.overlapOk = ''; tr.style.zIndex = 3;
  tr.grow(C('only one'), 0.6); tr.rain(C('only one') + 0.5, e, 0.22);
  fade(tr, e, 1, 0, 0.25);
  const spot = spotlight(540, -120, { parent: cam }); show(spot, C('only one'), e, 0.3);
  // the spotlight swings between the two friends: which one?
  tw(spot, C('only one') + 0.2, 0.5, { rotate: [0, 9] }, 'inOut'); tw(spot, C('only one') + 0.7, 0.6, { rotate: [9, -9] }, 'inOut');
  const q1 = icon('question', MX, FL - 470, { size: 96, parent: cam }), q2 = icon('question', JX, FL - 470, { size: 96, parent: cam });
  pop(q1, C('only one') + 0.15); pop(q2, C('only one') + 0.25);
  const g = pill('Guess which one?', 540, 640, { invert: false, parent: cam }); pop(g, C('rich'));
  tw(cam, e, 0.2, { blur: [0, 8] }, 'in'); tw(cam, e + 0.2, 0.3, { blur: [8, 0] }, 'out');
  out([h2, q1, q2, g], e, 0.2);
}

/* 3 — "and the crazy part is, they earned almost exactly the same money." */
{
  const mp = stat('Paid / hr', '$0', MX, 700, { size: 92, parent: cam });
  const jp = stat('Paid / hr', '$0', JX, 700, { size: 92, parent: cam });
  pop(mp, C('earned')); pop(jp, C('earned') + 0.1);
  count(mp.querySelector('.gx-stat-val'), C('earned'), 0.9, 0, 14, usd);
  count(jp.querySelector('.gx-stat-val'), C('earned') + 0.1, 0.9, 0, 14, usd);
  const eq = headline('=', 540, 712, { size: 110, parent: cam }); pop(eq, C('same money'));
  const sm = pill('Same money', 540, 520, { parent: cam }); pop(sm, C('same money') + 0.1);
  out([mp, jp, eq, sm], C('payday') - 0.3);
}

/* 4 — "On their first payday, Marcus went straight to the mall and bought new shoes." */
{
  const s = C('payday');
  const cal = card(540, 520, 280, 210, { title: 'Payday', body: '<div style="text-align:center;font-size:80px">1</div>', parent: cam });
  pop(cal, s - 0.15); out(cal, C('mall') - 0.1);
  marcus.pose(s + 0.1, 'hold', 0.3); jake.pose(s + 0.2, 'hold', 0.3);
  [[MX + 120, 0], [JX + 120, 0.1]].forEach(([x, d]) => {
    const c = goldCoin(x, 640, { size: 64, parent: cam });
    tw(c, s + 0.2 + d, 0.1, { opacity: [0, 1] }); tw(c, s + 0.2 + d, 0.45, { y: [0, 370] }, 'in');
    tw(c, s + 0.75 + d, 0.15, { opacity: [1, 0] });
  });
  marcus.pose(C('shoes') - 0.1, 'both', 0.3);
  const shoe = icon('shoe', MX, 700, { size: 200, parent: cam }); pop(shoe, C('shoes') - 0.1);
  const sp = icon('sparkle', MX + 120, 610, { size: 54, parent: cam }); pop(sp, C('shoes'));
  capSwap('m', 'Marcus: spends', MX, C('shoes'));
  marcus.pose(C('jake put') - 0.2, 'idle', 0.3);
  out([shoe, sp], C('jake put') - 0.1);
}

/* 5 — "Jake put two hundred dollars into an index fund, and everyone laughed at him." (plants a seed) */
const SPX = 560;
let SEED;
{
  const s = C('jake put');
  jake.pose(s - 0.05, 'point', 0.3);
  const c = goldCoin(JX - 150, FL - 230, { size: 56, parent: cam });
  tw(c, s + 0.1, 0.1, { opacity: [0, 1] }); arc(c, s + 0.1, 0.7, SPX - (JX - 150), 210, 160); tw(c, s + 0.75, 0.1, { opacity: [1, 0] });
  SEED = sprout(SPX, FL, { parent: cam });
  tw(SEED, s + 0.8, 0.6, { opacity: [0, 1], scale: [0.1, 1] }, 'back');
  const lbl = pill('Index fund · $200', SPX, 800, { parent: cam }); pop(lbl, C('index fund'));
  capSwap('j', 'Jake: plants', JC, C('index fund'));
  jake.pose(C('everyone') - 0.2, 'idle', 0.3);
  // everyone laughs
  const L = C('laughed');
  const f1 = person(110, FL, { size: 0.6, dim: true, parent: cam }); f1.dataset.overlapOk = '';
  walkIn(f1, C('everyone') - 0.3, 0.5, -220);
  marcus.pose(L - 0.1, 'point', 0.25);
  const bs = [[150, FL - 400], [MX + 40, FL - 480]].map(([x, y], i) => {
    const b = bubble('Ha ha', x, y, { parent: cam }); pop(b, L + i * 0.12); bob(b, L, L + 2.2, 8, 16); return b;
  });
  bob(marcus, L, L + 2.2, 6, 16); bob(f1, L, L + 2.2, 5, 16);
  // EMOTION: the underdog moment — light narrows to Jake alone while they laugh
  const lone = spotlight(JX, -120, { width: 360, parent: cam }); show(lone, L + 0.2, C('honestly'), 0.3);
  tw(jHalo, L + 0.2, 0.3, { opacity: [0, 0.7] }); tw(jHalo, C('honestly'), 0.3, { opacity: [0.7, 0] });
  sfx('click-deep', L + 0.25, 0.45); sfx('click-deep', L + 0.55, 0.35);   // heartbeat
  out(lbl, C('laughed') - 0.15, 0.15);
  out(bs, C('honestly') + 0.1); fade(f1, C('honestly') + 0.1, 1, 0);
  marcus.pose(C('honestly') + 0.1, 'idle', 0.3);
}

/* 6 — "And honestly, for years, it looked like Marcus was winning." */
{
  const s = C('looked like');
  const spot = spotlight(MX, -120, { parent: cam }); show(spot, s, C('financed') + 0.6, 0.3);
  const win = pill('Winning?', MX, 760, { size: 'md', parent: cam }); pop(win, C('winning'));
  marcus.pose(C('winning'), 'both', 0.3).pose(C('financed') - 0.1, 'idle', 0.3);
  tw(jake, s, 0.4, { opacity: [1, 0.45] }); tw(SEED, s, 0.4, { opacity: [1, 0.45] });
  out(win, C('financed') - 0.2);
}

/* 7 — "He financed a car at nineteen, while Jake was still taking the bus." */
{
  const s = C('financed');
  const car = icon('car', MX + 30, FL - 90, { size: 300, parent: cam }); car.style.zIndex = 6; car.dataset.overlapOk = '';
  tw(car, s - 0.1, 0.8, { opacity: [0, 1], x: [-600, 0] }, 'out');
  const pay = pill('−$420 / month', MX, 740, { invert: false, parent: cam }); pop(pay, C('car') + 0.2);
  capSwap('m', 'Marcus: financed', MX, C('car'));
  tw(jake, C('bus') - 0.5, 0.3, { opacity: [0.45, 1] });
  const bus = icon('bus', JX, FL - 110, { size: 320, parent: cam }); bus.style.zIndex = 4; bus.dataset.overlapOk = '';
  tw(bus, C('bus') - 0.6, 1.0, { opacity: [0, 1], x: [700, 0] }, 'out');
  tw(bus, C('bus') + 0.9, 0.8, { x: [0, -1100] }, 'in'); tw(bus, C('bus') + 1.4, 0.3, { opacity: [1, 0] });
  capSwap('j', 'Jake: the bus', JC, C('bus'));
  out([car, pay], C('nobody saw') - 0.7, 0.4);
}

/* 8 — "But here's what nobody saw." */
{
  const s = C('nobody saw', -0.6);
  fade([marcus], s, 1, 0); capSwap('m', '', MX, s); fade(SEED, s, 0.45, 0);
  tw(cam, s, 1.1, { scale: [1, 1.1] }, 'inOut');
  const spot = spotlight(JX, -120, { parent: cam }); show(spot, s + 0.2, C('every night') + 0.3, 0.4);
  const p = pill('What nobody saw', 540, 560, { size: 'md', parent: cam }); pop(p, C('nobody saw'));
  out(p, C('every night'));
  show(jHalo, s + 0.3, C('stranger') + 1.5, 0.5);
}

/* 9 — "Every night after work, Jake was teaching himself to code." (a room, a lamp, a desk) */
const DX = 680; // desk position; Jake walks to the left of it
let DESK, ROOM;
{
  const s = C('every night');
  tw(cam, s, 0.9, { scale: [1.1, 1] }, 'inOut');
  ROOM = room(540, FL, 940, 760, { parent: cam }); ROOM.dataset.overlapOk = ''; show(ROOM, s, C('income') - 0.2, 0.5);
  const moon = icon('moon', 860, 690, { size: 110, parent: cam }); moon.dataset.overlapOk = ''; pop(moon, s + 0.2);
  tw(jake, s, 0.8, { x: [0, 360 - JX] }, 'inOut'); bob(jake, s, s + 0.7, 10, 11);
  DESK = desk(DX, FL, { parent: cam }); DESK.dataset.overlapOk = ''; pop(DESK, s + 0.4);
  jake.pose(C('teaching'), 'type', 0.35);
  capSwap('j', 'Jake: learns', 360, C('teaching'));
  // "+1" lines of code floating up from the monitor
  for (let i = 0; i < 4; i++) {
    const t0 = C('code') - 0.3 + i * 0.45;
    const pl = headline('+1', DX + 40, 920, { size: 40, parent: cam }); pl.dataset.overlapOk = '';
    tw(pl, t0, 0.15, { opacity: [0, 1] }); tw(pl, t0, 0.9, { y: [0, -120] }, 'out'); tw(pl, t0 + 0.7, 0.2, { opacity: [1, 0] });
  }
  window.MOON = moon;
}

/* 10 — "He was terrible at it for almost a year." */
{
  const s = C('terrible');
  const err = bubble('Error', DX + 40, 930, { parent: cam }); pop(err, s); shake(err, s + 0.3, 0.3, 10);
  const night = stat('Night', '1', 540, 470, { size: 96, parent: cam }); pop(night, s);
  count(night.querySelector('.gx-stat-val'), s, 1.8, 1, 340);
  jake.pose(C('year') - 0.4, 'shrug', 0.3);
  capSwap('j', 'Jake: struggles', 360, s + 0.2);
  out([err, night], C('stranger') - 0.3);
}

/* 11 — "Then one day, a stranger paid him five hundred dollars for a website." */
{
  const s = C('stranger');
  const n = notify('Payment received', '+$500', 540, 560, { parent: cam });
  tw(n, s, 0.5, { opacity: [0, 1], y: [-140, 0] }, 'back'); shake(cam, C('paid') + 0.05, 0.35, 10);
  jake.pose(C('paid'), 'both', 0.25);
  for (let i = 0; i < 7; i++) {
    const c = goldCoin(360, FL - 380, { size: 46, parent: cam }); const t0 = C('paid') + 0.05;
    tw(c, t0, 0.05, { opacity: [0, 1] }); arc(c, t0, 0.9, (i - 3) * 80, 260, 160 + rand(i) * 140); tw(c, t0 + 0.75, 0.15, { opacity: [1, 0] });
  }
  capSwap('j', 'Jake: paid', 360, C('paid'));
  out([n, DESK, window.MOON], C('income') - 0.2);
  jake.pose(C('income') - 0.2, 'idle', 0.3);
}

/* 12 — "His income doubled, and he did the one thing almost nobody does. He didn't change how he lived." */
{
  const s = C('income');
  const inc = stat('Income', '$29,000', 540, 520, { size: 104, parent: cam }); pop(inc, s);
  count(inc.querySelector('.gx-stat-val'), C('doubled'), 1.0, 29000, 58000, usd);
  const x2 = pill('×2', 540, 660, { size: 'md', parent: cam }); pop(x2, C('doubled') + 0.3);
  out([inc, x2], C('one thing') - 0.2);
  const one = pill('The one thing nobody does', 540, 520, { parent: cam }); pop(one, C('one thing'));
  const same = card(640, 740, 580, 270, {
    title: "Didn't change",
    body: '<div style="font-size:32px"><div class="gx-row r1" style="opacity:0"><span>SAME BUS ✓</span></div><div class="gx-row r2" style="opacity:0"><span>SAME APARTMENT ✓</span></div><div class="gx-row r3" style="opacity:0"><span>SAME PHONE ✓</span></div></div>',
    parent: cam,
  });
  pop(same, C('change') - 0.2);
  ['r1', 'r2', 'r3'].forEach((r, i) => tw(same.querySelector('.' + r), C('lived') - 0.4 + i * 0.3, 0.3, { opacity: [0, 1] }));
  capSwap('j', 'Jake: same life', 360, C('lived'));
  out([one, same], C('raises') - 0.3);
  tw(jake, C('raises') - 0.4, 0.4, { opacity: [1, 0] });
  capSwap('j', '', 360, C('raises') - 0.3);
}

/* 13 — "Marcus got raises too. But every raise came with a bigger car payment, a nicer apartment, a newer phone." */
let BUCKET, MB;
{
  const s = C('raises');
  MB = person(540, FL, { size: 0.9, parent: cam }); fade(MB, s - 0.4, 0, 1);
  MB.pose(s - 0.2, 'carry', 0.4);
  capSwap('m', 'Marcus: raises', 540, s);
  BUCKET = bucket(540, 1170, { size: 0.68, parent: cam }); BUCKET.style.zIndex = 7; BUCKET.dataset.overlapOk = ''; pop(BUCKET, s);
  BUCKET.fill(s + 0.2, C('whole difference') - 0.3, 0.28);
  const items = [['Car', 380, C('car payment')], ['Rent', 540, C('apartment')], ['Phone', 700, C('phone')]];
  items.forEach(([txt, x, t], i) => {
    const p = pill(txt, x, 1435, { invert: false, parent: cam }); pop(p, t);
    out(p, C('whole difference') - 0.3);
  });
  BUCKET.leak(C('car payment'), C('whole difference') - 0.3, 0.16);
  const lo = stat('Left over', '$0', 540, 470, { size: 80, parent: cam }); pop(lo, C('phone') + 0.3);
  out(lo, C('whole difference') - 0.3);
}

/* 14 — "That's the whole difference. Marcus got paid by his job. Jake kept buying things that paid him, even while he slept." */
{
  const s = C('whole difference');
  const h = titleCard('The whole<br>difference', { parent: cam, y: 600 }); h.style.fontSize = '72px'; pop(h, s);
  out(h, C('his job') - 0.25);
  // Marcus (with his leaking bucket) moves left, Jake comes back on the right
  tw(MB, s, 0.7, { x: [0, MX - 540], scale: [1, 0.85] }, 'inOut'); tw(BUCKET, s, 0.7, { x: [0, MX - 540], scale: [1, 0.85] }, 'inOut');
  BUCKET.leak(C('his job'), C('years later', 0, C('slept')) - 0.3, 0.3);
  capSwap('m', 'Paid by his job', MX, C('his job'));
  tw(jake, C('buying') - 0.5, 0.01, { x: [360 - JX, 0] }); fade(jake, C('buying') - 0.5, 0, 1, 0.4);
  const trees = [[560, 0.95], [975, 0.75]].map(([x, sz], i) => {
    const t = tree(x, FL, { size: sz, parent: cam }); t.dataset.overlapOk = ''; t.style.zIndex = 3;
    t.grow(C('buying') + i * 0.35, 0.9); t.rain(C('buying') + 0.9 + i * 0.2, C('years later', 0, C('slept')) - 0.3, 0.5);
    return t;
  });
  capSwap('j', 'Owns what pays him', JC, C('paid him', 0, C('buying')));
  const z = bubble('Z z z', JX, FL - 430, { parent: cam }); pop(z, C('slept') - 0.1); bob(z, C('slept'), C('still needs'), 6, 4);
  const mn = icon('moon', 540, 420, { size: 110, parent: cam }); pop(mn, C('slept') - 0.1);
  out([z, mn], C('years later', 0, C('slept')) - 0.3);
  window.TREES = trees;
}

/* 15 — "Twenty years later, Marcus still needs every paycheck. Jake doesn't need his at all." */
{
  const s = C('years later', 0, C('slept'));
  tw(cam, s - 0.3, 0.25, { blur: [0, 6] }, 'in'); tw(cam, s - 0.05, 0.3, { blur: [6, 0] }, 'out');
  const yl = stat('Years later', '+0', 540, 420, { size: 110, parent: cam }); pop(yl, s - 0.1);
  count(yl.querySelector('.gx-stat-val'), s - 0.1, 0.8, 0, 20, (v) => '+' + Math.round(v));
  const big = tree(560, FL, { size: 1.25, parent: cam }); big.dataset.overlapOk = ''; big.style.zIndex = 3;
  window.TREES.forEach((t) => fade(t, s - 0.2, 1, 0, 0.3));
  big.grow(s, 0.8); big.rain(s + 0.6, C('nobody noticed') - 0.3, 0.18);
  MB.pose(C('still needs'), 'shrug', 0.3); tw(MB, C('paycheck'), 0.5, { opacity: [1, 0.4] });
  capSwap('m', 'Needs paychecks', MX, C('paycheck'));
  jake.pose(C('at all') - 0.3, 'both', 0.3);
  // EMOTION: vindication — a hard punch-in on the payoff line
  tw('#stage', C('at all') - 0.3, 0.5, { scale: [1.08, 1] }, 'out');
  capSwap('j', "Doesn't need it", JC, C('at all') - 0.2);
  show(jHalo, C('at all') - 0.2, C('happened'), 0.4);
  out(yl, C('nobody noticed') - 0.3);
  window.BIG = big;
}

/* 16 — "And nobody noticed the moment Jake got rich." */
{
  const s = C('nobody noticed');
  fade([MB, BUCKET, window.BIG], s - 0.2, 1, 0, 0.4); capSwap('m', '', MX, s - 0.2);
  jake.pose(s, 'idle', 0.3);
  const spot = spotlight(JX, -120, { parent: cam }); show(spot, s, C('happened') - 0.1, 0.4);
  const p = pill('Nobody noticed', 540, 560, { size: 'md', parent: cam }); pop(p, C('noticed'));
  out(p, C('happened') - 0.2);
}

/* 17 — "It happened on that very first payday, while everyone was laughing." (callback to the seed) */
{
  const s = C('happened');
  tw(cam, s - 0.1, 0.25, { blur: [0, 10] }, 'in'); tw(cam, s + 0.15, 0.35, { blur: [10, 0] }, 'out');
  const rw = pill('◀◀ First payday', 540, 470, { invert: false, parent: cam }); pop(rw, s + 0.1);
  capSwap('j', '', JC, s);
  const m2 = person(MX, FL, { size: 0.9, dim: true, parent: cam }); fade(m2, s + 0.1, 0, 0.6);
  const f2 = person(110, FL, { size: 0.6, dim: true, parent: cam }); f2.dataset.overlapOk = ''; fade(f2, s + 0.1, 0, 0.6);
  m2.pose(s + 0.1, 'point', 0.01);
  const seed = sprout(SPX, FL, { parent: cam }); pop(seed, C('payday', 0, s));
  const sp = spotlight(SPX, -120, { parent: cam }); show(sp, C('laughing') - 0.3, END - 2.4, 0.4);
  const L = C('laughing') - 0.5;
  [[150, FL - 400], [MX + 40, FL - 480]].forEach(([x, y], i) => {
    const b = bubble('Ha ha', x, y, { parent: cam }); pop(b, L + i * 0.1); bob(b, L, END, 8, 16); tw(b, L + 0.5, 0.4, { opacity: [1, 0.4] });
    fade(b, VO + 0.1, 0.4, 0, 0.4);
  });
  capSwap('j', 'The moment he got rich', 540, C('laughing'));
  fade([jake, m2, f2, seed, rw, fl], VO + 0.1, 1, 0, 0.5);
  capSwap('j', '', 540, VO + 0.1);
  // title card
  const tc = titleCard('Plant it<br>early.', { parent: cam });
  tw(tc, VO + 0.5, 0.6, { opacity: [0, 1], scale: [0.92, 1] }, 'out');
  const black = document.createElement('div'); black.style.cssText = 'width:1080px;height:1920px;background:#000';
  place(black, 540, 960, { glow: false, z: 60 }); tw(black, END - 0.35, 0.35, { opacity: [0, 1] });
}

/* ---------------- sound design ----------------
 * Subtle by default (SFX sit under the voice). Every sound marks a story beat:
 * whooshes = time jumps, coins = money moving, thuds = losses, chimes = wins.
 */
{
  const S = (n, t, v) => sfx(n, t, v);
  // 1 intro
  S('transition-glide', 0.05, 0.35);
  S('pop-bubble', C('same job'), 0.35); S('popover-pop', C('job') + 0.1, 0.3);
  // 2 flash-forward / rewind
  S('whoosh-short', C('years later') - 0.3, 0.45);
  S('modal-open-rise', C('only one'), 0.4);
  for (let i = 0; i < 4; i++) S('coin-collect', C('only one') + 0.8 + i * 0.35, 0.18);
  S('success-subtle-ping', C('rich'), 0.4);
  S('refresh', C('crazy') - 0.35, 0.4);
  // 3 same money
  S('pop-bubble', C('earned'), 0.3); S('pop-bubble', C('earned') + 0.1, 0.3);
  S('click-deep', C('same money'), 0.4);
  // 4 payday + shoes
  S('notification-gentle-bell', C('payday') - 0.1, 0.35);
  S('coin-collect', C('payday') + 0.6, 0.35); S('coin-collect', C('payday') + 0.7, 0.3);
  S('xp-up', C('shoes') - 0.1, 0.35); S('success-subtle-ping', C('shoes'), 0.25);
  // 5 the seed + laughing
  S('coin-collect', C('jake put') + 0.1, 0.35);
  S('modal-open-rise', C('jake put') + 0.8, 0.35);
  S('mention-pop', C('laughed'), 0.35); S('mention-pop', C('laughed') + 0.12, 0.3);
  // 6 winning?
  S('popover-pop', C('winning'), 0.35);
  // 7 car + bus
  S('whoosh-short', C('financed') - 0.1, 0.4); S('invalid-thunk', C('car') + 0.2, 0.35);
  S('transition-glide', C('bus') - 0.6, 0.35); S('whoosh-short', C('bus') + 0.9, 0.3);
  // 8 what nobody saw
  S('click-deep', C('nobody saw'), 0.55); S('transition-smooth-whoosh', C('nobody saw', -0.6), 0.3);
  // 9 night room + typing
  S('modal-open-rise', C('every night'), 0.3);
  for (let t = C('teaching') + 0.2; t < C('terrible') - 0.2; t += 0.11) S('type-key', t, 0.32);
  for (let i = 0; i < 4; i++) S('tap-light', C('code') - 0.3 + i * 0.45, 0.25);
  // 10 errors
  S('error-soft-thud', C('terrible'), 0.45); S('error-soft-thud', C('terrible') + 0.9, 0.3);
  // 11 first payment
  S('notification-ding', C('stranger'), 0.5); S('click-deep', C('paid') + 0.05, 0.5);
  S('coin-double', C('paid') + 0.1, 0.45); S('success-celebrate', C('website'), 0.35);
  // 12 income doubled + didn't change
  S('level-up', C('doubled'), 0.4);
  S('popover-pop', C('one thing'), 0.3);
  [0, 0.3, 0.6].forEach((d) => S('checkbox-check', C('lived') - 0.4 + d, 0.35));
  // 13 the leaking bucket
  for (let i = 0; i < 6; i++) S('coin-collect', C('raises') + 0.3 + i * 0.45, 0.16);
  S('invalid-thunk', C('car payment'), 0.4); S('invalid-thunk', C('apartment'), 0.4); S('invalid-thunk', C('phone'), 0.4);
  S('error-soft-thud', C('phone') + 0.3, 0.4);
  // 14 the whole difference
  S('transition-smooth-whoosh', C('whole difference'), 0.4);
  S('modal-open-rise', C('buying'), 0.35); S('modal-open-rise', C('buying') + 0.35, 0.3);
  for (let i = 0; i < 5; i++) S('coin-collect', C('buying') + 1.0 + i * 0.5, 0.14);
  S('hover-soft', C('slept'), 0.3);
  // 15 twenty years later
  S('whoosh-short', C('years later', 0, C('slept')) - 0.3, 0.45);
  for (let i = 0; i < 6; i++) S('coin-collect', C('years later', 0, C('slept')) + 0.7 + i * 0.3, 0.14);
  S('error-soft-thud', C('paycheck'), 0.3); S('success-celebrate', C('at all') - 0.3, 0.4);
  // 16 nobody noticed
  S('click-deep', C('nobody noticed'), 0.5);
  // 17 rewind to the seed, title card
  S('refresh', C('happened') - 0.15, 0.45); S('whoosh-short', C('happened'), 0.3);
  S('mention-pop', C('laughing') - 0.5, 0.3); S('mention-pop', C('laughing') - 0.4, 0.25);
  S('success-warm-chime', C('laughing') + 0.2, 0.4);
  S('loading-complete-chord', VO + 0.5, 0.45);
}
