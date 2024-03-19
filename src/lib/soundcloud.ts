import format from 'date-fns/format';

import { isNullish } from '../util/null.util';

export const DAILY_READINGS_RSS = 'https://api.stjosephchurchbluffton.org/.netlify/functions/readings';

interface SoundCloudResponse {
  version: number;
  type: string;
  provider_name: string;
  provider_url: string;
  height: number | string;
  width: number | string;
  title: string;
  description: '';
  thumbnail_url: string;
  html: string;
  author_name: string;
  author_url: string;
}

export async function getDailyReadingIFrameUrl(): Promise<string | null> {
  try {
    const response = await fetch(
      `https://soundcloud.com/oembed?format=json&url=https%3A%2F%2Fsoundcloud.com%2Fusccb-readings%2Fdaily-mass-reading-podcast-for-${format(
        new Date(),
        'MMMM-dd-yyyy'
      )}&iframe=true`
    );
    const contents = (await response.json()) as SoundCloudResponse | null | undefined;
    if (isNullish(contents)) {
      return null;
    }

    const matches = /(?<=src=").*?(?=[*"])/i.exec(contents.html);
    if (matches.length < 1) {
      return null;
    }

    return (
      `${matches[0]}&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=true&visual=true` ??
      null
    );
  } catch (e) {
    console.error('[soundCloud] error', e);
    return null;
  }
}
