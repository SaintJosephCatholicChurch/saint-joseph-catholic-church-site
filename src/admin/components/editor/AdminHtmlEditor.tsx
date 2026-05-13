'use client';

import { styled } from '@mui/material/styles';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { createMediaInsertionMarkup, type MediaAsset } from '../../content/writableBulletinsMediaContent';
import BundledEditor from './BundledEditor';
import { fromEditorToStorage } from './htmlTransforms';

import type { Editor as TinyMCEEditor } from 'tinymce/tinymce';

const StyledEditorRoot = styled('div')`
  width: 100%;

  & > div {
    min-height: 420px;
  }

  & .tox-tinymce {
    border: 1px solid rgba(127, 35, 44, 0.14);
    border-radius: 22px;
    box-shadow: 0 18px 40px rgba(57, 33, 24, 0.08);
    overflow: hidden;
  }

  & .tox .tox-editor-header {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 241, 232, 0.96));
    border-bottom: 1px solid rgba(127, 35, 44, 0.12);
  }

  & .tox .tox-statusbar {
    border-top: 1px solid rgba(127, 35, 44, 0.08);
    background: rgba(248, 241, 232, 0.86);
  }
`;

interface AdminHtmlEditorProps {
  assetToInsert?: MediaAsset | null;
  onAssetInserted?: () => void;
  value: string;
  onChange: (value: string) => void;
  onOpenMediaLibrary?: (forImage: boolean) => void;
}

export function AdminHtmlEditor({
  assetToInsert,
  onAssetInserted,
  value,
  onChange,
  onOpenMediaLibrary
}: AdminHtmlEditorProps) {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const selectionBookmarkRef = useRef<unknown>(null);

  useEffect(() => {
    if (!assetToInsert || !editorRef.current) {
      return;
    }

    editorRef.current.focus();

    if (selectionBookmarkRef.current) {
      try {
        editorRef.current.selection.moveToBookmark(selectionBookmarkRef.current as never);
      } catch {
        selectionBookmarkRef.current = null;
      }
    }

    editorRef.current.selection.setContent(createMediaInsertionMarkup(assetToInsert));
    selectionBookmarkRef.current = null;
    onChange(fromEditorToStorage(editorRef.current.getContent()));
    onAssetInserted?.();
  }, [assetToInsert, onAssetInserted, onChange]);

  const handleOpenMediaLibrary = useCallback(
    (forImage: boolean) => {
      if (!editorRef.current) {
        onOpenMediaLibrary?.(forImage);
        return;
      }

      selectionBookmarkRef.current = editorRef.current.selection.getBookmark(2, true);
      onOpenMediaLibrary?.(forImage);
    },
    [onOpenMediaLibrary]
  );

  const editor = useMemo(
    () => (
      <StyledEditorRoot>
        <BundledEditor
          theme="light"
          value={value}
          onOpenMediaLibrary={handleOpenMediaLibrary}
          onInit={(_event, editorInstance) => {
            editorRef.current = editorInstance;
          }}
          onEditorChange={(nextValue) => {
            onChange(fromEditorToStorage(nextValue));
          }}
          init={{
            menubar: 'edit insert view format table tools help',
            menu: {
              edit: { title: 'Edit', items: 'undo redo | cut copy paste | selectall | searchreplace' },
              view: { title: 'View', items: 'code | visualaid visualchars visualblocks | spellchecker | fullscreen' },
              insert: {
                title: 'Insert',
                items: 'link media inserttable | charmap emoticons hr | pagebreak nonbreaking anchor | insertdatetime'
              },
              format: {
                title: 'Format',
                items: 'bold italic underline strikethrough superscript subscript | forecolor | align | removeformat'
              },
              tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | code wordcount' },
              table: { title: 'Table', items: 'inserttable | cell row column | tableprops deletetable' }
            },
            plugins: [
              'advlist',
              'anchor',
              'autolink',
              'bible-autolink',
              'charmap',
              'code',
              'emoticons',
              'fullscreen',
              'insertdatetime',
              'link',
              'lists',
              'media',
              'preview',
              'quickbars',
              'searchreplace',
              'table',
              'telephone-autolink',
              'visualblocks',
              'wordcount'
            ],
            toolbar:
              'blocks | bold italic forecolor | alignnone alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | admin-insert-image admin-insert-file | removeformat | code',
            body_class: 'content editor',
            content_css: ['/styles/global.css', '/styles/content.module.css'],
            content_style: `
              html {
                background-color: transparent;
              }

              body.mce-content-body {
                background: #fffdf9;
                color: #222222;
                caret-color: #222222;
              }

              body.mce-content-body,
              body.mce-content-body p,
              body.mce-content-body div,
              body.mce-content-body li,
              body.mce-content-body td,
              body.mce-content-body th {
                color: #222222;
              }

              body.mce-content-body img,
              body.mce-content-body video,
              body.mce-content-body iframe,
              body.mce-content-body .mce-preview-object {
                pointer-events: none;
              }
            `,
            resize: false,
            height: 720,
            elementpath: false,
            branding: false,
            invalid_styles: 'width height',
            quickbars_selection_toolbar: 'bold italic | blocks | quicklink blockquote | bullist numlist',
            quickbars_insert_toolbar: 'admin-insert-image admin-insert-file quicktable',
            setup: (editorInstance) => {
              editorInstance.ui.registry.addButton('admin-insert-image', {
                onAction: () => handleOpenMediaLibrary(true),
                text: 'Image'
              });
              editorInstance.ui.registry.addButton('admin-insert-file', {
                onAction: () => handleOpenMediaLibrary(false),
                text: 'File'
              });
            }
          }}
        />
      </StyledEditorRoot>
    ),
    [handleOpenMediaLibrary, onChange, value]
  );

  return editor;
}
