/* How to become rich at 18 — glow explainer scenes.
 * Every beat is keyed to a spoken word with cue(); numbers are never used as cues
 * because the aligner may write them as digits.
 */
const cam = document.getElementById('cam');
const FL = 1380;                 // floor y
const END = window.DURATION;
const usd = (v) => '$' + Math.round(v).toLocaleString('en-US');

const fl = floor(FL, { parent: cam }); show(fl, 0, END - 1.2, 0.4);

/* 1 — "Most people think you need money to get rich," */
{
  const t = 0.0;
  const crowd = [200, 340, 740, 880].map((x, i) => {
    const f = figure(x, FL, { dim: true, size: 0.8, parent: cam });
    tw(f, t + 0.05 * i, 0.4, { opacity: [0, 1], y: [40, 0] });
    return f;
  });
  const lbl = pill('Most people think', 540, 420, { parent: cam }); pop(lbl, t + 0.1);
  const h = headline('<span class="gx-small">The rule</span>MONEY → RICH', 540, 640, { size: 84, boxed: true, parent: cam });
  pop(h, cue('money') - 0.1);
  const x = icon('cross', 540, 900, { size: 150, parent: cam });
  pop(x, cue('but'));
  out([lbl, h, x], cue('eighteen', -0.1, cue('but')));
  // crowd steps back and dims as the hero appears
  crowd.forEach((f) => tw(f, cue('but') + 0.2, 0.5, { opacity: [1, 0.35] }, 'inOut'));
  crowd.forEach((f) => out(f, cue('imagine') - 0.3));
}

/* 2 — "but at eighteen you already have the one thing money can't buy back. Time." */
{
  const s = cue('but');
  const hero = figure(540, FL, { parent: cam }); pop(hero, s + 0.15);
  const age = stat('Age', '0', 540, 640, { size: 150, parent: cam });
  const e18 = cue('eighteen', 0.1, s);
  pop(age, e18);
  count(age.querySelector('.gx-stat-val'), e18, 0.9, 0, 18);
  const lbl = pill("Money can't buy it back", 540, 420, { parent: cam }); pop(lbl, cue('buy back') - 0.3);
  const tm = cue('time', 0, cue('buy back'));
  tw(age, tm - 0.25, 0.25, { opacity: [1, 0], scale: [1, 0.8] }, 'in');
  const clk = icon('clock', 540, 700, { size: 300, parent: cam });
  pop(clk, tm - 0.1);
  const hand = clk.querySelector('.gx-hand');
  on((t) => hand.setAttribute('transform', `rotate(${Math.max(0, t - tm) * 220} 100 100)`));
  const tp = pill('Time', 540, 920, { size: 'md', parent: cam }); pop(tp, tm);
  tw(cam, tm, 1.0, { scale: [1, 1.08] }, 'inOut');
  out([lbl, clk, tp], cue('imagine') - 0.3);
  tw(hero, cue('imagine') - 0.1, 0.6, { x: [0, 180] }, 'inOut');   // hero becomes the saver (right)
  window.HERO = hero;
}

/* 3 — "Imagine two eighteen year olds who both get their first job." */
const LX = 360, RX = 720;
{
  const s = cue('imagine');
  tw(cam, s - 0.1, 0.8, { scale: [1.08, 1] }, 'inOut');
  const other = figure(LX, FL, { parent: cam });
  tw(other, s + 0.1, 0.6, { opacity: [0, 1], x: [-180, 0] }, 'out');
  window.OTHER = other;
  const job = pill('First job', 540, 420, { parent: cam }); pop(job, cue('first job'));
  // a coin drops onto each of them
  [LX, RX].forEach((x, i) => {
    const c = icon('coin', x, 560, { size: 90, parent: cam });
    pop(c, cue('first job') + 0.15 + i * 0.12);
    tw(c, cue('first job') + 0.5 + i * 0.12, 0.5, { y: [0, 420], opacity: [1, 0] }, 'in');
  });
  out(job, cue('spends') - 0.3);
}

