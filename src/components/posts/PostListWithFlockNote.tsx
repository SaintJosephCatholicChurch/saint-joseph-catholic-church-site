'use client';
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useMediaQueryDown } from '../../util/useMediaQuery';
import PostSkeleton from './PostSkeleton';
import PostSummary from './PostSummary';
import usePosts from './hooks/usePosts';

import type { ChangeEvent } from 'react';
import type { PostContent } from '../../interface';

const StyledPostList = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
`;

const StyledPagination = styled('div')`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
`;

interface PostListProps {
  allPosts: PostContent[];
  postsPerPage: number;
}

const PostListWithFlockNote = ({ allPosts, postsPerPage }: PostListProps) => {
  const { loaded, data: posts } = usePosts(allPosts);

  const searchParams = useSearchParams();

  const [page, setPage] = useState(1);
  const isSmallScreen = useMediaQueryDown('sm');

  useEffect(() => {
    const searchPage = searchParams.get('page');
    if (searchPage != null) {
      const searchPageInt = parseInt(searchPage);
      if (!isNaN(searchPageInt) && searchPageInt !== page) {
        setPage(searchPageInt);
      }
    }
  }, [page, searchParams]);

  const onChange = useCallback((_event: ChangeEvent, newPage: number) => {
    setPage(newPage);
  }, []);

  const pagePosts = useMemo(
    () => posts.slice((page - 1) * postsPerPage, page * postsPerPage),
    [page, postsPerPage, posts]
  );
  const pages = Math.ceil(posts.length / postsPerPage);

  if (!loaded) {
    return (
      <StyledPostList>
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </StyledPostList>
    );
  }

  return (
    <StyledPostList>
      {pagePosts.map((post) => (
        <PostSummary key={`post-${post.link}`} post={post} />
      ))}
      <StyledPagination>
        <Pagination
          count={pages}
          page={page}
          siblingCount={1}
          onChange={onChange}
          size={isSmallScreen ? 'small' : 'medium'}
        />
      </StyledPagination>
    </StyledPostList>
  );
};

export default PostListWithFlockNote;
