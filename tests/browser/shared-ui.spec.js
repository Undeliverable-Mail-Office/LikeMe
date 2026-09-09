// @ts-check
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const candidate = JSON.parse(readFileSync(new URL('./candidate.json', import.meta.url), 'utf8'));
const assets = new Map();
const label = 'Built by Marco Polo Research Lab';
test.beforeAll(async () => {
  for (const name of ['mpr-ui.js', 'mpr-ui.css']) {
    const response = await fetch(`https://raw.githubusercontent.com/MarcoPoloResearchLab/mpr-ui/${candidate.revision}/${name}`, { signal: AbortSignal.timeout(15000) });
    expect(response.ok).toBe(true);
    const body = Buffer.from(await response.arrayBuffer());
    expect(createHash('sha256').update(body).digest('hex')).toBe(candidate.assets[name]);
    assets.set(name, body);
  }
});
for (const width of [390, 1280]) {
  test(`the exported page preserves navigation, menu, themes, and images at ${width}px`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('https://**/*', route => {
      const name = new URL(route.request().url()).pathname.split('/').pop();
      if (assets.has(name)) return route.fulfill({ body: assets.get(name), contentType: name.endsWith('.css') ? 'text/css' : 'application/javascript' });
      return route.fulfill({ body: '', contentType: 'application/javascript' });
    });
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Products, ad-native', exact: true })).toBeVisible();
    const navigation = page.getByRole('navigation', { name: 'Primary' });
    if (width < 640) {
      await expect(navigation).toHaveCount(0);
      await page.getByRole('link', { name: 'Read the announcement', exact: true }).click();
    } else {
      await navigation.getByRole('link', { name: 'Announcement', exact: true }).click();
    }
    await expect(page).toHaveURL(/#announcement$/);
    const footer = page.locator('mpr-footer');
    const menu = footer.getByRole('button', { name: label, exact: true });
    await expect(menu).toBeVisible();
    await menu.focus(); await page.keyboard.press('Enter');
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    for (const [name, href] of [['Marco Polo Research Lab', 'https://mprlab.com'], ['Like Me', 'https://likeme.mprlab.com'], ['GitHub Pages', 'https://pages.github.com/']]) {
      await expect(footer.getByRole('link', { name, exact: true })).toHaveAttribute('href', href);
    }
    await page.keyboard.press('Escape');
    await expect(menu).toBeFocused();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await footer.getByRole('link', { name: 'Products', exact: true }).click();
    await expect(page).toHaveURL(/#products$/);
    const control = footer.locator('[data-mpr-theme-toggle="control"]');
    await control.scrollIntoViewIfNeeded();
    const controlBox = await control.boundingBox();
    const gridBox = await control.locator('[data-mpr-theme-toggle="grid"]').boundingBox();
    if (!controlBox || !gridBox) throw new Error('Theme control geometry is unavailable');
    /** @type {Array<[string, number, number]>} */
    const selections = [
      ['cyberpunk-light', 0.25, 0.25], ['sunrise-light', 0.75, 0.25],
      ['cyberpunk-dark', 0.25, 0.75], ['forest-dark', 0.75, 0.75],
    ];
    for (const [mode, xRatio, yRatio] of selections) {
      await control.click({ position: {
        x: gridBox.x - controlBox.x + gridBox.width * xRatio,
        y: gridBox.y - controlBox.y + gridBox.height * yRatio,
      } });
      await expect(control).toHaveAttribute('data-square-mode', mode);
    }
    await expect.poll(() => page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}
