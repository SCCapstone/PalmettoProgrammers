import { styled } from '@mui/material/styles';
import { Autocomplete, TextField, Select } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export const CustomAutocomplete = styled(Autocomplete)({
  '& .MuiInputBase-input': {
    color: 'green', // Change text color
  },
  '& .MuiInputLabel-root': {
    color: 'white', // Change label text color
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E340DC', // Change outline color
    },
    '&:hover fieldset': {
      borderColor: '#E340DC', // Change outline color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#E340DC', // Change outline color when focused
    },
  },
  '& .MuiAutocomplete-popupIndicator': {
    color: '#E340DC', // Change the color of the popup indicator icon
  },
  '& .MuiCheckbox-root': {
    color: '#E340DC', // Change the color of the checkbox
  },
  '& .Mui-selected': {
    backgroundColor: '#E340DC', // Change the background color of selected options
    '&:hover': {
      backgroundColor: '#E340DC', // Change the background color of selected options on hover
    },
  },
  '& .MuiAutocomplete-clearIndicator': {
    color: '#E340DC', // Change the color of the clear button
  },
});

export const CustomTimePicker = styled(TimePicker)({
  '& .MuiInputLabel-root': {
    color: 'white', // Change label text color
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E340DC', // Change outline color
    },
    '&:hover fieldset': {
      borderColor: '#E340DC', // Change outline color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#E340DC', // Change outline color when focused
    },
  },
  '& .MuiIconButton-root': {
    color: '#E340DC', // Change clear button color
  },
});

export const CustomDatePicker = styled(DatePicker)({
  '& .MuiInputLabel-root': {
    color: 'white', // Change label text color
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E340DC', // Change outline color
    },
    '&:hover fieldset': {
      borderColor: '#E340DC', // Change outline color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#E340DC', // Change outline color when focused
    },
  },
  '& .MuiIconButton-root': {
    color: '#E340DC', // Change clear button color
  },
});

export const CustomTextField = styled(TextField)({
  '& .MuiInputLabel-root': {
    color: 'white', // Change label text color
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E340DC',
    },
    '&:hover fieldset': {
      borderColor: '#E340DC',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#E340DC',
    },
  },
});

export const CustomDateTimePicker = styled(DateTimePicker)({
  '& .MuiInputLabel-root': {
    color: 'white', // Change label text color
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E340DC', // Change outline color
    },
    '&:hover fieldset': {
      borderColor: '#E340DC', // Change outline color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#E340DC', // Change outline color when focused
    },
  },
  '& .MuiIconButton-root': {
    color: '#E340DC', // Change clear button color
  },
});

export const CustomSelect = styled(Select)({
  '& .MuiInputLabel-root': {
    color: 'white', // Change label text color
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E340DC',
    },
    '&:hover fieldset': {
      borderColor: '#E340DC',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#E340DC',
    },
  },
  '& .MuiSelect-icon': {
    color: '#E340DC', // Change the color of the select icon
  },
});
