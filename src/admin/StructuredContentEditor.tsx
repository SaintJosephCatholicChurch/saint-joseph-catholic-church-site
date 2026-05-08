'use client';

import AddIcon from '@mui/icons-material/Add';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';

import { AdminRepeaterCard, AdminSectionCard } from './components/AdminCards';
import { AdminPagePreviewFrame } from './AdminPagePreviewFrame';
import { AdminImagePathField } from './AdminImagePathField';
import { AdminMediaLibrary } from './AdminMediaLibrary';
import Navigation from '../components/navigation/Navigation';
import {
  createStructuredDraft,
  loadStructuredContent,
  STRUCTURED_WRITABLE_SECTIONS,
  saveStructuredSection,
  type MenuDraft,
  type MenuItemDraft,
  type MenuLinkDraft,
  type StructuredSectionId,
  type StructuredContent,
  type StructuredDraft
} from './content/writableStructuredContent';

import type { ChurchDetails, MenuData } from '../interface';
import type { AdminRepoClient } from './services/adminTypes';

interface StructuredContentEditorProps {
  onSaved: () => Promise<void>;
  repoClient: AdminRepoClient;
  showIntroAlert?: boolean;
  visibleSections?: StructuredSectionId[];
}

interface StructuredEditorState {
  content: StructuredContent | null;
  draft: StructuredDraft | null;
  error: string | null;
  saveError: string | null;
  saveMessage: string | null;
  saveSectionId: StructuredSectionId | null;
  saveStatus: 'error' | 'idle' | 'saving' | 'success';
  status: 'error' | 'idle' | 'loading' | 'success';
}

const INITIAL_EDITOR_STATE: StructuredEditorState = {
  content: null,
  draft: null,
  error: null,
  saveError: null,
  saveMessage: null,
  saveSectionId: null,
  saveStatus: 'idle',
  status: 'idle'
};

function createEmptyMenuLink(): MenuLinkDraft {
  return {
    page: '',
    title: '',
    url: ''
  };
}

function createEmptyMenuItem(): MenuItemDraft {
  return {
    page: '',
    title: '',
    url: '',
    menuLinks: []
  };
}

function buildErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'The structured content editor failed to load.';
}

function getSectionLabel(sectionId: StructuredSectionId) {
  return STRUCTURED_WRITABLE_SECTIONS.find((section) => section.id === sectionId)?.label || sectionId;
}

function moveArrayItem<TValue>(items: TValue[], fromIndex: number, toIndex: number) {
  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}

function buildMenuPreviewData(menu: MenuDraft): MenuData {
  return {
    logo: {
      primary: menu.logoPrimary || 'St. Joseph',
      secondary: menu.logoSecondary || 'Catholic Church'
    },
    menu_items: menu.menuItems.map((item: MenuItemDraft) => ({
      menu_links: item.menuLinks.map((link: MenuLinkDraft) => ({
        page: link.page.trim() || undefined,
        title: link.title.trim(),
        url: link.url.trim() || undefined
      })),
      page: item.page.trim() || undefined,
      title: item.title.trim() || 'Untitled',
      url: item.url.trim() || undefined
    })),
    online_giving_button_text: menu.onlineGivingButtonText || 'Give'
  };
}

function buildChurchDetailsPreviewData(draft: StructuredDraft['churchDetails']): ChurchDetails {
  return {
    address: draft.address,
    city: draft.city,
    email: draft.email,
    facebook_page: draft.facebookPage,
    google_map_location: draft.googleMapLocation,
    mission_statement: draft.missionStatement,
    name: draft.name,
    online_giving_url: draft.onlineGivingUrl,
    phone: draft.phone,
    state: draft.state,
    vision_statement: draft.visionStatement,
    zipcode: draft.zipcode
  };
}

