export function fromEditorToStorage(value: string): string {
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
