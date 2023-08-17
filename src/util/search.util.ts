import differenceInDays from 'date-fns/differenceInDays';
import parseISO from 'date-fns/parseISO';
import { useEffect, useState } from 'react';

import { isEmpty, isNotEmpty } from './string.util';

import type { SearchableEntry } from '../interface';

const PARTIAL_MATCH_WORD_LENGTH_THRESHOLD = 5;
const WHOLE_WORD_MATCH_FAVOR_WEIGHT = 2;
const TITLE_FAVOR_WEIGHT = 15;
const RECENT_DAYS_MULTIPLIER = 2;
const RECENT_DAYS = 62;

interface SearchScore {
  entry: SearchableEntry;
  metaScore: number;
  score: number;
  isExactTitleMatch: boolean;
}

function getSearchScore(words: string[], entry: SearchableEntry): SearchScore {
  let score = 0;
  let metaScore = 0;

  if (entry.priority) {
    metaScore += 1;
  }

  for (const word of words) {
    score +=
      (entry.title.match(new RegExp(`\\b${word}\\b`, 'gi')) ?? []).length *
      TITLE_FAVOR_WEIGHT *
      WHOLE_WORD_MATCH_FAVOR_WEIGHT;
    score += (entry.content.match(new RegExp(`\\b${word}\\b`, 'gi')) ?? []).length * WHOLE_WORD_MATCH_FAVOR_WEIGHT;

    if (word.length >= PARTIAL_MATCH_WORD_LENGTH_THRESHOLD) {
      score += (entry.title.match(new RegExp(`${word}`, 'gi')) ?? []).length * TITLE_FAVOR_WEIGHT;
      score += (entry.content.match(new RegExp(`${word}`, 'gi')) ?? []).length;
    }
  }

  const exactMatchFavorWeight = words.length;
  const exactSearch = words.join(' ');
  const isExactTitleMatch = Boolean((entry.title.match(new RegExp(`\\b${exactSearch}\\b`, 'gi')) ?? []).length > 0);
  const exactTitleMatchScore =
    (isExactTitleMatch ? 1 : 0) * TITLE_FAVOR_WEIGHT * exactMatchFavorWeight * WHOLE_WORD_MATCH_FAVOR_WEIGHT;

  if (isExactTitleMatch) {
    metaScore += 1;
  }

  score += exactTitleMatchScore;
  score +=
    (entry.content.match(new RegExp(`\\b${exactSearch}\\b`, 'gi')) ?? []).length *
    exactMatchFavorWeight *
    WHOLE_WORD_MATCH_FAVOR_WEIGHT;

  if (score > 0 && isNotEmpty(entry.date)) {
    let daysSince = differenceInDays(new Date(), parseISO(entry.date));
    if (daysSince > RECENT_DAYS) {
      daysSince = RECENT_DAYS;
    }

    score += (RECENT_DAYS - daysSince) * RECENT_DAYS_MULTIPLIER;
  }

  return {
    score,
    metaScore,
    entry,
    isExactTitleMatch: exactTitleMatchScore > 0
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
    scores.sort((a, b) => {
      if (a.metaScore !== b.metaScore) {
        return b.metaScore - a.metaScore;
      }

      return b.score - a.score;
    });

    setResults(scores.map(({ entry }) => entry));
  }, [entries, query]);

  return results;
}
