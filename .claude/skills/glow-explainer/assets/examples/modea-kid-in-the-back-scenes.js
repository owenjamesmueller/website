/* "The kid in the back" — Mode A story (a parable). 24 sets in real places: classroom, bedroom at night, laptop close-ups,
 * bakery, a street of shops, an office. Open loops: the flash-forward hook (she asks HIM for a job), "what he did at night",
 * the application on his desk. Callbacks: the raised hand, the laughter, the back row.
 */
window.GX_PACE = 0.8;
const VO = window.DURATION;
window.DURATION = VO + 2.0;
const END = window.DURATION;
const C = (p, o = 0, from = 0) => cue(p, o, from);
const cam = document.getElementById('cam'); drift(cam, 4);
punches('#stage', 0.035, 0.22);
const FL = 1300, GOLD = '#f5c542';
const S0 = (el) => show(el, -1, null, 0.01);
const LEO = { hood: true, accent: GOLD };                       // the hero always wears the gold stripe
const TEACH = { bun: true, glasses: true };
// a seated person behind a school desk (the desk hides the legs)
function seat(x, fl, s, opts, parent) {
  const ds = s * 1.5; const d = schoolDesk(x, fl, { parent, size: ds }); S0(d);
  const p = person(x, fl - 115 * s, { size: s, parent, ...opts }); S0(p); return p;
}
function paperSheet(x, y, parent, rot = -8) {
  const d = document.createElement('div'); d.className = 'gx-svg gx-sheet';
  d.innerHTML = `<svg width="150" height="190" viewBox="0 0 150 190"><g transform="rotate(${rot} 75 95)"><rect x="5" y="5" width="140" height="180" rx="6" fill="#f2f2f2"/><path d="M22 34 H110 M22 64 H128 M22 88 H120 M22 112 H128 M22 136 H90" stroke="#999" stroke-width="7" stroke-linecap="round"/></g></svg>`;
  const el = place(d, x, y, { parent, z: 9, glow: false }); el.dataset.overlapOk = ''; return el;
}

/* ============ S1 — hook: "His teacher told the whole class he would never amount to anything." ============ */
const S1 = stageSet(); enter(S1, -1, 'cut');
{
  const room = classroom({ parent: S1, board: 'MATH 101' }); S0(room);
  room.write('LEO = NOTHING', C('never') - 0.1, 0.7, { color: '#ff8f92' });
  S0(floor(FL, { parent: S1 }));
  const t = person(175, FL, { size: 0.95, parent: S1, ...TEACH }); S0(t);
  t.pose(-1, 'point', 0.01).pose(C('whole'), 'cross', 0.3).pose(C('never'), 'point', 0.2);
  const kids = [seat(440, FL, 0.5, {}, S1), seat(660, FL, 0.5, {}, S1)];
  const leo = seat(890, 1150, 0.44, LEO, S1);
  const sp = spotlight(890, 560, { width: 300, height: 620, parent: S1 }); S0(sp);
  leo.head(C('never'), 'down', 0.4);
  kids.forEach((k, i) => { k.pose(C('anything') - 0.2, 'laugh', 0.2); bob(k, C('anything') - 0.2, C('years'), 7, 15 + i); });
  const hook = titleCard('She said he’d<br>be _nothing._', { parent: S1, y: 430, kicker: 'Leo · 16', size: 84 }); S0(hook);
}

/* ============ S2 — flash-forward: "Twelve years later, she was the one asking him for a job." ============ */
const S2 = stageSet(); sceneSwap(S1, S2, C('years') - 0.45, 'zoom');
{
  S0(officeWindow({ parent: S2 })); S0(floor(FL, { parent: S2 }));
  const leo = person(760, FL, { size: 1.0, tie: true, accent: GOLD, parent: S2 }); S0(leo); leo.pose(-1, 'cross', 0.01);
  const t = person(320, FL, { size: 0.82, parent: S2, ...TEACH }); S0(t); t.pose(-1, 'idle', 0.01).pose(C('asking'), 'give', 0.35).head(C('asking'), 'down', 0.4);
  const ps = paperSheet(485, FL - 250, S2); pop(ps, C('asking') + 0.2);
  const h = titleCard('She asked _him_<br>for a *job.*', { parent: S2, y: 430, kicker: '12 years later', size: 84 }); pop(h, C('asking'));
  tw(S2, C('job'), 0.6, { scale: [1, 1.06] }, 'out');
}

