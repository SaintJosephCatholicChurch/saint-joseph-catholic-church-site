import type { Ui } from 'tinymce';

import { ImageDialogInfo } from './DialogTypes';

const makeTab = (_info: ImageDialogInfo): Ui.Dialog.TabSpec => {
  const items: Ui.Dialog.BodyComponentSpec[] = [
    {
      type: 'dropzone',
      name: 'fileinput'
    }
  ];
  return {
    title: 'Upload',
    name: 'upload',
    items
  };
};

export const UploadTab = {
  makeTab
};
