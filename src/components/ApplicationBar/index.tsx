import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import { applicationBarProperties } from "../ViewWrapper/viewWrapperProperties";
const drawerWidth: number = 300;
const ApplicationBar: any = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<applicationBarProperties>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default ApplicationBar;
