import { XMLParser } from 'fast-xml-parser';

import { isEmpty } from '../util/string.util';

export const DAILY_READINGS_RSS = 'https://api.stjosephchurchbluffton.org/.netlify/functions/readings';

export async function getFeed<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url);
    const contents = await response.text();
    if (isEmpty(contents)) {
      return null;
    }

    return new XMLParser().parse(contents) as T;
  } catch {
    return null;
  }
}
