'use client';
import { parse } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

import homepageData from '../../../lib/homepage';
import { getFeed } from '../../../lib/rss';
import { isNotEmpty } from '../../../util/string.util';
import useConvertedPosts from './useConvertedPosts';

import type { FlockNoteFeed, NewsPostData, PostContent } from '../../../interface';

export default function usePosts(rawPosts: PostContent[]): { loaded: boolean; data: NewsPostData[] } {
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

      const { item: entries = [], link = '' } = feed?.rss?.channel ?? {};

      let domain: string | null = null;
      const domainMatches = /https:\/\/[a-zA-Z0-9]+\.flocknote\.com\//.exec(link);
      if (domainMatches.length > 0) {
        domain = domainMatches[0];
      }

      if (entries.length > 0) {
        setFlockNotes(
          entries
            .filter((note) => isNotEmpty(note.description))
            .map((note) => ({
              title: note.title,
              summary: note.description,
              link: domain != null ? note.link.replace(/https:\/\/[a-zA-Z0-9]+\.flocknote\.com\//, domain) : note.link,
              // image: '/flocknote.png',
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

      return unsortedNews;
    }, [flockNotes, posts])
  };
}
