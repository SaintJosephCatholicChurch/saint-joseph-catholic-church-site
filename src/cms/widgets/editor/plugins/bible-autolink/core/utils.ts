import { Unicode } from '@ephox/katamari';

import type { TextSeeker } from 'tinymce';

export const isTextNode = (node: Node): node is Text => node.nodeType === 3;

export const isElement = (node: Node): node is Element => node.nodeType === 1;

export const isSpace = (char: string): boolean => /^[ ]$/.test(char);

export const isNonBiblbeVerseCharacter = (char: string): boolean => /^[^a-zA-Z0-9 :-]$/.test(char);

export const isExtendedNonBiblbeVerseCharacter = (char: string): boolean => /^[^a-zA-Z0-9 :\-,]$/.test(char);

// A limited list of punctuation characters that might be used after a link
export const isPunctuation = (char: string): boolean => /[?!,.;:]/.test(char);

export const findChar = (text: string, index: number, predicate: (char: string) => boolean): number => {
  for (let i = index - 1; i >= 0; i--) {
    const char = text.charAt(i);
    if (!Unicode.isZwsp(char) && predicate(char)) {
      return i;
    }
  }

  return -1;
};

export const findBookAndChapter = (
  root: Element,
  textSeeker: TextSeeker,
  range: Range,
  autoLinkPattern: RegExp
): { book: string; chapter: string } | null => {
  const newEndSpot = textSeeker.backwards(
    range.startContainer,
    range.startOffset,
    (node, offset) => {
      const idx = findChar(node.data, offset, isExtendedNonBiblbeVerseCharacter);

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

  if (!newEndSpot) {
    return null;
  }

  range.setStart(newEndSpot.container, newEndSpot.offset);
  const rangeText = Unicode.removeZwsp(range.toString());
  const matches = rangeText.match(autoLinkPattern);
  if (matches && matches.length === 4) {
    return { book: matches[1], chapter: matches[2] };
  }

  return null;
};

export const freefallRtl = (container: Node, offset: number): { container: Node; offset: number } => {
  let tempNode = container;
  let tempOffset = offset;
  while (isElement(tempNode) && tempNode.childNodes[tempOffset]) {
    tempNode = tempNode.childNodes[tempOffset];
    tempOffset = isTextNode(tempNode) ? tempNode.data.length : tempNode.childNodes.length;
  }

  return { container: tempNode, offset: tempOffset };
};