/* 4 — "The first one spends every paycheck, because he figures he'll start saving once he earns more." */
{
  const s = cue('spends');
  const lp = pill('Spender', LX, 1060, { parent: cam }); pop(lp, s - 0.1);
  const w = icon('wallet', LX, 600, { size: 200, parent: cam }); pop(w, s);
  const st = stat('Saved', '$0', LX, 800, { size: 80, parent: cam }); pop(st, s + 0.2);
  // coins fly out of the wallet, one per beat
  for (let i = 0; i < 5; i++) {
    const c = icon('coin', LX, 600, { size: 60, parent: cam });
    const t0 = s + 0.3 + i * 0.35;
    tw(c, t0, 0.1, { opacity: [0, 1] });
    arc(c, t0, 0.8, -260 + i * 25, 500, 160 + i * 20);
    tw(c, t0 + 0.6, 0.2, { opacity: [1, 0] });
  }
  const later = pill('Save later', LX, 430, { parent: cam }); pop(later, cue('saving') - 0.1);
  tw(w, cue('earns more'), 0.5, { rotate: [0, -10] }, 'elastic');
  window.SPENDER = [lp, w, st, later];
}

/* 5 — "The second one puts away just two hundred dollars a month, and never touches it." */
{
  const s = cue('second one');
  const rp = pill('Saver', RX, 1060, { parent: cam }); pop(rp, s);
  const box = card(RX, 620, 260, 220, { title: 'Invested', body: '<div style="text-align:center;font-size:56px" class="inv">$0</div>', parent: cam });
  pop(box, cue('puts away'));
  const per = stat('Per month', '$200', RX, 840, { size: 64, parent: cam }); pop(per, cue('month') - 0.1);
  for (let i = 0; i < 4; i++) {
    const c = icon('coin', RX, 380, { size: 60, parent: cam });
    const t0 = cue('puts away') + 0.3 + i * 0.4;
    tw(c, t0, 0.15, { opacity: [0, 1] });
    tw(c, t0, 0.45, { y: [0, 230] }, 'in');
    tw(c, t0 + 0.4, 0.1, { opacity: [1, 0] });
  }
  count(box.querySelector('.inv'), cue('puts away') + 0.3, 1.8, 0, 800, usd);
  const lock = pill('Never touched', RX, 430, { parent: cam }); pop(lock, cue('touches'));
  const by = cue('by', 0, cue('touches'));
  out([rp, box, per, lock, ...window.SPENDER], by - 0.3);
  tw(window.OTHER, by - 0.3, 0.4, { opacity: [1, 0.35] }, 'inOut');
}

/* 6 — "By forty, he has put in fifty thousand dollars, but his account says a hundred and forty
 *      thousand, because his money has been earning money for twenty two years." */
{
  const s = cue('by', 0, cue('touches'));
  tw(cam, s, 1.2, { scale: [1, 0.88], y: [0, 120] }, 'inOut');
  const age = stat('Age', '18', 540, 330, { size: 110, parent: cam }); pop(age, s);
  count(age.querySelector('.gx-stat-val'), s, 0.9, 18, 40);
  const ch = chart(150, 860, 780, 420, { curve: 'exp', label: 'Years', parent: cam });
  tw(ch, s + 0.2, 0.3, { opacity: [0, 1] });
  tw(ch.querySelector('.gx-axis'), s + 0.2, 0.5, { draw: [0, 1] }, 'out');
  tw(ch.querySelector('.gx-curve'), cue('put in'), cueEnd('earning money', 2.0) - cue('put in'), { draw: [0, 1] }, 'inOut');
  const pin = stat('Put in', '$0', 330, 560, { size: 74, parent: cam });
  pop(pin, cue('put in'));
  count(pin.querySelector('.gx-stat-val'), cue('put in'), 1.0, 0, 52800, usd);
  const acc = stat('Account', '$0', 750, 560, { size: 74, parent: cam });
  pop(acc, cue('account'));
  count(acc.querySelector('.gx-stat-val'), cue('account'), 1.6, 0, 143000, usd);
  tw(acc, cue('account') + 1.6, 0.5, { scale: [1, 1.12] }, 'elastic');
  const rate = pill('≈ 8% a year', 750, 680, { invert: false, parent: cam }); pop(rate, cue('account') + 0.6);
  const yrs = pill('Money earning money', 540, 1500, { parent: cam }); pop(yrs, cue('earning money'));
  window.S6 = [age, ch, pin, acc, rate, yrs];
  out(window.S6, cue('finally') - 0.3);
  tw(cam, cue('finally') - 0.3, 0.8, { scale: [0.88, 1], y: [120, 0] }, 'inOut');
}

