---
name: glow-explainer
description: Make scroll-stopping vertical 1080x1920 faceless animations for Reels, TikTok and Shorts, on any topic (money, relationships, discipline, fitness, psychology, school, career, social media, business, history...), in two animation styles. Mode A - a narrated story: dark glowing stage, big posed characters, a central visual metaphor, captions under the floor, an ElevenLabs voice timed word-by-word, and sound design. Mode B - a short wordless metaphor loop: stick-figure crowd and one accent-coloured hero in a living environment, rising stakes, a physical climax, typed monospace text, a quote card, with music added in-app. Both are built on a shared viral engine (scroll-stop first frame, open loops, emotional beats, fast pacing, callback endings). Use when the user asks for an animation, explainer, reel, short or TikTok in these styles, types /glow-explainer with a topic or script, or asks for "a video like" one of their references.
---

# Glow Explainer

Two animation **styles** that can tell any story, sharing one **viral engine** that makes people stay to
the end. Everything is code (HTML/JS scenes → deterministic frame renderer → MP4), so every frame is
exact, re-timeable and checkable.

| | **Mode A: narrated story** | **Mode B: wordless metaphor loop** |
|---|---|---|
| feels like | a cinematic explainer someone narrates to you | a 15-second short film you understand with the sound off |
| length | whatever the story needs, usually ~30–75 s (keep it under ~90 s) | short: usually ~10–25 s (keep it under ~30 s) |
| audio | voiceover + sound effects | foley bed + sound effects; the user adds a trending song in the app |
| characters | big posed glowing people (`person()`), named | stick-figure crowd + one hero with an accent colour (`stick()`) |
| text | captions under the floor, pills, counters, an end title card | a monospace headline, labels, taunt bubbles, a quote card |
| use when | the idea needs explaining (a mechanism, a rule, a turn) | the idea fits one picture (a trap, a choice, peer pressure) |

If the user doesn't say which, pick the mode that fits the idea and say why in one line.
Neither mode is tied to a subject or a setting. The examples in `assets/examples/` (a true janitor-vs-banker story in A,
a boat in a storm in B) are worked examples, not templates to reskin.

## Always read first
1. `references/viral-engine.md`: hooks, open loops, emotional beats, pacing, endings, and the audits. This applies to both modes.
2. `references/metaphor-finder.md`: turn any topic into one physical metaphor with stakes (want → trap → mechanism → counter-move).
3. Mode A: `references/style-guide.md`, `references/scene-recipes.md` (the story formula and visual storytelling), `references/voice.md`.
   Mode B: `references/metaphor-loops.md` (anatomy, lessons, environment catalog, concept bank).

## Files
```
assets/   engine.js (timeline, tweens, cues, sfx)   components.js (icons, pills, stats, cards, halos...)
          characters.js (mode A posable people)  props.js (mode A SET SYSTEM + story props)  loops.js (mode B kits)
          base.css  index.html  sfx/ (SFX + foley-*.wav)  examples/ (one worked example per mode)
scripts/  render.cjs (stills | --check | parallel render + motion blur + bloom + audio mix)
          align.py  tts_chatterbox.py (free EXPRESSIVE voice)  tts_kokoro.py (fallback)  fetch_sfx.py (REAL sound library)
          mix_audio.py  gen_foley.py (procedural fallback only)  check_voice.py
voice.json  narrator voice settings
```

## Step 1 (both modes): concept
- Write want / trap / mechanism / counter-move, then choose the central metaphor (`metaphor-finder.md`). Look for the
  tension even in an informational topic.
- Mode A: write the story script (the beats in `scene-recipes.md`; a story rather than a list of tips). Let the story set the length,
  then cut: see "Length" in `viral-engine.md`.
  Mode B: write a beat sheet (frame 0 already wrong → escalation → the turn → climax → payoff → quote) and give each beat
  only the seconds it needs.
- Score it with the audit in `viral-engine.md` (A ≥ 8/10, B ≥ 7/8) and rewrite until it passes. Show the script or beat sheet
  and its score to the user, and get a yes before spending voice credits or render time.

## Step 2 (both): project
Create `videos/<slug>/` (or use the scratchpad if the user only wants the file). Copy
`assets/{index.html,engine.js,components.js,characters.js,props.js,loops.js,base.css}`. Set the user's handle in `index.html`
(`#handle-text`), or delete `#handle`. Never use another creator's handle.

