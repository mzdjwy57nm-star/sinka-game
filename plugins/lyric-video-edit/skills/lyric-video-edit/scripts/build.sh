#!/usr/bin/env bash
# usage: build.sh page.html output.mp4
# Renders every frame in two parallel processes, then encodes a silent MP4 (H.264, crf 17).
set -e
PAGE="$1"; OUT="$2"; DIR="$(cd "$(dirname "$0")" && pwd)"; FR=$(mktemp -d)
N=$(python3 - "$PAGE" <<'PY'
import re,sys;s=open(sys.argv[1]).read();print(round(sum(float(x) for x in re.findall(r"\{d:([\d.]+),",s))*30))
PY
)
python3 "$DIR/render.py" "$PAGE" "$FR" 0 "$N" 2 & python3 "$DIR/render.py" "$PAGE" "$FR" 1 "$N" 2 & wait
ffmpeg -y -loglevel error -framerate 30 -i "$FR/f%05d.png" -c:v libx264 -crf 17 -pix_fmt yuv420p -an "$OUT"
ffmpeg -y -loglevel error -i "$OUT" -vf "select='not(mod(n\,45))',scale=240:-1,tile=10x4" -frames:v 1 -vsync 0 "${OUT%.mp4}_sheet.png"
echo "frames=$N -> $OUT (+ contact sheet)"; rm -rf "$FR"
