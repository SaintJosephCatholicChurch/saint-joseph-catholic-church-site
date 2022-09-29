import { Editor, EditorOptions } from 'tinymce';

const option: {
  <K extends keyof EditorOptions>(name: K): (editor: Editor) => EditorOptions[K];
  <T>(name: string): (editor: Editor) => T;
} = (name: string) => (editor: Editor) => editor.options.get(name);

const register = (editor: Editor): void => {
  const registerOption = editor.options.register;

  registerOption('telephone_autolink_pattern', {
    processor: 'regexp',
    // Use the Polaris link detection, however for autolink we need to make it be an exact match
    default: /(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/i
  });

  registerOption('telephone_autolink_pattern_absolute', {
    processor: 'regexp',
    // Use the Polaris link detection, however for autolink we need to make it be an exact match
    default: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/i
  });

  registerOption('telephone_link_default_target', {
    processor: 'string'
  });

  registerOption('telephone_link_default_protocol', {
    processor: 'string',
    default: 'tel'
  });
};

const getAutoLinkPattern = option<RegExp>('telephone_autolink_pattern');
const getAutoLinkAbsolutePattern = option<RegExp>('telephone_autolink_pattern_absolute');

export { register, getAutoLinkPattern, getAutoLinkAbsolutePattern };
