import MuiPagination from '@mui/material/Pagination';
import styled from '../util/styled.util';

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
  link: {
    href: (page: number) => string;
    as: (page: number) => string;
  };
}

const Pagination = ({ current, pages, link }: PaginationProps) => {
  return (
    <StyledPagination>
      <MuiPagination count={pages} defaultPage={current} showFirstButton showLastButton />
    </StyledPagination>
  );
};

export default Pagination;
