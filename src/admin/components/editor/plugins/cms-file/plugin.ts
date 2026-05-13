import tinymce from 'tinymce';

import * as Buttons from './ui/Buttons';

import type { CmsFunctions } from './interface';

const CmsFilePlugin = (props: CmsFunctions): void => {
  tinymce.PluginManager.add('file', (editor) => {
    Buttons.register(editor, props);
  });
};

export default CmsFilePlugin;
