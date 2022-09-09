
import { Editor } from 'tinymce';

import { CmsFunctions } from '../interface';

const register = (editor: Editor, { onOpenMediaLibrary }: CmsFunctions): void => {
  editor.ui.registry.addButton('quick-cms-file', {
    icon: 'document-properties',
    tooltip: 'Insert file',
    onAction: () => {
      onOpenMediaLibrary(false);
    }
  });

  editor.ui.registry.addMenuItem('file', {
    icon: 'document-properties',
    text: 'File...',
    onAction: () => {
      onOpenMediaLibrary(false);
    }
  });
};

export { register };
