import { type Locator, type Page } from '@playwright/test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import MassOrientationBadge from '../../src/components/schedule/MassOrientationBadge';
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
  test('homepage featured content stays below the schedule during hydration', async ({ page }) => {
    const hydrationErrors: string[] = [];
    page.on('pageerror', (error) => {
      if (/hydration/i.test(error.message)) {
        hydrationErrors.push(error.message);
      }
    });

    let releaseScripts!: () => void;
    const scriptsReady = new Promise<void>((resolve) => {
      releaseScripts = resolve;
    });
    await page.route(/\/_next\/.*\.js(?:\?|$)/, async (route) => {
      await scriptsReady;
      await route.continue();
    });

    const featuredHeading = page.getByRole('heading', { name: 'Pastoral Associate for Youth and Parish Life' });
    let initialTop: number;
    try {
      await page.goto('/', { waitUntil: 'commit' });
      await expect(featuredHeading).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Weekly Schedule' })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      initialTop = await featuredHeading.evaluate((element) => element.getBoundingClientRect().top + scrollY);
    } finally {
      releaseScripts();
    }

    await page.waitForLoadState('load');
    await expect(page.getByRole('heading', { name: 'Upcoming Events' })).toBeVisible();
    const hydratedTop = await featuredHeading.evaluate((element) => element.getBoundingClientRect().top + scrollY);

    expect(Math.abs(hydratedTop - initialTop)).toBeLessThanOrEqual(2);
    expect(hydrationErrors).toEqual([]);
  });

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

  test('desktop schedule note-only rows use the full row width', async ({ page, isMobileProject }) => {
    test.skip(isMobileProject, 'Mobile uses a separate schedule layout.');
    await page.goto('/');

    const note = page.getByText(/^\*Masses are offered for members/).last();
    await expect(note).toBeVisible();
    await expect(note.locator('br')).toHaveCount(0);

    const widths = await note.evaluate((element) => ({
      note: element.getBoundingClientRect().width,
      row: element.parentElement.getBoundingClientRect().width
    }));
    expect(widths.note).toBeGreaterThan(0);
    expect(Math.abs(widths.note - widths.row)).toBeLessThanOrEqual(1);
  });

  test('schedule notes retain bottom spacing across responsive breakpoints', async ({ page }) => {
    await page.goto('/');
    const note = page
      .getByText('Note: Incense may be used at the 10 AM Mass', { exact: true })
      .filter({ visible: true });

    for (const width of [915, 899, 768, 600, 599, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(note).toBeVisible();
      const bottomSpacing = await note.evaluate((element) => {
        let row = element.parentElement;
        while (row && getComputedStyle(row).borderBottomWidth !== '1px') {
          row = row.parentElement;
        }
        if (!row) {
          throw new Error('Schedule note is missing its row divider');
        }
        return row.getBoundingClientRect().bottom - 1 - element.getBoundingClientRect().bottom;
      });
      expect(bottomSpacing, `Note spacing at ${width}px`).toBeGreaterThanOrEqual(5);
    }
  });

  test('Mass orientation None renders no badge', () => {
    expect(renderToStaticMarkup(createElement(MassOrientationBadge, { orientation: '' }))).toBe('');
  });

  test('Mass orientation badges replace abbreviation notes without changing other schedule details', async ({
    page,
    isMobileProject
  }) => {
    await page.goto('/');

    const badges = page.getByRole('button', { name: /^Mass orientation:/ });
    await expect(badges).toHaveCount(11);
    await expect(page.getByRole('button', { name: 'Mass orientation: versus populum', exact: true })).toHaveCount(9);
    const adOrientem = page.getByRole('button', { name: 'Mass orientation: ad orientem', exact: true });
    await expect(adOrientem).toHaveCount(2);
    await expect(adOrientem.nth(0).locator('..')).toContainText('10:00 AM');
    await expect(adOrientem.nth(1).locator('..')).toContainText('8:30 AM');
    for (const note of [
      '2nd and 4th Thursdays',
      '3rd Thursdays',
      'Every Sunday',
      'Rosary at 9:40 AM',
      'No Public Mass'
    ]) {
      await expect(page.getByText(note, { exact: true }).filter({ visible: true })).toBeVisible();
    }
    await expect(page.getByText(/\([av]\.[op]\.\)|[av]\.[dpo]\. - Mass offered:/)).toHaveCount(0);

    if (isMobileProject) {
      await page.setViewportSize({ width: 320, height: 851 });
    }

    const bounds = await badges.evaluateAll((elements) =>
      elements.map((element) => {
        const time = element.previousElementSibling;
        if (!time) {
          throw new Error('Mass badge is missing its adjacent time');
        }
        const { left, right, top, height } = element.getBoundingClientRect();
        const timeBounds = time.getBoundingClientRect();
        return { left, right, centerOffset: top + height / 2 - (timeBounds.top + timeBounds.height / 2) };
      })
    );
    for (const { left, right, centerOffset } of bounds) {
      expect(Math.abs(centerOffset)).toBeLessThanOrEqual(1);
      if (isMobileProject) {
        expect(left).toBeGreaterThanOrEqual(0);
        expect(right).toBeLessThanOrEqual(320);
      }
    }

    for (const category of ['Confession Times', 'Adoration Times', 'Parish Office Hours']) {
      if (isMobileProject) {
        const categoryButton = page.getByRole('button', { name: category, exact: true });
        await categoryButton.click();
        await expect(categoryButton.locator('..').getByRole('button', { name: /^Mass orientation:/ })).toHaveCount(0);
      } else {
        await page.getByRole('tab', { name: category, exact: true }).click();
        await expect(
          page.getByRole('tabpanel', { name: category }).getByRole('button', { name: /^Mass orientation:/ })
        ).toHaveCount(0);
      }
    }
  });

  test('Mass orientation tooltips support keyboard, hover, and single click or tap', async ({
    page,
    isMobileProject
  }) => {
    await page.goto('/');
    const badge = page.getByRole('button', { name: 'Mass orientation: ad orientem', exact: true }).first();
    const tooltip = page.getByRole('tooltip');

    if (!isMobileProject) {
      await badge.hover();
      await expect(tooltip).toHaveText('Mass offered: ad orientem');
      await page.getByRole('heading', { name: 'Weekly Schedule' }).hover();
      await expect(tooltip).not.toBeVisible();
    }

    await badge.focus();
    await expect(tooltip).toHaveText('Mass offered: ad orientem');
    await badge.press('Escape');
    await expect(tooltip).not.toBeVisible();

    if (isMobileProject) {
      await badge.tap();
    } else {
      await badge.click();
    }
    await expect(tooltip).toHaveText('Mass offered: ad orientem');
    await page.getByRole('heading', { name: 'Weekly Schedule' }).click();
    await expect(tooltip).not.toBeVisible();

    const versusPopulum = page.getByRole('button', { name: 'Mass orientation: versus populum', exact: true }).first();
    await versusPopulum.click();
    await expect(tooltip).toHaveText('Mass offered: versus populum');
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

  test('search returns and opens the live stream page', async ({ page, isMobileProject, browserName }) => {
    await page.goto('/');

    const searchInput = page.getByPlaceholder('Search...').first();
    const searchButton = page.getByRole('button', { name: 'Search' }).first();
    await expect(searchInput).toBeVisible();
    await expect(searchButton).toBeVisible();
    await searchInput.fill('live stream');

    if (browserName === 'webkit') {
      await page.goto('/search?q=live%20stream');
    } else {
      await searchButton.click();
    }

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
