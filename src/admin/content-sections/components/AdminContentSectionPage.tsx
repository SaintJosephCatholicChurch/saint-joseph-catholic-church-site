'use client';

import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import {
  AdminDetailTabs,
  AdminPreviewPane,
  AdminRecordHeader,
  AdminRecordWorkspacePanel
} from '../../components/AdminWorkspace';
import { useAdminQueryParamState } from '../../useAdminQueryParamState';

import type { ReactNode } from 'react';

const CONTENT_SECTION_PANELS = ['editor', 'preview'] as const;

type ContentSectionPanelId = (typeof CONTENT_SECTION_PANELS)[number];

interface AdminContentSectionPageProps {
  actions?: ReactNode;
  description?: ReactNode;
  editor: ReactNode;
  editorWidth?: number;
  panelParamName?: string;
  preview?: ReactNode;
  title: ReactNode;
}

export function AdminContentSectionPage({
  actions,
  description,
  editor,
  editorWidth = 430,
  panelParamName = 'contentPanel',
  preview,
  title
}: AdminContentSectionPageProps) {
  const theme = useTheme();
  const isMobileLayout = useMediaQuery(theme.breakpoints.down('md'));
  const hasPreview = Boolean(preview);
  const [panel, setPanel] = useAdminQueryParamState<ContentSectionPanelId>({
    allowedValues: CONTENT_SECTION_PANELS,
    defaultValue: 'editor',
    paramName: panelParamName
  });

  if (!hasPreview) {
    return (
      <Stack spacing={2} sx={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
        <AdminRecordWorkspacePanel
          panelSx={{
            display: 'flex',
            flex: 1,
            height: '100%',
            minWidth: 0,
            width: '100%'
          }}
        >
          <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
            <AdminRecordHeader actions={actions} title={title} />
            {description ? <div>{description}</div> : null}
            {editor}
          </Stack>
        </AdminRecordWorkspacePanel>
      </Stack>
    );
  }

  return (
    <Stack spacing={2} sx={{ flex: 1, minHeight: 0, minWidth: 0, width: '100%' }}>
      {isMobileLayout ? (
        <AdminDetailTabs
          value={panel}
          onChange={(nextPanel) => setPanel(nextPanel as ContentSectionPanelId)}
          tabs={[
            { label: 'Editor', value: 'editor' },
            { label: 'Preview', value: 'preview' }
          ]}
        />
      ) : null}

      <Stack direction={{ md: 'row', xs: 'column' }} spacing={2} alignItems="stretch" sx={{ flex: 1, minHeight: 0 }}>
        {!isMobileLayout || panel === 'editor' ? (
          <AdminRecordWorkspacePanel
            panelSx={{
              flex: { md: `0 0 ${editorWidth}px`, xs: '1 1 auto' },
              height: '100%',
              minWidth: 0,
              width: { md: editorWidth, xs: '100%' }
            }}
          >
            <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
              <AdminRecordHeader actions={actions} title={title} />
              {description ? <div>{description}</div> : null}
              {editor}
            </Stack>
          </AdminRecordWorkspacePanel>
        ) : null}

        {!isMobileLayout || panel === 'preview' ? <AdminPreviewPane>{preview}</AdminPreviewPane> : null}
      </Stack>
    </Stack>
  );
}
