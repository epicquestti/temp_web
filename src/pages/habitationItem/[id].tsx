import ViewWrapper from "@/components/ViewWrapper";
import { useApplicationContext } from "@/context/ApplicationContext";
import fetchApi from "@/lib/fetchApi";
import { cpfMask, phoneMask } from "@/lib/masks";
import { Add, DeleteForever, Edit, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ResidentModal, { residentTypeProps } from "./residentModal";

export default function HabitationItem() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [allowEditing, setAllowEditing] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const [habitation, setHabitation] = useState<{
    id: string;
    nameOrNumber: string;
  }>({
    id: "",
    nameOrNumber: "",
  });

  const [showResidentModal, setShowResidentModal] = useState<boolean>(false);
  const [showDeleteResidentControl, setShowDeleteResidentControl] =
    useState<boolean>(false);
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

  const [residentsArray, setResidentsArray] = useState<residentTypeProps[]>([]);

  const router = useRouter();
  const { id } = router.query;
  const context = useApplicationContext();

  const initialSetup = async () => {
    const controllerResponse = await fetchApi.get(`/habitations/${id}`, {
      headers: {
        "router-id": "WEB#API",
        Authorization: context.getToken(),
      },
    });

    if (controllerResponse.success) {
      setHabitation({
        id: controllerResponse.data.habitation.id,
        nameOrNumber: controllerResponse.data.habitation.nameOrNumber,
      });
      if (controllerResponse.data.residents.length > 0) {
        setResidentsArray(controllerResponse.data.residents);
      }
    }

    console.log("controllerResponse", controllerResponse);
  };

  useEffect(() => {
    initialSetup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const clearResident = () => {
    setResident({
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
  };

  const addResident = async () => {
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

    const existingResident = residentsArray.find(
      (value) => value.cpf === resident.cpf
    );

    if (existingResident) {
      setShowAlert(true);
      setAlertMessage("Já existe um morador cadastrado com este CPF.");
      return;
    }

    residentsArray.push(resident);
    clearResident();
    setShowResidentModal(false);
  };

  const updateHabitation = async () => {
    try {
      const habitationObj = {};

      //Fazer update da habitação com os moradores a cada vez que o usuário deletar um valor
      const controllerResponse = await fetchApi.post(
        `/habitations/update/${id}`,
        {
          //Objeto da Habitação com os devidos moradores
        },
        {
          headers: {
            "router-id": "WEB#API",
            Authorization: context.getToken(),
          },
        }
      );
    } catch (error) {
      setAlertMessage("Erro ao editar Moradia");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  const deleteResident = async (cpf: string) => {
    try {
      setShowDeleteResidentControl(false);
      const residentIndex = residentsArray.findIndex(
        (resident) => resident.cpf === cpf
      );

      console.log(residentIndex);

      if (residentIndex !== -1) {
        console.log("entrou");

        const temp = [...residentsArray];
        temp.splice(residentIndex, 1);
        setResidentsArray(() => temp);
      }

      updateHabitation();
    } catch (error) {
      setAlertMessage("Erro ao excluir Morador");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
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
              {allowEditing ? (
                <>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <TextField
                      variant="outlined"
                      label="Nome da Moradia"
                      InputLabelProps={{ shrink: true }}
                      value={habitation.nameOrNumber}
                      // disabled={allowEditing}
                      inputProps={{ readOnly: !allowEditing }}
                      fullWidth
                      // onChange={(
                      //   event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                      // ) => {
                      //   setCondoName(event.target.value);
                      // }}
                    />
                  </Grid>
                </>
              ) : (
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Typography>
                    Nome: <b>{habitation.nameOrNumber}</b>
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Save />}
                  type="submit"
                  onClick={() => {
                    if (!allowEditing) {
                      return;
                    } else {
                      updateHabitation();
                    }
                  }}
                >
                  {allowEditing ? "Salvar" : "Salvar (Desativado)"}
                </Button>
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
                        <Fab
                          color="primary"
                          aria-label="add"
                          onClick={() => setShowResidentModal(true)}
                        >
                          <Add />
                        </Fab>
                      </Box>
                    </Tooltip>
                  </Grid>
                </Grid>
                {residentsArray.length > 0 &&
                  residentsArray.map((item, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      key={index}
                    >
                      {item.id ? (
                        <Tooltip title="Clique para visualizar o Morador">
                          <Link
                            href={`/residentItem/${item.id}`}
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
                              <Grid
                                container
                                spacing={2}
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Grid
                                  item
                                  xs={12}
                                  sm={12}
                                  md={11}
                                  lg={11}
                                  xl={11}
                                >
                                  <Typography>
                                    Nome: <b>{item.name}</b>
                                  </Typography>
                                  <Typography>
                                    CPF: <b>{item.cpf}</b>
                                  </Typography>
                                  <Typography>
                                    Telefone: <b>{item.phone}</b>
                                  </Typography>
                                  <Typography>
                                    E-Mail: <b>{item.email}</b>
                                  </Typography>
                                </Grid>
                                <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                                  <Tooltip title="Clique para excluir o morador">
                                    <IconButton
                                      size="large"
                                      sx={{
                                        color: (theme) =>
                                          ` ${theme.palette.error.main}`,
                                      }}
                                      onClick={() =>
                                        setShowDeleteResidentControl(true)
                                      }
                                    >
                                      <DeleteForever />
                                    </IconButton>
                                  </Tooltip>
                                </Grid>
                              </Grid>
                            </Box>
                          </Link>
                        </Tooltip>
                      ) : (
                        <Box
                          sx={{
                            border: (theme) =>
                              `2px solid ${theme.palette.primary.dark}`,
                            padding: 1,
                            borderRadius: 2,
                            marginTop: 1,
                          }}
                        >
                          <Grid
                            container
                            spacing={2}
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Grid item xs={12} sm={12} md={11} lg={11} xl={11}>
                              <Typography>
                                Nome: <b>{item.name}</b>
                              </Typography>
                              <Typography>
                                CPF: <b>{item.cpf}</b>
                              </Typography>
                              <Typography>
                                Telefone: <b>{item.phone}</b>
                              </Typography>
                              <Typography>
                                E-Mail: <b>{item.email}</b>
                              </Typography>
                            </Grid>
                            <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                              <Tooltip title="Clique para excluir o morador">
                                <IconButton
                                  size="large"
                                  sx={{
                                    color: (theme) =>
                                      ` ${theme.palette.error.main}`,
                                  }}
                                  onClick={() =>
                                    setShowDeleteResidentControl(true)
                                  }
                                >
                                  <DeleteForever />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        </Box>
                      )}
                    </Grid>
                  ))}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Dialog
        open={showResidentModal}
        onClose={() => {
          setShowResidentModal(false);
        }}
      >
        <DialogTitle id="alert-dialog-title">
          Adicionar Morador ao Bloco
        </DialogTitle>
        <DialogContent>
          <ResidentModal
            name={resident.name}
            cpf={resident.cpf}
            phone={resident.phone}
            email={resident.email}
            isEmployee={resident.isEmployee}
            isPropertyOwner={resident.isPropertyOwner}
            nameChange={(name: string) => {
              setResident((prev) => ({ ...prev, name }));
            }}
            cpfChange={(cpf: string) => {
              setResident((prev) => ({ ...prev, cpf: cpfMask(cpf) }));
            }}
            phoneChange={(phone: string) => {
              setResident((prev) => ({ ...prev, phone: phoneMask(phone) }));
            }}
            emailChange={(email: string) => {
              setResident((prev) => ({ ...prev, email }));
            }}
            isPropertyOwnerChange={(value: boolean) => {
              setResident((prev) => ({ ...prev, isPropertyOwner: value }));
            }}
            isEmployeeChange={(value: boolean) => {
              setResident((prev) => ({ ...prev, isEmployee: value }));
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowResidentModal(false);
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              addResident();
            }}
            variant="contained"
            autoFocus
          >
            Adicionar Morador
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showDeleteResidentControl}
        onClose={() => {
          setShowDeleteResidentControl(false);
        }}
      >
        <DialogTitle id="alert-dialog-title">
          Esta é uma ação irreversível. Tem certeza que deseja excluir o
          morador?
        </DialogTitle>

        <DialogActions>
          <Button
            onClick={() => {
              setShowDeleteResidentControl(false);
            }}
            variant="contained"
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              deleteResident("123");
            }}
            autoFocus
          >
            Excluir Morador
          </Button>
        </DialogActions>
      </Dialog>
    </ViewWrapper>
  );
}