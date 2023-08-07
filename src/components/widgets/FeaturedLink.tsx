import Button from '@mui/material/Button';
import { styled, useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { memo } from 'react';

import { FeaturedLink } from '../../interface';
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
      ${theme.breakpoints.down('sm').replace("@media", "@container page")} {
        display: none;
      }
    `
        : ''
    }

    ${
      $hideOnNonMobile
        ? `
      ${theme.breakpoints.up('sm').replace("@media", "@container page")} {
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

    ${theme.breakpoints.down('lg').replace("@media", "@container page")} {
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
              [theme.breakpoints.down(!isFullWidth ? 'lg' : 'sm').replace("@media", "@container page")]: {
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
