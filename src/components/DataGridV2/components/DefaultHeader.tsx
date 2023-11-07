import { TableCell } from "@mui/material";
import { styled } from "@mui/material/styles";
export const DefaultHeader = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.primary.contrastText,
  border: "none",
}));
