#!/usr/bin/env python3
"""
stream-clipper: record a live Twitch stream, find hype moments from chat
spikes, cut vertical clips, burn in captions, and (optionally) post them.

  python clipper.py <twitch_channel>            # live mode
  python clipper.py <channel> --post youtube    # also upload as YouTube Shorts
  python clipper.py --replay video.mp4 chat.jsonl   # test on a saved video + chat log

Pipeline:
  1. streamlink records the stream the moment it goes live
  2. Twitch chat is read anonymously (justinfan login, no account/token)
  3. messages are counted every 10 s; buckets far above the recent baseline are spikes
  4. ffmpeg cuts ~30 s around each spike and reframes to 9:16
  5. faster-whisper transcribes the clip and the captions are burned in
"""
import argparse
import json
import os
import queue
import random
import re
import shutil
import socket
import statistics
import subprocess
import sys
import threading
import time
from collections import deque
from datetime import datetime
from pathlib import Path

# ---------------------------------------------------------------- settings
DEFAULTS = {
    "bucket_seconds": 10,       # chat is counted in windows of this size
    "baseline_buckets": 30,     # how many past windows form the "normal" level (5 min)
    "spike_multiplier": 2.5,    # a window must be this many times the baseline...
    "min_messages": 15,         # ...and have at least this many messages
    "cooldown_seconds": 60,     # no two clips closer than this
    "pre_seconds": 22,          # chat reacts AFTER the moment, so start well before
    "post_seconds": 8,
    "layout": "blur",           # blur | crop | none
    "whisper_model": "small",   # tiny | base | small | medium | large-v3
    "quality": "best",
    "hype_words": ["LUL", "KEKW", "OMEGALUL", "POG", "POGGERS", "PogChamp", "W",
                   "LMAO", "LOL", "CLIP", "CLIP IT", "NO WAY", "WTF", "OMG",
                   "HOLY", "monkaS", "Pog", "ICANT", "💀", "😂"],
}

ROOT = Path(__file__).resolve().parent


def log(*a):
    print(datetime.now().strftime("[%H:%M:%S]"), *a, flush=True)


def need(binary):
    if not shutil.which(binary):
        sys.exit(f"'{binary}' was not found on PATH. See README.md for install steps.")


