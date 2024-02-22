import { createTheme } from '@mui/material/styles';

const PRIMARY_MAIN = '#e354dc';

const Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: PRIMARY_MAIN,
    },
    secondary: {
      main: '#42a5f5',
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
          border: '2px solid ${PRIMARY_MAIN}',
        },
      },
    },
  },
});

export default Theme;
