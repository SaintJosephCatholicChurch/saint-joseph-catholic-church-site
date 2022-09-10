import { useEffect, useState } from 'react';
import { SearchableEntry } from '../interface';
import { isEmpty } from './string.util';

interface SearchScore {
  entry: SearchableEntry;
  score: number;
}

function getSearchScore(words: string[], entry: SearchableEntry): SearchScore {
  let score = 0;

  for (const word of words) {
    score += (entry.title.match(new RegExp(`${word}`, 'gi')) ?? []).length * 2;
    score += (entry.content.match(new RegExp(`${word}`, 'gi')) ?? []).length;
  }

  return {
    score,
    entry
  };
}

export function useSearchScores(query: string | null, entries: SearchableEntry[]): SearchableEntry[] {
  const [results, setResults] = useState<SearchableEntry[]>([]);

  useEffect(() => {
    if (isEmpty(query?.trim())) {
      return;
    }

    const queryWords = query.split(' ').filter((word) => word.trim().length > 0);

    const scores = entries.map((entry) => getSearchScore(queryWords, entry)).filter((result) => result.score > 0);
    scores.sort((a, b) => b.score - a.score);

    console.log('scores', scores);

    setResults(scores.map(({ entry }) => entry));
  }, [entries, query]);

  return results;
}
