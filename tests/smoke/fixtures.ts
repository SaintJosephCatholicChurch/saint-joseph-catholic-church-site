import { test as base, expect } from '@playwright/test';

const MOCK_READINGS_RSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss>
  <channel>
    <title>Daily Readings</title>
    <item>
      <title>Daily Readings for May 4, 2026</title>
      <link>https://bible.usccb.org/bible/readings/050426.cfm</link>
      <description><![CDATA[
        <h4>Reading 1 <a href="https://bible.usccb.org/bible/readings/050426.cfm">Acts 1:1-11</a></h4>
        <h4>Responsorial Psalm <a href="https://bible.usccb.org/bible/readings/050426.cfm">Psalm 47:2-3, 6-7, 8-9</a></h4>
        <h4>Reading 2 <a href="https://bible.usccb.org/bible/readings/050426.cfm">Ephesians 1:17-23</a></h4>
        <h4>Gospel <a href="https://bible.usccb.org/bible/readings/050426.cfm">Matthew 28:16-20</a></h4>
      ]]></description>
    </item>
    <item>
      <title>Daily Readings for May 5, 2026</title>
      <link>https://bible.usccb.org/bible/readings/050526.cfm</link>
      <description><![CDATA[
        <h4>Reading 1 <a href="https://bible.usccb.org/bible/readings/050526.cfm">Acts 1:12-14</a></h4>
        <h4>Responsorial Psalm <a href="https://bible.usccb.org/bible/readings/050526.cfm">Psalm 27:1, 4, 13-14</a></h4>
        <h4>Gospel <a href="https://bible.usccb.org/bible/readings/050526.cfm">John 14:1-6</a></h4>
      ]]></description>
    </item>
  </channel>
</rss>`;

const MOCK_GOOGLE_CALENDAR = {
  items: [
    {
      end: {
        dateTime: '2026-05-12T19:00:00-04:00'
      },
      htmlLink: 'https://example.com/events/smoke-test-parish-event',
      id: 'smoke-test-parish-event',
      start: {
        dateTime: '2026-05-12T18:00:00-04:00'
      },
      status: 'confirmed',
      summary: 'Smoke Test Parish Event'
    }
  ],
  kind: 'calendar#events'
};

export const test = base.extend<{ isMobileProject: boolean }>({
  isMobileProject: async ({}, use, testInfo) => {
    await use(testInfo.project.name.startsWith('mobile-'));
  },
  page: async ({ page }, use) => {
    await page.route('https://api.stjosephchurchbluffton.org/.netlify/functions/live', async (route) => {
      const isLiveStreamPage = page.url().includes('/live-stream');

      await route.fulfill({
        body: JSON.stringify({
          isStreaming: isLiveStreamPage,
          url: isLiveStreamPage ? 'about:blank' : ''
        }),
        contentType: 'application/json',
        status: 200
      });
    });

    await page.route('https://api.stjosephchurchbluffton.org/.netlify/functions/readings', async (route) => {
      await route.fulfill({
        body: MOCK_READINGS_RSS,
        contentType: 'application/xml; charset=utf-8',
        status: 200
      });
    });

    await page.route('https://api.stjosephchurchbluffton.org/.netlify/functions/readings-podcast', async (route) => {
      await route.fulfill({
        body: 'null',
        contentType: 'application/json',
        status: 200
      });
    });

    await page.route('https://www.googleapis.com/calendar/v3/calendars/**', async (route) => {
      await route.fulfill({
        body: JSON.stringify(MOCK_GOOGLE_CALENDAR),
        contentType: 'application/json',
        status: 200
      });
    });

    await page.route('https://www.facebook.com/**', async (route) => {
      await route.fulfill({
        body: '<!doctype html><html><body>Facebook embed mock</body></html>',
        contentType: 'text/html; charset=utf-8',
        status: 200
      });
    });

    await page.addInitScript(() => {
      const installStabilityStyles = () => {
        if (document.querySelector('style[data-playwright-stability]')) {
          return;
        }

        const style = document.createElement('style');
        style.dataset.playwrightStability = 'true';
        style.textContent = `
          *,
          *::before,
          *::after {
            animation-delay: 0s !important;
            animation-duration: 0s !important;
            caret-color: transparent !important;
            scroll-behavior: auto !important;
            transition-delay: 0s !important;
            transition-duration: 0s !important;
          }
        `;

        document.head?.appendChild(style);
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', installStabilityStyles, { once: true });
        return;
      }

      installStabilityStyles();
    });

    await use(page);
  }
});

export { expect };