# ---------------------------------------------------------------- 1. recorder
class Recorder:
    """Waits for the channel to go live, then writes the stream to a .ts file."""

    def __init__(self, channel, out_dir, quality):
        self.channel, self.out_dir, self.quality = channel, out_dir, quality
        self.path = None
        self.start_time = None  # wall-clock time of the first byte written
        self.proc = None

    def wait_and_start(self, stop):
        need("streamlink")
        url = f"https://twitch.tv/{self.channel}"
        log(f"waiting for {self.channel} to go live...")
        while not stop.is_set():
            stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            self.path = self.out_dir / f"{self.channel}_{stamp}.ts"
            self.proc = subprocess.Popen(
                ["streamlink", "--twitch-disable-ads", "--stdout", url, self.quality],
                stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
            first = self.proc.stdout.read(188 * 64)
            if first:
                self.start_time = time.time()
                log(f"LIVE - recording to {self.path.name}")
                threading.Thread(target=self._pump, args=(first,), daemon=True).start()
                return True
            self.proc.wait()
            stop.wait(60)  # offline: check again in a minute
        return False

    def _pump(self, first):
        with open(self.path, "wb") as f:
            f.write(first)
            for chunk in iter(lambda: self.proc.stdout.read(65536), b""):
                f.write(chunk)
                f.flush()
        log("stream ended / recorder stopped")

    def seconds_recorded(self):
        return time.time() - self.start_time if self.start_time else 0

    def is_running(self):
        return self.proc is not None and self.proc.poll() is None

    def stop(self):
        if self.is_running():
            self.proc.terminate()


# ---------------------------------------------------------------- 2. chat
class Chat:
    """Anonymous read-only Twitch IRC. Calls on_message(timestamp, text)."""

    def __init__(self, channel, log_path, on_message):
        self.channel, self.log_path, self.on_message = channel.lower(), log_path, on_message

    def run(self, stop):
        while not stop.is_set():
            try:
                self._session(stop)
            except OSError as e:
                log(f"chat disconnected ({e}); reconnecting in 5 s")
                stop.wait(5)

    def _session(self, stop):
        s = socket.create_connection(("irc.chat.twitch.tv", 6667), timeout=300)
        nick = f"justinfan{random.randint(10000, 99999)}"
        s.sendall(f"NICK {nick}\r\nJOIN #{self.channel}\r\n".encode())
        log(f"chat connected as {nick} (anonymous)")
        buf = ""
        with open(self.log_path, "a", encoding="utf-8") as out:
            while not stop.is_set():
                data = s.recv(4096)
                if not data:
                    raise OSError("connection closed")
                buf += data.decode("utf-8", "ignore")
                *lines, buf = buf.split("\r\n")
                for line in lines:
                    if line.startswith("PING"):
                        s.sendall(b"PONG :tmi.twitch.tv\r\n")
                    m = re.match(r":(\w+)!\S+ PRIVMSG #\S+ :(.*)", line)
                    if m:
                        t = time.time()
                        out.write(json.dumps({"t": t, "user": m[1], "msg": m[2]}) + "\n")
                        out.flush()
                        self.on_message(t, m[2])


# ---------------------------------------------------------------- 3. spike detector
class SpikeDetector:
    """Counts messages per bucket and reports buckets well above the recent baseline."""

    def __init__(self, cfg):
        self.cfg = cfg
        self.history = deque(maxlen=cfg["baseline_buckets"])
        self.bucket_start = None
        self.count = 0
        self.score = 0.0
        self.samples = []
        self.last_clip = -1e9
        words = sorted(cfg["hype_words"], key=len, reverse=True)
        self.hype = re.compile("|".join(re.escape(w) for w in words), re.I)
        self.lock = threading.Lock()

    def add(self, t, text):
        """Feed one message. Returns a spike dict when a bucket closes as a spike."""
        with self.lock:
            spike = self._roll(t)
            self.count += 1
            # hype words count extra, so "KEKW KEKW" floods beat normal chatter
            self.score += 1 + 0.5 * min(len(self.hype.findall(text)), 4)
            if len(self.samples) < 6 and len(text) < 80:
                self.samples.append(text)
            return spike

    def tick(self, t):
        with self.lock:
            return self._roll(t)

    def _roll(self, t):
        size = self.cfg["bucket_seconds"]
        if self.bucket_start is None:
            self.bucket_start = t
        spike = None
        while t >= self.bucket_start + size:
            spike = self._close() or spike
            self.bucket_start += size
            self.count, self.score, self.samples = 0, 0.0, []
        return spike

    def _close(self):
        hist = list(self.history)
        self.history.append(self.score)
        if len(hist) < 6:  # still learning what "normal" looks like
            return None
        base = max(statistics.median(hist), 1.0)
        end = self.bucket_start + self.cfg["bucket_seconds"]
        if (self.score >= base * self.cfg["spike_multiplier"]
                and self.count >= self.cfg["min_messages"]
                and end - self.last_clip >= self.cfg["cooldown_seconds"]):
            self.last_clip = end
            return {"t": self.bucket_start, "end": end, "messages": self.count,
                    "ratio": round(self.score / base, 1), "samples": list(self.samples)}
        return None


# ---------------------------------------------------------------- 4 + 5. clip maker
LAYOUTS = {
    # gameplay full-width in the middle, blurred zoomed copy filling the background
    "blur": ("[0:v]split[a][b];"
             "[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=25:2,eq=brightness=-0.15[bg];"
             "[b]scale=1080:-2[fg];"
             "[bg][fg]overlay=(W-w)/2:(H-h)/2"),
    # center crop to 9:16 (loses the sides of the screen)
    "crop": "[0:v]scale=-2:1920,crop=1080:1920",
    # keep the original 16:9
    "none": "[0:v]null",
}

_whisper = None


def transcribe(clip, model_name):
    """Returns a list of (start, end, text) caption chunks of a few words each."""
    global _whisper
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        log("faster-whisper not installed; skipping captions")
        return []
    if _whisper is None:
        log(f"loading whisper model '{model_name}' (first run downloads it)...")
        _whisper = WhisperModel(model_name, device="auto", compute_type="int8")
    # decode audio with ffmpeg ourselves (avoids PyAV version breakage)
    import numpy as np
    pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(clip), "-vn", "-ac", "1",
                          "-ar", "16000", "-f", "s16le", "-"], capture_output=True, check=True).stdout
    audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768.0
    segments, _ = _whisper.transcribe(audio, word_timestamps=True, vad_filter=True)
    words = [w for s in segments for w in (s.words or [])]
    chunks, cur = [], []
    for w in words:  # short chunks of up to 3 words read better on vertical video
        cur.append(w)
        if len(cur) == 3 or w.word.rstrip().endswith((".", "?", "!", ",")):
            chunks.append(cur)
            cur = []
    if cur:
        chunks.append(cur)
    return [(c[0].start, c[-1].end, "".join(w.word for w in c).strip()) for c in chunks]


