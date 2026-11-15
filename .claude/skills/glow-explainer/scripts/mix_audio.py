#!/usr/bin/env python3
"""Mix voice + timed sound effects into one track, with ducking and an AUDIO CHECK.

usage: python3 -I mix_audio.py <project_dir> [--sfx-gain 0.8] [--duration 70] [--margin 9]
Reads <project>/sfx.json ([{name,t,vol,dur}], written by render.cjs from window.SFX) and <project>/voice.mp3;
SFX files come from <project>/sfx/ or the skill's assets/sfx/. Writes <project>/mix.wav and audio_report.txt.

1. Ducking: while the narrator talks, the whole SFX bus dips ~7 dB (smooth attack/release), like a real mix.
2. Audio check, every 0.4 s window:
   - while the voice talks, the SFX bus must sit at least --margin dB (default 9) under the voice
   - between lines, no SFX may be louder than the voice's normal speaking level
   Any event that breaks a rule is turned down by exactly what it needs (repeated until clean) and listed in
   audio_report.txt, so nothing drowns the voice (e.g. a brass sting under the hook). Exit 0 always; read the report.
"""
import json, os, subprocess, argparse, io
import numpy as np, soundfile as sf

ap = argparse.ArgumentParser(); ap.add_argument("dir"); ap.add_argument("--sfx-gain", type=float, default=0.8)
ap.add_argument("--duration", type=float, default=None); ap.add_argument("--margin", type=float, default=9)
a = ap.parse_args()
d = os.path.abspath(a.dir); here = os.path.dirname(os.path.abspath(__file__))
lib = [os.path.join(d, "sfx"), os.path.join(here, "..", "assets", "sfx")]
SR = 48000
ev = json.load(open(os.path.join(d, "sfx.json")))
voice_p = os.path.join(d, "voice.mp3"); has_voice = os.path.exists(voice_p)

def load(path):
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "wav", "-ac", "2", "-ar", str(SR), "-"], capture_output=True).stdout
    x, _ = sf.read(io.BytesIO(pcm), dtype="float32"); return x if x.ndim == 2 else np.stack([x, x], 1)

voice = load(voice_p) if has_voice else np.zeros((SR, 2), np.float32)
T = int(SR * (a.duration or max([len(voice) / SR] + [e["t"] + (e.get("dur") or 4) for e in ev]) + 0.5))
V = np.zeros((T, 2), np.float32); V[:min(T, len(voice))] = voice[:T]

# place every event as its own clip (so the check can blame and fix single events)
clips, cache = [], {}
for e in ev:
    f = next((os.path.join(p, e["name"] + ".wav") for p in lib if os.path.exists(os.path.join(p, e["name"] + ".wav"))), None)
    if not f or e["vol"] <= 0: (not f) and print("missing sfx:", e["name"]); continue
    if f not in cache: cache[f] = load(f)
    x = cache[f]
    if e.get("dur"):
        n = int(e["dur"] * SR); x = x[:n].copy(); fd = min(len(x), int(0.2 * SR)); x[len(x) - fd:] *= np.linspace(1, 0, fd)[:, None]
    s0 = max(0, int(e["t"] * SR)); x = x[:max(0, T - s0)]
    if len(x): clips.append({"name": e["name"], "t": e["t"], "s0": s0, "x": x, "g": e["vol"] * a.sfx_gain, "cut_db": 0.0})

def env(sig, win=0.05):                       # smoothed amplitude envelope (mono RMS)
    m = (sig ** 2).mean(1); k = int(win * SR); c = np.convolve(m, np.ones(k) / k, "same"); return np.sqrt(c + 1e-12)
db = lambda v: 20 * np.log10(np.maximum(v, 1e-9))

