# Mode A: story formula & scene recipes (any topic)

The formula is topic-agnostic. The quoted lines come from the references (money and success niches); write the
equivalent beat for your topic: a breakup, a gym habit, a business, a school choice, a phone addiction.

## Story formula (mode A) — write a STORY, not a list of facts
Facts don't hold attention; a person with a problem does. The smart-kid reference keeps people
watching because every ~5 seconds it either opens a question or pays one off. Use these beats
(~180 wpm, 55–70 s, 170–210 words):

1. **Paradox hook + open loop** (≤ 5 s). A result that sounds wrong, plus a promise that the reason is coming.
   "The smartest person you know is probably broke, and the reason why explains almost everything about money."
   "Two best friends got the same job at eighteen. Twenty years later, only one of them is rich."
2. **Twist the knife on the mystery** (1 sentence): remove the obvious explanation.
   "…and the crazy part is, they earned almost exactly the same money." / "he didn't get dumber and he never stopped working hard."
3. **A character the viewer already knows**: "the smartest kid from *your* school", or two named friends. Use "he"/"Think about…"/"Imagine…".
4. **Tiny specific moments** (2–3), never abstractions: "had the answer before the teacher finished the question",
   "went straight to the mall and bought new shoes", "everyone laughed at him".
5. **Expectation → betrayal**: "everyone was certain he'd succeed" / "for years it looked like Marcus was winning".
6. **The turn**: "But here's what nobody saw." / "What went wrong is…". Signal the reveal out loud.
7. **The hidden rule** stated as a contrast the viewer can repeat: "school and money play by opposite rules",
   "Marcus got paid by his job. Jake kept buying things that paid him."
8. **Time skip payoff** with a number: "Twenty years later…".
9. **Caveat (optional)**: "Of course, this doesn't mean… because there's a big difference between X and Y" — makes it feel fair.
10. **Callback ending** that recolours the opening: "…people start calling it luck." /
   "Nobody noticed the moment Jake got rich. It happened on that very first payday, while everyone was laughing."

Rules: no lists of tips, no "here are 3 ways", no direct advice to the viewer; let the story imply it. One curiosity
gap in the first 5 s, one "but" turn in the middle, one line people would quote at the end. Write numbers as words.
See `assets/examples/two-friends-story-script.txt` (+ its scenes file) for a full worked example.

## Pick a central metaphor first
Before writing scenes, choose 1–2 physical objects that ARE the idea and follow them through the whole video
(see the style guide's metaphor list). The seed planted on payday becomes the tree at the end; the bucket that
leaks is the same bucket twenty years later. The final title card names the metaphor ("PLANT IT EARLY.").

## Visual storytelling rules
- **A cast, not icons.** Named characters (tags under their feet), on dashed ground rings, with reflections.
  They walk in (`walkIn`), react (`bob` for laughing/excitement, swap to an `arm:'up'` figure for wins), dim when they lose.
- **Light tells you who matters**: `halo` + `spotlight` follow the character the sentence is about; others go to 35 % opacity.
- **A world that changes**: day → night (`moon`, `skyline` with windows lighting up one by one), the payday calendar, the car with
  headlight beam, the bus driving past. Environments from the loop references make it feel like a place.
- **Money is gold** (`goldCoin`, the only accent colour): coins drop on payday, arc into a fund, leak out to payments,
  rain on the character while he sleeps. Following the coins *is* the story.
- **Reactions and voices**: speech bubbles ("HA HA", "Z z z"), notifications ("PAYMENT RECEIVED +$500"), scoreboards
  ("WHO IS WINNING?" ✓/✗), typed code that turns into ERROR lines.
- **Time devices**: flash-forward and rewind with a blur pulse on `#cam` and a "YEARS LATER +20" counter; night counters.
- **Split screen** (dashed centre line) when contrasting two lives; bars that fill for the final comparison.
- **Camera is a storyteller**: push in on "here's what nobody saw", pull back for the rule, constant `drift(cam)`,
  `shake` on impacts (first payment). Render with motion blur (`--mb 3`, the default).
- **Background depth**: dot grid + `bokeh` + stacked bloom (built in).

## Phrase → visual recipes (worked examples from the money references)
These show the *translation habit*: every spoken idea becomes a drawn object, a label and a reaction. Apply
the same habit to any topic (a heart that cracks, a phone battery, a dumbbell, a diploma, a door, a mask).

| narration | visual |
|---|---|
| "smartest", "IQ" | brain icon + "SMARTEST" pill + IQ counter ticking up to 160 |
| "broke", "$0" | wallet icon + "BROKE" pill + "$0" stat; the wallet wobbles |
| "the reason why" | white question-mark bubble pops over the hero |
| "from your school" | camera pulls back to rows of grey students at desks; spotlight finds the hero |
| "had the answer before the teacher finished" | card typing "WHAT IS 7×8…" while the hero's arm shoots up; "56!" bubble |
| "everyone was certain he'd succeed" | grey figures (TEACHER, MOM, DAD, FRIENDS) point up; a trophy rises on a dashed arc |
| "twenty years later" | "YEARS LATER" stat ticks +0→+20, flying papers arc overhead |
| "average job, average money" | bell curve with a dot at the peak + "AVERAGE JOB" pill; hero sits at a desk with a monitor between two posts |
| "nobody can explain what went wrong" | grey figures with "?" bubbles; a card "WHAT WENT WRONG?" with rows RICH ✗ / STILL SMART ✓ |
| "school and money play by opposite rules" | cap icon (SCHOOL) and coin icon (MONEY) split by a vertical dashed line |
| "rewarded for knowing" | exam card "1. 7×8=56" + ✓ + "A+" badge + star over the hero |
| "punished for guessing" | second line "2. ??=42?" + a huge ✗ drawn over the card |
| "being wrong is the most expensive mistake" | ✗ icon "BEING WRONG" with a price tag "$1,000,000" hanging from it |
| "know, then act" vs "act, then know" | boxed headlines "SCHOOL / KNOW → THEN ACT" then "MONEY / ACT → THEN KNOW" |
| "nobody can know in advance" | fog clouds roll in at the right; the floor becomes a cliff edge |
| "only exists once somebody tries" | a figure steps off the cliff and planks appear under each step; "PAID $500" |
| "searching for the perfect plan" | hero at a desk with stacked papers and a laptop, clock hand spinning |
| "someone less gifted launches something embarrassing" | grey figure pointing at a scrappy rocket "V1"; rocket launches, clouds |
| "results get so big people call it luck" | exponential chart; rocket rides the curve; "RESULTS $1,000,000" counter |
| "making money vs getting rich" | two dashed circles: coin "MAKING MONEY" and coin stack "GETTING RICH", first "=", then "≠" + "COMPLETELY DIFFERENT" |
| "harder" | figure pushing up a ramp, the "INCLINE 20°" label ticks to 39° |
| "as soon as possible" | stopwatch "WAITED: 0 DAYS"; coin flies to the figure; "PAID: $100" |
| "keeps paying you" | money-machine box with coins dropping out, a "$55,829 YEAR 5" counter |
| "can't focus on both" | two spotlights from one figure with focus percentages 100/0 → 56/44 |
| "every decision pays off immediately" | three decision cards with NOW ✓ / LATER struck through |
| "an audience", "something to sell" | dotted circles with people icons and a product box, then crossed out |
| "start from zero every morning" | "TIMES HE GOT PAID" odometer ticking while a calendar flips to "YEAR 9" |

When the script says something not in this table, invent a visual in the same
vocabulary: an outline icon, a pill naming it, a number that moves, and the
hero reacting.
