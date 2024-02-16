import { Typography } from '@mui/material';
import {
  CustomTimePicker,
  CustomDatePicker,
} from '../../helpers/styleComponents';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import { RadioGroup } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

export const DateFilterRadioValues = {
  upcoming: 'upcoming',
  between: 'between',
};
export const SelectDateRangeFilter = ({
  onChange: onChange,
  initialStartDateValue,
  initialEndDateValue,
  initialRadioValue,
}) => {
  const [radioValue, setRadioValue] = useState(
    initialRadioValue ?? DateFilterRadioValues.upcoming,
  );
  const [startDate, setStartDate] = useState(initialStartDateValue);
  const [endDate, setEndDate] = useState(initialEndDateValue);

  // decides when and how to call onDateRangeChange
  useEffect(() => {
    const values = {
      startDate: null,
      endDate: null,
      radioValue: radioValue,
    };

    if (radioValue === DateFilterRadioValues.upcoming) {
      values.startDate = dayjs();
    } else {
      if (startDate?.isValid()) values.startDate = startDate;
      if (endDate?.isValid()) values.endDate = endDate;
    }

    if (onChange) onChange(values);

    // ignore onChange
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, radioValue, DateFilterRadioValues.upcoming]);

  return (
    <FormControl className="section">
      <Typography variant="subtitle1" style={{ color: '#FFF' }}>
        Date
      </Typography>
      <RadioGroup
        defaultValue={DateFilterRadioValues.upcoming}
        value={radioValue}
        onChange={(event) => {
          setRadioValue(event.target.value);
        }}
      >
        <FormControlLabel
          value={DateFilterRadioValues.upcoming}
          label="Upcoming"
          control={<Radio />}
        />
        <FormControlLabel
          value={DateFilterRadioValues.between}
          label="Between"
          control={<Radio />}
        />
      </RadioGroup>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CustomDatePicker
          disabled={radioValue !== DateFilterRadioValues.between}
          label="Start Date"
          value={startDate}
          onChange={(newValue) => {
            if (endDate && newValue && newValue > endDate) setEndDate(null);
            setStartDate(newValue);
          }}
          slotProps={{ field: { clearable: true } }}
        />
        <CustomDatePicker
          disabled={radioValue !== DateFilterRadioValues.between}
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

export const SelectTimeRangeRadioValues = { any: 'any', between: 'between' };
export function SelectTimeRangeFilter({
  onTimeRangeChange: onChange,
  initialStartTimeValue,
  initialEndTimeValue,
  initialRadioValue,
}) {
  const [radioValue, setRadioValue] = useState(
    initialRadioValue ?? SelectTimeRangeRadioValues.any,
  );
  const [startTime, setStartTime] = useState(initialStartTimeValue);
  const [endTime, setEndTime] = useState(initialEndTimeValue);

  // decides when and how to call onTimeRangeChange
  useEffect(() => {
    const values = {
      startTime: null,
      endTime: null,
      radioValue: radioValue,
    };

    if (radioValue === SelectTimeRangeRadioValues.between) {
      if (startTime?.isValid()) values.startTime = startTime;
      if (endTime?.isValid()) values.endTime = endTime;
    }

    if (onChange) onChange(values);

    // ignore onChange
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, endTime, radioValue, SelectTimeRangeRadioValues.any]);

  return (
    <FormControl className="section">
      <Typography variant="subtitle1" style={{ color: '#FFF' }}>
        Time
      </Typography>
      <RadioGroup
        defaultValue={SelectTimeRangeRadioValues.any}
        value={radioValue}
        onChange={(event) => {
          setRadioValue(event.target.value);
        }}
      >
        <FormControlLabel
          value={SelectTimeRangeRadioValues.any}
          label="Any"
          control={<Radio />}
        />
        <FormControlLabel
          value={SelectTimeRangeRadioValues.between}
          label="Between"
          control={<Radio />}
        />
      </RadioGroup>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CustomTimePicker
          label="Start Time"
          disabled={radioValue !== SelectTimeRangeRadioValues.between}
          value={startTime}
          onChange={(newValue) => setStartTime(newValue)}
          slotProps={{ field: { clearable: false } }}
        />
        <CustomTimePicker
          label="End Time"
          disabled={radioValue !== SelectTimeRangeRadioValues.between}
          value={endTime}
          onChange={(newValue) => setEndTime(newValue)}
          slotProps={{ field: { clearable: false } }}
        />
      </LocalizationProvider>
    </FormControl>
  );
}
