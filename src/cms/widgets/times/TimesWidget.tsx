import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useCallback } from 'react';

import ScheduleWidget from './TimesWidgetControl';

import type { WidgetControlProps } from '@staticcms/lite';
import type { FC } from 'react';
import type { Times } from '../../../interface';
import type { TimesField } from '../../config';

const TimesWidget: FC<WidgetControlProps<Times[], TimesField>> = ({ value, onChange }) => {
  const handleOnChange = useCallback(
    (times: Times[]) => {
      onChange(times);
    },
    [onChange]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ScheduleWidget times={value} onChange={handleOnChange} />
    </LocalizationProvider>
  );
};

export default TimesWidget;
