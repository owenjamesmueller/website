/* "The man who sold the Eiffel Tower — twice" — Mode A, TRUE story (Victor Lustig, Paris 1925; scrap dealer André Poisson).
 * Facts used: newspaper story about the tower's repair costs, forged government credentials, a hotel meeting with scrap
 * dealers, secrecy, the wife's suspicion and the "corrupt official" bribe confession, the flight to Vienna, Poisson too
 * embarrassed to report it, the second attempt ~6 months later (that buyer went to police; Lustig escaped), Alcatraz later.
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
const LUSTIG = { fedora: true, tie: true, accent: GOLD };
const POISSON = { tie: true, glasses: true };

/* ============ S1 — hook: "In nineteen twenty-five, a man sold the Eiffel Tower." ============ */
const S1 = stageSet(); enter(S1, -1, 'cut');
{
  S0(nightSky({ parent: S1, moonX: 880, moonY: 640 })); S0(floor(FL, { parent: S1 }));
  const tw0 = eiffelTower(600, FL, { parent: S1, h: 780 }); S0(tw0); tw0.glow(-1); tw0.sold(C('sold') + 0.1);
  const l = person(210, FL, { size: 0.8, parent: S1, ...LUSTIG }); S0(l); l.pose(-1, 'hips', 0.01).pose(C('sold'), 'point', 0.25);
  const h = titleCard('He sold the<br>*Eiffel Tower.*', { parent: S1, y: 430, kicker: 'Paris · 1925', size: 88 }); S0(h);
}

/* ============ S2 — "Then he came back, and sold it again." ============ */
const S2 = stageSet(); sceneSwap(S1, S2, C('then') - 0.3, 'zoom');
{
  S0(floor(FL, { parent: S2 }));
  const t2 = eiffelTower(540, FL, { parent: S2, h: 700 }); S0(t2); t2.sold(-1);
  const st = stat('Times sold', '1', 540, 470, { size: 120, parent: S2, tone: 'gold' }); S0(st);
  on((t) => { st.querySelector('.gx-stat-val').textContent = t >= C('again') ? '2' : '1'; });
  tw(st, C('again'), 0.35, { scale: [1.3, 1] }, 'back'); shake(cam, C('again') + 0.05, 0.25, 8);
}

/* ============ S3 — "His name was Victor Lustig, and it started with a newspaper." ============ */
const S3 = stageSet(); sceneSwap(S2, S3, C('name') - 0.4, 'whip');
{
  S0(floor(1420, { parent: S3 }));
  const sp = spotlight(330, 560, { width: 420, height: 900, parent: S3 }); S0(sp);
  const l = person(330, 1420, { size: 1.05, parent: S3, ...LUSTIG }); S0(l); l.pose(-1, 'cross', 0.01);
  const cpt = pill('Victor Lustig · con man', 420, 400, { size: 'md', parent: S3 }); pop(cpt, C('victor'));
  const np = newspaper(790, 990, 'EIFFEL TOWER|FALLING APART', { parent: S3 }); np.style.scale = '0.52'; np.dataset.overlapOk = ''; np.spin(C('newspaper') - 0.35);
}

/* ============ S4 — "The tower was rusting, and costing Paris a fortune to repair." ============ */
const S4 = stageSet(); sceneSwap(S3, S4, C('rusting') - 0.6, 'zoom');
{
  S0(floor(FL, { parent: S4 }));
  const t4 = eiffelTower(540, FL, { parent: S4, h: 760 }); S0(t4); t4.rust(C('rusting') - 0.2);
  const st = stat('Repair bill', 'A fortune', 540, 440, { size: 96, parent: S4, tone: 'red' }); pop(st, C('fortune') - 0.15);
}

/* ============ S5 — "Lustig saw what nobody else did." ============ */
const S5 = stageSet(); sceneSwap(S4, S5, C('saw') - 0.5, 'push');
{
  S0(floor(1430, { parent: S5 }));
  const hl = halo(540, 1060, { r: 320, parent: S5 }); hl.dataset.glowColor = '245,197,66'; show(hl, C('nobody'), null, 0.3);
  const l = person(540, 1430, { size: 1.2, parent: S5, ...LUSTIG }); S0(l); l.head(C('saw'), 'tilt', 0.4);
  const h = titleCard('He saw an<br>*opportunity.*', { parent: S5, y: 430, size: 86 }); pop(h, C('nobody'));
}

