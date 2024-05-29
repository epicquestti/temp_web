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
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import LoagindGridGif from "../../components/DataGridV2/components/assets/loading.gif";
import HabitationModal from "./habitationModal";

type addressType = {
  id: string;
  cnpj?: string;
  street: string;
  streetNumber: string;
  neighborhood: string;
  complement?: string;
  cep: string;
  cityName: string;
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
  const id = router.query.id;
  const context = useApplicationContext();

  const [loading, setLoading] = useState<boolean>(false);
  const [screenLoading, setScreenLoading] = useState<boolean>(false);
  const [condoName, setCondoName] = useState<string>("Aguarde...");
  const [allowEditing, setAllowEditing] = useState<boolean>(false);

  const [showBlockModal, setShowBlockModal] = useState<boolean>(false);
  const [blockToDelete, setBlockToDelete] = useState<{
    id: string | null;
    name: string;
  }>({ id: null, name: "" });
  const [selectedBlock, setSelectedBlock] = useState<blockType>({
    id: "0",
    name: "",
    condominiumId: id ? id.toString() : "",
  });

  const [showHabitationModal, setShowHabitationModal] =
    useState<boolean>(false);
  const [habitation, setHabitation] = useState<{
    name: string;
    blockId: string | null;
  }>({
    name: "",
    blockId: "",
  });
  const [habitationsArray, setHabitationsArray] = useState<
    {
      habitationId: string;
      habitationName: string;
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
  const [showSecondBlockQuestion, setShowSecondBlockQuestion] =
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

  const [address, setAddress] = useState<addressType>({
    id: "",
    street: "",
    streetNumber: "",
    neighborhood: "",
    complement: "",
    cep: "",
    cityName: "",
    cityIbge: null,
    state: "",
    stateName: "",
    stateIbge: "",
  });

  const [condoItem, setCondoItem] = useState<{
    id: string;
    name: string;
    cnpj: string;
  }>({
    cnpj: "",
    id: "",
    name: "",
  });

  const [blocksArray, setBlocksArray] = useState<blockType[]>([]);

  const initialSetup = async () => {
    try {
      setScreenLoading(true);
      //Buscar no banco os dados do condomínio e os associados(Blocos, Residentes)
      const controllerResponse = await fetchApi.get(
        `/condominium/${id?.toString()}`,
        {
          headers: {
            "router-id": "WEB#API",
            Authorization: context.getToken(),
          },
        }
      );

      if (controllerResponse.success) {
        setCondoName(controllerResponse.data.condo.name);
        setCondoItem(controllerResponse.data.condo);
        setAddress(controllerResponse.data.address);
        if (controllerResponse.data.blocks.length > 0) {
          setBlocksArray(controllerResponse.data.blocks);
          setHabitationsArray(controllerResponse.data.habitations);
        }
      }

      //Popular o array de estados
      const statesResponse = await fetchApi.get(
        `/global/tools/get-all-states`,
        {
          headers: {
            "router-id": "WEB#API",
            Authorization: context.getToken(),
          },
        }
      );

      if (statesResponse.success) {
        setStatesArray(statesResponse.data);
      }

      setScreenLoading(false);
    } catch (error: any) {
      setScreenLoading(false);
    }
  };

  useEffect(() => {
    initialSetup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateCondominium = async () => {
    try {
      setLoading(true);
      const condoObj = {
        id: condoItem.id,
        addressId: address.id,
        address: address.street,
        addressNumber: address.streetNumber,
        cep: address.cep,
        cityIbge: address.cityIbge,
        stateIbge: parseInt(selectedState),
        cnpj: condoItem.cnpj,
        complement: address.complement,
        name: condoItem.name,
        neighborhood: address.neighborhood,
        habitations: habitationsArray,
        blocks: blocksArray,
      };

      //Fazer update do condomínio
      const controllerResponse = await fetchApi.post(
        `/condominium/update/${condoItem.id}`,
        condoObj,
        {
          headers: {
            "router-id": "WEB#API",
            Authorization: context.getToken(),
          },
        }
      );

      if (controllerResponse.success) {
        setAlertMessage("Condomínio editado com sucesso.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        if (controllerResponse.data.blocks.length > 0) {
          setBlocksArray(controllerResponse.data.blocks);
        }
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const handleBlockChange = async (value: string) => {
    if (value === "0") {
      setHabitation((prev) => ({ ...prev, blockId: null }));
      setSelectedBlock((prev) => ({
        ...prev,
        id: "0",
        name: "",
      }));
      return;
    }
    const selected = blocksArray.filter(
      (item: { id: string; name: string }) => {
        return item.id === value;
      }
    );

    setSelectedBlock((prev) => ({
      ...prev,
      id: selected[0].id,
      name: selected[0].name,
    }));
    setHabitation((prev) => ({ ...prev, blockId: selected[0].id }));
  };

  const addBlock = async () => {
    try {
      setLoading(true);
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
      const blockObj = { name: blockName, condominiumId: id };
      const controllerResponse = await fetchApi.post(`/blocks/new`, blockObj, {
        headers: {
          "router-id": "WEB#API",
          Authorization: context.getToken(),
        },
      });

      if (controllerResponse.success) {
        initialSetup();
      }
      setLoading(false);
      return;
    } catch (error: any) {
      console.log(error.message);
      setLoading(false);
      return;
    }
  };

  const deleteBlock = async () => {
    try {
      setLoading(true);
      if (blockToDelete.name !== "") {
        setShowSecondBlockQuestion(false);
        setShowDeleteBlockControl(false);

        //Encontrar o index do bloco a ser excluído dentro do array de blocos
        const itemIndex = blocksArray.findIndex(
          (value) => value.name === blockToDelete.name
        );

        //Excluir o bloco do array de blocos
        if (itemIndex !== -1) {
          const temp = [...blocksArray];
          temp.splice(itemIndex, 1);
          setBlocksArray(() => temp);
        }

        const controllerResponse = await fetchApi.del(
          `blocks/delete/${blockToDelete.id}/${condoItem.id}`,
          {
            headers: {
              "router-id": "WEB#API",
              Authorization: context.getToken(),
            },
          }
        );

        if (controllerResponse.success) {
          setAlertMessage("Bloco excluído com sucesso.");
          setShowAlert(true);
          setLoading(false);
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
          await initialSetup();
          return;
        } else {
          setAlertMessage("Erro ao excluir Bloco.");
          setShowAlert(true);
          setLoading(false);
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        }
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.message);
    }
  };

  const addHabitation = async () => {
    try {
      setLoading(true);
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
          value.habitationName.toUpperCase() === habitation.name.toUpperCase()
      );

      if (duplicateName.length > 0 && selectedBlock.id === "0") {
        setAlertMessage("Nome da moradia já cadastrada neste condomínio.");
        setShowAlert(true);
        setShowHabitationModal(false);
        setHabitation({ blockId: "0", name: "" });
        setSelectedBlock({ condominiumId: "", id: "0", name: "" });
        setLoading(false);
        setHabitation((prev) => ({ ...prev, name: "" }));
        return;
      }

      //Checar nomes diferentes para blocos iguais
      const blockSpecificDuplicates = habitationsArray.filter(
        (value) =>
          value.blockId === selectedBlock.id &&
          value.habitationName.toUpperCase() === habitation.name.toUpperCase()
      );

      if (blockSpecificDuplicates.length > 0) {
        setAlertMessage("Nome da moradia já cadastrado neste bloco.");
        setShowAlert(true);
        setShowHabitationModal(false);
        setHabitation({ blockId: "0", name: "" });
        setSelectedBlock({ condominiumId: "", id: "0", name: "" });
        setHabitation((prev) => ({ ...prev, name: "" }));
        setLoading(false);
        return;
      }
      setShowHabitationModal(false);

      //Adicionar a habitação ao array de habitações
      let temp = [...habitationsArray];
      temp.push({
        habitationId: "",
        habitationName: habitation.name,
        blockId: selectedBlock.id,
        blockName: selectedBlock.name,
      });
      setHabitationsArray(() => temp);

      //Salvar a Habitação nova no banco
      const habitationObj = {
        blockId: habitation.blockId,
        condominiumId: condoItem.id,
        name: habitation.name,
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
      setSelectedBlock({ condominiumId: "", id: "0", name: "0" });
      setHabitation({ blockId: "0", name: "" });
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
      setShowDeleteHabitationControl(false);

      const temp = [...habitationsArray];
      temp.splice(habitationToDelete.index, 1);

      setHabitationsArray(() => temp);

      //Fazer update das moradias caso a moradia excluída tenha ID

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
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

    if (cepResponse.success) {
      const response = cepResponse.data.data;
      setAddress((prev) => ({ ...prev, street: response.logradouro }));
      setAddress((prev) => ({ ...prev, neighborhood: response.bairro }));
      setAddress((prev) => ({ ...prev, city: response.localidade }));
      setAddress((prev) => ({ ...prev, cityIbge: response.ibge }));
      setAddress((prev) => ({
        ...prev,
        state: response.ibge ? response.ibge.substring(0, 2) : "0",
      }));
      setSelectedState(response.ibge ? response.ibge.substring(0, 2) : "0");
    } else {
      setAddress((prev) => ({ ...prev, cityIbge: null }));
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
          text: `${condoItem.name}`,
          iconName: "home",
          href: `/condoItem/${condoItem.id}`,
        },
      ]}
      alerMessage={alertMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      loading={loading}
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
                        value={condoItem.cnpj ? cnpjMask(condoItem.cnpj) : ""}
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
                        value={address.street}
                        fullWidth
                        inputProps={{ readOnly: !allowEditing }}
                        onChange={(
                          event: ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                          >
                        ) => {
                          setAddress((prev) => ({
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
                        value={address.neighborhood}
                        fullWidth
                        inputProps={{ readOnly: !allowEditing }}
                        onChange={(
                          event: ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                          >
                        ) => {
                          setAddress((prev) => ({
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
                        value={address.streetNumber}
                        fullWidth
                        inputProps={{ readOnly: !allowEditing }}
                        onChange={(
                          event: ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                          >
                        ) => {
                          setAddress((prev) => ({
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
                        value={address.complement}
                        fullWidth
                        inputProps={{ readOnly: !allowEditing }}
                        onChange={(
                          event: ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                          >
                        ) => {
                          setAddress((prev) => ({
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
                        value={cepMask(address.cep)}
                        fullWidth
                        inputProps={{ readOnly: !allowEditing }}
                        onChange={(
                          event: ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                          >
                        ) => {
                          getCep(event.target.value);
                          setAddress((prev) => ({
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
                        value={address.cityName}
                        fullWidth
                        inputProps={{ readOnly: !allowEditing }}
                        onChange={(
                          event: ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                          >
                        ) => {
                          setAddress((prev) => ({
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
                          value={address.stateIbge}
                          onChange={(event: SelectChangeEvent) => {
                            setSelectedState(() =>
                              event.target.value.toString()
                            );
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
                        Endereço: <b>{address.street}</b>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Typography>
                        Bairro: <b>{address.neighborhood}</b>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Typography>
                        Número: <b>{address.streetNumber}</b>
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Typography>
                        CEP: <b>{address.cep ? cepMask(address.cep) : ""}</b>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Typography>
                        Cidade: <b>{address.cityName}</b>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Typography>
                        Estado: <b>{address.stateName}</b>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Typography>
                        Complemento: <b>{address.complement}</b>
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
                      const url = `/blockItem/${item.id}`;
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
                                  <Tooltip title="Clique para visualizar o bloco">
                                    <Typography>
                                      Nome: <b>{item.name}</b>
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
                                    setShowDeleteBlockControl(true);
                                    setBlockToDelete((prev) => ({
                                      ...prev,
                                      id: item.id ? item.id : null,
                                      name: item.name,
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
                                              Nome: <b>{item.habitationName}</b>
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
                                                {item.blockName
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
                                          habitationName: item.habitationName,
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
      )}

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
          Esta é uma ação irreversível. Você está prestes a excluir o bloco e
          todas as moradias e moradores associadas a ele!
        </DialogTitle>

        <DialogContent>
          <Typography>
            Caso não queira excluir as moradias e/ou moradores, acesse a página
            de cada um e retire o bloco.
          </Typography>
        </DialogContent>

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
              setShowSecondBlockQuestion(true);
              setShowDeleteBlockControl(false);
            }}
            autoFocus
          >
            Excluir Bloco
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showSecondBlockQuestion}
        onClose={() => {
          setShowSecondBlockQuestion(false);
        }}
      >
        <DialogTitle id="alert-dialog-title">
          Esta é sua última chance. Tem certeza que quer excluir o bloco e todos
          as moradias/moradores associados?
        </DialogTitle>

        <DialogActions>
          <Button
            onClick={() => {
              setShowSecondBlockQuestion(false);
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
