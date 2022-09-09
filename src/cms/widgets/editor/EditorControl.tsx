import { Map } from 'immutable';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Editor as TinyMCEEditor } from 'tinymce/tinymce';
import uuid from 'uuid/v4';
import { doesUrlFileExist } from '../../../util/fetch.util';
import { isEmpty } from '../../../util/string.util';
import styled from '../../../util/styled.util';
import BundledEditor from './BundledEditor';

const StyledEditorControl = styled('div')`
  width: 100%;

  & > div {
    min-height: 400px;
    border-top-left-radius: 0;
  }
`;

interface EditorControlProps {
  value: string;
  field: Map<string, any>;
  onChange: (value: string) => void;
  onOpenMediaLibrary: (options: {
    controlID: string;
    forImage: boolean;
    privateUpload: any;
    allowMultiple: boolean;
    field: Map<string, any>;
    value?: any[];
    config?: any;
  }) => void;
  getAsset: (path: string, field: Map<string, any>) => string;
  mediaPaths: Map<string, any>;
}

function fromEditorToStorage(value: string): string {
  let newValue = value;

  const regex = /<img(?:[^>]+?)data-asset="([\w\W]+?)"(?:[^>]+?)?[\/]{0,1}>/g;
  let match = regex.exec(newValue);
  while (match && match.length === 2) {
    const newImage = match[0]
      .replace(/src="(?:[\w\W]+?)"/g, `src="${match[1]}"`)
      .replace(/data-asset="(?:[\w\W]+?)"/g, '')
      .replace(/([^\/]{1})>/g, '$1/>')
      .replace('  ', ' ');
    newValue = newValue.replaceAll(match[0], newImage);
    match = regex.exec(newValue);
  }

  return newValue;
}

const EditorControl = ({
  field,
  value = '',
  onChange,
  onOpenMediaLibrary,
  getAsset,
  mediaPaths
}: EditorControlProps) => {
  const editorRef = useRef<TinyMCEEditor>(null);

  const controlID: string = useMemo(() => uuid(), []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialValue = useMemo(() => value, []);

  const handleOnChange = useCallback(() => {
    if (editorRef.current) {
      onChange(fromEditorToStorage(editorRef.current.getContent()));
    }
  }, [onChange]);

  const mediaLibraryFieldOptions = field.get('media_library', Map());
  const handleOpenMedialLibrary = useCallback(() => {
    onOpenMediaLibrary({
      controlID: controlID,
      forImage: true,
      privateUpload: field.get('private'),
      allowMultiple: false,
      field,
      config: mediaLibraryFieldOptions.get('config')
    });
  }, [controlID, field, mediaLibraryFieldOptions, onOpenMediaLibrary]);

  const mediaPath = mediaPaths.get(controlID);
  useEffect(() => {
    if (isEmpty(mediaPath)) {
      return;
    }

    const addMedia = async () => {
      let image: string;
      if (await doesUrlFileExist(mediaPath)) {
        image = `<img src="${mediaPath}" />`;
      } else {
        image = `<img data-asset="${mediaPath}" src="${getAsset(mediaPath, field)}" />`;
      }

      editorRef.current.focus();
      editorRef.current.selection.setContent(image);
      onChange(editorRef.current.getContent());
    };

    addMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field, mediaPath]);

  return useMemo(
    () => (
      <StyledEditorControl>
        <BundledEditor
          onInit={(_event, editor) => (editorRef.current = editor)}
          initialValue={initialValue}
          onChange={handleOnChange}
          onKeyUp={handleOnChange}
          onPaste={handleOnChange}
          onUndo={handleOnChange}
          onRedo={handleOnChange}
          init={{
            menubar: 'edit insert view format table tools help',
            menu: {
              edit: { title: 'Edit', items: 'undo redo | cut copy paste | selectall | searchreplace' },
              view: { title: 'View', items: 'code | visualaid visualchars visualblocks | spellchecker | fullscreen' },
              insert: {
                title: 'Insert',
                items:
                  'image link media inserttable | charmap emoticons hr | pagebreak nonbreaking anchor | insertdatetime'
              },
              format: {
                title: 'Format',
                items:
                  'bold italic underline strikethrough superscript subscript | forecolor | formats blockformats fontformats fontsizes align | removeformat'
              },
              tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | code wordcount' },
              table: { title: 'Table', items: 'inserttable | cell row column | tableprops deletetable' },
              help: { title: 'Help', items: 'help' }
            },
            plugins: [
              'advlist',
              'anchor',
              'autolink',
              'autoresize',
              'bible-autolink',
              'charmap',
              'code',
              'code',
              'emoticons',
              'fullscreen',
              'help',
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
              'wordcount',
              'image'
            ],
            toolbar:
              'blocks | ' +
              'bold italic forecolor | alignnone alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat',
            body_class: 'content editor',
            content_css: ['/styles/global.css', '/styles/content.module.css'],
            resize: false,
            elementpath: false,
            branding: false,
            invalid_styles: 'width height'
          }}
          onOpenMediaLibrary={handleOpenMedialLibrary}
        />
      </StyledEditorControl>
    ),
    [handleOnChange, initialValue, handleOpenMedialLibrary]
  );
};

EditorControl.displayName = 'EditorControl';

export default EditorControl;
