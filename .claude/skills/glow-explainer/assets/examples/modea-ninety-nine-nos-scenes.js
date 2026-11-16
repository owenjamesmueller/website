/* "Ninety-nine companies told her no" — Mode A story (a parable). Built with the story kit: rejection wall, inbox,
 * dinner table, interview room, storefronts, referral network, application form. Open loops: the hook (#100 said yes in
 * five minutes), "she noticed something", "the craziest part was #99". Callbacks: the wall, the inbox, the application.
 */
window.GX_PACE = 0.7;
const VO = window.DURATION;
window.DURATION = VO + 2.8;
const END = window.DURATION;
const C = (p, o = 0, from = 0) => cue(p, o, from);
const cam = document.getElementById('cam'); drift(cam, 4);
punches('#stage', 0.025, 0.22);
window.GX_WHOOSH = 0.12;
subtitles();
const FL = 1300, GOLD = '#f5c542';
const S0 = (el) => show(el, -1, null, 0.01);
const MAYA = { pony: true, accent: GOLD };

/* ============ S1 — hook: "Ninety-nine companies told Maya no." ============ */
const S1 = stageSet(); enter(S1, -1, 'cut');
{
  const wall = rejectWall(540, 880, { parent: S1, cols: 7, rows: 5, gap: 12 }); S0(wall);
  for (let i = 0; i < 35; i++) wall.add(i, -1 + i * 0.001);
  S0(floor(1420, { parent: S1 }));
  const m = person(540, 1420, { size: 0.82, parent: S1, ...MAYA }); S0(m); m.head(-1, 'down', 0.01);
  const h = titleCard('99 companies<br>said _no._', { parent: S1, y: 440, kicker: 'Maya · 22', size: 92 }); S0(h);
  shake(cam, C('no') + 0.05, 0.25, 8);
}

/* ============ S2 — "The hundredth said yes in five minutes." ============ */
const S2 = stageSet(); sceneSwap(S1, S2, C('hundredth') - 0.3, 'zoom');
{
  const ib = inbox(540, 960, { parent: S2, w: 820, h: 660 }); S0(ib);
  ib.mail(0, 'Company #98', 'Unfortunately, we’ve decided…', -1, 'red');
  ib.mail(1, 'Company #99', 'Unfortunately, we’ve decided…', -0.9, 'red');
  ib.mail(2, 'Company #100', 'Approved. Welcome aboard.', C('yes') - 0.15, 'green');
  const h = titleCard('Number 100 said *yes.*', { parent: S2, y: 440, kicker: 'in five minutes', size: 76 }); pop(h, C('yes'));
}

/* ============ SR — re-hook: "Here's how." ============ */
const SR = stageSet(); sceneSwap(S2, SR, C('heres') - 0.15, 'push');
{
  const ck = icon('calendar', 540, 880, { size: 300, parent: SR }); S0(ck);
  tw(ck, C('heres') - 0.15, 0.9, { rotate: [0, -360] }, 'inOut');
  const st = stat('Rewind to', 'Age 22', 540, 1200, { size: 84, parent: SR, tone: 'gold' }); pop(st, C('heres'));
  const h = titleCard('Here’s *how.*', { parent: SR, y: 440, size: 110 }); pop(h, C('heres'));
}

/* ============ S3 — "At twenty-two, she applied to every job she could find." ============ */
const S3 = stageSet(); sceneSwap(SR, S3, C('applied') - 0.7, 'whip');
{
  S0(bedroom({ parent: S3 }));
  const m = person(540, 1420, { size: 0.95, parent: S3, ...MAYA }); S0(m); m.pose(-1, 'type', 0.01);
  const dk = deskFront(540, 1470, { parent: S3 }); S0(dk); dk.glow(C('applied'));
  const st = stat('Applications sent', '0', 540, 470, { size: 104, parent: S3, tone: 'gold' }); pop(st, C('applied') - 0.2);
  count(st.querySelector('.gx-stat-val'), C('applied'), C('every morning') - C('applied') - 0.2, 0, 100);
}

