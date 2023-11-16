import ViewWrapper from "@/components/ViewWrapper";
import { Box, Grid, Icon, Paper, Typography } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  return (
    <ViewWrapper
      loading={loading}
      alerMessage="alertMessage"
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
          <Paper
            sx={{
              p: 2,
              bgcolor: (theme) => theme.palette.secondary.contrastText,
            }}
          >
            <Grid container spacing={4}>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="body2">
                  <b>Total de usuários</b>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid container spacing={4}>
                  <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                    <Box
                      sx={{
                        widht: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2">12%</Typography>
                      <Icon>north_east</Icon>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Icon sx={{ fontSize: 40 }}>people</Icon>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="h4">
                  <b>1233</b>
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </ViewWrapper>
  );
}
