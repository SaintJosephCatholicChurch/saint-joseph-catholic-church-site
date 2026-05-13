import Button from '@mui/material/Button';
import { styled, useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { memo, useMemo } from 'react';

import getContainerQuery from '../../util/container.util';
import { isEmpty, isNotEmpty } from '../../util/string.util';
import {
  createHomepageFeaturedFieldKey,
  getActiveHomepagePreviewTargetStyle,
  type HomepageFieldKey
} from '../../admin/content-sections/homepage/fieldKeys';

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
  activeFieldKey?: HomepageFieldKey;
  featuredIndex?: number;
  featuredPage?: FeaturedPageData;
  isFullWidth?: boolean;
}

const FeaturedPage = memo(
  ({
    activeFieldKey,
    featuredIndex = 0,
    featuredPage: { page, image, summary },
    isFullWidth = false
  }: FeaturedPageProps) => {
    const theme = useTheme();
    const pageSlugFieldKey = createHomepageFeaturedFieldKey(featuredIndex, 'pageSlug');
    const pageTitleFieldKey = createHomepageFeaturedFieldKey(featuredIndex, 'pageTitle');
    const imageFieldKey = createHomepageFeaturedFieldKey(featuredIndex, 'image');
    const summaryFieldKey = createHomepageFeaturedFieldKey(featuredIndex, 'summary');

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
          {...({ ['data-admin-field-key']: pageSlugFieldKey } as Record<string, string>)}
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
            ...getActiveHomepagePreviewTargetStyle(pageSlugFieldKey, activeFieldKey),
            [getContainerQuery(theme.breakpoints.down(!isFullWidth ? 'lg' : 'sm'))]: {
              gap: '12px'
            }
          }}
        >
          <StyledTitle
            {...({ ['data-admin-field-key']: pageTitleFieldKey } as Record<string, string>)}
            style={getActiveHomepagePreviewTargetStyle(pageTitleFieldKey, activeFieldKey)}
          >
            {title}
          </StyledTitle>
          {isNotEmpty(image) ? (
            <StyledImage
              src={image}
              alt={title ?? ''}
              loading="lazy"
              decoding="async"
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

FeaturedPage.displayName = 'FeaturedPage';

export default FeaturedPage;
