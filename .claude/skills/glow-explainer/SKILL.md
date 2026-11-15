---
name: glow-explainer
description: Make vertical 1080x1920 faceless animations for Reels/TikTok/Shorts in two modes. Mode A - narrated glow-style story explainers (black stage, big posed glowing characters, visual metaphors, captions under the floor, ElevenLabs voice timed word-by-word, sound effects). Mode B - wordless 12-16 s stick-figure metaphor loops (a crowd, one accent-coloured hero, a real environment like a forked road, an ocean or a cliff edge, typed monospace text, taunt bubbles, a quote card, music added in-app). Use when the user asks for an animation, explainer, reel, short or TikTok in this style, types /glow-explainer followed by a topic or a script, or asks for "a video like the IQ 160 one".
---

# Glow Explainer

Turns a topic or script into a finished MP4: script → voiceover → word timings →
HTML/JS scenes → deterministic frame render → MP4 with audio. Everything is
code, so every frame is exact and re-timeable.

Two modes:

| Mode | Use for | Length | Audio |
|---|---|---|---|
| **A: Narrated glow explainer** (default) | money/psychology/self-improvement ideas explained in a story about one person | 45–75 s | voiceover only, no music |
| **B: Metaphor loop** | one wordless visual metaphor ("don't follow the crowd", "friends who drag you down", "the easy road") | 12–16 s | no voice; quiet SFX + the user adds a trending song in the Instagram/TikTok app |

Read `references/style-guide.md` before designing any scene. Read
`references/scene-recipes.md` when planning visuals. Read `references/voice.md`
before generating audio. For mode B also read `references/metaphor-loops.md`.

## Files

```
assets/   engine.js  components.js  characters.js (mode A people)  loops.js (mode B)
          base.css  index.html  sfx/  examples/ (two-friends-story = A, modeb-same-boat = B)
scripts/  align.py (word timestamps -> words.js)   render.cjs (frames -> mp4)
          check_voice.py (optional: score a voice against a reference clip)
voice.json  the narrator voice settings (voice_id, model, tempo)
```

## Workflow (mode A)

1. **Script = a story.** If the user gave a topic, turn it into a story using the
   9-beat formula in `references/scene-recipes.md`: paradox hook with an open loop,
   remove the obvious explanation, a character the viewer knows, tiny specific moments,
   "it looked like he was winning", "but here's what nobody saw", the hidden rule as a
   contrast, a time skip, and a callback ending. 170–210 words. Never a list of tips.
   **Score it with the audit in `references/retention.md` and rewrite until it scores ≥ 8/10**,
   then show the script and score to the user and get a yes before spending credits on voice.

2. **Project folder.** Create `videos/<slug>/` in the working directory (or the
   scratchpad if the user only wants the file) and copy in
   `assets/{index.html,engine.js,components.js,characters.js,base.css}`. Set the user's handle
   in `index.html` (`#handle-text`), or delete `#handle` if they have none. Never
   use another creator's handle.

3. **Voice.** Generate the whole script in one call with the ElevenLabs
   `creative_generate_speech` tool, using `voice_id`, `model_id` from
   `voice.json`. Pick the better of the two takes (listen for flubs: run
   `align.py` on both and compare the transcript to the script). Download the
   take's `content_url` with curl, then apply tempo and the reference-matched EQ:
   `ffmpeg -i take.mp3 -af "atempo=<tempo>,<post_filter>" -b:a 192k videos/<slug>/voice.mp3`
   (both from `voice.json`). Target pace is ~180 wpm. Write numbers as words in
   the script, but cue scenes on nearby non-number words, because the aligner
   may transcribe "two hundred dollars" as "$200".

4. **Align.** `HF_HUB_DISABLE_XET=1 python3 -I scripts/align.py videos/<slug>/voice.mp3 videos/<slug>/`
   (needs `pip install faster-whisper soundfile librosa`). This writes
   `words.js` and prints a timed transcript. Use the transcript to plan scenes.

5. **Scenes.** Write `videos/<slug>/scenes.js`. Start from
   `assets/example-scenes.js`. Rules:
   - One scene per sentence (sometimes two short sentences). Build each scene in
     its own `{ }` block, keyed to `cue('word')` so visuals land on the spoken word.
   - Every noun the narrator says that can be drawn **is** drawn the moment it's
     said: a pill label, an icon pop, a counter, a check/cross.
   - Apply `references/retention.md` to the edit: frame 0 = characters + text hook; an open
     loop the visuals don't give away; underdog moment (narrow spotlight, heartbeat);
     first-win spike; vindication punch-in; twist callback; a short title card.
   - Prefer the big-character style: `person()` with poses, captions under the floor,
     a central metaphor object (see "Big-character style" in `references/style-guide.md`),
     and a title card at the end. Add `window.DURATION += 2.6` for the card.
   - Stage it like a film: named characters with reactions, a world that changes,
     gold coins to follow, light on whoever the sentence is about. Follow "Visual
     storytelling rules" in `references/scene-recipes.md`. The full component list
     is at the top of `assets/components.js`, and
     `assets/examples/two-friends-story-scenes.js` is the reference implementation.
   - Keep the hero figure on the floor most of the video; it is the continuity.
   - Clear a scene's props (`tw(..., {opacity:[1,0], y:[0,-30]})`) ~0.25 s before
     the next sentence starts, or transform them into the next scene.
   - Camera moves (`tw(cam, ...)` scale/y) on scene changes, 0.8–1.4 s, `inOut`.
   - Nothing may use `Date`, `Math.random`, CSS animations or transitions: use
     `rand(seed)` and engine tweens only. The renderer seeks to arbitrary times.
   - Need a new icon? Add an SVG string to `ICONS` in your project's
     `components.js` (stroke `#fff`, width 6, round caps, 200×200 viewBox).

