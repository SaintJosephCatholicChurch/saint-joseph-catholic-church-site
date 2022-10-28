import { Component } from 'react';

import EditorControl from './EditorControl';

import type { CmsWidgetControlProps } from '@staticcms/core';

export default class EditorWidget extends Component<CmsWidgetControlProps<string>> {
  handleOnChange(newValue: string) {
    const { onChange } = this.props;
    onChange(newValue);
  }

  shouldComponentUpdate(_nextProps: Readonly<CmsWidgetControlProps<string>>): boolean {
    return true;
  }

  render() {
    const { field, value } = this.props;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
    const { onOpenMediaLibrary, getAsset, mediaPaths } = this.props as any;

    return (
      <EditorControl
        field={field}
        value={value}
        onChange={(newValue) => this.handleOnChange(newValue)}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        onOpenMediaLibrary={onOpenMediaLibrary}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        getAsset={getAsset}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        mediaPaths={mediaPaths}
      />
    );
  }
}
