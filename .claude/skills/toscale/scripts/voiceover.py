#!/usr/bin/env python3
"""ElevenLabs narration with word timings.

usage: voiceover.py script.txt OUT_DIR
env:   ELEVENLABS_API_KEY (required), VOICE_ID (the channel's fixed voice),
       ELEVEN_MODEL (default eleven_multilingual_v2)
writes OUT_DIR/vo.mp3, OUT_DIR/words.json [{word,start,end}], OUT_DIR/duration.txt
"""
import base64, json, os, sys, urllib.request

def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    text = open(sys.argv[1], encoding="utf-8").read().strip()
    out = sys.argv[2]
    os.makedirs(out, exist_ok=True)
    key = os.environ.get("ELEVENLABS_API_KEY") or sys.exit("ELEVENLABS_API_KEY not set")
    voice = os.environ.get("VOICE_ID") or sys.exit("VOICE_ID not set (pick one voice and keep it for every episode)")
    body = {
        "text": text,
        "model_id": os.environ.get("ELEVEN_MODEL", "eleven_multilingual_v2"),
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.8, "style": 0.25, "speed": 1.05},
    }
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps?output_format=mp3_44100_128",
        data=json.dumps(body).encode(),
        headers={"xi-api-key": key, "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req) as r:
        data = json.load(r)
    open(os.path.join(out, "vo.mp3"), "wb").write(base64.b64decode(data["audio_base64"]))

    a = data.get("normalized_alignment") or data["alignment"]
    chars, starts, ends = a["characters"], a["character_start_times_seconds"], a["character_end_times_seconds"]
    words, cur, ws, we = [], "", None, None
    for c, s, e in zip(chars, starts, ends):
        if c.isspace():
            if cur:
                words.append({"word": cur, "start": round(ws, 3), "end": round(we, 3)})
            cur, ws = "", None
            continue
        if ws is None:
            ws = s
        cur += c
        we = e
    if cur:
        words.append({"word": cur, "start": round(ws, 3), "end": round(we, 3)})
    json.dump(words, open(os.path.join(out, "words.json"), "w"), indent=1)
    dur = ends[-1] if ends else 0
    open(os.path.join(out, "duration.txt"), "w").write(f"{dur:.3f}\n")
    print(f"{len(words)} words, {dur:.2f}s -> {out}")

if __name__ == "__main__":
    main()
