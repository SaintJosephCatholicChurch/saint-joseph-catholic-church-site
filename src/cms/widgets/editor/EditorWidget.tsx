import { useCallback } from 'react';

import EditorControl from './EditorControl';

import type { WidgetControlProps } from '@staticcms/core';
import type { FC } from 'react';
import type { HtmlField } from '../../config';

const EditorWidget: FC<WidgetControlProps<string, HtmlField>> = ({ collection, field, entry, value, onChange }) => {
  const handleOnChange = useCallback(
    (newValue: string) => {
      onChange(newValue);
    },
    [onChange]
  );

  return <EditorControl field={field} value={value} onChange={handleOnChange} />;
};
// export default class EditorWidget extends Component<> {
//   handleOnChange(newValue: string) {
//     const { onChange } = this.props;
//     onChange(newValue);
//   }

//   shouldComponentUpdate(_nextProps: Readonly<WidgetControlProps<string>>): boolean {
//     return true;
//   }

//   render() {
//     const { field, value } = this.props;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
//     const { onOpenMediaLibrary, getAsset, mediaPaths } = this.props as any;

//   }
// }
