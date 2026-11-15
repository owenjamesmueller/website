/* Example scenes.js — opening beats of a "smartest person is broke" explainer.
 * Pattern: one scene = one sentence of narration. Each beat is keyed to a
 * spoken word with cue(), so re-recording the voice re-times everything.
 * Copy this to <project>/scenes.js and rewrite per video.
 */
const cam = document.getElementById('cam');
const FLOOR_Y = 1380;

/* ---------- SCENE 1: "The smartest person you know is probably broke" ---------- */
{
  const s = cue('smartest'), e = cue('and the reason');
  const fl = floor(FLOOR_Y, { parent: cam });       show(fl, 0, null, 0.4);
  const hero = figure(540, FLOOR_Y, { variant: 'cap', parent: cam });
  pop(hero, 0.05);

  // brain + IQ counter rises above the hero
  const brain = icon('brain', 360, 640, { size: 230, parent: cam });
  const lbl1 = pill('Smartest', 360, 470, { parent: cam });
  const iq = stat('IQ', '100', 360, 840, { size: 96, parent: cam });
  pop(brain, s); pop(lbl1, s + 0.1); pop(iq, s + 0.15);
  count(iq.querySelector('.gx-stat-val'), s + 0.15, 1.0, 100, 160);

  // wallet + $0 on "broke"
  const b = cue('broke');
  const wallet = icon('wallet', 720, 640, { size: 230, parent: cam });
  const lbl2 = pill('Broke', 720, 470, { parent: cam });
  const zero = stat('Balance', '$0', 720, 840, { size: 96, parent: cam });
  pop(wallet, b - 0.1); pop(lbl2, b); pop(zero, b + 0.05);
  tw(wallet, b + 0.35, 0.5, { rotate: [0, -8] }, 'elastic');

  // "the reason why" -> question bubble over the hero
  const q = icon('question', 540, 1060, { size: 120, parent: cam });
  pop(q, cue('reason'));
  const top = pill('Explains everything about money', 540, 330, { parent: cam });
  pop(top, cue('everything'));

  // clear the scene before the next sentence
  const out = cue('think') - 0.25;
  for (const el of [brain, lbl1, iq, wallet, lbl2, zero, q, top]) tw(el, out, 0.3, { opacity: [1, 0], y: [0, -30] }, 'in');
}

/* ---------- SCENE 2: "Think about the smartest kid from your school" ---------- */
{
  const s = cue('think');
  // camera pulls back to reveal a classroom of dim figures
  tw(cam, s, 1.2, { scale: [1, 0.8], y: [0, -60] }, 'inOut');
  const kids = [];
  const cols = [180, 360, 720, 900];
  cols.forEach((x, i) => {
    const k = figure(x, FLOOR_Y, { dim: true, size: 0.85, parent: cam });
    kids.push(k);
    tw(k, s + 0.1 + i * 0.06, 0.4, { opacity: [0, 1], y: [40, 0] }, 'out');
  });
  const spot = spotlight(540, -100, { parent: cam });
  show(spot, cue('smartest', 0, s), null, 0.5);
  const tag = pill('The smartest kid', 540, 980, { parent: cam });
  const star = icon('star', 540, 1060, { size: 70, parent: cam });
  pop(tag, cue('kid')); pop(star, cue('kid') + 0.1);
  const board = card(540, 520, 760, 220, { body: '<div class="gx-row"><span>A² + B² = C²</span></div>', parent: cam });
  pop(board, cue('school') - 0.1);
}
