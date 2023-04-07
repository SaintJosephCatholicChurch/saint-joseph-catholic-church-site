import { useEffect, useState } from 'react';

interface UseLiveStreamUrlProps {
  livestream_provider: 'youtube' | 'facebook';
  facebookPage: string;
  youtubeChannel: string;
}

export default function useLiveStreamUrl({ livestream_provider, facebookPage, youtubeChannel }: UseLiveStreamUrlProps) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (livesteam_provider === 'facebook') {
      setUrl(
        `https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2F${facebookPage}%2Flive&show_text=false`
      );
      return;
    }
  }, []);

  return url;
}
