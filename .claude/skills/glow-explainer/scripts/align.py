#!/usr/bin/env python3
"""Word-level timestamps for a voiceover -> words.js for the animation engine.

usage: python3 -I align.py voice.mp3 project_dir/ [--model small] [--script script_tagged.txt]

--script: use the SCRIPT's words (exact spelling, numbers as written, names) with the recognizer's timings,
so cues and subtitles never depend on transcription mistakes ("crack laptop", "12", "at night team").

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
ap.add_argument("--model", default="small"); ap.add_argument("--script")
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

if a.script:
    import re, difflib
    txt = re.sub(r"\[(hook|turn|payoff|calm)\]", " ", open(a.script).read())
    S = txt.split(); key = lambda w: re.sub(r"[^a-z0-9]", "", w.lower())
    sm = difflib.SequenceMatcher(None, [key(w["word"]) for w in words], [key(w) for w in S], autojunk=False)
    out = []
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == "equal":
            out += [{"word": S[j1 + k], "start": words[i1 + k]["start"], "end": words[i1 + k]["end"]} for k in range(i2 - i1)]
        elif j2 > j1:                                             # spread the script words over the heard span
            t0 = words[i1]["start"] if i1 < len(words) else (out[-1]["end"] if out else 0)
            t1 = words[i2 - 1]["end"] if i2 > i1 else (words[i2]["start"] if i2 < len(words) else t0 + 0.3 * (j2 - j1))
            step = max(0.05, (t1 - t0) / (j2 - j1))
            out += [{"word": S[j], "start": round(t0 + (j - j1) * step, 3), "end": round(t0 + (j - j1 + 1) * step, 3)} for j in range(j1, j2)]
    print(f"script alignment: {sum(b.size for b in sm.get_matching_blocks())}/{len(S)} words matched exactly")
    words = out
os.makedirs(a.outdir, exist_ok=True)
with open(os.path.join(a.outdir, "words.js"), "w") as f:
    f.write("window.WORDS=" + json.dumps(words) + ";\nwindow.DURATION=" + f"{dur + 0.4:.2f}" + ";\n")
with open(os.path.join(a.outdir, "transcript.txt"), "w") as f:
    f.write("\n".join(lines) + "\n")
print("\n".join(lines))
print(f"\n{len(words)} words, {dur:.2f}s, {len(words) / dur * 60:.0f} wpm")