def write_ass(chunks, path, vertical):
    def ts(x):
        h, rem = divmod(max(x, 0), 3600)
        m, s = divmod(rem, 60)
        return f"{int(h)}:{int(m):02d}:{s:05.2f}"
    w, h = (1080, 1920) if vertical else (1920, 1080)
    margin = 440 if vertical else 90
    lines = [
        "[Script Info]", "ScriptType: v4.00+", f"PlayResX: {w}", f"PlayResY: {h}", "",
        "[V4+ Styles]",
        "Format: Name, Fontname, Fontsize, PrimaryColour, OutlineColour, BackColour, Bold, "
        "BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV",
        f"Style: Cap,Arial Black,{86 if vertical else 64},&H00FFFFFF,&H00000000,&H80000000,"
        f"1,1,6,2,2,60,60,{margin}", "",
        "[Events]", "Format: Layer, Start, End, Style, Text",
    ]
    for start, end, text in chunks:
        text = text.upper().replace("\n", " ").replace("{", "(").replace("}", ")")
        lines.append(f"Dialogue: 0,{ts(start)},{ts(end + 0.05)},Cap,{{\\fad(60,0)}}{text}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def make_clip(source, offset, duration, out_dir, name, cfg):
    """Cuts [offset, offset+duration] from source, reframes, captions. Returns final path."""
    raw = out_dir / f"{name}_raw.mp4"
    final = out_dir / f"{name}.mp4"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{max(offset, 0):.2f}",
                    "-i", str(source), "-t", f"{duration:.2f}",
                    "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
                    "-c:a", "aac", "-b:a", "160k", str(raw)], check=True)

    chunks = []
    if cfg["whisper_model"] != "off":
        try:
            chunks = transcribe(raw, cfg["whisper_model"])
        except Exception as e:  # a caption problem should not lose the clip
            log(f"captions failed ({e}); making clip without them")
    vertical = cfg["layout"] != "none"
    graph = LAYOUTS[cfg["layout"]]
    if chunks:
        ass = out_dir / f"{name}.ass"
        write_ass(chunks, ass, vertical)
        (out_dir / f"{name}.txt").write_text(" ".join(c[2] for c in chunks), encoding="utf-8")
        esc = str(ass).replace("\\", "/").replace(":", r"\:").replace("'", r"\'")
        graph += f"[v0];[v0]subtitles='{esc}'"
    graph += "[v]"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw),
                    "-filter_complex", graph, "-map", "[v]", "-map", "0:a?",
                    "-c:v", "libx264", "-preset", "medium", "-crf", "20",
                    "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart",
                    str(final)], check=True)
    raw.unlink(missing_ok=True)
    return final


