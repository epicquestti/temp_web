import ViewWrapper from "@/components/ViewWrapper";
import { useApplicationContext } from "@/context/ApplicationContext";
import fetchApi from "@/lib/fetchApi";
import { Add, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Fab,
  Grid,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function HabitationItem() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [allowEditing, setAllowEditing] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const router = useRouter();
  const id = router.query.id;
  const context = useApplicationContext();

  const initialSetup = async () => {
    const controllerResponse = await fetchApi.get(`/habitations/${id}`, {
      headers: {
        "router-id": "WEB#API",
        Authorization: context.getToken(),
      },
    });

    if (controllerResponse.success) {
    }

    console.log("controllerResponse", controllerResponse);
  };

  useEffect(() => {
    initialSetup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {
          text: "Blocos",
          iconName: "apartment",
          href: "/blocks",
        },
        {
          text: "Habitações",
          iconName: "home",
          href: "/habitations",
        },
      ]}
      loading={loading}
      alerMessage={alertMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      title="Habitações"
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper sx={{ p: 3 }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h4">Dados da Habitação</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Button
                    endIcon={<Edit />}
                    variant="contained"
                    onClick={() => {
                      setAllowEditing(!allowEditing);
                    }}
                  >
                    Editar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper sx={{ p: 3 }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
                    <Typography variant="h4">Moradores da Habitação</Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Tooltip title="Adicionar Morador">
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        <Fab color="primary" aria-label="add">
                          <Add />
                        </Fab>
                      </Box>
                    </Tooltip>
                  </Grid>
                </Grid>
                {/* {habitationsArray.length > 0 &&
                  habitationsArray.map((item, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      key={index}
                    >
                      <Tooltip title="Clique para visualizar a habitação">
                        <Link
                          href={`/habitationItem/${item.id}`}
                          style={{
                            textDecoration: "none",
                            color: "#000",
                          }}
                        >
                          <Box
                            sx={{
                              border: (theme) =>
                                `2px solid ${theme.palette.primary.dark}`,
                              padding: 1,
                              borderRadius: 2,
                              marginTop: 1,
                            }}
                          >
                            <Typography>
                              Nome: <b>{item.nameOrNumber}</b>
                            </Typography>
                          </Box>
                        </Link>
                      </Tooltip>
                    </Grid>
                  ))} */}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </ViewWrapper>
  );
}
