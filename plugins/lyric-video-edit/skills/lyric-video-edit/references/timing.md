# Timing

Constants in the template: `FADE` (card/background cross-fade), `WORD` (delay between words), `W0` (first word delay).

| Pace | WORD | W0 | FADE | Line duration | Short/repeat line |
|------|------|----|------|---------------|-------------------|
| Normal (default) | 0.11 | 0.2 | 0.35 | 3–4 s | 2–2.4 s |
| Slow ("медленнее") | 0.22 | 0.4 | 0.6 | 4.8–6.4 s | 4–5 s |

- Scene events inside `draw` should be spread across the whole line: something new every ~0.8–1.2 s on slow pace.
- Total frames = round(sum(d) × 30).
- Test frames: for each scene starting at `st`, take `int((st + d*0.35)*30)` and `int((st + d*0.8)*30)`.
- Contact sheet: `ffmpeg -pattern_type glob -i 'test/f*.png' -vf "scale=300:-1,tile=6x3" sheet.png`.
- Crop to the card for close checks: `crop=1080:720:0:700`.
