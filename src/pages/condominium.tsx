import ViewWrapper from "@/components/ViewWrapper";
import { useApplicationContext } from "@/context/ApplicationContext";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Box, Grid, IconButton, Paper, Typography } from "@mui/material";
import { useState } from "react";

export default function Condominium() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [showDeleteQuestion, setShowDeleteQuestion] = useState<boolean>(false);

  const context = useApplicationContext();

  const [residentsGridArray, setResidentsGridArray] = useState<
    {
      active: boolean;
      createdAt: Date;
      createdById: bigint;
      id: bigint;
      methodId: bigint;
      name: string;
      numberOfMontlyPayment: number;
      ruleValue: number;
    }[]
  >([]);
  const [gridLoading, setGridLoading] = useState<boolean>(false);
  const [residentsGridCount, setResidentsGridCount] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [page, setPage] = useState<number>(0);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const [condominiumId, setCondominiumId] = useState<number | null>(null);

  return (
    <ViewWrapper
      locals={[
        {
          text: "Início",
          iconName: "home",
          href: "/",
        },
        {
          text: "Condomínios",
          iconName: "home_work",
          href: "/condominium",
        },
      ]}
      loading={loading}
      alerMessage={alertMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      title="Condomínios"
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper sx={{ p: 3 }}>
            <Grid
              container
              spacing={3}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12} sm={12} md={11} lg={11} xl={11}>
                <Typography
                  variant="h6"
                  sx={{ color: (theme) => theme.palette.secondary.light }}
                >
                  Pesquisa de Condomínios
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    onClick={() => {
                      setShowSearch(!showSearch);
                    }}
                  >
                    {showSearch ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
              </Grid>
              {showSearch && <></>}
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper sx={{ p: 3 }}>
            <Grid
              container
              spacing={3}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography
                  variant="h6"
                  sx={{ color: (theme) => theme.palette.secondary.light }}
                >
                  {condominiumId !== null
                    ? "Edite Condomínios"
                    : "Crie Novos Condomínios"}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </ViewWrapper>
  );
}
