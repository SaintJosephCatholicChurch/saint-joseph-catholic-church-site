'use client';
import { useEffect, useState } from 'react';

interface LiveResponse {
  isStreaming: boolean;
  url: string;
}

interface LiveState {
  loading: boolean;
  url: string;
  isStreaming: boolean;
}

export default function useLiveStreamUrl(): { loading: boolean; url: string; isStreaming: boolean } {
  const [state, setState] = useState<LiveState>({ loading: true, url: '', isStreaming: false });

  useEffect(() => {
    let alive = true;

    const getVideo = async () => {
      try {
        const response = await fetch('https://api.stjosephchurchbluffton.org/.netlify/functions/live');
        const contents = (await response.json()) as LiveResponse;

        if (alive) {
          setState({ loading: false, url: contents.url ?? '', isStreaming: contents.isStreaming ?? false });
          return;
        }
      } catch (e) {
        console.warn('Loading livestream failed', e);
      }

      if (alive) {
        setState({ loading: false, url: '', isStreaming: false });
      }
    };

    getVideo();

    return () => {
      alive = false;
    };
  }, []);

  return state;
}
