import { expect, type Locator, type Page } from '@playwright/test';

interface StableScreenshotOptions {
  clip?: {
    height: number;
    width: number;
    x: number;
    y: number;
  };
  fullPage?: boolean;
  mask?: Locator[];
  maxDiffPixelRatio?: number;
  maxDiffPixels?: number;
  timeout?: number;
}

export async function waitForVisualReady(page: Page) {
  await page.waitForLoadState('load');
  await page.evaluate(async () => {
    if ('fonts' in document) {
      await document.fonts.ready;
    }

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });
  });

  const dailyReadingsHeading = page.getByRole('heading', { name: "Today's Readings", exact: true });
  if ((await dailyReadingsHeading.count()) > 0) {
    await expect(page.getByText('Acts 1:1-11').first()).toBeVisible({ timeout: 5000 });
  }

  const mainSearchBox = page.locator('main').getByRole('textbox', { name: 'Search...' }).first();
  if ((await mainSearchBox.count()) > 0) {
    await expect(mainSearchBox).toBeVisible({ timeout: 5000 });
  }
}

export async function expectStableScreenshot(page: Page, name: string, options: StableScreenshotOptions = {}) {
  await waitForVisualReady(page);
  await expect(page).toHaveScreenshot(name, {
    animations: 'disabled',
    caret: 'hide',
    fullPage: true,
    scale: 'css',
    ...options
  });
}