/* ============ S6 — "He forged government papers," ============ */
const S6 = stageSet(); sceneSwap(S5, S6, C('forged') - 0.4, 'whip');
{
  const f = appForm(540, 905, { parent: S6, title: 'MINISTRY OF POSTS', labels: ['OFFICIAL', 'TITLE', 'MATTER'] }); S0(f);
  f.fill(0, 'V. Lustig', C('forged'), 0.4); f.fill(1, 'Deputy Director', C('government'), 0.4); f.fill(2, 'Sale of the tower', C('papers'), 0.4);
  stamp('OFFICIAL', 540, 1150, C('papers') + 0.35, { parent: S6, color: GOLD, rot: -8 });
}

/* ============ S7 — "booked a suite in a luxury hotel, and invited scrap metal dealers to a secret meeting." ============ */
const S7 = stageSet(); sceneSwap(S6, S7, C('booked') - 0.3, 'push');
{
  S0(hotelSuite({ parent: S7 })); S0(floor(FL, { parent: S7 }));
  const l = person(540, FL - 30, { size: 0.82, parent: S7, ...LUSTIG }); S0(l); l.pose(-1, 'hips', 0.01).pose(C('invited'), 'both', 0.3);
  const ds = [[170, 0.68], [330, 0.66], [750, 0.66], [910, 0.68]].map(([x, s], i) => { const d = person(x, FL, { size: s, dim: true, tie: true, parent: S7 }); tw(d, C('dealers') - 0.2 + i * 0.12, 0.25, { opacity: [0, 1], x: [i < 2 ? -80 : 80, 0] }, 'out'); return d; });
  S0(diningTable(540, FL + 6, { parent: S7, w: 560 }));
  const h = titleCard('A *secret* meeting', { parent: S7, y: 430, size: 80 }); pop(h, C('secret'));
}

/* ============ S8 — "The city, he whispered, was selling the tower for scrap." ============ */
const S8 = stageSet(); sceneSwap(S7, S8, C('city') - 0.4, 'zoom');
{
  S0(hotelSuite({ parent: S8 })); S0(floor(FL, { parent: S8 }));
  const l = person(330, FL, { size: 0.95, parent: S8, ...LUSTIG }); S0(l); l.pose(-1, 'give', 0.01).head(C('whispered'), 'tilt', 0.3);
  const d = person(760, FL, { size: 0.9, dim: true, tie: true, parent: S8 }); S0(d); d.head(C('scrap') - 0.1, 'tilt', 0.3);
  const b = bubble('The tower is<br>for sale… as scrap.', 520, 770, { parent: S8, fill: true }); b.style.fontSize = '38px'; b.style.textAlign = 'center'; pop(b, C('selling') - 0.1);
  S8.style.transformOrigin = '540px 1000px'; tw(S8, C('city'), C('quiet') - C('city'), { scale: [1, 1.08] }, 'inOut');
}

/* ============ S9 — "It had to stay quiet, or Paris would riot." ============ */
const S9 = stageSet(); sceneSwap(S8, S9, C('quiet') - 0.6, 'whip');
{
  S0(floor(FL, { parent: S9 }));
  const fl = document.createElement('div'); fl.style.cssText = 'width:1080px;height:1920px;background:radial-gradient(circle at 50% 70%, rgba(229,72,77,.28), transparent 60%)';
  const red = place(fl, 540, 960, { parent: S9, z: 0, glow: false }); show(red, C('riot') - 0.2, null, 0.3);
  for (let i = 0; i < 7; i++) { const x = 110 + i * 143, s = 0.5 + rand(i) * 0.12; const p = person(x, FL, { size: s, dim: true, parent: S9 }); S0(p); p.pose(C('riot') - 0.1 + i * 0.05, 'both', 0.2); bob(p, C('riot'), C('one dealer'), 10, 12 + i); }
  [[250, 'NON !'], [800, 'NON !']].forEach(([x, txt], i) => { const sg = sign(txt, x, 950, { parent: S9, stick: 120 }); pop(sg, C('riot') + 0.15 + i * 0.1); });
  const h = titleCard('Or Paris would _riot._', { parent: S9, y: 430, size: 80 }); pop(h, C('paris'));
}