def suggest_title(channel, spike, transcript):
    words = transcript.split()
    hook = " ".join(words[:8]).strip(" ,.") if words else ""
    base = f'"{hook}..."' if hook else f"{channel} chat went crazy"
    return f"{base} | {channel} #GTA6 #shorts"[:100]


# ---------------------------------------------------------------- 6. posting
def post_youtube(video, title, description):
    """Uploads as a YouTube Short. Needs client_secret.json from Google Cloud (see README)."""
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
    from googleapiclient.discovery import build
    from googleapiclient.http import MediaFileUpload

    scopes = ["https://www.googleapis.com/auth/youtube.upload"]
    token = ROOT / "youtube_token.json"
    creds = Credentials.from_authorized_user_file(str(token), scopes) if token.exists() else None
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(str(ROOT / "client_secret.json"), scopes)
            creds = flow.run_local_server(port=0)
        token.write_text(creds.to_json())
    yt = build("youtube", "v3", credentials=creds)
    body = {"snippet": {"title": title, "description": description, "categoryId": "20"},
            "status": {"privacyStatus": os.environ.get("YT_PRIVACY", "public"),
                       "selfDeclaredMadeForKids": False}}
    req = yt.videos().insert(part="snippet,status", body=body,
                             media_body=MediaFileUpload(str(video), resumable=True))
    resp = None
    while resp is None:
        _, resp = req.next_chunk()
    return f"https://youtube.com/shorts/{resp['id']}"


