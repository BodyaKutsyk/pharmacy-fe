import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker as MUIDatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export const DatePicker = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MUIDatePicker format={'DD-MM-YYYY'} />
    </LocalizationProvider>
  );
};
