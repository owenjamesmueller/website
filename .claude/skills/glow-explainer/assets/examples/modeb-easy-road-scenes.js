/* MODE B example — "The easy road" (14.5 s, wordless, music added in-app).
 * Hook (frame 0): a crowd already walking + typed headline. Turn: the hero stops at the fork while the
 * crowd taunts him. Payoff: the lonely road lights up lamp by lamp and ends at a glowing house.
 * Close: quote card. One accent colour: gold (light / reward) + a red headband to track the hero.
 */
window.WORDS = []; window.DURATION = 14.5;
const st = document.getElementById('stage');
st.style.background = 'linear-gradient(#0b0d14 0%, #151824 55%, #0d0e12 100%)';
document.getElementById('dots').style.opacity = 0.35;
const cam = document.getElementById('cam'); drift(cam, 3);
const T_FORK = 4.3, T_TURN = 6.6, T_HOUSE = 10.4, T_END = 11.6;

// ---------- world ----------
const FZ = 0.3;
const R = road({ parent: cam, forkZ: FZ, spread: 2300, horizon: 900, width: 640 }); tw(R, -1, 0.1, { opacity: [1, 1] });
const far = (b) => R.at(0.985, b);
function building(b, w, h, cls) {
  const p = far(b), d = document.createElement('div'); d.className = 'gx-bld2 ' + cls;
  d.style.width = w + 'px'; d.style.height = h + 'px';
  let win = ''; for (let r = 0; r < Math.floor(h / 30) - 1; r++) for (let c = 0; c < Math.floor(w / 26) - 1; c++) win += `<i style="left:${14 + c * 26}px;top:${14 + r * 30}px"></i>`;
  d.innerHTML = win;
  const el = place(d, p.x, p.y + 6, { parent: cam, anchor: 'bottom', z: 2, glow: false }); tw(el, -1, 0.1, { opacity: [1, 1] });
  return el;
}
const office = building(-1, 270, 330, 'office');
const house = (() => {
  const p = far(1), d = document.createElement('div'); d.className = 'gx-svg gx-house2';
  d.innerHTML = `<svg width="190" height="170" viewBox="0 0 190 170"><path d="M15 80 L95 15 L175 80 V165 H15 Z" fill="#14161d" stroke="#8a7a52" stroke-width="5"/><rect class="door" x="78" y="105" width="34" height="60" fill="#3a3220"/><rect class="w1" x="34" y="95" width="28" height="26" fill="#3a3220"/><rect class="w2" x="128" y="95" width="28" height="26" fill="#3a3220"/></svg>`;
  const el = place(d, p.x, p.y + 6, { parent: cam, anchor: 'bottom', z: 2, glow: false }); tw(el, -1, 0.1, { opacity: [1, 1] });
  el.dataset.glowColor = '245,197,66';
  return el;
})();
const sL = monoSign('PAYCHECK TO PAYCHECK', Math.max(far(-1).x, 320), far(-1).y - 372, { parent: cam }); tw(sL, -1, 0.1, { opacity: [1, 1] });
const sR = monoSign('FREEDOM', far(1).x, far(1).y - 200, { parent: cam }); tw(sR, -1, 0.1, { opacity: [1, 1] });

// ---------- the crowd (grey, always moving: frame 0 is already alive) ----------
const N = 26;
for (let i = 0; i < N; i++) {
  const lane = (rand(i * 1.7) - 0.5) * 1.5, t0 = -9 + i * 0.62, dur = 10.5 + rand(i) * 1.5;
  const s = stick(540, 1700, { size: 0.95, color: '#8d8f99', parent: cam });
  s.path(t0, t0 + dur, (p) => { const z = p * 0.99, r = R.at(z, z > FZ ? -1 : 0, lane); return { x: r.x, y: r.y, s: r.s, z: r.z }; }, { speed: 8 + rand(i) * 2 });
  tw(s, t0, 0.3, { opacity: [0, 1] }); tw(s, t0 + dur - 0.4, 0.4, { opacity: [1, 0] });   // fade into the office
  if (i === 14 || i === 16 || i === 18) window['TAUNT' + i] = s;
}

