import ViewWrapper from "@/components/ViewWrapper";
import { CopyAll, Home } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";

export default function MyCondos() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showSubscription, setShowSubscription] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const condosArray: any[] = [
    {
      id: "1",
      name: "Condomínio 1",
      address: "Avenida Brasil",
      addressNumber: "110",
      city: "Franca",
      state: "SP",
    },
    {
      id: "2",
      name: "Condomínio 2",
      address: "Avenida Brasil",
      addressNumber: "110",
      city: "Franca",
      state: "SP",
    },
    {
      id: "3",
      name: "Condomínio 3",
      address: "Avenida Brasil",
      addressNumber: "110",
      city: "Franca",
      state: "SP",
    },
    {
      id: "4",
      name: "Condomínio 4",
      address: "Avenida Brasil",
      addressNumber: "110",
      city: "Franca",
      state: "SP",
    },
  ];

  const keys: any[] = [
    {
      id: "1",
      value: "ajsdb23847KJBasd982",
    },
    {
      id: "2",
      value: "ajsdb23847KJBasd982",
    },
    {
      id: "3",
      value: "ajsdb23847KJBasd982",
    },
  ];

  const addCondo = async () => {
    setShowSubscription(true);
  };

  return (
    <ViewWrapper
      locals={[
        {
          text: "Início",
          iconName: "home",
          href: "/",
        },
        {
          text: "Meus Condomínios",
          iconName: "home_work",
          href: "/myCondos",
        },
      ]}
      loading={loading}
      alerMessage={alertMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      title="Meus Condomínios"
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
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    endIcon={<Home />}
                    sx={{ fontSize: 17 }}
                    //no onclick o sistema tem que verificar as chaves do cliente
                    //e mostrar quais são, com a possiblidade de copiar o valor
                    //para o clipboard. Caso ele não tenha nenhuma chave, navegar
                    //para a tela onde ele pode assinar o plano.
                    onClick={addCondo}
                  >
                    Adicionar Condomínio
                  </Button>
                </Box>
              </Grid>
              {condosArray.length > 0 ? (
                condosArray.length > 0 &&
                condosArray.map((item, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    key={index}
                  >
                    <Tooltip title="Clique para visualizar o condomínio">
                      <Link
                        href={`/condoItem/${item.id}`}
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
                          }}
                        >
                          <Typography sx={{ fontWeight: "bold" }}>
                            {item.name}
                          </Typography>
                          <Typography sx={{ fontWeight: "bold" }}>
                            {item.address}, {item.addressNumber} {item.city}-
                            {item.state}
                          </Typography>
                        </Box>
                      </Link>
                    </Tooltip>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Typography>
                    Você ainda não cadastrou nenhum condomínio. Clique no botão
                    acima para começar.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Dialog
        open={showSubscription}
        onClose={() => {
          setShowSubscription(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Suas Chaves Disponíveis
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {keys.length > 0
              ? keys.map((item, index) => (
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                    key={item.id}
                  >
                    <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
                      <Typography key={item.id}>
                        <b>{item.value}</b>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                      <Tooltip title="Utilizar esta Chave">
                        <IconButton
                          sx={{
                            color: (theme) => `${theme.palette.primary.dark}`,
                          }}
                        >
                          {<CopyAll />}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                ))
              : `Você não possui nenhuma chave do produto disponível. Clique no botão "Obter Chave" para comprar uma licença de uso.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowSubscription(false);
            }}
          >
            Fechar
          </Button>
          <Link href={"/plansPrices"}>
            <Button
              onClick={() => {
                // deletePlan();
              }}
              autoFocus
              variant="contained"
            >
              Obter Chave
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </ViewWrapper>
  );
}
