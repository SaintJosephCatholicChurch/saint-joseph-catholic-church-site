import tinymce from 'tinymce';

import { CmsFunctions } from './interface';
import * as Buttons from './ui/Buttons';

const CmsFilePlugin = (props: CmsFunctions): void => {
  tinymce.PluginManager.add('file', (editor) => {
    Buttons.register(editor, props);
  });
};

export default CmsFilePlugin;