# ---------------------------------------------------------------- orchestration
class Worker:
    """Turns spikes into finished clips, one at a time, in the background."""

    def __init__(self, channel, source_fn, recorded_fn, start_time, out_dir, cfg, post):
        self.q = queue.Queue()
        self.channel, self.source_fn, self.recorded_fn = channel, source_fn, recorded_fn
        self.start_time, self.out_dir, self.cfg, self.post = start_time, out_dir, cfg, post
        self.n = 0

    def submit(self, spike):
        self.q.put(spike)

    def run(self, stop):
        while not (stop.is_set() and self.q.empty()):
            try:
                spike = self.q.get(timeout=1)
            except queue.Empty:
                continue
            try:
                self._handle(spike, stop)
            except Exception as e:  # never let one bad clip kill the session
                log(f"clip failed: {e}")

    def _handle(self, spike, stop):
        offset = spike["t"] - self.start_time() - self.cfg["pre_seconds"]
        duration = self.cfg["pre_seconds"] + self.cfg["bucket_seconds"] + self.cfg["post_seconds"]
        # the live file must contain the whole window before we cut it
        while self.recorded_fn() < offset + duration + 3 and not stop.is_set():
            time.sleep(1)
        self.n += 1
        name = f"clip_{self.n:03d}_{datetime.fromtimestamp(spike['t']).strftime('%H%M%S')}"
        log(f"cutting {name} (chat x{spike['ratio']}, {spike['messages']} msgs)")
        final = make_clip(self.source_fn(), offset, duration, self.out_dir, name, self.cfg)
        txt = self.out_dir / f"{name}.txt"
        transcript = txt.read_text(encoding="utf-8") if txt.exists() else ""
        title = suggest_title(self.channel, spike, transcript)
        meta = {"file": final.name, "title": title, "stream_offset_s": round(offset, 1),
                "chat": spike, "transcript": transcript}
        if self.post == "youtube":
            desc = f"Clipped from twitch.tv/{self.channel}\n\n#GTA6 #gaming #shorts"
            try:
                meta["posted"] = post_youtube(final, title, desc)
                log(f"posted: {meta['posted']}")
            except Exception as e:
                meta["post_error"] = str(e)
                log(f"posting failed: {e}")
        (self.out_dir / f"{name}.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
        log(f"ready: {final}  |  {title}")


def load_cfg(path):
    cfg = dict(DEFAULTS)
    if path and Path(path).exists():
        cfg.update(json.loads(Path(path).read_text()))
    return cfg


def run_live(args, cfg):
    need("ffmpeg")
    stop = threading.Event()
    session = ROOT / "sessions" / f"{args.channel}_{datetime.now():%Y%m%d_%H%M%S}"
    clips = session / "clips"
    clips.mkdir(parents=True)
    rec = Recorder(args.channel, session, cfg["quality"])
    det = SpikeDetector(cfg)
    worker = None

    def on_msg(t, text):
        spike = det.add(t, text)
        if spike:
            log(f"SPIKE: {spike['messages']} msgs (x{spike['ratio']}) e.g. {spike['samples'][:3]}")
            worker.submit(spike)

    try:
        if not rec.wait_and_start(stop):
            return
        worker = Worker(args.channel, lambda: rec.path, rec.seconds_recorded,
                        lambda: rec.start_time, clips, cfg, args.post)
        threading.Thread(target=worker.run, args=(stop,), daemon=True).start()
        threading.Thread(target=Chat(args.channel, session / "chat.jsonl", on_msg).run,
                         args=(stop,), daemon=True).start()
        while rec.is_running():
            spike = det.tick(time.time())  # close quiet buckets even with no messages
            if spike:
                worker.submit(spike)
            time.sleep(1)
        log("stream is over; finishing queued clips...")
    except KeyboardInterrupt:
        log("stopping...")
        rec.stop()
    stop.set()
    while worker and not worker.q.empty():
        time.sleep(1)
    time.sleep(2)
    log(f"done. clips are in {clips}")


def run_replay(args, cfg):
    """Runs detection on a saved chat log against a saved video (for testing/tuning)."""
    need("ffmpeg")
    msgs = [json.loads(l) for l in Path(args.replay[1]).read_text().splitlines() if l.strip()]
    video_start = float(args.video_start) if args.video_start else msgs[0]["t"]
    out = ROOT / "sessions" / f"replay_{datetime.now():%Y%m%d_%H%M%S}" / "clips"
    out.mkdir(parents=True)
    det = SpikeDetector(cfg)
    spikes = [s for m in msgs if (s := det.add(m["t"], m["msg"]))]
    tail = det.tick(msgs[-1]["t"] + cfg["bucket_seconds"] * 2)
    if tail:
        spikes.append(tail)
    log(f"{len(msgs)} messages -> {len(spikes)} spikes")
    stop = threading.Event()
    w = Worker(args.channel or "replay", lambda: Path(args.replay[0]), lambda: 1e12,
               lambda: video_start, out, cfg, args.post)
    for s in spikes:
        w.submit(s)
    stop.set()
    w.run(stop)
    log(f"done. clips are in {out}")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("channel", nargs="?", help="Twitch channel name")
    p.add_argument("--config", default=str(ROOT / "config.json"))
    p.add_argument("--post", choices=["none", "youtube"], default="none")
    p.add_argument("--layout", choices=list(LAYOUTS))
    p.add_argument("--model", help="whisper model, or 'off' for no captions")
    p.add_argument("--replay", nargs=2, metavar=("VIDEO", "CHAT_JSONL"))
    p.add_argument("--video-start", help="unix time of the video's first frame (replay mode)")
    args = p.parse_args()
    cfg = load_cfg(args.config)
    if args.layout:
        cfg["layout"] = args.layout
    if args.model:
        cfg["whisper_model"] = args.model
    if args.replay:
        run_replay(args, cfg)
    elif args.channel:
        run_live(args, cfg)
    else:
        p.print_help()


if __name__ == "__main__":
    main()
