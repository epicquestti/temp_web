import { Box, CircularProgress } from "@mui/material";
import { FC } from "react";

const LoadingBox: FC = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "70vh",
        maxWidth: 360,
        bgcolor: (theme) => theme.palette.primary.light,
        display: "flex",
        justifyItems: "center",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
      component="nav"
    >
      <CircularProgress size={20} />
    </Box>
  );
};

export default LoadingBox;
