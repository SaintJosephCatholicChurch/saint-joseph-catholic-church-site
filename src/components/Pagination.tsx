import MuiPagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';
import { ChangeEvent, useCallback } from 'react';
import useNavigate from '../util/useNavigate';

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
  const navigate = useNavigate();

  const onChange = useCallback(
    (_event: ChangeEvent, newPage: number) => {
      if (newPage === 1) {
        navigate(firstPageLink);
        return;
      }

      navigate(pageLink.replace('[page]', `${newPage}`));
    },
    [firstPageLink, navigate, pageLink]
  );

  return (
    <StyledPagination>
      <MuiPagination count={pages} defaultPage={current} showFirstButton showLastButton onChange={onChange} />
    </StyledPagination>
  );
};

export default Pagination;
