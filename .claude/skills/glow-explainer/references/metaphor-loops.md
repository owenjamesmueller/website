# Mode B: short wordless metaphor loops, any topic

A style, not a subject. One metaphor (from `metaphor-finder.md`) acted out by stick figures in a real
environment, readable with the sound off, with music added in the app. Works for money, friends, discipline,
fitness, social media, school, work, confidence or relationships. Studied from the user's references (the underwater chains loop,
the blind crowd at a cliff, the crowd splitting into schools and jobs, luxury vs assets, 5 minutes, what a week feels like).

## The anatomy (true for every topic)
- **No narration.** The picture IS the story.
- **A crowd and one hero.** The crowd is grey; the hero is white with ONE accent colour (a headband, blindfold,
  flame, gold light) so the eye finds him instantly.
- **A real environment** that is the metaphor: water, a cliff, a road, stairs, a room, a field, a city, a hill,
  a train platform, a desert, a gym, a classroom. Depth through perspective scale, a ground plane and reflections.
- **Small monospace text only**: a headline at the top, boxed labels that name what things mean
  ("CAR LOAN", "EXCUSES", "GROUP CHAT", "COMFORT ZONE"), and crowd taunts ("WHO DO YOU THINK YOU ARE?").
  The hero speaks once, at the turn.
- **Arc** (usually ~10–25 s, as long as the beats need, rarely over ~30 s): something is wrong at frame 0 → pressure escalates (2–3 steps) → the hero's turn → a physical
  climax (snap, fall, flood, lightning) → payoff (light, gold, the top, the surface) → a quote card → loop.
- **Sound**: a foley bed under everything, plus a physical sound on every action. The user adds a trending song in the app.

## Lessons from a rejected draft (apply to every topic)
The first demo (a crowd walking a forked road) was rejected as boring and lazy, with bad sound. The reasons were general:
- **No stakes.** Walking isn't a problem. Something must be going wrong from frame 0.
- **No physical action.** Sliding figures along a path is lazy. Every second someone must be *doing* something.
- **Too small and far away.** Keep characters close (stick size ≈ 1.2) so the acting reads on a phone.
- **UI blips aren't sound design.** Use foley (beds + physical hits). UI sounds only for speech-bubble pops.
- **No climax.** Build to one hit (lightning, a snap, a fall, a break), then release into light.
- **No heart.** Add a beat after the win (grace: he helps the ones who mocked him) — that's what gets shared.

## Environment catalog: reuse a kit, or build a new one per topic
Ready-made kits in `assets/loops.js`:
| kit | functions | good for |
|---|---|---|
| storm at sea | `sky({storm, goldAt})`, `sea({y, storm})`, `rain`, `lightning`, `sunbeam`, `boat()` (labelled leaks, sinking, capsizing), `raft()` (build plank by plank) | slow drains, "same boat", preparing before a crisis |
| underwater | `ocean()`, `bubbles()`, `chain(a(t), b(t))`, `seaweed()` | being held down, surfacing, breaking free |
| perspective road | `road({forkZ, spread})` → `R.at(z, branch, lane)` | choices, crowds, paths (add stakes: a cliff at the end, a storm coming) |
| cliff | `cliff(edgeX, y)` | following blindly, fear of jumping, consequences |
| figures + text | `stick()` (walk, poses, `path`), `monoHead`, `monoSign`, `monoBubble`, `quoteCard` | every loop |

**Building a new environment** when the metaphor needs one (stairs, an escalator, a train, a cage, a hill, rooms, a gym,
a classroom, a phone screen, a battery, a dam), follow the same pattern as the kits in `loops.js`:
- Layers with z-order: sky/background 0–3, world 5–25, the *front* layer that hides things (water, fog, a counter, a wall) 30,
  weather/particles 40, text 40+.
- Motion as a pure function of time (`on(t => ...)`), driven by one tension curve (like `storm(t)`) so the whole world
  escalates together: the water rises, the wind picks up, the battery drains, the crowd speeds up.
- Things that move together share a group element (like `boat`), with a `toScreen()` helper if a character must leave it.
- Add the new kit to `loops.js` with a docs row here, so the next video can reuse it.

## Concept bank (variations across niches; never recreate a reference)
| topic | crowd does | hero does | climax → payoff |
|---|---|---|---|
| lifestyle creep (example: `assets/examples/modeb-same-boat-scenes.js`) | punch labelled leaks in their boat, mock him | hammers a raft | capsize → gold sunbeam, throws a rope |
| toxic friends | swim near the bottom, chained to his ankles | swims up, "WATCH ME." | chains snap → surfaces into light |
| following the crowd | blindfolded line walking to a cliff | removes the blindfold | others fall → he pulls the rest back |
| social media | sit in a dark room lit only by phones, battery bars over their heads draining | puts the phone face down | his battery refills → he walks out into daylight |
| discipline | ride an escalator going *down*, laughing | builds steps beside it, one brick a day | their escalator ends at the bottom → he's at the top |
| procrastination | wait on the platform packing "perfect" bags | gets on with a half-packed bag | the train leaves without them |
| fear of failure | queue behind a frozen diver on the board | jumps | splash → the whole line follows |
| comfort zone | sit in a warm, lit room as the walls slowly close in | opens the door into the cold dark | the room shrinks → outside, dawn breaks |
| people-pleasing | pile their backpacks onto him on a hill | drops them one by one | they topple → he walks up light |
| fitness | lounge on couches chained to them | drags the couch to the gym | the chain snaps → before/after silhouettes |

## Toolkit reference
| function | use |
|---|---|
| `stick(x, y, {size, color, accent, blindfold, parent})` | anchor = feet; grey crowd `#9a9ca6`, white hero, `accent` colour |
| `.walk(t0, t1, {dx, dy})`, `.path(t0, t1, p => ({x, y, s, z}))`, `.pose(t, name or custom)` | stand, cheer, pull, reach, swim, fall, point, sit, blind, or a custom `{aL, aR, lL, lR, lean}` |
| `monoHead(text, t0, {y, size})` | headline (y ≥ 330; start it at a negative t0 so frame 0 shows it complete) |
| `monoSign(text, x, y)`, `monoBubble(text, x, y)` | labels; taunts and the hero's single line |
| `quoteCard(lines, author, t0, {accentLine})` | closing card over a darkened frame |
| foley: `sfx('foley-<name>', t, vol)` | beds: storm-bed, sea-bed · hits: thunder, wave-crash, splash-big/small, leak, bail, hammer, creak, whoosh(-long), rope, boom, bubbles, heartbeat, keys · music-like: pad-dark, pad-hope. Add new sounds to `scripts/gen_foley.py` when a topic needs them (footsteps, a door, a crowd murmur, an alarm) |