/* ============ S4 — "Every morning, the same email. We've decided to move forward with other candidates." ============ */
const S4 = stageSet(); sceneSwap(S3, S4, C('every morning') - 0.15, 'push');
{
  const sun = halo(860, 640, { r: 260, parent: S4 }); sun.dataset.glowColor = '245,197,66'; S0(sun);
  const ib = inbox(540, 960, { parent: S4, w: 820, h: 660 }); S0(ib);
  ['Northwind', 'Acme Corp', 'Bluepeak', 'Lumen Labs', 'Orbit Inc', 'Vertex', 'Halcyon'].forEach((n, i) =>
    ib.mail(i, n, 'We’ve decided to move forward with other candidates', C('same') - 0.3 + i * 0.42, 'red'));
  const h = titleCard('Every *morning.*', { parent: S4, y: 440, size: 96 }); pop(h, C('every morning'));
}

/* ============ S5 — "Her friends got jobs. Her parents stopped asking." (split screen) ============ */
const S5 = stageSet(); sceneSwap(S4, S5, C('friends') - 0.45, 'whip');
{
  S0(floor(940, { parent: S5 }));
  [[250, 0], [540, 1], [830, 2]].forEach(([x, i]) => { const f = person(x, 940, { size: 0.55, tie: true, parent: S5 }); S0(f); f.pose(C('jobs') - 0.2 + i * 0.08, 'both', 0.25); bob(f, C('jobs') - 0.1, C('parents'), 9, 13 + i); });
  const pf = pill('Friends: hired', 540, 560, { size: 'md', parent: S5 }); pop(pf, C('friends'));
  const sep = document.createElement('div'); sep.style.cssText = 'width:1080px;height:4px;background:rgba(255,255,255,.35)'; S0(place(sep, 540, 985, { parent: S5, z: 3, glow: false }));
  S0(floor(1440, { parent: S5 }));
  const dad = person(300, 1390, { size: 0.62, parent: S5 }); S0(dad);
  const mom = person(780, 1390, { size: 0.58, parent: S5 }); S0(mom);
  const m = person(540, 1390, { size: 0.55, parent: S5, ...MAYA }); S0(m);
  S0(diningTable(540, 1440, { parent: S5 }));
  [dad, mom, m].forEach((p, i) => p.head(C('parents') + 0.2 + i * 0.1, 'down', 0.5));
  const pp = pill('Dinner: silence', 540, 1040, { size: 'md', parent: S5 }); pop(pp, C('parents'));
}

/* ============ S6 — "She taped every rejection to her wall." ============ */
const S6 = stageSet(); sceneSwap(S5, S6, C('taped') - 0.4, 'zoom');
{
  const wall = rejectWall(470, 860, { parent: S6, cols: 7, rows: 5, gap: 12 }); S0(wall);
  wall.fill(C('taped') - 0.1, C('fifty') - 0.3, 35);
  S0(floor(1420, { parent: S6 }));
  const m = person(905, 1420, { size: 0.7, parent: S6, ...MAYA }); S0(m); m.dataset.overlapOk = '';
  m.pose(C('taped'), 'raise', 0.2); bob(m, C('taped'), C('fifty') - 0.3, 5, 10);
  const st = stat('Rejections', '0', 540, 440, { size: 96, parent: S6, tone: 'red' }); pop(st, C('taped'));
  count(st.querySelector('.gx-stat-val'), C('taped') - 0.1, C('fifty') - C('taped'), 0, 50);
}

/* ============ S7 — "By number fifty, she noticed something." ============ */
const S7 = stageSet(); sceneSwap(S6, S7, C('fifty') - 0.5, 'push');
{
  const wall = rejectWall(540, 900, { parent: S7, cols: 7, rows: 5, gap: 12 }); S0(wall);
  for (let i = 0; i < 35; i++) wall.add(i, -1);
  [3, 9, 16, 22, 30].forEach((i, k) => wall.highlight(i, C('noticed') + k * 0.12));
  const h = titleCard('She noticed<br>*something.*', { parent: S7, y: 440, size: 84 }); pop(h, C('noticed'));
  S7.style.transformOrigin = '540px 900px'; tw(S7, C('noticed'), C('every company') - C('noticed'), { scale: [1, 1.08] }, 'inOut');
}

