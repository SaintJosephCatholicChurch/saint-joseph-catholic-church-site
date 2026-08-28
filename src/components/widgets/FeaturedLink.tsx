import Button from '@mui/material/Button';
import { styled, useTheme } from '@mui/material/styles';
import { memo } from 'react';

import getContainerQuery from '../../util/container.util';
import { isEmpty, isNotEmpty } from '../../util/string.util';
import { useResolvedMediaSrc } from '../../admin/previewMediaUrls';
import { getActiveAdminPreviewTargetStyle, getAdminPreviewFieldTargetProps } from '../common/adminPreviewTarget';

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
  activeFieldKey?: string;
  featuredLink?: FeaturedLinkData;
  imageFieldKey?: string;
  isFullWidth?: boolean;
  summaryFieldKey?: string;
  titleFieldKey?: string;
}

const FeaturedLink = memo(
  ({
    activeFieldKey,
    featuredLink: { title, url, image, summary },
    imageFieldKey,
    isFullWidth = false,
    summaryFieldKey,
    titleFieldKey
  }: FeaturedLinkProps) => {
    const theme = useTheme();
    const resolvedImage = useResolvedMediaSrc(image || '');

    if (isEmpty(title) || isEmpty(url)) {
      return null;
    }

    return (
      <div>
        <Button
          component="a"
          {...getAdminPreviewFieldTargetProps(titleFieldKey)}
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
            ...getActiveAdminPreviewTargetStyle(titleFieldKey, activeFieldKey),
            [getContainerQuery(theme.breakpoints.down(!isFullWidth ? 'lg' : 'sm'))]: {
              gap: '12px'
            }
          }}
        >
          <StyledTitle
            {...getAdminPreviewFieldTargetProps(titleFieldKey)}
            style={getActiveAdminPreviewTargetStyle(titleFieldKey, activeFieldKey)}
          >
            {title}
          </StyledTitle>
          {isNotEmpty(image) ? (
            <StyledImage
              src={resolvedImage}
              alt={title}
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

FeaturedLink.displayName = 'FeaturedLink';

export default FeaturedLink;
