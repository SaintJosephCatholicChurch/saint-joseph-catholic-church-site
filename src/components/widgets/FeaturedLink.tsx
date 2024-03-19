import Button from '@mui/material/Button';
import { styled, useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { memo } from 'react';

import { FeaturedLink } from '../../interface';
import getContainerQuery from '../../util/container.util';
import { isEmpty, isNotEmpty } from '../../util/string.util';
import transientOptions from '../../util/transientOptions';

interface StyledFeaturedLinkWrapperProps {
  $hideOnMobile: boolean;
  $hideOnNonMobile: boolean;
}

const StyledFeaturedLinkWrapper = styled(
  'div',
  transientOptions
)<StyledFeaturedLinkWrapperProps>(
  ({ $hideOnMobile, $hideOnNonMobile, theme }) => `
    ${
      $hideOnMobile
        ? `
          ${getContainerQuery(theme.breakpoints.down('lg'))} {
            display: none;
          }
        `
        : ''
    }

    ${
      $hideOnNonMobile
        ? `
          ${getContainerQuery(theme.breakpoints.up('lg'))} {
            display: none;
          }
        `
        : ''
    }
  `
);

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
  featuredLink?: FeaturedLink;
  isFullWidth?: boolean;
  hideOnMobile?: boolean;
  hideOnNonMobile?: boolean;
}

const FeaturedLink = memo(
  ({
    featuredLink: { title, url, image, summary },
    isFullWidth = false,
    hideOnMobile = false,
    hideOnNonMobile = false
  }: FeaturedLinkProps) => {
    const theme = useTheme();

    if (isEmpty(title) || isEmpty(url)) {
      return null;
    }

    return (
      <StyledFeaturedLinkWrapper $hideOnMobile={hideOnMobile} $hideOnNonMobile={hideOnNonMobile}>
        <Link href={url}>
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
      </StyledFeaturedLinkWrapper>
    );
  }
);

FeaturedLink.displayName = 'FeaturedLink';

export default FeaturedLink;
