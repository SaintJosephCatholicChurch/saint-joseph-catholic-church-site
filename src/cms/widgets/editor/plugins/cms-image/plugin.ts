import tinymce from 'tinymce';

import { CmsFunctions } from './interface';
import * as Buttons from './ui/Buttons';

const CmsImagePlugin = (props: CmsFunctions): void => {
  tinymce.PluginManager.add('image', (editor) => {
    Buttons.register(editor, props);
  });
};

export default CmsImagePlugin;
