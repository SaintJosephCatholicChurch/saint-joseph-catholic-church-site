import type { GetStaticProps } from 'next/types';
import contentStyles from '../../public/styles/content.module.css';
import PageLayout from '../components/PageLayout';
import type { FileMatter } from '../interface';
import { fetchPageMatter } from '../lib/pages';
import { fetchPostMatter } from '../lib/posts';
import styled from '../util/styled.util';

const StyledSearch = styled('div')`
  display: flex;
  flex-direction: column;
`;

interface SearchProps {
  searchMatter: FileMatter[];
}

const Search = ({ searchMatter }: SearchProps) => {
  return (
    <PageLayout url="/search" title="Search">
      <StyledSearch className={contentStyles.content}>
        <h3>Search</h3>
        Results!
      </StyledSearch>
    </PageLayout>
  );
};

export default Search;

export const getStaticProps: GetStaticProps = async (): Promise<{ props: SearchProps }> => {
  const searchMatter = [...fetchPageMatter(), ...fetchPostMatter()];

  return {
    props: {
      searchMatter
    }
  };
};
