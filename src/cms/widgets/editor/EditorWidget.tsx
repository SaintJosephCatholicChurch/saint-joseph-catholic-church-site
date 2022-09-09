import { CmsWidgetControlProps } from 'netlify-cms-core';
import { Component } from 'react';
import EditorControl from './EditorControl';

export default class EditorWidget extends Component<CmsWidgetControlProps<string>> {
  handleOnChange(newValue: string) {
    const { onChange } = this.props as any;
    onChange(newValue);
  }

  shouldComponentUpdate(_nextProps: Readonly<CmsWidgetControlProps<string>>): boolean {
    return true;
  }

  render() {
    const { field, value } = this.props;
    const { onOpenMediaLibrary, getAsset, mediaPaths } = this.props as any;

    return (
      <EditorControl
        field={field}
        value={value}
        onChange={(newValue) => this.handleOnChange(newValue)}
        onOpenMediaLibrary={onOpenMediaLibrary}
        getAsset={getAsset}
        mediaPaths={mediaPaths}
      />
    );
  }
}
