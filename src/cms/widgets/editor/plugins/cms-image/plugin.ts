import tinymce from 'tinymce';

import * as Commands from './api/Commands';
import * as Options from './api/Options';
import * as FilterContent from './core/FilterContent';
import { CmsFunctions } from './interface';
import * as Buttons from './ui/Buttons';

const CmsImagePlugin = (props: CmsFunctions): void => {
  tinymce.PluginManager.add('image', (editor) => {
    Options.register(editor);
    FilterContent.setup(editor);
    Buttons.register(editor, props);
    Commands.register(editor);
  });
};

export default CmsImagePlugin;
