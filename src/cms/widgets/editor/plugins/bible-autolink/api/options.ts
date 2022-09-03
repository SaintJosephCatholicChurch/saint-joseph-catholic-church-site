import { Editor, EditorOptions } from 'tinymce';
import { bibleAbbreviationRegex } from '../core/abbreviations';

const option: {
  <K extends keyof EditorOptions>(name: K): (editor: Editor) => EditorOptions[K];
  <T>(name: string): (editor: Editor) => T;
} = (name: string) => (editor: Editor) => editor.options.get(name);

const register = (editor: Editor): void => {
  const registerOption = editor.options.register;

  registerOption('bible_autolink_pattern', {
    processor: 'regexp',
    // Use the Polaris link detection, however for autolink we need to make it be an exact match
    default: bibleAbbreviationRegex
  });

  registerOption('bible_url', {
    processor: 'string',
    default: 'https://bible.usccb.org/bible'
  });

  registerOption('bible_link_default_target', {
    processor: 'string',
    default: '_blank'
  });
};

const getAutoLinkPattern = option<RegExp>('bible_autolink_pattern');
const getBibleUrl = option<string>('bible_url');
const getDefaultLinkTarget = option<string>('bible_link_default_target');
const allowUnsafeLinkTarget = option('allow_unsafe_link_target');

export { register, getAutoLinkPattern, getBibleUrl, getDefaultLinkTarget, allowUnsafeLinkTarget };
