import { Fun, Obj, Type, Unicode } from '@ephox/katamari';
import tinymce, { Editor } from 'tinymce';
import { isNotEmpty } from '../../../../../../util/string.util';

import * as Options from '../api/options';
import { abbreviationsToUJSCCBBook } from './abbreviations';
import { findBookAndChapter, findChar, freefallRtl, isNonBiblbeVerseCharacter, isPunctuation, isSpace } from './utils';

interface ParseResult {
  readonly rng: Range;
  readonly url: string;
}

const parseCurrentLine = (editor: Editor, offset: number): ParseResult | null => {
  const voidElements = editor.schema.getVoidElements();
  const autoLinkPattern = Options.getAutoLinkPattern(editor);
  const autoLinkAdditonalPattern = Options.getAutoLinkAdditonalPattern(editor);
  const bibleUrl = Options.getBibleUrl(editor);
  const { dom, selection } = editor;

  // Never create a link when we are inside a link
  if (dom.getParent(selection.getNode(), 'a[href]') !== null) {
    return null;
  }

  const previousNode = dom.getPrev(selection.getNode(), () => true);

  const rng = selection.getRng();
  const textSeeker = tinymce.dom.TextSeeker(dom, (node) => {
    return (
      dom.isBlock(node) ||
      Obj.has(voidElements, node.nodeName.toLowerCase()) ||
      dom.getContentEditable(node) === 'false'
    );
  });

  // Descend down the end container to find the text node
  const { container: endContainer, offset: endOffset } = freefallRtl(rng.endContainer, rng.endOffset);

  // Find the root container to use when walking
  const root = dom.getParent(endContainer, dom.isBlock) ?? dom.getRoot();

  // Move the selection backwards to the start of the potential URL to account for the pressed character
  // while also excluding the last full stop from a word like "www.site.com."
  const endSpot = textSeeker.backwards(
    endContainer,
    endOffset + offset,
    (node, offset) => {
      const text = node.data;
      const idx = findChar(text, offset, Fun.not(isNonBiblbeVerseCharacter));
      // Move forward one so the offset is after the found character unless the found char is a punctuation char
      return idx === -1 || isPunctuation(text[idx]) ? idx : idx + 1;
    },
    root
  );

  if (!endSpot) {
    return null;
  }

  // Walk backwards until we find a boundary or a bracket/space
  let lastTextNode = endSpot.container;
  const startSpot = textSeeker.backwards(
    endSpot.container,
    endSpot.offset,
    (node, offset) => {
      lastTextNode = node;
      const idx = findChar(node.data, offset, isNonBiblbeVerseCharacter);

      if (idx === -1) {
        return idx;
      }

      if (isSpace(node.data.charAt(idx + 1))) {
        return idx + 2;
      }

      return idx + 1;
    },
    root
  );

  const newRng = dom.createRng();
  if (!startSpot) {
    newRng.setStart(lastTextNode, 0);
  } else {
    newRng.setStart(startSpot.container, startSpot.offset);
  }
  newRng.setEnd(endSpot.container, endSpot.offset);

  const rngText = Unicode.removeZwsp(newRng.toString());
  const matches = rngText.match(autoLinkPattern);

  // Book, chapter and maybe verse
  if (matches && matches.length === 4) {
    const index = rngText.indexOf(matches[0]);
    newRng.setStart(newRng.startContainer, newRng.startOffset + index);
    const finalRangeText = Unicode.removeZwsp(newRng.toString());
    if (finalRangeText === matches[0]) {
      const book = abbreviationsToUJSCCBBook[matches[1].toLowerCase()];
      const verse = matches.length > 3 && isNotEmpty(matches[3]) ? `?${matches[3]}` : '';
      return {
        rng: newRng,
        url: `${bibleUrl.replace('/$', '')}/${book}/${matches[2]}${verse}`
      };
    }

    return null;
  }

  // Verse and maybe chapter
  const additionalMatches = rngText.match(autoLinkAdditonalPattern);
  if (additionalMatches && additionalMatches.length === 4) {
    const searchRange = dom.createRng();
    searchRange.setStart(newRng.startContainer, newRng.startOffset);
    searchRange.setEnd(newRng.endContainer, newRng.endOffset);
    const bookAndChapter = findBookAndChapter(root, textSeeker, searchRange, autoLinkPattern);
    if (!bookAndChapter) {
      return null;
    }

    const book = abbreviationsToUJSCCBBook[bookAndChapter.book.toLowerCase()];
    const chapter = additionalMatches[1] ?? bookAndChapter.chapter;
    const verse = isNotEmpty(additionalMatches[2]) ? `?${additionalMatches[2]}` : '';

    return {
      rng: newRng,
      url: `${bibleUrl.replace('/$', '')}/${book}/${chapter}${verse}`
    };
  }

  return null;
};

const convertToLink = (editor: Editor, result: ParseResult): void => {
  const { dom, selection } = editor;
  const { rng, url } = result;

  const bookmark = selection.getBookmark();
  selection.setRng(rng);

  // Needs to be a native createlink command since this is executed in a keypress event handler
  // so the pending character that is to be inserted needs to be inserted after the link. That will not
  // happen if we use the formatter create link version. Since we're using the native command
  // then we also need to ensure the exec command events are fired for backwards compatibility.
  const command = 'createlink';
  const args = { command, ui: false, value: url };
  const beforeExecEvent = editor.dispatch('BeforeExecCommand', args);
  if (!beforeExecEvent.isDefaultPrevented()) {
    editor.getDoc().execCommand(command, false, url);
    editor.dispatch('ExecCommand', args);

    const defaultLinkTarget = Options.getDefaultLinkTarget(editor);
    if (Type.isString(defaultLinkTarget)) {
      const anchor = selection.getNode();
      dom.setAttrib(anchor, 'target', defaultLinkTarget);

      // Ensure noopener is added for blank targets to prevent window opener attacks
      if (defaultLinkTarget === '_blank' && !Options.allowUnsafeLinkTarget(editor)) {
        dom.setAttrib(anchor, 'rel', 'noopener');
      }
    }
  }

  selection.moveToBookmark(bookmark);
  editor.nodeChanged();
};

const handleSpacebar = (editor: Editor): void => {
  const result = parseCurrentLine(editor, -1);
  if (Type.isNonNullable(result)) {
    convertToLink(editor, result);
  }
};

const handlePunctuation = handleSpacebar;

const handleEnter = (editor: Editor): void => {
  const result = parseCurrentLine(editor, 0);
  if (Type.isNonNullable(result)) {
    convertToLink(editor, result);
  }
};

const setup = (editor: Editor): void => {
  editor.on('keydown', (e) => {
    if (e.key === 'Enter' && !e.isDefaultPrevented()) {
      handleEnter(editor);
    }
  });

  editor.on('keyup', (e) => {
    if (e.key === ' ') {
      handleSpacebar(editor);
    } else if (/[.,\/#!$%\^&\*;{}=\_`~()]/g.test(e.key)) {
      handlePunctuation(editor);
    }
  });
};

export { setup };
