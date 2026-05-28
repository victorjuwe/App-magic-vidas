import { chromium, devices } from 'playwright';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ ...devices['iPhone 15 Pro Max'] });
const page = await ctx.newPage();

const errors = [];
const requests = [];
page.on('console', msg => console.log('[console.' + msg.type() + ']', msg.text()));
page.on('pageerror', err => { errors.push(err.message); console.log('[pageerror]', err.message); });
page.on('requestfailed', req => console.log('[reqfail]', req.url(), req.failure()?.errorText));
page.on('response', resp => {
  if (resp.status() >= 400) console.log('[' + resp.status() + ']', resp.url());
});

try {
  await page.goto('http://localhost:8081/contador.html', { waitUntil: 'networkidle', timeout: 15000 });
} catch (e) {
  console.log('[goto-error]', e.message);
}

await page.waitForTimeout(8000);

const state = await page.evaluate(() => ({
  bodyText: document.body.innerText.slice(0, 200),
  loadingVisible: document.getElementById('loading-screen')?.classList.contains('fade-out') === false,
  lobbyVisible: !document.getElementById('lobby-screen')?.classList.contains('hidden'),
  hasInitAppEngine: typeof window.initAppEngine,
  hasThree: typeof window.THREE,
  hasAnime: typeof window.anime,
  loadStatus: document.getElementById('loadStatus')?.textContent,
  loadProgress: document.getElementById('loadProgress')?.style.width
}));

console.log('---STATE---');
console.log(JSON.stringify(state, null, 2));
console.log('---ERRORS---');
errors.forEach(e => console.log(e));

await page.screenshot({ path: 'lobby-proof.png', fullPage: false });
console.log('Screenshot saved: scratch/lobby-proof.png');

await browser.close();