function MenuNavigationPreview({ churchDetails, menu }: { churchDetails: ChurchDetails; menu: MenuDraft }) {
  const menuDetails = buildMenuPreviewData(menu);

  return (
    <AdminPagePreviewFrame framePadding="0">
      <Box
        id="drawer-container"
        sx={{
          background: 'linear-gradient(180deg, #f8f1e8 0%, #ffffff 100%)',
          container: 'page / inline-size',
          display: 'flex',
          flexDirection: 'column',
          minHeight: { md: 360, xs: 'max(24rem, calc(100dvh - 18rem))' },
          overflow: 'hidden',
          position: 'relative',
          width: '100%'
        }}
      >
        <Navigation churchDetails={churchDetails} menuDetails={menuDetails} inCMS />
      </Box>
    </AdminPagePreviewFrame>
  );
}

export function StructuredContentEditor({
  onSaved,
  repoClient,
  showIntroAlert = true,
  visibleSections
}: StructuredContentEditorProps) {
  const theme = useTheme();
  const isMobileMenuLayout = useMediaQuery(theme.breakpoints.down('md'));
  const [editorState, setEditorState] = useState<StructuredEditorState>(INITIAL_EDITOR_STATE);
  const [imagePickerTarget, setImagePickerTarget] = useState<'footer-background' | 'site-image' | null>(null);
  const [menuPanel, setMenuPanel] = useState<'editor' | 'preview'>('editor');
  const visibleSectionIds = useMemo(
    () => visibleSections || STRUCTURED_WRITABLE_SECTIONS.map((section) => section.id),
    [visibleSections]
  );
  const visibleSectionIdsKey = visibleSectionIds.join('|');

  useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      const requestedSectionIds = visibleSectionIdsKey
        ? (visibleSectionIdsKey.split('|') as StructuredSectionId[])
        : [];

      setEditorState((currentState) => ({
        ...currentState,
        error: null,
        status: 'loading'
      }));

      try {
        const content = await loadStructuredContent(repoClient, requestedSectionIds);

        if (cancelled) {
          return;
        }

        setEditorState((currentState) => ({
          ...currentState,
          content,
          draft: createStructuredDraft(content),
          error: null,
          status: 'success'
        }));
      } catch (error) {
        if (cancelled) {
          return;
        }

        setEditorState((currentState) => ({
          ...currentState,
          error: buildErrorMessage(error),
          status: 'error'
        }));
      }
    }

    void loadContent();

    return () => {
      cancelled = true;
    };
  }, [repoClient, visibleSectionIdsKey]);

  function updateDraft(sectionId: StructuredSectionId, value: StructuredDraft[StructuredSectionId]) {
    setEditorState((currentState) => {
      if (!currentState.draft) {
        return currentState;
      }

      return {
        ...currentState,
        draft: {
          ...currentState.draft,
          [sectionId]: value
        },
        saveError: null,
        saveMessage: null,
        saveSectionId: sectionId,
        saveStatus: 'idle'
      };
    });
  }

  async function handleSave(sectionId: StructuredSectionId) {
    if (!editorState.content || !editorState.draft) {
      return;
    }

    setEditorState((currentState) => ({
      ...currentState,
      saveError: null,
      saveMessage: null,
      saveSectionId: sectionId,
      saveStatus: 'saving'
    }));

    try {
      const content = await saveStructuredSection(repoClient, {
        content: editorState.content,
        draft: editorState.draft,
        sectionId
      });

      setEditorState((currentState) => ({
        ...currentState,
        content,
        draft: createStructuredDraft(content),
        saveError: null,
        saveMessage: `${getSectionLabel(sectionId)} saved.`,
        saveSectionId: sectionId,
        saveStatus: 'success',
        status: 'success'
      }));

      try {
        await onSaved();
      } catch (error) {
        setEditorState((currentState) => ({
          ...currentState,
          saveError: `Saved ${getSectionLabel(sectionId)}, but the summary did not refresh: ${buildErrorMessage(error)}`,
          saveSectionId: sectionId,
          saveStatus: 'error'
        }));
      }
    } catch (error) {
      setEditorState((currentState) => ({
        ...currentState,
        saveError: buildErrorMessage(error),
        saveSectionId: sectionId,
        saveStatus: 'error'
      }));
    }
  }

  if (editorState.status === 'loading' && !editorState.content) {
    return (
      <Stack spacing={2}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 700 }}>
          Loading editable structured content
        </Typography>
        <LinearProgress />
      </Stack>
    );
  }

  if (!editorState.content || !editorState.draft) {
    return editorState.error ? <Alert severity="error">{editorState.error}</Alert> : null;
  }

  const pristineDraft = createStructuredDraft(editorState.content);
  const isSaving = editorState.saveStatus === 'saving';
  const isDirty = (sectionId: StructuredSectionId) =>
    JSON.stringify(editorState.draft?.[sectionId]) !== JSON.stringify(pristineDraft[sectionId]);
  const resetSection = (sectionId: StructuredSectionId) => updateDraft(sectionId, pristineDraft[sectionId]);
  const shouldRenderSection = (sectionId: StructuredSectionId) => visibleSectionIds.includes(sectionId);
  const menuDraft: MenuDraft = editorState.draft.menu;

  function updateMenu(nextMenu: MenuDraft) {
    updateDraft('menu', nextMenu);
  }

  function updateMenuItem(index: number, nextValue: Partial<MenuItemDraft>) {
    const menuItems: MenuItemDraft[] = menuDraft.menuItems.map((item: MenuItemDraft, itemIndex: number) =>
      itemIndex === index ? { ...item, ...nextValue } : item
    );

    updateMenu({
      ...menuDraft,
      menuItems
    });
  }

  function removeMenuItem(index: number) {
    updateMenu({
      ...menuDraft,
      menuItems: menuDraft.menuItems.filter((_: MenuItemDraft, itemIndex: number) => itemIndex !== index)
    });
  }

  function moveMenuItem(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= menuDraft.menuItems.length) {
      return;
    }

    updateMenu({
      ...menuDraft,
      menuItems: moveArrayItem<MenuItemDraft>(menuDraft.menuItems, index, nextIndex)
    });
  }

  function addMenuItem() {
    updateMenu({
      ...menuDraft,
      menuItems: [...menuDraft.menuItems, createEmptyMenuItem()]
    });
  }

  function updateMenuLink(itemIndex: number, linkIndex: number, nextValue: Partial<MenuLinkDraft>) {
    const menuItems: MenuItemDraft[] = menuDraft.menuItems.map((item: MenuItemDraft, currentItemIndex: number) => {
      if (currentItemIndex !== itemIndex) {
        return item;
      }

      return {
        ...item,
        menuLinks: item.menuLinks.map((link: MenuLinkDraft, currentLinkIndex: number) =>
          currentLinkIndex === linkIndex ? { ...link, ...nextValue } : link
        )
      };
    });

    updateMenu({
      ...menuDraft,
      menuItems
    });
  }

  function addMenuLink(itemIndex: number) {
    const menuItems: MenuItemDraft[] = menuDraft.menuItems.map((item: MenuItemDraft, currentItemIndex: number) =>
      currentItemIndex === itemIndex ? { ...item, menuLinks: [...item.menuLinks, createEmptyMenuLink()] } : item
    );

    updateMenu({
      ...menuDraft,
      menuItems
    });
  }

  function removeMenuLink(itemIndex: number, linkIndex: number) {
    const menuItems: MenuItemDraft[] = menuDraft.menuItems.map((item: MenuItemDraft, currentItemIndex: number) =>
      currentItemIndex === itemIndex
        ? {
            ...item,
            menuLinks: item.menuLinks.filter(
              (_: MenuLinkDraft, currentLinkIndex: number) => currentLinkIndex !== linkIndex
            )
          }
        : item
    );

    updateMenu({
      ...menuDraft,
      menuItems
    });
  }

  function moveMenuLink(itemIndex: number, linkIndex: number, direction: -1 | 1) {
    const item: MenuItemDraft | undefined = menuDraft.menuItems[itemIndex];
    const nextIndex = linkIndex + direction;

    if (!item || nextIndex < 0 || nextIndex >= item.menuLinks.length) {
      return;
    }

    const menuItems: MenuItemDraft[] = menuDraft.menuItems.map(
      (currentItem: MenuItemDraft, currentItemIndex: number) =>
        currentItemIndex === itemIndex
          ? { ...currentItem, menuLinks: moveArrayItem<MenuLinkDraft>(currentItem.menuLinks, linkIndex, nextIndex) }
          : currentItem
    );

    updateMenu({
      ...menuDraft,
      menuItems
    });
  }

  function renderSectionHeaderActions(sectionId: StructuredSectionId, _saveLabel: string) {
    const sectionIsDirty = isDirty(sectionId);
    const sectionIsSaving = editorState.saveSectionId === sectionId && isSaving;

    return (
      <>
        <IconButton
          aria-label="Reset"
          title="Reset"
          onClick={() => resetSection(sectionId)}
          disabled={!sectionIsDirty || sectionIsSaving}
          size="small"
        >
          <RestartAltIcon fontSize="small" />
        </IconButton>
        <Button
          variant="contained"
          onClick={() => void handleSave(sectionId)}
          disabled={!sectionIsDirty || sectionIsSaving}
        >
          Save
        </Button>
      </>
    );
  }

  return (
    <Stack spacing={2} sx={{ minWidth: 0, width: '100%' }}>
      {showIntroAlert ? (
        <Alert severity="info">
          These low-risk JSON-backed sections now edit and save directly through the live site-owned admin route.
        </Alert>
      ) : null}
      {editorState.saveMessage ? <Alert severity="success">{editorState.saveMessage}</Alert> : null}
      {editorState.saveError ? <Alert severity="error">{editorState.saveError}</Alert> : null}
      {editorState.status === 'loading' ? <LinearProgress /> : null}

      {shouldRenderSection('churchDetails') ? (
        <AdminSectionCard
          title="Church Details"
          headerActions={renderSectionHeaderActions('churchDetails', 'Save church details')}
        >
          <Stack spacing={2}>
            <Stack direction={{ md: 'row', xs: 'column' }} spacing={2}>
              <TextField
                label="Church name"
                value={editorState.draft.churchDetails.name}
                onChange={(event) =>
                  updateDraft('churchDetails', {
                    ...editorState.draft.churchDetails,
                    name: event.target.value
                  })
                }
                fullWidth
              />
              <TextField
                label="Main email"
                value={editorState.draft.churchDetails.email}
                onChange={(event) =>
                  updateDraft('churchDetails', {
                    ...editorState.draft.churchDetails,
                    email: event.target.value
                  })
                }
                fullWidth
              />
            </Stack>
            <Stack direction={{ md: 'row', xs: 'column' }} spacing={2}>
              <TextField
                label="Main phone"
                value={editorState.draft.churchDetails.phone}
                onChange={(event) =>
                  updateDraft('churchDetails', {
                    ...editorState.draft.churchDetails,
                    phone: event.target.value
                  })
                }
                fullWidth
              />
              <TextField
                label="Online giving URL"
                value={editorState.draft.churchDetails.onlineGivingUrl}
                onChange={(event) =>
                  updateDraft('churchDetails', {
                    ...editorState.draft.churchDetails,
                    onlineGivingUrl: event.target.value
                  })
                }
                fullWidth
              />
            </Stack>
            <Stack direction={{ md: 'row', xs: 'column' }} spacing={2}>
              <TextField
                label="Address"
                value={editorState.draft.churchDetails.address}
                onChange={(event) =>
                  updateDraft('churchDetails', {
                    ...editorState.draft.churchDetails,
                    address: event.target.value
                  })
                }
                fullWidth
              />
              <TextField
                label="City"
                value={editorState.draft.churchDetails.city}
                onChange={(event) =>
                  updateDraft('churchDetails', {
                    ...editorState.draft.churchDetails,
                    city: event.target.value
                  })
                }
                fullWidth
              />
            </Stack>
            <Stack direction={{ md: 'row', xs: 'column' }} spacing={2}>
              <TextField
                label="State"
                value={editorState.draft.churchDetails.state}
                onChange={(event) =>
                  updateDraft('churchDetails', {
                    ...editorState.draft.churchDetails,
                    state: event.target.value
                  })
                }
                fullWidth
              />
              <TextField
                label="Zip code"
                value={editorState.draft.churchDetails.zipcode}
                onChange={(event) =>
                  updateDraft('churchDetails', {
                    ...editorState.draft.churchDetails,
                    zipcode: event.target.value
                  })
                }
                fullWidth
              />
            </Stack>
            <TextField
              label="Facebook page"
              value={editorState.draft.churchDetails.facebookPage}
              onChange={(event) =>
                updateDraft('churchDetails', {
                  ...editorState.draft.churchDetails,
                  facebookPage: event.target.value
                })
              }
              fullWidth
            />
            <TextField
              label="Google map URL"
              value={editorState.draft.churchDetails.googleMapLocation}
              onChange={(event) =>
                updateDraft('churchDetails', {
                  ...editorState.draft.churchDetails,
                  googleMapLocation: event.target.value
                })
              }
              fullWidth
            />
            <TextField
              label="Mission statement"
              value={editorState.draft.churchDetails.missionStatement}
              onChange={(event) =>
                updateDraft('churchDetails', {
                  ...editorState.draft.churchDetails,
                  missionStatement: event.target.value
                })
              }
              fullWidth
              multiline
              minRows={3}
            />
            <TextField
              label="Vision statement"
              value={editorState.draft.churchDetails.visionStatement}
              onChange={(event) =>
                updateDraft('churchDetails', {
                  ...editorState.draft.churchDetails,
                  visionStatement: event.target.value
                })
              }
              fullWidth
              multiline
              minRows={3}
            />
            <TextField
              label="Contacts"
              helperText="One per line: Name | Title"
              value={editorState.draft.churchDetails.contacts}
              onChange={(event) =>
                updateDraft('churchDetails', {
                  ...editorState.draft.churchDetails,
                  contacts: event.target.value
                })
              }
              fullWidth
              multiline
              minRows={4}
            />
            <Stack direction={{ md: 'row', xs: 'column' }} spacing={2}>
              <TextField
                label="Additional emails"
                helperText="One per line: Name | Email"
                value={editorState.draft.churchDetails.additionalEmails}
                onChange={(event) =>
                  updateDraft('churchDetails', {
                    ...editorState.draft.churchDetails,
                    additionalEmails: event.target.value
                  })
                }
                fullWidth
                multiline
                minRows={4}
              />
              <TextField
                label="Additional phones"
                helperText="One per line: Name | Phone"
                value={editorState.draft.churchDetails.additionalPhones}
                onChange={(event) =>
                  updateDraft('churchDetails', {
                    ...editorState.draft.churchDetails,
                    additionalPhones: event.target.value
                  })
                }
                fullWidth
                multiline
                minRows={4}
              />
            </Stack>
          </Stack>
        </AdminSectionCard>
      ) : null}

      {shouldRenderSection('siteConfig') ? (
        <AdminSectionCard
          title="Site Config"
          headerActions={renderSectionHeaderActions('siteConfig', 'Save site config')}
        >
          <Stack spacing={2}>
            <TextField
              label="Site title"
              value={editorState.draft.siteConfig.siteTitle}
              onChange={(event) =>
                updateDraft('siteConfig', {
                  ...editorState.draft.siteConfig,
                  siteTitle: event.target.value
                })
              }
              fullWidth
            />
            <TextField
              label="Site description"
              value={editorState.draft.siteConfig.siteDescription}
              onChange={(event) =>
                updateDraft('siteConfig', {
                  ...editorState.draft.siteConfig,
                  siteDescription: event.target.value
                })
              }
              fullWidth
              multiline
              minRows={3}
            />
            <Stack direction={{ md: 'row', xs: 'column' }} spacing={2}>
              <TextField
                label="Base URL"
                value={editorState.draft.siteConfig.baseUrl}
                onChange={(event) =>
                  updateDraft('siteConfig', {
                    ...editorState.draft.siteConfig,
                    baseUrl: event.target.value
                  })
                }
                fullWidth
              />
              <TextField
                label="Privacy policy URL"
                value={editorState.draft.siteConfig.privacyPolicyUrl}
                onChange={(event) =>
                  updateDraft('siteConfig', {
                    ...editorState.draft.siteConfig,
                    privacyPolicyUrl: event.target.value
                  })
                }
                fullWidth
              />
            </Stack>
            <Stack direction={{ md: 'row', xs: 'column' }} spacing={2}>
              <AdminImagePathField
                onSelectImage={() => setImagePickerTarget('site-image')}
                previewAlt={editorState.draft.siteConfig.siteTitle || 'Site image preview'}
                value={editorState.draft.siteConfig.siteImage}
              />
              <TextField
                label="Posts per page"
                value={editorState.draft.siteConfig.postsPerPage}
                onChange={(event) =>
                  updateDraft('siteConfig', {
                    ...editorState.draft.siteConfig,
                    postsPerPage: event.target.value
                  })
                }
                fullWidth
              />
            </Stack>
            <TextField
              label="Site keywords"
              helperText="Separate keywords with commas or line breaks."
              value={editorState.draft.siteConfig.siteKeywords}
              onChange={(event) =>
                updateDraft('siteConfig', {
                  ...editorState.draft.siteConfig,
                  siteKeywords: event.target.value
                })
              }
              fullWidth
              multiline
              minRows={3}
            />
          </Stack>
        </AdminSectionCard>
      ) : null}

      {shouldRenderSection('menu') ? (
        <Stack spacing={2} sx={{ minWidth: 0, width: '100%' }}>
          {isMobileMenuLayout ? (
            <Tabs
              value={menuPanel}
              onChange={(_, nextPanel: 'editor' | 'preview') => setMenuPanel(nextPanel)}
              variant="fullWidth"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.72)',
                border: '1px solid rgba(127, 35, 44, 0.12)',
                borderRadius: '4px',
                minHeight: 0
              }}
            >
              <Tab label="Editor" value="editor" />
              <Tab label="Preview" value="preview" />
            </Tabs>
          ) : null}

          {!isMobileMenuLayout || menuPanel === 'editor' ? (
            <AdminSectionCard
              title="Menu And Logo"
              headerActions={renderSectionHeaderActions('menu', 'Save menu and logo')}
            >
              <Stack spacing={2} sx={{ minWidth: 0 }}>
                <Stack spacing={2} sx={{ minWidth: 0 }}>
                  <Stack direction={{ md: 'row', xs: 'column' }} spacing={2}>
                    <TextField
                      label="Logo primary text"
                      value={menuDraft.logoPrimary}
                      onChange={(event) =>
                        updateMenu({
                          ...menuDraft,
                          logoPrimary: event.target.value
                        })
                      }
                      fullWidth
                    />
                    <TextField
                      label="Logo secondary text"
                      value={menuDraft.logoSecondary}
                      onChange={(event) =>
                        updateMenu({
                          ...menuDraft,
                          logoSecondary: event.target.value
                        })
                      }
                      fullWidth
                    />
                  </Stack>
                  <TextField
                    label="Online giving button text"
                    value={menuDraft.onlineGivingButtonText}
                    onChange={(event) =>
                      updateMenu({
                        ...menuDraft,
                        onlineGivingButtonText: event.target.value
                      })
                    }
                    fullWidth
                  />
                  <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1.5} justifyContent="space-between">
                    <div>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Menu items
                      </Typography>
                      <Typography sx={{ color: '#616169', lineHeight: 1.6, mt: 0.5 }}>
                        Add, remove, and reorder top-level items and dropdown links without editing JSON.
                      </Typography>
                    </div>
                    <Button onClick={addMenuItem} startIcon={<AddIcon />} variant="outlined">
                      Add menu item
                    </Button>
                  </Stack>
                  <Stack spacing={2}>
                    {menuDraft.menuItems.length ? (
                      menuDraft.menuItems.map((item, index) => (
                        <AdminRepeaterCard
                          key={`menu-item-${index}`}
                          title={`Menu item ${index + 1}`}
                          actions={
                            <Stack direction="row" spacing={0.5}>
                              <IconButton
                                aria-label={`Move menu item ${index + 1} up`}
                                disabled={index === 0}
                                onClick={() => moveMenuItem(index, -1)}
                                size="small"
                              >
                                <ArrowUpwardIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                aria-label={`Move menu item ${index + 1} down`}
                                disabled={index === menuDraft.menuItems.length - 1}
                                onClick={() => moveMenuItem(index, 1)}
                                size="small"
                              >
                                <ArrowDownwardIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                aria-label={`Delete menu item ${index + 1}`}
                                onClick={() => removeMenuItem(index)}
                                size="small"
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          }
                        >
                          <Stack direction={{ md: 'row', xs: 'column' }} spacing={2}>
                            <TextField
                              label="Title"
                              value={item.title}
                              onChange={(event) => updateMenuItem(index, { title: event.target.value })}
                              fullWidth
                            />
                            <TextField
                              label="URL"
                              helperText="Optional. If both URL and page are set, URL wins."
                              value={item.url}
                              onChange={(event) => updateMenuItem(index, { url: event.target.value })}
                              fullWidth
                            />
                            <TextField
                              label="Page slug"
                              helperText="Optional. Use a site page slug without a leading slash."
                              value={item.page}
                              onChange={(event) => updateMenuItem(index, { page: event.target.value })}
                              fullWidth
                            />
                          </Stack>
                          <Stack spacing={1.5}>
                            <Stack direction={{ sm: 'row', xs: 'column' }} spacing={1.5} justifyContent="space-between">
                              <div>
                                <Typography sx={{ fontWeight: 700 }}>Submenu links</Typography>
                                <Typography sx={{ color: '#616169', lineHeight: 1.6, mt: 0.5 }}>
                                  Leave this empty for a standard top-level link.
                                </Typography>
                              </div>
                              <Button color="inherit" onClick={() => addMenuLink(index)} variant="outlined">
                                Add submenu link
                              </Button>
                            </Stack>
                            {item.menuLinks.length ? (
                              <Stack spacing={1.5}>
                                {item.menuLinks.map((link, linkIndex) => (
                                  <AdminRepeaterCard
                                    key={`menu-item-${index}-submenu-${linkIndex}`}
                                    title={`Submenu link ${linkIndex + 1}`}
                                    actions={
                                      <Stack direction="row" spacing={0.5}>
                                        <IconButton
                                          aria-label={`Move submenu link ${linkIndex + 1} up`}
                                          disabled={linkIndex === 0}
                                          onClick={() => moveMenuLink(index, linkIndex, -1)}
                                          size="small"
                                        >
                                          <ArrowUpwardIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                          aria-label={`Move submenu link ${linkIndex + 1} down`}
                                          disabled={linkIndex === item.menuLinks.length - 1}
                                          onClick={() => moveMenuLink(index, linkIndex, 1)}
                                          size="small"
                                        >
                                          <ArrowDownwardIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                          aria-label={`Delete submenu link ${linkIndex + 1}`}
                                          onClick={() => removeMenuLink(index, linkIndex)}
                                          size="small"
                                        >
                                          <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                      </Stack>
                                    }
                                  >
                                    <Stack direction={{ md: 'row', xs: 'column' }} spacing={2}>
                                      <TextField
                                        label="Title"
                                        value={link.title}
                                        onChange={(event) =>
                                          updateMenuLink(index, linkIndex, { title: event.target.value })
                                        }
                                        fullWidth
                                      />
                                      <TextField
                                        label="URL"
                                        helperText="Optional. If both URL and page are set, URL wins."
                                        value={link.url}
                                        onChange={(event) =>
                                          updateMenuLink(index, linkIndex, { url: event.target.value })
                                        }
                                        fullWidth
                                      />
                                      <TextField
                                        label="Page slug"
                                        helperText="Optional. Use a site page slug without a leading slash."
                                        value={link.page}
                                        onChange={(event) =>
                                          updateMenuLink(index, linkIndex, { page: event.target.value })
                                        }
                                        fullWidth
                                      />
                                    </Stack>
                                  </AdminRepeaterCard>
                                ))}
                              </Stack>
                            ) : (
                              <Alert severity="info">No submenu links yet.</Alert>
                            )}
                          </Stack>
                        </AdminRepeaterCard>
                      ))
                    ) : (
                      <Alert severity="info">No menu items yet. Add your first top-level navigation item.</Alert>
                    )}
                  </Stack>
                </Stack>
              </Stack>
            </AdminSectionCard>
          ) : null}

          {!isMobileMenuLayout || menuPanel === 'preview' ? (
            <AdminSectionCard title="Menu Preview" headerActions={null}>
              <MenuNavigationPreview
                churchDetails={buildChurchDetailsPreviewData(editorState.draft.churchDetails)}
                menu={menuDraft}
              />
            </AdminSectionCard>
          ) : null}
        </Stack>
      ) : null}

      {shouldRenderSection('tags') ? (
        <AdminSectionCard
          title="Tags"
          description="Shared taxonomy terms from content/meta/tags.json. Enter one tag per line or separate them with commas."
          headerActions={renderSectionHeaderActions('tags', 'Save tags')}
        >
          <TextField
            label="Tags"
            helperText="Separate tags with commas or line breaks."
            value={editorState.draft.tags.tags}
            onChange={(event) =>
              updateDraft('tags', {
                tags: event.target.value
              })
            }
            fullWidth
            multiline
            minRows={4}
          />
        </AdminSectionCard>
      ) : null}

      {shouldRenderSection('styles') ? (
        <AdminSectionCard title="Styles" headerActions={renderSectionHeaderActions('styles', 'Save styles')}>
          <AdminImagePathField
            buttonLabel="Select footer background"
            onSelectImage={() => setImagePickerTarget('footer-background')}
            previewAlt="Footer background preview"
            value={editorState.draft.styles.footerBackground}
          />
        </AdminSectionCard>
      ) : null}

      <Dialog fullWidth maxWidth="lg" onClose={() => setImagePickerTarget(null)} open={Boolean(imagePickerTarget)}>
        <DialogTitle>
          {imagePickerTarget === 'footer-background' ? 'Select footer background' : 'Select image'}
        </DialogTitle>
        <DialogContent dividers>
          <AdminMediaLibrary
            allowedFolderIds={['shared']}
            onChange={onSaved}
            onSelectAsset={(asset) => {
              if (imagePickerTarget === 'footer-background') {
                updateDraft('styles', {
                  footerBackground: asset.publicPath
                });
              } else {
                updateDraft('siteConfig', {
                  ...editorState.draft.siteConfig,
                  siteImage: asset.publicPath
                });
              }

              setImagePickerTarget(null);
            }}
            repoClient={repoClient}
            selectionFilter="images"
            selectionLabel="Use selected image"
            title="Select image"
          />
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
