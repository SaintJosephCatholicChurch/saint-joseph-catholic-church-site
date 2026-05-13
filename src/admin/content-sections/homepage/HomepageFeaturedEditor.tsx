'use client';

import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Fragment, type MouseEvent, useState } from 'react';

import { AdminRepeaterCard, AdminSectionCard } from '../../components/AdminCards';
import { AdminImagePathField } from '../../components/AdminImagePathField';
import { createHomepageFeaturedFieldKey, type HomepageFieldKey } from './fieldKeys';

import type {
  HomepageDraft,
  HomepageFeaturedDraft,
  HomepageFeaturedLinkDraft,
  HomepageFeaturedPageDraft
} from '../../content/writableComplexContent';

const EMPTY_FEATURED_LINK: HomepageFeaturedLinkDraft = {
  image: '',
  summary: '',
  title: '',
  type: 'featured_link',
  url: ''
};

const EMPTY_FEATURED_PAGE: HomepageFeaturedPageDraft = {
  image: '',
  pageSlug: '',
  pageTitle: '',
  summary: '',
  type: 'featured_page'
};

interface HomepageFeaturedEditorProps {
  onChange: (value: HomepageDraft) => void;
  onSelectFeaturedImage: (index: number) => void;
  registerField: (fieldKey: HomepageFieldKey) => (element: HTMLElement | null) => void;
  value: HomepageDraft;
}

export function HomepageFeaturedEditor({
  onChange,
  onSelectFeaturedImage,
  registerField,
  value
}: HomepageFeaturedEditorProps) {
  const [featuredMenuAnchor, setFeaturedMenuAnchor] = useState<HTMLElement | null>(null);
  const isFeaturedMenuOpen = Boolean(featuredMenuAnchor);

  function updateHomepageFeatured(index: number, nextValue: Partial<HomepageFeaturedDraft>) {
    const featured = value.featured.map((item, itemIndex) =>
      itemIndex === index ? ({ ...item, ...nextValue } as HomepageFeaturedDraft) : item
    );
    onChange({ ...value, featured });
  }

  function openFeaturedMenu(event: MouseEvent<HTMLButtonElement>) {
    setFeaturedMenuAnchor(event.currentTarget);
  }

  function closeFeaturedMenu() {
    setFeaturedMenuAnchor(null);
  }

  function addHomepageFeaturedItem(type: HomepageFeaturedDraft['type']) {
    onChange({
      ...value,
      featured: [...value.featured, type === 'featured_page' ? { ...EMPTY_FEATURED_PAGE } : { ...EMPTY_FEATURED_LINK }]
    });
    closeFeaturedMenu();
  }

  return (
    <AdminSectionCard
      title="Featured items"
      headerActions={
        <Fragment>
          <Button
            aria-controls={isFeaturedMenuOpen ? 'homepage-featured-add-menu' : undefined}
            aria-expanded={isFeaturedMenuOpen ? 'true' : undefined}
            aria-haspopup="menu"
            endIcon={<ExpandMoreIcon />}
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={openFeaturedMenu}
          >
            Add featured item
          </Button>
          <Menu
            anchorEl={featuredMenuAnchor}
            id="homepage-featured-add-menu"
            open={isFeaturedMenuOpen}
            onClose={closeFeaturedMenu}
            PaperProps={{
              sx: {
                backgroundColor: '#fffaf4',
                backgroundImage: 'none',
                border: '1px solid rgba(127, 35, 44, 0.12)',
                boxShadow: '0 18px 40px rgba(57, 33, 24, 0.14)',
                opacity: 1
              }
            }}
          >
            <MenuItem onClick={() => addHomepageFeaturedItem('featured_link')}>Featured link</MenuItem>
            <MenuItem onClick={() => addHomepageFeaturedItem('featured_page')}>Featured page</MenuItem>
          </Menu>
        </Fragment>
      }
    >
      <Stack spacing={2}>
        {value.featured.map((item, index) => (
          <AdminRepeaterCard
            key={`homepage-featured-${index}`}
            title={`Featured ${index + 1}: ${item.type === 'featured_page' ? 'Page' : 'Link'}`}
          >
            {item.type === 'featured_page' ? (
              <Stack spacing={2}>
                <TextField
                  label="Page slug"
                  inputRef={registerField(createHomepageFeaturedFieldKey(index, 'pageSlug'))}
                  value={item.pageSlug}
                  onChange={(event) => updateHomepageFeatured(index, { pageSlug: event.target.value })}
                  fullWidth
                />
                <TextField
                  label="Page title"
                  helperText="Optional title paired with the page slug for this featured item."
                  inputRef={registerField(createHomepageFeaturedFieldKey(index, 'pageTitle'))}
                  value={item.pageTitle}
                  onChange={(event) => updateHomepageFeatured(index, { pageTitle: event.target.value })}
                  fullWidth
                />
                <AdminImagePathField
                  actionButtonRef={registerField(createHomepageFeaturedFieldKey(index, 'image'))}
                  onSelectImage={() => onSelectFeaturedImage(index)}
                  previewAlt={item.pageTitle || `Featured page ${index + 1}`}
                  value={item.image}
                />
                <TextField
                  label="Summary"
                  inputRef={registerField(createHomepageFeaturedFieldKey(index, 'summary'))}
                  value={item.summary}
                  onChange={(event) => updateHomepageFeatured(index, { summary: event.target.value })}
                  fullWidth
                  multiline
                  minRows={3}
                />
              </Stack>
            ) : (
              <Stack spacing={2}>
                <TextField
                  label="Title"
                  inputRef={registerField(createHomepageFeaturedFieldKey(index, 'title'))}
                  value={item.title}
                  onChange={(event) => updateHomepageFeatured(index, { title: event.target.value })}
                  fullWidth
                />
                <TextField
                  label="URL"
                  inputRef={registerField(createHomepageFeaturedFieldKey(index, 'url'))}
                  value={item.url}
                  onChange={(event) => updateHomepageFeatured(index, { url: event.target.value })}
                  fullWidth
                />
                <AdminImagePathField
                  actionButtonRef={registerField(createHomepageFeaturedFieldKey(index, 'image'))}
                  onSelectImage={() => onSelectFeaturedImage(index)}
                  previewAlt={item.title || `Featured link ${index + 1}`}
                  value={item.image}
                />
                <TextField
                  label="Summary"
                  inputRef={registerField(createHomepageFeaturedFieldKey(index, 'summary'))}
                  value={item.summary}
                  onChange={(event) => updateHomepageFeatured(index, { summary: event.target.value })}
                  fullWidth
                  multiline
                  minRows={3}
                />
              </Stack>
            )}
            <Button
              variant="outlined"
              color="inherit"
              onClick={() =>
                onChange({ ...value, featured: value.featured.filter((_, itemIndex) => itemIndex !== index) })
              }
            >
              Remove featured item
            </Button>
          </AdminRepeaterCard>
        ))}
      </Stack>
    </AdminSectionCard>
  );
}
