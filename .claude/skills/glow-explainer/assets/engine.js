/* Glow Explainer engine — deterministic, seekable timeline.
 * Every frame is a pure function of time t (seconds). The renderer calls
 * window.__seek(t) then screenshots, so nothing may depend on wall-clock time,
 * requestAnimationFrame, CSS transitions/animations or Math.random().
 *
 * API (all times in seconds):
 *   tw(el, t0, dur, {opacity:[a,b], x:[a,b], y, scale, rotate, blur, draw, glow}, ease)
 *   show(el, t0, t1, fade=.25)        fade in at t0, fade out at t1
 *   pop(el, t0)                        scale+fade "pop" entrance (back ease)
 *   count(el, t0, dur, from, to, fmt) number counter
 *   type(el, t0, dur, text)            typewriter
 *   on(fn)                             custom per-frame hook fn(t)
 *   cue("phrase", offset=0)            start time of a phrase in the voiceover (from words.js)
 *   cueEnd("phrase")                   end time of that phrase
 *   rand(seed)                         deterministic pseudo-random in [0,1)
 */
(function () {
  const tracks = new Map(); // el -> [{t0,t1,props,ease}]
  const hooks = [];
  const $ = (s) => (typeof s === 'string' ? document.querySelector(s) : s);

  const EASE = {
    linear: (x) => x,
    in: (x) => x * x * x,
    out: (x) => 1 - Math.pow(1 - x, 3),
    inOut: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    expo: (x) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x)),
    back: (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
    elastic: (x) => (x === 0 || x === 1 ? x : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1),
  };
  const DEFAULTS = { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, blur: 0, draw: 1, glow: 1 };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function tw(el, t0, dur, props, ease = 'out') {
    el = $(el);
    if (!el) throw new Error('tw: element not found ' + el);
    if (!tracks.has(el)) tracks.set(el, []);
    tracks.get(el).push({ t0, t1: t0 + Math.max(dur, 1e-4), props, ease: EASE[ease] || ease });
    return el;
  }
  function show(el, t0, t1, fade = 0.25) {
    tw(el, t0, fade, { opacity: [0, 1] });
    if (t1 != null) tw(el, t1 - fade, fade, { opacity: [1, 0] }, 'in');
    return $(el);
  }
  function pop(el, t0, dur = 0.45) {
    return tw(el, t0, dur, { opacity: [0, 1], scale: [0.6, 1] }, 'back');
  }
  // fade a list of elements up and out together (scene exit)
  function out(els, t0, dur = 0.3) {
    for (const el of [].concat(els)) tw(el, t0, dur, { opacity: [1, 0], y: [0, -30] }, 'in');
  }
  // move from (x0,y0) to (x1,y1) along an arc (coins, sheets, flying icons)
  function arc(el, t0, dur, dx, dy, lift = 260) {
    tw(el, t0, dur, { x: [0, dx] }, 'linear');
    tw(el, t0, dur / 2, { y: [0, -lift] }, 'out');
    tw(el, t0 + dur / 2, dur / 2, { y: [-lift, dy] }, 'in');
    return $(el);
  }
  function count(el, t0, dur, from, to, fmt = (v) => Math.round(v).toLocaleString('en-US')) {
    el = $(el);
    hooks.push((t) => {
      const p = EASE.out(clamp((t - t0) / dur, 0, 1));
      el.textContent = fmt(from + (to - from) * p);
    });
    return el;
  }
  function type(el, t0, dur, text, caret = true) {
    el = $(el);
    hooks.push((t) => {
      const n = Math.floor(clamp((t - t0) / dur, 0, 1) * text.length);
      const blink = caret && t >= t0 && Math.floor(t * 2) % 2 === 0 ? '|' : '';
      el.textContent = text.slice(0, n) + (n < text.length || t < t0 + dur + 0.6 ? blink : '');
    });
    return el;
  }
  function on(fn) { hooks.push(fn); }

  // ---- voiceover cues -------------------------------------------------
  const norm = (w) => w.toLowerCase().replace(/[^a-z0-9$%]/g, '');
  function findPhrase(phrase, from = 0) {
    const W = window.WORDS || [];
    const target = phrase.split(/\s+/).map(norm).filter(Boolean);
    for (let i = 0; i < W.length; i++) {
      if (W[i].start < from) continue;
      let ok = true;
      for (let j = 0; j < target.length; j++) {
        if (!W[i + j] || norm(W[i + j].word) !== target[j]) { ok = false; break; }
      }
      if (ok) return [W[i], W[i + target.length - 1]];
    }
    console.warn('cue not found:', phrase);
    return null;
  }
  function cue(phrase, offset = 0, from = 0) { const m = findPhrase(phrase, from); return m ? m[0].start + offset : NaN; }
  function cueEnd(phrase, offset = 0, from = 0) { const m = findPhrase(phrase, from); return m ? m[1].end + offset : NaN; }

  function rand(seed) { const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }

  // ---- per-frame evaluation ------------------------------------------
  function valueAt(list, prop, t) {
    let started = null, first = null;
    for (const k of list) {
      if (!(prop in k.props)) continue;
      if (!first) first = k;
      if (t >= k.t0) started = k;
    }
    if (!first) return DEFAULTS[prop];
    if (!started) return first.props[prop][0];
    const [a, b] = started.props[prop];
    const p = started.ease(clamp((t - started.t0) / (started.t1 - started.t0), 0, 1));
    return a + (b - a) * p;
  }
  function apply(el, list, t) {
    const v = {};
    for (const prop of Object.keys(DEFAULTS)) v[prop] = valueAt(list, prop, t);
    el.style.opacity = v.opacity;
    el.style.visibility = v.opacity <= 0.001 ? 'hidden' : 'visible';
    el.style.transform = `translate(${v.x}px, ${v.y}px) rotate(${v.rotate}deg) scale(${v.scale})`;
    const glow = el.dataset.glow !== undefined ? ` drop-shadow(0 0 ${14 * v.glow}px rgba(255,255,255,${0.55 * v.glow}))` : '';
    el.style.filter = (v.blur > 0.01 ? `blur(${v.blur}px)` : '') + glow || 'none';
    if (list.some((k) => 'draw' in k.props)) {
      const paths = el.matches('path,line,polyline,circle,rect,ellipse') ? [el] : el.querySelectorAll('path,line,polyline,circle,rect,ellipse');
      paths.forEach((p) => {
        const len = p.__len || (p.__len = p.getTotalLength ? p.getTotalLength() : 1000);
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = len * (1 - v.draw);
      });
    }
  }
  window.__seek = function (t) {
    for (const [el, list] of tracks) apply(el, list, t);
    for (const h of hooks) h(t);
    document.documentElement.style.setProperty('--t', t);
  };

  Object.assign(window, { tw, show, pop, out, arc, count, type, on, cue, cueEnd, rand, EASE, $ });
})();
