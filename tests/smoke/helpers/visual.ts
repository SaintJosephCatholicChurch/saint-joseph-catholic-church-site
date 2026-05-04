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
