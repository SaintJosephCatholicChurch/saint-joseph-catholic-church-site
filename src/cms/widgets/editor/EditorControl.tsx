import { Editor } from '@tinymce/tinymce-react';
import { useCallback, useMemo, useRef } from 'react';
import styled from '../../../util/styled.util';

const StyledEditorControl = styled('div')`
  width: 100%;
`;

interface MarkdownControlProps {
  value: string;
  onChange: (value: string) => void;
}

const EditorControl = ({ value = '', onChange }: MarkdownControlProps) => {
  const editorRef = useRef(null);

  const handleOnChange = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.getContent());
    }
  }, [onChange]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialValue = useMemo(() => value, []);

  return useMemo(
    () => (
      <StyledEditorControl>
        <Editor
          tinymceScriptSrc="/tinymce/tinymce.min.js"
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
              'charmap',
              'code',
              'code',
              'emoticons',
              'fullscreen',
              'help',
              'image',
              'insertdatetime',
              'link',
              'lists',
              'media',
              'preview',
              'quickbars',
              'searchreplace',
              'table',
              'visualblocks',
              'wordcount'
            ],
            toolbar:
              'blocks | ' +
              'bold italic forecolor | alignnone alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            resize: false,
            elementpath: false,
            branding: false,
            invalid_styles: 'width height'
          }}
        />
      </StyledEditorControl>
    ),
    [handleOnChange, initialValue]
  );
};

EditorControl.displayName = 'EditorControl';

export default EditorControl;
