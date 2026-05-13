'use client';

import type { ChurchDetails } from '../../../interface';
import type { ChurchDetailsDraft } from '../../content/writableStructuredContent';

function parsePreviewLinePairs(value: string) {
  return value
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf('|');

      if (separatorIndex === -1) {
        return null;
      }

      const left = line.slice(0, separatorIndex).trim();
      const right = line.slice(separatorIndex + 1).trim();

      return left && right ? { left, right } : null;
    })
    .filter((entry): entry is { left: string; right: string } => Boolean(entry));
}

export function buildChurchDetailsPreviewData(draft: ChurchDetailsDraft): ChurchDetails {
  const additional_emails = parsePreviewLinePairs(draft.additionalEmails).map((entry) => ({
    email: entry.right,
    name: entry.left
  }));
  const additional_phones = parsePreviewLinePairs(draft.additionalPhones).map((entry) => ({
    name: entry.left,
    phone: entry.right
  }));
  const contacts = parsePreviewLinePairs(draft.contacts).map((entry) => ({
    name: entry.left,
    title: entry.right
  }));

  return {
    additional_emails: additional_emails.length ? additional_emails : undefined,
    additional_phones: additional_phones.length ? additional_phones : undefined,
    address: draft.address,
    city: draft.city,
    contacts: contacts.length ? contacts : undefined,
    email: draft.email,
    facebook_page: draft.facebookPage,
    google_map_location: draft.googleMapLocation,
    mission_statement: draft.missionStatement,
    name: draft.name,
    online_giving_url: draft.onlineGivingUrl,
    phone: draft.phone,
    state: draft.state,
    vision_statement: draft.visionStatement,
    zipcode: draft.zipcode
  };
}
