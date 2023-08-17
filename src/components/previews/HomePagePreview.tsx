import { styled } from '@mui/material/styles';
import { useMemo } from 'react';

import times from '../../lib/times';
import HomepageView from '../homepage/HomepageView';

import type { TemplatePreviewComponent } from '@staticcms/core';
import type { HomePageData, PostContent } from '../../interface';

const StyledHomepagePreview = styled('div')`
  container: page / inline-size;
  font-family:
    Open Sans,
    Roboto,
    -apple-system,
    BlinkMacSystemFont,
    Segoe UI,
    Oxygen-Sans,
    Ubuntu,
    Cantarell,
    Helvetica Neue,
    sans-serif;
  background-color: #f5f4f3;
  color: #222;
  font-weight: 200;
  font-size: 16px;
  margin-top: -64px;
`;

const PagePreview: TemplatePreviewComponent<HomePageData> = ({ entry }) => {
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
    () => (
      <StyledHomepagePreview>
        <HomepageView homePageData={entry.data} times={times} recentPosts={mockRecentPosts} hideSearch />
      </StyledHomepagePreview>
    ),
    [entry.data, mockRecentPosts]
  );
};
export default PagePreview;
