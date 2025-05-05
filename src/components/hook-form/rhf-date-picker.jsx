import moment from 'moment-jalaali';
import { Controller, useFormContext } from 'react-hook-form';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

// ----------------------------------------------------------------------
moment.locale('fa');
moment.loadPersian({ usePersianDigits: false });

export function RHFDatePicker({ name, slotProps, ...other }) {
  const { control } = useFormContext();

  return (

    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          {...field}
          value={field.value ? moment(field.value) : null}
          onChange={(newValue) => {
            const formattedValue = newValue ? moment(newValue).format('YYYY-MM-DD') : null;
            if (formattedValue) {
              field.onChange(formattedValue); // Send formatted value
            } else {
              field.onChange(null);
            }
          }}
          format="jYYYY/jMM/jDD"
          slotProps={{
            desktopPaper: {
              dir: 'rtl',
            },
            mobilePaper: {
              dir: 'rtl',
            },
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error?.message ?? slotProps?.textField?.helperText,
              ...slotProps?.textField,
            },
            ...slotProps,
          }}
          {...other}
        />
      )}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFMobileDateTimePicker({ name, slotProps, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <MobileDateTimePicker
          {...field}
          value={field.value ? moment(field.value) : null}
          onChange={(newValue) => field.onChange(newValue ? moment(newValue).format() : null)} // Format with moment
          format="jYYYY/jMM/jDD HH:mm"
          slotProps={{
            desktopPaper: {
              dir: 'rtl',
            },
            mobilePaper: {
              dir: 'rtl',
            },
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error?.message ?? slotProps?.textField?.helperText,
              ...slotProps?.textField,
            },
            ...slotProps,
          }}
          {...other}
        />
      )}
    />
  );
}
