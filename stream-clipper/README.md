# stream-clipper

Watches a Twitch stream live, finds the moments where chat explodes, and turns each one into a
ready-to-post vertical clip with big burned-in captions. You can also have it upload them as YouTube Shorts.

1. **streamlink** starts recording the moment the channel goes live
2. **Twitch chat** is read anonymously (no account, no token)
3. Chat is counted every 10 s. A window with 2.5× the usual activity (hype words like KEKW, W and CLIP count extra) is a spike
4. **ffmpeg** cuts ~40 s around each spike (starting ~22 s *before* it, because chat reacts late) and reframes to 9:16
5. **faster-whisper** transcribes the clip and the captions get burned in, 3 words at a time

Everything is free and runs on your computer. **The catch:** it only works while the stream is live, because you can't rewind a stream that already ended.

## Setup (Mac)

```bash
brew install ffmpeg python
cd stream-clipper
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

(Windows: install ffmpeg from https://www.gyan.dev/ffmpeg/builds/ and add it to PATH, then use the same pip steps.)

## Run it

```bash
source .venv/bin/activate
python clipper.py <twitch_channel>
```

Leave it running. It waits until the channel goes live, records it, and prints a line each time it makes a clip.
Press Ctrl+C to stop. Everything lands in `sessions/<channel>_<date>/`:

```
sessions/kaicenat_20261119_180000/
  kaicenat_20261119_180012.ts     full stream recording
  chat.jsonl                      every chat message with timestamps
  clips/
    clip_001_181455.mp4           vertical, captioned, ready to post
    clip_001_181455.json          suggested title, transcript, chat stats
```

To watch several streamers at once, open one terminal per channel.

### Options

| flag | what it does |
|---|---|
| `--layout blur` | (default) gameplay in the middle, blurred copy filling the 9:16 frame |
| `--layout crop` | center crop to 9:16 (cuts off the sides of the screen) |
| `--layout none` | keep 16:9 |
| `--model small` | whisper model: `tiny`, `base`, `small` (default), `medium`, `large-v3`. Bigger is more accurate but slower. Use `off` for no captions |
| `--post youtube` | upload each clip as a YouTube Short (see below) |

For tuning, copy `config.example.json` to `config.json` and edit it.
- **Too many clips?** Raise `spike_multiplier` (e.g. 3.5) or `min_messages`.
- **Too few?** Lower them.
- **The moment is cut off?** Raise `pre_seconds`.

Big streamers with very fast chat usually need a higher `min_messages` (50+).

### Testing / re-tuning on a past session

Every session saves the recording and the chat log, so you can re-run detection with new settings:

```bash
python clipper.py --replay sessions/<session>/<recording>.ts sessions/<session>/chat.jsonl --video-start <unix time recording began>
```

## Auto-posting

**YouTube Shorts** is the only platform with a free upload API anyone can use:

1. Go to https://console.cloud.google.com, create a project, and enable **YouTube Data API v3**
2. Under *APIs & Services → Credentials*, create an **OAuth client ID** of type **Desktop app**. Download it as `client_secret.json` and put it in this folder
3. Under *OAuth consent screen*, add your own Google account as a test user
4. Run `python clipper.py <channel> --post youtube`. A browser window opens once to log in, and after that it uploads automatically

Uploads are public by default. Run `export YT_PRIVACY=private` first if you want to review clips before they go live.
Google's free quota allows about 6 uploads per day.

**TikTok / Instagram:** their posting APIs need an approved developer app, so this doesn't post there automatically.
Every clip is already 9:16 with captions, so you can AirDrop the files from `clips/` to your phone and post them, using the title in the `.json`.

## Heads up

Clips are other people's content. Many streamers are fine with clipping, and some run official clip programs,
but a streamer or publisher can get a reupload taken down. It's safest to clip streamers who allow it and to credit the channel
(the YouTube description does this automatically).
