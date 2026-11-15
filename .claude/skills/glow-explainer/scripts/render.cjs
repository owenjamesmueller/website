#!/usr/bin/env node
/* Deterministic frame renderer: loads project/index.html in headless Chromium,
 * calls window.__seek(t) for every frame, pipes screenshots into ffmpeg and
 * muxes the voiceover.
 *
 * usage: node render.cjs <project_dir> [--audio voice.mp3] [--out out.mp4]
 *                         [--fps 30] [--mb 3] [--from 0] [--to <sec>] [--still 3.5,8,12]
 *   --workers N  render N time-segments in parallel browsers, then join (default: CPUs-1, max 4)
 *   --bloom  post bloom strength (default 1, 0 = off)
 *   --mb     motion blur: render N sub-frames per frame and blend them (default 3, 1 = off)
 *   --check  scan the whole video every 0.25 s: report overlapping UI and anything outside the Reels safe zone
 *   --still  only writes PNG stills at the given times (fast preview) to <project>/stills/
 */
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const dir = path.resolve(args[0] || '.');
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const fps = +opt('fps', 30);
const audio = opt('audio', fs.existsSync(path.join(dir, 'voice.mp3')) ? path.join(dir, 'voice.mp3') : null);
const out = path.resolve(opt('out', path.join(dir, 'out.mp4')));
const still = opt('still', null);
const mb = Math.max(1, +opt('mb', 3));
const workers = Math.max(1, +opt('workers', Math.min(4, Math.max(1, require('os').cpus().length - 1))));
const isSegment = args.includes('--segment');
// Full-frame bloom in post: a tight core glow + a wide soft halo, screen-blended over the frame.
const bloom = +opt('bloom', 1);
const BLOOM = bloom > 0
  ? `split=2[o][h];[h]colorlevels=rimin=0.45:gimin=0.45:bimin=0.45,split=2[a][b];[a]gblur=sigma=7[a2];[b]gblur=sigma=40[b2];[a2][b2]blend=all_mode=screen[g];[o][g]blend=all_mode=screen:all_opacity=${(0.85 * bloom).toFixed(2)}`
  : 'null';

