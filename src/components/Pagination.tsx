import Link from 'next/link';
import MuiPagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';

type Props = {
  current: number;
  pages: number;
  link: {
    href: (page: number) => string;
    as: (page: number) => string;
  };
};
export default function Pagination({ current, pages, link }: Props) {
  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 5 }}>
      <MuiPagination count={pages} defaultPage={current} showFirstButton showLastButton />
    </Box>
  );
}
