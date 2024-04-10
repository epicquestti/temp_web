import ViewWrapper from "@/components/ViewWrapper";
import { Add } from "@mui/icons-material";
import { Box, Fab, Grid, Paper } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Customer() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alerMessage, setAlerMessage] = useState<string>("");
  return (
    <ViewWrapper
      locals={[
        {
          text: "Início",
          iconName: "home",
          href: "/",
        },
        {
          text: "Planos",
          iconName: "assignment",
          href: "/plans",
        },
      ]}
      outsideContent={
        <Box
          sx={{
            width: "100%",
            display: "flex",
            pb: 1,
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <Fab
            color="primary"
            onClick={() => {
              router.push("/plans/management/new");
            }}
          >
            <Add />
          </Fab>
        </Box>
      }
      loading={loading}
      alerMessage={alerMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      title="Planos"
    >
      <Paper>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            asdddd
          </Grid>
        </Grid>
      </Paper>
    </ViewWrapper>
  );
}
