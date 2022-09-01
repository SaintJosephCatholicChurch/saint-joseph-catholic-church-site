import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Immutable from 'immutable';
import { CmsWidgetControlProps } from 'netlify-cms-core';
import { Component } from 'react';
import { Times } from '../../../interface';
import ScheduleWidget from './ScheduleWidgetControl';

export default class TimesWidget extends Component<CmsWidgetControlProps<Immutable.List<unknown>>> {
  handleOnChange(times: Times[]) {
    const { onChange } = this.props;
    onChange(Immutable.List(times));
  }

  render() {
    const { value } = this.props;

    const plainValue = value.toJS();

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ScheduleWidget times={plainValue} onChange={(times) => this.handleOnChange(times)} />
      </LocalizationProvider>
    );
  }
}