/* ============ S3 — "Leo failed math three times." ============ */
const S3 = stageSet(); sceneSwap(S2, S3, C('failed') - 0.5, 'zoom', -1);
{
  const p = pill('Leo · 16', 540, 1330, { size: 'md', parent: S3 }); S0(p);
  [[C('failed'), 310, -10], [C('math'), 540, 4], [C('times'), 770, 12]].forEach(([t0, x, r], i) => {
    const tp = testPaper(x, 1010 - i * 10, { parent: S3, rot: r }); tp.dataset.overlapOk = '';
    tw(tp, t0 - 0.05, 0.01, { opacity: [0, 1] }); tw(tp, t0 - 0.05, 0.2, { scale: [1.8, 1], y: [-120, 0] }, 'in');
    shake(cam, t0 + 0.15, 0.2, 8);
  });
  const h = titleCard('Failed math<br>_three times._', { parent: S3, y: 450, size: 88 }); pop(h, C('failed'));
}

/* ============ S4 — "He sat in the back, and every time he got called on, the whole room laughed." ============ */
const S4 = stageSet(); sceneSwap(S3, S4, C('sat') - 0.4, 'whip');
{
  const room = classroom({ parent: S4, board: 'x² + 4x = ?' }); S0(room);
  S0(floor(1380, { parent: S4 }));
  const sp = spotlight(540, 560, { width: 300, height: 600, parent: S4 }); S0(sp);
  const leo = seat(540, 1080, 0.44, LEO, S4);
  const mid = [seat(330, 1220, 0.52, {}, S4), seat(750, 1220, 0.52, {}, S4)];
  const front = [seat(170, 1380, 0.6, {}, S4), seat(910, 1380, 0.6, {}, S4)];
  leo.pose(C('called') - 0.3, 'raise', 0.25);
  const q = bubble('Leo?', 760, 790, { parent: S4 }); show(q, C('called'), C('laughed') - 0.1, 0.15);
  [...mid, ...front].forEach((k, i) => { k.pose(C('laughed') - 0.1 + i * 0.04, 'laugh', 0.2); bob(k, C('laughed') - 0.1, C('so he'), 8, 14 + i); });
  [[330, 905], [750, 905]].forEach(([x, y], i) => { const b = bubble('HA HA', x, y, { parent: S4, fill: true }); b.style.fontSize = '40px'; pop(b, C('laughed') + i * 0.12); });
  leo.pose(C('laughed') + 0.1, 'idle', 0.4).head(C('laughed') + 0.1, 'down', 0.4);
  const h = titleCard('The whole room<br>_laughed._', { parent: S4, y: 430, size: 80 }); pop(h, C('room'));
}

/* ============ S5 — close-up: "So he stopped raising his hand." ============ */
const S5 = stageSet(); sceneSwap(S4, S5, C('so he') - 0.1, 'zoom');
{
  S0(floor(1430, { parent: S5 }));
  const h0 = halo(540, 1060, { r: 340, parent: S5 }); S0(h0); tw(h0, C('stopped'), 1.0, { opacity: [1, 0.2] });
  const leo = seat(540, 1430, 1.05, LEO, S5);
  leo.pose(-1, 'raise', 0.01).pose(C('raising') - 0.1, 'idle', 0.9).head(C('hand') - 0.1, 'down', 0.6);
  const h = titleCard('So he went _quiet._', { parent: S5, y: 440, size: 84 }); pop(h, C('stopped'));
}

/* ============ S6 — open loop: "But nobody knew what he did when he got home." ============ */
const S6 = stageSet(); sceneSwap(S5, S6, C('nobody') - 0.45, 'push');
{
  S0(nightSky({ parent: S6, moonX: 900, moonY: 640 }));
  S0(floor(FL, { parent: S6 }));
  const hs = nightHouse(540, FL, { parent: S6, size: 1.2 }); S0(hs); hs.lamp(C('home') - 0.1);
  S6.style.transformOrigin = '696px 1066px'; tw(S6, C('home'), 1.2, { scale: [1, 1.5] }, 'in');
  const h = titleCard('Nobody knew what<br>he did *at night.*', { parent: S6, y: 430, size: 70 }); pop(h, C('nobody'));
  out(h, C('home') + 0.1, 0.3);
}

