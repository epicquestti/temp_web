import { styled } from "@mui/material/styles";
import { DefaultHeader } from "./DefaultHeader";
export const LeftCheckHeader = styled(DefaultHeader)(() => ({
  width: "3%",
  textAlign: "center",
  borderTopLeftRadius: "4px",
  borderBottomLeftRadius: "4px",
  padding: 0,
}));
