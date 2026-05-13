import tinymce from 'tinymce';

import * as Buttons from './ui/Buttons';

import type { CmsFunctions } from './interface';

const CmsImagePlugin = (props: CmsFunctions): void => {
  tinymce.PluginManager.add('image', (editor) => {
    Buttons.register(editor, props);
  });
};

export default CmsImagePlugin;
