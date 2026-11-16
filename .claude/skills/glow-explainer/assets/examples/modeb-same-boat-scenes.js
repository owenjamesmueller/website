/* MODE B — "Same boat" (15.2 s, wordless; music added in-app).
 * Stakes from frame 0: a leaking boat in a storm. Escalation: friends punch new holes (CAR LOAN,
 * NEW PHONE, BNPL) and mock the hero while he hammers a raft together. Climax: lightning, a wave, the
 * boat capsizes. Payoff: he rides into a gold sunbeam — and throws them a rope. Quote card.
 */
window.WORDS = []; window.DURATION = 15.2;
const cam = document.getElementById('cam'); drift(cam, 4);
document.getElementById('dots').style.opacity = 0;
const ramp = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));
const T = { h1: -0.35, h2: 3.1, h3: 4.9, storm: 5.4, bolt1: 6.3, line: 7.7, bolt2: 8.2, jump: 8.7, sink: 9.3, gold: 10.5, rope: 11.5, end: 12.6 };
const storm = (t) => 0.35 + 0.65 * ramp(t, T.storm, 8) - 0.85 * ramp(t, T.gold - 0.2, T.gold + 1.2);

sky({ storm, goldAt: T.gold });
const W = sea({ y: 1330, storm });
rain({ storm: (t) => Math.max(0, storm(t) * 1.1 - 0.1) });

// ---------- the boat and the crowd in it ----------
const sinkDy = (t) => ramp(t, T.sink, T.sink + 1.7) ** 1.6 * 760;
const draft = (t) => 30 * ramp(t, T.h1, T.h1 + 1) + 30 * ramp(t, T.h2, T.h2 + 1) + 35 * ramp(t, T.h3, T.h3 + 1) + sinkDy(t);
const tilt = (t) => -4 * ramp(t, T.h2, T.h3 + 1) - 34 * ramp(t, T.sink, T.sink + 1.4);
const B = boat({ x: 375, w: 650, sea: W, draft, tilt });
const FEET = B.gun + 85, FX = [100, 225, 350, 475], SZ = 1.22;
const F = FX.map((px) => { const s = stick(px, FEET, { color: '#9a9ca6', parent: B, size: SZ }); s.style.opacity = 1; return s; });

// friends 1 & 3 bail water the whole time (arms pump, water flung overboard)
[0, 2].forEach((k) => {
  for (let t = 0.1 + k * 0.2; t < T.sink; t += 0.9) {
    F[k].pose(t, 'pull', 0.18).pose(t + 0.45, 'reach', 0.18);
    const from = B.toScreen(FX[k] - 30, FEET - 280, t + 0.45);
    for (let i = 0; i < 4; i++) {
      const d = document.createElement('div'); d.className = 'gx-bubble-air'; d.style.width = d.style.height = 12 + i * 3 + 'px'; d.style.background = '#bfe3f5';
      const el = place(d, from.x, from.y, { z: 24, glow: false });
      tw(el, t + 0.45, 0.05, { opacity: [0, 0.9] }); arc(el, t + 0.45, 0.7, -140 - i * 40, 260, 120 + i * 30); tw(el, t + 1.05, 0.1, { opacity: [0.9, 0] });
    }
    sfx('foley-bail', t + 0.45, 0.16);
  }
});
// friends 2 & 4 keep buying things: each purchase punches a new hole
const holes = [[175, 'CAR LOAN', T.h1, 3, 'NEW CAR!'], [370, 'NEW PHONE', T.h2, 1, 'NEW PHONE!'], [540, 'BNPL', T.h3, 3, 'ONLY $40 A MONTH.']];
holes.forEach(([px, label, t0, who, say], i) => {
  F[who].pose(t0 - 0.3, 'cheer', 0.01).pose(t0 + 0.9, 'stand', 0.3);
  const h = B.hole(px, label, t0);
  h.sign.style.top = B.gun - 45 + 'px'; h.sign.style.zIndex = 14; fade(h.sign, T.sink + 0.2, 1, 0, 0.3);
  const b = monoBubble(say, FX[who], FEET - 300, { parent: B }); pop(b, t0 - 0.2, 0.25); out(b, t0 + 0.75, 0.15);
  sfx('foley-boom', t0, 0.35); sfx('foley-leak', t0 + 0.05, 0.35); sfx('foley-creak', t0 + 0.3, 0.35);
});
// the mockery aimed at the hero while he builds
[[1, 'RELAX, WE\u2019RE FINE.', 2.2], [0, 'YOU\u2019RE WASTING YOUR WEEKEND.', 3.75], [2, 'JUST ENJOY THE RIDE.', 5.75]].forEach(([who, txt, t0]) => {
  F[who].pose(t0, 'point', 0.2).pose(t0 + 1.0, 'stand', 0.2);
  const b = monoBubble(txt, 330, FEET - 360, { parent: B }); pop(b, t0, 0.25); out(b, t0 + 0.95, 0.15);
  sfx('mention-pop', t0, 0.18);
});

