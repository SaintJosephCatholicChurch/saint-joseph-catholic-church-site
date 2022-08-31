import Box from '@mui/material/Box';
import { GetStaticProps } from 'next';
import contentStyles from '../../public/styles/content.module.css';
import PageLayout from '../components/PageLayout';
import { FileMatter } from '../interface';
import { fetchPageMatter } from '../lib/pages';
import { fetchPostMatter } from '../lib/posts';

interface SearchProps {
  searchMatter: FileMatter[];
}

const Search = ({ searchMatter }: SearchProps) => {
  return (
    <PageLayout url="/search" title="Search">
      <Box sx={{ display: 'flex', flexDirection: 'column' }} className={contentStyles.content}>
        <h3>Search</h3>
        Results!
      </Box>
    </PageLayout>
  );
};

export default Search;

export const getStaticProps: GetStaticProps = async () => {
  const searchMatter = [...fetchPageMatter(), ...fetchPostMatter()];

  return {
    props: {
      searchMatter
    }
  };
};
