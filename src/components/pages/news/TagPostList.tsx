'use client';
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useMediaQueryDown } from '../../../util/useMediaQuery';
import { StyledLink } from '../../common/StyledLink';
import PostSummary from '../../posts/PostSummary';
import useConvertedPosts from '../../posts/hooks/useConvertedPosts';
import PageTitle from '../PageTitle';

import type { ChangeEvent } from 'react';
import type { PostContent } from '../../../interface';

const StyledTitle = styled('div')`
  display: flex;
`;

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

interface TagPostListProps {
  tag: string;
  posts: PostContent[];
  postsPerPage: number;
}

const TagPostList = ({ tag, posts: rawPosts, postsPerPage }: TagPostListProps) => {
  const posts = useConvertedPosts(rawPosts);

  const searchParams = useSearchParams();

  const [page, setPage] = useState(1);
  const isSmallScreen = useMediaQueryDown('sm');

  useEffect(() => {
    if (!searchParams) {
      return;
    }
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

  return (
    <>
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
    </>
  );
};

export default TagPostList;
