#!/usr/bin/env python3
"""Fetch the REAL sound-effects library (recorded/produced sounds, not synthesized) into assets/sfx/real/.

usage: python3 -I fetch_sfx.py            # downloads everything missing (~15 MB), then trims + levels it
Sources (both allowed for commercial video use; neither may be redistributed as a sound library,
so the files are downloaded on demand and git-ignored, never committed):
  - Mixkit Sound Effects Free License (mixkit.co): free for commercial projects incl. YouTube, no attribution.
  - SFXMint CC0 1.0 (Hugging Face mirror flreey/sfxmint-cc0-sound-effects): public domain.
Use in scenes:  sfx('real/<name>', t, vol)   e.g. sfx('real/whoosh-fast', 3.2, 0.5)
"""
import os, subprocess, sys, json, io
import numpy as np, soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'assets', 'sfx', 'real'); os.makedirs(OUT, exist_ok=True)

MIXKIT = {
    # transitions
    'whoosh-fast': 1492, 'whoosh-air': 1489, 'whoosh-swoosh': 3115, 'whoosh-small': 166, 'whoosh-deep-hit': 1143,
    'whoosh-trailer-hit': 2918, 'zoom-swipe': 2627, 'rewind': 1092, 'glitch': 2950,
    # impacts & drama
    'impact-big': 788, 'impact-trailer': 2909, 'impact-quick': 772, 'impact-stomp': 3057, 'impact-blow': 2655,
    'impact-wood': 2182, 'boom-echo': 1686, 'collapse': 2958, 'rocks-fall': 400,
    'riser': 790, 'riser-short': 1144, 'swell-heaven': 2674, 'swell-suspense': 678, 'swell-rumble': 2664,
    'heartbeat': 494, 'heartbeat-hit': 498,
    # money & wins
    'coins-clink': 1993, 'coins-handle': 1939, 'coins': 2003, 'money-bag': 1989, 'payout': 1934,
    'win-chimes': 2015, 'win-notify': 2018, 'achievement': 600, 'lose-piano': 2024,
    # objects & places
    'paper-move': 2380, 'paper-crumple': 2996, 'paper-fall': 386, 'page-turn': 1104, 'typing': 1387,
    'car-arrive': 1536, 'car-door': 3129, 'door-slam': 194, 'door-creak': 195, 'footsteps-snow': 539,
    'wind-winter': 1175, 'thunder': 1298,
    # people & UI
    'gasp': 966, 'crowd-laugh': 424, 'crowd-murmur': 361, 'pop': 2358, 'pop-click': 2364, 'msg-pop': 2354,
    'notify-positive': 951,
    # NATURAL / diegetic (prefer these: real places, real objects; use stingers rarely)
    'chalk-board': 2366, 'chalk-line': 2372, 'pencil-write': 2376, 'paper-slide': 1530, 'paper-shuffle': 2379, 'paper-crinkle': 2385,
    'laptop-typing': 2537, 'typing-slow': 2532, 'key-press': 2541, 'mouse-click': 2997, 'phone-typing': 1393, 'notify-bubble': 2357,
    'crickets-night': 1787, 'rain-light': 2393, 'rain-window': 1248, 'clock-tick': 1060,
    'teens-laugh': 429, 'restaurant-chatter': 444, 'office-ambience': 447, 'city-traffic': 2930, 'city-night': 2678,
    'heartbeat-single': 490, 'kid-sob': 474, 'small-clapping': 3035, 'stapler': 2995,
}
CC0 = {  # sfxmint sample ids (CC0)
    'cinematic-boom': 'cinematic-boom-01', 'reveal-impact': 'reveal-impact-01', 'video-whoosh': 'short-video-whoosh-01',
    'video-impact': 'short-video-impact-01', 'transition-riser': 'transition-riser-01', 'banknote-counter': 'empty-banknote-counter-01',
    'coin-table': 'coin-dropped-on-wooden-table-01', 'score-count': 'score-count-up-01', 'tension-drone': 'tension-drone-01',
    'crowd-groan': 'crowd-groan-01', 'crowd-ooh': 'crowd-ooh-01', 'blizzard': 'blizzard-wind-01', 'night-ambience': 'night-ambience-01',
    'logo-reveal': 'logo-reveal-01', 'piano-chord': 'piano-major-chord-01', 'glass-crack': 'glass-crack-41',
    'rock-crumble': 'rock-crumbling-01', 'card-flip': 'paper-fabric-card-flip-06', 'footsteps-concrete': 'footsteps-concrete-03',
    'car-door-2': 'car-door-opening-and-closing-01', 'dun-dun-dun': 'dun-dun-dun-01', 'elevator-ding': 'office-elevator-08',
    'service-bell': 'service-bell-01',
    'shop-doorbell': 'door-doorbell-01', 'door-open': 'door-open-01', 'door-close': 'door-close-01', 'door-knock': 'door-knock-01',
    'market-walla': 'busy-market-crowd-murmur-walla-01', 'rain-ambience': 'ambience-rain-03', 'crying': 'crying-01', 'pen-click': 'office-pen-17',
    'class-laughter': 'crowd-laughter-22', 'clock-metronome': 'metronome-ticking-01',
}

def decode(url):
    raw = subprocess.run(['curl', '-s', '-f', '-L', '-m', '40', url], capture_output=True).stdout
    if not raw: return None, None
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', 'pipe:0', '-f', 'wav', '-ac', '2', '-ar', '48000', 'pipe:1'],
                         input=raw, capture_output=True, timeout=60).stdout
    return sf.read(io.BytesIO(pcm), dtype='float32')

def finish(x, sr):
    mono = np.abs(x).max(axis=1)
    on = np.where(mono > 10 ** (-50 / 20))[0]
    if len(on): x = x[max(0, on[0] - int(0.005 * sr)):]                 # trim leading silence (keep 5 ms)
    pk = np.abs(x).max() or 1; x = x / pk * 10 ** (-1 / 20)               # peak -1 dBFS
    f = min(len(x), int(0.004 * sr)); x[:f] *= np.linspace(0, 1, f)[:, None]
    return x

def main():
    jobs = [(n, f'https://assets.mixkit.co/active_storage/sfx/{i}/{i}-preview.mp3') for n, i in MIXKIT.items()]
    jobs += [(n, f'https://huggingface.co/datasets/flreey/sfxmint-cc0-sound-effects/resolve/main/sample/{i}.mp3') for n, i in CC0.items()]
    done = 0
    for name, url in jobs:
        dst = os.path.join(OUT, name + '.wav')
        if os.path.exists(dst) and os.path.getsize(dst) > 1000: done += 1; continue
        try:
            x, sr = decode(url)
            if x is None: print('failed', name); continue
            sf.write(dst, finish(x, sr), sr, subtype='PCM_16'); done += 1
        except Exception as e: print('failed', name, e)
    json.dump({'mixkit': MIXKIT, 'cc0': CC0}, open(os.path.join(OUT, 'index.json'), 'w'), indent=1)
    print(f'{done}/{len(jobs)} sounds ready in assets/sfx/real/')

if __name__ == '__main__': main()
