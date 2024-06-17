import ViewWrapper from "@/components/ViewWrapper";
import { useApplicationContext } from "@/context/ApplicationContext";
import fetchApi from "@/lib/fetchApi";
import { cpfMask, noSpecialCharactersMask, phoneMask } from "@/lib/masks";
import { Add, DeleteForever, Edit, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, Fragment, useEffect, useState } from "react";
import LoagindGridGif from "../../components/DataGridV2/components/assets/loading.gif";
import ResidentModal, { residentTypeProps } from "./residentModal";

export default function HabitationItem() {
  const [loading, setLoading] = useState<boolean>(false);
  const [screenLoading, setScreenLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [allowEditing, setAllowEditing] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const [habitation, setHabitation] = useState<{
    habitationId: string;
    habitationName: string;
  }>({
    habitationId: "",
    habitationName: "",
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
  const [residentToDelete, setResidentToDelete] = useState<{
    id: string;
    cpf: string;
  }>({
    id: "",
    cpf: "",
  });

  const [block, setBlock] = useState<{ blockId: string; blockName: string }>({
    blockId: "",
    blockName: "",
  });
  const [blocksArray, setBlocksArray] = useState<
    { id: string; name: string }[]
  >([]);

  const [condo, setCondo] = useState<{ condoId: string; condoName: string }>({
    condoId: "",
    condoName: "",
  });

  const router = useRouter();
  const id = router.query.id;

  const context = useApplicationContext();

  const initialSetup = async () => {
    try {
      setScreenLoading(true);
      const controllerResponse = await fetchApi.get(`/habitations/${id}`, {
        headers: {
          "router-id": "WEB#API",
          Authorization: context.getToken(),
        },
      });
      console.log("controllerResponse", controllerResponse);

      if (controllerResponse.success) {
        const data = controllerResponse.data;
        setHabitation({
          habitationId: data.habitation.habitationId,
          habitationName: data.habitation.habitationName,
        });
        setCondo((prev) => ({
          ...prev,
          condoId: data.habitation.condominiumId,
          condoName: data.habitation.condominiumName,
        }));
        setBlock((prev) => ({
          ...prev,
          blockId: data.habitation.blockId,
          blockName: data.habitation.blockName,
        }));
        if (controllerResponse.data.residents.length > 0) {
          setResidentsArray(data.residents);
        }

        const allBlocks = await fetchApi.get(
          `/blocks/get-blocks/${controllerResponse.data.habitation[0].condominiumId}`,
          {
            headers: {
              "router-id": "WEB#API",
              Authorization: context.getToken(),
            },
          }
        );

        if (allBlocks.success) {
          setBlocksArray(allBlocks.data);
        }
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

  const updateHabitation = async () => {
    try {
      setLoading(true);
      //Verificar se já existe uma habitação com o mesmo nome cadastrado no
      //condomínio ou no bloco
      const existingBlock =
        block.blockId === "0" || block.blockId === null ? null : block.blockId;

      const habitationObj = {
        id: habitation.habitationId,
        nameOrNumber: habitation.habitationName,
        blockId: existingBlock,
        residents: residentsArray,
        condoId: condo.condoId,
      };

      //Fazer update da habitação com os moradores a cada vez que o usuário deletar um valor
      const controllerResponse = await fetchApi.post(
        `/habitations/update/${habitation.habitationId}`,
        habitationObj,
        {
          headers: {
            "router-id": "WEB#API",
            Authorization: context.getToken(),
          },
        }
      );

      if (controllerResponse.success) {
        setLoading(false);
        setAlertMessage("Moradia editada com sucesso.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }

      console.log("controllerResponse", controllerResponse);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setAlertMessage("Erro ao editar Moradia");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
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
    try {
      setLoading(true);
      setShowResidentModal(false);

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

      const existingBlock =
        block.blockId === "0" || block.blockId === null ? null : block.blockId;

      const residentObj = {
        condoId: condo.condoId,
        blockId: existingBlock,
        name: resident.name,
        cpf: noSpecialCharactersMask(resident.cpf),
        phone: noSpecialCharactersMask(resident.phone),
        email: resident.email,
        isPropertyOwner: resident.isPropertyOwner,
        isEmployee: resident.isEmployee,
        habitationId: habitation.habitationId,
      };

      const residentResponse = await fetchApi.post(
        `/residents/new`,
        residentObj,
        {
          headers: {
            "router-id": "WEB#API",
            Authorization: context.getToken(),
          },
        }
      );

      console.log("residentResponse", residentResponse);

      if (residentResponse.success) {
        setLoading(false);
        setAlertMessage("Residente inserido com sucesso.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }

      initialSetup();
      clearResident();
      setLoading(false);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const deleteResident = async () => {
    try {
      setLoading(true);
      setShowDeleteResidentControl(false);
      const residentIndex = residentsArray.findIndex(
        (resident) => resident.cpf === residentToDelete.cpf
      );

      if (residentIndex !== -1) {
        const temp = [...residentsArray];
        temp.splice(residentIndex, 1);
        setResidentsArray(() => temp);

        if (residentToDelete.id) {
          const deleteResponse = await fetchApi.del(
            `/residents/delete/${residentToDelete.id}`,
            {
              headers: {
                "router-id": "WEB#API",
                Authorization: context.getToken(),
              },
            }
          );

          if (deleteResponse.success) {
            setAlertMessage("Residente excluído com sucesso.");
            setShowAlert(true);
            setTimeout(() => {
              setShowAlert(false);
            }, 3000);
          }
        }
      }
      setLoading(false);
      initialSetup();
    } catch (error) {
      setAlertMessage("Erro ao excluir Morador");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  const handleBlockChange = async (value: string) => {
    if (value === "0") {
      setBlock(() => ({
        blockId: "0",
        blockName: "Selecione o Bloco",
      }));
      return;
    }
    const selected = blocksArray.filter(
      (item: { id: string; name: string }) => {
        return item.id === value;
      }
    );

    setBlock({
      blockId: selected[0].id,
      blockName: selected[0].name,
    });
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
          href: "/myCondos",
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
      ]}
      loading={loading}
      alerMessage={alertMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      title="Habitações"
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
                    <Typography variant="h4">Dados da Moradia</Typography>
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
                        value={habitation.habitationName}
                        inputProps={{ readOnly: !allowEditing }}
                        fullWidth
                        onChange={(
                          event: ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                          >
                        ) => {
                          setHabitation((prev) => ({
                            ...prev,
                            habitationName: event.target.value,
                          }));
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Bloco
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={block.blockId}
                          label="Bloco"
                          onChange={(event: SelectChangeEvent<string>) => {
                            handleBlockChange(event?.target.value);
                          }}
                        >
                          <MenuItem value={"0"}>Selecione o Bloco</MenuItem>
                          {blocksArray.length > 0 &&
                            blocksArray.map((item, index) => (
                              <MenuItem value={item.id} key={index}>
                                {item.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  <Fragment>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Typography>
                        Nome: <b>{habitation.habitationName}</b>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Typography>
                        Bloco:{" "}
                        <b>
                          {block.blockName ? block.blockName : "Não informado"}
                        </b>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Typography>
                        Condomínio: <b>{condo.condoName}</b>
                      </Typography>
                    </Grid>
                  </Fragment>
                )}
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Save />}
                    type="submit"
                    onClick={() => {
                      updateHabitation();
                    }}
                  >
                    Salvar
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
                      <Typography variant="h4">
                        Residentes da Moradia
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                      <Tooltip title="Adicionar Residente">
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
                          <Fragment>
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
                                  <Tooltip title="Clique para visualizar o Morador">
                                    <Link
                                      href={`/residentItem/${item.id}`}
                                      style={{
                                        textDecoration: "none",
                                        color: "#000",
                                      }}
                                    >
                                      <Typography>
                                        Nome: <b>{item.name}</b>
                                      </Typography>
                                      <Typography>
                                        CPF:{" "}
                                        <b>
                                          {item.cpf
                                            ? cpfMask(item.cpf)
                                            : "Não informado"}
                                        </b>
                                      </Typography>
                                      <Typography>
                                        Telefone:{" "}
                                        <b>
                                          {item.phone
                                            ? phoneMask(item.phone)
                                            : ""}
                                        </b>
                                      </Typography>
                                      <Typography>
                                        E-Mail:{" "}
                                        <b>
                                          {item.email
                                            ? item.email
                                            : "Não informado"}
                                        </b>
                                      </Typography>
                                      <Typography>
                                        Titular do Imóvel?:{" "}
                                        <b>
                                          {item.isPropertyOwner
                                            ? "Sim"
                                            : "Não "}
                                        </b>
                                      </Typography>
                                      <Typography>
                                        Empregado do Imóvel?:{" "}
                                        <b>
                                          {item.isEmployee ? "Sim" : "Não "}
                                        </b>
                                      </Typography>
                                    </Link>
                                  </Tooltip>
                                </Grid>
                                <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                                  <Tooltip title="Clique para excluir o morador">
                                    <IconButton
                                      size="large"
                                      sx={{
                                        color: (theme) =>
                                          ` ${theme.palette.error.main}`,
                                      }}
                                      onClick={() => {
                                        setShowDeleteResidentControl(true);
                                        setResidentToDelete({
                                          cpf: item.cpf,
                                          id: item.id ? item.id : "",
                                        });
                                      }}
                                    >
                                      <DeleteForever />
                                    </IconButton>
                                  </Tooltip>
                                </Grid>
                              </Grid>
                            </Box>
                          </Fragment>
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
                                    onClick={() => {
                                      setShowDeleteResidentControl(true);
                                      setResidentToDelete({
                                        id: item.id ? item.id : "",
                                        cpf: item.cpf,
                                      });
                                    }}
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
      )}

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
              deleteResident();
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
