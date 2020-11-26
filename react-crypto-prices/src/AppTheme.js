import { blue, pink } from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue[500],
    },
    secondary: {
      main: pink[500],
    },
  },
});

export default function AppTheme(props) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <props.app />
    </ThemeProvider>
  );
}