/* 7 — "The first one finally starts at thirty. He saves twice as much, and still ends up with half." */
{
  const s = cue('finally');
  tw(window.OTHER, s, 0.4, { opacity: [0.35, 1] }, 'out');
  tw(window.OTHER, s, 0.5, { y: [0, -40] }, 'back');
  tw(window.OTHER, s + 0.5, 0.3, { y: [-40, 0] }, 'in');
  const c = card(540, 660, 820, 380, {
    title: 'At forty',
    body: `<div class="gx-row"><span>START AT 18</span><span class="a">$0</span></div>
           <div class="gx-row"><span>START AT 30</span><span class="b">$0</span></div>
           <div class="gx-row" style="font-size:28px;opacity:.7"><span>SAVING</span><span class="m">$200 / MO</span></div>`,
    parent: cam,
  });
  pop(c, s + 0.2);
  count(c.querySelector('.a'), s + 0.3, 1.0, 0, 143000, usd);
  const tw2 = cue('twice');
  on((t) => { c.querySelector('.m').textContent = t >= tw2 ? '$200 VS $400 / MO' : '$200 / MO'; });
  count(c.querySelector('.b'), tw2, 1.2, 0, 73000, usd);
  const half = pill('Half', 540, 940, { size: 'md', parent: cam }); pop(half, cue('half', 0, tw2));
  out([c, half], cue('saving is') - 0.3);
}

/* 8 — "But saving is only half of it." */
{
  const s = cue('saving is');
  const h = headline('<span class="gx-small">Saving</span>ONLY HALF', 540, 640, { size: 96, boxed: true, parent: cam });
  pop(h, s);
  out(h, cue('afford') - 0.3);
  out(window.OTHER, cue('afford') - 0.3);
  tw(window.HERO, cue('afford') - 0.3, 0.6, { x: [180, 0] }, 'inOut');   // hero back to centre
}

/* 9 — "At eighteen you can afford to be bad at things, so the second one spends his free time
 *      learning a skill people actually pay for." */
{
  const s = cue('afford');
  const bad = pill('Bad at things = OK', 540, 420, { parent: cam }); pop(bad, cue('bad'));
  const x1 = icon('cross', 400, 640, { size: 120, parent: cam });
  const x2 = icon('cross', 680, 640, { size: 120, parent: cam });
  pop(x1, cue('bad') + 0.1); pop(x2, cue('bad') + 0.3);
  out([x1, x2], cue('free time') - 0.2);
  const book = icon('book', 540, 660, { size: 230, parent: cam }); pop(book, cue('free time'));
  const lvl = stat('Skill level', '1', 540, 900, { size: 100, parent: cam });
  pop(lvl, cue('learning'));
  count(lvl.querySelector('.gx-stat-val'), cue('learning'), 1.6, 1, 10);
  const pay = pill('People pay for it', 540, 1050, { parent: cam }); pop(pay, cue('pay for'));
  out([bad, book, lvl, pay], cue('income') - 0.3);
}

