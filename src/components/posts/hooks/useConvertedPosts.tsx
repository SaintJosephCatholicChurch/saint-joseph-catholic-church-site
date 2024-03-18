import parse from 'date-fns/parse';
import { useMemo } from 'react';

import type { NewsPostData, PostContent } from '../../../interface';

export default function useConvertedPosts(rawPosts: PostContent[]): NewsPostData[] {
  return useMemo(
    () =>
      rawPosts.map((post) => ({
        title: post.data.title,
        summary: post.summary,
        link: `/news/${post.data.slug}`,
        image: post.data.image,
        date: parse(post.data.date, 'yyyy-MM-dd', new Date())
      })),
    [rawPosts]
  );
}
