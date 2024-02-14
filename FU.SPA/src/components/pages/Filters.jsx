import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import { RadioGroup } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const paramToDayjs = (searchParams, paramKey) => {
  let endTimeParam = searchParams.get(paramKey);
  if (!endTimeParam || !dayjs(endTimeParam).isValid()) return null;
  return dayjs(endTimeParam);
};

export const SelectDateRangeFilter = ({ onDateRangeChange }) => {
  const endDateParamKey = 'endDate';
  const startDateParamKey = 'startDate';
  const dateRadioParamKey = 'dateRadio';
  const radioValues = { upcoming: 'upcoming', between: 'between' };

  const [searchParams, setSearchParams] = useSearchParams();
  const [radioValue, setRadioValue] = useState(() => {
    const paramValue = searchParams.get(dateRadioParamKey);
    if (
      paramValue === radioValues.upcoming ||
      paramValue === radioValues.between
    )
      return paramValue;
    else return radioValues.upcoming;
  });

  const [startDate, setStartDate] = useState(
    paramToDayjs(searchParams, startDateParamKey),
  );
  const [endDate, setEndDate] = useState(
    paramToDayjs(searchParams, endDateParamKey),
  );

  // Update search params
  useEffect(() => {
    setSearchParams(
      (params) => {
        if (startDate?.isValid())
          params.set(startDateParamKey, startDate.toISOString());
        if (endDate?.isValid())
          params.set(endDateParamKey, endDate.toISOString());
        if (radioValue) params.set(dateRadioParamKey, radioValue);
        return params;
      },
      { replace: true },
    );
  }, [startDate, endDate, setSearchParams, radioValue]);

  // decides when and how to call onDateRangeChange
  useEffect(() => {
    const values = {
      startDate: null,
      endDate: null,
    };

    if (radioValue === radioValues.upcoming) {
      values.startDate = dayjs();
    } else {
      if (startDate?.isValid()) values.startDate = startDate;
      if (endDate?.isValid()) values.endDate = endDate;
    }

    if (onDateRangeChange) onDateRangeChange(values);
    // ignore onDateRangeChaage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, radioValue, radioValues.upcoming]);

  return (
    <FormControl>
      <FormLabel id="demo-controlled-radio-buttons-group">Date</FormLabel>
      <RadioGroup
        defaultValue={radioValues.upcoming}
        value={radioValue}
        onChange={(event) => {
          setRadioValue(event.target.value);
        }}
      >
        <FormControlLabel
          value={radioValues.upcoming}
          label="Upcoming"
          control={<Radio />}
        />
        <FormControlLabel
          value={radioValues.between}
          label="Between"
          control={<Radio />}
        />
      </RadioGroup>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          disabled={radioValue !== radioValues.between}
          label="Start Date"
          value={startDate}
          onChange={(newValue) => {
            if (endDate && newValue && newValue > endDate) setEndDate(null);
            setStartDate(newValue);
          }}
          slotProps={{ field: { clearable: true } }}
        />
        <DatePicker
          disabled={radioValue !== radioValues.between}
          label="End Date"
          value={endDate}
          onChange={(newValue) => {
            if (startDate && newValue && newValue < startDate)
              setEndDate(newValue);
          }}
          slotProps={{ field: { clearable: true } }}
        />
      </LocalizationProvider>
    </FormControl>
  );
};

export function SelectTimeRangeFilter({
  onStartTimeChange,
  onEndTimeChange,
  startTime,
  endTime,
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        label="From"
        value={startTime}
        onChange={(newValue) => onStartTimeChange(newValue)}
        slotProps={{ field: { clearable: true } }}
      />
      <TimePicker
        label="To"
        value={endTime}
        onChange={(newValue) => onEndTimeChange(newValue)}
        slotProps={{ field: { clearable: true } }}
      />
    </LocalizationProvider>
  );
}
