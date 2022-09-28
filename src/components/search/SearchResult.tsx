import ArticleIcon from '@mui/icons-material/Article';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import WebIcon from '@mui/icons-material/Web';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { useMemo } from 'react';
import contentStyles from '../../../public/styles/content.module.css';
import { BULLETIN, NEWS, SearchableEntry } from '../../interface';

const StyledSearchResultBody = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 8px;
  overflow: hidden;
`;

const StyledSearchResultTitleWrapper = styled('div')`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const StyledSearchResultTitle = styled('h3')`
  margin: 0;
  font-size: 18px;
  line-height: 22px;
`;

const StyledSearchResultSubtitle = styled('div')`
  display: flex;
  color: #757575;
  font-size: 13px;
  font-weight: 400;
  line-height: 17px;
`;

const StyledSearchResultContent = styled('div')`
  margin: 0;
  font-size: 16px;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  color: #666;

  &.${contentStyles.content} h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 4px;
  }
`;

interface SearchResultProps {
  entry: SearchableEntry;
  summary?: string;
}

const SearchResult = ({ entry: { url, title, subtitle, type }, summary }: SearchResultProps) => {
  const Icon = useMemo(() => {
    switch (type) {
      case NEWS:
        return ArticleIcon;
      case BULLETIN:
        return NewspaperIcon;
      default:
        return WebIcon;
    }
  }, [type]);

  return (
    <Link href={url}>
      <Button
        key={`result-${url}`}
        startIcon={<Icon fontSize="large" />}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          textAlign: 'left',
          width: 'calc(100% + 32px)',
          color: '#333',
          lineHeight: 'inherit',
          letterSpacing: 'inherit',
          textTransform: 'unset',
          gap: '4px',
          margin: '-16px',
          padding: '16px',
          '&:hover': {
            color: '#000',
            backgroundColor: 'rgba(118,118,118,0.15)'
          },
          '.MuiButton-startIcon': {
            marginLeft: 0,
            '*:nth-of-type(1)': {
              fontSize: '24px'
            }
          }
        }}
      >
        <StyledSearchResultBody>
          <StyledSearchResultTitleWrapper>
            <StyledSearchResultTitle>{title}</StyledSearchResultTitle>
            {subtitle ? <StyledSearchResultSubtitle>{subtitle}</StyledSearchResultSubtitle> : null}
          </StyledSearchResultTitleWrapper>
          {summary ? (
            <StyledSearchResultContent
              className={`${contentStyles.content}`}
              dangerouslySetInnerHTML={{
                __html: summary
              }}
            />
          ) : null}
        </StyledSearchResultBody>
      </Button>
    </Link>
  );
};

export default SearchResult;
