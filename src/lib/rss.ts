import { XMLParser } from 'fast-xml-parser';

import { isEmpty } from '../util/string.util';

const CORS_FREE_API = 'https://api.allorigins.win/get?url=';

export const DAILY_READINGS_RSS = 'https://bible.usccb.org/readings.rss';

export async function getFeed<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(`${CORS_FREE_API}${encodeURIComponent(url)}`);
    const { contents } = await response.json() as { contents?: string };
    if (isEmpty(contents)) {
      return null;
    }

    return new XMLParser().parse(contents) as T;
  } catch {
    return null;
  }
}
