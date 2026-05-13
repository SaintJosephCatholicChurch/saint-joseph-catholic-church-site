import { bibleAbbreviationRegex } from '../core/abbreviations';

import type { Editor, EditorOptions } from 'tinymce';

const option: {
  <K extends keyof EditorOptions>(name: K): (editor: Editor) => EditorOptions[K];
  <T>(name: string): (editor: Editor) => T;
} = (name: string) => (editor: Editor) => editor.options.get(name) as string;

export const register = (editor: Editor): void => {
  const registerOption = editor.options.register;

  registerOption('bible_autolink_pattern', {
    processor: 'regexp',
    // Use the Polaris link detection, however for autolink we need to make it be an exact match
    default: bibleAbbreviationRegex
  });

  registerOption('bible_autolink_additional_pattern', {
    processor: 'regexp',
    // Use the Polaris link detection, however for autolink we need to make it be an exact match
    default: /(?:([0-9]+)[ ]*[:]{1})?[ ]*([0-9]+)[ ]*(?:[-]{1}[ ]*([0-9]+))?/i
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

export const getAutoLinkPattern = option<RegExp>('bible_autolink_pattern');
export const getAutoLinkAdditonalPattern = option<RegExp>('bible_autolink_additional_pattern');
export const getBibleUrl = option<string>('bible_url');
export const getDefaultLinkTarget = option<string>('bible_link_default_target');
export const allowUnsafeLinkTarget = option('allow_unsafe_link_target');
