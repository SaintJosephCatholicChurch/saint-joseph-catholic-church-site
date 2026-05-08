import Box from '@mui/material/Box';
import { Editor } from '@tinymce/tinymce-react';
import { useEffect } from 'react';

// TinyMCE so the global var exists
import 'tinymce/tinymce';
// DOM model
import 'tinymce/models/dom/model';
// Theme
import 'tinymce/themes/silver';
// Toolbar icons
import 'tinymce/icons/default';
// Editor styles
import 'tinymce/skins/ui/oxide/skin.min.css';

// importing the plugin js.
// if you use a plugin that is not listed here the editor will fail to load
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/importcss';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/save';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/wordcount';

// importing plugin resources
import 'tinymce/plugins/emoticons/js/emojis';

// importing custom plugins
import './plugins/bible-autolink';
import createCmsFilePlugin from './plugins/cms-file';
import createCmsImagePlugin from './plugins/cms-image';
import './plugins/telephone-autolink';

import type { IAllProps } from '@tinymce/tinymce-react';

interface BundleEditorProps extends Partial<IAllProps> {
  onOpenMediaLibrary: (forImage: boolean) => void;
  theme: 'light' | 'dark';
}

const BUNDLED_CONTENT_CSS = [
  '/vendor/tinymce/skins/content/default/content.min.css',
  '/vendor/tinymce/skins/ui/oxide/content.min.css'
];

function normalizeContentCss(
  contentCss: IAllProps['init'] extends undefined ? never : NonNullable<IAllProps['init']>['content_css']
): string[] {
  if (!contentCss) {
    return [];
  }

  if (contentCss === true) {
    return [];
  }

  return Array.isArray(contentCss)
    ? contentCss.filter((entry): entry is string => typeof entry === 'string')
    : [contentCss];
}

export default function BundledEditor(props: BundleEditorProps) {
  const { init, onOpenMediaLibrary, ...rest } = props;

  useEffect(() => {
    createCmsImagePlugin({ onOpenMediaLibrary });
    createCmsFilePlugin({ onOpenMediaLibrary });
  }, [onOpenMediaLibrary]);

  return (
    <Box
      sx={{
        '.tox-tinymce': {
          borderRadius: 0
        }
      }}
    >
      <Editor
        init={{
          ...init,
          license_key: 'gpl' as never,
          skin: false,
          promotion: false,
          content_css: [...BUNDLED_CONTENT_CSS, ...normalizeContentCss(init?.content_css)],
          content_style: init?.content_style
        }}
        tinymceScriptSrc={[]}
        {...rest}
      />
    </Box>
  );
}