/* ============ S7 — split screen: "Every night, while his friends were gaming, Leo sat at a cracked laptop," ============ */
const S7 = stageSet(); sceneSwap(S6, S7, C('night') - 0.5, 'zoom');
{
  // top: friends gaming
  S0(floor(930, { parent: S7 }));
  const tv = tvGlow(800, 930, { parent: S7 }); S0(tv);
  [[190, 0.5], [420, 0.5]].forEach(([x, s], i) => { const f = person(x, 930, { size: s, dim: true, parent: S7 }); S0(f); f.pose(-1, 'type', 0.01); bob(f, C('gaming') - 0.3, C('cracked') + 1, 5, 18 + i * 3); });
  const pf = pill('Friends: gaming', 300, 560, { size: 'md', parent: S7 }); pop(pf, C('friends'));
  // bottom: Leo coding
  const sep = document.createElement('div'); sep.style.cssText = 'width:1080px;height:4px;background:rgba(255,255,255,.35)'; S0(place(sep, 540, 950, { parent: S7, z: 3, glow: false }));
  S0(floor(1480, { parent: S7 }));
  const hl = halo(540, 1130, { r: 220, parent: S7 }); hl.dataset.glowColor = '159,211,255'; show(hl, C('leo', 0, C('gaming')), null, 0.3);
  const leo = person(540, 1440, { size: 0.9, parent: S7, ...LEO }); S0(leo); leo.pose(-1, 'type', 0.01);
  const dk = deskFront(540, 1480, { parent: S7, clock: '2:47 AM' }); S0(dk); dk.glow(C('leo', 0, C('gaming')));
  const pl = pill('Leo: coding', 540, 1000, { size: 'md', parent: S7 }); pop(pl, C('leo', 0, C('gaming')));
}

/* ============ S8 — laptop close-up: "...cracked laptop, teaching himself to code." ============ */
const S8 = stageSet(); sceneSwap(S7, S8, C('cracked') - 0.25, 'zoom');
{
  const sc = codeScreen(540, 1000, { parent: S8 }); S0(sc); sc.crack(C('cracked'));
  sc.code(C('teaching') - 0.1, C('one video') - 0.1, 0.09);
  const h = titleCard('Teaching himself<br>to *code.*', { parent: S8, y: 430, size: 80 }); pop(h, C('teaching'));
}

/* ============ S9 — "One video at a time. One error at a time." ============ */
const S9 = stageSet(); sceneSwap(S8, S9, C('one video') - 0.1, 'push');
{
  const sc = codeScreen(540, 1060, { parent: S9, w: 820, h: 560, file: 'lesson_1.mp4' }); S0(sc); sc.crack(-1);
  sc.video(C('video') - 0.2, C('error') - 0.1);
  sc.code(C('error') - 0.1, C('first') - 0.3, 0.1, { errs: [1, 3, 4, 6, 8] });
  const n = stat('Nights in a row', '1', 540, 480, { size: 96, parent: S9, tone: 'gold' }); pop(n, C('one video'));
  count(n.querySelector('.gx-stat-val'), C('one video'), C('first') - C('one video') - 0.2, 1, 214);
}

/* ============ S10 — "His first app crashed so badly," ============ */
const S10 = stageSet(); sceneSwap(S9, S10, C('first') - 0.35, 'whip');
{
  const sc = codeScreen(540, 1000, { parent: S10, file: 'my_first_app.js' }); S0(sc); sc.crack(-1);
  sc.code(C('first') - 0.3, C('crashed'), 0.06); sc.crash(C('crashed'));
  shake(cam, C('crashed') + 0.05, 0.4, 16);
  const h = titleCard('His first app', { parent: S10, y: 440, size: 80 }); pop(h, C('first'));
}

/* ============ S11 — "...he cried." ============ */
const S11 = stageSet(); sceneSwap(S10, S11, C('cried') - 0.35, 'cut');
{
  S0(bedroom({ parent: S11 }));
  const leo = person(540, 1420, { size: 1.1, parent: S11, ...LEO }); S0(leo);
  leo.pose(-1, 'cover', 0.01).head(-1, 'down', 0.01); bob(leo, C('cried'), C('quit') - 0.2, 6, 9);
  S0(deskFront(540, 1470, { parent: S11, clock: '3:12 AM' }));
  tears(540, 1090, C('cried') - 0.1, C('quit') - 0.1, { parent: S11 });
}

