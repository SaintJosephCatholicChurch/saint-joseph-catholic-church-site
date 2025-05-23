import { styled } from '@mui/material/styles';
import { memo, useEffect, useMemo, useState } from 'react';

import { DAILY_READINGS_RSS, getFeed } from '../../lib/rss';
import { getDailyReadingIFrameUrl } from '../../lib/soundcloud';
import getContainerQuery from '../../util/container.util';
import transientOptions from '../../util/transientOptions';

import type { DailyReadings } from '../../interface';

const LARGE_NUMBER_OF_READINGS = 12;

interface StyledDailyReadingsWrapperProps {
  $readingsCount: number;
}

const StyledDailyReadingsWrapper = styled(
  'div',
  transientOptions
)<StyledDailyReadingsWrapperProps>(
  ({ theme, $readingsCount }) => `
    display: flex;
    flex-direction: column;
    gap: 24px;

    ${getContainerQuery(theme.breakpoints.up('lg'))} {
      grid-row: 1 / span ${$readingsCount > 0 ? ($readingsCount > LARGE_NUMBER_OF_READINGS ? '3' : '2') : '1'};
      grid-column: 2;
    }
  `
);

interface StyledDailyReadingsProps {
  $isFullWidth: boolean;
}

const StyledDailyReadings = styled(
  'div',
  transientOptions
)<StyledDailyReadingsProps>(
  ({ theme, $isFullWidth }) => `
    display: flex;
    flex-direction: column;
    gap: 8px;

    ${getContainerQuery(theme.breakpoints.down(!$isFullWidth ? 'lg' : 'sm'))} {
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

const StyledDailyReadingsSubtitle = styled('h4')`
  color: #666;
  font-size: 14px;
  text-transform: uppercase;
  margin-top: 0;
`;

interface StyledDailyReadingProps {
  $isFullWidth: boolean;
  $isAlternate: boolean;
}

const StyledDailyReading = styled(
  'a',
  transientOptions
)<StyledDailyReadingProps>(
  ({ theme, $isFullWidth, $isAlternate }) => `
    display: flex;
    align-items: baseline;
    color: #333;
    flex-wrap: wrap;
    line-height: 1.5;

    margin-left: ${$isAlternate ? '24px' : '0'};

    &:hover {
      color: #161616;
      text-decoration: underline;
    }

    ${getContainerQuery(theme.breakpoints.down(!$isFullWidth ? 'lg' : 'sm'))} {
      flex-direction: ${$isAlternate ? 'row' : 'column'};
      align-items: flex-start;
      gap: 4px;
    }
  `
);

const StyledDailyReadingNoLink = styled(
  'div',
  transientOptions
)<StyledDailyReadingProps>(
  ({ theme, $isFullWidth, $isAlternate }) => `
    display: flex;
    align-items: baseline;
    color: #333;
    flex-wrap: wrap;
    line-height: 1.5;

    margin-left: ${$isAlternate ? '24px' : '0'};

    ${getContainerQuery(theme.breakpoints.down(!$isFullWidth ? 'lg' : 'sm'))} {
      flex-direction: ${$isAlternate ? 'row' : 'column'};
      align-items: flex-start;
      gap: 4px;
    }
  `
);

const StyledDailyReadingTitle = styled('h5')(
  ({ theme }) => `
    display: flex;
    font-weight: 500;
    margin: 0;
    font-size: 16px;
    color: #bf303c;
    margin-right: -8px;
    white-space: nowrap;

    ${getContainerQuery(theme.breakpoints.down('lg'))} {
      font-size: 18px;
    }
  `
);

const StyledDailyReadingDescription = styled('div')(
  ({ theme }) => `
    display: flex;
    font-size: 16px;
    color: #343434;
    font-weight: 500;
    margin-left: 16px;
    white-space: nowrap;

    ${getContainerQuery(theme.breakpoints.down('lg'))} {
      font-size: 18px;
    }
  `
);

interface Reading {
  title: string;
  link: string;
  description: string;
  alternate: boolean;
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

interface DailyReadingsViewProps {
  dailyReadings: DailyReadings;
  isFullWidth?: boolean;
  showSubtitle?: boolean;
}

const DailyReadingsView = memo(
  ({ dailyReadings: { title, subtitle }, isFullWidth = false, showSubtitle = false }: DailyReadingsViewProps) => {
    const [readings, setReadings] = useState<ReadingsData | null>(null);
    const [soundCloudUrl, setSoundCloudUrl] = useState<string | null>(null);

    const soundCloudIFrame = (
      <iframe width="100%" height="160" scrolling="no" frameBorder="no" allow="autoplay" src={soundCloudUrl} />
    );

    useEffect(() => {
      let alive = true;

      const getSoundCloudUrl = async () => {
        const url = await getDailyReadingIFrameUrl();
        if (!alive) {
          return;
        }

        setSoundCloudUrl(url);
      };

      getSoundCloudUrl();

      return () => {
        alive = false;
      };
    }, []);

    useEffect(() => {
      let alive = true;

      const getReadings = async () => {
        const feed = await getFeed<FeedReading>(DAILY_READINGS_RSS);
        if (!alive) {
          return;
        }

        if (feed === null) {
          return;
        }

        const { item: entries = [] } = feed?.rss?.channel ?? {};
        for (const entry of entries) {
          const { link = '', title = '', description = '' } = entry;

          const readings: Reading[] = [];

          let match: RegExpExecArray;
          do {
            match = ENTRY_REGEX.exec(description);
            if (match && match.length === 4) {
              const title = match[1]
                .replace(/&nbsp;/g, ' ')
                .replace(/[oO]r/g, 'or')
                .trim();

              let link: string | undefined = match[2].trim().replace(/(https:\/\/bible\.usccb\.org)([^/])/, '$1/$2');
              if (link === 'https://bible.usccb.org/route?&lt;nolink&gt;' || link === '') {
                link = undefined;
              }

              readings.push({
                title,
                link,
                description: match[3].replace(/&nbsp;/g, ' ').trim(),
                alternate: title === 'or'
              });
            }
          } while (match && match.length === 4);

          if (readings.length > 0) {
            setReadings({
              link,
              title,
              readings
            });
            break;
          }
        }
      };

      getReadings();

      return () => {
        alive = false;
      };
    }, []);

    const readingsCount = useMemo(() => readings?.readings.length ?? 0, [readings?.readings.length]);

    if (readingsCount === 0) {
      return <StyledDailyReadingsWrapper $readingsCount={readingsCount}>{soundCloudIFrame}</StyledDailyReadingsWrapper>;
    }

    return (
      <StyledDailyReadingsWrapper $readingsCount={readingsCount}>
        <StyledDailyReadings $isFullWidth={isFullWidth}>
          <StyledDailyReadingsTitle>{title}</StyledDailyReadingsTitle>
          {showSubtitle ? <StyledDailyReadingsSubtitle key="subtitle">{subtitle}</StyledDailyReadingsSubtitle> : null}
          {readings.readings.map((reading, index) => (
            <>
              {reading.link !== undefined ? (
                <StyledDailyReading
                  key={`reading-${index}`}
                  href={reading.link}
                  target="_blank"
                  $isFullWidth={isFullWidth}
                  $isAlternate={reading.alternate}
                >
                  <StyledDailyReadingTitle>{reading.title}</StyledDailyReadingTitle>
                  <StyledDailyReadingDescription>{reading.description}</StyledDailyReadingDescription>
                </StyledDailyReading>
              ) : (
                <StyledDailyReadingNoLink
                  key={`reading-${index}`}
                  $isFullWidth={isFullWidth}
                  $isAlternate={reading.alternate}
                >
                  <StyledDailyReadingTitle>{reading.title}</StyledDailyReadingTitle>
                  <StyledDailyReadingDescription>{reading.description}</StyledDailyReadingDescription>
                </StyledDailyReadingNoLink>
              )}
            </>
          ))}
        </StyledDailyReadings>
        {soundCloudIFrame}
      </StyledDailyReadingsWrapper>
    );
  }
);

DailyReadingsView.displayName = 'DailyReadings';

export default DailyReadingsView;
