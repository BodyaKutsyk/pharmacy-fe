import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DatePicker as MUIDatePicker,
  DatePickerProps as MUIDatePickerProps,
} from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { type Control, Controller } from 'react-hook-form';

type DatePickerProps = Omit<
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  MUIDatePickerProps<Dayjs>,
  'value' | 'onChange' | 'name'
> & {
  control: Control;
  name: string;
};

export const DatePicker = ({ control, name }: DatePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name || 'date'}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <MUIDatePicker
            disablePast
            format={'DD-MM-YYYY'}
            onChange={(v) => onChange(v?.isValid?.() ? v.toDate() : null)}
            value={value ? dayjs(value as Date) : null}
            slotProps={{
              textField: {
                error: !!error,
                helperText: error?.message,
              },
            }}
          />
        )}
        rules={{ required: 'Date is required' }}
      />
    </LocalizationProvider>
  );
};