/* ============ S8 — "Every company asked the same thing. Show us something you've built." ============ */
const S8 = stageSet(); sceneSwap(S7, S8, C('every company') - 0.15, 'whip');
{
  S0(officeWindow({ parent: S8 })); S0(floor(FL, { parent: S8 }));
  const boss = person(740, FL - 60, { size: 0.8, tie: true, glasses: true, parent: S8 }); S0(boss); boss.pose(-1, 'cross', 0.01).pose(C('show') - 0.1, 'point', 0.2);
  S0(deskFront(740, FL, { parent: S8, laptop: false }));
  const m = person(260, FL, { size: 0.82, parent: S8, ...MAYA }); S0(m);
  const b = bubble('Show us something<br>you’ve built.', 560, 760, { parent: S8, fill: true }); b.style.fontSize = '36px'; b.style.textAlign = 'center'; pop(b, C('show') - 0.1);
}

/* ============ S9 — "She had nothing to show." ============ */
const S9 = stageSet(); sceneSwap(S8, S9, C('nothing') - 0.5, 'zoom');
{
  S0(floor(1430, { parent: S9 }));
  const sp = spotlight(540, 560, { width: 480, height: 880, parent: S9 }); S0(sp);
  const m = person(540, 1430, { size: 1.15, parent: S9, ...MAYA }); S0(m); m.pose(C('nothing') - 0.1, 'shrug', 0.3).head(C('show', 0, C('nothing')), 'down', 0.4);
  const h = titleCard('She had _nothing._', { parent: S9, y: 440, size: 92 }); pop(h, C('nothing'));
}

/* ============ S10 — "So she stopped applying, and started building." ============ */
const S10 = stageSet(); sceneSwap(S9, S10, C('applying') - 0.7, 'push');
{
  const ib = inbox(540, 990, { parent: S10, w: 820, h: 640 }); S0(ib);
  ib.mail(0, 'Orbit Inc', 'We’ve decided to move forward…', -1, 'red');
  tw(ib, C('applying') + 0.1, 0.3, { opacity: [1, 0], scale: [1, 0.9] }, 'in');
  const sc = codeScreen(540, 990, { parent: S10, file: 'cafe-website.html' }); tw(sc, C('started') - 0.15, 0.3, { opacity: [0, 1], scale: [1.1, 1] }, 'out');
  sc.code(C('started'), C('cafe') - 0.4, 0.07);
  const h = titleCard('She started *building.*', { parent: S10, y: 440, size: 78 }); pop(h, C('started'));
}

/* ============ S11 — "A website for the cafe downstairs. Then the gym. Then the dentist." ============ */
const S11 = stageSet(); sceneSwap(S10, S11, C('cafe') - 0.6, 'whip');
{
  S0(floor(FL, { parent: S11 }));
  [['CAFE', 'cafe', 200, '#f5c542'], ['GYM', 'gym', 540, '#ff5a5f'], ['DENTIST', 'dentist', 880, '#9fd3ff']].forEach(([sign, w, x, col]) => {
    const st = storefront(x, FL, sign, { parent: S11, color: col, size: 0.95 }); S0(st); st.lights(C(w));
    const card = siteCard(x, 760, sign.charAt(0) + sign.slice(1).toLowerCase(), { parent: S11, color: col, scale: 0.95 }); pop(card, C(w) - 0.05);
  });
  const h = titleCard('One website at a time', { parent: S11, y: 440, size: 64 }); pop(h, C('website'));
}

/* ============ S12 — "Every client told two more." ============ */
const S12 = stageSet(); sceneSwap(S11, S12, C('client') - 0.5, 'zoom');
{
  const net = network(540, 975, { parent: S12, levels: 3, r0: 100, step: 88 }); S0(net); net.grow(C('client') - 0.42, 0.3);
  const st = stat('Clients', '1', 540, 440, { size: 100, parent: S12, tone: 'gold' }); pop(st, C('client'));
  count(st.querySelector('.gx-stat-val'), C('client'), 1.4, 1, net.count);
}

