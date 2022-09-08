import { CmsWidgetControlProps } from 'netlify-cms-core';
import { Component } from 'react';
import EditorControl from './EditorControl';

export default class EditorWidget extends Component<CmsWidgetControlProps<string>> {
  handleOnChange(newValue: string) {
    const { onChange } = this.props as any;
    onChange(newValue);
  }

  shouldComponentUpdate(
    nextProps: Readonly<CmsWidgetControlProps<string>>,
    nextState: Readonly<{}>,
    nextContext: any
  ): boolean {
    console.log('EditorWidget! nextProps', nextProps);
    return true;
  }

  render() {
    const { field, value } = this.props;
    const { onOpenMediaLibrary, mediaPaths } = this.props as any;
    console.log('EditorWidget!');

    return (
      <EditorControl
        field={field}
        value={value}
        onChange={(newValue) => this.handleOnChange(newValue)}
        onOpenMediaLibrary={onOpenMediaLibrary}
        mediaPaths={mediaPaths}
      />
    );
  }
}