/* 10 — "His income goes up every year, and every raise goes into something he owns." */
{
  const s = cue('income');
  const inc = stat('Income', '$30,000', 540, 470, { size: 104, parent: cam }); pop(inc, s);
  count(inc.querySelector('.gx-stat-val'), s + 0.2, 1.6, 30000, 85000, usd);
  const up = icon('arrowUp', 820, 470, { size: 110, parent: cam }); pop(up, cue('goes up'));
  const house = icon('house', 540, 820, { size: 230, parent: cam }); pop(house, cue('owns') - 0.2);
  for (let i = 0; i < 4; i++) {
    const c = icon('coin', 540, 560, { size: 56, parent: cam });
    const t0 = cue('raise') + i * 0.3;
    tw(c, t0, 0.1, { opacity: [0, 1] });
    tw(c, t0, 0.5, { y: [0, 240] }, 'in');
    tw(c, t0 + 0.45, 0.1, { opacity: [1, 0] });
  }
  const own = pill('Owns', 540, 990, { parent: cam }); pop(own, cue('owns'));
  out([inc, up, house, own], cue('whole trick') - 0.35);
}

/* 11 — "That's the whole trick." */
{
  const s = cue('whole trick');
  tw(cam, s - 0.2, 0.9, { scale: [1, 1.12] }, 'inOut');
  const p = pill('The whole trick', 540, 700, { size: 'md', parent: cam }); pop(p, s);
  const spot = spotlight(540, -100, { parent: cam }); show(spot, s - 0.1, cue('broke people') - 0.1, 0.4);
  out(p, cue('broke people') - 0.3);
  tw(cam, cue('broke people') - 0.3, 0.8, { scale: [1.12, 1] }, 'inOut');
}

/* 12 — "Broke people earn money and spend it. Rich people earn money and buy things that keep earning." */
{
  const b = cue('broke people'), r = cue('rich people');
  const hb = headline('<span class="gx-small">Broke</span>EARN → SPEND', 540, 520, { size: 72, boxed: true, parent: cam });
  pop(hb, b);
  tw(hb, r - 0.1, 0.4, { opacity: [1, 0.35], y: [0, -40] }, 'inOut');
  const hr = headline('<span class="gx-small">Rich</span>EARN → OWN → EARN', 540, 780, { size: 72, boxed: true, parent: cam });
  pop(hr, r);
  tw(hr, cue('keep earning'), 0.6, { scale: [1, 1.08] }, 'elastic');
  out([hb, hr], cue('earlier') - 0.3);
}

/* 13 — "So the earlier you start owning instead of spending, the less you'll ever need to earn." */
{
  const s = cue('earlier');
  const ch = chart(150, 780, 780, 460, { curve: 'exp', label: 'Start early', parent: cam });
  tw(ch, s, 0.3, { opacity: [0, 1] });
  tw(ch.querySelector('.gx-axis'), s, 0.4, { draw: [0, 1] });
  tw(ch.querySelector('.gx-curve'), s + 0.2, 2.6, { draw: [0, 1] }, 'inOut');
  const rk = icon('rocket', 220, 1080, { size: 110, parent: cam });
  // rocket rides the curve: sample the same exp shape the chart uses
  on((t) => {
    const p = Math.max(0, Math.min(1, (t - s - 0.2) / 2.6));
    const e = EASE.inOut(p);
    const x = 150 + e * 780, y = 780 + 230 - Math.pow(e, 3.2) * 460 * 0.92;
    rk.style.left = x + 'px'; rk.style.top = y + 'px';
  });
  pop(rk, s + 0.2);
  const own = pill('Own instead of spend', 540, 420, { parent: cam }); pop(own, cue('owning'));
  const less = stat('Need to earn', '100%', 540, 560, { size: 90, parent: cam }); pop(less, cue('less'));
  count(less.querySelector('.gx-stat-val'), cue('less'), 1.2, 100, 40, (v) => Math.round(v) + '%');
  window.LAST = [ch, rk, own, less, window.HERO];
}

/* end card */
{
  const t = END - 1.4;
  out(window.LAST, t, 0.5);
  const e = headline('<span class="gx-small">Start at</span>18', 540, 900, { size: 180, parent: cam });
  pop(e, t + 0.3);
}
