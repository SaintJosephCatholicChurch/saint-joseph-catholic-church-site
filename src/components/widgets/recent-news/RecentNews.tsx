import { memo } from 'react';
import { PostContent } from '../../../interface';
import styled from '../../../util/styled.util';
import RecentNewsPost from './RecentNewsPost';

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
    </StyledRecentNews>
  );
});

RecentNews.displayName = 'RecentNews';

export default RecentNews;
