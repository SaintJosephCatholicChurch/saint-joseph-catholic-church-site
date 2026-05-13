'use client';

import { styled } from '@mui/material/styles';

import StaffView from '../../../components/pages/custom/staff/StaffView';
import PageTitle from '../../../components/pages/PageTitle';
import { MAX_APP_WIDTH } from '../../../constants';
import type { Staff } from '../../../interface';
import { handleAdminPreviewSelectionClick } from '../components/adminPreviewSelection';
import { AdminPagePreviewFrame } from '../../AdminPagePreviewFrame';
import type { StaffEntryDraft } from '../../content/writableComplexContent';

import type { StaffFieldKey } from './fieldKeys';

interface StaffPreviewProps {
  activeFieldKey?: StaffFieldKey;
  draft: StaffEntryDraft[];
  interactive?: boolean;
  onSelectFieldKey?: (fieldKey: StaffFieldKey) => void;
}

const STAFF_PREVIEW_CONTAINER_PADDING = 48;
const STAFF_PREVIEW_COLUMN_GAP = 64;
const STAFF_PREVIEW_CONTENT_MAX_WIDTH =
  ((MAX_APP_WIDTH - STAFF_PREVIEW_CONTAINER_PADDING - STAFF_PREVIEW_COLUMN_GAP) * 2) / 3;

const StyledStaffPreviewBody = styled('div')(
  () => `
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: ${STAFF_PREVIEW_CONTENT_MAX_WIDTH}px;
  `
);

function buildStaffPreviewData(draft: StaffEntryDraft[]): Staff[] {
  return draft.map((entry) => ({
    name: entry.name,
    picture: entry.picture,
    title: entry.title
  }));
}

export function StaffPreview({ activeFieldKey, draft, interactive = false, onSelectFieldKey }: StaffPreviewProps) {
  return (
    <AdminPagePreviewFrame>
      <StyledStaffPreviewBody
        onClickCapture={(event) => {
          handleAdminPreviewSelectionClick(event, {
            interactive,
            onSelectFieldKey
          });
        }}
      >
        <PageTitle title="Parish Staff" />
        <StaffView activeFieldKey={activeFieldKey} staff={buildStaffPreviewData(draft)} />
      </StyledStaffPreviewBody>
    </AdminPagePreviewFrame>
  );
}
