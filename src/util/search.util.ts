import addMonths from 'date-fns/addMonths';
import addWeeks from 'date-fns/addWeeks';
import isWithinInterval from 'date-fns/isWithinInterval';
import parseISO from 'date-fns/parseISO';
import { useEffect, useState } from 'react';
import { SearchableEntry } from '../interface';
import { isNotNullish } from './null.util';
import { isEmpty } from './string.util';

const PARTIAL_MATCH_WORD_LENGTH_THRESHOLD = 5;
const WHOLE_WORD_MATCH_FAVOR_WEIGHT = 2;
const TITLE_FAVOR_WEIGHT = 10;
const IN_LAST_WEEK_AMOUNT = 10;
const IN_LAST_MONTH_AMOUNT = 5;

interface SearchScore {
  entry: SearchableEntry;
  score: number;
  isExactTitleMatch: boolean;
}

function getSearchScore(words: string[], entry: SearchableEntry): SearchScore {
  let score = 0;

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
  const exactTitleMatchScore =
    (entry.title.match(new RegExp(`\\b${exactSearch}\\b`, 'gi')) ?? []).length *
    TITLE_FAVOR_WEIGHT *
    exactMatchFavorWeight *
    WHOLE_WORD_MATCH_FAVOR_WEIGHT;
  score += exactTitleMatchScore;
  score +=
    (entry.content.match(new RegExp(`\\b${exactSearch}\\b`, 'gi')) ?? []).length *
    exactMatchFavorWeight *
    WHOLE_WORD_MATCH_FAVOR_WEIGHT;

  if (isNotNullish(entry.date)) {
    score += isWithinInterval(parseISO(entry.date), { start: addMonths(new Date(), -1), end: new Date() })
      ? IN_LAST_MONTH_AMOUNT
      : 0;
  }

  if (isNotNullish(entry.date)) {
    score += isWithinInterval(parseISO(entry.date), { start: addWeeks(new Date(), -1), end: new Date() })
      ? IN_LAST_WEEK_AMOUNT
      : 0;
  }

  return {
    score,
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
      if (
        a.entry.priority === b.entry.priority ||
        (a.entry.priority && b.isExactTitleMatch) ||
        (b.entry.priority && a.isExactTitleMatch)
      ) {
        return b.score - a.score;
      }

      if (a.entry.priority) {
        return -1;
      }

      return 1;
    });

    setResults(scores.map(({ entry }) => entry));
  }, [entries, query]);

  return results;
}
