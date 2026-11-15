---
name: moneyscale
description: Make a vertical "money to scale" Short for the user's faceless channel. One huge, real dollar figure (a billionaire's wealth, a national debt, a sports contract, a company's daily revenue, a movie budget) is turned into physical things the viewer can feel - stacks of $100 bills next to buildings, a countdown of how long you'd need to earn it, what it buys, how fast it's earned per second - escalating until a final twist line. 1080x1920, 30 fps, ~35-50 s, ElevenLabs narration with word-timed captions, HyperFrames (or Remotion) animation, FFmpeg mix and master. Use when the user types /moneyscale followed by a topic or figure, asks for a money scale / net-worth visualisation / "how much is X really" video, or asks for the next episode of this channel.
---

# Money, to Scale

A channel about one idea: **big numbers mean nothing until you can see them.** Every episode takes one real, topical dollar figure and makes it physical, in a fixed visual language viewers learn to recognise.

Why this niche (keep it, don't drift): finance-adjacent topics get the highest ad rates of any faceless niche; news supplies a new figure every day (a new contract, a new fine, a new IPO); the payoff is a "wait, WHAT" moment that drives rewatches and comments; and every visual is data driven, which is exactly what code-rendered animation does best. No characters, no lip sync, no stock footage, so nothing breaks consistency.

## Tools and where each fits

| Step | Tool | Notes |
| --- | --- | --- |
| Narration + word timings | ElevenLabs (`scripts/voiceover.py`) | `with-timestamps` endpoint gives per-character times; the script turns them into `words.json` for captions. Needs `ELEVENLABS_API_KEY`. |
| Animation | HyperFrames (default) | Read the `/hyperframes` skill first and obey its contract. Use `/hyperframes-registry` for count-ups, captions and charts before hand-building. |
| Animation (alternative) | Remotion | Only if the user asks. Same scene list; drive everything from `useCurrentFrame()`, words from `words.json`. |
| Sound + master + final file | FFmpeg (`scripts/master.sh`) | Mixes VO + SFX, ducks nothing (no music), masters to -14 LUFS, muxes onto the silent render. |

## The format (do not vary these - they ARE the brand)

- **Canvas:** 1080x1920, 30 fps. Background `#0B0F0C` (near-black green). Money green `#3DDC84` is the ONE accent, used only for dollar figures. White `#F4F4F0` text. Red `#FF4D4D` only for the final twist number.
- **Font:** one heavy grotesk for numbers (e.g. Inter Tight 900 / Archivo Black via `@font-face`), `tabular-nums` always.
- **Persistent counter:** the episode's main figure sits top-centre (y 190-330) the whole video, shrinking after the hook. Every comparison is measured against it.
- **The $100 bill brick:** the unit of the channel. $10,000 = one bundle, $1M = one pallet-sized cube, $1B = a cube grid. Bills are drawn as flat SVG rectangles with the green tint, never photo-real currency imagery.
- **Human figure for scale:** a flat 1.75 m silhouette appears whenever stacks get big, so "tall" is always readable.
- **Captions:** word-lit, max 4 words on screen, centred at y ~1180, current word in green if it's a number, white otherwise. Everything inside 168-1330 px vertically (platform UI covers the rest).
- **Voice:** one fixed ElevenLabs voice for every episode (store its id in `VOICE_ID`), calm, slightly amused, ~165 wpm. Never shouting.
- **No music.** Sound is: cash-register *ka-ching* on the hook number, paper riffle on each stack, soft tick on counters, a low thud on the twist. Short, real recorded SFX (freesound CC0 or ElevenLabs Sound Effects), placed on visible actions only.

## Episode structure (35-50 s)

1. **Hook, 0-2 s.** Frame 0 already shows the figure in huge green numbers plus a 5-word question. e.g. `$47,000,000,000` / "What does that actually look like?" Never a black frame, never a logo.
2. **Make it physical, 2-12 s.** Stack it: bundles -> pallets -> a tower beside a known landmark (Statue of Liberty, a football field, a 747). Camera pulls out as it grows.
3. **Make it personal, 12-25 s.** Time comparisons against the viewer: "At the median US salary, you'd need to work..." -> a year counter racing past the pyramids/Romans/dinosaurs. Or per-second earnings: "In the time you've watched this, he made..." with a live counter that keeps running in the corner for the rest of the video.
4. **Escalate, 25-40 s.** Three rapid "it could buy..." cards (each smaller than the last, getting absurd), or one surprising re-framing (e.g. "spend $1M every day since 1900 and you'd still have...").
5. **Twist + loop, last 3-5 s.** One red number that reframes everything (the tax paid, the fine as % of revenue, the per-second counter's final value). Last line rhymes back to the first frame so the loop cut feels seamless.

Pacing: new visual beat every 2-3 s; nothing holds longer than 3 s.

## Workflow

1. **Pick the figure.** If the user gave only a topic, propose 3 figures from `references/topics.md` style with a hook line each and let them pick (skip if they said "no questions").
2. **Research and lock numbers.** Find the figure from a primary/reputable source (filings, Forbes/Bloomberg real-time lists, government budget docs, league contract reports). Write `numbers.json` with every figure, its source URL and date. Do all derived maths in one place (bill counts, stack height = bills x 0.11 mm, years = figure / salary). Use: $100 bill = 0.11 mm thick, 1 g, 156 x 66 mm; $1M in $100s = 10,000 bills ~ 10 kg ~ 1.1 m tall single stack; US median full-time salary - look up the current BLS figure. Round consistently. On screen, a tiny source line bottom-left of the band.
3. **Script.** Use `references/script-template.md`. 90-130 words. Read every number the way it will be spoken ("forty-seven billion").
4. **Voice.** `python3 scripts/voiceover.py script.txt out/` -> `out/vo.mp3`, `out/words.json`, `out/duration.txt`. Scene timings are taken from `words.json`, not guessed.
5. **Animate.** `npx hyperframes init <slug> --skip-skills`, then build per `/hyperframes`: one sub-composition per beat, figures read from a single data module generated from `numbers.json`, captions from `words.json`. Root `data-duration` = VO duration + 0.6 s. Render silent or with the VO track; master.sh handles both. `npx hyperframes check --json`, then snapshot-review the hook frame, the biggest stack frame and the twist frame.
6. **Sound + master.** Write `out/sfx.txt` (one line per cue: `seconds file.wav gain_db`), then `scripts/master.sh render.mp4 out/vo.mp3 out/sfx.txt final.mp4`.
7. **Package.** Write `out/post.md`: title (<= 50 chars, contains the number, e.g. "$47 Billion Is Bigger Than You Think"), description with sources, 3-5 hashtags, a pinned-comment question that invites argument ("Would you take $10M or a penny doubled for 30 days?").

## Quality bar (check before delivering)

- Frame 0 works as a thumbnail with sound off.
- Every number on screen matches `numbers.json` and has a source.
- Exactly one green accent family; red only once.
- No beat holds over 3 s; total 35-50 s.
- Final frame -> first frame cut reads as a loop.
- Loudness -14 LUFS integrated, true peak <= -1 dBTP (master.sh prints it).

## Never

- Invent or "estimate" a figure without saying so on screen.
- Use photographic currency images or real banknote reproductions; keep bills stylised.
- Mock private individuals; subjects are public figures, companies, governments, contracts.
- Copy another channel's graphics, names or catchphrases.
