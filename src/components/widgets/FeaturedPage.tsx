import Button from '@mui/material/Button';
import { styled, useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { memo, useMemo } from 'react';

import { FeaturedPage } from '../../interface';
import { isEmpty, isNotEmpty } from '../../util/string.util';
import transientOptions from '../../util/transientOptions';

interface StyledFeaturedPageWrapperProps {
  $hideOnMobile: boolean;
  $hideOnNonMobile: boolean;
}

const StyledFeaturedPageWrapper = styled(
  'div',
  transientOptions
)<StyledFeaturedPageWrapperProps>(
  ({ $hideOnMobile, $hideOnNonMobile, theme }) => `
    ${
      $hideOnMobile
        ? `
      ${theme.breakpoints.down('sm')} {
        display: none;
      }
    `
        : ''
    }

    ${
      $hideOnNonMobile
        ? `
      ${theme.breakpoints.up('sm')} {
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

    ${theme.breakpoints.down('lg')} {
      font-size: 18px;
    }
  `
);

interface FeaturedPageProps {
  featuredPage?: FeaturedPage;
  isFullWidth?: boolean;
  hideOnMobile?: boolean;
  hideOnNonMobile?: boolean;
}

const FeaturedPage = memo(
  ({
    featuredPage: { page, image, summary },
    isFullWidth = false,
    hideOnMobile = false,
    hideOnNonMobile = false
  }: FeaturedPageProps) => {
    const theme = useTheme();

    const [slug, title] = useMemo(() => {
      const parts = (page ?? '').split('|');
      if (parts.length < 2) {
        return ['', ''];
      }

      return [parts[0], parts[1]];
    }, [page]);

    if (isEmpty(slug) || isEmpty(title)) {
      return null;
    }

    return (
      <StyledFeaturedPageWrapper $hideOnMobile={hideOnMobile} $hideOnNonMobile={hideOnNonMobile}>
        <Link href={slug}>
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
              [theme.breakpoints.down(!isFullWidth ? 'lg' : 'sm')]: {
                gap: '12px'
              }
            }}
          >
            <StyledTitle>{title}</StyledTitle>
            {isNotEmpty(image) ? <StyledImage src={image} alt={title} /> : null}
            {isNotEmpty(summary) ? <StyledSummary>{summary}</StyledSummary> : null}
          </Button>
        </Link>
      </StyledFeaturedPageWrapper>
    );
  }
);

FeaturedPage.displayName = 'FeaturedPage';

export default FeaturedPage;