# ducking gain from the voice envelope (talking -> -7 dB), 30 ms attack, 300 ms release
duck = np.ones(T, np.float32)
if has_voice:
    talk = (db(env(V, 0.03)) > -38).astype(np.float32)
    target = 1 - talk * (1 - 10 ** (-7 / 20)); g = 1.0; att, rel = 1 - np.exp(-1 / (0.03 * SR)), 1 - np.exp(-1 / (0.3 * SR))
    tg = target[::48]; out = np.empty_like(tg)                               # compute at 1 kHz, then upsample
    att, rel = 1 - np.exp(-1 / 30), 1 - np.exp(-1 / 300)
    for i, v in enumerate(tg): g += (v - g) * (att if v < g else rel); out[i] = g
    duck = np.repeat(out, 48)[:T]; duck = np.pad(duck, (0, T - len(duck)), constant_values=1)

def bus(clips):
    B = np.zeros((T, 2), np.float32)
    for c in clips: B[c["s0"]:c["s0"] + len(c["x"])] += c["x"] * c["g"]
    return B * duck[:, None]

W = int(0.4 * SR); report = []
vw = np.array([np.sqrt((V[i:i + W] ** 2).mean()) for i in range(0, T - W, W)])
speaking = db(vw) > -35
speech_level = np.median(db(vw[speaking])) if speaking.any() else -20
for rnd in range(40):
    B = bus(clips); bad = 0
    bw = np.array([np.sqrt((B[i:i + W] ** 2).mean()) for i in range(0, T - W, W)])
    for k in range(len(bw)):
        # judge against the voice level of the surrounding ~1.2 s (pauses between words are not "quiet voice")
        lv = db(vw[max(0, k - 1):k + 2].max()) if speaking[max(0, k - 1):k + 2].any() else None
        limit = max(lv, speech_level - 6) - a.margin if lv is not None else speech_level - 1
        over = db(bw[k]) - limit
        if over <= 0.5: continue
        bad += 1; s, e_ = k * W, k * W + W
        # blame the loudest clips in this window and turn them down by the overshoot
        en = []
        for c in clips:
            lo, hi = max(s, c["s0"]), min(e_, c["s0"] + len(c["x"]))
            if hi > lo: en.append((np.sqrt(((c["x"][lo - c["s0"]:hi - c["s0"]] * c["g"]) ** 2).mean()), c))
        top = sorted(en, key=lambda z: -z[0])[0][1]          # only the loudest offender, a little at a time
        step = min(over + 0.5, 4); top["g"] *= 10 ** (-step / 20); top["cut_db"] += step
    if not bad: break
fixed = [c for c in clips if c["cut_db"] > 0.5]
for c in sorted(fixed, key=lambda c: c["t"]): report.append(f"  t={c['t']:6.2f}s  {c['name']:22s} turned down {c['cut_db']:.1f} dB (was too loud for the voice)")
B = bus(clips)
mix = V + B
tmp = os.path.join(d, "_premix.wav"); sf.write(tmp, mix, SR, subtype="FLOAT")
master = "loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000" if has_voice else "alimiter=limit=0.7"
cmd = ["ffmpeg", "-y", "-v", "error", "-i", tmp, "-af", master + ",apad"]
if a.duration: cmd += ["-t", str(a.duration)]
subprocess.run(cmd + [os.path.join(d, "mix.wav")], check=True); os.remove(tmp)
bw = np.array([np.sqrt((B[i:i + W] ** 2).mean()) for i in range(0, T - W, W)])
lvl = np.array([db(vw[max(0, k - 1):k + 2].max()) for k in range(len(vw))])
gap = (np.maximum(lvl, speech_level - 6) - db(bw))[speaking] if speaking.any() else np.array([99])
summary = (f"audio check: voice over SFX while talking: min {gap.min():.1f} dB, median {np.median(gap):.1f} dB (rule >= {a.margin:.0f} dB); "
           f"{len(fixed)} event(s) auto-lowered, {'PASS' if gap.min() >= a.margin - 1 else 'CHECK'}")
open(os.path.join(d, "audio_report.txt"), "w").write(summary + "\n" + "\n".join(report) + "\n")
print(f"mix.wav: {'voice + ' if has_voice else ''}{len(clips)} sound effects\n{summary}" + ("\n" + "\n".join(report) if report else ""))
