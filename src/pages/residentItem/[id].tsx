import SpeedDialButton from "@/components/SpeedDialButton";
import ViewWrapper from "@/components/ViewWrapper";
import { useApplicationContext } from "@/context/ApplicationContext";
import fetchApi from "@/lib/fetchApi";
import { cpfMask, phoneMask } from "@/lib/masks";
import {
  AttachFile,
  AttachMoney,
  Edit,
  History,
  Message,
  Save,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, Fragment, ReactNode, useEffect, useState } from "react";
import LoagindGridGif from "../../components/DataGridV2/components/assets/loading.gif";
import { residentTypeProps } from "../habitationItem/residentModal";

export default function ResidentItem() {
  const router = useRouter();
  const id = router.query.id;
  const context = useApplicationContext();

  const [loading, setLoading] = useState<boolean>(false);
  const [screenLoading, setScreenLoading] = useState<boolean>(false);
  const [allowEditing, setAllowEditing] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const buttonActions: { icon: ReactNode; name: string }[] = [
    {
      icon: <Message sx={{ color: (theme) => theme.palette.primary.dark }} />,
      name: "Mensagem",
    },
    {
      icon: (
        <AttachFile sx={{ color: (theme) => theme.palette.primary.dark }} />
      ),
      name: "Arquivo",
    },
    {
      icon: <History sx={{ color: (theme) => theme.palette.primary.dark }} />,
      name: "Histórico",
    },
    {
      icon: (
        <AttachMoney sx={{ color: (theme) => theme.palette.primary.dark }} />
      ),
      name: "Financeiro",
    },
  ];

  const [condo, setCondo] = useState<{ condoId: string; condoName: string }>({
    condoId: "",
    condoName: "",
  });
  const [block, setBlock] = useState<{ blockId: string; blockName: string }>({
    blockId: "",
    blockName: "",
  });
  const [habitation, setHabitation] = useState<{
    habitationId: string;
    habitationName: string;
  }>({
    habitationId: "",
    habitationName: "",
  });

  const [resident, setResident] = useState<residentTypeProps>({
    id: "",
    name: "",
    cpf: "",
    phone: "",
    isEmployee: false,
    isPropertyOwner: false,
    nameChange: () => {},
    cpfChange: () => {},
    phoneChange: () => {},
    emailChange: () => {},
    isEmployeeChange: () => {},
    isPropertyOwnerChange: () => {},
  });

  const initialSetup = async () => {
    try {
      setScreenLoading(true);
      //Buscar o residente
      const residentById = await fetchApi.get(`/residents/${id}`, {
        headers: {
          "router-id": "WEB#API",
          Authorization: context.getToken(),
        },
      });

      if (residentById.success) {
        setResident(residentById.data);
      }

      //Buscar a moradia do residente
      const habitationResponse = await fetchApi.get(
        `/habitations/${residentById.data.habitationId}`,
        {
          headers: {
            "router-id": "WEB#API",
            Authorization: context.getToken(),
          },
        }
      );

      console.log("habitationResponse", habitationResponse);

      if (habitationResponse.success) {
        const data = habitationResponse.data;
        setHabitation({
          habitationId: data.habitation[0].habitationId,
          habitationName: data.habitation[0].habitationName,
        });
        setCondo((prev) => ({
          ...prev,
          condoId: data.habitation[0].condominiumId,
          condoName: data.habitation[0].condominiumName,
        }));
        setBlock((prev) => ({
          ...prev,
          blockId: data.habitation[0].blockId,
          blockName: data.habitation[0].blockName,
        }));
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
  }, [id]);

  const validateAndAlert = (condition: boolean, message: string): boolean => {
    if (condition) {
      setLoading(false);
      setAlertMessage(message);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 6000);
      return true;
    }
    return false;
  };

  const updateResident = async () => {
    try {
      setLoading(true);

      if (
        validateAndAlert(
          resident.name === "",
          "Por favor, preencha o nome do morador"
        ) ||
        validateAndAlert(
          resident.cpf === "",
          "Por favor, preencha o CPF do morador"
        ) ||
        validateAndAlert(
          resident.phone === "",
          "Por favor, preencha o Telefone do morador"
        )
      ) {
        return;
      }

      const updateResponse = await fetchApi.post(
        `/residents/update/${resident.id}`,
        resident,
        {
          headers: {
            "router-id": "WEB#API",
            Authorization: context.getToken(),
          },
        }
      );

      console.log("updateResponse", updateResponse);

      if (updateResponse.success) {
        setAlertMessage("Residente editado com sucesso.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        setLoading(false);
        setAllowEditing(false);
      } else {
        setAlertMessage(
          "Erro ao editar residente. Por favor, tente novamente."
        );
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error.message);
    }
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
          text: "Condomínios",
          iconName: "home_work",
          href: "/condominium",
        },
        {
          text: `${condo.condoName}`,
          iconName: "home_work",
          href: `/condoItem/${condo.condoId}`,
        },
        {
          text:
            block.blockId !== "" && block.blockId !== null
              ? `${block.blockName}`
              : "Bloco não Informado",
          iconName: "apartment",
          href:
            block.blockId !== "" && block.blockId !== null
              ? `/blockItem/${block.blockId}`
              : `/habitationItem/${habitation.habitationId}`,
        },
        {
          text: `${habitation.habitationName}`,
          iconName: "home",
          href: `/habitationItem/${habitation.habitationId}`,
        },
        {
          text: `${resident.name}`,
          iconName: "person",
          href: `/residentItem/${resident.id}`,
        },
      ]}
      loading={loading}
      alerMessage={alertMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      title="Moradores"
    >
      {screenLoading ? (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
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
                    <Typography variant="h4">Dados do Morador</Typography>
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

                {allowEditing ? (
                  <Fragment>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        label="Nome"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={resident.name}
                        onChange={(
                          event: ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                          >
                        ) => {
                          setResident((prev) => ({
                            ...prev,
                            name: event.target.value,
                          }));
                        }}
                        inputProps={{ maxLength: 100 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        label="CPF"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={cpfMask(resident.cpf)}
                        onChange={(
                          event: ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                          >
                        ) => {
                          setResident((prev) => ({
                            ...prev,
                            cpf: event.target.value,
                          }));
                        }}
                        inputProps={{ maxLength: 14 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        label="Telefone"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={phoneMask(resident.phone)}
                        onChange={(
                          event: ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                          >
                        ) => {
                          setResident((prev) => ({
                            ...prev,
                            phone: event.target.value,
                          }));
                        }}
                        inputProps={{ maxLength: 15 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        label="E-Mail"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={resident.email}
                        onChange={(
                          event: ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                          >
                        ) => {
                          setResident((prev) => ({
                            ...prev,
                            email: event.target.value,
                          }));
                        }}
                        inputProps={{ maxLength: 100 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={resident.isPropertyOwner}
                            onChange={(
                              event: ChangeEvent<HTMLInputElement>,
                              checked: boolean
                            ) => {
                              setResident((prev) => ({
                                ...prev,
                                isPropertyOwner: checked,
                              }));
                            }}
                          />
                        }
                        label="Titular do Imóvel?"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={resident.isEmployee}
                            onChange={(
                              event: ChangeEvent<HTMLInputElement>,
                              checked: boolean
                            ) => {
                              setResident((prev) => ({
                                ...prev,
                                isEmployee: checked,
                              }));
                            }}
                          />
                        }
                        label="Empregado do Imóvel?"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<Save />}
                        type="submit"
                        onClick={() => {
                          updateResident();
                        }}
                      >
                        Salvar
                      </Button>
                    </Grid>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Typography>
                        Nome: <b>{resident.name}</b>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Typography>
                        CPF: <b>{cpfMask(resident.cpf)}</b>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Typography>
                        Telefone: <b>{phoneMask(resident.phone)}</b>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Typography>
                        Email:{" "}
                        <b>
                          {resident.email ? resident.email : "Não informado"}
                        </b>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Typography>
                        Titular do Imóvel?:{" "}
                        <b>{resident.isPropertyOwner ? "Sim" : "Não"}</b>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Typography>
                        Empregado/a do Imóvel?:{" "}
                        <b>{resident.isEmployee ? "Sim" : "Não"}</b>
                      </Typography>
                    </Grid>
                  </Fragment>
                )}
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <SpeedDialButton actions={buttonActions} />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </ViewWrapper>
  );
}
