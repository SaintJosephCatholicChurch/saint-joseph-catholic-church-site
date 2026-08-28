import Button from '@mui/material/Button';
import { styled, useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { memo, useMemo } from 'react';

import getContainerQuery from '../../util/container.util';
import { isEmpty, isNotEmpty } from '../../util/string.util';
import { useResolvedMediaSrc } from '../../admin/previewMediaUrls';
import { getActiveAdminPreviewTargetStyle, getAdminPreviewFieldTargetProps } from '../common/adminPreviewTarget';

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
  activeFieldKey?: string;
  featuredPage?: FeaturedPageData;
  imageFieldKey?: string;
  isFullWidth?: boolean;
  pageSlugFieldKey?: string;
  pageTitleFieldKey?: string;
  summaryFieldKey?: string;
}

const FeaturedPage = memo(
  ({
    activeFieldKey,
    featuredPage: { page, image, summary },
    imageFieldKey,
    isFullWidth = false,
    pageSlugFieldKey,
    pageTitleFieldKey,
    summaryFieldKey
  }: FeaturedPageProps) => {
    const theme = useTheme();
    const resolvedImage = useResolvedMediaSrc(image || '');

    const [slug, title] = useMemo(() => {
      const parts = (page ?? '').split('|');
      const nextSlug = parts[0]?.trim() || '';
      const nextTitle = parts.slice(1).join('|').trim() || nextSlug;

      return [nextSlug, nextTitle];
    }, [page]);
    const href = slug.startsWith('/') || /^(https?:)?\/\//i.test(slug) ? slug : `/${slug}`;

    if (isEmpty(slug)) {
      return null;
    }

    return (
      <div>
        <Button
          LinkComponent={Link}
          {...getAdminPreviewFieldTargetProps(pageSlugFieldKey)}
          href={href}
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
            ...getActiveAdminPreviewTargetStyle(pageSlugFieldKey, activeFieldKey),
            [getContainerQuery(theme.breakpoints.down(!isFullWidth ? 'lg' : 'sm'))]: {
              gap: '12px'
            }
          }}
        >
          <StyledTitle
            {...getAdminPreviewFieldTargetProps(pageTitleFieldKey)}
            style={getActiveAdminPreviewTargetStyle(pageTitleFieldKey, activeFieldKey)}
          >
            {title}
          </StyledTitle>
          {isNotEmpty(image) ? (
            <StyledImage
              src={resolvedImage}
              alt={title ?? ''}
              loading="lazy"
              decoding="async"
              {...getAdminPreviewFieldTargetProps(imageFieldKey)}
              style={getActiveAdminPreviewTargetStyle(imageFieldKey, activeFieldKey)}
            />
          ) : null}
          {isNotEmpty(summary) ? (
            <StyledSummary
              {...getAdminPreviewFieldTargetProps(summaryFieldKey)}
              style={getActiveAdminPreviewTargetStyle(summaryFieldKey, activeFieldKey)}
            >
              {summary}
            </StyledSummary>
          ) : null}
        </Button>
      </div>
    );
  }
);

FeaturedPage.displayName = 'FeaturedPage';

export default FeaturedPage;