/* ============ S12 — "He didn't quit." ============ */
const S12 = stageSet(); sceneSwap(S11, S12, C('didnt quit') - 0.1, 'zoom');
{
  S0(bedroom({ parent: S12 }));
  const hl = halo(540, 1080, { r: 300, parent: S12 }); hl.dataset.glowColor = '245,197,66'; show(hl, C('quit'), null, 0.3);
  const leo = person(540, 1420, { size: 1.1, parent: S12, ...LEO }); S0(leo);
  leo.pose(-1, 'cover', 0.01).head(-1, 'down', 0.01).pose(C('didnt') , 'type', 0.3).head(C('didnt'), 0, 0.3);
  const dk = deskFront(540, 1470, { parent: S12, clock: '3:13 AM' }); S0(dk); dk.glow(C('quit'));
  const h = titleCard('He didn’t *quit.*', { parent: S12, y: 440, size: 110 }); pop(h, C('quit'));
}

/* ============ S13 — "At nineteen, he built a tiny app for his mom's bakery." ============ */
const S13 = stageSet(); sceneSwap(S12, S13, C('built') - 0.6, 'whip');
{
  S0(floor(FL, { parent: S13 }));
  const bk = bakery(745, FL, { parent: S13, size: 0.82 }); S0(bk); bk.lights(C('bakery'));
  const mom = person(140, FL, { size: 0.78, parent: S13 }); S0(mom);
  const leo = person(330, FL, { size: 0.82, parent: S13, ...LEO }); S0(leo); leo.pose(C('built'), 'give', 0.3);
  const ph = thing('phone', 440, FL - 268, { parent: S13, scale: 0.6 }); ph.dataset.overlapOk = ''; pop(ph, C('built') + 0.2);
  mom.pose(C('bakery'), 'both', 0.3); bob(mom, C('bakery'), C('bakery') + 0.8, 10, 12);
  const h = titleCard('A tiny app for<br>*Mom’s bakery.*', { parent: S13, y: 430, kicker: 'Leo · 19', size: 74 }); pop(h, C('tiny'));
}

/* ============ S14 — "It took the orders, and saved her four hours a day." ============ */
const S14 = stageSet(); sceneSwap(S13, S14, C('orders') - 0.55, 'push');
{
  S0(floor(FL, { parent: S14 }));
  const ph = bigPhone(320, 960, { parent: S14 }); S0(ph);
  ['Croissants x12', 'Birthday cake', 'Bagels x6', 'Sourdough x2', 'Cupcakes x24'].forEach((o, i) => ph.order(i, o, C('orders') - 0.2 + i * 0.22));
  const mom = person(790, FL, { size: 0.62, parent: S14 }); S0(mom); mom.pose(C('saved'), 'both', 0.3); bob(mom, C('saved'), C('saved') + 1, 9, 12);
  const st = stat('Saved her', '0 hrs', 790, 690, { size: 84, parent: S14, tone: 'gold' }); pop(st, C('saved'));
  count(st.querySelector('.gx-stat-val'), C('saved'), 0.9, 0, 4, (v) => Math.round(v) + ' hrs');
  const pd = pill('every day', 790, 850, { parent: S14 }); pop(pd, C('day') - 0.1);
}

/* ============ S15 — "Then the shop next door wanted one." ============ */
const S15 = stageSet(); sceneSwap(S14, S15, C('next') - 0.6, 'whip');
{
  S0(floor(FL, { parent: S15 }));
  const row = shopRow(FL, 5, { parent: S15, w: 200 }); S0(row); row.light(2, -1); row.light(3, C('door') + 0.1);
  const p1 = thing('phone', 640, 900, { parent: S15, scale: 0.5 }); pop(p1, C('wanted'));
  const h = titleCard('Then the shop<br>*next door.*', { parent: S15, y: 440, size: 84 }); pop(h, C('next'));
}

/* ============ S16 — "Then twenty more." ============ */
const S16 = stageSet(); sceneSwap(S15, S16, C('more') - 0.55, 'push');
{
  const rows = [[860, 0], [1080, 1], [1300, 2]].map(([fl, k]) => { S0(floor(fl, { parent: S16 })); const r = shopRow(fl, 9, { parent: S16, w: 200, scale: 0.53 }); S0(r); return r; });
  const lit = [...Array(27).keys()].sort((a, b) => rand(a * 4.3) - rand(b * 4.3)).slice(0, 21);
  lit.forEach((k, i) => { const t0 = C('more') - 0.4 + i * 0.07; rows[Math.floor(k / 9)].light(k % 9, t0); if (i % 3 === 0) sfx('real/pop', t0, 0.18, 0.3); });
  const st = stat('Shops using his app', '1', 540, 520, { size: 100, parent: S16, tone: 'gold' }); pop(st, C('more') - 0.4);
  count(st.querySelector('.gx-stat-val'), C('more') - 0.4, 1.5, 1, 21);
}