// ---------- the hero (white, red headband) ----------
const hero = stick(540, 1700, { size: 0.95, accent: '#e5484d', parent: cam });
show(hero, -1, null, 0.01);
hero.path(-2.2, T_FORK, (p) => { const z = 0.04 + p * (FZ - 0.02 - 0.04), r = R.at(z, 0, 0.15); return { x: r.x, y: r.y, s: r.s, z: r.z + 1 }; });
hero.pose(T_FORK + 0.1, 'stand', 0.2);
hero.path(T_TURN, T_HOUSE, (p) => { const z = (FZ - 0.02) + p * (0.955 - FZ + 0.02), r = R.at(z, z > FZ ? 1 : 0, 0.15); return { x: r.x, y: r.y, s: r.s, z: r.z + 1 }; }, { speed: 7 });
hero.pose(T_HOUSE + 0.1, 'cheer', 0.3);

// ---------- text: typed headline (hook) + taunts ----------
const h1 = monoHead('EVERYONE TOOK THE EASY ROAD.', 0.2, { y: 300 });
const h2 = monoHead('ONE DIDN’T.', T_TURN + 0.2, { y: 355, size: 34 });
h2.style.color = '#f5c542';
const taunts = [['WRONG WAY.', 300, 1020, T_FORK + 0.3], ['EVERYONE GOES LEFT.', 420, 880, T_FORK + 0.9], ['YOU’LL BE ALONE.', 270, 760, T_FORK + 1.5]];
const tb = taunts.map(([t, x, y, at]) => { const b = monoBubble(t, x, y); pop(b, at, 0.3); return b; });
out(tb, T_TURN + 0.6, 0.3);

// ---------- payoff: the empty road lights up as he walks it ----------
const lampZ = [0.42, 0.55, 0.67, 0.79, 0.9];
lampZ.forEach((z, i) => {
  const p = R.at(z, 1, 0.75), d = document.createElement('div'); d.className = 'gx-lamp2';
  d.style.height = 170 * p.s + 'px'; d.style.width = 6 * p.s + 'px';
  const el = place(d, p.x, p.y, { parent: cam, anchor: 'bottom', z: p.z, glow: false }); tw(el, -1, 0.1, { opacity: [0.45, 0.45] });
  const tl = T_TURN + ((z - FZ + 0.02) / (0.955 - FZ + 0.02)) * (T_HOUSE - T_TURN) - 0.15;
  tw(el, tl, 0.25, { opacity: [0.45, 1] });
  el.classList.add('gx-lamp-on-' + i);
  on((t) => el.classList.toggle('lit', t >= tl));
  sfx('success-subtle-ping', tl, 0.18 + i * 0.03);
});
// house lights up gold, office goes dark
on((t) => {
  const on2 = t >= T_HOUSE - 0.2;
  house.querySelectorAll('rect').forEach((r) => r.setAttribute('fill', on2 ? '#f5c542' : '#3a3220'));
  house.classList.toggle('lit', on2);
  office.querySelectorAll('i').forEach((w, k) => { w.style.opacity = t > T_TURN + 1 + rand(k) * 3 ? 0.08 : 0.85; });
});
const gh = halo(far(1).x, far(1).y - 80, { r: 220, parent: cam }); show(gh, T_HOUSE - 0.2, null, 0.4);
tw(cam, T_TURN, T_HOUSE - T_TURN, { scale: [1, 1.07] }, 'inOut');

// ---------- close: quote card ----------
const black = document.createElement('div'); black.style.cssText = 'width:1080px;height:1920px;background:#050505';
place(black, 540, 960, { glow: false, z: 44 }); tw(black, T_END, 0.5, { opacity: [0, 0.94] });
out([h1, h2], T_END, 0.3);
quoteCard(['THE CROWD FEELS SAFE.', 'THAT’S THE TRAP.'], null, T_END + 0.4, { accentLine: 1 });

// ---------- sound (music is added in the Instagram app; these sit under it) ----------
for (let t = 0.2; t < 0.2 + 28 / 22; t += 0.09) sfx('type-key', t, 0.25);
for (let t = T_TURN + 0.2; t < T_TURN + 0.2 + 12 / 22; t += 0.09) sfx('type-key', t, 0.25);
taunts.forEach(([, , , at]) => sfx('mention-pop', at, 0.3));
sfx('click-deep', T_FORK + 0.05, 0.4);
sfx('transition-glide', T_TURN, 0.3);
sfx('success-warm-chime', T_HOUSE - 0.2, 0.45);
sfx('transition-smooth-whoosh', T_END, 0.35);
