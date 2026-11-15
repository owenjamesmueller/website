#!/usr/bin/env python3
"""Procedural cinematic foley for Mode B loops (no downloads, deterministic, royalty-free).

usage: python3 -I gen_foley.py [out_dir]   (default: ../assets/sfx/)
Writes foley-*.wav at 48 kHz stereo. Noise-based sounds (rain, wind, waves, splashes, thunder,
whooshes) are shaped with spectral filters + envelopes; tonal ones (hammer, creak, pad) are modal synthesis.
"""
import os, sys
import numpy as np
import soundfile as sf

SR = 48000
rng = np.random.default_rng(7)
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "sfx")
os.makedirs(OUT, exist_ok=True)


def t(sec): return np.arange(int(sec * SR)) / SR
def noise(sec): return rng.standard_normal(int(sec * SR))


def band(x, lo, hi, soft=0.25):
    """FFT band-pass with soft edges (lo/hi in Hz; lo=0 -> low-pass)."""
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.ones_like(f)
    if lo > 0: m *= 1 / (1 + (lo / np.maximum(f, 1)) ** (4 / soft * 0.25))
    if hi: m *= 1 / (1 + (f / hi) ** (4 / soft * 0.25))
    return np.fft.irfft(X * m, n=len(x))


def pink(sec):
    x = noise(sec); X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X /= np.sqrt(np.maximum(f, 20)); return np.fft.irfft(X, n=len(x))


def env(n, a, d, shape=3.0):
    """attack a seconds, exponential-ish decay over d seconds, length n samples."""
    tt = np.arange(n) / SR
    e = np.where(tt < a, tt / max(a, 1e-4), np.exp(-(tt - a) / max(d, 1e-4) * shape))
    return e


def lfo(sec, rate, depth, base=1.0, phase=0.0):
    return base + depth * np.sin(2 * np.pi * rate * t(sec) + phase)


def norm(x, peak=0.9):
    m = np.max(np.abs(x)) or 1; return x / m * peak


def stereo(x, width=0.25, delay_ms=9):
    d = int(SR * delay_ms / 1000); r = np.concatenate([np.zeros(d), x[:-d]]) if d else x
    return np.stack([x, (1 - width) * x + width * r], 1)


def fade(x, fi=0.02, fo=0.05):
    n = len(x); a = int(fi * SR); b = int(fo * SR)
    if a: x[:a] *= np.linspace(0, 1, a)
    if b: x[-b:] *= np.linspace(1, 0, b)
    return x


def write(name, x, peak=0.9, st=True):
    x = fade(norm(x, peak))
    sf.write(os.path.join(OUT, f"foley-{name}.wav"), stereo(x) if st else x, SR, subtype="PCM_16")
    print("foley-" + name)


# ---- ambiences --------------------------------------------------------------
def storm_bed(sec=16.0):
    rain = band(noise(sec), 1200, 9000) * 0.5 + band(noise(sec), 300, 1500) * 0.25
    drops = np.zeros(int(sec * SR))
    for _ in range(int(sec * 90)):                       # individual drop ticks
        i = rng.integers(0, len(drops) - 400); drops[i:i + 300] += rng.uniform(.2, 1) * np.exp(-np.arange(300) / 40) * rng.standard_normal(300)
    drops = band(drops, 2000, 10000)
    wind = band(pink(sec), 40, 500) * lfo(sec, 0.11, 0.45, 1.0) * lfo(sec, 0.37, 0.2, 1.0, 1.3)
    return rain * 0.55 + drops * 0.35 + wind * 1.0

def sea_bed(sec=16.0):
    swell = np.zeros(int(sec * SR)); n = len(swell)
    for k in range(0, int(sec / 2.6) + 1):               # rolling swells every ~2.6 s
        st = int(k * 2.6 * SR + rng.uniform(0, .4) * SR); L = int(2.4 * SR)
        if st >= n: break
        L = min(L, n - st); s = band(noise(L / SR), 150, 2500)
        e = np.sin(np.linspace(0, np.pi, L)) ** 2
        swell[st:st + L] += s * e
    low = band(pink(sec), 30, 200) * 0.8
    return swell * 0.7 + low

