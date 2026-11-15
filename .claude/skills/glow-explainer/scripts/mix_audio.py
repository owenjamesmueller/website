#!/usr/bin/env python3
"""Mix voice + timed sound effects into one track.

usage: python3 -I mix_audio.py <project_dir> [--sfx-gain 0.8] [--duration 70]
Reads <project>/sfx.json ([{name,t,vol}], written by render.cjs from window.SFX) and
<project>/voice.mp3; SFX files come from <project>/sfx/ or the skill's assets/sfx/.
Writes <project>/mix.wav. Voice is ducked slightly under nothing — SFX are kept under the voice.
"""
import json, os, subprocess, sys, argparse
ap = argparse.ArgumentParser(); ap.add_argument("dir"); ap.add_argument("--sfx-gain", type=float, default=0.8)
ap.add_argument("--duration", type=float, default=None)
a = ap.parse_args()
d = os.path.abspath(a.dir)
here = os.path.dirname(os.path.abspath(__file__))
lib = [os.path.join(d, "sfx"), os.path.join(here, "..", "assets", "sfx")]
ev = json.load(open(os.path.join(d, "sfx.json")))
voice = os.path.join(d, "voice.mp3")
inputs, parts = [], []
if os.path.exists(voice):
    inputs += ["-i", voice]; parts.append("[0:a]aresample=48000,aformat=channel_layouts=stereo,volume=1.0[v0]")
labels = ["[v0]"] if parts else []
n0 = len(inputs) // 2
used = 0
for i, e in enumerate(ev):
    f = next((os.path.join(p, e["name"] + ".wav") for p in lib if os.path.exists(os.path.join(p, e["name"] + ".wav"))), None)
    if not f: print("missing sfx:", e["name"]); continue
    k = n0 + used; used += 1
    inputs += ["-i", f]
    ms = max(0, int(e["t"] * 1000))
    parts.append(f"[{k}:a]aresample=48000,aformat=channel_layouts=stereo,volume={e['vol'] * a.sfx_gain:.3f},adelay={ms}|{ms}[s{k}]")
    labels.append(f"[s{k}]")
mix = "".join(labels) + f"amix=inputs={len(labels)}:normalize=0:dropout_transition=0,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000,apad[out]"
cmd = ["ffmpeg", "-y", "-v", "error"] + inputs + ["-filter_complex", ";".join(parts) + ";" + mix, "-map", "[out]"]
if a.duration: cmd += ["-t", str(a.duration)]
cmd += [os.path.join(d, "mix.wav")]
subprocess.run(cmd, check=True)
print(f"mix.wav: voice + {used} sound effects")
