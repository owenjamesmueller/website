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
Every sentence is transcribed right after it is generated (faster-whisper) and re-generated with a new seed if
the words don't match the script (garbled words, a repeated line, a dropped word), up to --tries times.
Parts are cached in <out>_parts/; --redo 3,5 regenerates only those sentence numbers (1-based) and re-joins.
"""
import argparse, re, numpy as np, soundfile as sf, torch
from chatterbox.tts import ChatterboxTTS
ap = argparse.ArgumentParser(); ap.add_argument("script"); ap.add_argument("out")
ap.add_argument("--voice"); ap.add_argument("--ex", type=float, default=0.55); ap.add_argument("--cfg", type=float, default=0.45)
ap.add_argument("--gap", type=float, default=0.18)
ap.add_argument("--tries", type=int, default=4); ap.add_argument("--min-match", type=float, default=0.9)
ap.add_argument("--redo", default="")
a = ap.parse_args()
import os, difflib
from faster_whisper import WhisperModel
asr = WhisperModel("small", compute_type="int8")
NUM = {"0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine", "10": "ten",
       "11": "eleven", "12": "twelve", "13": "thirteen", "19": "nineteen", "20": "twenty", "25": "twentyfive", "50": "fifty"}
def words(t): return [NUM.get(w, w) for w in re.sub(r"[^a-z0-9 ]", " ", t.lower().replace("-", " ").replace("'", "")).split()]
def match(wav, sr, sent):
    import librosa
    y = librosa.resample(wav.astype(np.float32), orig_sr=sr, target_sr=16000)
    heard = " ".join(seg.text for seg in asr.transcribe(y, language="en", beam_size=5)[0])
    a_, b_ = words(sent), words(heard)
    return difflib.SequenceMatcher(None, "".join(a_), "".join(b_)).ratio() if a_ else 1.0, heard.strip()
PARTS = a.out.rsplit(".", 1)[0] + "_parts"; os.makedirs(PARTS, exist_ok=True)
REDO = {int(x) for x in a.redo.split(",") if x.strip()}
LEVEL = {"hook": 0.75, "turn": 0.7, "payoff": 0.75, "calm": 0.4}
text = open(a.script).read().strip()
parts = re.findall(r'\s*(?:\[(hook|turn|payoff|calm)\]\s*)?([^.!?\[]+[.!?]+)', text)
m = ChatterboxTTS.from_pretrained(device="cpu")
out = []; n = 0
for tag, sent in parts:
    sent = re.sub(r'\[(hook|turn|payoff|calm)\]', '', sent).strip()   # never let a tag be spoken
    if not sent: continue
    n += 1; ex = LEVEL.get(tag, a.ex); fp = os.path.join(PARTS, f"{n:02d}.wav")
    if os.path.exists(fp) and n not in REDO:
        w, _ = sf.read(fp, dtype="float32"); print(f"#{n} cached  {sent[:60]}", flush=True)
    else:
        best = (-1, None, "")
        for k in range(a.tries):
            torch.manual_seed(7 + 1000 * n + 17 * k + (99 if n in REDO else 0))
            w = m.generate(sent, audio_prompt_path=a.voice, exaggeration=ex, cfg_weight=a.cfg).squeeze(0).numpy()
            r, heard = match(w, m.sr, sent)
            if r > best[0]: best = (r, w, heard)
            print(f"#{n} [{tag or '-'} {ex}] try {k + 1}: match {r:.2f}  heard: {heard[:70]}", flush=True)
            if r >= a.min_match: break
        w = best[1]; sf.write(fp, w, m.sr)
        if best[0] < a.min_match: print(f"  WARNING #{n} best match only {best[0]:.2f}: rephrase it (spell numbers/names out) and --redo {n}", flush=True)
    out += [w, np.zeros(int(m.sr * a.gap), dtype=w.dtype)]
sf.write(a.out, np.concatenate(out), m.sr)
print("wrote", a.out)
