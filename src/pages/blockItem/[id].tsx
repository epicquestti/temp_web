import ViewWrapper from "@/components/ViewWrapper";
import { useApplicationContext } from "@/context/ApplicationContext";
import fetchApi from "@/lib/fetchApi";
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

export default function BlockItem() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [allowEditing, setAllowEditing] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const [showHabitationModal, setShowHabitationModal] =
    useState<boolean>(false);
  const [showDeleteHabitationControl, setShowDeleteHabitationControl] =
    useState<boolean>(false);
  const [habitationToDelete, setHabitationToDelete] = useState<string>("");

  const [habitationName, setHabitationName] = useState<string>("");

  const [habitationsArray, setHabitationsArray] = useState<
    {
      id: string;
      nameOrNumber: string;
    }[]
  >([]);

  const [blockState, setBlockState] = useState<{ id: string; name: string }>({
    id: "",
    name: "",
  });

  const [condominium, setCondominium] = useState<{ id: string; name: string }>({
    id: "",
    name: "",
  });

  const router = useRouter();
  const context = useApplicationContext();

  const id = router.query.id;

  const initialSetup = async () => {
    const controllerResponse = await fetchApi.get(`/blocks/${id}`, {
      headers: {
        "router-id": "WEB#API",
        Authorization: context.getToken(),
      },
    });

    if (controllerResponse.success) {
      setBlockState(controllerResponse.data.block);
      setHabitationsArray(controllerResponse.data.habitations);
      setCondominium(controllerResponse.data.condominium);
    }

    console.log("controllerResponse", controllerResponse);
  };

  useEffect(() => {
    initialSetup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const addHabitation = async () => {
    try {
      if (habitationName === "") {
        setAlertMessage("Por favor preencha o nome da habitação.");
        setShowAlert(true);
      }

      const duplicate = habitationsArray.filter(
        (value) =>
          value.nameOrNumber.toUpperCase() === habitationName.toUpperCase()
      );
      console.log("duplicate", duplicate);

      if (duplicate.length > 0) {
        setHabitationName("");
        setAlertMessage(
          "Já existe uma habitação com esse nome cadastrada neste bloco."
        );
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        return;
      }

      const temp = [...habitationsArray];
      temp.push({ id: "", nameOrNumber: habitationName });
      setHabitationsArray(() => temp);
      setHabitationName("");
      setShowHabitationModal(false);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const deleteHabitation = async () => {
    try {
      if (habitationToDelete !== "") {
        setShowDeleteHabitationControl(false);
        const itemIndex = habitationsArray.findIndex(
          (value) => value.nameOrNumber === habitationToDelete
        );

        if (itemIndex !== -1) {
          const temp = [...habitationsArray];
          temp.splice(itemIndex, 1);
          setHabitationsArray(() => temp);
        }
      }

      //Fazer update do condomínio assim que excluir o bloco
    } catch (error: any) {
      throw new Error(error.message);
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
          text: "Meus Condomínios",
          iconName: "home_work",
          href: "/myCondos",
        },
        {
          text: `${condominium.name}`,
          iconName: "home",
          href: `/condoItem/${condominium.id}`,
        },
        {
          text: `${blockState.name}`,
          iconName: "apartment",
          href: `/blockItem/${blockState.id}`,
        },
      ]}
      loading={loading}
      alerMessage={alertMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      title="Blocos"
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
                  <Typography variant="h4">Dados do Bloco</Typography>
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
                      label="Nome do Bloco"
                      InputLabelProps={{ shrink: true }}
                      value={blockState.name}
                      inputProps={{ readOnly: !allowEditing }}
                      fullWidth
                    />
                  </Grid>
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
                          console.log("Botão Funcionando");
                        }
                      }}
                    >
                      {allowEditing ? "Salvar" : "Salvar (Desativado)"}
                    </Button>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Typography>
                      Nome: <b>{blockState.name}</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Typography>
                      Condomínio: <b>{condominium.name}</b>
                    </Typography>
                  </Grid>
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
                          console.log("Botão Funcionando");
                        }
                      }}
                    >
                      {allowEditing ? "Salvar" : "Salvar (Desativado)"}
                    </Button>
                  </Grid>
                </>
              )}
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
                    <Typography variant="h4">Habitações do Bloco</Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Tooltip title="Adicionar Habitação">
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
                          onClick={() => setShowHabitationModal(true)}
                        >
                          <Add />
                        </Fab>
                      </Box>
                    </Tooltip>
                  </Grid>
                </Grid>
                {habitationsArray.length > 0 &&
                  habitationsArray.map((item, index) => {
                    return (
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        key={index}
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
                            <Grid item xs={12} sm={12} md={11} lg={11} xl={11}>
                              <Link
                                href={""}
                                style={{
                                  textDecoration: "none",
                                  color: "#000",
                                }}
                              >
                                <Tooltip title="Clique para visualizar a habitação">
                                  <Typography>
                                    Nome: <b>{item.nameOrNumber}</b>
                                  </Typography>
                                </Tooltip>
                              </Link>
                            </Grid>

                            <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                              <IconButton
                                size="large"
                                sx={{
                                  color: (theme) =>
                                    ` ${theme.palette.error.main}`,
                                }}
                                onClick={() => {
                                  setShowDeleteHabitationControl(true);
                                  setHabitationToDelete(item.nameOrNumber);
                                }}
                              >
                                <DeleteForever />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    );
                  })}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Dialog
        open={showHabitationModal}
        onClose={() => {
          setShowHabitationModal(false);
        }}
      >
        <DialogTitle id="alert-dialog-title">
          Adicionar Habitação ao Bloco
        </DialogTitle>
        <DialogContent>
          {/* <HabitationModal
            name={habitationName}
            setName={(value: string) => {
              setHabitationName(value);
            }}
          /> */}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowHabitationModal(false);
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              addHabitation();
            }}
            variant="contained"
            autoFocus
          >
            Adicionar Habitação
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showDeleteHabitationControl}
        onClose={() => {
          setShowDeleteHabitationControl(false);
        }}
      >
        <DialogTitle id="alert-dialog-title">
          Esta é uma ação irreversível. Tem certeza que deseja excluir a
          Habitação?
        </DialogTitle>

        <DialogActions>
          <Button
            onClick={() => {
              setShowDeleteHabitationControl(false);
            }}
            variant="contained"
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              deleteHabitation();
            }}
            autoFocus
          >
            Excluir Habitação
          </Button>
        </DialogActions>
      </Dialog>
    </ViewWrapper>
  );
}
