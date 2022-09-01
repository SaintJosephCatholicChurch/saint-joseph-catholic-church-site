import { CmsWidgetControlProps } from 'netlify-cms-core';
import { Component } from 'react';
import EditorControl from './EditorControl';

export default class TimesWidget extends Component<CmsWidgetControlProps<string>> {
  handleOnChange(newValue: string) {
    const { onChange } = this.props;
    onChange(newValue);
  }

  render() {
    const { value } = this.props;

    return <EditorControl value={value} onChange={(newValue) => this.handleOnChange(newValue)} />;
  }
}