/* ============ S10 — "One dealer, Andre Poisson, wanted it badly." ============ */
const S10 = stageSet(); sceneSwap(S9, S10, C('one dealer') - 0.15, 'push');
{
  S0(floor(1430, { parent: S10 }));
  const sp = spotlight(540, 560, { width: 460, height: 900, parent: S10 }); S0(sp);
  const p = person(540, 1430, { size: 1.1, parent: S10, ...POISSON }); S0(p); p.pose(C('wanted') - 0.1, 'both', 0.25); bob(p, C('wanted'), C('wife') - 0.4, 8, 12);
  const cpt = pill('André Poisson · scrap dealer', 540, 400, { size: 'md', parent: S10 }); pop(cpt, C('andre'));
  const st = stat('Wanted it', 'Badly', 540, 560, { size: 76, parent: S10, tone: 'gold' }); pop(st, C('badly') - 0.1);
}

/* ============ S11 — "But his wife was suspicious. Why all the secrecy?" ============ */
const S11 = stageSet(); sceneSwap(S10, S11, C('wife') - 0.35, 'whip');
{
  S0(floor(FL, { parent: S11 }));
  const p = person(330, FL, { size: 0.9, parent: S11, ...POISSON }); S0(p);
  const w = person(760, FL, { size: 0.84, bun: true, parent: S11 }); S0(w); w.pose(-1, 'cross', 0.01).head(C('suspicious'), 'tilt', 0.3).head(C('secrecy'), 'shake');
  const b = bubble('Why all the secrecy?', 700, 860, { parent: S11, fill: true }); b.style.fontSize = '38px'; pop(b, C('why') - 0.1);
  p.head(C('secrecy') + 0.2, 'down', 0.4);
  const h = titleCard('His wife was<br>_suspicious._', { parent: S11, y: 430, size: 80 }); pop(h, C('suspicious') - 0.1);
}

/* ============ S12 — re-hook: "So Lustig did something genius. He confessed." ============ */
const S12 = stageSet(); sceneSwap(S11, S12, C('genius') - 0.9, 'zoom');
{
  S0(floor(1430, { parent: S12 }));
  const sp = spotlight(540, 560, { width: 420, height: 900, parent: S12 }); S0(sp);
  tw(sp, C('confessed') - 0.1, 0.5, { scale: [1, 0.75] }, 'inOut');
  const l = person(540, 1430, { size: 1.2, parent: S12, ...LUSTIG }); S0(l); l.pose(C('confessed'), 'give', 0.3);
  const t1 = titleCard('Something *genius.*', { parent: S12, y: 430, size: 86 }); pop(t1, C('genius') - 0.1); out(t1, C('confessed') - 0.25, 0.2);
  const t2 = titleCard('He _confessed._', { parent: S12, y: 430, size: 110 }); pop(t2, C('confessed'));
}

/* ============ S13 — "He admitted he was a corrupt official, and needed a bribe." ============ */
const S13 = stageSet(); sceneSwap(S12, S13, C('admitted') - 0.4, 'whip');
{
  S0(hotelSuite({ parent: S13 })); S0(floor(FL, { parent: S13 }));
  const l = person(300, FL, { size: 0.92, parent: S13, ...LUSTIG }); S0(l); l.pose(-1, 'shrug', 0.01).pose(C('bribe') - 0.1, 'give', 0.3);
  const p = person(780, FL, { size: 0.9, parent: S13, ...POISSON }); S0(p);
  const b = bubble('I’m a corrupt official.<br>I need a little… extra.', 470, 760, { parent: S13, fill: true }); b.style.fontSize = '34px'; b.style.textAlign = 'center'; pop(b, C('corrupt') - 0.15);
}

/* ============ S14 — "Poisson relaxed. Corrupt officials were normal. Fake ones weren't." ============ */
const S14 = stageSet(); sceneSwap(S13, S14, C('relaxed') - 0.6, 'push');
{
  S0(floor(1430, { parent: S14 }));
  const hl = halo(540, 1080, { r: 300, parent: S14 }); S0(hl);
  const p = person(540, 1430, { size: 1.1, parent: S14, ...POISSON }); S0(p); p.pose(-1, 'cross', 0.01).pose(C('relaxed'), 'hips', 0.4).head(C('relaxed'), 'up', 0.4);
  const a = stat('Corrupt official', 'Normal', 300, 520, { size: 64, parent: S14, tone: 'gold' }); pop(a, C('normal') - 0.2);
  const b = stat('Fake official', 'Unthinkable', 780, 520, { size: 64, parent: S14, tone: 'red' }); pop(b, C('fake') - 0.1);
}

