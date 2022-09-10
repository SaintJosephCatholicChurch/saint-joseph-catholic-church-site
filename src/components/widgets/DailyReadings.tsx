import { memo, useEffect, useState } from 'react';
import { DAILY_READINGS_RSS, getFeed } from '../../lib/rss';
import styled from '../../util/styled.util';

const StyledDailyReadings = styled('div')(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    gap: 8px;

    ${theme.breakpoints.down('lg')} {
      gap: 12px;
    }
  `
);

const StyledDailyReadingsTitle = styled('h3')`
  margin: 0;
  margin-bottom: 8px;
  text-transform: uppercase;
  color: #333;
  font-size: 24px;
  font-weight: 500;
`;

const StyledDailyReading = styled('a')(
  ({ theme }) => `
    display: flex;
    align-items: baseline;
    color: #333;

    &:hover {
      color: #161616;
      text-decoration: underline;
    }

    ${theme.breakpoints.down('lg')} {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
  `
);

const StyledDailyReadingTitle = styled('h5')`
  display: flex;
  font-weight: 500;
  margin: 0;
  font-size: 16px;
  color: #bf303c;
`;

const StyledDailyReadingDescription = styled('div')`
  display: flex;
  font-size: 16px;
`;

interface Reading {
  title: string;
  link: string;
  description: string;
}

interface ReadingsData {
  link: string;
  title: string;
  readings: Reading[];
}

interface FeedReading {
  rss?: {
    channel?: {
      link?: string;
      title?: string;
      item?: {
        link?: string;
        title?: string;
        description?: string;
      }[];
    };
  };
}

const ENTRY_REGEX = /<h4>[ ]*([^\n]+)[ ]*<a[ ]*href="([^\n]+)[ ]*"[ \\]*>[ ]*([^\n]+)[ ]*<\/a>[ ]*<\/h4>/g;

const DailyReadings = memo(() => {
  const [readings, setReadings] = useState<ReadingsData | null>(null);

  useEffect(() => {
    const getReadings = async () => {
      const feed = await getFeed<FeedReading>(DAILY_READINGS_RSS);
      if (feed === null) {
        return;
      }

      const { item: entries = [] } = feed?.rss?.channel ?? {};
      if (entries.length > 0) {
        const { link = '', title = '', description = '' } = entries[0];

        const readings: Reading[] = [];

        let match: RegExpExecArray;
        do {
          match = ENTRY_REGEX.exec(description);
          if (match && match.length === 4) {
            readings.push({
              title: match[1].trim(),
              link: match[2].trim(),
              description: match[3].trim()
            });
          }
        } while (match && match.length === 4);

        setReadings({
          link,
          title,
          readings
        });
      }
    };

    getReadings();
  }, []);

  if ((readings?.readings.length ?? 0) === 0) {
    return null;
  }

  return (
    <StyledDailyReadings>
      <StyledDailyReadingsTitle>Today&apos;s Readings</StyledDailyReadingsTitle>
      {readings.readings.map((reading, index) => (
        <StyledDailyReading key={`reading-${index}`} href={reading.link} target="_blank">
          <StyledDailyReadingTitle>{reading.title}</StyledDailyReadingTitle>
          <StyledDailyReadingDescription>&nbsp;&nbsp;{reading.description}</StyledDailyReadingDescription>
        </StyledDailyReading>
      ))}
    </StyledDailyReadings>
  );
});

DailyReadings.displayName = 'DailyReadings';

export default DailyReadings;
