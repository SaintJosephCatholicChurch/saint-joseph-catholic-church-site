import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { memo, useMemo } from 'react';
import { FeaturedPage } from '../../interface';
import { isEmpty, isNotEmpty } from '../../util/string.util';
import styled from '../../util/styled.util';

interface StyledDailyReadingsProps {
  isFullWidth: boolean;
}

const StyledFeaturePage = styled('div', ['isFullWidth'])<StyledDailyReadingsProps>(
  ({ theme, isFullWidth }) => `
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
}

const FeaturedPage = memo(({ featuredPage, isFullWidth = false }: FeaturedPageProps) => {
  const theme = useTheme();

  const [slug, title] = useMemo(() => {
    const parts = (featuredPage.page ?? '').split('|');
    if (parts.length < 2) {
      return ['', ''];
    }

    return [parts[0], parts[1]];
  }, [featuredPage.page]);

  if (isEmpty(slug) || isEmpty(title)) {
    return null;
  }

  return (
    <Button
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        textTransform: 'none',
        textAlign: 'left',
        margin: '-8px -8px',
        padding: '0 8px',
        alignItems: 'flex-start',
        [theme.breakpoints.down(!isFullWidth ? 'lg' : 'sm')]: {
          gap: '12px'
        }
      }}
    >
      <StyledTitle>{title}</StyledTitle>
      <StyledImage src={featuredPage.image} />
      {isNotEmpty(featuredPage.summary) ? <StyledSummary>{featuredPage.summary}</StyledSummary> : null}
    </Button>
  );
});

FeaturedPage.displayName = 'FeaturedPage';

export default FeaturedPage;
