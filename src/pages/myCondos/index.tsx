import ViewWrapper from "@/components/ViewWrapper";
import { useApplicationContext } from "@/context/ApplicationContext";
import fetchApi from "@/lib/fetchApi";
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
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoagindGridGif from "../../components/DataGridV2/components/assets/loading.gif";

export default function MyCondos() {
  const [loading, setLoading] = useState<boolean>(false);
  const [screenLoading, setScreenLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showSubscription, setShowSubscription] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const [condosArray, setCondosArray] = useState<any[]>([]);
  const [contractorKeys, setContractorKeys] = useState<
    { id: string; value: string }[]
  >([]);

  const context = useApplicationContext();

  const initialSetup = async () => {
    try {
      setScreenLoading(true);
      const controllerResponse = await fetchApi.get(`/contractor/get-condos`, {
        headers: {
          Authorization: context.getToken(),
          "router-id": "WEB#API",
        },
      });

      if (controllerResponse.data && controllerResponse.data.length > 0) {
        setCondosArray(controllerResponse.data);
      }

      const contractorKeys = await fetchApi.get(
        `/subscriptionKeys/contractor/${controllerResponse.data[0].contractorId}`,
        {
          headers: {
            Authorization: context.getToken(),
            "router-id": "WEB#API",
          },
        }
      );

      if (contractorKeys.data.length > 0) {
        setContractorKeys(contractorKeys.data);
      }
      setScreenLoading(false);
    } catch (error: any) {
      setScreenLoading(false);
      console.log(error.message);
    }
  };

  useEffect(() => {
    initialSetup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {screenLoading ? (
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Box sx={{ marginTop: "20%" }}>
              <Image
                src={LoagindGridGif}
                alt="GIF de carregamento"
                width={250}
                height={250}
                priority
              />
            </Box>
          </Grid>
        ) : (
          <>
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
                                {item.street}, {item.streetNumber} - {item.city}
                                -{item.state}
                              </Typography>
                            </Box>
                          </Link>
                        </Tooltip>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Typography>
                        Você ainda não cadastrou nenhum condomínio. Clique no
                        botão acima para começar.
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>
          </>
        )}
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
            {contractorKeys.length > 0
              ? contractorKeys.map((item, index) => (
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
                        <Link href={`/condoRegister/${item.id}`}>
                          <IconButton
                            sx={{
                              color: (theme) => `${theme.palette.primary.dark}`,
                            }}
                            onClick={() => {
                              navigator.clipboard.writeText(item.value);
                            }}
                          >
                            {<CopyAll />}
                          </IconButton>
                        </Link>
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