# ---- one-shots --------------------------------------------------------------
def thunder():
    sec = 4.5; n = int(sec * SR)
    crack = band(noise(0.25), 800, 9000) * env(int(0.25 * SR), 0.002, 0.08)
    rumble = (band(pink(sec), 25, 180) + band(pink(sec), 120, 700) * 0.35) * env(n, 0.05, 1.8, 2.2)
    ro = band(noise(sec), 0, 6); rumble *= 1 + 0.6 * ro / (np.std(ro) or 1)   # rolling amplitude
    out = rumble * 2.2; out[:len(crack)] += crack * 0.35
    return out

def splash(big=True):
    sec = 1.4 if big else 0.6; n = int(sec * SR)
    body = band(noise(sec), 400, 5000) * env(n, 0.01, 0.35 if big else 0.15, 2.5)
    thump = np.sin(2 * np.pi * 70 * t(sec) * (1 - 0.4 * t(sec))) * env(n, 0.003, 0.12, 3) * (0.9 if big else 0.4)
    drip = np.zeros(n)
    for _ in range(18 if big else 6):                     # falling droplets: short soft noise ticks
        i = rng.integers(int(0.15 * SR), n - 2000); L = 900; w = np.sin(np.pi * np.arange(L) / L) ** 2
        drip[i:i + L] += band(noise(L / SR), 1500, 6000) * w * rng.uniform(.05, .18)
    return body + thump + drip

def wave_crash():
    sec = 2.6; n = int(sec * SR)
    build = band(noise(sec), 200, 3000) * np.clip(t(sec) / 0.9, 0, 1) ** 2 * np.exp(-np.maximum(t(sec) - 0.9, 0) * 1.6)
    hit = band(noise(sec), 60, 8000) * np.clip((t(sec) - 0.8) / 0.12, 0, 1) * np.exp(-np.maximum(t(sec) - 0.92, 0) * 1.5)
    lowc = band(pink(sec), 30, 150) * np.clip((t(sec) - 0.8) / 0.12, 0, 1) * np.exp(-np.maximum(t(sec) - 0.92, 0) * 1.8)
    return build * 0.8 + hit * 1.1 + lowc * 1.2

def leak():
    sec = 1.6; n = int(sec * SR)
    fl = band(noise(sec), 0, 25); hiss = band(noise(sec), 1500, 7000) * (0.6 + 0.4 * np.abs(fl) / (np.std(fl) or 1))
    return hiss * env(n, 0.05, 1.2, 1.2)

def bail():                                              # scoop + throw of water
    a = splash(False) * 0.6; sw = whoosh(0.35, 600, 2500) * 0.5
    out = np.zeros(int(0.9 * SR)); out[:len(sw)] += sw; out[int(.25 * SR):int(.25 * SR) + len(a)] += a[:len(out) - int(.25 * SR)]
    return out

def hammer():
    sec = 0.35; n = int(sec * SR); tt = t(sec)
    modes = [(310, 1.0, .028), (820, .6, .018), (1530, .35, .012), (2650, .2, .008)]
    s = sum(a * np.sin(2 * np.pi * f * tt) * np.exp(-tt / d) for f, a, d in modes)
    click = band(noise(sec), 2000, 9000) * env(n, 0.0005, 0.006, 3)
    knock = band(noise(sec), 200, 3000) * env(n, 0.0008, 0.02, 3)
    return s + click * .6 + knock * .8

def creak():
    sec = 1.2; n = int(sec * SR); tt = t(sec)
    j = band(noise(sec), 0, 20); f = 95 + 40 * np.sin(2 * np.pi * 0.8 * tt) + 25 * j / (np.std(j) or 1)
    ph = 2 * np.cumsum(np.pi * f / SR); pulse = (np.sin(ph) > 0.92).astype(float)
    return band(pulse, 300, 2500) * np.sin(np.pi * tt / sec) ** 0.6

