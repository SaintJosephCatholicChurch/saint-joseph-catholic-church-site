'use client';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import HomepageView from '../../../components/homepage/HomepageView';
import { RECENT_NEWS_TO_SHOW } from '../../../constants';
import times from '../../../lib/times';
import { useAdminAuth } from '../../AdminAuthProvider';
import { AdminPagePreviewFrame } from '../../AdminPagePreviewFrame';
import { AdminDialogTitle } from '../../components/AdminDialogTitle';
import { buildHomepagePreviewData, type HomepageDraft } from '../../content/writableComplexContent';
import { getLoadedRecentPostContent } from '../../content/writableDocumentsContent';
import { handleAdminPreviewSelectionClick } from '../components/adminPreviewSelection';
import { ADMIN_HOMEPAGE_MASS_TIMES_ATTRIBUTE, type HomepageFieldKey } from './fieldKeys';

import type { PostContent } from '../../../interface';

interface HomepagePreviewProps {
  activeFieldKey?: HomepageFieldKey;
  draft: HomepageDraft;
  interactive?: boolean;
  onSelectFieldKey?: (fieldKey: HomepageFieldKey) => void;
}

export function HomepagePreview({
  activeFieldKey,
  draft,
  interactive = false,
  onSelectFieldKey
}: HomepagePreviewProps) {
  const pathname = usePathname();
  const { repoClient } = useAdminAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [recentPosts, setRecentPosts] = useState<PostContent[]>([]);
  const [massTimesDialogOpen, setMassTimesDialogOpen] = useState(false);

  useEffect(() => {
    if (!repoClient) {
      setRecentPosts([]);
      return;
    }

    setRecentPosts(getLoadedRecentPostContent(repoClient, RECENT_NEWS_TO_SHOW));
  }, [repoClient]);

  const handleGoToMassTimes = useCallback(() => {
    const nextParams = new URLSearchParams(searchParams.toString());

    nextParams.set('view', 'church');
    nextParams.set('churchTab', 'times');
    nextParams.delete('mode');

    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  const handleClickCapture = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive) {
        return;
      }

      if (event.target instanceof Element && event.target.closest(`[${ADMIN_HOMEPAGE_MASS_TIMES_ATTRIBUTE}]`)) {
        event.preventDefault();
        event.stopPropagation();
        setMassTimesDialogOpen(true);
        return;
      }

      handleAdminPreviewSelectionClick(event, {
        interactive,
        onSelectFieldKey
      });
    },
    [interactive, onSelectFieldKey]
  );

  return (
    <>
      <AdminPagePreviewFrame>
        <Box
          onClickCapture={handleClickCapture}
          sx={{ display: 'flex', flexDirection: 'column', maxWidth: '100%', width: '1200px' }}
        >
          <HomepageView
            adminSelection={{ activeFieldKey }}
            homePageData={buildHomepagePreviewData(draft)}
            times={times}
            recentPosts={recentPosts}
            hideSearch
          />
        </Box>
      </AdminPagePreviewFrame>
      <Dialog fullWidth maxWidth="xs" onClose={() => setMassTimesDialogOpen(false)} open={massTimesDialogOpen}>
        <AdminDialogTitle onClose={() => setMassTimesDialogOpen(false)}>Mass Times</AdminDialogTitle>
        <DialogContent dividers>
          <DialogContentText>Mass Times are managed elsewhere. Would you like to go there now?</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
          <Button color="inherit" onClick={() => setMassTimesDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setMassTimesDialogOpen(false);
              handleGoToMassTimes();
            }}
            variant="contained"
          >
            Go to Mass Times
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
