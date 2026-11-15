# Narrator voice

## Target: the "IQ 160" narrator
Measured from the reference video (the same narrator is in both narrated references, speaker similarity 0.96):
- female, young adult, General American; median pitch ~210 Hz (range 150–290)
- ~180 words per minute including pauses: brisk, flat-confident, no hype
- dry "storyteller explaining something obvious" delivery; falls at sentence ends; short ~0.3 s gaps between sentences
- clean, close-mic, no music under it

## Current voice (voice.json)
**Laura – a top narration voice** (`GZ4PpFJV8ikEGUtBrjK7`) on `eleven_v4`, sped up with
`atempo=1.1` to reach ~180 wpm. It was the closest of ~45 ElevenLabs voices scored with a
speaker-embedding model (Resemblyzer): 0.72 against the reference. Same-speaker scores are
about 0.85+, so it is the same type of voice but not the same voice. The reference narrator
is probably a custom voice that isn't in the public library.

To change voices: edit `voice.json`. To check a candidate objectively, generate the reference
line with it, then run:
```
python3 -I scripts/check_voice.py reference.wav candidate1.mp3 candidate2.mp3 ...
```

## Generating
- One `creative_generate_speech` call for the whole script (keeps prosody continuous).
- Write numbers how they should be spoken ("twenty years later", "a hundred and sixty").
- Punctuation drives pacing: commas for micro-pauses, full stops for ~0.3 s gaps. Avoid ellipses.
- eleven_v4 supports audio tags; this style needs none. Keep it flat and confident.
- After download: `ffmpeg -i take.mp3 -af "atempo=1.1" voice.mp3`, then check the wpm that `align.py` prints (aim for 170–190).

## Using the exact original voice
Cloning a voice from someone else's video needs that speaker's consent, so this skill doesn't do it.
If the user owns the voice (it is their channel, or they have the voice owner's permission and recordings),
use the clone-voice workflow and put the new voice_id in `voice.json`.
