import { type Page } from '@playwright/test';

import { expectShellLayout } from './helpers/layout';
import { getLatestBulletinRoute, loadInternalMenuTargets, routeMatches } from './helpers/site';
import { expectStableScreenshot } from './helpers/visual';
import { expect, test } from './fixtures';

const internalMenuTargets = loadInternalMenuTargets();
const latestBulletinRoute = getLatestBulletinRoute();
const visualMenuRoutes = [
  {
    route: '/contact',
    snapshot: 'contact',
    title: 'contact page'
  },
  {
    route: '/events',
    snapshot: 'events',
    title: 'event calendar page'
  },
  {
    route: '/finance',
    snapshot: 'finance',
    title: 'finance page'
  },
  {
    route: '/mass-confession-times',
    snapshot: 'mass-confession-times',
    title: 'mass and confession times page'
  },
  {
    route: '/news',
    snapshot: 'news',
    title: 'news page'
  },
  {
    route: '/parish-history',
    snapshot: 'parish-history',
    title: 'parish history page'
  },
  {
    route: '/parish-council',
    snapshot: 'parish-council',
    title: 'parish council page'
  },
  {
    route: '/parish-membership',
    snapshot: 'parish-membership',
    title: 'parish membership page'
  },
  {
    route: '/staff',
    snapshot: 'staff',
    title: 'parish staff page'
  }
] as const;

async function expectMeaningfulMainContent(page: Page) {
  await expect(page.locator('main')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Page not found' })).toHaveCount(0);

  const mainText = (await page.locator('main').innerText()).trim();
  expect(mainText.length).toBeGreaterThan(30);
}

async function expectRouteLoaded(page: Page, route: string) {
  switch (route) {
    case '/':
      await expect(page.getByRole('heading', { name: 'All Are Welcome' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Come Worship With Us' })).toBeVisible();
      break;
    case '/events':
      await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible();
      await expect(page.locator('main')).toContainText('May 2026');
      await expect(page.locator('main')).toContainText('Month');
      break;
    case '/live-stream':
      await expect(page.getByRole('heading', { name: 'Live Stream' })).toBeVisible();
      await expect(page.getByText('View past streams')).toBeVisible();
      await expect(page.locator('main iframe').first()).toBeVisible();
      break;
    case '/parish-bulletins':
      await expect(page).toHaveURL(new RegExp(`${latestBulletinRoute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
      await expect(page.getByRole('heading', { name: 'Parish Bulletins' })).toBeVisible();
      await expect(page.locator('main img[alt*="Page 1"]').first()).toBeVisible();
      break;
    default:
      await expectMeaningfulMainContent(page);
      break;
  }

  await expectShellLayout(page);
}

async function openDrawer(page: Page) {
  await page.getByRole('button', { name: 'open drawer' }).click();
}

async function expectRouteScreenshot(page: Page, name: string, isMobileProject: boolean) {
  await expectStableScreenshot(page, `${name}-${isMobileProject ? 'mobile' : 'desktop'}.png`, {
    mask: [page.locator('iframe')]
  });
}

test.describe('public site smoke coverage', () => {
  test('homepage renders key sections and calls to action', async ({ page, isMobileProject }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'All Are Welcome' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Come Worship With Us' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Weekly Schedule' })).toBeVisible();
    await expect(page.getByRole('heading', { name: "Today's Readings" })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Recent News' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Upcoming Events' })).toBeVisible();
    await expect(page.locator('main').getByRole('link', { name: 'Live Stream Mass', exact: true })).toBeVisible();
    await expect(page.locator('main').getByRole('link', { name: 'Bulletins', exact: true })).toBeVisible();

    await expectShellLayout(page);
    await expectRouteScreenshot(page, 'homepage', isMobileProject);
  });

  test('live stream page loads', async ({ page, isMobileProject }) => {
    await page.goto('/live-stream');

    await expect(page.getByRole('heading', { name: 'Live Stream' })).toBeVisible();
    await expect(page.getByText('View past streams')).toBeVisible();
    await expect(page.locator('main iframe').first()).toBeVisible();

    await expectShellLayout(page);
    await expectRouteScreenshot(page, 'live-stream', isMobileProject);
  });

  test('bulletin landing page resolves to a bulletin detail page', async ({ page, isMobileProject }) => {
    await page.goto('/parish-bulletins');

    await expect(page).toHaveURL(new RegExp(`${latestBulletinRoute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
    await expect(page.getByRole('heading', { name: 'Parish Bulletins' })).toBeVisible();
    await expect(page.locator('main img[alt*="Page 1"]').first()).toBeVisible();

    await expectShellLayout(page);
    await expectRouteScreenshot(page, 'parish-bulletins', isMobileProject);
  });

  test('search returns and opens the live stream page', async ({ page, isMobileProject }) => {
    await page.goto('/');

    const searchInput = page.getByPlaceholder('Search...').first();
    await expect(searchInput).toBeVisible();
    await searchInput.fill('live stream');
    await searchInput.press('Enter');

    await expect(page).toHaveURL(/\/search\?q=live(%20|\+)stream/);
    await expect(page.getByRole('heading', { name: 'Search', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Live Stream', exact: true }).first()).toBeVisible();

    await page.getByRole('link', { name: 'Live Stream', exact: true }).first().click();
    await expect(page).toHaveURL(/\/live-stream$/);
    await expect(page.getByRole('heading', { name: 'Live Stream' })).toBeVisible();

    await expectShellLayout(page);
    await expectRouteScreenshot(page, 'search-results', isMobileProject);
  });

  for (const visualRoute of visualMenuRoutes) {
    test(`${visualRoute.title} keeps a stable visual baseline`, async ({ page, isMobileProject }) => {
      await page.goto(visualRoute.route);

      await expectRouteLoaded(page, visualRoute.route);
      await expectRouteScreenshot(page, visualRoute.snapshot, isMobileProject);
    });
  }

  test('all internal menu destinations load meaningful content', async ({ page }) => {
    test.slow();

    for (const target of internalMenuTargets) {
      await test.step(`${target.title} -> ${target.route}`, async () => {
        await page.goto(target.route);
        await expectRouteLoaded(page, target.route);
      });
    }
  });

  test('mobile drawer links navigate to every internal menu destination', async ({ page, isMobileProject }) => {
    test.skip(
      !(isMobileProject && test.info().project.name === 'mobile-chromium'),
      'Run drawer sweep once on a mobile project.'
    );

    for (const target of internalMenuTargets) {
      await test.step(`drawer link ${target.title}`, async () => {
        await page.goto('/');
        await openDrawer(page);

        if (target.parentTitle) {
          await page.getByRole('button', { name: target.parentTitle, exact: true }).click();
        }

        const drawerLink = page.locator(`a[href="${target.route}"]`).last();
        await expect(drawerLink).toBeVisible();

        await Promise.all([page.waitForURL((url) => routeMatches(url.pathname, target.route)), drawerLink.click()]);

        await expectRouteLoaded(page, target.route);
      });
    }
  });
});
