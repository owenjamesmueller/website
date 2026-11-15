#!/usr/bin/env python3
"""Stutter check for a rendered video: finds frozen frames inside motion, and jumps.

usage: python3 -I check_motion.py out.mp4 [--fps 60]
How: decodes every frame (small grayscale), measures how much each frame differs from the previous one.
  - FREEZE: a frame identical to the previous one while the frames around it move (a duplicated frame = visible hitch)
  - JUMP:   a frame that changes far more than its neighbours without being a scene cut (a skipped frame / pop)
  - HOLD:   a run of >= 0.5 s with no change at all while a voice is talking (looks stuck)
Exit code 2 when it finds freezes or jumps.
"""
import argparse, subprocess, sys, numpy as np

ap = argparse.ArgumentParser(); ap.add_argument('video'); ap.add_argument('--fps', type=float, default=60)
ap.add_argument('--ignore-band', default='1385,1515', help='y range (px) to ignore: the subtitle band, whose word switches are meant to be instant')
a = ap.parse_args()
W, H = 135, 240
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', a.video, '-vf', f'scale={W}:{H},format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
F = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
if a.ignore_band:
    y0, y1 = [int(int(v) * H / 1920) for v in a.ignore_band.split(',')]; F = np.concatenate([F[:, :y0], F[:, y1:]], axis=1)
d = np.abs(np.diff(F, axis=0)).mean(axis=(1, 2))           # d[i] = change from frame i to i+1
n = len(d); issues = []
cut = lambda i: d[i] > 12                                    # whole-frame change = deliberate cut/flash
for i in range(2, n - 2):
    t = (i + 1) / a.fps
    around = np.median(np.r_[d[i - 2:i], d[i + 1:i + 3]])
    if d[i] < 0.02 and around > 0.25: issues.append((t, 'FREEZE', f'frame identical to previous while motion around is {around:.2f}'))
    elif d[i] > 6 * max(around, 0.15) and d[i] > 1.2 and not cut(i): issues.append((t, 'JUMP', f'change {d[i]:.2f} vs {around:.2f} around'))
run = 0
for i in range(n):
    run = run + 1 if d[i] < 0.01 else 0
    if run == int(0.5 * a.fps): issues.append(((i + 1) / a.fps, 'HOLD', 'nothing moved for 0.5 s'))
for t, k, m in issues: print(f't={t:6.2f}s  {k:6s} {m}')
bad = [x for x in issues if x[1] != 'HOLD']
print(f'{len(F)} frames, {len(bad)} stutter(s), {len(issues) - len(bad)} hold(s)')
sys.exit(2 if bad else 0)
