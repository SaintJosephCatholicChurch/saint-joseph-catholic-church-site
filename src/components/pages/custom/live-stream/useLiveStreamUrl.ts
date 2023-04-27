import { useEffect, useState } from 'react';

interface UseLiveStreamUrlProps {
  livestreamProvider: 'youtube' | 'facebook';
  facebookPage: string;
  youtubeChannel: string;
}

interface YoutubeLiveResponse {
  isStreaming: boolean;
  url: string;
}

export default function useLiveStreamUrl({
  livestreamProvider,
  facebookPage,
  youtubeChannel
}: UseLiveStreamUrlProps): [boolean, string] {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const getVideo = async () => {
      try {
        const response = await fetch(
          `https://api.stjosephchurchbluffton.org/.netlify/functions/live/${livestreamProvider}/${
            livestreamProvider === 'facebook' ? facebookPage : youtubeChannel
          }`
        );
        const contents = (await response.json()) as YoutubeLiveResponse;

        if (alive) {
          setUrl(contents.url);
        }
      } catch (e) {
        console.warn('Loading livestream failed', e);
      }

      if (alive) {
        setLoading(false);
      }
    };

    getVideo();

    return () => {
      alive = false;
    };
  }, [facebookPage, livestreamProvider, youtubeChannel]);

  return [loading, url];
}