/* ============ S17 — "By twenty-five, his company had fifty employees." ============ */
const S17 = stageSet(); sceneSwap(S16, S17, C('company') - 0.8, 'zoom');
{
  S0(officeWindow({ parent: S17 })); S0(floor(FL, { parent: S17 }));
  const ppl = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 12; c++) { if (ppl.length >= 49) break; const q = person(105 + c * 79, 1000 + r * 80, { size: 0.19, dim: true, parent: S17 }); ppl.push(q); }
  ppl.forEach((q, i) => tw(q, C('employees') - 0.5 + i * 0.022, 0.15, { opacity: [0, 1], y: [20, 0] }, 'out'));
  const leo = person(540, FL, { size: 0.62, tie: true, accent: GOLD, parent: S17 }); S0(leo); leo.pose(C('employees'), 'both', 0.3);
  const st = stat('Employees', '0', 540, 500, { size: 100, parent: S17, tone: 'gold' }); pop(st, C('company'));
  count(st.querySelector('.gx-stat-val'), C('employees') - 0.5, 1.2, 0, 50);
  const p = pill('Leo · 25 · CEO', 540, 1350, { size: 'md', parent: S17 }); pop(p, C('company'));
}

/* ============ S18 — "Then one morning, a job application landed on his desk." ============ */
const S18 = stageSet(); sceneSwap(S17, S18, C('morning') - 0.6, 'whip');
{
  S0(officeWindow({ parent: S18 }));
  const sun = halo(860, 700, { r: 300, parent: S18 }); sun.dataset.glowColor = '245,197,66'; S0(sun);
  const leo = person(540, 1380, { size: 0.95, tie: true, accent: GOLD, parent: S18 }); S0(leo); leo.pose(-1, 'type', 0.01).head(C('desk'), 'down', 0.3);
  const dk = deskFront(540, 1430, { parent: S18, laptop: false }); S0(dk);
  const ps = paperSheet(770, 1185, S18, -6);
  tw(ps, C('application') - 0.3, 0.05, { opacity: [0, 1] }); tw(ps, C('application') - 0.3, 0.8, { y: [-700, 0], rotate: [-40, 0] }, 'in');
  const h = titleCard('Then one morning…', { parent: S18, y: 440, size: 76 }); pop(h, C('morning'));
}

/* ============ S19+S20 — "He knew the name. It was his old math teacher." ============ */
const S19 = stageSet(); sceneSwap(S18, S19, C('knew', 0, C('application')) - 0.4, 'zoom');
{
  const f = appForm(540, 1010, { parent: S19 }); S0(f);
  f.fill(0, 'Margaret Hale', C('knew', 0, C('application')) - 0.2, 0.6);
  f.photo(C('old') - 0.2); f.fill(1, 'Math teacher', C('math', 0, C('old')) - 0.1, 0.5); f.fill(2, 'School cut my position', C('teacher', 0, C('old')), 0.6);
  S19.style.transformOrigin = '540px 700px'; tw(S19, C('knew', 0, C('application')), C('could') - C('knew', 0, C('application')), { scale: [1, 1.12] }, 'linear');
}
/* memory flash — the classroom, the pointing finger (callback to frame 0) */
const SM = stageSet(); sceneSwap(S19, SM, C('teacher', 0, C('old')) + 0.35, 'cut');
{
  const room = classroom({ parent: SM, board: 'LEO = NOTHING' }); S0(room);
  S0(floor(FL, { parent: SM }));
  const t = person(300, FL, { size: 1.0, parent: SM, ...TEACH }); S0(t); t.pose(-1, 'point', 0.01);
  const leo = seat(820, FL, 0.55, LEO, SM); leo.head(-1, 'down', 0.01);
  tw(SM, C('teacher', 0, C('old')) + 0.35, 0.6, { scale: [1.1, 1] }, 'out');
}

