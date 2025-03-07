import { isNullish } from '../util/null.util';

export const DAILY_READINGS_PODCAST = 'https://api.stjosephchurchbluffton.org/.netlify/functions/readings-podcast';

interface DailyReadingsPodcastResponse {
  url: string;
}

export async function getDailyReadingIFrameUrl(): Promise<string | null> {
  try {
    const response = await fetch(`DAILY_READINGS_PODCAST`);
    const contents = (await response.json()) as DailyReadingsPodcastResponse | null | undefined;
    if (isNullish(contents)) {
      return null;
    }

    return contents.url;
  } catch (e) {
    console.error('[soundCloud] error', e);
    return null;
  }
}
