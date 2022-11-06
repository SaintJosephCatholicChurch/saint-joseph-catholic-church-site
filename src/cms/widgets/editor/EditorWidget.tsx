import { useCallback } from 'react';

import EditorControl from './EditorControl';

import type { WidgetControlProps } from '@staticcms/core';
import type { HtmlField } from '../../config';
import type { FC } from 'react';

const EditorWidget: FC<WidgetControlProps<string, HtmlField>> = ({
  onChange,
  field,
  value,
  openMediaLibrary,
  getAsset,
  mediaPaths
}) => {
  const handleOnChange = useCallback((newValue: string) => {
    onChange(newValue);
  }, []);

  return (
    <EditorControl
      field={field}
      value={value}
      onChange={(newValue) => handleOnChange(newValue)}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      onOpenMediaLibrary={onOpenMediaLibrary}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      getAsset={getAsset}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      mediaPaths={mediaPaths}
    />
  );
};

export default EditorWidget;
