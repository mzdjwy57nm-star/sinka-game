---
name: lyric-video-edit
description: This skill should be used when the user sends song lyrics and wants a vertical lyric video / edit ("сделай эдит", "сделай видео по тексту", "lyric video", "текст песни для тиктока/рилс"), or asks to restyle, slow down, make sadder, or redo scenes of such an edit. Produces a silent 1080x1920 MP4 with word-by-word captions on colored plates and a unique animated app-screen scene per line.
---

# Lyric video edit

Build a vertical lyric edit from pasted lyrics: one HTML page where every lyric line is a scene, rendered frame-by-frame in headless Chromium and encoded with ffmpeg. The user adds the audio later, so the video is silent.

## Output spec (defaults — the user's words override them)

- MP4, 1080×1920, 30 fps, H.264 crf 17, **no audio**.
- **Caption** at ~14% from the top, CAPS, left-aligned, words appear one by one (pop + blur-in). Key words sit on colored plates; a plate appears together with its word, never earlier. The caption is empty at the start of each line.
- **Scene card** (one single frame, 920×640, at ~38% from the top) under the caption: a generic, unbranded **app-screen mockup** drawn in SVG that acts out the meaning of the line (chat, player, calendar, map, gallery, letter, monitor…). Every line gets a different screen and something must keep moving in it.
- **Background**: per-scene vertical gradient + soft moving glow, sparkles, vignette, cross-faded between scenes. Hearts (some breaking) float up occasionally.
- Everything is drawn in code (SVG, gradients, glow, shadows). No emoji, no photos, no brand logos or characters. Sounds and laughter are written as text ("пик", "тук", "ха-ха").

## Text rules

- Remove bracketed parts (ad-libs, backing vocals). If the user asks to keep one (e.g. "оставь"), keep it as its own short line without brackets.
- Keep profanity exactly as written; do NOT touch asterisks (`таб**ок`, `за****`).
- Fix obvious typos only, and tell the user which ones.
- Repeated lines get their own, different scene (a second take on the idea), never a copy.
- Lines about suicide, pills, overdose or self-harm keep their caption text, but the picture stays neutral or metaphorical (a gauge, an overload grid, a paused player, a ripple on a map). Never draw pills, blood, bodies or methods. If the user explicitly asks for a specific non-graphic image (e.g. a heartbeat that stops), it is fine to draw it tastefully. If the lyrics or user hint at personal distress, add one warm line offering to talk.

## Workflow

1. Split the lyrics into lines and apply the text rules. Announce the line list and any assumptions in one short message, then build without waiting.
2. Copy `assets/template.html` to a working file. Replace only:
   - `BGS` — one `[top, bottom, glow]` color triple per scene, matching the mood.
   - `SC` — one entry per line: `{d, theme:'dark', t, pc, draw:lt=>svg}`.
   - Timing constants if the user wants a different pace (see `references/timing.md`).
3. Write each `draw(lt)` as a pure function of local time `lt` (seconds since the line started) returning an SVG string in card coordinates (920×640). Use the helpers listed in `references/template-api.md`. Plan a mini-story per scene: setup → change → payoff (e.g. messages arrive → "прочитано" → he starts typing and deletes it).
4. Test: render ~2 frames per scene (at ~35% and ~80% of each line) with `scripts/render.py`, tile them into a contact sheet with ffmpeg, look at it, fix overlaps, overflow, and JS errors (the renderer prints console errors).
5. Full build: `scripts/build.sh work.html out.mp4` (renders all frames in two processes, encodes, writes a contact sheet). Check the sheet, then send the MP4.
6. Final message: what is in each scene in one line each, which lines were treated neutrally, typo fixes, and that the card texts are invented.

For partial changes (one scene redone), re-render only that scene's frame range into the existing frame folder and re-encode.

## When the user sends the track (video or audio)

1. Extract audio: `ffmpeg -i in.mp4 -vn -ac 1 -ar 16000 song.wav`.
2. Word timestamps with faster-whisper (`medium`, `language="ru"`, `word_timestamps=True`, the lyrics as `initial_prompt`). Feed audio as a numpy array if PyAV refuses the file. Models come from huggingface.co: if blocked, propose adding the HF hosts to the environment.
3. Words come from the user's text, only the times from audio. A line missed by whisper: transcribe that slice alone with the line as prompt.
4. Set each scene's `d` so scenes start ~0.12 s before their first word, and pass `ws` for every line. Total = song length + short tail.
5. Deliver the silent MP4; optionally also a copy muxed with the track for checking.

## Environment notes

- If the Python playwright's own browser is missing, set `PW_CHROME` to a Chromium binary (e.g. `/opt/pw-browsers/chromium`); `render.py` passes it as `executable_path`.
- Fonts: Fira Sans (`mozilla/Fira` ttf, Heavy = 900) and Lora Italic (`google/fonts` ofl/lora) into `~/.local/share/fonts`, then `fc-cache -f`.
- Plate colours in `PL` must exist for every `pc` key you use.

## Style variations the user asks for

See `references/moods.md` for concrete settings: slower pace, sadder (muted palette, rain, broken hearts), brighter/hype, purple glass cards.

## Additional resources

- `references/template-api.md` — page structure, caption markup (`#WORD`, `+WORD`), helpers, plate colors.
- `references/timing.md` — durations, word speed, fades, test-frame formula.
- `references/scene-ideas.md` — tested scene recipes mapped to typical lyric themes.
- `references/moods.md` — mood presets.
- `assets/template.html` — the working template (last version: sad, slow, 9 scenes).
- `scripts/render.py`, `scripts/build.sh` — renderer and one-shot build. Requires python3 + playwright (chromium) + ffmpeg; fonts: Fira Sans (UI, Cyrillic) and Lora italic (handwriting).
