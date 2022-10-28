
import type { Editor } from 'tinymce';
import type { CmsFunctions } from '../interface';

const register = (editor: Editor, { onOpenMediaLibrary }: CmsFunctions): void => {
  editor.ui.registry.addButton('quick-cms-image', {
    icon: 'image',
    tooltip: 'Insert image',
    onAction: () => {
      onOpenMediaLibrary(true);
    }
  });

  editor.ui.registry.addMenuItem('image', {
    icon: 'image',
    text: 'Image...',
    onAction: () => {
      onOpenMediaLibrary(true);
    }
  });
};

export { register };
