#!/usr/bin/env python3
"""Score candidate voices against a reference clip by speaker similarity.

usage: python3 -I check_voice.py reference.(wav|mp3|mp4) cand1.mp3 [cand2.mp3 ...]
Same speaker ~0.85+; same "type" of voice ~0.65-0.75; unrelated <0.6.
Needs: pip install torch librosa resemblyzer webrtcvad-wheels  (resemblyzer with --no-deps if webrtcvad fails to build)
"""
import os, sys
import librosa
from resemblyzer import VoiceEncoder, preprocess_wav

enc = VoiceEncoder("cpu")
def emb(p, off=0, dur=None):
    y, _ = librosa.load(p, sr=16000, offset=off, duration=dur)
    return enc.embed_utterance(preprocess_wav(y))

ref = emb(sys.argv[1], 0, 40)
scores = sorted(((float(ref @ emb(f)), os.path.basename(f)) for f in sys.argv[2:]), reverse=True)
for s, n in scores:
    print(f"{s:.3f}  {n}")
