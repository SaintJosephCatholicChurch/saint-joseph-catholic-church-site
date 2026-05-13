import Button from '@mui/material/Button';
import { styled, useTheme } from '@mui/material/styles';
import { memo } from 'react';

import getContainerQuery from '../../util/container.util';
import { isEmpty, isNotEmpty } from '../../util/string.util';
import {
  createHomepageFeaturedFieldKey,
  getActiveHomepagePreviewTargetStyle,
  type HomepageFieldKey
} from '../../admin/content-sections/homepage/fieldKeys';

import type { FeaturedLink as FeaturedLinkData } from '../../interface';

const StyledTitle = styled('h3')`
  margin: 0;
  margin-bottom: 8px;
  text-transform: uppercase;
  color: #333;
  font-size: 24px;
  font-weight: 500;
`;

const StyledImage = styled('img')`
  width: 100%;
`;

const StyledSummary = styled('div')(
  ({ theme }) => `
    display: flex;
    font-size: 16px;
    color: #343434;
    font-weight: 500;

    ${getContainerQuery(theme.breakpoints.down('lg'))} {
      font-size: 18px;
    }
  `
);

interface FeaturedLinkProps {
  activeFieldKey?: HomepageFieldKey;
  featuredIndex?: number;
  featuredLink?: FeaturedLinkData;
  isFullWidth?: boolean;
}

const FeaturedLink = memo(
  ({
    activeFieldKey,
    featuredIndex = 0,
    featuredLink: { title, url, image, summary },
    isFullWidth = false
  }: FeaturedLinkProps) => {
    const theme = useTheme();
    const titleFieldKey = createHomepageFeaturedFieldKey(featuredIndex, 'title');
    const imageFieldKey = createHomepageFeaturedFieldKey(featuredIndex, 'image');
    const summaryFieldKey = createHomepageFeaturedFieldKey(featuredIndex, 'summary');

    if (isEmpty(title) || isEmpty(url)) {
      return null;
    }

    return (
      <div>
        <Button
          component="a"
          {...({ ['data-admin-field-key']: titleFieldKey } as Record<string, string>)}
          href={url}
          target={
            /^https:\/\/[a-z]+\.stjosephchurchbluffton\.org\//.test(url) && !/\.[a-z]{1,4}$/.test(url)
              ? undefined
              : '_blank'
          }
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            textTransform: 'none',
            textAlign: 'left',
            margin: '-8px -8px',
            padding: '0 8px 8px',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            ...getActiveHomepagePreviewTargetStyle(titleFieldKey, activeFieldKey),
            [getContainerQuery(theme.breakpoints.down(!isFullWidth ? 'lg' : 'sm'))]: {
              gap: '12px'
            }
          }}
        >
          <StyledTitle
            {...({ ['data-admin-field-key']: titleFieldKey } as Record<string, string>)}
            style={getActiveHomepagePreviewTargetStyle(titleFieldKey, activeFieldKey)}
          >
            {title}
          </StyledTitle>
          {isNotEmpty(image) ? (
            <StyledImage
              src={image}
              alt={title}
              {...({ ['data-admin-field-key']: imageFieldKey } as Record<string, string>)}
              style={getActiveHomepagePreviewTargetStyle(imageFieldKey, activeFieldKey)}
            />
          ) : null}
          {isNotEmpty(summary) ? (
            <StyledSummary
              {...({ ['data-admin-field-key']: summaryFieldKey } as Record<string, string>)}
              style={getActiveHomepagePreviewTargetStyle(summaryFieldKey, activeFieldKey)}
            >
              {summary}
            </StyledSummary>
          ) : null}
        </Button>
      </div>
    );
  }
);

FeaturedLink.displayName = 'FeaturedLink';

export default FeaturedLink;
