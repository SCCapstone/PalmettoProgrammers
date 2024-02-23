import { createTheme } from '@mui/material/styles';

const COLORS = {
  PRIMARY_MAIN: '#e354dc',
  SECONDARY_MAIN: '#4290f5',
  BACKGROUND_PAPER: '#31084a',
  BACKGROUND_DEFAULT: '#23194f',
};

const Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: PRIMARY_MAIN,
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
          color: PRIMARY_MAIN,
          borderColor: PRIMARY_MAIN,
          border: '2px solid ${COLORS.PRIMARY_MAIN}',
        },
      },
    },
  },
});

export default Theme;
