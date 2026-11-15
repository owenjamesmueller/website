---
name: glow-explainer
description: Make vertical 1080x1920 faceless explainer animations in the "glow" style - pure black stage, white glowing line-art icons, a faceless figure on a dashed floor, uppercase pill labels, big ticking counters, spotlight cones, camera push-ins - narrated by an ElevenLabs voice and timed word-by-word to it. Also makes the 15-second silent stick-figure "metaphor loop" variant. Use when the user asks for an animation, explainer, reel, short or TikTok in this style, types /glow-explainer followed by a topic or a script, or asks for "a video like the IQ 160 one".
---

# Glow Explainer

Turns a topic or script into a finished MP4: script → voiceover → word timings →
HTML/JS scenes → deterministic frame render → MP4 with audio. Everything is
code, so every frame is exact and re-timeable.

Two modes:

| Mode | Use for | Length | Audio |
|---|---|---|---|
| **A: Narrated glow explainer** (default) | money/psychology/self-improvement ideas explained in a story about one person | 45–75 s | voiceover only, no music |
| **B: Metaphor loop** | one visual comparison ("luxury first vs assets first", "what a week feels like") | 12–16 s | music bed only, one line of on-screen text |

Read `references/style-guide.md` before designing any scene. Read
`references/scene-recipes.md` when planning visuals. Read `references/voice.md`
before generating audio. For mode B also read `references/metaphor-loops.md`.

## Files

```
assets/   engine.js  components.js  base.css  index.html  example-scenes.js
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
   Show the script to the user and get a yes before spending credits on voice.

2. **Project folder.** Create `videos/<slug>/` in the working directory (or the
   scratchpad if the user only wants the file) and copy in
   `assets/{index.html,engine.js,components.js,base.css}`. Set the user's handle
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

6. **Preview stills.** `node scripts/render.cjs videos/<slug> --still 1,4.5,9,...`
   (one time per scene). Look at every still with Read. Check overlap,
   off-canvas elements, things visible that should have cleared, and empty frames.
   Fix and repeat. This is the cheap loop: do it until each still reads clearly.

7. **Render.** `node scripts/render.cjs videos/<slug>` → `videos/<slug>/out.mp4`
   (30 fps with 3× motion blur, about 1× realtime; `--mb 1` for a fast draft). Extract a contact sheet
   (`ffmpeg -i out.mp4 -vf "fps=1/2,scale=240:-1,tile=6x3" sheet.jpg`), look at it,
   then send the MP4 to the user.

8. **End card** (optional, as in the references): the final 1.5 s fades to black
   with the handle icon centred.

## Mode B (metaphor loop)

The same engine and renderer with no voice: set `window.DURATION` by hand in
`words.js` (`window.WORDS=[];window.DURATION=15;`), use stick figures from
`references/metaphor-loops.md`, and add the user's music with
`ffmpeg -i out.mp4 -i music.mp3 -map 0:v -map 1:a -shortest -c:v copy final.mp4`.
The restricted ElevenLabs connector cannot make music; ask the user for a track,
or use a music-generation skill if one is available.

## Quality bar

- 1080×1920, 30 fps, H.264 + AAC, safe area: keep text between y=250 and y=1650
  and x=70–1010.
- Monochrome. One extra colour only when it carries meaning (gold coins, red alarm).
- Something moves at least every 1.5 s. No static holds longer than that.
- Numbers always tick (`count`), never just appear.
- Pills are short: 1–5 words, uppercase.
