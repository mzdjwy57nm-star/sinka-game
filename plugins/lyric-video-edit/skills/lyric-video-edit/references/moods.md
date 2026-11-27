# Mood presets

## Default (calm, colourful)
- Saturated dark gradients per scene matching the line's emotion; pink hearts, about 1 in 3 breaks.

## Sad ("грустнее")
- Dark, cold, low-saturation `BGS` (e.g. `['#06080f','#1c2440','#5a6a9a']`), dark red only for a heart/ending scene.
- `#main` CSS filter: `saturate(.6) brightness(.9)`.
- Hearts colour `#8a82b8`, opacity ×0.7, 3 of 4 break.
- Rain over the whole frame: ~46 thin slanted strokes `#bcc8f0` at opacity .16, speed 620–1000 px/s, inside `hearts()`.
- Combine with the slow pace from `timing.md`.

## Hype / bright
- Saturated neon BGS, faster pace (WORD .09, lines 2.5–3 s), stamps and chips slam in, more sparkles.

## Purple glass (first reference style)
- Purple gradient background, translucent glass cards with blur and white 14% border, UI widgets.
