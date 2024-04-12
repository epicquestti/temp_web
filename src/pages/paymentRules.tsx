import QHGrid from "@/components/DataGridV2";
import ViewWrapper from "@/components/ViewWrapper";
import { useApplicationContext } from "@/context/ApplicationContext";
import fetchApi from "@/lib/fetchApi";
import { moneyMask, numbersOnlyMask } from "@/lib/masks";
import {
  Delete,
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
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

type paymentRuleProps = {
  method: number;
  name: string;
  numberOfMonthlyPayment: number;
  ruleValue: number;
  active: boolean;
};

export default function PaymentRules() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alerMessage, setAlerMessage] = useState<string>("");

  const [methodArray, setMethodArray] = useState<
    { id: number; name: string }[]
  >([]);

  const [ruleId, setRuleId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const [numberOfMonthlyPayment, setNumberOfMonthlyPayment] =
    useState<string>("0");
  const [ruleValue, setRuleValue] = useState<string>("0,00");
  const [active, setActive] = useState<boolean>(false);

  const [gridArray, setGridArray] = useState<
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
  const [gridCount, setGridCount] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [take, setTake] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showDeleteQuestion, setShowDeleteQuestion] = useState<boolean>(false);

  const [nameSearch, setNameSearch] = useState<string>("");
  const [methodSearch, setMethodSearch] = useState<string>("");
  const [numberOfMonthlyPaymentSearch, setnumberOfMonthlyPaymentSearch] =
    useState<number>(0);
  const [ruleValueSearch, setRuleValueSearch] = useState<string>("");

  const context = useApplicationContext();

  const initialSetup = async () => {
    const controllerResponse = await fetchApi.get(
      "/paymentRules/getAllPaymentRulesMethods",
      {
        headers: {
          Authorization: context.getToken(),
          "router-id": "WEB#API",
        },
      }
    );

    if (controllerResponse.success) {
      setMethodArray(controllerResponse.data);
    }
  };

  useEffect(() => {
    initialSetup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateAndAlert = (condition: boolean, message: string): boolean => {
    if (condition) {
      setLoading(false);
      setAlerMessage(message);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 6000);
      return true;
    }
    return false;
  };

  const createOrEditRule = async () => {
    try {
      setLoading(true);
      //Validar os campos
      if (
        validateAndAlert(!name, "Por favor, preencha o nome da regra.") ||
        validateAndAlert(!method, "Por favor, escolha o método.") ||
        validateAndAlert(
          !numberOfMonthlyPayment,
          "Por favor, preencha o número de mensalidades."
        ) ||
        validateAndAlert(!ruleValue, "Por favor, preencha o valor da regra.")
      ) {
        return;
      }

      //Enviar para API
      const ruleObj: paymentRuleProps = {
        active: active,
        method: parseInt(method),
        name: name,
        numberOfMonthlyPayment: parseInt(numberOfMonthlyPayment),
        ruleValue: parseFloat(ruleValue.replaceAll(".", "").replace(",", ".")),
      };
      let apiAddress: string = "";
      if (ruleId !== null) {
        //Enviar para Editar
        apiAddress = `/paymentRules/update/${ruleId}`;
        setLoading(false);
      } else {
        apiAddress = "/paymentRules/new";
      }

      const controllerResponse = await fetchApi.post(apiAddress, ruleObj, {
        headers: {
          Authorization: context.getToken(),
          "router-id": "WEB#API",
        },
      });

      if (controllerResponse.success) {
        setName("");
        setMethod("0");
        setActive(false);
        setNumberOfMonthlyPayment("0");
        setRuleValue("0,00");

        setLoading(false);
        setAlerMessage(
          ruleId !== null
            ? "Regra Editada com sucesso."
            : "Regra de Pagamento criada com sucesso."
        );
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 6000);
      } else {
        setLoading(false);
        setAlerMessage(
          controllerResponse.message
            ? controllerResponse.message
            : "Erro ao criar Regra de Pagamento."
        );
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 6000);
      }

      setLoading(false);
    } catch (error: any) {
      setGridLoading(false);
      setLoading(false);
      setAlerMessage(error.message);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 6000);
    }
  };

  const searchRules = async (
    pageParam: number | null,
    rowPerPageParam: number | null
  ) => {
    try {
      setGridLoading(true);

      setName("");
      setMethod("0");
      setActive(false);
      setNumberOfMonthlyPayment("0");
      setRuleValue("0,00");
      setRuleId(null);

      const methodId =
        parseInt(methodSearch) < 1 ? null : parseInt(methodSearch);
      const numberOfMonths =
        numberOfMonthlyPaymentSearch < 1 ? null : numberOfMonthlyPaymentSearch;
      const valueSearch =
        parseFloat(ruleValueSearch) < 1
          ? null
          : parseFloat(ruleValueSearch.replaceAll(".", "").replace(",", "."));

      const listResponse = await fetchApi.post(
        "/paymentRules",
        {
          name: nameSearch,
          method: methodId,
          numberOfMonthlyPayment: numberOfMonths,
          ruleValue: valueSearch,
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
        setGridArray(listResponse.data.list);

        setGridCount(parseInt(listResponse.data.count));
      }

      setGridLoading(false);
    } catch (error: any) {
      setGridLoading(false);
      setLoading(false);
      setAlerMessage(error.message);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 6000);
    }
  };

  const catchThisRuleToEdit = async (id: number) => {
    try {
      setLoading(true);

      const ruleById = await fetchApi.get(`/paymentRules/${id}`, {
        headers: {
          "router-id": "WEB#API",
          Authorization: context.getToken(),
        },
      });

      if (ruleById.success) {
        setRuleId(ruleById.data.id);
        setName(ruleById.data.name);
        setMethod(() => `${ruleById.data.methodId}`);
        setActive(ruleById.data.active);
        setNumberOfMonthlyPayment(ruleById.data.numberOfMontlyPayment);
        setRuleValue(moneyMask(parseFloat(ruleById.data.ruleValue).toFixed(2)));
      }

      setLoading(false);
    } catch (error: any) {
      setGridLoading(false);
      setLoading(false);
      setAlerMessage(error.message);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 6000);
    }
  };

  const catchThisRuleToDelete = async (id: number) => {
    try {
      setLoading(true);

      const ruleById = await fetchApi.get(`/paymentRules/${id}`, {
        headers: {
          "router-id": "WEB#API",
          Authorization: context.getToken(),
        },
      });

      if (ruleById.success) {
        setRuleId(ruleById.data.id);
        setName(ruleById.data.name);
        setShowDeleteQuestion(true);
      }

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const deleteRule = async () => {
    try {
      setLoading(true);
      setShowDeleteQuestion(false);

      const deleteResponse = await fetchApi.del(
        `/paymentRules/delete/${ruleId}`,
        {
          headers: {
            "router-id": "WEB#API",
            Authorization: context.getToken(),
          },
        }
      );

      if (deleteResponse.success) {
        setLoading(false);
        setAlerMessage(
          deleteResponse.message
            ? deleteResponse.message
            : "Erro ao excluir regra de pagamento."
        );
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 6000);
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
          text: "Regras de Pagamento",
          iconName: "gavel",
          href: "/paymentRules",
        },
      ]}
      loading={loading}
      alerMessage={alerMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      title="Regras de Pagamento"
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
              <Grid item xs={12} sm={12} md={11} lg={11} xl={11}>
                <Typography
                  variant="h6"
                  sx={{ color: (theme) => theme.palette.secondary.light }}
                >
                  Pesquisa de Regras
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
                      label="Nome da Regra"
                      InputLabelProps={{ shrink: true }}
                      value={nameSearch}
                      fullWidth
                      onChange={(
                        event: ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => {
                        setNameSearch(event.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <FormControl fullWidth>
                      <InputLabel id="methodRuleId">{"Método"}</InputLabel>
                      <Select
                        labelId="methodRuleId"
                        value={methodSearch}
                        label="Método"
                        onChange={(event: SelectChangeEvent) => {
                          setMethodSearch(() => event.target.value);
                        }}
                      >
                        <MenuItem value={0}>Selecione ...</MenuItem>
                        {methodArray.length > 0 &&
                          methodArray.map(
                            (item: { id: number; name: string }) => (
                              <MenuItem value={item.id} key={item.id}>
                                {item.name}
                              </MenuItem>
                            )
                          )}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={numberOfMonthlyPaymentSearch}
                      variant="outlined"
                      label="Nº Máximo de Mensalidades"
                      placeholder="Número de Mensalidades"
                      onChange={(
                        event: ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ): void => {
                        const { value } = event.target;
                        if (isNaN(parseInt(value))) {
                          setnumberOfMonthlyPaymentSearch(0);
                        } else {
                          setnumberOfMonthlyPaymentSearch(
                            parseInt(event.target.value)
                          );
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    {parseInt(methodSearch) === 1 ||
                    parseInt(methodSearch) === 3 ? (
                      <>
                        <TextField
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          variant="outlined"
                          label="Valor Máximo"
                          value={ruleValueSearch}
                          placeholder="Valor da Regra"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Icon>attach_money</Icon>
                              </InputAdornment>
                            ),
                          }}
                          onChange={(
                            event: ChangeEvent<
                              HTMLInputElement | HTMLTextAreaElement
                            >
                          ) => {
                            const { value } = event.target;

                            if (isNaN(parseInt(value))) {
                              setRuleValueSearch("0,00");
                            } else {
                              setRuleValueSearch(moneyMask(value));
                            }
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <TextField
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          variant="outlined"
                          label="Valor Máximo"
                          value={ruleValueSearch}
                          placeholder="Valor da Regra"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Icon>percentage</Icon>
                              </InputAdornment>
                            ),
                          }}
                          onChange={(
                            event: ChangeEvent<
                              HTMLInputElement | HTMLTextAreaElement
                            >
                          ) => {
                            const { value } = event.target;

                            if (isNaN(parseInt(value))) {
                              setRuleValueSearch("0,00");
                            } else {
                              setRuleValueSearch(moneyMask(value));
                            }
                          }}
                        />
                      </>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Search />}
                      type="submit"
                      onClick={() => {
                        searchRules(null, null);
                      }}
                    >
                      Pesquisar
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <QHGrid
                      data={gridArray}
                      loading={gridLoading}
                      pagination={{
                        count: gridCount,
                        page: page,
                        rowsPerPage: rowsPerPage,
                        rowsPerPageOptions: [5, 10, 20, 40, 50, 100],
                        onRowsPerPageChange(rowsPerPAge) {
                          setRowsPerPage(rowsPerPAge);
                          searchRules(null, rowsPerPAge);
                        },
                        onPageChange(page) {
                          setPage(page);
                          searchRules(page, null);
                        },
                      }}
                      hasActions
                      actionTrigger={(id: number, ruleName: string) => {
                        switch (ruleName) {
                          case "edit":
                            catchThisRuleToEdit(id);
                            break;
                          case "delete":
                            catchThisRuleToDelete(id);
                            break;
                          default:
                            setGridLoading(false);
                            setLoading(false);
                            setAlerMessage("Erro, ação não identificada");
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
                          text: "Método",
                          attrName: "methodName",
                          width: 3,
                          align: "center",
                        },
                        {
                          text: "Nº de Mensalidades",
                          attrName: "numberOfMontlyPayment",
                          width: 3,
                          align: "center",
                        },
                        {
                          text: "Valor",
                          attrName: "ruleValue",
                          width: 2,
                          align: "center",
                        },
                        {
                          text: "Ativo",
                          attrName: "active",
                          width: 2,
                          align: "center",
                          custom: {
                            isIcon: true,
                            color: "color",
                          },
                        },
                      ]}
                    />
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
              alignContent="center"
            >
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography
                  variant="h6"
                  sx={{ color: (theme) => theme.palette.secondary.light }}
                >
                  {ruleId === null
                    ? "Crie Regras de Pagamento"
                    : "Edite Regras de Pagamento"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  variant="outlined"
                  label="Nome da Regra"
                  InputLabelProps={{ shrink: true }}
                  value={name}
                  fullWidth
                  onChange={(
                    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    setName(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <FormControl fullWidth>
                  <InputLabel id="methodRuleId">{"Método"}</InputLabel>
                  <Select
                    labelId="methodRuleId"
                    value={method}
                    label="Método"
                    onChange={(event: SelectChangeEvent) => {
                      setMethod(() => event.target.value);
                    }}
                  >
                    <MenuItem value={0}>Selecione ...</MenuItem>
                    {methodArray.length > 0 &&
                      methodArray.map((item: { id: number; name: string }) => (
                        <MenuItem value={item.id} key={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <Box>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          value={active}
                          checked={active}
                          onChange={(_, checked: boolean) => {
                            setActive(checked);
                          }}
                        />
                      }
                      label="Ativo"
                    />
                  </FormGroup>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ maxLength: 3 }}
                  fullWidth
                  variant="outlined"
                  label="Nº Mensalidades"
                  value={numberOfMonthlyPayment}
                  placeholder="Número de Mensalidades"
                  onChange={(
                    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    setNumberOfMonthlyPayment(
                      numbersOnlyMask(event.target.value)
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                {parseInt(method) === 1 || parseInt(method) === 3 ? (
                  <>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      variant="outlined"
                      label="Valor"
                      value={ruleValue}
                      placeholder="Valor da Regra"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon>attach_money</Icon>
                          </InputAdornment>
                        ),
                      }}
                      onChange={(
                        event: ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => {
                        const { value } = event.target;

                        if (isNaN(parseInt(value))) {
                          setRuleValue("0,00");
                        } else {
                          setRuleValue(moneyMask(value));
                        }
                      }}
                    />
                  </>
                ) : (
                  <>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={ruleValue}
                      variant="outlined"
                      label="Valor"
                      placeholder="Valor da Regra"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon>percentage</Icon>
                          </InputAdornment>
                        ),
                      }}
                      onChange={(
                        event: ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => {
                        const value = event.target.value;

                        if (isNaN(parseInt(value))) {
                          setRuleValue("0,00");
                        } else {
                          setRuleValue(moneyMask(value));
                        }
                      }}
                    />
                  </>
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Delete />}
                  type="submit"
                  onClick={() => {
                    setName("");
                    setMethod("0");
                    setActive(false);
                    setNumberOfMonthlyPayment("0");
                    setRuleValue("0,00");
                    setRuleId(null);
                  }}
                >
                  Limpar Dados
                </Button>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Save />}
                  type="submit"
                  onClick={createOrEditRule}
                >
                  {ruleId === null ? "Criar Nova Regra" : "Editar Regra"}
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
          Confirmação de exclusão de regra de pagamento.
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir a regra: &quot;{name}&quot; ?
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
              deleteRule();
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