5b. **Sound effects.** Add a sound-design block at the end of `scenes.js`:
   `sfx('coin-collect', cue('paid'), 0.35)`. The files are in `assets/sfx/` (MIT, from SoundWeaver).
   Use whoosh-short or refresh for time jumps, coin-collect or coin-double for money moving,
   invalid-thunk or error-soft-thud for losses, success-* for wins, type-key for typing,
   mention-pop for speech bubbles, notification-ding for messages, and click-deep for dramatic beats.
   Keep volumes 0.15–0.5 so the voice stays on top. The renderer mixes them into `mix.wav`
   and normalizes to −14 LUFS (the Reels standard) automatically.

6. **Layout check.** `node scripts/render.cjs videos/<slug> --check` scans every 0.25 s
   and lists overlapping text/icons/characters and anything outside the Reels safe zone
   (text inside x 65–1015, y 270–1500, and clear of the right 150 px below y 960 where the
   like/comment/share buttons sit). Fix until it prints `0 issue(s)`. Mark intentional
   overlaps (a character inside a car, a laptop in front of him) with `el.dataset.overlapOk = ''`.

7. **Preview stills.** `node scripts/render.cjs videos/<slug> --still 1,4.5,9,...`
   (one time per scene). Look at every still with Read. Check overlap,
   off-canvas elements, things visible that should have cleared, and empty frames.
   Fix and repeat. This is the cheap loop: do it until each still reads clearly.

8. **Render.** `node scripts/render.cjs videos/<slug>` → `videos/<slug>/out.mp4`
   (30 fps with 3× motion blur, about 1× realtime; `--mb 1` for a fast draft). Extract a contact sheet
   (`ffmpeg -i out.mp4 -vf "fps=1/2,scale=240:-1,tile=6x3" sheet.jpg`), look at it,
   then send the MP4 to the user.

9. **End card** (optional, as in the references): the final 1.5 s fades to black
   with the handle icon centred.

## Mode B (wordless metaphor loop)

Read `references/metaphor-loops.md` first. The workflow is shorter, with no voice:

1. **Pick one metaphor** that the whole loop acts out, and its turn. For example, a crowd takes
   the easy road and one figure takes the empty one. Write it as 4 beats on a 14 s timeline:
   hook (0–1 s, already moving), escalation (taunts and pressure), turn (the hero breaks away), and
   payoff (light or reward), then a quote card in the last 2.5 s. Score it with the Mode B audit in the
   reference (≥ 7/8). Read its "Lessons from a rejected draft" first: stakes from frame 0, physical action
   every second, close framing, and foley rather than UI sounds.
2. **Project**: copy the same assets as mode A (they include `loops.js`). Write `words.js` as
   `window.WORDS=[];window.DURATION=14.5;`. Start `scenes.js` from
   `assets/examples/modeb-same-boat-scenes.js`.
3. **Build** with `stick()` figures (grey crowd, white hero with an accent headband), an environment
   (`road()` fork, `ocean()` + `bubbles()` + `chain()` + `seaweed()`, `cliff()`), `monoHead()` typed
   headlines, `monoSign()` labels, `monoBubble()` taunts, and `quoteCard()`. Frame 0 must already be busy.
4. Sound: run `python3 -I scripts/gen_foley.py` once if `assets/sfx/foley-*.wav` is missing. Put a bed under the
   whole loop and a foley hit on every action.
5. `--check`, stills, then render. SFX stay quiet (no loudness normalisation without a voice), because
   the user adds music in the app. If they hand you a music file instead:
   `ffmpeg -i out.mp4 -i music.mp3 -filter_complex "[1:a]volume=0.8[m];[0:a][m]amix=inputs=2:normalize=0" -map 0:v -c:v copy -shortest final.mp4`.

## Quality bar

- 1080×1920, 30 fps, H.264 + AAC. `--check` must report 0 issues (no overlaps, Reels safe zone).
- Leave breathing room: at most ~4 text elements on screen at once; clear a scene before the next.
- Monochrome. One extra colour only when it carries meaning (gold coins, red alarm).
- Something moves at least every 1.5 s. No static holds longer than that.
- Numbers always tick (`count`), never just appear.
- Pills are short: 1–5 words, uppercase.
