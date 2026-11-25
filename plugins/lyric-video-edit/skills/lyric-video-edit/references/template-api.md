# Template API (`assets/template.html`)

## Structure
- Root `<svg id="main">` 1080×1920 with `<defs>` (filters `fG` glow, `fS` soft shadow, `clipL`/`clipR` heart halves, `vig`, `gSpark`), a background group `bgLayer` and a panel group; the caption is an HTML div above it.
- `renderAt(t)` is pure: it rebuilds the background (`bgScene(i,t,op)` + `hearts(t)` + vignette) and the cards every frame. No timers, no requestAnimationFrame — the renderer freezes the clock and calls `renderAt(frame/30)`.
- Card: `translate(80 730)`, `shell(theme, inner)` draws the 920×640 rounded card. During the `FADE` window the old and new cards cross-fade with blur and slide.
- `window.READY`, `window.renderAt`, `window.TOTAL`, `window.LINES` are exposed.
- Gotcha: never give an element an id that is also used by a gradient (`getElementById` returns the first match). Ids created inside `draw()` (clipPaths, gradients) must be unique per scene.

## Scene entry
```js
{d:5.6, theme:'dark', t:"ОНА #НЕ +ХОЧЕТ БЫТЬ СО #МНОЙ", pc:['rd','vi'], draw:lt=>{ let o=''; ...; return o }}
```
- `d` duration in seconds (cumulative start times are computed).
- `ws` (optional) array of word start times in seconds from the line start, one per caption token (`—` counts). Use it when the words must hit a real vocal; otherwise words follow `W0 + WORD*j`.
- `t` caption: `#WORD` opens a new plate using the next color from `pc`; `+WORD` continues the previous plate; trailing punctuation is split off automatically.
- Plate colors (`COL`): pk `#ff5c9c`, gr `#3ee08f`, vi `#9b7bff`, bl `#3aa8ff`, ye `#ffc933`, rd `#ff4d5e`, cy `#38e0ff`, or `#ff8a3d`.
- `BGS[i] = [top, bottom, glow]` per scene; gradients are injected into defs automatically.

## Helpers (card coordinates 920×640)
- `T(x,y,text,size,{a:'start|middle|end', w:weight, fill, op, ls, ff:fontFamily, it:italic})` — text. `LORA` = handwriting font.
- `chip(cx,cy,text,col,size,textCol)` — glowing pill label.
- `stamp(text,x,y,rot,u,col,size)` — slam-in stamp, `u` = time since it starts.
- `avatar(x,y,r,col)`, `heartIcon(x,y,size,col,op,rot)`, `brokenIcon(x,y,size,col,op,rot,gap)`, `HP` heart path.
- `sparkle(x,y,s,op)` — pass NUMBERS, not `f()` strings (string concat breaks path data).
- `star(x,y,r,col,op)`, `tick(x,y,col)` (double check), `barRow(x,y,w,label,val,valTxt,col)`, `typed(str,lt,t0,dur)`, `caret(lt)`, `snow`, `FLAME`.
- Math: `f()` (format number), `ease`, `eo` (ease-out), `backO` (overshoot), `lerp`, `clamp`, `hash(i)` (deterministic 0..1), `pct`.
- Card header convention: small label at `T(40,66,'LABEL',18,{ls:3,op:.7})`.