// ---------- the hero: hammers a raft together beside the boat ----------
const HX = 590;
const heroA = stick(HX, FEET, { parent: B, accent: '#f5c542', size: SZ }); heroA.style.opacity = 1;
const R = raft(890, W, { w: 240 });
const HAMMER_UP = { aL: [-12, 0], aR: [150, 30], lL: [-6, 0], lR: [6, 0], lean: 14 }, HAMMER_DN = { aL: [-12, 0], aR: [70, 40], lL: [-6, 0], lR: [6, 0], lean: 24 };
[3.7, 4.5, 5.3, 6.1, 6.9].forEach((t0, i) => {
  heroA.pose(t0 - 0.22, HAMMER_UP, 0.15).pose(t0 - 0.05, HAMMER_DN, 0.05);
  R.addPlank(i, t0);
  sfx('foley-hammer', t0, 0.5); sfx('foley-splash-small', t0 + 0.05, 0.18);
});
R.mast(7.25); sfx('foley-whoosh', 7.2, 0.25);
heroA.pose(7.4, 'stand', 0.2);
const line = monoBubble('I\u2019M NOT SINKING WITH YOU.', 380, FEET - 360, { parent: B }); pop(line, T.line, 0.25); out(line, T.jump, 0.15);
sfx('foley-heartbeat', T.line - 0.15, 0.5);

// the jump: heroA (in the boat) hands over to heroB (on screen) at the same spot
const heroB = stick(0, 0, { accent: '#f5c542', z: 21, size: SZ });
tw(heroA, T.jump, 0.01, { opacity: [1, 0] }); tw(heroB, T.jump, 0.01, { opacity: [0, 1] });
heroB.pose(T.jump, 'reach', 0.15).pose(T.jump + 0.6, 'stand', 0.2).pose(T.gold + 0.2, 'cheer', 0.3).pose(T.rope, 'point', 0.25);
on((t) => {
  if (t < T.jump) return;
  const a = B.toScreen(HX, FEET, T.jump), d = R.deck(t), p = Math.min(1, (t - T.jump) / 0.6);
  const x = a.x + (d.x - a.x) * p, y = a.y + (d.y - a.y) * p - Math.sin(Math.PI * p) * 220;
  heroB.style.left = x + 'px'; heroB.style.top = y + 'px';
});
sfx('foley-whoosh', T.jump, 0.4); sfx('foley-splash-small', T.jump + 0.6, 0.4);

// ---------- climax: lightning, the wave, the boat goes under ----------
lightning(T.bolt1, 260); lightning(T.bolt2, 720);
sfx('foley-thunder', T.bolt1, 0.75); sfx('foley-thunder', T.bolt2, 0.85);
tw('#stage', T.bolt2, 0.25, { scale: [1.05, 1] }, 'out');
sfx('foley-wave-crash', T.sink - 0.6, 0.7); sfx('foley-boom', T.sink + 0.1, 0.5); sfx('foley-creak', T.sink, 0.5);
bubbles(380, 1560, T.sink + 0.6, T.sink + 2.2, { rise: 260 }); sfx('foley-bubbles', T.sink + 0.6, 0.4);
// the friends surface, reaching up
const swim = [150, 290, 430, 580].map((x, i) => {
  const s = stick(x, 0, { color: '#9a9ca6', z: 26, size: 1.1 }); s.pose(0, 'reach', 0.01);
  on((t) => { s.style.left = x + 'px'; s.style.top = (W.y(x, t) + 165 + Math.sin(t * 3 + i) * 10) + 'px'; });
  tw(s, T.sink + 1.0 + i * 0.12, 0.2, { opacity: [0, 1] });
  return s;
});
sfx('foley-splash-big', T.sink + 1.0, 0.45);

// ---------- payoff: gold light, he throws them a rope ----------
sunbeam(890, T.gold); const gh = halo(890, 1060, { r: 300 }); gh.dataset.glowColor = '245,197,66'; show(gh, T.gold, null, 1.0);
sfx('foley-pad-hope', T.gold - 0.3, 0.55); sfx('foley-sea-bed', T.gold, 0.25);
chain((t) => { const d = R.deck(t); return { x: d.x - 60, y: d.y - 150 }; }, (t) => ({ x: 580, y: W.y(580, t) - 75 }), { t0: T.rope + 0.15, t1: 99, z: 27 });
swim[3].pose(T.rope + 0.3, 'pull', 0.25);
sfx('foley-rope', T.rope, 0.5);

// ---------- headline + quote card ----------
const h1 = monoHead('WE\u2019RE ALL IN THE SAME BOAT.', -1.4, { y: 330 });

const black = document.createElement('div'); black.style.cssText = 'width:1080px;height:1920px;background:#050505';
place(black, 540, 960, { glow: false, z: 44 }); tw(black, T.end, 0.6, { opacity: [0, 0.93] });
out(h1, T.end, 0.3);
quoteCard(['BUILD YOUR RAFT', 'BEFORE THE STORM.'], null, T.end + 0.4, { accentLine: 1 });
sfx('foley-whoosh-long', T.end, 0.3); sfx('foley-boom', T.end + 0.4, 0.25);

// ---------- ambience beds ----------
sfx('foley-sea-bed', 0, 0.45); sfx('foley-storm-bed', 0, 0.3); sfx('foley-storm-bed', T.storm, 0.35); sfx('foley-pad-dark', T.storm, 0.3);
sfx('foley-creak', 0.4, 0.3);
