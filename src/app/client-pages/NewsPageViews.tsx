'use client';

import { parseISO } from 'date-fns';
import Link from 'next/link';
import { styled } from '@mui/material/styles';

import AppPageShell from '../AppPageShell';
import { StyledLink } from '../../components/common/StyledLink';
import PageTitle from '../../components/pages/PageTitle';
import PostListWithFlockNote from '../../components/posts/PostListWithFlockNote';
import PostView from '../../components/posts/PostView';
import TagPostList from '../../components/TagPostList';
import homepageData from '../../lib/homepage';
import sanitizeHtmlImages from '../../util/sanitizeHtmlImages';

import type { NewsListingProps, NewsPostProps, NewsTagProps } from '../routeData';

const StyledTitle = styled('div')`
  display: flex;
`;

export const NewsIndexPageView = ({ allPosts, pagination }: NewsListingProps) => {
  return (
    <AppPageShell title="News" dailyReadings={homepageData.daily_readings} hideHeader>
      <PostListWithFlockNote allPosts={allPosts} pagination={pagination} />
    </AppPageShell>
  );
};

export const NewsPaginationPageView = ({ allPosts, pagination }: NewsListingProps) => {
  return (
    <AppPageShell title="News" dailyReadings={homepageData.daily_readings}>
      <PostListWithFlockNote allPosts={allPosts} pagination={pagination} />
    </AppPageShell>
  );
};

export const NewsPostPageView = ({ title, image, dateString, tags, content, ...sidebarProps }: NewsPostProps) => {
  const date = parseISO(dateString);

  return (
    <AppPageShell
      title={title}
      recentPosts={sidebarProps.recentPosts}
      dailyReadings={sidebarProps.dailyReadings}
      hideHeader
    >
      <PostView title={title} date={date} image={image} tags={tags}>
        <div
          dangerouslySetInnerHTML={{
            __html: sanitizeHtmlImages(content)
          }}
        />
      </PostView>
    </AppPageShell>
  );
};

export const NewsTagPageView = ({ posts, tag, pagination }: NewsTagProps) => {
  const title = `#${tag}`;

  return (
    <AppPageShell title={title} hideHeader>
      <PageTitle
        title={
          <StyledTitle>
            <Link href="/news">
              <StyledLink>News</StyledLink>
            </Link>
            &nbsp;/&nbsp;#{tag}
          </StyledTitle>
        }
      />
      <TagPostList posts={posts} tag={tag} pagination={pagination} />
    </AppPageShell>
  );
};
