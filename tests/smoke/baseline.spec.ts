import { type Locator, type Page } from '@playwright/test';

import { expectShellLayout } from './helpers/layout';
import { getLatestBulletinRoute, loadInternalMenuTargets, routeMatches } from './helpers/site';
import { expectStableScreenshot } from './helpers/visual';
import { expect, test } from './fixtures';

interface VisualPageRoute {
  maxDiffPixelRatio?: number;
  route: string;
  snapshot: string;
  title: string;
}

const internalMenuTargets = loadInternalMenuTargets();
const latestBulletinRoute = getLatestBulletinRoute();
const visualPageRoutes: VisualPageRoute[] = [
  {
    route: '/ask',
    snapshot: 'ask',
    title: 'ask page'
  },
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
    maxDiffPixelRatio: 0.015,
    route: '/staff',
    snapshot: 'staff',
    title: 'parish staff page'
  },
  {
    route: '/test-parish-registration',
    snapshot: 'test-parish-registration',
    title: 'test parish registration page'
  }
];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function expectMeaningfulMainContent(page: Page) {
  await expect(page.locator('main')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Page not found' })).toHaveCount(0);

  const mainText = (await page.locator('main').innerText()).trim();
  expect(mainText.length).toBeGreaterThan(30);
}

function getNewsArticleLink(page: Page) {
  return page.locator('main a[href^="/news/"]:not([href^="/news/page/"]):not([href^="/news/tags/"])').first();
}

async function expectRouteLoaded(page: Page, route: string) {
  switch (route) {
    case '/':
      await expect(page.getByRole('heading', { name: 'All Are Welcome' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Come Worship With Us' })).toBeVisible();
      break;
    case '/ask':
      await expect(page.getByRole('heading', { name: 'Did You Know? Question Submission' })).toBeVisible();
      await expect(page.getByText('To ask a question, fill in the request form below.')).toBeVisible();
      await expect(page.getByLabel('Full Name')).toBeVisible();
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Questions')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Send Message' })).toBeVisible();
      break;
    case '/contact':
      await expect(page.getByRole('heading', { name: 'Contact' })).toBeVisible();
      await expect(page.getByLabel('Full Name')).toBeVisible();
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Comments / Questions')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Send Message' })).toBeVisible();
      break;
    case '/events':
      await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible();
      await expect(page.locator('main')).toContainText('May 2026');
      await expect(page.locator('main')).toContainText('Month');
      break;
    case '/live-stream':
      await expect(page.getByRole('heading', { name: 'Live Stream' })).toBeVisible();
      await expect(page.locator('main iframe').first()).toBeVisible();
      break;
    case '/mass-confession-times':
      await expect(page.locator('main')).toContainText('Sunday Mass');
      await expect(page.locator('main')).toContainText('Weekday Mass');
      await expect(page.locator('main')).toContainText('Mass Times');
      break;
    case '/news':
      await expect(getNewsArticleLink(page)).toBeVisible();
      await expectMeaningfulMainContent(page);
      break;
    case '/parish-bulletins':
      await expect(page).toHaveURL(new RegExp(`${escapeRegExp(latestBulletinRoute)}$`));
      await expect(page.getByRole('heading', { name: 'Parish Bulletins' })).toBeVisible();
      await expect(page.locator('main img[alt*="Page 1"]').first()).toBeVisible();
      break;
    case '/staff':
      await expect(page.getByRole('heading', { name: 'Parish Staff' })).toBeVisible();
      await expectMeaningfulMainContent(page);
      break;
    case '/test-parish-registration':
      await expect(page.getByRole('heading', { name: 'Parish Membership' })).toBeVisible();
      await expect(page.getByText('Please complete the parish registration form below.')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Family Information' })).toBeVisible();
      await expect(page.getByLabel('Mailing Name')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Submit Registration' })).toBeVisible();
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

async function expectRouteScreenshot(
  page: Page,
  name: string,
  isMobileProject: boolean,
  options: {
    mask?: Locator[];
    maxDiffPixelRatio?: number;
    timeout?: number;
  } = {}
) {
  await expectStableScreenshot(page, `${name}-${isMobileProject ? 'mobile' : 'desktop'}.png`, {
    mask: [page.locator('iframe'), page.locator('footer img'), ...(options.mask ?? [])],
    ...options
  });
}

test.describe('public site smoke coverage', () => {
  test('homepage renders key sections and calls to action', async ({ page, isMobileProject }) => {
    await page.goto('/');

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

    await expect(page).toHaveURL(new RegExp(`${escapeRegExp(latestBulletinRoute)}$`));
    await expect(page.getByRole('heading', { name: 'Parish Bulletins' })).toBeVisible();
    await expect(page.locator('main img[alt*="Page 1"]').first()).toBeVisible();

    await expectShellLayout(page);
    await expectRouteScreenshot(page, 'parish-bulletins', isMobileProject, {
      timeout: 15000
    });
  });

  test('news listing opens the latest article detail page', async ({ page, isMobileProject }) => {
    await page.goto('/news');

    await expectRouteLoaded(page, '/news');

    const latestArticleLink = getNewsArticleLink(page);
    await expect(latestArticleLink).toBeVisible();
    const articleTitle = ((await latestArticleLink.innerText()) || '').trim();

    await Promise.all([page.waitForURL((url) => /^\/news\/[^/]+$/.test(url.pathname)), latestArticleLink.click()]);

    await expect(page.locator('main').locator('h1, h2').first()).toBeVisible();
    await expect(page.locator('main')).toContainText(articleTitle.split('\n')[0] ?? '');
    await expectMeaningfulMainContent(page);
    await expectShellLayout(page);
    await expectRouteScreenshot(page, 'news-detail', isMobileProject, {
      timeout: 15000
    });
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
    await expect(page.locator('main').getByRole('heading', { name: 'Live Stream', exact: true }).first()).toBeVisible();

    await expectShellLayout(page);
    await expectRouteScreenshot(page, 'search-results', isMobileProject);
  });

  test('custom 404 path renders recovery content', async ({ page, isMobileProject }) => {
    await page.goto('/smoke-test-missing-page');

    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
    await expect(
      page.getByText('Sorry, the page you are looking for was either not found or does not exist.')
    ).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Search...' }).first()).toBeVisible();

    await expectShellLayout(page);
    await expectRouteScreenshot(page, '404', isMobileProject);
  });

  for (const visualRoute of visualPageRoutes) {
    test(`${visualRoute.title} keeps a stable visual baseline`, async ({ page, isMobileProject }) => {
      await page.goto(visualRoute.route);

      await expectRouteLoaded(page, visualRoute.route);
      await expectRouteScreenshot(page, visualRoute.snapshot, isMobileProject, {
        maxDiffPixelRatio: visualRoute.maxDiffPixelRatio
      });
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
