import { Box, Grid, Typography } from "@mui/material";
import { NextPage } from "next";

const NotFond500: NextPage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: (theme) => theme.palette.secondary.main,
      }}
    >
      <Grid container justifyContent="center" spacing={3} textAlign="center">
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography
            variant="h1"
            sx={{ color: (theme) => theme.palette.secondary.light }}
          >
            500
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography
            variant="body1"
            sx={{ color: (theme) => theme.palette.primary.light }}
          >
            Algo deu Errado. Não se preocupe e tente novamente mais tarde.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
export default NotFond500;
