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
Parts are cached in <out>_parts/ by sentence text, so editing or inserting lines only generates the changed ones;
--redo 3,5 regenerates those sentence numbers (1-based) and re-joins.
"""
import argparse, re, numpy as np, soundfile as sf, torch
from chatterbox.tts import ChatterboxTTS
ap = argparse.ArgumentParser(); ap.add_argument("script"); ap.add_argument("out")
ap.add_argument("--voice"); ap.add_argument("--ex", type=float, default=0.55); ap.add_argument("--cfg", type=float, default=0.45)
ap.add_argument("--gap", type=float, default=0.18)
ap.add_argument("--tries", type=int, default=4); ap.add_argument("--min-match", type=float, default=0.9)
ap.add_argument("--redo", default="")
a = ap.parse_args()
import os, difflib, hashlib
from faster_whisper import WhisperModel
asr = WhisperModel("small", compute_type="int8")
ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split()
def n2w(n):          # 99 -> "ninety nine", 100 -> "one hundred" (the recognizer writes digits; scripts spell numbers out)
    if n < 20: return ONES[n]
    if n < 100: return TENS[n // 10] + ("" if n % 10 == 0 else " " + ONES[n % 10])
    if n < 1000: return ONES[n // 100] + " hundred" + ("" if n % 100 == 0 else " " + n2w(n % 100))
    return n2w(n // 1000) + " thousand" + ("" if n % 1000 == 0 else " " + n2w(n % 1000))
def words(t):
    t = re.sub(r"(\d),(\d)", r"\1\2", t.lower()).replace("-", " ").replace("'", "")
    t = re.sub(r"\d+", lambda m: " " + n2w(int(m.group())) + " ", t)
    return re.sub(r"[^a-z ]", " ", t).split()
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
    n += 1; ex = LEVEL.get(tag, a.ex)
    fp = os.path.join(PARTS, hashlib.md5(f"{tag}|{sent}|{a.voice}|{a.cfg}".encode()).hexdigest()[:12] + ".wav")   # cache by text: edit/insert lines freely
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
