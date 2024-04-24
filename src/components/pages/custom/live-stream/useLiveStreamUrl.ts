import { useEffect, useState } from 'react';

interface LiveResponse {
  isStreaming: boolean;
  url: string;
}

export default function useLiveStreamUrl(): [boolean, string] {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const getVideo = async () => {
      try {
        const response = await fetch('https://api.stjosephchurchbluffton.org/.netlify/functions/live');
        const contents = (await response.json()) as LiveResponse;

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
  }, []);

  return [loading, url];
}
