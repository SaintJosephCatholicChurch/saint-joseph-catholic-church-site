import { Unicode } from '@ephox/katamari';

const isTextNode = (node: Node): node is Text => node.nodeType === 3;

const isElement = (node: Node): node is Element => node.nodeType === 1;

const isSpace = (char: string): boolean => /^[ ]$/.test(char);

const isNonSentenceChar = (char: string): boolean => /^[^a-zA-Z0-9 :]$/.test(char);

// A limited list of punctuation characters that might be used after a link
const isPunctuation = (char: string): boolean => /[?!,.;:]/.test(char);

const findChar = (text: string, index: number, predicate: (char: string) => boolean): number => {
  for (let i = index - 1; i >= 0; i--) {
    const char = text.charAt(i);
    if (!Unicode.isZwsp(char) && predicate(char)) {
      return i;
    }
  }

  return -1;
};

const freefallRtl = (container: Node, offset: number): { container: Node; offset: number } => {
  let tempNode = container;
  let tempOffset = offset;
  while (isElement(tempNode) && tempNode.childNodes[tempOffset]) {
    tempNode = tempNode.childNodes[tempOffset];
    tempOffset = isTextNode(tempNode) ? tempNode.data.length : tempNode.childNodes.length;
  }

  return { container: tempNode, offset: tempOffset };
};

export { freefallRtl, findChar, isElement, isTextNode, isPunctuation, isNonSentenceChar, isSpace };
