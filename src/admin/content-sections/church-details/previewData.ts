'use client';

import type { ChurchDetails } from '../../../interface';
import type { ChurchDetailsDraft } from '../../content/writableStructuredContent';

function toPreviewPairs(items: ChurchDetailsDraft['contacts']) {
  return items
    .map((entry) => ({
      name: entry.name.trim(),
      value: entry.value.trim()
    }))
    .filter((entry) => entry.name && entry.value);
}

export function buildChurchDetailsPreviewData(draft: ChurchDetailsDraft): ChurchDetails {
  const additional_emails = toPreviewPairs(draft.additionalEmails).map((entry) => ({
    email: entry.value,
    name: entry.name
  }));
  const additional_phones = toPreviewPairs(draft.additionalPhones).map((entry) => ({
    name: entry.name,
    phone: entry.value
  }));
  const contacts = toPreviewPairs(draft.contacts).map((entry) => ({
    name: entry.name,
    title: entry.value
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
