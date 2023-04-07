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
    if (livestreamProvider === 'facebook') {
      setUrl(
        `https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2F${facebookPage}%2Flive&show_text=false`
      );
      return;
    }

    let alive = true;

    const getYoutubeVideo = async () => {
      const response = await fetch(`https://api.stjosephchurchbluffton.org/.netlify/functions/live/${youtubeChannel}`);
      const contents = (await response.json()) as YoutubeLiveResponse;

      if (alive) {
        setUrl(contents.url);
      }
    };

    getYoutubeVideo();

    return () => {
      alive = false;
    };
  }, [facebookPage, livestreamProvider, youtubeChannel]);

  return url;
}
