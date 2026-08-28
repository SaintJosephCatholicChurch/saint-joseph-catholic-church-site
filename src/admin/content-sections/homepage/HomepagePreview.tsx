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
import { useAdminAuth } from '../../AdminAuthProvider';
import { AdminPagePreviewFrame } from '../../AdminPagePreviewFrame';
import { AdminDialogTitle } from '../../components/AdminDialogTitle';
import { buildHomepagePreviewData, type HomepageDraft } from '../../content/writableComplexContent';
import { getLoadedRecentPostContent, loadRecentPostContent } from '../../content/writableDocumentsContent';
import { loadStructuredContent } from '../../content/writableStructuredContent';
import { useAdminUnsavedChanges } from '../../unsavedChanges';
import { handleAdminPreviewSelectionClick } from '../components/adminPreviewSelection';
import {
  ADMIN_HOMEPAGE_MASS_TIMES_ATTRIBUTE,
  createHomepageFeaturedFieldKey,
  createHomepageSlideFieldKey,
  HOMEPAGE_HERO_FIELD_KEYS,
  HOMEPAGE_SECTION_FIELD_KEYS,
  type HomepageFeaturedFieldName,
  type HomepageFieldKey,
  type HomepageSlideFieldName
} from './fieldKeys';

import type { ChurchDetails, PostContent, Times } from '../../../interface';

interface HomepagePreviewProps {
  activeFieldKey?: HomepageFieldKey;
  draft: HomepageDraft;
  interactive?: boolean;
  onSelectFieldKey?: (fieldKey: HomepageFieldKey) => void;
  times: Times[];
}

export function HomepagePreview({
  activeFieldKey,
  draft,
  interactive = false,
  onSelectFieldKey,
  times
}: HomepagePreviewProps) {
  const pathname = usePathname();
  const { repoClient } = useAdminAuth();
  const { confirmIfDirty } = useAdminUnsavedChanges();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [recentPosts, setRecentPosts] = useState<PostContent[]>([]);
  const [churchDetails, setChurchDetails] = useState<ChurchDetails | undefined>();
  const [privacyPolicyUrl, setPrivacyPolicyUrl] = useState<string | undefined>();
  const [massTimesDialogOpen, setMassTimesDialogOpen] = useState(false);

  useEffect(() => {
    if (!repoClient) {
      setChurchDetails(undefined);
      setPrivacyPolicyUrl(undefined);
      return;
    }

    let cancelled = false;

    void loadStructuredContent(repoClient, ['churchDetails', 'siteConfig'])
      .then((content) => {
        if (!cancelled) {
          setChurchDetails(content.churchDetails.value);
          setPrivacyPolicyUrl(content.siteConfig.value.privacy_policy_url);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setChurchDetails(undefined);
          setPrivacyPolicyUrl('');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [repoClient]);

  useEffect(() => {
    if (!repoClient) {
      setRecentPosts([]);
      return;
    }

    const cachedPosts = getLoadedRecentPostContent(repoClient, RECENT_NEWS_TO_SHOW);
    if (cachedPosts.length > 0) {
      setRecentPosts(cachedPosts);
      return;
    }

    let cancelled = false;

    void loadRecentPostContent(repoClient, RECENT_NEWS_TO_SHOW)
      .then((posts) => {
        if (!cancelled) {
          setRecentPosts(posts);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRecentPosts([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [repoClient]);

  const handleGoToMassTimes = useCallback(() => {
    if (!confirmIfDirty()) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams.toString());

    nextParams.set('view', 'church');
    nextParams.set('churchTab', 'times');
    nextParams.delete('mode');

    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [confirmIfDirty, pathname, router, searchParams]);

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

      if (event.target instanceof Element && event.target.closest('.react-slideshow-container .nav')) {
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
            adminSelection={{
              activeFieldKey,
              createFeaturedFieldKey: (clientId, field) =>
                createHomepageFeaturedFieldKey(clientId, field as HomepageFeaturedFieldName),
              createSlideFieldKey: (clientId, field) =>
                createHomepageSlideFieldKey(clientId, field as HomepageSlideFieldName),
              dailyReadingsBackgroundFieldKey: HOMEPAGE_SECTION_FIELD_KEYS.dailyReadingsBackground,
              dailyReadingsSubtitleFieldKey: HOMEPAGE_SECTION_FIELD_KEYS.dailyReadingsSubtitle,
              dailyReadingsTitleFieldKey: HOMEPAGE_SECTION_FIELD_KEYS.dailyReadingsTitle,
              invitationTextFieldKey: HOMEPAGE_HERO_FIELD_KEYS.invitationText,
              liveStreamButtonFieldKey: HOMEPAGE_HERO_FIELD_KEYS.liveStreamButtonTitle,
              newsletterBannerSubtitleFieldKey: HOMEPAGE_SECTION_FIELD_KEYS.newsletterBannerSubtitle,
              newsletterBannerTitleFieldKey: HOMEPAGE_SECTION_FIELD_KEYS.newsletterBannerTitle,
              newsletterSignupButtonTextFieldKey: HOMEPAGE_SECTION_FIELD_KEYS.newsletterSignupButtonText,
              newsletterSignupLinkFieldKey: HOMEPAGE_SECTION_FIELD_KEYS.newsletterSignupLink,
              scheduleTitleFieldKey: HOMEPAGE_SECTION_FIELD_KEYS.scheduleSectionTitle
            }}
            churchDetails={churchDetails}
            homePageData={buildHomepagePreviewData(draft)}
            privacyPolicyUrl={privacyPolicyUrl}
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
