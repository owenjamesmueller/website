#!/usr/bin/env node
/* Deterministic frame renderer: loads project/index.html in headless Chromium,
 * calls window.__seek(t) for every frame, pipes screenshots into ffmpeg and
 * muxes the voiceover.
 *
 * usage: node render.cjs <project_dir> [--audio voice.mp3] [--out out.mp4]
 *                         [--fps 30] [--mb 3] [--from 0] [--to <sec>] [--still 3.5,8,12]
 *   --workers N  render N time-segments in parallel browsers, then join (default: CPUs-1, max 4)
 *   --mb     motion blur: render N sub-frames per frame and blend them (default 3, 1 = off)
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

  if (still) {
    fs.mkdirSync(path.join(dir, 'stills'), { recursive: true });
    for (const t of still.split(',').map(Number)) {
      await page.evaluate((t) => window.__seek(t), t);
      const f = path.join(dir, 'stills', `t${t.toFixed(2)}.png`);
      await page.screenshot({ path: f });
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
        const c = spawn(process.execPath, [__filename, dir, '--segment', '--workers', '1', '--fps', String(fps), '--mb', String(mb),
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
  if (mb > 1) ff.push('-vf', `tmix=frames=${mb},select='not(mod(n\\,${mb}))'`, '-fps_mode', 'passthrough');
  ff.push('-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-r', String(fps));
  if (useAudio) ff.push('-c:a', 'aac', '-b:a', '192k', '-shortest');
  ff.push('-movflags', '+faststart', out);
  const proc = spawn('ffmpeg', ff, { stdio: ['pipe', 'ignore', 'inherit'] });

  const t0 = Date.now();
  for (let i = 0; i < n; i++) {
    const t = from + i / (fps * mb);
    await page.evaluate((t) => window.__seek(t), t);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!proc.stdin.write(buf)) await new Promise((r) => proc.stdin.once('drain', r));
    if (i % (fps * mb) === 0) process.stdout.write(`\rframe ${i}/${n}  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  }
  proc.stdin.end();
  await new Promise((r) => proc.on('close', r));
  await browser.close();
  console.log(`\nwrote ${out}`);
})();
