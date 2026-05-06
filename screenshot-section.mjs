import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, 'temporary screenshots', 'screenshot-estates-section.png');

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/Nithish Kanna/.cache/puppeteer/chrome/win64-147.0.7727.57/chrome-win64/chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 800));

const pageHeight = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y <= pageHeight; y += 500) {
  await page.evaluate(y => window.scrollTo(0, y), y);
  await new Promise(r => setTimeout(r, 80));
}
await page.evaluate(() => document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible')));
await new Promise(r => setTimeout(r, 400));

const rect = await page.evaluate(() => {
  const el = document.getElementById('estates');
  const r = el.getBoundingClientRect();
  return { top: r.top + window.scrollY, height: el.offsetHeight };
});

await page.screenshot({
  path: outPath,
  clip: { x: 0, y: rect.top, width: 1440, height: Math.min(rect.height, 2600) }
});

await browser.close();
console.log('Saved:', outPath);