(async () => {
  let browser;
  try { browser = await chromium.launch(); }
  catch { browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); }
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('console', (m) => { if (['warning', 'error'].includes(m.type())) console.log('[page]', m.text()); });
  page.on('pageerror', (e) => console.log('[page error]', e.message));
  await page.goto('file://' + path.join(dir, 'index.html'));
  await page.waitForFunction('window.__ready === true', null, { timeout: 30000 });
  await page.evaluate(() => document.fonts && document.fonts.ready);

  if (args.includes('--check')) {
    const duration = await page.evaluate(() => window.DURATION || 10);
    const issues = await page.evaluate((duration) => {
      // Reels safe zone (conservative blend of published guides): text must stay inside this box;
      // the right 150 px below y=960 is covered by like/comment/share buttons.
      const SAFE = { top: 270, bottom: 1500, left: 65, right: 1015, rightColX: 930, rightColY: 960 };
      const UI = '.gx-pill,.gx-stat,.gx-headline,.gx-card,.gx-bubble,.gx-notify,.gx-tag,.gx-icon:not(.gx-icon-coin):not(.gx-icon-sparkle),.gx-bar,.gx-chart,.gx-figure';
      const TEXT = '.gx-pill,.gx-stat,.gx-headline,.gx-card,.gx-bubble,.gx-notify,.gx-tag,.gx-bar';
      const vis = (el) => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= +getComputedStyle(e).opacity; return o; };
      const name = (el) => (el.className.baseVal ?? el.className).split(' ').find((c) => c.startsWith('gx-') && c !== 'gx-svg') + ':' + (el.textContent || '').trim().slice(0, 22);
      const box = (el) => { const r = el.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom }; };
      const out = new Map();
      for (let t = 0; t < duration; t += 0.25) {
        window.__seek(t);
        const els = [...document.querySelectorAll(UI)].filter((e) => !e.closest('[data-overlap-ok]') && vis(e) > 0.6 && !e.parentElement.closest(UI));
        const B = els.map(box);
        for (let i = 0; i < els.length; i++) {
          const a = B[i];
          if (els[i].matches(TEXT)) {
            const off = a.t < SAFE.top || a.b > SAFE.bottom || a.l < SAFE.left || a.r > SAFE.right || (a.r > SAFE.rightColX && a.b > SAFE.rightColY);
            if (off) { const k = 'SAFE ' + name(els[i]); if (!out.has(k)) out.set(k, t.toFixed(2)); }
          }
          for (let j = i + 1; j < els.length; j++) {
            if (els[i].matches('.gx-figure') && els[j].matches('.gx-figure')) continue;
            const b = B[j], pad = 6;
            const ix = Math.min(a.r, b.r) - Math.max(a.l, b.l), iy = Math.min(a.b, b.b) - Math.max(a.t, b.t);
            if (ix > pad && iy > pad) { const k = 'OVERLAP ' + name(els[i]) + '  ×  ' + name(els[j]); if (!out.has(k)) out.set(k, t.toFixed(2)); }
          }
        }
      }
      return [...out.entries()].map(([k, t]) => `t=${t}s  ${k}`);
    }, duration);
    console.log(issues.length ? issues.join('\n') : 'no overlaps, everything inside the safe zone');
    console.log(`${issues.length} issue(s)`);
    await browser.close();
    process.exit(issues.length ? 2 : 0);
  }
  if (still) {
    fs.mkdirSync(path.join(dir, 'stills'), { recursive: true });
    for (const t of still.split(',').map(Number)) {
      await page.evaluate((t) => window.__seek(t), t);
      const f = path.join(dir, 'stills', `t${t.toFixed(2)}.png`);
      const raw = f.replace(/\.png$/, '.raw.png');
      await page.screenshot({ path: raw });
      await new Promise((r) => spawn('ffmpeg', ['-y', '-v', 'error', '-i', raw, '-vf', BLOOM, f]).on('close', r));
      fs.unlinkSync(raw);
      console.log('still', f);
    }
    await browser.close();
    return;
  }

  const duration = await page.evaluate(() => window.DURATION || 10);
  const from = +opt('from', 0), to = +opt('to', duration);

  if (workers > 1 && !isSegment) {
    // split into frame-aligned segments, render each in its own process, then concat + mux audio
    await browser.close();
    const total = Math.ceil((to - from) * fps), per = Math.ceil(total / workers);
    const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'gx-'));
    const segs = [];
    const jobs = [];
    for (let k = 0; k < workers; k++) {
      const f0 = from + (k * per) / fps, f1 = Math.min(to, from + ((k + 1) * per) / fps);
      if (f1 <= f0) break;
      const seg = path.join(tmp, `seg${k}.mp4`); segs.push(seg);
      jobs.push(new Promise((res, rej) => {
        const c = spawn(process.execPath, [__filename, dir, '--segment', '--workers', '1', '--fps', String(fps), '--mb', String(mb), '--bloom', String(bloom),
          '--from', String(f0), '--to', String(f1), '--out', seg, '--audio', 'none'], { stdio: ['ignore', 'ignore', 'inherit'] });
        c.on('close', (code) => (code === 0 ? res() : rej(new Error('segment ' + k + ' failed'))));
      }));
    }
    const t0 = Date.now();
    await Promise.all(jobs);
    fs.writeFileSync(path.join(tmp, 'list.txt'), segs.map((s) => `file '${s}'`).join('\n'));
    const ff = ['-y', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'list.txt')];
    if (audio && audio !== 'none') ff.push('-ss', String(from), '-i', audio, '-c:a', 'aac', '-b:a', '192k', '-shortest');
    ff.push('-c:v', 'copy', '-movflags', '+faststart', out);
    await new Promise((r) => spawn('ffmpeg', ff, { stdio: ['ignore', 'ignore', 'inherit'] }).on('close', r));
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log(`wrote ${out} with ${segs.length} workers in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    return;
  }
  const n = Math.ceil((to - from) * fps * mb);
  const ff = ['-y', '-f', 'image2pipe', '-framerate', String(fps * mb), '-c:v', 'mjpeg', '-i', '-'];
  const useAudio = audio && audio !== 'none';
  if (useAudio) ff.push('-ss', String(from), '-i', audio);
  ff.push('-vf', (mb > 1 ? `tmix=frames=${mb},framestep=${mb},` : '') + BLOOM);
  ff.push('-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-r', String(fps));
  if (useAudio) ff.push('-c:a', 'aac', '-b:a', '192k', '-shortest');
  ff.push('-movflags', '+faststart', out);
  const proc = spawn('ffmpeg', ff, { stdio: ['pipe', 'ignore', 'inherit'] });
  let ffDead = false;
  proc.on('close', (code) => { ffDead = true; if (code) { console.error(`ffmpeg exited with code ${code}`); process.exit(1); } });
  proc.stdin.on('error', () => {});

  const t0 = Date.now();
  for (let i = 0; i < n; i++) {
    const t = from + i / (fps * mb);
    await page.evaluate((t) => window.__seek(t), t);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (ffDead) throw new Error('ffmpeg stopped early');
    if (!proc.stdin.write(buf)) await new Promise((r) => { proc.stdin.once('drain', r); proc.once('close', r); });
    if (i % (fps * mb) === 0) process.stdout.write(`\rframe ${i}/${n}  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  }
  proc.stdin.end();
  await new Promise((r) => proc.on('close', r));
  await browser.close();
  console.log(`\nwrote ${out}`);
})();
