#!/usr/bin/env python3
"""Word-level timestamps for a voiceover -> words.js for the animation engine.

usage: python3 -I align.py voice.mp3 project_dir/ [--model small]

Writes project_dir/words.js:  window.WORDS=[{word,start,end},...]; window.DURATION=<sec>;
and project_dir/transcript.txt (sentence lines with timings, handy for scene planning).
Needs: pip install faster-whisper soundfile librosa
(If the Hugging Face download fails with a CAS/xet error, set HF_HUB_DISABLE_XET=1.)
"""
import json, os, sys, argparse
import librosa
from faster_whisper import WhisperModel

ap = argparse.ArgumentParser()
ap.add_argument("audio"); ap.add_argument("outdir")
ap.add_argument("--model", default="small")
a = ap.parse_args()

y, sr = librosa.load(a.audio, sr=16000)
dur = len(y) / sr
m = WhisperModel(a.model, compute_type="int8")
segs, _ = m.transcribe(y, word_timestamps=True, language="en")
words, lines = [], []
for s in segs:
    lines.append(f"[{s.start:6.2f} - {s.end:6.2f}] {s.text.strip()}")
    for w in s.words:
        words.append({"word": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)})

os.makedirs(a.outdir, exist_ok=True)
with open(os.path.join(a.outdir, "words.js"), "w") as f:
    f.write("window.WORDS=" + json.dumps(words) + ";\nwindow.DURATION=" + f"{dur + 0.4:.2f}" + ";\n")
with open(os.path.join(a.outdir, "transcript.txt"), "w") as f:
    f.write("\n".join(lines) + "\n")
print("\n".join(lines))
print(f"\n{len(words)} words, {dur:.2f}s, {len(words) / dur * 60:.0f} wpm")
