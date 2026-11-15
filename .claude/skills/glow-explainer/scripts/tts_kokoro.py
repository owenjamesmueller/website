#!/usr/bin/env python3
"""Free local narration with Kokoro (Apache-2.0) — no credits needed. Drafts or finals.

usage: python3 -I tts_kokoro.py script.txt out.wav [--voice af_alloy] [--speed 1.03]
First run: pip install kokoro-onnx soundfile, and download the model files once into ~/.cache/kokoro/:
  https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
  https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
af_alloy scored 0.695 against the reference narrator (ElevenLabs Laura v3: 0.73, Flash: 0.685).
Then process exactly like an ElevenLabs take (silence trim + post_filter from voice.json) and run align.py.
"""
import argparse, os, soundfile as sf
from kokoro_onnx import Kokoro
ap = argparse.ArgumentParser(); ap.add_argument("script"); ap.add_argument("out")
ap.add_argument("--voice", default="af_alloy"); ap.add_argument("--speed", type=float, default=1.03)
ap.add_argument("--models", default=os.path.expanduser("~/.cache/kokoro"))
a = ap.parse_args()
k = Kokoro(os.path.join(a.models, "kokoro-v1.0.onnx"), os.path.join(a.models, "voices-v1.0.bin"))
audio, sr = k.create(open(a.script).read().strip(), voice=a.voice, speed=a.speed, lang="en-us")
sf.write(a.out, audio, sr); print(f"{a.out}: {len(audio) / sr:.1f}s with {a.voice}")
