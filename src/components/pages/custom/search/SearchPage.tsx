'use client';
import { styled } from '@mui/material/styles';
import escapeRegExp from 'lodash/escapeRegExp';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import SearchResult from '../../../../components/search/SearchResult';
import SearchBox from '../../../../components/SearchBox';
import { SEARCH_RESULTS_TO_SHOW } from '../../../../constants';
import { useSearchScores } from '../../../../util/search.util';
import { isNotEmpty } from '../../../../util/string.util';

import type { FC } from 'react';
import type { ContentType, SearchableEntry } from '../../../../interface';

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

function getLongestMatch(entry: SearchableEntry, escapedQuery: string) {
  let biggestMatch = '';
  let m: RegExpExecArray;

  const regex = new RegExp(
    `(?:[\\s]+[^\\s]+){0,10}[\\s]*${escapedQuery
      .split(' ')
      .join('|')}(?![^<>]*(([/"']|]]|\b)>))[\\s]*(?:[^\\s]+\\s){0,25}`,
    'ig'
  );

  do {
    m = regex.exec(entry.content);
    if (m && m.length > 0) {
      if (biggestMatch.length < m[0].length) {
        biggestMatch = m[0];
      }
    }
  } while (m);

  return biggestMatch;
}

export interface SearchEntry {
  title: string;
  content: string;
  summary?: string;
  url: string;
  type: ContentType;
  priority?: boolean;
  showSummary?: boolean;
}

export interface SearchPageProps {
  searchableEntries: SearchEntry[];
}

const SearchPage: FC<SearchPageProps> = ({ searchableEntries }) => {
  const params = useSearchParams();
  const [query, setQuery] = useState('');

  useEffect(() => {
    setQuery(params.get('q'));
  }, [params]);

  const escapedQuery = useMemo(() => escapeRegExp(query), [query]);

  const searchResults = useSearchScores(escapedQuery, searchableEntries);

  return (
    <>
      <StyledSearchQueryTitle>
        {isNotEmpty(query) ? <SearchBox value={query} disableMargin /> : null}
      </StyledSearchQueryTitle>
      <StyledSearch>
        {searchResults?.length > 0 ? (
          [...Array<unknown>(SEARCH_RESULTS_TO_SHOW)].map((_, index) => {
            if (searchResults.length <= index) {
              return;
            }

            const entry = searchResults[index];
            let { summary, showSummary = true } = entry;
            if (!summary && showSummary) {
              const match = new RegExp(
                `(?:[\\s]+[^\\s]+){0,10}[\\s]*${escapedQuery}(?![^<>]*(([/"']|]]|\b)>))[\\s]*(?:[^\\s]+\\s){0,25}`,
                'ig'
              ).exec(entry.content);
              if (match && match.length >= 1) {
                summary = `...${match[0].trim()}...`;
              } else {
                summary = `...${getLongestMatch(entry, escapedQuery)}...`;
              }
            }

            summary = summary?.replace(
              new RegExp(`(${escapedQuery.split(' ').join('|')})(?![^<>]*(([/"']|]]|\b)>))`, 'ig'),
              `<strong style="color: #000">$1</strong>`
            );

            return <SearchResult key={`result-${entry.url}`} entry={entry} summary={summary} />;
          })
        ) : isNotEmpty(query) ? (
          <h3 key="no-results">No results found</h3>
        ) : null}
      </StyledSearch>
    </>
  );
};

export default SearchPage;