/* ============ SC — re-hook: "But the craziest part was rejection number ninety-nine." ============ */
const SC = stageSet(); sceneSwap(S12, SC, C('craziest') - 0.5, 'zoom');
{
  const sp = spotlight(540, 560, { width: 520, height: 820, parent: SC }); S0(sp);
  const ck = icon('clock', 540, 940, { size: 320, parent: SC }); S0(ck);
  on((t) => { const k = Math.floor((t - C('craziest')) * 2); ck.style.rotate = (Math.max(0, k) * 6) + 'deg'; });
  const st = stat('Rejection', '#99', 540, 1270, { size: 90, parent: SC, tone: 'red' }); pop(st, C('ninetynine', 0, C('craziest')) - 0.1);
  const h = titleCard('The craziest part', { parent: SC, y: 440, size: 84 }); pop(h, C('craziest'));
  tw(SC, C('craziest'), C('sorry') - C('craziest'), { scale: [1, 1.08] }, 'in');
}

/* ============ S13+S14 — "Sorry, they wrote. We hired an agency instead. She read the agency's name twice." ============ */
const S13 = stageSet(); sceneSwap(SC, S13, C('sorry') - 0.35, 'push');
{
  const ib = inbox(540, 960, { parent: S13, w: 840, h: 720, title: 'Rejection #99' }); S0(ib);
  ib.open(C('sorry') - 0.25, 1e9, 'Company #99', ['Sorry, Maya. We hired', 'an agency instead:', 'Maya Studio.'], 'Maya Studio');
  const hw = ib.querySelector('.hlw'); on((t) => hw.setAttribute('fill', t >= C('twice') ? '#c98a00' : '#222'));
  S13.style.transformOrigin = '540px 1120px'; tw(S13, C('read'), C('hers') - C('read'), { scale: [1, 1.18] }, 'inOut');
}

/* ============ S15 — "It was hers." ============ */
const S15 = stageSet(); sceneSwap(S13, S15, C('hers') - 0.3, 'zoom');
{
  S0(floor(FL, { parent: S15 }));
  const hl = halo(620, 1080, { r: 330, parent: S15 }); hl.dataset.glowColor = '245,197,66'; show(hl, C('hers'), null, 0.3);
  const st = storefront(660, FL, 'MAYA STUDIO', { parent: S15, color: GOLD, size: 1.3 }); S0(st); st.lights(C('hers'));
  const m = person(230, FL, { size: 0.85, parent: S15, ...MAYA }); S0(m); m.pose(C('hers') + 0.1, 'both', 0.3); bob(m, C('hers') + 0.1, C('hired', 0, C('rejected')) - 0.5, 9, 12);
  const h = titleCard('It was *hers.*', { parent: S15, y: 440, size: 110 }); pop(h, C('hers'));
}

/* ============ S16 — "They had rejected Maya, and hired Maya, in the same week." ============ */
const S16 = stageSet(); sceneSwap(S15, S16, C('hired', 0, C('rejected')) - 0.45, 'whip');
{
  const card = siteCard(540, 960, 'Maya', { parent: S16, scale: 2.2 }); S0(card);
  stamp('REJECTED', 540, 820, C('hired', 0, C('rejected')) - 0.3, { parent: S16, rot: -10 });
  stamp('HIRED', 540, 1110, C('hired', 0, C('rejected')) + 0.05, { parent: S16, color: GOLD, rot: 6 });
  const h = titleCard('Same _week._', { parent: S16, y: 440, size: 100 }); pop(h, C('week'));
}

/* ============ S17 — "That's when she filled out application number one hundred. Her own company. Approved in five minutes." ============ */
const S17 = stageSet(); sceneSwap(S16, S17, C('filled') - 0.6, 'push');
{
  const f = appForm(540, 905, { parent: S17, title: 'APPLICATION #100', labels: ['COMPANY', 'OWNER', 'STATUS'] }); S0(f);
  f.fill(0, 'Maya Studio', C('filled'), 0.6); f.fill(1, 'Maya', C('own'), 0.3); f.fill(2, 'Approved', C('approved'), 0.4);
  f.photo(C('own') + 0.2);
  stamp('APPROVED', 540, 1060, C('approved') + 0.15, { parent: S17, color: GOLD, rot: -8 });
  const ck = pill('Time: 5:00', 540, 372, { size: 'md', parent: S17 }); pop(ck, C('minutes') - 0.2);
}

