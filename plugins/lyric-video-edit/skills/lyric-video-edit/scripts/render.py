"""Deterministic frame renderer for a lyric-edit HTML page.
usage: python3 render.py page.html out_dir start_frame end_frame(excl) step [fps=30]
The page must expose window.READY, window.renderAt(t) and window.TOTAL (seconds)."""
import sys, os, time
from playwright.sync_api import sync_playwright
page, out, a, b, step = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])
fps = int(sys.argv[6]) if len(sys.argv) > 6 else 30
os.makedirs(out, exist_ok=True)
with sync_playwright() as p:
    br = p.chromium.launch(executable_path=os.environ.get("PW_CHROME") or None, args=["--disable-gpu", "--force-color-profile=srgb"])
    pg = br.new_context(viewport={"width": 1080, "height": int(os.environ.get("VIEW_H", "1920"))}, device_scale_factor=1).new_page()
    pg.clock.install(time=0)  # freeze timers: only renderAt(t) moves things
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    pg.goto("file://" + os.path.abspath(page))
    pg.wait_for_function("window.READY===true")
    t0 = time.time()
    for f in range(a, b, step):
        pg.evaluate("t=>window.renderAt(t)", f / fps)
        pg.screenshot(path=f"{out}/f{f:05d}.png", type="png")
    print("done", len(range(a, b, step)), "frames in", round(time.time() - t0, 1), "s", errs[:5])
    br.close()
