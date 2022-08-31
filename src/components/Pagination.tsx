import Box from '@mui/material/Box';
import MuiPagination from '@mui/material/Pagination';

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
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 5 }}>
      <MuiPagination count={pages} defaultPage={current} showFirstButton showLastButton />
    </Box>
  );
};

export default Pagination;
