# Mode B: wordless metaphor loops (12–16 s)

Studied from the user's references: the underwater chains loop ("YOU'VE CHANGED, BRO" → "WATCH ME" → surfaces,
Seneca quote), the blindfolded crowd walking off a cliff ("DON'T FOLLOW BLINDLY."), the crowd splitting into
private/government school → jobs, luxury-first vs assets-first, "5 minutes", "what a week feels like",
and income vs expenses.

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
| `monoHead(text, t0, {y, size})` | typed headline (top, y 300–400) |
| `monoSign(text, x, y)`, `monoBubble(text, x, y)` | place labels; taunts and replies |
| `quoteCard(lines, author, t0, {accentLine})` | closing card over a darkened frame |

## Proven concepts (make your own variations, don't recreate the references)
| concept | crowd does | hero does | payoff |
|---|---|---|---|
| the easy road (example in `assets/examples/`) | walks left to PAYCHECK TO PAYCHECK | stops at the fork, taunted, takes the empty road | lamps light up one by one, the house glows gold |
| chained friends | swim near the seabed, chained to his ankles, taunting | swims up, "WATCH ME.", breaks the chains | surfaces into golden light |
| blind crowd | blindfolded, walking off a cliff | removes the blindfold, pulls others back | the line behind him stops |
| luxury vs assets | split screen: buys the car first, coins drain | buys the house first | the car arrives paid for by the house |
| two clocks | snooze ×3 | 5 minutes of push-ups, shower, ready | both walk out: one tired, one sharp |

## Mode B audit (ship ≥ 5/6)
1. Frame 0 already shows the crowd + hero in motion. 2. The metaphor reads with the sound off.
3. One accent colour that marks the hero. 4. Pressure escalates before the turn (taunts, chains, crowd).
5. A visible payoff (light, colour, reward) after the turn. 6. A quote card that names the lesson in ≤ 12 words.
