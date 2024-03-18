import { useEffect, useMemo, useState } from 'react';
import parse from 'date-fns/parse';

import homepageData from '../../../lib/homepage';
import { getFeed } from '../../../lib/rss';
import { isNotEmpty } from '../../../util/string.util';
import useConvertedPosts from './useConvertedPosts';

import type { FlockNoteFeed, NewsPostData, PostContent } from '../../../interface';

export default function usePosts(
  start: number,
  limit: number,
  rawPosts: PostContent[]
): { loaded: boolean; data: NewsPostData[] } {
  const [flockNotes, setFlockNotes] = useState<NewsPostData[]>([]);
  const [flockNotesLoaded, setFlockNotesLoaded] = useState(false);

  const posts = useConvertedPosts(rawPosts);

  useEffect(() => {
    if (!homepageData.newsletter.rssFeedUrl) {
      return;
    }

    let alive = true;

    const getReadings = async () => {
      const feed = await getFeed<FlockNoteFeed>(homepageData.newsletter.rssFeedUrl);
      if (!alive) {
        return;
      }

      if (feed === null) {
        return;
      }

      const { item: entries = [] } = feed?.rss?.channel ?? {};
      if (entries.length > 0) {
        setFlockNotes(
          entries
            .filter((note) => isNotEmpty(note.description))
            .map((note) => ({
              title: note.title,
              summary: note.description,
              link: note.link,
              image: '/flocknote.png',
              date: parse(note.pubDate, 'EEE, dd MMM yyyy HH:mm:ss xx', new Date()),
              target: '_blank'
            }))
        );
      }
      setFlockNotesLoaded(true);
    };

    getReadings();

    return () => {
      alive = false;
    };
  }, []);

  return {
    loaded: flockNotesLoaded,
    data: useMemo(() => {
      const unsortedNews: NewsPostData[] = [...flockNotes, ...posts];

      unsortedNews.sort((a, b) => b.date.getTime() - a.date.getTime());

      return unsortedNews.slice(start, start + limit);
    }, [flockNotes, limit, posts, start])
  };
}
