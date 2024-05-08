import QHGrid from "@/components/DataGridV2";
import ViewWrapper from "@/components/ViewWrapper";
import { useApplicationContext } from "@/context/ApplicationContext";
import fetchApi from "@/lib/fetchApi";
import { cepMask, cnpjMask, noSpecialCharactersMask } from "@/lib/masks";
import {
  Add,
  Delete,
  DeleteForever,
  Edit,
  ExpandLess,
  ExpandMore,
  Save,
  Search,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
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
import { ChangeEvent, useEffect, useState } from "react";

export default function Condominium() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [showDeleteQuestion, setShowDeleteQuestion] = useState<boolean>(false);

  const context = useApplicationContext();

  const [statesArray, setStatesArray] = useState<
    { ibge: number; acronym: string; name: string }[]
  >([]);
  const [condoGridArray, setCondoGridArray] = useState<
    {
      active: boolean;
      createdAt: Date;
      createdById: bigint;
      id: bigint;
      methodId: bigint;
      name: string;
      numberOfMontlyPayment: number;
      ruleValue: number;
    }[]
  >([]);
  const [gridLoading, setGridLoading] = useState<boolean>(false);
  const [condoGridCount, setCondoGridCount] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [page, setPage] = useState<number>(0);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const [condominiumId, setCondominiumId] = useState<number | null>(null);
  const [condoName, setCondoName] = useState<string>("");
  const [condoCNPJ, setCondoCNPJ] = useState<string>("");
  const [condoAddress, setCondoAddress] = useState<string>("");
  const [addressNeighborhood, setAddressNeighborhood] = useState<string>("");
  const [addressNumber, setAddressNumber] = useState<string>("");
  const [addressId, setAddressId] = useState<string>("");
  const [addressComplement, setAddressComplement] = useState<string>("");
  const [addressCEP, setAddressCEP] = useState<string>("");
  const [addressCity, setAddressCity] = useState<string>("");
  const [cityIbge, setCityIbge] = useState<number>(0);
  const [selectedState, setSelectedState] = useState<string>("0");

  const [condoNameSearch, setCondoNameSearch] = useState<string>("");
  const [condoCNPJSearch, setCondoCNPJSearch] = useState<string>("");

  const [showBlocks, setShowBlocks] = useState<boolean>(false);
  const [showBlockModal, setShowBlockModal] = useState<boolean>(false);
  const [blockName, setBlockName] = useState<string>("");
  const [blocksArray, setBlocksArray] = useState<{ name: string }[]>([]);

  const initialSetup = async () => {
    const statesResponse = await fetchApi.get("/global/tools/get-all-states", {
      headers: {
        Authorization: context.getToken(),
        "router-id": "WEB#API",
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

  const getCep = async (cep: string) => {
    const cepResponse = await fetchApi.get(`/global/tools/get-cep/${cep}`, {
      headers: {
        Authorization: context.getToken(),
        "router-id": "WEB#API",
      },
    });

    if (cepResponse.success) {
      const response = cepResponse.data.data;
      setCondoAddress(response.logradouro);
      setAddressNeighborhood(response.bairro);
      setAddressCity(response.localidade);
      setCityIbge(parseInt(response.ibge));
      setSelectedState(response.ibge ? response.ibge.substring(0, 2) : "0");
    } else {
      setCityIbge(0);
    }
  };

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

  const createOrEditCondominium = async () => {
    try {
      setLoading(true);

      if (
        validateAndAlert(
          !condoAddress,
          "Por favor, preencha o endereço do condomínio."
        ) ||
        validateAndAlert(
          !addressNeighborhood,
          "Por favor, preencha o bairro do condomínio."
        ) ||
        validateAndAlert(
          !addressCEP,
          "Por favor, preencha o CEP do endereço."
        ) ||
        validateAndAlert(
          !addressNumber,
          "Por favor, preencha o número do endereço do condomínio."
        ) ||
        validateAndAlert(
          !addressCity,
          "Por favor, preencha o número do endereço do condomínio."
        )
      ) {
        return;
      }

      if (parseInt(selectedState) <= 0) {
        setLoading(false);
        setAlertMessage("Por favor, selecione o estado do condomínio.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 6000);
      }

      let apiAddress: string = "";
      if (condominiumId !== null) {
        //Enviar para Editar
        apiAddress = `/condominium/update/${condominiumId}/${addressId}`;
        setLoading(false);
      } else {
        //Enviar para criar novo
        apiAddress = "/condominium/new";
      }

      const parsedBlocks: string[] = blocksArray.map((item) => item.name);

      const condominiumObj = {
        address: condoAddress,
        addressNumber: addressNumber,
        cep: noSpecialCharactersMask(addressCEP),
        cityIbge: cityIbge,
        cnpj: noSpecialCharactersMask(condoCNPJ),
        complement: addressComplement,
        name: condoName,
        neighborhood: addressNeighborhood,
        blocks: parsedBlocks,
      };

      const controllerResponse = await fetchApi.post(
        apiAddress,
        condominiumObj,
        {
          headers: {
            Authorization: context.getToken(),
            "router-id": "WEB#API",
          },
        }
      );

      if (controllerResponse.success) {
        setLoading(false);
        setAlertMessage(
          condominiumId
            ? "Condomínio editado com sucesso."
            : "Condomínio criado com sucesso."
        );
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 6000);

        setCondoName("");
        setCondoCNPJ("");
        setCondoAddress("");
        setAddressNeighborhood("");
        setAddressNumber("");
        setAddressComplement("");
        setAddressCEP("");
        setAddressCity("");
        setCityIbge(0);
        setSelectedState("0");
        setCondoGridArray([]);
        setCondoGridCount(0);
        setBlocksArray([]);
      }

      setLoading(false);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const searchCondominiums = async (
    pageParam: number | null,
    rowPerPageParam: number | null
  ) => {
    try {
      setGridLoading(true);
      setCondoGridArray([]);

      const listResponse = await fetchApi.post(
        "/condominium",
        {
          name: condoNameSearch,
          cnpj: condoCNPJSearch,
          page: pageParam !== null ? pageParam : page,
          take: rowPerPageParam !== null ? rowPerPageParam : rowsPerPage,
        },
        {
          headers: {
            Authorization: context.getToken(),
            "router-id": "WEB#API",
          },
        }
      );

      if (listResponse.success) {
        setCondoGridArray(listResponse.data.list);

        setCondoGridCount(parseInt(listResponse.data.count));
      }

      setGridLoading(false);
    } catch (error: any) {
      console.log(error.message);
      setGridLoading(false);
    }
  };

  const catchThisCondoToEdit = async (id: number) => {
    try {
      setLoading(true);
      setCondominiumId(id);

      const condoById = await fetchApi.get(`/condominium/${id}`, {
        headers: {
          "router-id": "WEB#API",
          Authorization: context.getToken(),
        },
      });

      if (condoById.success) {
        const condo = condoById.data.condo;
        setCondoName(condo.name);
        setCondoCNPJ(cnpjMask(condo.cnpj));
        setCondoAddress(condo.address.street);
        setAddressNeighborhood(condo.address.neighborhood);
        setAddressNumber(condo.address.streetNumber);
        setAddressComplement(condo.address.complement);
        setAddressCEP(cepMask(condo.address.cep));
        setCityIbge(condo.address.cityIbge);
        setAddressCity(condo.address.city.name);
        setSelectedState(condo.address.city.state.ibge.toString());
        setAddressId(condo.address.id);

        const blocksByCondoId = await fetchApi.get(
          `/blocks/get-blocks/${condoById.data.condo.id}`,
          {
            headers: {
              "router-id": "WEB#API",
              Authorization: context.getToken(),
            },
          }
        );

        if (blocksByCondoId.success && blocksByCondoId.data) {
          setBlocksArray(blocksByCondoId.data);
        }
      }

      setLoading(false);
    } catch (error: any) {
      console.log(error.message);
      setLoading(false);
    }
  };

  const catchThisCondoToDelete = async (id: number) => {
    try {
      setLoading(true);
      setCondominiumId(id);

      const condoById = await fetchApi.get(`/condominium/${id}`, {
        headers: {
          "router-id": "WEB#API",
          Authorization: context.getToken(),
        },
      });

      if (condoById.data) {
        setCondoName(condoById.data.name);
        setCondominiumId(condoById.data.id);
      }

      setShowDeleteQuestion(true);

      setLoading(false);
    } catch (error: any) {
      console.log(error.message);
      setLoading(false);
    }
  };

  const deleteCondominium = async () => {
    try {
      setShowDeleteQuestion(false);
      setLoading(true);

      const deleteResponse = await fetchApi.del(
        `/condominium/delete/${condominiumId}/${addressId}`,
        {
          headers: {
            "router-id": "WEB#API",
            Authorization: context.getToken(),
          },
        }
      );

      if (deleteResponse.success) {
        setCondoName("");
        setCondoCNPJ("");
        setCondoAddress("");
        setAddressNeighborhood("");
        setAddressNumber("");
        setAddressComplement("");
        setAddressCEP("");
        setAddressCity("");
        setCityIbge(0);
        setSelectedState("0");
        setCondominiumId(null);
        setCondoGridCount(0);
        setCondoGridArray([]);

        setAlertMessage("Condomínio excluído com sucesso.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 6000);
      }

      setLoading(false);
    } catch (error: any) {
      console.log(error.message);

      setLoading(false);
    }
  };

  const deleteBlock = (index: number) => {
    let temp = [...blocksArray];
    temp.splice(index, 1);
    setBlocksArray(temp);
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
      ]}
      loading={loading}
      alerMessage={alertMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      title="Condomínios"
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper sx={{ p: 3 }}>
            {JSON.stringify(blocksArray)}
            <Grid
              container
              spacing={3}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12} sm={12} md={11} lg={11} xl={11}>
                <Typography
                  variant="h6"
                  sx={{ color: (theme) => theme.palette.secondary.light }}
                >
                  Pesquisa de Condomínios
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    onClick={() => {
                      setShowSearch(!showSearch);
                    }}
                  >
                    {showSearch ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
              </Grid>
              {showSearch && (
                <>
                  <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <TextField
                      variant="outlined"
                      label="Nome do Condomínio"
                      InputLabelProps={{ shrink: true }}
                      value={condoNameSearch}
                      fullWidth
                      onChange={(
                        event: ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => {
                        setCondoNameSearch(event.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <TextField
                      variant="outlined"
                      label="CNPJ do Condomínio"
                      InputLabelProps={{ shrink: true }}
                      value={condoCNPJSearch}
                      fullWidth
                      onChange={(
                        event: ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => {
                        setCondoCNPJSearch(cnpjMask(event.target.value));
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <QHGrid
                      data={condoGridArray}
                      loading={gridLoading}
                      pagination={{
                        count: condoGridCount,
                        page: page,
                        rowsPerPage: rowsPerPage,
                        rowsPerPageOptions: [5, 10, 20, 40, 50, 100],
                        onRowsPerPageChange(rowsPerPAge) {
                          setRowsPerPage(rowsPerPAge);
                          searchCondominiums(null, rowsPerPAge);
                        },
                        onPageChange(page) {
                          setPage(page);
                          searchCondominiums(page, null);
                        },
                      }}
                      hasActions
                      actionTrigger={(id: number, ruleName: string) => {
                        switch (ruleName) {
                          case "edit":
                            catchThisCondoToEdit(id);
                            break;
                          case "delete":
                            catchThisCondoToDelete(id);
                            break;
                          default:
                            setGridLoading(false);
                            setLoading(false);
                            setAlertMessage("Erro, ação não identificada");
                            setShowAlert(true);
                            setTimeout(() => {
                              setShowAlert(false);
                            }, 6000);
                            break;
                        }
                      }}
                      actions={[
                        {
                          icon: <Edit />,
                          name: "edit",
                          text: "Editar",
                        },
                        {
                          icon: <Delete />,
                          name: "delete",
                          text: "Excluir",
                        },
                      ]}
                      headers={[
                        {
                          text: "Nome",
                          attrName: "name",
                          width: 4,
                        },
                        {
                          text: "CNPJ",
                          attrName: "cnpj",
                          width: 3,
                          align: "center",
                        },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Search />}
                      type="submit"
                      onClick={() => {
                        searchCondominiums(null, null);
                      }}
                    >
                      Pesquisar
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
              spacing={3}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography
                  variant="h6"
                  sx={{ color: (theme) => theme.palette.secondary.light }}
                >
                  {condominiumId !== null
                    ? "Edite Condomínios"
                    : "Crie Novos Condomínios"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  variant="outlined"
                  label="Nome do Condomínio"
                  InputLabelProps={{ shrink: true }}
                  value={condoName}
                  fullWidth
                  onChange={(
                    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    setCondoName(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  variant="outlined"
                  label="CNPJ do Condomínio"
                  InputLabelProps={{ shrink: true }}
                  value={condoCNPJ}
                  fullWidth
                  onChange={(
                    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    setCondoCNPJ(cnpjMask(event.target.value));
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  variant="outlined"
                  label="Endereço"
                  InputLabelProps={{ shrink: true }}
                  value={condoAddress}
                  fullWidth
                  onChange={(
                    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    setCondoAddress(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  variant="outlined"
                  label="Bairro"
                  InputLabelProps={{ shrink: true }}
                  value={addressNeighborhood}
                  fullWidth
                  onChange={(
                    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    setAddressNeighborhood(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <TextField
                  variant="outlined"
                  label="Número"
                  InputLabelProps={{ shrink: true }}
                  value={addressNumber}
                  fullWidth
                  onChange={(
                    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    setAddressNumber(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <TextField
                  variant="outlined"
                  label="Complemento"
                  InputLabelProps={{ shrink: true }}
                  value={addressComplement}
                  fullWidth
                  onChange={(
                    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    setAddressComplement(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <TextField
                  variant="outlined"
                  label="CEP"
                  InputLabelProps={{ shrink: true }}
                  value={addressCEP}
                  fullWidth
                  onChange={(
                    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    getCep(event.target.value);
                    setAddressCEP(cepMask(event.target.value));
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  variant="outlined"
                  label="Cidade"
                  InputLabelProps={{ shrink: true }}
                  value={addressCity}
                  fullWidth
                  onChange={(
                    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    setAddressCity(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <FormControl fullWidth>
                  <InputLabel id="stateId">{"Estado"}</InputLabel>
                  <Select
                    labelId="stateId"
                    label="Estado"
                    value={selectedState}
                    onChange={(event: SelectChangeEvent) => {
                      setSelectedState(() => event.target.value);
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
              {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  variant="outlined"
                  label="Número de Moradias"
                  InputLabelProps={{ shrink: true }}
                  value={numberOfHomes}
                  fullWidth
                  onChange={(
                    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    setNumberOfHomes(numbersOnlyMask(event.target.value));
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  variant="outlined"
                  label="Número de Blocos"
                  InputLabelProps={{ shrink: true }}
                  value={numberOfBlocks}
                  fullWidth
                  onChange={(
                    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    setNumberOfBlocks(numbersOnlyMask(event.target.value));
                  }}
                />
              </Grid> */}
              <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
                <Typography
                  variant="h6"
                  sx={{ color: (theme) => theme.palette.secondary.light }}
                >
                  Blocos
                </Typography>
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
              {blocksArray.length > 0 &&
                blocksArray.map((item: any, index) => (
                  <>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={10}
                      lg={10}
                      xl={10}
                      key={index}
                    >
                      <Typography>
                        <b>{item.name}</b>
                      </Typography>
                    </Grid>
                    <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                      <Button
                        sx={{ color: "red" }}
                        onClick={() => {
                          deleteBlock(index);
                        }}
                        startIcon={<DeleteForever />}
                      ></Button>
                    </Grid>
                  </>
                ))}
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Save />}
                  type="submit"
                  onClick={() => {
                    createOrEditCondominium();
                  }}
                >
                  {condominiumId !== null
                    ? "Editar Condomínio"
                    : "Criar Condomínio"}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Dialog
        open={showDeleteQuestion}
        onClose={() => {
          setShowDeleteQuestion(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmação de exclusão de Condomínio.
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir o condomínio: &quot;{condoName}
            &quot; ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowDeleteQuestion(false);
            }}
          >
            cancelar
          </Button>
          <Button
            onClick={() => {
              deleteCondominium();
            }}
            autoFocus
          >
            Confirmar Exclusão.
          </Button>
        </DialogActions>
      </Dialog>
    </ViewWrapper>
  );
}
