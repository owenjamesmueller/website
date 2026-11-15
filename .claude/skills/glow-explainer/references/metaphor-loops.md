# Mode B: wordless metaphor loops (12–16 s)

Studied from the user's references: the underwater chains loop ("YOU'VE CHANGED, BRO" → "WATCH ME" → surfaces,
Seneca quote), the blindfolded crowd walking off a cliff ("DON'T FOLLOW BLINDLY."), the crowd splitting into
private/government school → jobs, luxury-first vs assets-first, "5 minutes", "what a week feels like",
and income vs expenses.

## Lessons from a rejected draft (don't repeat these)
A first demo ("the easy road": a crowd walking a forked road) was rejected as boring, with bad SFX and bland animation.
- **No stakes.** Walking is not a problem. Something must be going WRONG from frame 0: water rising, a fall,
  chains, drowning. The viewer stays to see if he survives.
- **No physical action.** Sliding figures along paths reads as lazy. Every second someone must be *doing*
  something: bailing, hammering, pulling, punching a hole, jumping, cheering, pointing.
- **Too small and far away.** Put the characters close (stick size ≈ 1.2), filling the width, so the acting reads on a phone.
- **UI blips are not sound design.** Use the foley set (`foley-*`): an ambience bed for the whole loop plus physical
  sounds on every action. Never use UI dings and pops in mode B, except a soft pop for speech bubbles.
- **A climax with a hit**: lightning + thunder + a punch-in, then the capsize/fall/snap, then silence and light.
- **An emotional beat after the win**: the hero helps the people who mocked him (throws the rope). That's what gets shared.

## What makes them work
- **No narration. The picture IS the story.** One metaphor, acted out by stick figures, readable with the sound off.
- **A crowd and one hero.** The crowd is grey (sometimes blindfolded or chained). The hero is white with ONE accent
  colour (a red headband or blindfold, gold light) so the eye tracks him through dozens of figures.
- **A real environment**, not a blank stage: a forked road seen in perspective with buildings at the ends; underwater
  with light rays, bubbles and seaweed; a cliff edge; a city at night; rooms. Depth comes from perspective scale, a ground
  plane and reflections.
- **Small monospace text only.** A typed headline at the top ("DON'T FOLLOW BLINDLY."), boxed signs on places
  ("PRIVATE SCHOOL", "PAYCHECK TO PAYCHECK"), and taunt bubbles from the crowd ("WHO DO YOU THINK YOU ARE?",
  "AIR IS OVERRATED.", "WRONG WAY."). The hero answers once ("WATCH ME.").
- **Arc in 14 s**: the hook is already moving at frame 0 → pressure escalates (more chains, more taunts) → the turn
  (the hero breaks free or takes the other road) → the payoff (light, gold, the surface, the house) → a quote card
  (2–4 short lines, one in the accent colour, an optional author). Then the handle.
- **Music is added in the app.** The song names visible in the references come from Instagram's music picker.
  Export with only quiet SFX (typing for the headline, pops for taunts, a chime for the payoff).
  Trending audio helps distribution.

## Toolkit (`assets/loops.js`)
| function | use |
|---|---|
| `stick(x, y, {size, color, accent, blindfold})` | stick figure, anchor = feet. Grey `#8d8f99` crowd, white hero, `accent:'#e5484d'` |
| `.walk(t0, t1, {dx, dy})` / `.path(t0, t1, p => ({x, y, s, z}))` | walk cycle; move along any path (perspective, falls, swimming up) |
| `.pose(t, name)` | stand, cheer, pull, reach, swim, fall, point, sit, blind (arms forward) |
| `road({forkZ, spread, horizon, width})` → `R.at(z, branch, lane)` | perspective road with a Y fork; z 0 = near, 1 = far; branch −1/0/+1 |
| `ocean({surfaceY})`, `bubbles(x, y, t0, t1)`, `chain(a(t), b(t))`, `seaweed(x, y)` | underwater scenes; chains link moving points (hero ↔ friends) |
| `cliff(edgeX, y)` | cliff edge for fall metaphors |
| `sky({storm, goldAt})`, `sea({y, storm})`, `rain({storm})`, `lightning(t, x)`, `sunbeam(x, t0)` | storm kit, all driven by one `storm(t)` curve (0 calm, 1 full storm); the front sea layer hides whatever is under the water |
| `boat({x, w, sea, draft, tilt})` → `.hole(px, label, t0)`, `.toScreen(px, py, t)` | a boat that bobs, rides lower as it fills, tilts and capsizes; figures go inside it (`parent: B`) |
| `raft(x, sea)` → `.addPlank(i, t)`, `.mast(t)`, `.deck(t)` | build it plank by plank, then stand on it |

## Sound: procedural foley (`scripts/gen_foley.py` → `assets/sfx/foley-*.wav`)
storm-bed, sea-bed (16 s ambience beds), thunder, wave-crash, splash-big/small, leak, bail, hammer, creak,
whoosh, whoosh-long, rope, boom, bubbles, heartbeat, keys, pad-dark, pad-hope. Always lay a bed under the whole
loop and hit a physical sound on every action. Use pad-dark when tension starts and pad-hope on the payoff.
| `monoHead(text, t0, {y, size})` | typed headline (top, y 300–400) |
| `monoSign(text, x, y)`, `monoBubble(text, x, y)` | place labels; taunts and replies |
| `quoteCard(lines, author, t0, {accentLine})` | closing card over a darkened frame |

## Proven concepts (make your own variations, don't recreate the references)
| concept | crowd does | hero does | payoff |
|---|---|---|---|
| **same boat** (example: `assets/examples/modeb-same-boat-scenes.js`) | in a leaking boat in a storm, keep punching holes (CAR LOAN, NEW PHONE, BNPL), mock him | hammers a raft together, "I'M NOT SINKING WITH YOU.", jumps | boat capsizes; he rides into a gold sunbeam and throws them a rope |
| chained friends | swim near the seabed, chained to his ankles, taunting | swims up, "WATCH ME.", breaks the chains | surfaces into golden light |
| blind crowd | blindfolded, walking off a cliff | removes the blindfold, pulls others back | the line behind him stops |
| luxury vs assets | split screen: buys the car first, coins drain | buys the house first | the car arrives paid for by the house |
| two clocks | snooze ×3 | 5 minutes of push-ups, shower, ready | both walk out: one tired, one sharp |

## Mode B audit
1. Frame 0 already shows something going wrong (stakes) + the hero. 2. The metaphor reads with the sound off.
3. One accent colour that marks the hero. 4. Pressure escalates before the turn (taunts, chains, crowd).
5. A visible payoff (light, colour, reward) after a physical climax. 6. A quote card that names the lesson in ≤ 12 words.
7. Every second someone is doing something physical. 8. A foley bed throughout + a sound on every action.
(Ship ≥ 7/8.)
