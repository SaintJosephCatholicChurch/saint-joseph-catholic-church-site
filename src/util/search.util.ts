import compareAsc from 'date-fns/compareAsc';
import differenceInDays from 'date-fns/differenceInDays';
import parseISO from 'date-fns/parseISO';
import { useEffect, useState } from 'react';

import { isEmpty, isNotEmpty } from './string.util';

import type { SearchableEntry } from '../interface';

const PARTIAL_MATCH_WORD_LENGTH_THRESHOLD = 5;
const WHOLE_WORD_MATCH_FAVOR_WEIGHT = 1.5;
const TITLE_FAVOR_WEIGHT = 15;
const DAYS_MULTIPLIER = 0.05;
const All_DAYS = differenceInDays(new Date(), new Date(2017, 0, 1));
const RECENT_DAYS = 32;

const COMMON_SEARCH_WORDS = ['the', 'of', 'is', 'a', 'an'];

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

  const exactMatchFavorWeight = words.length;
  const exactSearch = words.join(' ');
  let isRecent = false;
  if (isNotEmpty(entry.date)) {
    const daysSince = differenceInDays(new Date(), parseISO(entry.date));
    if (daysSince <= RECENT_DAYS) {
      isRecent = true;
    }
  }

  const hasUncommonWords = words.filter((w) => !COMMON_SEARCH_WORDS.includes(w)).length > 0;
  const hasMoreThanOneWord = words.length > 1;

  let wordsMatched = 0;
  let scoreFromWords = 0;

  for (const word of words) {
    if (hasUncommonWords && COMMON_SEARCH_WORDS.includes(word)) {
      continue;
    }

    let wordScore =
      (entry.title.match(new RegExp(`\\b${word}\\b`, 'gi')) ?? []).length *
      TITLE_FAVOR_WEIGHT *
      WHOLE_WORD_MATCH_FAVOR_WEIGHT;
    wordScore += (entry.content.match(new RegExp(`\\b${word}\\b`, 'gi')) ?? []).length * WHOLE_WORD_MATCH_FAVOR_WEIGHT;

    if (word.length >= PARTIAL_MATCH_WORD_LENGTH_THRESHOLD) {
      wordScore += (entry.title.match(new RegExp(`${word}`, 'gi')) ?? []).length * TITLE_FAVOR_WEIGHT;
      wordScore += (entry.content.match(new RegExp(`${word}`, 'gi')) ?? []).length;
    }

    if (wordScore > 0) {
      wordsMatched += 1;
      scoreFromWords += wordScore;
    }
  }

  if (wordsMatched > 1 || !hasMoreThanOneWord) {
    score += scoreFromWords;
  }

  const isExactTitleMatch = Boolean((entry.title.match(new RegExp(`\\b${exactSearch}\\b`, 'gi')) ?? []).length > 0);
  const exactTitleMatchScore =
    (isExactTitleMatch ? 1 : 0) * TITLE_FAVOR_WEIGHT * exactMatchFavorWeight * WHOLE_WORD_MATCH_FAVOR_WEIGHT;

  if (isExactTitleMatch && (isRecent || !entry.date)) {
    metaScore += 1;
  }

  score += exactTitleMatchScore;

  score +=
    (entry.content.match(new RegExp(`\\b${exactSearch}\\b`, 'gi')) ?? []).length *
    exactMatchFavorWeight *
    WHOLE_WORD_MATCH_FAVOR_WEIGHT;

  if (score > 0 && isNotEmpty(entry.date)) {
    const daysSince = differenceInDays(new Date(), parseISO(entry.date));

    score += Math.pow((All_DAYS - daysSince) * DAYS_MULTIPLIER, 2);
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

    const allEntries = [...entries];
    allEntries.sort((a, b) => {
      if (!a.date) {
        if (!b.date) {
          return 0;
        }

        return -1;
      } else if (!b.date) {
        return 1;
      }

      return compareAsc(parseISO(b.date), parseISO(a.date));
    });

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
