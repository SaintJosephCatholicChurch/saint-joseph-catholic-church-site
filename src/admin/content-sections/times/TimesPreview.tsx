'use client';

import Box from '@mui/material/Box';
import { useEffect, useMemo, useState } from 'react';

import ScheduleWidget from '../../../components/schedule/ScheduleWidget';
import { MAX_APP_WIDTH } from '../../../constants';
import type { Times } from '../../../interface';
import churchDetails from '../../../lib/church_details';
import { handleAdminPreviewSelectionClick } from '../components/adminPreviewSelection';
import { AdminPagePreviewFrame } from '../../AdminPagePreviewFrame';
import { buildHomepagePreviewData, type HomepageDraft } from '../../content/writableComplexContent';

interface TimesPreviewProps {
  activePathKey?: string;
  draft: HomepageDraft;
  interactive?: boolean;
  onSelectPathKey?: (pathKey: string) => void;
  selectedCategoryId?: string;
  times: Times[];
}

export function TimesPreview({
  activePathKey,
  draft,
  interactive = false,
  onSelectPathKey,
  selectedCategoryId,
  times
}: TimesPreviewProps) {
  const homepagePreview = buildHomepagePreviewData(draft);
  const [previewTab, setPreviewTab] = useState(0);
  const activeCategoryIndex = useMemo(
    () => (selectedCategoryId ? times.findIndex((entry) => entry.id === selectedCategoryId) : -1),
    [selectedCategoryId, times]
  );

  useEffect(() => {
    if (activeCategoryIndex >= 0) {
      setPreviewTab(activeCategoryIndex);
    }
  }, [activeCategoryIndex]);

  function handleClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    handleAdminPreviewSelectionClick(event, {
      interactive,
      onSelectFieldKey: onSelectPathKey
    });
  }

  return (
    <AdminPagePreviewFrame>
      <Box
        onClickCapture={handleClickCapture}
        sx={{ display: 'flex', flexDirection: 'column', maxWidth: '100%', width: `${MAX_APP_WIDTH}px` }}
      >
        <ScheduleWidget
          adminSelection={{ activePathKey }}
          inCMS
          times={times}
          details={homepagePreview.schedule_section}
          liveStreamButton={homepagePreview.live_stream_button}
          invitationText={homepagePreview.invitation_text}
          facebookPage={churchDetails.facebook_page}
          tab={previewTab}
          onTabChange={(nextTab) => setPreviewTab(nextTab)}
        />
      </Box>
    </AdminPagePreviewFrame>
  );
}
