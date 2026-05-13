import tinymce from 'tinymce';

import * as Options from './api/options';
import * as Keys from './core/keys';

const TelephoneAutoLinkPlugin = (): void => {
  tinymce.PluginManager.add('bible-autolink', (editor) => {
    Options.register(editor);
    Keys.setup(editor);
  });
};

export default TelephoneAutoLinkPlugin;
