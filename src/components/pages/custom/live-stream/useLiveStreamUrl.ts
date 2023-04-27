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

export default function useLiveStreamUrl({ livestreamProvider, facebookPage, youtubeChannel }: UseLiveStreamUrlProps) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    let alive = true;

    const getVideo = async () => {
      const response = await fetch(
        `https://api.stjosephchurchbluffton.org/.netlify/functions/live/${livestreamProvider}/${
          livestreamProvider === 'facebook' ? facebookPage : youtubeChannel
        }`
      );
      const contents = (await response.json()) as YoutubeLiveResponse;

      if (alive) {
        setUrl(contents.url);
      }
    };

    getVideo();

    return () => {
      alive = false;
    };
  }, [facebookPage, livestreamProvider, youtubeChannel]);

  return url;
}
