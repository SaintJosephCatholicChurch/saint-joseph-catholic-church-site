import Button from '@mui/material/Button';
import { styled, useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { memo, useMemo } from 'react';

import getContainerQuery from '../../util/container.util';
import { isEmpty, isNotEmpty } from '../../util/string.util';

import type { FeaturedPage as FeaturedPageData } from '../../interface';

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

interface FeaturedPageProps {
  featuredPage?: FeaturedPageData;
  isFullWidth?: boolean;
}

const FeaturedPage = memo(({ featuredPage: { page, image, summary }, isFullWidth = false }: FeaturedPageProps) => {
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
    <div>
      <Button
        LinkComponent={Link}
        href={slug}
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
        {isNotEmpty(image) ? <StyledImage src={image} alt={title ?? ''} loading="lazy" decoding="async" /> : null}
        {isNotEmpty(summary) ? <StyledSummary>{summary}</StyledSummary> : null}
      </Button>
    </div>
  );
});

FeaturedPage.displayName = 'FeaturedPage';

export default FeaturedPage;
