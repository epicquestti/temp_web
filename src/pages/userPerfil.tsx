import ViewWrapper from "@/components/ViewWrapper";
import { Grid, Paper } from "@mui/material";
import { useState } from "react";

export default function SecurityGroup() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alerMessage, setAlerMessage] = useState<string>("");
  const [gridLoading, setGridLoading] = useState<boolean>(false);
  const [gridCount, setGridCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [functionList, setFunctionList] = useState<
    {
      id: bigint;
      name: string;
      active: boolean;
    }[]
  >([]);
  return (
    <ViewWrapper
      locals={[
        {
          text: "Início",
          iconName: "home",
          href: "/",
        },
        {
          text: "Perfil de usuário",
          iconName: "assignment_ind",
          href: "/userPerfil",
        },
      ]}
      loading={loading}
      alerMessage={alerMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      title="Perfil de usuário"
    >
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                asd
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                zxc
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
            <Grid container spacing={2} alignItems="center"></Grid>
          </Grid>
        </Grid>
      </Paper>
    </ViewWrapper>
  );
}
