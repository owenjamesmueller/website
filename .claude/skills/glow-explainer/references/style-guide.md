# Style guide: glow explainer

Derived frame by frame from the two narrated reference videos ("smartest person
you know is probably broke", "the more you try to make money the harder it is to
get rich"). Match it closely; it is the whole look.

## Canvas
- 1080×1920, near-black `#050505`. Soft white haze at top centre, heavy vignette at the edges, faint film grain. (`base.css` does all of this.)
- No gradients or colour fills on objects. Everything is white line-art or solid white silhouettes with a soft glow (`drop-shadow 0 0 14px rgba(255,255,255,.55)`), added automatically to every component.
- Secondary or "other people" elements are mid grey `#8a8a8a`, without glow.

## Layout (vertical thirds)
| zone | y range | contents |
|---|---|---|
| top label | 250–400 | context pill ("EXPLAINS EVERYTHING ABOUT MONEY", "WHAT WENT WRONG?") |
| idea zone | 420–1050 | icons, cards, headline, stats, charts |
| figure zone | 1050–1400 | the hero figure standing on the dashed floor at y≈1380 |
| below floor | 1400–1920 | mostly empty black; captions are NOT used |

The hero is usually centred. With two-sided comparisons, objects sit at x=360 and x=720 and the hero stays centred below them.

## The hero figure
- Faceless: a solid white circle head over a solid white "tombstone" body (rounded top, flat bottom). No face, no legs.
- Props identify the character: a graduation cap (the "smart kid"), arm up (answering), arm pointing (presenting), sitting at a desk (stuck in an average job).
- Other people are the same shape in grey, smaller, often in rows (classroom, crowd, "most people").
- The floor is a dashed white line across the full width.

## Labels & text
- **Pill**: small uppercase, heavy (800), wide tracking (0.12em), white fill with black text, ~22 px. Sits above the thing it names.
- **Stat**: tiny tracked caption ("IQ", "YEARS LATER", "MONEY MADE", "PAID") over a huge heavy number (96–140 px). Numbers always count up or down.
- **Headline box**: outlined rounded rectangle with a big uppercase line and a tiny caption above it (e.g. "SCHOOL / KNOW → THEN ACT").
- **Card**: outlined rounded panel with an inverted title bar ("WHAT WENT WRONG?") and rows that get ✓ or ✗ icons.
- Font: Inter 800/900 (fallback Helvetica/Arial). There are never sentence-case subtitles.

## Recurring visual devices
- Spotlight cone from the top on the "chosen" figure.
- Dashed or dotted circles around icons; `=` / `≠` between two circles.
- An exam sheet card with a typed line, then a big ✓ (rewarded) or a huge ✗ drawn over it (punished).
- A bell curve with a dot at the centre ("average job"), or an exponential curve that a rocket rides up ("results").
- A cliff edge (the floor ends in a jagged drop) for risk and uncertainty; fog clouds for the unknown.
- A clock or stopwatch whose hand sweeps for time passing, plus "YEARS LATER +19" counters.
- Flying sheets or icons arcing across the screen as a transition.
- An Instagram-style handle top-right at y≈300 throughout, and a centred end card for the final 1.5 s.

## Motion
- Entrances: `pop` (scale 0.6→1 with back ease, 0.45 s) for icons and pills; fade plus 30–40 px rise for groups.
- Exits: fade plus 30 px rise, 0.3 s, eased in.
- Camera: slow push-ins and pull-backs (scale 0.8–1.15) at scene changes, inOut, ~1.2 s. The world moves; the viewer never cuts.
- Emphasis: a quick elastic wobble (rotate ±8°) on the key object when its word is spoken.
- Lines draw on (`draw: [0,1]`) for charts, paths and the cross over the exam.
- Timing: the visual lands on the spoken keyword, never before it. A new visual beat roughly every 1–1.5 s.

## Big-character style (the "settled people" reference) — preferred for stories
- **Characters are large** (`person(x, floorY, {size: 0.9})` ≈ 400 px tall, a third of the frame width) with chunky
  arms that pose: `idle up both point hold type shrug wave carry` (`p.pose(t, 'both')`). Poses ARE the acting:
  celebrate = both, mock = point, confused = shrug, working = type at a `desk`, holding a thing = hold/carry.
- **One-word captions UNDER the floor** (`caption('YOU: WORK', x, floorY)`), not pills over heads. Format
  "NAME: VERB" when two characters are on stage ("MARCUS: SPENDS", "JAKE: PLANTS"). Swap captions as the story moves.
- **Sparse frames**: 1–3 things on screen. One small label above if needed. Lots of black.
- **Abstract ideas become objects** (the core trick):
  ambition = a flame you hold · advice = stacked speech bubbles · sabotage disguised as care = a gift box with an
  extinguisher inside · progress = a tall glowing bar · changing your life = pushing a boulder · goals = a mountain
  vs a tent · your circle = a literal room with ceiling lamps · energy = a battery charging · money that grows = a
  seed → tree raining gold coins (`sprout`, `tree().grow().rain()`) · lifestyle creep = a bucket leaking through holes
  labelled CAR / RENT / PHONE (`bucket().fill().leak()`).
- **Rooms and lamps** (`room`, ceiling lamps throw a soft light pool) for "where you are"; protest-style `sign`s
  on sticks for what a crowd says ("LIFE IS SHORT", "WE'RE YOUNG").
- **Ends on a title card**: two or three huge words that turn the moral into an instruction
  (`titleCard('Choose<br>your room.')`, `titleCard('Plant it<br>early.')`), held ~2 s, then the handle.
