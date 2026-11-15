#!/usr/bin/env python3
"""Free, EXPRESSIVE local narration with Chatterbox (MIT, Resemble AI; output carries Resemble's
imperceptible AI watermark — keep it). Sentence-by-sentence so each line gets its own intensity.

usage: python3 -I tts_chatterbox.py script.txt out.wav [--voice ref.wav] [--ex 0.55] [--cfg 0.45]
  Mark emphasis per sentence in the script with a leading tag:  [hook] [turn] [payoff] [calm]
  (hook/turn/payoff = more exaggeration, calm = less). Untagged sentences use --ex.
  --voice: a short clean reference clip for timbre. Use a LICENSED voice only (e.g. a Kokoro clip
  made with tts_kokoro.py, or the user's own voice with consent). Never a real person's voice without consent.
Setup (once): pip install --no-deps chatterbox-tts && pip install s3tokenizer conformer==0.3.2 diffusers
  resemble-perth omegaconf pyloudnorm safetensors torchaudio "transformers>=4.46" "setuptools<81"
CPU speed: roughly 2–4x real time.
"""
import argparse, re, numpy as np, soundfile as sf, torch
from chatterbox.tts import ChatterboxTTS
ap = argparse.ArgumentParser(); ap.add_argument("script"); ap.add_argument("out")
ap.add_argument("--voice"); ap.add_argument("--ex", type=float, default=0.55); ap.add_argument("--cfg", type=float, default=0.45)
ap.add_argument("--gap", type=float, default=0.18)
a = ap.parse_args()
torch.manual_seed(7)
LEVEL = {"hook": 0.75, "turn": 0.7, "payoff": 0.75, "calm": 0.4}
text = open(a.script).read().strip()
parts = re.findall(r'\s*(?:\[(hook|turn|payoff|calm)\]\s*)?([^.!?\[]+[.!?]+)', text)
m = ChatterboxTTS.from_pretrained(device="cpu")
out = []
for tag, sent in parts:
    sent = re.sub(r'\[(hook|turn|payoff|calm)\]', '', sent).strip()   # never let a tag be spoken
    if not sent: continue
    ex = LEVEL.get(tag, a.ex)
    w = m.generate(sent, audio_prompt_path=a.voice, exaggeration=ex, cfg_weight=a.cfg).squeeze(0).numpy()
    out += [w, np.zeros(int(m.sr * a.gap), dtype=w.dtype)]
    print(f"[{tag or '-'} {ex}] {len(w) / m.sr:.1f}s  {sent[:60]}", flush=True)
sf.write(a.out, np.concatenate(out), m.sr)
print("wrote", a.out)
