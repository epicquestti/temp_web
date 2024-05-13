import ViewWrapper from "@/components/ViewWrapper";
import { useApplicationContext } from "@/context/ApplicationContext";
import fetchApi from "@/lib/fetchApi";
import { cepMask, cnpjMask } from "@/lib/masks";
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
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import HabitationModal from "./habitationModal";

type condoType = {
  id: string;
  name: string;
  cnpj?: string;
  addressId: string;
  street: string;
  streetNumber: string;
  neighborhood: string;
  complement?: string;
  cep: string;
  city: string;
  cityIbge: number | null;
  state: string;
  stateName: string;
  stateIbge: string;
};

type blockType = {
  condominiumId: string;
  id: string;
  name: string;
};

export default function CondoItem() {
  const router = useRouter();
  const context = useApplicationContext();
  const params = router.query.params as string[];
  const condoId = params[0];
  const condoName = params[1];

  const [allowEditing, setAllowEditing] = useState<boolean>(false);

  const [showBlockModal, setShowBlockModal] = useState<boolean>(false);
  const [blockToDelete, setBlockToDelete] = useState<string>("");
  const [selectedBlock, setSelectedBlock] = useState<blockType>({
    id: "",
    name: "",
    condominiumId: condoId,
  });

  const [showHabitationModal, setShowHabitationModal] =
    useState<boolean>(false);
  const [habitation, setHabitation] = useState<{
    name: string;
    blockId: string;
  }>({
    name: "",
    blockId: "",
  });
  const [habitationsArray, setHabitationsArray] = useState<
    {
      id: string;
      nameOrNumber: string;
      blockId: string | null;
      blockName: string | null;
    }[]
  >([]);

  const [showDeleteHabitationControl, setShowDeleteHabitationControl] =
    useState<boolean>(false);
  const [habitationToDelete, setHabitationToDelete] = useState<{
    nameOrNumber: string;
    index: number;
  }>({
    nameOrNumber: "",
    index: 0,
  });

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [showDeleteBlockControl, setShowDeleteBlockControl] =
    useState<boolean>(false);

  const [blockName, setBlockName] = useState<string>("");

  const [statesArray, setStatesArray] = useState<
    {
      ibge: number;
      acronym: string;
      name: string;
    }[]
  >([]);
  const [selectedState, setSelectedState] = useState<string>("");

  const [condoItem, setCondoItem] = useState<condoType>({
    id: "",
    name: "",
    cnpj: "",
    addressId: "",
    street: "",
    streetNumber: "",
    neighborhood: "",
    complement: "",
    cep: "",
    city: "",
    cityIbge: null,
    state: "",
    stateName: "",
    stateIbge: "",
  });

  const [blocksArray, setBlocksArray] = useState<blockType[]>([]);

  const initialSetup = async () => {
    //Buscar no banco os dados do condomínio e os associados(Blocos, Residentes)
    const controllerResponse = await fetchApi.get(`/condominium/${condoId}`, {
      headers: {
        "router-id": "WEB#API",
        Authorization: context.getToken(),
      },
    });
    console.log("controllerResponse", controllerResponse);

    if (controllerResponse.success) {
      setCondoItem(controllerResponse.data.condo);
      if (controllerResponse.data.blocks.length > 0) {
        setBlocksArray(controllerResponse.data.blocks);
        setHabitationsArray(controllerResponse.data.habitations);
      }
    }

    //Popular o array de estados
    const statesResponse = await fetchApi.get(`/global/tools/get-all-states`, {
      headers: {
        "router-id": "WEB#API",
        Authorization: context.getToken(),
      },
    });

    if (statesResponse.success) {
      setStatesArray(statesResponse.data);
    }
  };

  useEffect(() => {
    initialSetup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateCondominium = async () => {
    try {
      const condoObj = {
        id: condoItem.id,
        addressId: condoItem.addressId,
        address: condoItem.street,
        addressNumber: condoItem.streetNumber,
        cep: condoItem.cep,
        cityIbge: condoItem.cityIbge,
        stateIbge: parseInt(selectedState),
        cnpj: condoItem.cnpj,
        complement: condoItem.complement,
        name: condoItem.name,
        neighborhood: condoItem.neighborhood,
        habitations: habitationsArray,
        blocks: blocksArray,
      };

      //Fazer update do condomínio
      const controllerResponse = await fetchApi.post(
        `/condominium/update/${condoItem.id}/${condoItem.addressId}`,
        condoObj,
        {
          headers: {
            "router-id": "WEB#API",
            Authorization: context.getToken(),
          },
        }
      );

      if (controllerResponse.success) {
        setCondoItem(controllerResponse.data.condo);
        if (controllerResponse.data.blocks.length > 0) {
          setBlocksArray(controllerResponse.data.blocks);
        }
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleBlockChange = async (value: string) => {
    const selected = blocksArray.filter(
      (item: { id: string; name: string }) => {
        return item.id === value;
      }
    );

    setSelectedBlock((prev) => ({
      ...prev,
      id: selected[0].id || "0",
      name: selected[0].name || "",
    }));
  };

  const addBlock = async () => {
    try {
      //Encontrar nome duplicado no array de blocos
      const duplicateName = blocksArray.filter(
        (value) => value.name.toUpperCase() === blockName.toUpperCase()
      );

      if (duplicateName.length > 0) {
        setAlertMessage("Nome do bloco já cadastrado neste condomínio.");
        setShowAlert(true);
        setShowBlockModal(false);
        setBlockName("");
        return;
      }
      setShowBlockModal(false);

      //inserir o bloco no array de blocos
      let temp = [...blocksArray];
      temp.push({ condominiumId: "", id: "", name: blockName });
      setBlocksArray(temp);
      setBlockName("");

      //Salvar o bloco no Banco
      const blockObj = { name: blockName, condominiumId: condoId };
      const controllerResponse = await fetchApi.post(`/blocks/new`, blockObj, {
        headers: {
          "router-id": "WEB#API",
          Authorization: context.getToken(),
        },
      });

      if (controllerResponse.success) {
        initialSetup();
      }

      return;
    } catch (error: any) {
      console.log(error.message);
      return;
    }
  };

  const deleteBlock = async () => {
    try {
      if (blockToDelete !== "") {
        setShowDeleteBlockControl(false);
        //Encontrar o index do bloco a ser excluído dentro do array de blocos
        const itemIndex = blocksArray.findIndex(
          (value) => value.name === blockToDelete
        );

        if (itemIndex !== -1) {
          //Excluir o bloco do array de blocos
          const temp = [...blocksArray];
          temp.splice(itemIndex, 1);
          setBlocksArray(() => temp);
        }
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  useEffect(() => {}, [habitation]);

  const addHabitation = async () => {
    try {
      //Verificar se o nome foi preenchido
      if (habitation.name === "") {
        setAlertMessage("Por favor, preencha o nome da Moradia.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }

      //Encontrar nome duplicado sem bloco
      const duplicateName = habitationsArray.filter(
        (value) =>
          value.nameOrNumber.toUpperCase() === habitation.name.toUpperCase()
      );

      if (duplicateName.length > 0 && selectedBlock.id === "0") {
        setAlertMessage("Nome da moradia já cadastrada neste condomínio.");
        setShowAlert(true);
        setShowHabitationModal(false);
        setHabitation({ blockId: "0", name: "" });
        setSelectedBlock({ condominiumId: "", id: "0", name: "" });
        setHabitation((prev) => ({ ...prev, name: "" }));
        return;
      }

      //Checar nomes diferentes para blocos iguais
      const blockSpecificDuplicates = habitationsArray.filter(
        (value) =>
          value.blockId === selectedBlock.id &&
          value.nameOrNumber.toUpperCase() === habitation.name.toUpperCase()
      );

      if (blockSpecificDuplicates.length > 0) {
        setAlertMessage("Nome da moradia já cadastrado neste bloco.");
        setShowAlert(true);
        setShowHabitationModal(false);
        setHabitation({ blockId: "0", name: "" });
        setSelectedBlock({ condominiumId: "", id: "0", name: "" });
        setHabitation((prev) => ({ ...prev, name: "" }));
        return;
      }
      setShowHabitationModal(false);

      //Adicionar a habitação ao array de habitações
      let temp = [...habitationsArray];
      temp.push({
        id: "",
        nameOrNumber: habitation.name,
        blockId: selectedBlock.id === "0" ? null : selectedBlock.id,
        blockName: selectedBlock.id === "0" ? "" : selectedBlock.name,
      });
      setHabitationsArray(() => temp);
      setHabitation({ blockId: "0", name: "" });
      setSelectedBlock({ condominiumId: "", id: "0", name: "0" });

      //Salvar a Habitação nova no banco
      const habitationObj = {
        blockId: habitation.blockId,
        condominiumId: condoItem.id,
        name: habitation.name,
      };
      const habitationResponse = await fetchApi.post(
        "habitations/new",
        habitationObj,
        {
          headers: {
            "router-id": "WEB#API",
            Authorization: context.getToken(),
          },
        }
      );

      console.log("habitationResponse", habitationResponse);

      if (!habitationResponse.success) {
        setAlertMessage("Erro ao inserir moradia no condomínio.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        return;
      }

      initialSetup();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const deleteHabitation = async () => {
    try {
      setShowDeleteHabitationControl(false);

      const temp = [...habitationsArray];
      temp.splice(habitationToDelete.index, 1);

      setHabitationsArray(() => temp);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const getCep = async (cep: string) => {
    const cepResponse = await fetchApi.get(`/global/tools/get-cep/${cep}`, {
      headers: {
        Authorization: context.getToken(),
        "router-id": "WEB#API",
      },
    });

    console.log("cepResponse", cepResponse);

    if (cepResponse.success) {
      const response = cepResponse.data.data;
      setCondoItem((prev) => ({ ...prev, street: response.logradouro }));
      setCondoItem((prev) => ({ ...prev, neighborhood: response.bairro }));
      setCondoItem((prev) => ({ ...prev, city: response.localidade }));
      setCondoItem((prev) => ({ ...prev, cityIbge: response.ibge }));
      setCondoItem((prev) => ({
        ...prev,
        state: response.ibge ? response.ibge.substring(0, 2) : "0",
      }));
      setSelectedState(response.ibge ? response.ibge.substring(0, 2) : "0");
    } else {
      setCondoItem((prev) => ({ ...prev, cityIbge: null }));
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
          text: `${condoName}`,
          iconName: "home",
          href: `/condoItem/${condoId}/${condoName}`,
        },
      ]}
      alerMessage={alertMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
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
                  <Typography variant="h4">Dados do Condomínio</Typography>
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
                      label="Nome do Condomínio"
                      InputLabelProps={{ shrink: true }}
                      value={condoItem.name}
                      inputProps={{ readOnly: !allowEditing }}
                      fullWidth
                      onChange={(
                        event: ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => {
                        setCondoItem((prev) => ({
                          ...prev,
                          name: event.target.value,
                        }));
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <TextField
                      variant="outlined"
                      label="CNPJ do Condomínio"
                      InputLabelProps={{ shrink: true }}
                      value={condoItem.cnpj}
                      fullWidth
                      inputProps={{ readOnly: !allowEditing }}
                      onChange={(
                        event: ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => {
                        setCondoItem((prev) => ({
                          ...prev,
                          cnpj: cnpjMask(event.target.value),
                        }));
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <TextField
                      variant="outlined"
                      label="Endereço"
                      InputLabelProps={{ shrink: true }}
                      value={condoItem.street}
                      fullWidth
                      inputProps={{ readOnly: !allowEditing }}
                      onChange={(
                        event: ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => {
                        setCondoItem((prev) => ({
                          ...prev,
                          street: event.target.value,
                        }));
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <TextField
                      variant="outlined"
                      label="Bairro"
                      InputLabelProps={{ shrink: true }}
                      value={condoItem.neighborhood}
                      fullWidth
                      inputProps={{ readOnly: !allowEditing }}
                      onChange={(
                        event: ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => {
                        setCondoItem((prev) => ({
                          ...prev,
                          neighborhood: event.target.value,
                        }));
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <TextField
                      variant="outlined"
                      label="Número"
                      InputLabelProps={{ shrink: true }}
                      value={condoItem.streetNumber}
                      fullWidth
                      inputProps={{ readOnly: !allowEditing }}
                      onChange={(
                        event: ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => {
                        setCondoItem((prev) => ({
                          ...prev,
                          streetNumber: event.target.value,
                        }));
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <TextField
                      variant="outlined"
                      label="Complemento"
                      InputLabelProps={{ shrink: true }}
                      value={condoItem.complement}
                      fullWidth
                      inputProps={{ readOnly: !allowEditing }}
                      onChange={(
                        event: ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => {
                        setCondoItem((prev) => ({
                          ...prev,
                          complement: event.target.value,
                        }));
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <TextField
                      variant="outlined"
                      label="CEP"
                      InputLabelProps={{ shrink: true }}
                      value={condoItem.cep}
                      fullWidth
                      inputProps={{ readOnly: !allowEditing }}
                      onChange={(
                        event: ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => {
                        getCep(event.target.value);
                        setCondoItem((prev) => ({
                          ...prev,
                          cep: event.target.value,
                        }));
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <TextField
                      variant="outlined"
                      label="Cidade"
                      InputLabelProps={{ shrink: true }}
                      value={condoItem.city}
                      fullWidth
                      inputProps={{ readOnly: !allowEditing }}
                      onChange={(
                        event: ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => {
                        setCondoItem((prev) => ({
                          ...prev,
                          city: event.target.value,
                        }));
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <FormControl fullWidth>
                      <InputLabel id="stateId">{"Estado"}</InputLabel>
                      <Select
                        labelId="stateId"
                        label="Estado"
                        inputProps={{ readOnly: !allowEditing }}
                        value={condoItem.stateIbge}
                        onChange={(event: SelectChangeEvent) => {
                          console.log(event.target.value);

                          setSelectedState(() => event.target.value.toString());
                        }}
                      >
                        <MenuItem value={0}>Selecione ...</MenuItem>
                        {statesArray.length > 0 &&
                          statesArray.map(
                            (item: {
                              ibge: number;
                              acronym: string;
                              name: string;
                            }) => (
                              <MenuItem value={item.ibge} key={item.ibge}>
                                {item.acronym}
                              </MenuItem>
                            )
                          )}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Save />}
                      type="submit"
                      onClick={() => {
                        updateCondominium();
                      }}
                    >
                      Salvar
                    </Button>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Typography>
                      Nome: <b>{condoItem.name}</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Typography>
                      CNPJ:{" "}
                      <b>{condoItem.cnpj ? cnpjMask(condoItem.cnpj) : ""}</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Typography>
                      Endereço: <b>{condoItem.street}</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Typography>
                      Bairro: <b>{condoItem.neighborhood}</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Typography>
                      Número: <b>{condoItem.streetNumber}</b>
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Typography>
                      CEP: <b>{condoItem.cep ? cepMask(condoItem.cep) : ""}</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Typography>
                      Cidade: <b>{condoItem.city}</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Typography>
                      Estado: <b>{condoItem.state}</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography>
                      Complemento: <b>{condoItem.complement}</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Save />}
                      type="submit"
                      onClick={() => {
                        updateCondominium();
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
                    <Typography variant="h4">Blocos Cadastrados</Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Tooltip title="Adicionar Bloco">
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
                          onClick={() => setShowBlockModal(true)}
                        >
                          <Add />
                        </Fab>
                      </Box>
                    </Tooltip>
                  </Grid>
                </Grid>
                {blocksArray.length > 0 &&
                  blocksArray.map((item, index) => {
                    const url = `/blockItem/${condoName}/${item.id}/${item.name}`;
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
                              {item.id ? (
                                <Link
                                  href={url}
                                  style={{
                                    textDecoration: "none",
                                    color: "#000",
                                  }}
                                >
                                  <Tooltip title="Clique para visualizar o bloco">
                                    <Typography>
                                      Nome: <b>{item.name}</b>
                                    </Typography>
                                  </Tooltip>
                                </Link>
                              ) : (
                                <Typography>
                                  Nome: <b>{item.name}</b>
                                </Typography>
                              )}
                            </Grid>

                            <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                              <IconButton
                                size="large"
                                sx={{
                                  color: (theme) =>
                                    ` ${theme.palette.error.main}`,
                                }}
                                onClick={() => {
                                  setShowDeleteBlockControl(true);
                                  setBlockToDelete(item.name);
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
                    {JSON.stringify(habitationsArray)}
                    <Typography variant="h4">Moradias Cadastradas</Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Tooltip title="Adicionar Moradia">
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
                  {habitationsArray &&
                    habitationsArray.length > 0 &&
                    habitationsArray.map((item, index) => {
                      const url = `/habitationItem/${condoName}/${item.blockName}/${item.id}/${item.nameOrNumber}`;
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
                                  <>
                                    <Tooltip title="Clique para visualizar a Moradia">
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
                                          md={6}
                                          lg={6}
                                          xl={6}
                                        >
                                          <Typography>
                                            Nome: <b>{item.nameOrNumber}</b>
                                          </Typography>
                                        </Grid>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={12}
                                          md={6}
                                          lg={6}
                                          xl={6}
                                        >
                                          <Typography>
                                            Bloco:{" "}
                                            <b>
                                              {item.blockName !== ""
                                                ? item.blockName
                                                : "Não informado"}
                                            </b>
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    </Tooltip>
                                  </>
                                </Link>
                              </Grid>

                              <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                                <Tooltip title="Clique para excluir a moradia">
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
                                        nameOrNumber: item.nameOrNumber,
                                        index: index,
                                      }));
                                    }}
                                  >
                                    <DeleteForever />
                                  </IconButton>
                                </Tooltip>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                      );
                    })}
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Dialog
        open={showBlockModal}
        onClose={() => {
          setShowBlockModal(false);
        }}
      >
        <DialogTitle id="alert-dialog-title">
          Adicionar Bloco ao Condomínio
        </DialogTitle>
        <DialogContent>
          <InputLabel>Nome do Bloco</InputLabel>
          <TextField
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={blockName}
            fullWidth
            onChange={(
              event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              setBlockName(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowBlockModal(false);
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              addBlock();
            }}
            variant="contained"
            autoFocus
          >
            Adicionar Bloco
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showDeleteBlockControl}
        onClose={() => {
          setShowDeleteBlockControl(false);
        }}
      >
        <DialogTitle id="alert-dialog-title">
          Esta é uma ação irreversível. Tem certeza que deseja excluir o Bloco?
        </DialogTitle>

        <DialogActions>
          <Button
            onClick={() => {
              setShowDeleteBlockControl(false);
            }}
            variant="contained"
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              deleteBlock();
            }}
            autoFocus
          >
            Excluir Bloco
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showHabitationModal}
        onClose={() => {
          setShowHabitationModal(false);
        }}
      >
        <DialogTitle id="alert-dialog-title">
          Adicionar Moradia ao Condomínio
        </DialogTitle>
        <DialogContent>
          <HabitationModal
            name={habitation.name}
            selectedBlock={selectedBlock}
            blocksArray={blocksArray}
            onOpen={() => console.log("ajsbdahsvd")}
            setName={(name: string) => {
              setHabitation((prev) => ({ ...prev, name }));
            }}
            onBlockChange={handleBlockChange}
          />
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
          Moradia?
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
