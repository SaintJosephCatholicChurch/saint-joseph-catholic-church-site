import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { memo } from 'react';

import { StyledLink } from '../../common/StyledLink';
import RecentNewsPost from './RecentNewsPost';

import type { PostContent } from '../../../interface';

const StyledRecentNews = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    gap: 8px;

    ${theme.breakpoints.down('lg')} {
      gap: 12px;
    }
  `
);

const StyledRecentNewsTitle = styled('h3')`
  margin: 0;
  margin-bottom: 8px;
  text-transform: uppercase;
  color: #333;
  font-size: 24px;
  font-weight: 500;
`;

const StyledPosts = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StyledViewCalendarLink = styled(StyledLink)(
  ({ theme }) => `
    font-weight: 500;
    font-size: 16px;
    font-family: 'Oswald', Helvetica, Arial, sans-serif;

    margin-top: 8px;
    ${theme.breakpoints.down('sm')} {
      margin-top: 12px;
      font-size: 16px;
    }
  `
);

interface RecentNewsProps {
  posts: PostContent[];
  size?: 'small' | 'large';
}

const RecentNews = memo(({ posts, size }: RecentNewsProps) => {
  return (
    <StyledRecentNews>
      <StyledRecentNewsTitle>Recent News</StyledRecentNewsTitle>
      <StyledPosts>
        {posts?.map((post, index) => (
          <RecentNewsPost key={`recent-news-${index}`} post={post} size={size} />
        ))}
      </StyledPosts>
      <Link href="/news">
        <StyledViewCalendarLink>View More News</StyledViewCalendarLink>
      </Link>
    </StyledRecentNews>
  );
});

RecentNews.displayName = 'RecentNews';

export default RecentNews;