/* ============ S15 — "He paid the bribe, and the price." ============ */
const S15 = stageSet(); sceneSwap(S14, S15, C('paid') - 0.4, 'whip');
{
  S0(hotelSuite({ parent: S15 })); S0(floor(FL, { parent: S15 }));
  const p = person(250, FL, { size: 0.85, parent: S15, ...POISSON }); S0(p); p.pose(C('paid'), 'give', 0.3);
  const sc = suitcase(700, 1150, { parent: S15, size: 1.05 }); S0(sc); sc.fill(C('paid'), C('vienna') - 0.6, 16);
  const st = stat('Paid', 'Bribe + price', 700, 760, { size: 64, parent: S15, tone: 'gold' }); pop(st, C('price') - 0.2);
}

/* ============ S16 — "Lustig left for Vienna with a suitcase full of cash." ============ */
const S16 = stageSet(); sceneSwap(S15, S16, C('left') - 0.35, 'zoom');
{
  S0(nightSky({ parent: S16, moonX: 860, moonY: 600 })); S0(floor(FL, { parent: S16 }));
  const tr = train(430, FL, { parent: S16, size: 0.95 }); S0(tr); tr.depart(C('cash') - 0.1, 2.6, 1500);
  const p = pill('Next stop: Vienna', 540, 640, { size: 'md', parent: S16 }); pop(p, C('vienna') - 0.1);
  const h = titleCard('Gone. With the *cash.*', { parent: S16, y: 430, size: 80 }); pop(h, C('cash') - 0.2);
}

/* ============ S17 — "And Poisson? He was too embarrassed to tell the police." ============ */
const S17 = stageSet(); sceneSwap(S16, S17, C('victim', -0.35) - 0.15, 'push');
{
  S0(floor(1430, { parent: S17 }));
  const p = person(380, 1430, { size: 1.05, parent: S17, ...POISSON }); S0(p); p.pose(C('embarrassed') - 0.1, 'cover', 0.3).head(C('embarrassed'), 'down', 0.3);
  const cop = person(860, 1430, { size: 0.6, dim: true, police: true, parent: S17 }); S0(cop); cop.pose(-1, 'hips', 0.01);
  const x = icon('cross', 860, 900, { size: 110, parent: S17 }); pop(x, C('police') + 0.1);
  const h = titleCard('Too _embarrassed_<br>to tell anyone.', { parent: S17, y: 430, size: 74 }); pop(h, C('embarrassed') - 0.1);
}

/* ============ S18 — re-hook: "So six months later, Lustig came back, and did it again." ============ */
const S18 = stageSet(); sceneSwap(S17, S18, C('six') - 0.5, 'zoom');
{
  S0(nightSky({ parent: S18, moonX: 880, moonY: 620 })); S0(floor(FL, { parent: S18 }));
  const t8 = eiffelTower(640, FL, { parent: S18, h: 740 }); S0(t8); t8.sold(C('again', 0, C('six')) - 0.1);
  const l = person(200, FL, { size: 0.8, parent: S18, ...LUSTIG }); tw(l, C('came', 0, C('six')) - 0.3, 0.6, { opacity: [0, 1], x: [-220, 0] }, 'out'); bob(l, C('came', 0, C('six')) - 0.3, C('came', 0, C('six')) + 0.3, 6, 10);
  const st = stat('Six months later', 'Round 2', 540, 460, { size: 84, parent: S18, tone: 'gold' }); pop(st, C('six'));
}

/* ============ S19 — "This time, the buyer went to the police. Lustig escaped." ============ */
const S19 = stageSet(); sceneSwap(S18, S19, C('this time') - 0.15, 'whip');
{
  S0(floor(FL, { parent: S19 }));
  const fl = document.createElement('div'); fl.style.cssText = 'width:1080px;height:1920px;background:linear-gradient(90deg, rgba(229,72,77,.22), rgba(60,110,255,.22))';
  const lights = place(fl, 540, 960, { parent: S19, z: 0, glow: false }); on((t) => { lights.style.opacity = t < C('police', 0, C('this time')) ? 0 : (0.55 + 0.45 * Math.sin(t * 9)).toFixed(3); });
  [[620, 0], [800, 1]].forEach(([x, i]) => { const c = person(x, FL, { size: 0.78, police: true, parent: S19 }); S0(c); c.pose(C('police', 0, C('this time')) + i * 0.1, 'point', 0.2); });
  const l = person(240, FL, { size: 0.8, parent: S19, ...LUSTIG }); S0(l);
  tw(l, C('escaped') - 0.1, 0.6, { x: [0, -420] }, 'in'); tw(l, C('escaped') + 0.25, 0.3, { opacity: [1, 0] });
  const h = titleCard('He _escaped._', { parent: S19, y: 430, size: 100 }); pop(h, C('escaped'));
}

