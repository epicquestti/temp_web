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
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import LoagindGridGif from "../../components/DataGridV2/components/assets/loading.gif";

export default function BlockItem() {
  const [loading, setLoading] = useState<boolean>(false);
  const [screenLoading, setScreenLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [allowEditing, setAllowEditing] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const [showHabitationModal, setShowHabitationModal] =
    useState<boolean>(false);
  const [showDeleteHabitationControl, setShowDeleteHabitationControl] =
    useState<boolean>(false);
  const [habitationToDelete, setHabitationToDelete] = useState<{
    habitationId: string;
    habitationName: string;
    index: number | null;
  }>({
    habitationName: "",
    index: null,
    habitationId: "",
  });

  const [habitation, setHabitation] = useState<{
    habitationId: string;
    habitationName: string;
  }>({
    habitationId: "",
    habitationName: "",
  });

  const [habitationsArray, setHabitationsArray] = useState<
    {
      habitationId: string;
      habitationName: string;
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
    try {
      setScreenLoading(true);
      const controllerResponse = await fetchApi.get(`/blocks/${id}`, {
        headers: {
          "router-id": "WEB#API",
          Authorization: context.getToken(),
        },
      });

      console.log("controllerResponse", controllerResponse);

      if (controllerResponse.success) {
        setBlockState(controllerResponse.data.block);
        setHabitationsArray(controllerResponse.data.habitations);
        setCondominium(controllerResponse.data.condominium);
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

  const addHabitation = async () => {
    try {
      setLoading(true);
      setShowHabitationModal(false);
      //Verificar se o nome foi preenchido
      if (habitation.habitationName === "") {
        setAlertMessage("Por favor, preencha o nome da Moradia.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        setLoading(false);
        return;
      }

      //Encontrar nome duplicado sem bloco
      const duplicateName = habitationsArray.filter(
        (value) =>
          value.habitationName.toUpperCase() ===
          habitation.habitationName.toUpperCase()
      );

      if (duplicateName.length > 0) {
        setAlertMessage("Nome da moradia já cadastrada neste bloco.");
        setShowAlert(true);
        setShowHabitationModal(false);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        setHabitation((prev) => ({
          ...prev,
          habitationId: "",
          habitationName: "",
        }));
        setLoading(false);
        return;
      }

      //Adicionar a habitação ao array de habitações
      let temp = [...habitationsArray];
      temp.push({
        habitationId: "",
        habitationName: habitation.habitationName,
      });
      setHabitationsArray(() => temp);

      //Salvar a Habitação nova no banco
      const habitationObj = {
        blockId: blockState.id,
        condominiumId: condominium.id,
        name: habitation.habitationName,
      };

      const habitationResponse = await fetchApi.post(
        `/habitations/new`,
        habitationObj,
        {
          headers: {
            "router-id": "WEB#API",
            Authorization: context.getToken(),
          },
        }
      );
      if (habitationResponse.success) {
        setAlertMessage("Moradia inserida com sucesso.");
        setShowAlert(true);
        setHabitation((prev) => ({
          ...prev,
          habitationId: "",
          habitationName: "",
        }));
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }
      setLoading(false);
      initialSetup();
    } catch (error: any) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const deleteHabitation = async () => {
    try {
      setLoading(true);
      if (habitationToDelete.habitationName !== "") {
        setShowDeleteHabitationControl(false);
        const itemIndex = habitationsArray.findIndex(
          (value) => value.habitationName === habitationToDelete.habitationName
        );

        if (itemIndex !== -1) {
          const temp = [...habitationsArray];
          temp.splice(itemIndex, 1);
          setHabitationsArray(() => temp);
        }

        const deleteResponse = await fetchApi.del(
          `/habitations/delete/${habitationToDelete.habitationId}`,
          {
            headers: {
              "router-id": "WEB#API",
              Authorization: context.getToken(),
            },
          }
        );

        if (deleteResponse.success) {
          setAlertMessage("Moradia excluída com sucesso.");
          setShowAlert(true);
          setLoading(false);
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
          await initialSetup();
        }
      } else {
        setLoading(false);
        return;
      }
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.message);
    }
  };

  const updateBlock = async () => {
    try {
      setLoading(true);

      //Verificar se o nome do bloco está vazio.
      if (blockState.name === "") {
        setAlertMessage("Por favor, insira o nome do bloco antes de salvar.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }

      //Verificar se o nome do bloco já existe no condomínio.
      const nameResponse = await fetchApi.post(
        `/condominium/get-block-name`,
        {
          id: condominium.id,
          name: blockState.name,
        },
        {
          headers: {
            "router-id": "WEB#API",
            Authorization: context.getToken(),
          },
        }
      );

      if (nameResponse.data) {
        setAlertMessage("Nome do bloco já cadastrado nesse condomínio.");
        setShowAlert(true);
        setLoading(false);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        setBlockState((prev) => ({ ...prev, name: "", id: "" }));
        return;
      }

      const blockObj = {
        condominiumId: condominium.id,
        name: blockState.name,
      };

      const updateResponse = await fetchApi.post(
        `blocks/update/${blockState.id}`,
        blockObj,
        {
          headers: {
            "router-id": "WEB#API",
            Authorization: context.getToken(),
          },
        }
      );

      if (updateResponse.success) {
        setAlertMessage("Bloco editado com sucesso.");
        setShowAlert(true);
        setLoading(false);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        setBlockState((prev) => ({ ...prev, name: "", id: "" }));
        setAllowEditing(false);
        await initialSetup();
        return;
      } else {
        setAlertMessage("Erro ao editar bloco. Por favor, tente novamente.");
        setShowAlert(true);
        setLoading(false);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        setBlockState((prev) => ({ ...prev, name: "", id: "" }));
        return;
      }
    } catch (error: any) {
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
                    {JSON.stringify(blockState)}
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        variant="outlined"
                        label="Nome do Bloco"
                        InputLabelProps={{ shrink: true }}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          setBlockState((prev) => ({
                            ...prev,
                            name: event?.target.value,
                          }));
                        }}
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
                        onClick={() => updateBlock()}
                      >
                        Salvar
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
                          updateBlock();
                        }}
                      >
                        Salvar
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
                      const url = `/habitationItem/${item.habitationId}`;
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
                              <Grid
                                item
                                xs={12}
                                sm={12}
                                md={11}
                                lg={11}
                                xl={11}
                              >
                                <Link
                                  href={url}
                                  style={{
                                    textDecoration: "none",
                                    color: "#000",
                                  }}
                                >
                                  <Tooltip title="Clique para visualizar a habitação">
                                    <Typography>
                                      Nome: <b>{item.habitationName}</b>
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
                                    setHabitationToDelete((prev) => ({
                                      ...prev,
                                      habitationName: item.habitationName,
                                      habitationId: item.habitationId
                                        ? item.habitationId
                                        : "",
                                      index: index,
                                    }));
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
      )}

      <Dialog
        open={showHabitationModal}
        onClose={() => {
          setShowHabitationModal(false);
        }}
      >
        <DialogTitle id="alert-dialog-title">
          Adicionar Moradia ao Bloco
        </DialogTitle>
        <DialogContent>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <TextField
                fullWidth
                placeholder="Nome da Moradia"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setHabitation((prev) => ({
                    ...prev,
                    habitationName: event.target.value,
                  }));
                }}
              />
            </Grid>
          </Grid>
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
            Adicionar Moradia
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
          moradia?
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
            Excluir Moradia
          </Button>
        </DialogActions>
      </Dialog>
    </ViewWrapper>
  );
}
