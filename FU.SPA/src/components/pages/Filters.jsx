import { Typography } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import { RadioGroup } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useState } from 'react';
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

  /**
   * Change handler for the DateRange filter
   *
   * @param {string} type the type of value being changed
   * @param {Object} newValues the new values for the filter {startDate, endDate, radioValue}
   */
  const handleFormControlChange = (type, newValues) => {
    // Set the new value based on the type being changed
    if (type === 'radio') {
      setRadioValue(newValues.radioValue);
    } else if (type === 'startDate') {
      setStartDate(newValues.startDate);
    } else if (type === 'endDate') {
      setEndDate(newValues.endDate);
    }

    // Make sure the dates are valid
    if (radioValue === DateFilterRadioValues.upcoming) {
      // When looking for upcoming posts, the start date should be today
      newValues.startDate = dayjs();
      newValues.endDate = null;
    } else {
      // When looking for a date range, make sure the dates are valid
      if (!startDate?.isValid()) newValues.startDate = null;
      if (!endDate?.isValid()) newValues.endDate = null;
    }

    // Call the parent onChange handler
    if (onChange) onChange(newValues);
  };

  return (
    <FormControl className="section">
      <Typography variant="subtitle1" style={{ color: '#FFF' }}>
        Date
      </Typography>
      <RadioGroup
        defaultValue={DateFilterRadioValues.upcoming}
        value={radioValue}
        onChange={(event) => {
          const newValue = event.target.value;
          handleFormControlChange('radio', {
            startDate: startDate,
            endDate: endDate,
            radioValue: newValue,
          });
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
        <DatePicker
          disabled={radioValue !== DateFilterRadioValues.between}
          label="Start Date"
          value={startDate}
          onChange={(newValue) => {
            if (endDate && newValue && newValue > endDate) setEndDate(null);
            handleFormControlChange('startDate', {
              startDate: newValue,
              endDate: endDate,
              radioValue: radioValue,
            });
          }}
          slotProps={{ field: { clearable: true } }}
        />
        <DatePicker
          disabled={radioValue !== DateFilterRadioValues.between}
          label="End Date"
          value={endDate}
          onChange={(newValue) => {
            if (startDate && newValue && newValue < startDate)
              handleFormControlChange('startDate', {
                startDate: null,
                endDate: endDate,
                radioValue: radioValue,
              });
            handleFormControlChange('endDate', {
              startDate: startDate,
              endDate: newValue,
              radioValue: radioValue,
            });
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

  /**
   * The change handler for the TimeRange filter
   *
   * @param {string} type the type of value being changed
   * @param {Object} newValues the new values for the filter {startTime, endTime, radioValue}
   */
  const handleFormControlChange = (type, newValues) => {
    // Set the new value based on the type being changed
    if (type === 'radio') {
      setRadioValue(newValues.radioValue);
    } else if (type === 'startTime') {
      setStartTime(newValues.startTime);
    } else if (type === 'endTime') {
      setEndTime(newValues.endTime);
    }

    // Make sure the times are valid
    if (radioValue === SelectTimeRangeRadioValues.between) {
      if (!startTime?.isValid()) newValues.startTime = null;
      if (!endTime?.isValid()) newValues.endTime = null;
    }

    // Call the parent onChange handler
    if (onChange) onChange(newValues);
  };

  return (
    <FormControl className="section">
      <Typography variant="subtitle1" style={{ color: '#FFF' }}>
        Time
      </Typography>
      <RadioGroup
        defaultValue={SelectTimeRangeRadioValues.any}
        value={radioValue}
        onChange={(event) => {
          const newValue = event.target.value;
          handleFormControlChange('radio', {
            startTime: startTime,
            endTime: endTime,
            radioValue: newValue,
          });
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
        <TimePicker
          label="Start Time"
          disabled={radioValue !== SelectTimeRangeRadioValues.between}
          value={startTime}
          onChange={(newValue) =>
            handleFormControlChange('startTime', {
              startTime: newValue,
              endTime: endTime,
              radioValue: radioValue,
            })
          }
          slotProps={{ field: { clearable: false } }}
        />
        <TimePicker
          label="End Time"
          disabled={radioValue !== SelectTimeRangeRadioValues.between}
          value={endTime}
          onChange={(newValue) =>
            handleFormControlChange('endTime', {
              startTime: startTime,
              endTime: newValue,
              radioValue: radioValue,
            })
          }
          slotProps={{ field: { clearable: false } }}
        />
      </LocalizationProvider>
    </FormControl>
  );
}
