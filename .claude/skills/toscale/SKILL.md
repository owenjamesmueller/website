---
name: toscale
description: Make a video for the user's faceless "To Scale" channel - simple, hypnotic vertical visualisers that show how big, deep, fast, old, heavy or expensive things really are, built so viewers don't swipe away. Every video is under 60 seconds. Three formats - Ladder (smallest to biggest, 20-45 s), Descent (one continuous camera journey with a live counter - ocean depth, into the Earth, up to space, back in time - 30-55 s) and Story ("what would happen if..." on a running clock, 40-58 s). 1080x1920, 30 fps, ElevenLabs narration with word-timed captions, HyperFrames (or Remotion) animation, FFmpeg master. Use when the user types /toscale with a topic, asks for a scale/size/depth/speed comparison, a "what if" or "what happens when" visualiser, or the next episode of this channel.
---

# To Scale

**Channel promise:** *you've heard the number; now watch it.* Anything with a size, depth, speed, age, weight, price or count can be an episode, so the topic pool is broad (space, ocean, animals, history, money, the human body, disasters, machines). The niche is the **visual language**, not the subject: one camera, one counter, one baseline object, always this channel's look.

Why it holds viewers: every video is a progression with a visible endpoint the viewer is waiting for (the biggest item, the bottom of the ocean, the end of the clock). People stay to see the end. Code-rendered animation (HyperFrames/Remotion) suits this because everything is driven by numbers.

## Hard rule: under 60 seconds

Every video is **under 60 s** (target 25-50 s; Ladder usually 20-45 s). Shorter wins: cut steps before speeding up the voice. Root `data-duration` must be < 60; if the voiceover runs past 58 s, cut the script and re-voice.

## Retention targets (measure every upload)

- "Viewed vs swiped away" >= 85% (aim 90%).
- Average % viewed >= 90% (a clean loop pushes it over 100%).
No format guarantees these every time. The skill builds in the techniques that get there; YouTube Studio shows which episodes miss. Log each upload's numbers in `retention-log.md` and make more of the families that beat 90%.

## Retention techniques (built into every script and edit)

1. **Frame 0 = the promise.** The first frame already shows the counter/baseline and a 3-6 word line naming the endpoint ("Smallest to biggest thing ever measured"). Never black, never a logo, never a greeting.
2. **The visible endpoint.** A progress element (depth gauge, ladder rail, clock, size bar) is on screen the whole time, so the viewer knows the payoff is coming.
3. **Escalating steps, faster and bigger.** Each step bigger/weirder than the last; step length shrinks (3 s -> 2 s -> 1.5 s), then the final one holds.
4. **Something new every 1.5-3 s.** A new object, a counter jump, a camera move or a caption punch. Nothing static past 3 s.
5. **Open loop at 60-70%.** "But nothing prepares you for the last one." / "And that's where it gets weird."
6. **Fast payoff, no outro.** End on the payoff or one twist line, then cut. The last line flows back into the first frame so the video loops.
7. **Sound-off proof.** Captions + the counter tell the whole story muted.

## The look (the brand - keep fixed across episodes)

- Background: deep gradient `#070B14` -> `#0E1A2B`. One accent `#FFC94A` (warm gold) for the counter and the current item's label. White `#F2F4F7` text. Red `#FF5A5A` used once, for the twist.
- Font: one heavy grotesk for numbers and labels (Archivo Black or Inter Tight 900 via `@font-face`), `tabular-nums` for counters.
- **Baseline object:** a flat 1.75 m human silhouette (size topics) or a familiar reference (a bus, the Eiffel Tower, a football field) stays on screen so scale always reads.
- Objects are clean flat/vector or simple 3D (CSS 3D / Three.js) silhouettes with one shading step, drawn from real reference proportions. Labels sit on the object; no legends.
- Layout (1080x1920): all text between y 168 and 1330 px; captions at y ~1180, max 4 words, current word lit gold. Counter top-centre.
- **Sound:** one fixed ElevenLabs voice for every episode (`VOICE_ID`), curious and calm, ~160 wpm. Low ambient drone bed at about -28 dB, a soft whoosh on each camera move, a tick on each counter step, a deep hit on the payoff. No popular music.

## The three formats

### A. Ladder (20-45 s) - start here, most consistent
Smallest -> biggest (or slowest -> fastest, youngest -> oldest...). 8-12 items. Camera keeps pulling out; the previous item stays visible and shrinks away so growth is felt. Last item is absurd. Examples: "Every animal by size to the blue whale", "Fastest things ever, all the way to light", "Loudest sounds ever recorded".

### B. Descent (30-55 s)
One continuous camera move along one axis with a live counter: down into the ocean, into the Earth, up into space, back through time, a zoom into the body. Waypoints pop in as the counter passes them. Examples: "How deep the ocean really goes", "Digging to the centre of the Earth", "If you fell into Jupiter".

### C. Story (40-58 s)
"What would happen if..." or a real event retold on a running clock (T+0 s, T+1 min, T+1 year...). 5-7 beats of 6-9 s, each a bigger jump in time, each ending on a hook into the next. Examples: "What if the Moon disappeared", "The first hour of a supervolcano", "Earth after humans vanish".

## Workflow

1. **Pick a topic.** If the user gave only a vague area, propose 3 options (format + title + frame-0 line) from `references/topics.md` and let them choose (skip if they said "no questions"). Prefer topics with search demand and a natural endpoint.
2. **Research and lock data.** Write `data.json`: every item/waypoint with value, unit, source URL. Use primary or reputable sources (NASA, NOAA, USGS, Guinness, peer-reviewed papers, encyclopedias). Mark disputed values "est." on screen. Do all unit maths in one place.
3. **Script.** Use `references/scripts.md` for the format. 60-140 words, never more (keeps it under 55 s at ~160 wpm). Numbers written as spoken.
4. **Voice.** `python3 scripts/voiceover.py script.txt out/` -> `out/vo.mp3`, `out/words.json` (word timings), `out/duration.txt`. If duration > 58 s, cut and redo. Scene timings come from `words.json`.
5. **Animate.** Read `/hyperframes` and obey its contract (use `/hyperframes-registry` for counters, captions, camera moves first). `npx hyperframes init <slug> --skip-skills`; one sub-composition per beat; all figures from a data module generated from `data.json`; captions from `words.json`. Root `data-duration` = VO duration + 0.5 s (< 60). Then `npx hyperframes check --json` and snapshot-review frame 0, the open-loop moment and the payoff. For Remotion: same scene list driven by `useCurrentFrame()`.
6. **Sound + master.** Write `out/sfx.txt` (`seconds file.wav gain_db` per cue, bed at 0), then `scripts/master.sh render.mp4 out/vo.mp3 out/sfx.txt final.mp4` (-14 LUFS, -1 dBTP).
7. **Package.** `out/post.md`: title <= 50 chars naming the endpoint ("How Deep the Ocean Really Is"), description with sources, 3-5 hashtags, a pinned question that sparks replies.

## Quality check before delivering

- Under 60 s (check `ffprobe` on final.mp4).
- Frame 0 states the promise and works as a thumbnail with sound off.
- Progress element visible the whole time; nothing static past 3 s.
- Open loop at 60-70%; payoff in the last 3 s; no outro; last line loops into the first.
- Every value matches `data.json`; sources in the description.
- One gold accent; red used once; loudness -14 LUFS.

## Never

- Go over 60 seconds.
- Invent numbers or present estimates as fact.
- Copy another channel's name, graphics, characters or catchphrases.
- Use clickbait the video doesn't pay off; the payoff must be the endpoint promised in frame 0.
