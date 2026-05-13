'use client';

import Box from '@mui/material/Box';

import ContactView from '../../../components/pages/custom/contact/ContactView';
import { handleAdminPreviewSelectionClick } from '../components/adminPreviewSelection';
import { AdminPagePreviewFrame } from '../../AdminPagePreviewFrame';
import { buildChurchDetailsPreviewData } from './previewData';

import type { ChurchDetailsFieldKey } from './fieldKeys';

import type { ChurchDetailsDraft } from '../../content/writableStructuredContent';

interface ChurchDetailsSectionPreviewProps {
  activeFieldKey?: ChurchDetailsFieldKey;
  interactive?: boolean;
  onSelectFieldKey?: (fieldKey: ChurchDetailsFieldKey) => void;
  value: ChurchDetailsDraft;
}

export function ChurchDetailsSectionPreview({
  activeFieldKey,
  interactive = false,
  onSelectFieldKey,
  value
}: ChurchDetailsSectionPreviewProps) {
  return (
    <AdminPagePreviewFrame>
      <Box
        onClickCapture={(event) => {
          handleAdminPreviewSelectionClick(event, {
            interactive,
            onSelectFieldKey
          });
        }}
        sx={{ display: 'flex', flexDirection: 'column', maxWidth: '100%', width: '1200px' }}
      >
        <ContactView
          adminSelection={{ activeFieldKey, interactive }}
          churchDetails={buildChurchDetailsPreviewData(value)}
          disableForm
        />
      </Box>
    </AdminPagePreviewFrame>
  );
}