/* ============ S21 — "He could have laughed, like they all did." ============ */
const S21 = stageSet(); sceneSwap(SM, S21, C('could') - 0.1, 'cut');
{
  S0(officeWindow({ parent: S21 })); S0(floor(FL, { parent: S21 }));
  const leo = person(760, FL, { size: 1.0, tie: true, accent: GOLD, parent: S21 }); S0(leo); leo.pose(-1, 'cross', 0.01);
  const t = person(310, FL, { size: 0.82, parent: S21, ...TEACH }); S0(t); t.pose(-1, 'give', 0.01).head(-1, 'down', 0.01);
  const ps = paperSheet(475, FL - 250, S21); S0(ps);
  // ghosts of the old laughter
  [[260, 760], [540, 690], [820, 760]].forEach(([x, y], i) => { const b = bubble('HA HA', x, y, { parent: S21, fill: true }); b.style.fontSize = '44px'; b.dataset.overlapOk = ''; tw(b, C('all did', -0.3) + i * 0.12, 0.3, { opacity: [0, 0.3] }); });
  const h = titleCard('He could’ve _laughed._', { parent: S21, y: 440, size: 68 }); pop(h, C('could'));
}

/* ============ S22 — "He hired her instead," ============ */
const S22 = stageSet(); sceneSwap(S21, S22, C('hired') - 0.35, 'push');
{
  S0(officeWindow({ parent: S22 })); S0(floor(FL, { parent: S22 }));
  const leo = person(720, FL, { size: 0.95, tie: true, accent: GOLD, parent: S22 }); S0(leo); leo.pose(-1, 'cross', 0.01).pose(C('hired') + 0.1, 'give', 0.3);
  const t = person(360, FL, { size: 0.82, parent: S22, ...TEACH }); S0(t); t.pose(-1, 'idle', 0.01).head(-1, 'down', 0.01).head(C('instead'), 'up', 0.4).pose(C('instead'), 'give', 0.3);
  stamp('HIRED', 540, 720, C('hired') + 0.05, { parent: S22, color: GOLD, rot: -8 });
}

/* ============ S23 — "to teach the kids who sit in the back." ============ */
const S23 = stageSet(); sceneSwap(S22, S23, C('teach') - 0.3, 'whip');
{
  const room = classroom({ parent: S23 }); S0(room);
  room.write('LESSON 1: CODE', C('teach'), 0.6, { color: '#f5c542' });
  S0(floor(FL, { parent: S23 }));
  const t = person(170, FL, { size: 0.92, parent: S23, ...TEACH }); S0(t); t.pose(-1, 'point', 0.01);
  const ks = [seat(460, FL, 0.5, {}, S23), seat(690, FL, 0.5, LEO, S23), seat(920, FL, 0.5, {}, S23)];
  ks.forEach((k, i) => k.pose(C('back', 0, C('sit')) - 0.3 + i * 0.12, 'raise', 0.25));
  const h = titleCard('The kids *in the back.*', { parent: S23, y: 440, size: 74 }); pop(h, C('kids'));
}

/* ============ S24 — "Because the kid in the back isn't slow. He's just playing a different game." ============ */
const S24 = stageSet(); sceneSwap(S23, S24, C('because') - 0.1, 'zoom');
{
  S0(floor(1460, { parent: S24 }));
  const hl = halo(540, 1100, { r: 340, parent: S24 }); hl.dataset.glowColor = '245,197,66'; S0(hl);
  const kid = person(540, 1420, { size: 0.95, parent: S24, ...LEO }); S0(kid); kid.pose(-1, 'type', 0.01);
  const dk = deskFront(540, 1460, { parent: S24 }); S0(dk); dk.glow(C('because'));
  tw(S24, C('because'), END - C('because'), { scale: [1, 1.07] }, 'linear');
  const t1 = titleCard('The kid in the back<br>isn’t _slow._', { parent: S24, y: 500, size: 74 }); pop(t1, C('slow') - 0.3);
  out(t1, C('playing') - 0.35, 0.2);
  const t2 = titleCard('He’s playing a<br>*different game.*', { parent: S24, y: 500, kicker: 'Remember this', size: 78 });
  tw(t2, C('playing') - 0.1, 0.45, { opacity: [0, 1], scale: [0.94, 1] }, 'out');
}