/* ============ S20 — "Years later, he ended up in Alcatraz." ============ */
const S20 = stageSet(); sceneSwap(S19, S20, C('years') - 0.35, 'zoom');
{
  S0(nightSky({ parent: S20, moonX: 220, moonY: 600 })); S0(alcatraz({ parent: S20 }));
  const b = bars({ parent: S20 }); b.slam(C('alcatraz') + 0.1);
  const h = titleCard('Alcatraz.', { parent: S20, y: 430, kicker: 'Years later', size: 100 }); h.classList.add('plate'); pop(h, C('alcatraz'));
}

/* ============ S21 — "He didn't win by hiding a secret. He won by confessing a smaller one." ============ */
const S21 = stageSet(); sceneSwap(S20, S21, C('didnt win') - 0.15, 'push');
{
  S0(floor(1430, { parent: S21 }));
  const sp = spotlight(540, 560, { width: 440, height: 900, parent: S21 }); S0(sp);
  const l = person(540, 1430, { size: 1.15, parent: S21, ...LUSTIG }); S0(l); l.pose(-1, 'cross', 0.01).pose(C('confessing') - 0.1, 'give', 0.3);
  tw(S21, C('didnt win'), END - C('didnt win'), { scale: [1, 1.06] }, 'linear');
  const t1 = titleCard('He didn’t hide<br>a *secret.*', { parent: S21, y: 450, size: 84 }); pop(t1, C('secret', 0, C('didnt win')) - 0.3); out(t1, C('won', 0, C('secret', 0, C('didnt win'))) - 0.3, 0.2);
  const t2 = titleCard('He confessed<br>a *smaller one.*', { parent: S21, y: 450, kicker: 'The trick', size: 84 }); pop(t2, C('won', 0, C('secret', 0, C('didnt win'))) - 0.1);
  const q = pill('Would you have paid?', 540, 690, { size: 'md', parent: S21 }); q.style.fontSize = '32px'; pop(q, VO + 0.5);
}

/* ================= SOUND DESIGN — natural (real recordings) ================= */
{
  const R = (n, t, v, d = 0) => sfx('real/' + n, t, v, d);
  R('city-night', 0, 0.18, C('name') - 0.3); R('crickets-night', 0, 0.08, C('name') - 0.3);
  R('heartbeat-single', C('again') + 0.05, 0.35, 1);
  R('paper-shuffle', C('newspaper') - 0.4, 0.25, 0.8); R('city-traffic', C('name') - 0.4, 0.12, C('saw') - C('name'));
  R('clock-tick', C('saw') - 0.4, 0.2, C('forged') - C('saw'));
  R('pencil-write', C('forged'), 0.3, 1.2); R('pen-click', C('papers') + 0.2, 0.3, 0.4);
  R('restaurant-chatter', C('booked') - 0.3, 0.12, C('quiet') - C('booked')); R('door-open', C('booked') - 0.1, 0.25, 0.8);
  R('clock-tick', C('city'), 0.16, C('quiet') - C('city'));
  R('market-walla', C('riot') - 0.2, 0.3, C('one dealer') - C('riot') + 0.2);
  R('heartbeat', C('one dealer'), 0.2, C('wife') - C('one dealer'));
  R('clock-tick', C('wife') - 0.3, 0.18, C('genius') - C('wife'));
  R('heartbeat-single', C('confessed'), 0.45, 1.2);
  R('restaurant-chatter', C('admitted') - 0.3, 0.1, C('relaxed') - C('admitted'));
  R('coins-handle', C('paid'), 0.25, 1.2);
  R('city-night', C('left') - 0.3, 0.14, C('victim', -0.35) - C('left') + 0.3); R('car-arrive', C('suitcase') - 0.3, 0.2, 1.8);
  R('clock-tick', C('victim', -0.35), 0.2, C('six') - C('victim', -0.35));
  R('footsteps-concrete', C('came', 0, C('six')) - 0.3, 0.3, 1.2);
  R('market-walla', C('this time'), 0.15, C('years') - C('this time')); R('footsteps-concrete', C('escaped') - 0.1, 0.35, 1);
  R('rain-ambience', C('years') - 0.3, 0.2, C('didnt win') - C('years') + 0.3);
  R('clock-tick', C('didnt win'), 0.14, END - C('didnt win')); R('piano-chord', C('smaller') - 0.1, 0.2, 3); R('notify-bubble', VO + 0.5, 0.3, 0.8);
}
