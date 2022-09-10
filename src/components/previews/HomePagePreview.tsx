import { PreviewTemplateComponentProps } from 'netlify-cms-core';
import { useMemo } from 'react';
import type { HomePageData, PostContent } from '../../interface';
import times from '../../lib/times';
import HomepageView from '../homepage/HomepageView';

const PagePreview = ({ entry }: PreviewTemplateComponentProps) => {
  const data = useMemo(() => entry.toJS().data as HomePageData, [entry]);

  const mockRecentPosts: PostContent[] = useMemo(
    () => [
      {
        fullPath: '/path/to/file-1.mdx',
        summary:
          '<p>A summary of a recent news article publish on the site. This news is very important for everyone to read.</p>',
        content: '', // Is not used for recent posts widget
        data: {
          date: '2022-09-09',
          title: 'Important News',
          image: '/mocks/news_header.png',
          slug: 'file-1'
        }
      },
      {
        fullPath: '/path/to/file-2.mdx',
        summary:
          '<p>A summary of a recent news article publish on the site. This news is very important for everyone to read.</p>',
        content: '', // Is not used for recent posts widget
        data: {
          date: '2022-09-01',
          title: 'Important News',
          image: '/mocks/news_header.png',
          slug: 'file-2'
        }
      },
      {
        fullPath: '/path/to/file-3.mdx',
        summary:
          '<p>A summary of a recent news article publish on the site. This news is very important for everyone to read.</p>',
        content: '', // Is not used for recent posts widget
        data: {
          date: '2022-08-15',
          title: 'Important News',
          image: '/mocks/news_header.png',
          slug: 'file-3'
        }
      },
      {
        fullPath: '/path/to/file-4.mdx',
        summary:
          '<p>A summary of a recent news article publish on the site. This news is very important for everyone to read.</p>',
        content: '', // Is not used for recent posts widget
        data: {
          date: '2022-07-31',
          title: 'Important News',
          image: '/mocks/news_header.png',
          slug: 'file-4'
        }
      }
    ],
    []
  );

  return useMemo(
    () => <HomepageView homePageData={data} times={times} recentPosts={mockRecentPosts} />,
    [data, mockRecentPosts]
  );
};
export default PagePreview;
