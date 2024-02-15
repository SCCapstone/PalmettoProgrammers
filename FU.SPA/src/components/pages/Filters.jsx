import {
  CustomTimePicker,
  CustomDatePicker,
} from '../../helpers/styleComponents';
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
        else params.delete(startDateParamKey);
        if (endDate?.isValid())
          params.set(endDateParamKey, endDate.toISOString());
        else params.delete(endDateParamKey);
        if (radioValue) params.set(dateRadioParamKey, radioValue);
        return params;
      },
      { replace: true },
    );
    // disabled for setSearchParams
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, radioValue]);

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
      <FormLabel>Date</FormLabel>
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
        <CustomDatePicker
          disabled={radioValue !== radioValues.between}
          label="Start Date"
          value={startDate}
          onChange={(newValue) => {
            if (endDate && newValue && newValue > endDate) setEndDate(null);
            setStartDate(newValue);
          }}
          slotProps={{ field: { clearable: true } }}
        />
        <CustomDatePicker
          disabled={radioValue !== radioValues.between}
          label="End Date"
          value={endDate}
          onChange={(newValue) => {
            if (startDate && newValue && newValue < startDate)
              setStartDate(null);
            setEndDate(newValue);
          }}
          slotProps={{ field: { clearable: true } }}
        />
      </LocalizationProvider>
    </FormControl>
  );
};

export function SelectTimeRangeFilter({ onTimeRangeChange }) {
  const endTimeParamKey = 'endDate';
  const startTimeParamKey = 'startDate';
  const timeRadioParamKey = 'timeRadio';
  const radioValues = { any: 'any', between: 'between' };

  const [searchParams, setSearchParams] = useSearchParams();
  const [radioValue, setRadioValue] = useState(() => {
    const paramValue = searchParams.get(timeRadioParamKey);
    if (paramValue === radioValues.any || paramValue === radioValues.between)
      return paramValue;
    else return radioValues.any;
  });

  const [startTime, setStartTime] = useState(
    paramToDayjs(searchParams, startTimeParamKey),
  );
  const [endTime, setEndTime] = useState(
    paramToDayjs(searchParams, endTimeParamKey),
  );

  // Update search params
  useEffect(() => {
    setSearchParams(
      (params) => {
        if (startTime?.isValid())
          params.set(startTimeParamKey, startTime.toISOString());
        else params.delete(startTimeParamKey);
        if (endTime?.isValid())
          params.set(endTimeParamKey, endTime.toISOString());
        else params.delete(endTimeParamKey);
        if (radioValue) params.set(timeRadioParamKey, radioValue);
        return params;
      },
      { replace: true },
    );
    // disabled for setSearchParams
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, endTime, radioValue]);

  // decides when and how to call onTimeRangeChange
  useEffect(() => {
    const values = {
      startTime: null,
      endTime: null,
    };

    if (radioValue === radioValues.between) {
      if (startTime?.isValid()) values.startTime = startTime;
      if (endTime?.isValid()) values.endTime = endTime;
    }

    if (onTimeRangeChange) onTimeRangeChange(values);
    // ignore onTimeRangeChaage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, endTime, radioValue, radioValues.any]);

  return (
    <FormControl>
      <FormLabel>Time</FormLabel>
      <RadioGroup
        defaultValue={radioValues.any}
        value={radioValue}
        onChange={(event) => {
          setRadioValue(event.target.value);
        }}
      >
        <FormControlLabel
          value={radioValues.any}
          label="Any"
          control={<Radio />}
        />
        <FormControlLabel
          value={radioValues.between}
          label="Between"
          control={<Radio />}
        />
      </RadioGroup>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CustomTimePicker
          label="Start Time"
          disabled={radioValue !== radioValues.between}
          value={startTime}
          onChange={(newValue) => setStartTime(newValue)}
          slotProps={{ field: { clearable: false } }}
        />
        <CustomTimePicker
          label="End Time"
          disabled={radioValue !== radioValues.between}
          value={endTime}
          onChange={(newValue) => setEndTime(newValue)}
          slotProps={{ field: { clearable: false } }}
        />
      </LocalizationProvider>
    </FormControl>
  );
}
