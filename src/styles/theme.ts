import { Theme } from "@mui/material";
import { createTheme } from "@mui/material/styles";

const theme: Theme = createTheme({
  palette: {
    primary: {
      main: "#363062",
      dark: "#4D4C7D",
      light: "#F5F5F5",
      contrastText: "#FDE5D4",
      // main: "#445D48",
      // dark: "#001524",
      // light: "#D6CC99",
      // contrastText: "#FDE5D4",
    },
    secondary: {
      main: "#4D4C7D",
      dark: "#363062",
      light: "#F99417",
      contrastText: "#F5F5F5",
    },
    error: {
      main: "#F44336",
      light: "#E57373",
    },
  },
});

export default theme;
