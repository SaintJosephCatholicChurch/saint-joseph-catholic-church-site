import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import type { GetStaticProps } from 'next/types';
import { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import SearchResult from '../components/search/SearchResult';
import SearchBox from '../components/SearchBox';
import { BULLETIN, NEWS, PAGE, SearchableEntry } from '../interface';
import { fetchBulletinsMetaData } from '../lib/bulletins';
import churchDetails from '../lib/church_details';
import { fetchPageContent } from '../lib/pages';
import { fetchPostContent } from '../lib/posts';
import staff from '../lib/staff';
import { useSearchScores } from '../util/search.util';
import { isNotEmpty } from '../util/string.util';
import styled from '../util/styled.util';
import useLocation from '../util/useLocation';

const StyledSearch = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const StyledSearchQueryTitle = styled('h2')`
  color: #bf303c;
  margin-top: 0;
  margin-bottom: 32px;
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
    <PageLayout url="/search" title="Search" hideSearch>
      <StyledSearchQueryTitle>
        {isNotEmpty(query) ? <SearchBox defaultValue={query} disableMargin /> : null}
      </StyledSearchQueryTitle>
      <StyledSearch>
        {searchResults?.length > 0 ? (
          searchResults.map((entry) => {
            let summary = entry.summary;
            if (!summary) {
              const match = new RegExp(
                `(?:[^\\s]+\\s){0,10}[\\s]*${query}(?![^<>]*(([\/\"']|]]|\b)>))[\\s]*(?:[^\\s]+\\s){0,25}`,
                'ig'
              ).exec(entry.content);
              if (match && match.length >= 1) {
                summary = `...${match[0].trim()}...`;
              } else {
                const match = new RegExp(
                  `(?:[^\\s]+\\s){0,10}[\\s]*${query
                    .split(' ')
                    .join('|')}(?![^<>]*(([\/\"']|]]|\b)>))[\\s]*(?:[^\\s]+\\s){0,25}`,
                  'ig'
                ).exec(entry.content);
                if (match && match.length >= 1) {
                  summary = `...${match[0].trim()}...`;
                }
              }
            }

            summary = summary?.replace(
              new RegExp(`(${query.split(' ').join('|')})(?![^<>]*(([\/\"']|]]|\b)>))`, 'ig'),
              `<strong style="color: #000">$1</strong>`
            );

            return <SearchResult key={`result-${entry.url}`} entry={entry} summary={summary} />;
          })
        ) : isNotEmpty(query) ? (
          <h3 key="no-results">No results found</h3>
        ) : null}
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
          url: `/${slug}`,
          type: PAGE
        })),
        ...fetchPostContent().map(({ data: { title, slug, date }, content, summary }) => ({
          title,
          subtitle: format(parseISO(date), 'LLLL d, yyyy'),
          content,
          summary,
          url: `/posts/${slug}`,
          type: NEWS,
          date
        })),
        ...fetchBulletinsMetaData().map(({ title, text, slug, date }) => ({
          title,
          content: text,
          url: `/parish-bulletins/${slug}`,
          type: BULLETIN,
          date
        })),
        {
          title: 'Live Stream',
          content: 'live stream facebook',
          url: '/live-stream',
          type: PAGE,
          priority: true
        },
        {
          title: 'Mass & Confession Times',
          content: 'mass times confession times adoration times stations of the cross parish office hours schedule',
          url: '/mass-confession-times',
          type: PAGE,
          priority: true
        },
        {
          title: 'Contact',
          content: `contact church phone number church email church address where to find us ${(
            churchDetails.additional_emails ?? []
          )
            .map(({ name }) => name)
            .join(' ')} ${(churchDetails.additional_phones ?? []).map(({ name }) => name).join(' ')} ${(
            churchDetails.contacts ?? []
          )
            .map(({ title, name }) => `${title} ${name}`)
            .join(' ')}`,
          url: '/contact',
          type: PAGE,
          priority: true
        },
        {
          title: 'Events Calendar',
          content: 'events calendar event schedule upcoming events',
          url: '/events',
          type: PAGE,
          priority: true
        },
        {
          title: 'Parish Staff',
          content: `parish staff ${(staff ?? []).map(({ title, name }) => `${title} ${name}`)}`,
          url: '/staff',
          type: PAGE,
          priority: true
        }
      ]
    }
  };
};