/* ================= SOUND DESIGN (real recordings) ================= */
{
  const R = (n, t, v, d = 0) => sfx('real/' + n, t, v, d);
  // S1 classroom: murmur bed, the verdict, the laugh
  R('crowd-murmur', 0, 0.22, C('years') - 0.3); R('dun-dun-dun', C('never'), 0.3, 1.8); R('crowd-laugh', C('anything') - 0.15, 0.35, 1.4);
  // S2 flash-forward
  R('whoosh-trailer-hit', C('years') - 0.5, 0.45, 1.6); R('swell-suspense', C('years'), 0.25, 2.5); R('impact-big', C('job') - 0.05, 0.4, 1.5);
  // S3 the tests
  R('rewind', C('failed') - 0.7, 0.3, 0.7);
  [C('failed'), C('math'), C('times')].forEach((t, i) => { R('impact-wood', t + 0.12, 0.45 + i * 0.05, 0.6); R('paper-move', t, 0.3, 0.4); });
  // S4 laughter
  R('crowd-murmur', C('sat') - 0.3, 0.2, 2); R('crowd-laugh', C('laughed') - 0.1, 0.45, 2.2); R('heartbeat', C('laughed') + 0.3, 0.3, 1.5);
  // S5 quiet
  R('heartbeat-hit', C('stopped'), 0.35, 1.8);
  // S6 night: the open loop
  R('night-ambience', C('nobody') - 0.4, 0.3, C('cracked') - C('nobody') + 0.4); R('tension-drone', C('nobody'), 0.25, 2.4); R('pop-click', C('home') - 0.1, 0.35, 0.4);
  // S7-S9 gaming vs coding, typing, errors
  R('glitch', C('gaming') - 0.2, 0.15, 0.8); R('typing', C('leo', 0, C('gaming')), 0.3, 2.2);
  R('typing', C('teaching') - 0.1, 0.4, C('one video') - C('teaching'));
  R('whoosh-small', C('video') - 0.2, 0.25, 0.6); R('score-count', C('one video'), 0.2, C('first') - C('one video') - 0.2);
  [0, 1, 2].forEach((i) => R('pop-click', C('error') + 0.15 + i * 0.25, 0.35, 0.3));
  // S10-S11 crash and tears
  R('typing', C('first') - 0.3, 0.35, C('crashed') - C('first') + 0.3); R('impact-big', C('crashed'), 0.55, 1.8); R('lose-piano', C('crashed') + 0.2, 0.35, 1.8);
  R('wind-winter', C('cried') - 0.3, 0.25, C('quit') - C('cried') + 0.3);
  // S12 the turn
  R('reveal-impact', C('quit') - 0.05, 0.55, 1.8); R('riser', C('quit') + 0.3, 0.25, 2.2);
  // S13-S16 the climb
  R('door-creak', C('built') - 0.5, 0.2, 0.8); R('achievement', C('bakery'), 0.35, 1.4); R('crowd-ooh', C('bakery') + 0.1, 0.2, 1);
  R('coins-handle', C('saved'), 0.35, 1.2); R('win-notify', C('day'), 0.3, 1);
  R('car-arrive', C('next') - 0.4, 0.2, 1.4); R('notify-positive', C('wanted'), 0.35, 1);
  R('transition-riser', C('more') - 0.6, 0.35, 1.6); R('payout', C('more') + 0.8, 0.35, 1.5);
  // S17 the company
  R('crowd-murmur', C('company') - 0.6, 0.2, 2.2); R('win-chimes', C('employees') + 0.4, 0.4, 1.8);
  // S18-S20 the application, the name, the memory
  R('paper-fall', C('application') + 0.3, 0.45, 1); R('impact-quick', C('desk'), 0.35, 0.6);
  R('heartbeat', C('knew', 0, C('application')) - 0.2, 0.5, C('could') - C('knew', 0, C('application'))); R('swell-rumble', C('knew', 0, C('application')), 0.25, 3);
  R('impact-trailer', C('teacher', 0, C('old')), 0.5, 1.6); R('crowd-laugh', C('teacher', 0, C('old')) + 0.35, 0.25, 0.8);
  // S21-S22 the choice
  R('tension-drone', C('could'), 0.3, C('hired') - C('could')); R('crowd-laugh', C('all did', -0.3), 0.15, 1.2);
  R('swell-heaven', C('instead') - 0.3, 0.45, 2.5);
  // S23-S24 the callback and the lesson
  R('crowd-murmur', C('teach') - 0.2, 0.18, 2.5); R('pop', C('back', 0, C('sit')) - 0.2, 0.3, 0.4);
  R('reveal-impact', C('slow') - 0.3, 0.4, 1.6); R('piano-chord', C('different') - 0.1, 0.45, 2.5); R('logo-reveal', C('game'), 0.35, 2);
}
