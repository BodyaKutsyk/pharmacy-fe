import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DatePicker as MUIDatePicker,
  DatePickerProps as MUIDatePickerProps,
} from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { type Control, Controller, FieldValues, Path } from 'react-hook-form';

interface DatePickerProps<T extends FieldValues>
  extends Omit<
    MUIDatePickerProps<false>,
    'value' | 'onChange' | 'slotProps' | 'renderInput'
  > {
  control: Control<T>;
  name: Path<T>;
  label?: string;
}

export const DatePicker = <T extends FieldValues>({
  control,
  name,
  label,
  ...props
}: DatePickerProps<T>) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <MUIDatePicker
            {...props}
            label={label}
            value={value ? dayjs(value) : null}
            onChange={(newValue) => {
              onChange(newValue?.isValid() ? newValue.toDate() : null);
            }}
            slotProps={{
              textField: {
                error: !!error,
                helperText: error?.message,
                fullWidth: true,
              },
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};
