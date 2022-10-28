import MuiPagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { useMediaQueryDown } from '../util/useMediaQuery';

import type { ChangeEvent } from 'react';

const StyledPagination = styled('div')`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
`;

interface PaginationProps {
  current: number;
  pages: number;
  firstPageLink: string;
  pageLink: string;
}

const Pagination = ({ current, pages, firstPageLink, pageLink }: PaginationProps) => {
  const router = useRouter();
  const isSmallScreen = useMediaQueryDown('sm');

  const onChange = useCallback(
    (_event: ChangeEvent, newPage: number) => {
      if (newPage === 1) {
        router.push(firstPageLink);
        return;
      }

      router.push(pageLink.replace('[page]', `${newPage}`));
    },
    [firstPageLink, pageLink, router]
  );

  return (
    <StyledPagination>
      <MuiPagination
        count={pages}
        defaultPage={current}
        siblingCount={1}
        onChange={onChange}
        size={isSmallScreen ? 'small' : 'medium'}
      />
    </StyledPagination>
  );
};

export default Pagination;
