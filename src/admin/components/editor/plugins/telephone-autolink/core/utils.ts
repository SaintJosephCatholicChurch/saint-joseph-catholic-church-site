import { Unicode } from '@ephox/katamari';

export const isTextNode = (node: Node): node is Text => node.nodeType === 3;

export const isElement = (node: Node): node is Element => node.nodeType === 1;

export const isSpace = (char: string): boolean => /^[ ]$/.test(char);
export const isOpenParan = (char: string): boolean => /^[(]$/.test(char);

export const isNonPhoneNumberCharacter = (char: string): boolean => /^[^()\-0-9 ]$/.test(char);

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

export const freefallRtl = (container: Node, offset: number): { container: Node; offset: number } => {
  let tempNode = container;
  let tempOffset = offset;
  while (isElement(tempNode) && tempNode.childNodes[tempOffset]) {
    tempNode = tempNode.childNodes[tempOffset];
    tempOffset = isTextNode(tempNode) ? tempNode.data.length : tempNode.childNodes.length;
  }

  return { container: tempNode, offset: tempOffset };
};
