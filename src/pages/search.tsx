import Button from '@mui/material/Button';
import type { GetStaticProps } from 'next/types';
import { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import type { SearchableEntry } from '../interface';
import { fetchPageContent } from '../lib/pages';
import { fetchPostContent } from '../lib/posts';
import { useSearchScores } from '../util/search.util';
import styled from '../util/styled.util';
import useLocation from '../util/useLocation';

const StyledSearch = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const StyledSearchQueryTitle = styled('h2')`
  color: #bf303c;
  margin-top: 0;
`;

const StyledSearchResultTitle = styled('h3')`
  margin: 0;
`;

const StyledSearchResultContent = styled('div')`
  overflow: hidden;

  p {
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
`;

interface SearchProps {
  searchableEntries: SearchableEntry[];
}

const Search = ({ searchableEntries }: SearchProps) => {
  const { search } = useLocation();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(search);
    setQuery(params.get('q'));
  }, [search]);

  const searchResults = useSearchScores(query, searchableEntries);

  return (
    <PageLayout url="/search" title="Search">
      <StyledSearchQueryTitle>
        Results for <i>&quot;{query}&quot;</i>
      </StyledSearchQueryTitle>
      <StyledSearch>
        {searchResults.map(({ url, title, summary }) => (
          <Button
            key={`result-${url}`}
            href={url}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '100%',
              color: '#333',
              lineHeight: 'inherit',
              letterSpacing: 'inherit',
              textTransform: 'unset',
              gap: '8px',
              margin: '-8px',
              padding: '8px',
              '&:hover': {
                color: '#000'
              }
            }}
          >
            <StyledSearchResultTitle>{title}</StyledSearchResultTitle>
            <StyledSearchResultContent
              dangerouslySetInnerHTML={{
                __html: summary
              }}
            />
          </Button>
        ))}
      </StyledSearch>
    </PageLayout>
  );
};

export default Search;

export const getStaticProps: GetStaticProps = async (): Promise<{ props: SearchProps }> => {
  return {
    props: {
      searchableEntries: [
        ...fetchPageContent().map(({ data: { title, slug }, content, summary }) => ({
          title,
          content,
          summary,
          url: `/${slug}`
        })),
        ...fetchPostContent().map(({ data: { title, slug }, content, summary }) => ({
          title,
          content,
          summary,
          url: `/posts/${slug}`
        }))
      ]
    }
  };
};