/* ============ S18 — "Ninety-nine people told her no. She only needed one yes. Her own." ============ */
const S18 = stageSet(); sceneSwap(S17, S18, C('people') - 0.7, 'zoom');
{
  const wall = rejectWall(540, 900, { parent: S18, cols: 7, rows: 5, gap: 12 }); S0(wall);
  for (let i = 0; i < 35; i++) if (i !== 17) wall.add(i, -1);
  const yes = siteCard(540, 900, 'YES', { parent: S18, color: GOLD, scale: 0.9 }); yes.dataset.overlapOk = '';
  yes.dataset.glowColor = '245,197,66'; yes.dataset.glow = '';
  tw(yes, C('needed') - 0.1, 0.4, { opacity: [0, 1], scale: [1.6, 1], glow: [0, 1.4] }, 'out');
  tw(wall, C('needed'), 0.8, { opacity: [1, 0.35] }, 'inOut');
  tw(S18, C('people'), END - C('people'), { scale: [1, 1.06] }, 'linear');
  const t1 = titleCard('99 people said _no._', { parent: S18, y: 440, size: 80 }); pop(t1, C('people'));
  out(t1, C('needed') - 0.3, 0.2);
  const t2 = titleCard('She needed one *yes.*<br>Her *own.*', { parent: S18, y: 450, kicker: 'Remember this', size: 74 }); pop(t2, C('needed'));
  const q = pill('What’s your number 99?', 540, 1270, { size: 'md', parent: S18 }); q.style.fontSize = '32px'; pop(q, VO + 0.6);
}

/* ================= SOUND DESIGN — natural (real recordings) ================= */
{
  const R = (n, t, v, d = 0) => sfx('real/' + n, t, v, d);
  R('clock-tick', 0, 0.14, C('hundredth') - 0.3); R('paper-crinkle', 0.1, 0.2, 0.6); R('heartbeat-single', C('no') + 0.05, 0.35, 1);
  R('office-ambience', C('hundredth') - 0.3, 0.14, C('heres') - C('hundredth')); R('small-clapping', C('minutes') - 0.2, 0.22, 1.4);
  R('rewind', C('heres') - 0.2, 0.2, 1.2);
  R('laptop-typing', C('applied') - 0.5, 0.3, C('every morning') - C('applied') + 0.3); R('crickets-night', C('applied') - 0.6, 0.18, C('every morning') - C('applied') + 0.5);
  R('clock-tick', C('every morning') - 0.2, 0.18, C('friends') - C('every morning'));
  R('restaurant-chatter', C('friends') - 0.4, 0.14, 1.6); R('small-clapping', C('jobs'), 0.25, 1.4);
  R('clock-tick', C('parents'), 0.22, C('taped') - C('parents'));
  for (let i = 0; i < 9; i++) R(i % 2 ? 'paper-crinkle' : 'stapler', C('taped') + i * 0.32, 0.16, 0.4);
  R('heartbeat-single', C('noticed'), 0.3, 1.2); R('pen-click', C('noticed') + 0.3, 0.3, 0.4);
  R('office-ambience', C('every company') - 0.2, 0.18, C('nothing') - C('every company')); R('paper-slide', C('show') - 0.2, 0.25, 0.6);
  R('clock-tick', C('nothing') - 0.4, 0.2, C('applying') - C('nothing'));
  R('mouse-click', C('applying') + 0.05, 0.35, 0.4); R('laptop-typing', C('started'), 0.32, C('cafe') - C('started'));
  R('city-traffic', C('cafe') - 0.6, 0.12, C('client') - C('cafe') + 0.4);
  ['cafe', 'gym', 'dentist'].forEach((w) => R('shop-doorbell', C(w) - 0.05, 0.3, 1.2));
  R('market-walla', C('client') - 0.4, 0.14, C('craziest') - C('client') + 0.2);
  R('clock-tick', C('craziest') - 0.4, 0.32, C('sorry') - C('craziest') + 0.3); R('heartbeat', C('ninetynine', 0, C('craziest')) - 0.2, 0.28, 1.4);
  R('heartbeat', C('read') - 0.1, 0.35, C('hers') - C('read')); R('heartbeat-single', C('twice'), 0.4, 1);
  R('small-clapping', C('hers') + 0.15, 0.3, 1.6);
  R('pen-click', C('filled') - 0.1, 0.3, 0.4);
  R('office-ambience', C('people') - 0.6, 0.12, END - C('people')); R('piano-chord', C('own', 0, C('needed')) - 0.1, 0.2, 3);
  R('notify-bubble', VO + 0.6, 0.3, 0.8);
}
