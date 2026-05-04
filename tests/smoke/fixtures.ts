import { test as base, expect } from '@playwright/test';

import type { Request } from '@playwright/test';

const CHURCH_API_BASE_URL = 'https://api.stjosephchurchbluffton.org/.netlify/functions';
const CONTACT_ENDPOINT = `${CHURCH_API_BASE_URL}/contact`;
const FLOCKNOTES_ENDPOINT = `${CHURCH_API_BASE_URL}/flocknotes`;
const LIVE_ENDPOINT = `${CHURCH_API_BASE_URL}/live`;
const PARISH_REGISTRATION_ENDPOINT = `${CHURCH_API_BASE_URL}/parish-registration`;
const READINGS_ENDPOINT = `${CHURCH_API_BASE_URL}/readings`;
const READINGS_PODCAST_ENDPOINT = `${CHURCH_API_BASE_URL}/readings-podcast`;

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

const MOCK_FLOCKNOTES_RSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss>
  <channel>
    <title>St. Joseph Flocknote</title>
    <link>https://stjosephcatholicchurch95.flocknote.com/</link>
    <item>
      <title>Smoke Test Newsletter Note</title>
      <link>https://stjosephcatholicchurch95.flocknote.com/note/12345678</link>
      <description><![CDATA[Smoke-test Flocknote content for deterministic Playwright runs.]]></description>
      <pubDate>Mon, 04 May 2026 09:00:00 -0400</pubDate>
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

interface CapturedSubmission {
  body: unknown;
  method: string;
  url: string;
}

export interface SmokeApiMockState {
  interceptedRequests: {
    googleCalendar: number;
  };
  submissions: {
    contact: CapturedSubmission[];
    parishRegistration: CapturedSubmission[];
  };
  unexpectedChurchApiRequests: string[];
}

function createMockHtml(title: string, bodyText: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title></head><body>${bodyText}</body></html>`;
}

function parseRequestBody(request: Request) {
  const postData = request.postData();

  if (!postData) {
    return null;
  }

  try {
    return JSON.parse(postData) as unknown;
  } catch {
    return postData;
  }
}

function captureSubmission(submissions: CapturedSubmission[], request: Request) {
  submissions.push({
    body: parseRequestBody(request),
    method: request.method(),
    url: request.url()
  });
}

export const test = base.extend<{ isMobileProject: boolean; smokeApi: SmokeApiMockState }>({
  // eslint-disable-next-line no-empty-pattern
  isMobileProject: async ({}, applyFixture, testInfo) => {
    await applyFixture(testInfo.project.name.startsWith('mobile-'));
  },
  // eslint-disable-next-line no-empty-pattern
  smokeApi: async ({}, applyFixture) => {
    await applyFixture({
      interceptedRequests: {
        googleCalendar: 0
      },
      submissions: {
        contact: [],
        parishRegistration: []
      },
      unexpectedChurchApiRequests: []
    });
  },
  page: async ({ page, smokeApi }, applyFixture) => {
    await page.route(`${CHURCH_API_BASE_URL}/**`, async (route) => {
      const request = route.request();
      const requestUrl = request.url().split('?')[0];

      switch (requestUrl) {
        case CONTACT_ENDPOINT:
          captureSubmission(smokeApi.submissions.contact, request);
          await route.fulfill({
            body: '',
            contentType: 'text/plain; charset=utf-8',
            status: 204
          });
          return;
        case FLOCKNOTES_ENDPOINT:
          await route.fulfill({
            body: MOCK_FLOCKNOTES_RSS,
            contentType: 'application/xml; charset=utf-8',
            status: 200
          });
          return;
        case LIVE_ENDPOINT: {
          const isLiveStreamPage = page.url().includes('/live-stream');

          await route.fulfill({
            body: JSON.stringify({
              isStreaming: isLiveStreamPage,
              url: isLiveStreamPage ? 'about:blank' : ''
            }),
            contentType: 'application/json',
            status: 200
          });
          return;
        }
        case PARISH_REGISTRATION_ENDPOINT:
          captureSubmission(smokeApi.submissions.parishRegistration, request);
          await route.fulfill({
            body: JSON.stringify({
              message: 'Mock parish registration accepted.'
            }),
            contentType: 'application/json',
            status: 200
          });
          return;
        case READINGS_ENDPOINT:
          await route.fulfill({
            body: MOCK_READINGS_RSS,
            contentType: 'application/xml; charset=utf-8',
            status: 200
          });
          return;
        case READINGS_PODCAST_ENDPOINT:
          await route.fulfill({
            body: JSON.stringify({
              url: 'https://soundcloud.com/st-joseph-catholic-church/daily-readings-smoke-test'
            }),
            contentType: 'application/json',
            status: 200
          });
          return;
        default:
          smokeApi.unexpectedChurchApiRequests.push(`${request.method()} ${request.url()}`);
          await route.fulfill({
            body: JSON.stringify({
              message: 'Unexpected church API request reached the smoke-test fallback.'
            }),
            contentType: 'application/json',
            status: 503
          });
      }
    });

    await page.route('https://www.googleapis.com/calendar/v3/calendars/**', async (route) => {
      smokeApi.interceptedRequests.googleCalendar += 1;

      await route.fulfill({
        body: JSON.stringify(MOCK_GOOGLE_CALENDAR),
        contentType: 'application/json',
        status: 200
      });
    });

    await page.route('https://www.facebook.com/**', async (route) => {
      await route.fulfill({
        body: createMockHtml('Facebook Embed Mock', 'Facebook embed mock'),
        contentType: 'text/html; charset=utf-8',
        status: 200
      });
    });

    await page.route('https://w.soundcloud.com/**', async (route) => {
      const requestUrl = new URL(route.request().url());

      if (requestUrl.searchParams.get('mock-daily-readings') !== '1') {
        await route.fulfill({
          body: createMockHtml('SoundCloud Mock Blocked', 'Unexpected SoundCloud request'),
          contentType: 'text/html; charset=utf-8',
          status: 503
        });
        return;
      }

      await route.fulfill({
        body: createMockHtml('SoundCloud Mock Player', 'Daily Readings audio mock'),
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

    await applyFixture(page);

    expect(smokeApi.unexpectedChurchApiRequests).toEqual([]);
  }
});

export { expect };
