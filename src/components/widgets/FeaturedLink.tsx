import Button from '@mui/material/Button';
import { styled, useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { memo } from 'react';

import getContainerQuery from '../../util/container.util';
import { isEmpty, isNotEmpty } from '../../util/string.util';

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
  featuredLink?: FeaturedLinkData;
  isFullWidth?: boolean;
}

const FeaturedLink = memo(
  ({ featuredLink: { title, url, image, summary }, isFullWidth = false }: FeaturedLinkProps) => {
    const theme = useTheme();

    if (isEmpty(title) || isEmpty(url)) {
      return null;
    }

    return (
      <div>
        <Link href={url} target="_blank">
          <Button
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
              [getContainerQuery(theme.breakpoints.down(!isFullWidth ? 'lg' : 'sm'))]: {
                gap: '12px'
              }
            }}
          >
            <StyledTitle>{title}</StyledTitle>
            {isNotEmpty(image) ? <StyledImage src={image} alt={title} /> : null}
            {isNotEmpty(summary) ? <StyledSummary>{summary}</StyledSummary> : null}
          </Button>
        </Link>
      </div>
    );
  }
);

FeaturedLink.displayName = 'FeaturedLink';

export default FeaturedLink;