## Mode A steps
3. **Voice.** One `creative_generate_speech` call for the whole script with the `voice_id`/`model_id` from `voice.json`
   (check the credit balance with `estimate_only` first; if it's short, `eleven_flash_v2_5` costs about half). **No credits?**
   `python3 -I scripts/tts_chatterbox.py script_tagged.txt take.wav --voice <licensed ref clip>`. It's free, local and
   expressive. Tag lines `[hook] [turn] [payoff] [calm]` to set intensity per sentence. Never ship a flat voice: compare its
   pitch spread to the reference (~12 semitones p10–p90); Kokoro alone measures ~8 and sounds monotone.
   Prefer a TRUE story with real details (verify facts with a search; don't name private people in a negative light).
   Download the take, then use fast pacing by default:
   `ffmpeg -i take.mp3 -af "silenceremove=start_periods=1:start_threshold=-45dB:stop_periods=-1:stop_duration=0.12:stop_threshold=-45dB:stop_silence=0.1,atempo=1.06,<post_filter>" voice.mp3`
   (aim for ~210 wpm). Write numbers as words, and cue scenes on non-number words.
4. **Align.** `HF_HUB_DISABLE_XET=1 python3 -I scripts/align.py voice.mp3 videos/<slug>/` → `words.js` + a timed transcript.
5. **Scenes** (`scenes.js`; see `assets/examples/modea-janitor-banker-scenes.js` and `modea-kodak-drawer-scenes.js` for the patterns):
   - **Variety: a new SET for every beat (every ~3–6 s)**, never one stage for the whole video. Use `stageSet()` +
     `sceneSwap(A, B, t, 'whip'|'zoom'|'push'|'cut')`, and vary the framing: wide establishing shots, close-ups (the coat
     with safety pins), split screens, charts, an object filling the frame (a jar, a scale, a mansion), a title moment.
     If two consecutive stills look alike, redesign one.
   - **Nothing passes through anything.** Coins land *in* a jar, building or hand; bills pile up *beside* a character;
     people stop *at* doors and steps; vehicles carry their driver. Background buildings sit behind characters, never
     in front of or through them. `--check` flags moving props crossing characters; scenery (`data-scenery`) is exempt,
     so check that by eye in the stills.
   - Titles over busy backgrounds get a plate (`titleCard(...).classList.add('plate')`).
   - One scene per sentence, keyed to spoken words with `cue('word')`; every drawable noun appears as it's said.
   - Big posed characters (`person`, `pose`), captions under the floor (`caption`), the central metaphor object followed
     from start to end, light on whoever the sentence is about, a title card at the end (`window.DURATION += 1.9`).
   - Apply the viral engine to the edit: frame 0 = characters + a text hook (`titleCard` at a negative t0); don't let the
     visuals answer the open loop early; an underdog moment (narrow spotlight + heartbeat); a first-win spike; a
     vindication punch-in; a callback.
   - `window.GX_PACE = 0.72` and `punches('#stage', 0.04, 0.22)` for fast pacing; the camera always drifts.
   - Nothing uses `Date`, `Math.random` or CSS animations: use `rand(seed)` and engine tweens (the renderer seeks frames).
   - Need a prop the kit doesn't have? Draw it (an SVG in `ICONS` or a new builder in `characters.js`). Never settle for
     a generic icon when the metaphor needs a specific object.
6. **Sound.** Run `python3 -I scripts/fetch_sfx.py` once (real recorded/produced sounds → `assets/sfx/real/`, git-ignored).
   A sound-design block at the end of `scenes.js`: `sfx('real/<name>', t, vol, dur)` on every beat (see `real/index.json`).
   Use a bed per set (wind, night, murmur, drone) plus hits. Never use synthesized UI blips or `foley-*` when a real sound exists. Use whooshes for time jumps,
   physical sounds for actions, a bass hit (`click-deep`, `foley-boom`) on turns, and a pad on the payoff.
   The renderer mixes it under the voice at −14 LUFS.

## Mode B steps
3. **Environment.** Reuse a kit from the catalog in `metaphor-loops.md`, or **build the environment the metaphor needs**
   (stairs, a train, a room, a cage, a hill...) following its pattern: layers, one tension curve driving the whole world,
   group elements. Add new kits to `loops.js` so they can be reused.
4. **Scenes** (`scenes.js`, with `window.WORDS=[];window.DURATION=<length the beats need>;` in `words.js`; see
   `assets/examples/modeb-same-boat-scenes.js` for the patterns): the crowd and the hero close to camera (stick size ≈ 1.2),
   someone doing something physical every second, labels that name what things mean, taunts, the hero's single line at
   the turn, a climax hit (flash, snap, fall + punch-in), a payoff in the accent colour, a grace beat, and the quote card.
5. **Sound.** `python3 -I scripts/gen_foley.py` if `assets/sfx/foley-*.wav` is missing. A bed for the whole loop and a
   physical hit on every action. Add new procedural sounds to `gen_foley.py` when the topic needs them.

## Finish (both modes)
- **Layout check:** `node scripts/render.cjs videos/<slug> --check` must print `0 issue(s)`. It is STRICT: nothing may overlap
  anything (characters, props, scenery, text), except a parent containing a child or elements marked `data-overlap-ok`
  (a person standing on stairs, pins on a coat). It scans every 0.25 s for overlaps and for anything outside the Reels safe zone (text inside x 65–1015, y 270–1500,
  and clear of the right 150 px below y 960). Mark intentional overlaps with `el.dataset.overlapOk = ''`.
- **Stills:** `--still t1,t2,...` (one per beat). Look at every frame: is the hook clear at frame 0? Is anything empty, static or
  cluttered? Is the action big enough to read on a phone?
- **Render:** `node scripts/render.cjs videos/<slug>` (60 fps by default, 2× motion blur, parallel, post bloom, audio mix). Look at a contact sheet,
  then send the MP4.

## Quality bar
- 1080×1920, **60 fps**, H.264 + AAC. `--check` = 0 issues (strict). Mode A at −14 LUFS.
- UI kit: `titleCard('Text with *gold* or _red_ words', {kicker, size})`, `stat(label, value, x, y, {tone:'gold'|'red'})` frosted
  cards, Space Mono captions/pills. Respect the layout grid in `base.css` (kicker 330 · title 380–560 · info 600–900 ·
  stage 900–1350 · caption 1360–1430). Never show placeholder-looking values ("$$$$"); use real words or numbers.
- Frame 0 works as a thumbnail with a text hook. Motion within 0.3 s. No frame static for more than 1.5 s.
- A dark stage with one accent colour that means something (gold = reward, red = danger, or whatever fits the topic).
- At most ~4 text elements on screen at once. Labels are short, uppercase, and name what things *mean*.
- The end card is short (about 1.5–2.5 s) with no slow fade.
- Length is earned: every beat opens or closes a loop, or lands an emotion. Anything else gets cut.