def whoosh(sec=0.6, f0=300, f1=4000):
    n = int(sec * SR); out = np.zeros(n); x = noise(sec); steps = 12
    for k in range(steps):
        a, b = int(k * n / steps), int((k + 1) * n / steps)
        c = f0 * (f1 / f0) ** (k / (steps - 1))
        out[a:b] = band(x, c * 0.6, c * 1.6)[a:b]
    return out * np.sin(np.pi * np.arange(n) / n) ** 1.5

def boom():
    sec = 2.2; tt = t(sec); n = len(tt)
    s = np.sin(2 * np.pi * (55 - 20 * tt / sec) * tt) * env(n, 0.005, 0.9, 2.2)
    return s + band(pink(sec), 20, 120) * env(n, 0.01, 0.8, 2.5) * 0.6

def pad(chord=(220.0, 277.18, 329.63, 440.0), sec=5.0):
    tt = t(sec); s = 0
    for f in chord:
        for det in (-0.6, 0, 0.6):
            s = s + np.sin(2 * np.pi * (f + det) * tt + rng.uniform(0, 6)) * (1 / (1 + f / 600))
    e = np.clip(tt / 1.6, 0, 1) * np.clip((sec - tt) / 1.8, 0, 1)
    return band(s, 0, 2500) * e + band(noise(sec), 3000, 9000) * e * 0.01

def keys(n_keys=30, rate=0.085):
    sec = n_keys * rate + 0.3; out = np.zeros(int(sec * SR))
    for k in range(n_keys):
        i = max(0, int((k * rate + rng.uniform(-.01, .01)) * SR)); L = int(.04 * SR)
        c = band(noise(.04), 1500, 7000) * np.exp(-np.arange(L) / 120) + np.sin(2 * np.pi * rng.uniform(1800, 2600) * np.arange(L) / SR) * np.exp(-np.arange(L) / 200) * .4
        out[i:i + L] += c * rng.uniform(.6, 1)
    return out

def heartbeat():
    sec = 1.0; out = np.zeros(int(sec * SR))
    for st, a in ((0.0, 1.0), (0.22, 0.7)):
        tt = t(0.25); s = np.sin(2 * np.pi * (60 - 25 * tt / .25) * tt) * np.exp(-tt / .06) * a
        out[int(st * SR):int(st * SR) + len(s)] += s
    return out

def rope():
    return whoosh(0.5, 500, 3000) * 0.8

def bubbles_burst():
    sec = 1.2; out = np.zeros(int(sec * SR))
    for _ in range(22):
        i = rng.integers(0, len(out) - 3000); L = int(rng.uniform(.02, .05) * SR); tt = np.arange(L) / SR
        f = rng.uniform(300, 900); s = np.sin(2 * np.pi * f * (1 + 6 * tt / tt[-1]) * tt) * np.exp(-tt / (L / SR / 3))
        out[i:i + L] += s * rng.uniform(.3, 1)
    return out

write("storm-bed", storm_bed(), 0.7)
write("sea-bed", sea_bed(), 0.7)
write("thunder", thunder())
write("splash-big", splash(True))
write("splash-small", splash(False))
write("wave-crash", wave_crash())
write("leak", leak(), 0.6)
write("bail", bail(), 0.7)
write("hammer", hammer())
write("creak", creak(), 0.6)
write("whoosh", whoosh())
write("whoosh-long", whoosh(1.2, 200, 3000))
write("boom", boom())
write("pad-hope", pad((220.0, 277.18, 329.63, 440.0, 554.37)), 0.6)
write("pad-dark", pad((110.0, 130.81, 164.81, 220.0)), 0.6)
write("keys", keys(), 0.6)
write("heartbeat", heartbeat())
write("rope", rope(), 0.7)
write("bubbles", bubbles_burst(), 0.6)
