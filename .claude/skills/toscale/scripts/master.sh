#!/usr/bin/env bash
# usage: master.sh render.mp4 vo.mp3 sfx.txt final.mp4
# sfx.txt: one cue per line "SECONDS path/to/file.wav GAIN_DB" (# comments ok; file may be empty)
# Mixes VO + SFX, masters to -14 LUFS / -1 dBTP, replaces the render's audio, keeps video untouched.
set -euo pipefail
[ $# -eq 4 ] || { sed -n 2,4p "$0"; exit 1; }
VIDEO=$1 VO=$2 SFX=$3 OUT=$4
for f in "$VIDEO" "$VO"; do
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  awk -v d="$d" 'BEGIN{exit !(d>=60)}' && { echo "ERROR: $f is ${d}s - every video must be under 60 s. Cut the script."; exit 2; }
done
inputs=(-i "$VO") filters="" labels="[vo]" n=1
filters+="[0:a]aresample=48000,aformat=channel_layouts=stereo[vo];"
while read -r t f g; do
  [[ -z "${t:-}" || "$t" == \#* ]] && continue
  inputs+=(-i "$f")
  ms=$(awk -v t="$t" 'BEGIN{printf "%d", t*1000}')
  filters+="[$n:a]aresample=48000,aformat=channel_layouts=stereo,volume=${g:-0}dB,adelay=${ms}|${ms}[s$n];"
  labels+="[s$n]"; n=$((n+1))
done < "$SFX"
filters+="${labels}amix=inputs=$n:normalize=0:duration=longest,loudnorm=I=-14:TP=-1:LRA=9[mix]"
TMP=$(mktemp --suffix=.wav)
ffmpeg -hide_banner -loglevel error -y "${inputs[@]}" -filter_complex "$filters" -map "[mix]" -ar 48000 "$TMP"
ffmpeg -hide_banner -loglevel error -y -i "$VIDEO" -i "$TMP" -map 0:v:0 -map 1:a:0 \
  -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT"
rm -f "$TMP"
echo "wrote $OUT"; ffmpeg -hide_banner -nostats -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)" | tail -2
