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

export const SelectDateRangeFilter = ({
  onStartDateChange,
  onEndDateChange,
}) => {
  const endDateParamKey = 'endDate';
  const startDateParamKey = 'startDate';
  const dateRadioParamKey = 'dateRadio';

  const [searchParams, setSearchParams] = useSearchParams();
  const [radioValue, setRadioValue] = useState(() => {
    const paramValue = searchParams.get(dateRadioParamKey);
    if (paramValue === 'upcoming' || paramValue === 'between')
      return paramValue;
    else return 'upcoming';
  });

  const [startDate, setStartDate] = useState(
    paramToDayjs(searchParams, startDateParamKey),
  );
  const [endDate, setEndDate] = useState(
    paramToDayjs(searchParams, endDateParamKey),
  );

  // Update search params when startDate or endDate is updated
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

  useEffect(() => {
    if (startDate?.isValid()) onStartDateChange(startDate);
  }, [startDate, onStartDateChange]);

  useEffect(() => {
    if (endDate?.isValid()) onEndDateChange(endDate);
  }, [endDate, onEndDateChange]);

  return (
    <FormControl>
      <FormLabel id="demo-controlled-radio-buttons-group">Date</FormLabel>
      <RadioGroup
        defaultValue="upcoming"
        value={radioValue}
        onChange={(event) => {
          setRadioValue(event.target.value);
        }}
      >
        <FormControlLabel
          value="upcoming"
          label="Upcoming"
          control={<Radio />}
        />
        <FormControlLabel value="between" label="Between" control={<Radio />} />
      </RadioGroup>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="From"
          value={startDate}
          onChange={(newValue) => {
            if (endDate && newValue && newValue > endDate) setEndDate(null);
            setStartDate(newValue);
          }}
          slotProps={{ field: { clearable: true } }}
        />
        <DatePicker
          label="To"
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
