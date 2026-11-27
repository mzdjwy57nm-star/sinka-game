const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const [,, html, outDir, fromF, toF, step] = process.argv;
(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  // virtual clock: performance.now / Date.now / rAF / setTimeout are driven by __advance
  await p.addInitScript(() => {
    let vt = 0, q = [], timers = [], id = 0; const T0 = 1700000000000;
    performance.now = () => vt; Date.now = () => T0 + vt;
    window.requestAnimationFrame = cb => { q.push(cb); return ++id; };
    window.cancelAnimationFrame = () => {};
    window.setTimeout = (cb, ms = 0) => { timers.push([vt + ms, cb]); return ++id; };
    window.__advance = ms => { vt = ms;
      timers.filter(t => t[0] <= vt).forEach(t => t[1]()); timers = timers.filter(t => t[0] > vt);
      const cbs = q; q = []; cbs.forEach(cb => cb(vt)); };
  });
  await p.goto('file://' + path.resolve(html));
  await p.waitForFunction(() => window.__ready === true);
  const st = await p.$('#stage');
  for (let f = +fromF; f < +toF; f += (+step || 1)) {
    await p.evaluate(ms => window.__advance(ms), f * 1000 / 30);
    await st.screenshot({ path: path.join(outDir, String(f).padStart(5, '0') + '.png') });
  }
  await b.close();
})();
