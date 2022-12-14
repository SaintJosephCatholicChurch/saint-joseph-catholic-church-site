import { styled } from '@mui/material/styles';
import { Map } from 'immutable';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { v4 as uuid } from 'uuid';

import { IMAGE_EXTENSION_REGEX } from '../../../constants';
import { doesUrlFileExist } from '../../../util/fetch.util';
import { isNotNullish } from '../../../util/null.util';
import { isEmpty, isNotEmpty } from '../../../util/string.util';
import { getFieldAsset } from '../../util/asset.util';
import BundledEditor from './BundledEditor';

import type { Editor as TinyMCEEditor } from 'tinymce/tinymce';

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

  const imageRegex = /<img(?:[^>]+?)data-asset="([\w\W]+?)"(?:[^>]+?)?[/]{0,1}>/g;
  let imageMatch = imageRegex.exec(newValue);
  while (imageMatch && imageMatch.length === 2) {
    const newImage = imageMatch[0]
      .replace(/src="(?:[\w\W]+?)"/g, `src="/${imageMatch[1].replace(/^\//, '')}"`)
      .replace(/data-asset="(?:[\w\W]+?)"/g, '')
      .replace(/([^/]{1})>/g, '$1/>')
      .replace('  ', ' ');
    newValue = newValue.replaceAll(imageMatch[0], newImage);
    imageMatch = imageRegex.exec(newValue);
  }

  newValue = newValue.replace(/src="(?!http|\/)([\w\W]+?)"/g, 'href="/$1"');

  const fileRegex = /<a(?:[^>]+?)data-asset="([\w\W]+?)"(?:[^>]+?)?>(?:[\w\W]+?)<\/a>/g;
  let fileMatch = fileRegex.exec(newValue);
  while (fileMatch && fileMatch.length === 2) {
    const newFileLink = fileMatch[0]
      .replace(/href="(?:[\w\W]+?)"/g, `href="/${fileMatch[1].replace(/^\//, '')}"`)
      .replace(/data-asset="(?:[\w\W]+?)"/g, '')
      .replace('  ', ' ');
    newValue = newValue.replaceAll(fileMatch[0], newFileLink);
    fileMatch = fileRegex.exec(newValue);
  }

  newValue = newValue.replace(/href="(?!http|mailto|tel|\/)([\w\W]+?)"/g, 'href="/$1"');

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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const mediaLibraryFieldOptions = field.get('media_library', Map());
  const handleOpenMedialLibrary = useCallback(
    (forImage: boolean) => {
      onOpenMediaLibrary({
        controlID,
        forImage,
        privateUpload: field.get('private') as boolean,
        allowMultiple: false,
        field,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        config: mediaLibraryFieldOptions.get('config')
      });
    },
    [controlID, field, mediaLibraryFieldOptions, onOpenMediaLibrary]
  );

  const getMedia = useCallback(
    async (path: string) => {
      const { type, exists } = await doesUrlFileExist(path);
      if (!exists) {
        const asset = getFieldAsset(field, getAsset)(path);
        if (isNotNullish(asset)) {
          return {
            type: IMAGE_EXTENSION_REGEX.test(path) ? 'image' : 'file',
            exists: false,
            url: asset.toString()
          };
        }
      }

      return { url: path, type, exists };
    },
    [field, getAsset]
  );

  const mediaPath = mediaPaths.get(controlID) as string;
  useEffect(() => {
    if (isEmpty(mediaPath)) {
      return;
    }

    const addMedia = async () => {
      const { type, exists, url } = await getMedia(mediaPath);
      let content: string | undefined;
      if (type.startsWith('image')) {
        if (exists) {
          content = `<img src="${mediaPath}" />`;
        } else {
          content = `<img data-asset="${mediaPath}" src="${url}" />`;
        }
      } else {
        const name = mediaPath.split('/').pop();
        if (exists) {
          content = `<a target="_blank" href="${mediaPath}">${name}</a>`;
        } else {
          content = `<a data-asset="${mediaPath}" target="_blank" href="${url}">${name}</a>`;
        }
      }

      if (isNotEmpty(content)) {
        editorRef.current.focus();
        editorRef.current.selection.setContent(content);
        onChange(editorRef.current.getContent());
      }
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
                  'image file link media inserttable | charmap emoticons hr | pagebreak nonbreaking anchor | insertdatetime'
              },
              format: {
                title: 'Format',
                items: 'bold italic underline strikethrough superscript subscript | forecolor | align | removeformat'
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
              'image',
              'file'
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
            invalid_styles: 'width height',
            quickbars_selection_toolbar: 'bold italic | blocks | quicklink blockquote | bullist numlist',
            quickbars_insert_toolbar: 'quick-cms-image quick-cms-file quicktable',
            quickbars_image_toolbar: 'alignnone alignleft aligncenter alignright alignjustify',
            formats: {
              alignleft: [
                {
                  selector: 'figure.image',
                  collapsed: false,
                  classes: 'align-left',
                  ceFalseOverride: true,
                  preview: 'font-family font-size'
                },
                {
                  selector: 'figure,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li,pre',
                  styles: {
                    textAlign: 'left'
                  },
                  inherit: false,
                  preview: false
                },
                {
                  selector: 'img,audio,video',
                  collapsed: false,
                  styles: {
                    float: 'left',
                    marginRight: '16px'
                  },
                  preview: 'font-family font-size'
                },
                {
                  selector: 'table',
                  collapsed: false,
                  styles: {
                    marginLeft: '0px',
                    marginRight: 'auto'
                  },
                  onformat: (table: Node) => {
                    // Remove conflicting float style
                    editorRef.current.dom.setStyle(table as HTMLTableElement, 'float', null);
                  },
                  preview: 'font-family font-size'
                },
                {
                  selector: '.mce-preview-object,[data-ephox-embed-iri]',
                  ceFalseOverride: true,
                  styles: {
                    float: 'left'
                  }
                }
              ],
              alignright: [
                {
                  selector: 'figure.image',
                  collapsed: false,
                  classes: 'align-right',
                  ceFalseOverride: true,
                  preview: 'font-family font-size'
                },
                {
                  selector: 'figure,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li,pre',
                  styles: {
                    textAlign: 'right'
                  },
                  inherit: false,
                  preview: 'font-family font-size'
                },
                {
                  selector: 'img,audio,video',
                  collapsed: false,
                  styles: {
                    float: 'right',
                    marginLeft: '16px'
                  },
                  preview: 'font-family font-size'
                },
                {
                  selector: 'table',
                  collapsed: false,
                  styles: {
                    marginRight: '0px',
                    marginLeft: 'auto'
                  },
                  onformat: (table: Node) => {
                    // Remove conflicting float style
                    editorRef.current.dom.setStyle(table as HTMLTableElement, 'float', null);
                  },
                  preview: 'font-family font-size'
                },
                {
                  selector: '.mce-preview-object,[data-ephox-embed-iri]',
                  ceFalseOverride: true,
                  styles: {
                    float: 'right'
                  },
                  preview: false
                }
              ],
              alignjustify: [
                {
                  selector: 'figure,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li,pre',
                  styles: {
                    textAlign: 'justify'
                  },
                  inherit: false,
                  preview: 'font-family font-size'
                },
                {
                  selector: 'img,audio,video',
                  collapsed: false,
                  styles: {
                    width: '100%',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  },
                  preview: 'font-family font-size'
                }
              ]
            }
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
