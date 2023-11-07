import { styled } from "@mui/material/styles";
import { DefaultHeader } from "./DefaultHeader";

export const RigthHeader = styled(DefaultHeader)(() => ({
  borderTopRightRadius: "4px",
  borderBottomRightRadius: "4px",
  padding: 0,
}));
