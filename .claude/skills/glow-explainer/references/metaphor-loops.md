# Mode B: metaphor loops (12–16 s, no narration)

From the five short references: one wordless visual comparison, one line of
typewriter text, then the handle end card.

## Anatomy
- Background: black with a dark grey ground plane (`#151515` → `#0a0a0a`) and a subtle reflection under the figures.
- Characters: **stick figures**: white round head, 8–10 px white limbs, joints animated by rotating limb groups. Grey for the crowd and the "loser" path.
- Text: tiny uppercase monospace-like heading at the top (y≈180), typed letter by letter: "WHAT A WEEK FEELS LIKE.", "DON'T FOLLOW BLINDLY.", "SAME 5 MINUTES. DIFFERENT DAY."
- Split screen: two stacked panels (top/bottom), each with a left-aligned label ("LUXURY FIRST" / "ASSETS FIRST", "5 MINUTES" / "NO TIME"), and the same timeline playing in both so the outcomes diverge.
- One accent colour allowed: gold coins, red blindfolds, a red neon "MON" sign, green cash.
- Last ~2 s: fade to black, centred handle.

## Proven concepts
| concept | top | bottom / payoff |
|---|---|---|
| luxury first vs assets first | buys a car first, coins drain, the car fades | builds the house, then the car appears for free from house income |
| following blindly | a crowd of blindfolded figures walks off a cliff | one figure removes the blindfold and pulls others back |
| 5 minutes | alarm off → push-ups → shower → ready (timer ring) | snooze, snooze ×2, rushed door; then both walk outside, one tired |
| what a week feels like | bike rides uphill MON→THU, downhill fast SAT–SUN | then a giant wall labelled MON in red neon |
| income vs expenses | slow turtles carry cash into a wallet | rabbits sprint out with it |

## Stick figure snippet (add to the project's components.js)
```js
function stick(x, y, {size=1, color='#fff', parent}={}) {
  const el = document.createElement('div');
  el.innerHTML = `<svg width="120" height="260" viewBox="-60 -20 120 260" style="overflow:visible">
    <g stroke="${color}" stroke-width="9" stroke-linecap="round" fill="none">
      <circle cx="0" cy="10" r="20" fill="${color}" stroke="none"/>
      <line x1="0" y1="32" x2="0" y2="130"/>
      <g class="armL"><line x1="0" y1="50" x2="-35" y2="110"/></g>
      <g class="armR"><line x1="0" y1="50" x2="35" y2="110"/></g>
      <g class="legL"><line x1="0" y1="130" x2="-25" y2="230"/></g>
      <g class="legR"><line x1="0" y1="130" x2="25" y2="230"/></g>
    </g></svg>`;
  // walk cycle: on(t => { const a = Math.sin(t*8)*25;
  //   el.querySelector('.legL').setAttribute('transform', `rotate(${a} 0 130)`); ... })
  return place(el, x, y, {parent, anchor:'bottom', z:5});
}
```
(`place` is internal to components.js: define `stick` inside that file's IIFE and export it.)
