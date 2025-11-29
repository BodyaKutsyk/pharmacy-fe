import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#43a047' },
    secondary: { main: '#f50057' },
    text: {
      primary: '#dcedc8',
      secondary: '#e0f7fa',
    },
    background: {
      default: '#071004',
      paper: '#061406',
    },
    divider: 'rgba(220,237,200,0.18)',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 0 transparent inset !important;
      }`,
    },
    MuiButton: {
      styleOverrides: {
        root: { minWidth: 0 },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&:-webkit-autofill': {
            transitionDelay: '9999s',
            transitionProperty: 'background-color, color',

            WebkitTextFillColor: '#000',
          },
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2E7D32' },
    secondary: { main: '#D81B60' },
    background: {
      default: '#F7FBF5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1B1B1B',
      secondary: '#4B5A4B',
    },
    divider: 'rgba(46,125,50,0.2)',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 0 transparent inset !important;
      }`,
    },
    MuiButton: {
      styleOverrides: {
        root: { minWidth: 0 },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&:-webkit-autofill': {
            transitionDelay: '9999s',
            transitionProperty: 'background-color, color',

            WebkitTextFillColor: '#000',
          },
        },
      },
    },
  },
});
