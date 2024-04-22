import { createTheme } from '@mui/material/styles';

// Main color palatte for the application
const COLORS = {
  PRIMARY_MAIN: '#e354dc',
  SECONDARY_MAIN: '#4290f5',
  BACKGROUND_PAPER: '#31084a',
  BACKGROUND_DEFAULT: '#23194f',
};

// Create Theme for the ThemeProvider
const Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: COLORS.PRIMARY_MAIN,
    },
    secondary: {
      main: COLORS.SECONDARY_MAIN,
    },
    background: {
      paper: COLORS.BACKGROUND_PAPER,
      default: COLORS.BACKGROUND_DEFAULT,
    },
  },
  components: {
    MuiChip: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          color: COLORS.PRIMARY_MAIN,
          borderColor: COLORS.PRIMARY_MAIN,
          border: '2px solid ${COLORS.PRIMARY_MAIN}',
        },
      },
    },
  },
});

export default Theme;
