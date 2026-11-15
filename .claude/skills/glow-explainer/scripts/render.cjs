#!/usr/bin/env node
/* Deterministic frame renderer: loads project/index.html in headless Chromium,
 * calls window.__seek(t) for every frame, pipes screenshots into ffmpeg and
 * muxes the voiceover.
 *
 * usage: node render.cjs <project_dir> [--audio voice.mp3] [--out out.mp4]
 *                         [--fps 30] [--from 0] [--to <sec>] [--still 3.5,8,12]
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
  const n = Math.ceil((to - from) * fps);
  const ff = ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-'];
  if (audio) ff.push('-ss', String(from), '-i', audio);
  ff.push('-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-r', String(fps));
  if (audio) ff.push('-c:a', 'aac', '-b:a', '192k', '-shortest');
  ff.push('-movflags', '+faststart', out);
  const proc = spawn('ffmpeg', ff, { stdio: ['pipe', 'ignore', 'inherit'] });

  const t0 = Date.now();
  for (let i = 0; i < n; i++) {
    const t = from + i / fps;
    await page.evaluate((t) => window.__seek(t), t);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!proc.stdin.write(buf)) await new Promise((r) => proc.stdin.once('drain', r));
    if (i % fps === 0) process.stdout.write(`\rframe ${i}/${n}  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  }
  proc.stdin.end();
  await new Promise((r) => proc.on('close', r));
  await browser.close();
  console.log(`\nwrote ${out}`);
})();
