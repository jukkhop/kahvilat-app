import { createMuiTheme } from '@material-ui/core'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#c8ad90',
      light: '#e4d7ca',
      dark: '#b18b62',
      contrastText: 'white',
    },
  },
  typography: {
    fontFamily: 'Source Sans Pro',
    button: {
      fontFamily: 'Montserrat',
      fontWeight: 600,
      letterSpacing: '1.5px',
    },
  },
})

export { theme }
