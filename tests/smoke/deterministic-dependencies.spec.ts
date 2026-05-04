import { CONTACT_URL, PARISH_REGISTRATION_URL } from '../../src/constants';
import { expect, test } from './fixtures';

import type { ParishRegistrationFormData } from '../../src/components/pages/custom/parish-membership/parishRegistration.types';

const parishRegistrationSubmission: ParishRegistrationFormData = {
  additional: {
    priestVisitDetails: '',
    priestVisitRequested: 'no'
  },
  adults: [],
  children: [],
  family: {
    address: '201 Main Street',
    addressLine2: '',
    city: 'Bluffton',
    emergencyPhone: '',
    envelopeNumber: '',
    familyEmail: 'family@example.com',
    firstNames: 'Alex and Jamie',
    homePhone: '(843) 555-0199',
    lastName: 'Example',
    mailingName: 'The Example Family',
    registrationDate: '2026-05-04',
    state: 'SC',
    zip: '29910'
  },
  marriage: {
    maritalStatus: '',
    validCatholicMarriage: ''
  }
};

test.describe('deterministic external dependency handling', () => {
  test('homepage widgets and live pages render with mocked external data', async ({ page, smokeApi }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: "Today's Readings" })).toBeVisible();
    await expect(page.locator('main')).toContainText('Acts 1:1-11');
    await expect(page.locator('iframe[name="soundcloud-readings"]')).toBeVisible();

    await page.goto('/events');
    await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible();
    await expect(page.locator('main')).toContainText('May 2026');
    expect(smokeApi.interceptedRequests.googleCalendar).toBeGreaterThan(0);

    await page.goto('/live-stream');
    await expect(page.getByRole('heading', { name: 'Live Stream' })).toBeVisible();
    await expect(page.locator('main iframe').first()).toBeVisible();
  });

  test('contact form submits to the mocked contact endpoint', async ({ page, smokeApi }) => {
    await page.goto('/contact');

    await page.getByLabel('Full Name').fill('Smoke Test Contact');
    await page.getByLabel('Email').fill('smoke-contact@example.com');
    await page.getByLabel('Comments / Questions').fill('Smoke-test contact submission.');
    await page.getByRole('button', { name: 'Send Message' }).click();

    await expect(page.getByText('Message successfully submitted!')).toBeVisible();
    await expect(smokeApi.submissions.contact).toHaveLength(1);
    expect(smokeApi.submissions.contact[0]).toEqual(
      expect.objectContaining({
        body: {
          comment: 'Smoke-test contact submission.',
          email: 'smoke-contact@example.com',
          name: 'Smoke Test Contact',
          subject: 'Comment / Question'
        },
        method: 'POST',
        url: CONTACT_URL
      })
    );
  });

  test('ask form submits to the mocked contact endpoint', async ({ page, smokeApi }) => {
    await page.goto('/ask');

    await page.getByLabel('Full Name').fill('Smoke Test Ask');
    await page.getByLabel('Email').fill('smoke-ask@example.com');
    await page.getByLabel('Questions').fill('Smoke-test ask submission.');
    await page.getByRole('button', { name: 'Send Message' }).click();

    await expect(page.getByText('Question successfully submitted!')).toBeVisible();
    await expect(smokeApi.submissions.contact).toHaveLength(1);
    expect(smokeApi.submissions.contact[0]).toEqual(
      expect.objectContaining({
        body: {
          comment: 'Smoke-test ask submission.',
          email: 'smoke-ask@example.com',
          name: 'Smoke Test Ask',
          subject: 'Did You Know? Question Submission'
        },
        method: 'POST',
        url: CONTACT_URL
      })
    );
  });

  test('parish registration endpoint is trapped by the smoke-test mock', async ({ page, smokeApi }) => {
    await page.goto('/test-parish-registration');
    await expect(page.getByRole('heading', { name: 'Parish Membership' })).toBeVisible();

    const responseBody = await page.evaluate(
      async ({ requestBody, url }) => {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        return {
          message: ((await response.json()) as { message?: string }).message ?? '',
          ok: response.ok
        };
      },
      {
        requestBody: parishRegistrationSubmission,
        url: PARISH_REGISTRATION_URL
      }
    );

    expect(responseBody).toEqual({
      message: 'Mock parish registration accepted.',
      ok: true
    });
    await expect(smokeApi.submissions.parishRegistration).toHaveLength(1);
    expect(smokeApi.submissions.parishRegistration[0]).toEqual(
      expect.objectContaining({
        body: parishRegistrationSubmission,
        method: 'POST',
        url: PARISH_REGISTRATION_URL
      })
    );
  });
});
