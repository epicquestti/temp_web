import QHGrid from "@/components/DataGridV2";
import ViewWrapper from "@/components/ViewWrapper";
import { useApplicationContext } from "@/context/ApplicationContext";
import fetchApi from "@/lib/fetchApi";
import { generateKey } from "@/lib/helpers/random";
import { moneyMask } from "@/lib/masks";
import {
  Add,
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
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useState } from "react";

export default function SubscriptionKey() {
  const context = useApplicationContext();
  const [showPlanSearch, setShowPlanSearch] = useState<boolean>(false);
  const [planNameSearch, setPlanNameSearch] = useState<string>("");
  const [planGridArray, setPlanGridArray] = useState<
    {
      id?: bigint;
      name: string;
      descriptionHTML: string;
    }[]
  >([]);
  const [planGridLoading, setPlanGridLoading] = useState<boolean>(false);
  const [planGridCount, setPlanGridCount] = useState<number>(0);

  const [showRuleSearch, setShowRuleSearch] = useState<boolean>(false);
  const [ruleNameSearch, setRuleNameSearch] = useState<string>("");
  const [ruleValueSearch, setRuleValueSearch] = useState<string>("");
  const [numberOfMonthlyPaymentSearch, setnumberOfMonthlyPaymentSearch] =
    useState<number>(0);
  const [ruleGridArray, setRuleGridArray] = useState<
    {
      id?: bigint;
      name: string;
      descriptionHTML: string;
    }[]
  >([]);
  const [ruleGridLoading, setRuleGridLoading] = useState<boolean>(false);
  const [ruleGridCount, setRuleGridCount] = useState<number>(0);

  const [showKeySearch, setShowKeySearch] = useState<boolean>(false);
  const [keyGridLoading, setKeyGridLoading] = useState<boolean>(false);
  const [keyGridCount, setKeyGridCount] = useState<number>(0);
  const [keyGridArray, setKeyGridArray] = useState<
    {
      id?: bigint;
      name: string;
      descriptionHTML: string;
    }[]
  >([]);

  const [methodSearch, setMethodSearch] = useState<string>("");
  const [methodArray, setMethodArray] = useState<
    { id: number; name: string }[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alerMessage, setAlerMessage] = useState<string>("");
  const [showDeleteQuestion, setShowDeleteQuestion] = useState<boolean>(false);

  const [showKeyCreationResult, setShowKeyCreationResult] =
    useState<boolean>(false);

  const [keyValue, setKeyValue] = useState<string>("");
  const [keyId, setKeyId] = useState<number | null>(null);
  const [keyPlan, setKeyPlan] = useState<{
    id: string;
    name: string;
    value: string;
  }>({
    id: "",
    name: "",
    value: "0,00",
  });
  const [keyRules, setKeyRules] = useState<
    {
      id: string;
      name: string;
      method: { id: string; name: string };
      numberOfMonths: number;
      value: string;
      active: string;
    }[]
  >([]);

  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [page, setPage] = useState<number>(0);

  const searchPlans = async (
    pageParam: number | null,
    rowPerPageParam: number | null
  ) => {
    try {
      setPlanGridLoading(true);

      const listResponse = await fetchApi.post(
        "/plans",
        {
          name: planNameSearch,
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
        setPlanGridArray(listResponse.data.list);

        setPlanGridCount(parseInt(listResponse.data.count));
      }

      setPlanGridLoading(false);
    } catch (error: any) {
      setPlanGridLoading(false);
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
      setRuleGridLoading(true);

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
          name: ruleNameSearch,
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
        setRuleGridArray(listResponse.data.list);

        setRuleGridCount(parseInt(listResponse.data.count));
      }

      setRuleGridLoading(false);
    } catch (error: any) {
      setRuleGridLoading(false);
      setLoading(false);
      setAlerMessage(error.message);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 6000);
    }
  };

  const addPlanToKey = async (id: number) => {
    try {
      setLoading(true);
      setRuleGridLoading(true);
      setPlanGridLoading(true);

      const planById = await fetchApi.get(`/plans/${id}`, {
        headers: {
          "router-id": "WEB#API",
          Authorization: context.getToken(),
        },
      });

      if (planById.success) {
        setKeyPlan(planById.data);
      }

      setLoading(false);
      setRuleGridLoading(false);
      setPlanGridLoading(false);
    } catch (error: any) {
      setLoading(false);
      setRuleGridLoading(false);
      setPlanGridLoading(false);
      console.log(error.message);
    }
  };
  const removePlanFromKey = async (id: number) => {};

  const addRuleToKey = async (id: number) => {
    try {
      setLoading(true);
      setRuleGridLoading(true);
      setPlanGridLoading(true);

      const ruleById = await fetchApi.get(`/paymentRules/${id}`, {
        headers: {
          "router-id": "WEB#API",
          Authorization: context.getToken(),
        },
      });

      if (ruleById.success) {
        let temp = [...keyRules];

        temp = [
          ...temp,
          {
            id: ruleById.data.id,
            active: ruleById.data.active ? "Sim" : "Não",
            method: ruleById.data.method,
            name: ruleById.data.name,
            numberOfMonths: ruleById.data.numberOfMontlyPayment,
            value: moneyMask(parseFloat(ruleById.data.ruleValue).toFixed(2)),
          },
        ];

        setKeyRules(temp);
      }

      setLoading(false);
      setRuleGridLoading(false);
      setPlanGridLoading(false);
    } catch (error: any) {
      setLoading(false);
      setRuleGridLoading(false);
      setPlanGridLoading(false);
      console.log(error.message);
    }
  };
  const removeRuleFromKey = async (id: number) => {
    const temp = [...keyRules];

    const indexToRemove = temp.findIndex((item) => parseInt(item.id) === id);

    if (indexToRemove !== -1) {
      temp.splice(indexToRemove, 1); // Remove one element at the specified index
    }

    setKeyRules(temp);
  };

  const createOrEditKey = async () => {
    try {
      setLoading(true);
      let apiAddress: string = "";

      if (keyId) {
        apiAddress = `/subscriptionKeys/update/${keyId}`;
      } else {
        apiAddress = `/subscriptionKeys/new`;
      }

      const generatedKey = generateKey(15);

      setKeyValue(generatedKey);

      const parsedRules = keyRules.map((item) => item.id);

      const keyObj = {
        value: generatedKey,
        available: true,
        planId: keyPlan.id,
        paymentRules: parsedRules,
      };

      const controllerResponse = await fetchApi.post(apiAddress, keyObj, {
        headers: {
          "router-id": "WEB#API",
          Authorization: context.getToken(),
        },
      });

      if (controllerResponse.success) {
        setLoading(false);
        setShowKeyCreationResult(true);
        setAlerMessage(
          controllerResponse.data.id
            ? "Chave de Acesso editada com sucesso."
            : "Chave de Acesso criada com sucesso."
        );
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 6000);
        return;
      }

      setLoading(false);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const searchKeys = async (
    pageParam: number | null,
    rowPerPageParam: number | null
  ) => {
    try {
      setKeyGridLoading(true);

      const listResponse = await fetchApi.post(
        "/subscriptionKeys",
        {
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
        setKeyGridArray(listResponse.data.list);

        setKeyGridCount(parseInt(listResponse.data.count));
      }

      setKeyGridLoading(false);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const catchThisKeyToEdit = async (id: number) => {
    try {
      setKeyId(id);

      const keyById = await fetchApi.get(`/subscriptionKeys/${keyId}`, {
        headers: {
          Authorization: context.getToken(),
          "router-id": "WEB#API",
        },
      });

      if (keyById.success) {
        setKeyValue(keyById.data.value);
        setKeyPlan(keyById.data.plan);
        if (keyById.data.SubscriptionKeyRules.length > 0) {
          const temp = keyById.data.SubscriptionKeyRules.map((item: any) => {
            return {
              id: item.rule.id,
              name: item.rule.name,
              method: { id: item.rule.method.id, name: item.rule.method.name },
              numberOfMonths: item.rule.numberOfMontlyPayment,
              value: item.rule.ruleValue,
              active: item.rule.active,
            };
          });
          setKeyRules(temp);
        }
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const catchThisKeyToDelete = async (id: number) => {
    try {
      setLoading(true);

      const keyById = await fetchApi.get(`/subscriptionKeys/${id}`, {
        headers: {
          "router-id": "WEB#API",
          Authorization: context.getToken(),
        },
      });

      if (keyById.success) {
        setKeyId(keyById.data.id);
        setKeyValue(keyById.data.value);
        setShowDeleteQuestion(true);
      }

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const deleteKey = async () => {
    try {
      setLoading(true);
      setShowDeleteQuestion(false);

      const deleteResponse = await fetchApi.del(
        `/subscriptionKeys/delete/${keyId}`,
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
            : "Erro ao excluir Chave de Acesso."
        );
        searchKeys(null, null);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 6000);
      }

      setLoading(false);
    } catch (error: any) {
      console.log(error.message);
      setLoading(false);
      setAlerMessage(error.message || "Erro ao excluir chave.");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 6000);
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
          text: "Chaves de Acesso",
          iconName: "vpn_key",
          href: "/subscriptionKey",
        },
      ]}
      loading={loading}
      alerMessage={alerMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      title="Chaves de Acesso"
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
                  Pesquisa de Chaves
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
                      setShowKeySearch(!showKeySearch);
                    }}
                  >
                    {showKeySearch ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
              </Grid>
              {showKeySearch && (
                <>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Search />}
                      type="submit"
                      onClick={() => {
                        searchKeys(null, null);
                      }}
                    >
                      Pesquisar
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <QHGrid
                      data={keyGridArray}
                      loading={keyGridLoading}
                      pagination={{
                        count: keyGridCount,
                        page: page,
                        rowsPerPage: rowsPerPage,
                        rowsPerPageOptions: [5, 10, 20, 40, 50, 100],
                        onRowsPerPageChange(rowsPerPAge) {
                          setRowsPerPage(rowsPerPAge);
                          searchKeys(null, rowsPerPAge);
                        },
                        onPageChange(page) {
                          setPage(page);
                          searchKeys(page, null);
                        },
                      }}
                      hasActions
                      actionTrigger={(id: number, planName: string) => {
                        switch (planName) {
                          case "edit":
                            catchThisKeyToEdit(id);
                            break;
                          case "delete":
                            catchThisKeyToDelete(id);
                            break;
                          default:
                            setKeyGridLoading(false);
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
                          text: "Valor",
                          attrName: "value",
                          width: 4,
                        },
                        {
                          text: "Plano",
                          attrName: "plan",
                          width: 2,
                          align: "center",
                        },
                        {
                          text: "Disponível",
                          attrName: "available",
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
            >
              <Grid item xs={12} sm={12} md={11} lg={11} xl={11}>
                <Typography
                  variant="h6"
                  sx={{ color: (theme) => theme.palette.secondary.light }}
                >
                  Pesquisa de Planos
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
                      setShowPlanSearch(!showPlanSearch);
                    }}
                  >
                    {showPlanSearch ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
              </Grid>
              {showPlanSearch && (
                <>
                  <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <TextField
                      variant="outlined"
                      label="Nome do Plano"
                      InputLabelProps={{ shrink: true }}
                      value={planNameSearch}
                      fullWidth
                      onChange={(
                        event: ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => {
                        setPlanNameSearch(event.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Search />}
                      type="submit"
                      onClick={() => {
                        searchPlans(null, null);
                      }}
                    >
                      Pesquisar
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <QHGrid
                      data={planGridArray}
                      loading={planGridLoading}
                      pagination={{
                        count: planGridCount,
                        page: page,
                        rowsPerPage: rowsPerPage,
                        rowsPerPageOptions: [5, 10, 20, 40, 50, 100],
                        onRowsPerPageChange(rowsPerPAge) {
                          setRowsPerPage(rowsPerPAge);
                          searchPlans(null, rowsPerPAge);
                        },
                        onPageChange(page) {
                          setPage(page);
                          searchPlans(page, null);
                        },
                      }}
                      hasActions
                      actionTrigger={(id: number, planName: string) => {
                        switch (planName) {
                          case "add":
                            addPlanToKey(id);
                            break;
                          case "delete":
                            removePlanFromKey(id);
                            break;
                          default:
                            setPlanGridLoading(false);
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
                          icon: <Add />,
                          name: "add",
                          text: "Adicionar à Chave",
                        },
                      ]}
                      headers={[
                        {
                          text: "Nome",
                          attrName: "name",
                          width: 4,
                        },
                        {
                          text: "Valor",
                          attrName: "planValue",
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
                        {
                          text: "Exibir no Site",
                          attrName: "displayOnSite",
                          width: 2,
                          align: "center",
                          custom: {
                            isIcon: true,
                            color: "displayColor",
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
            >
              <Grid item xs={12} sm={12} md={11} lg={11} xl={11}>
                <Typography
                  variant="h6"
                  sx={{
                    color: (theme) => theme.palette.secondary.light,
                  }}
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
                      setShowRuleSearch(!showRuleSearch);
                    }}
                  >
                    {showRuleSearch ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
              </Grid>
              {showRuleSearch && (
                <>
                  <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <TextField
                      variant="outlined"
                      label="Nome da Regra"
                      InputLabelProps={{ shrink: true }}
                      value={ruleNameSearch}
                      fullWidth
                      onChange={(
                        event: ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => {
                        setRuleNameSearch(event.target.value);
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
                      data={ruleGridArray}
                      loading={ruleGridLoading}
                      pagination={{
                        count: ruleGridCount,
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
                          case "add":
                            addRuleToKey(id);
                            break;
                          case "remove":
                            removeRuleFromKey(id);
                            break;
                          default:
                            setRuleGridLoading(false);
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
                          icon: <Add />,
                          name: "add",
                          text: "Adiciona Regra à Chave",
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
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
                <Typography
                  variant="h6"
                  sx={{ color: (theme) => theme.palette.secondary.light }}
                >
                  Resumo da Chave
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Delete />}
                  type="submit"
                  onClick={() => {
                    setKeyPlan({
                      id: "",
                      name: "",
                      value: "0,00",
                    });
                    setKeyRules([]);
                  }}
                >
                  Limpar Dados
                </Button>
              </Grid>
              <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                <Typography variant="body1">
                  Plano Associado: <b>{keyPlan?.name}</b>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Typography variant="body1">
                  Valor do Plano:{" "}
                  <b>{moneyMask(parseFloat(keyPlan?.value).toFixed(2))}</b>
                </Typography>
              </Grid>
              {keyPlan.id ? (
                <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                  <IconButton
                    sx={{ color: "red" }}
                    onClick={() => {
                      setKeyPlan({ id: "", name: "", value: "0,00" });
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              ) : (
                <Grid item xs={12} sm={12} md={1} lg={1} xl={1}></Grid>
              )}
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="body1">
                  <b>Regras de Pagamento</b>
                  <br />
                </Typography>
              </Grid>

              {keyRules.length > 0 &&
                keyRules.map((item, index) => (
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
                          `1px solid ${theme.palette.primary.dark}`,
                        padding: 1,
                        borderRadius: 1,
                      }}
                    >
                      <Grid container alignItems="center">
                        <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                          <Typography variant="body1">
                            Nome: <b>{item.name}</b>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                          <Typography variant="body1">
                            Método: <b>{item.method.name}</b>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                          <Typography variant="body1">
                            Valor: <b>{item.value}</b>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                          <IconButton
                            sx={{ color: "red" }}
                            onClick={() => {
                              removeRuleFromKey(Number(item.id));
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                          <Typography variant="body1">
                            Número de Mensalidades: <b>{item.numberOfMonths}</b>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                          <Typography variant="body1">
                            Regra Ativa: <b>{item.active}</b>
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                ))}

              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Save />}
                  type="submit"
                  onClick={createOrEditKey}
                >
                  {keyId === null ? "Criar Nova Chave" : "Editar Chave"}
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
          Confirmação de exclusão de Chave de Acesso.
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir a chave:{" "}
            <b>&quot;{keyValue}&quot;</b> ?
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
              deleteKey();
            }}
            autoFocus
          >
            Confirmar Exclusão.
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showKeyCreationResult}
        onClose={() => {
          setShowKeyCreationResult(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {keyId !== null
            ? "Chave de Acesso editada com sucesso."
            : `Chave de Acesso criada com sucesso`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Valor da Chave de Acesso {keyId !== null ? "editada" : `criada`}:
            &quot;<b>{keyValue}</b>&quot; ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowKeyCreationResult(false);
            }}
          >
            Fechar
          </Button>

          <Button
            onClick={async () => {
              await navigator.clipboard.writeText(keyValue);
            }}
            autoFocus
          >
            Copiar Código
          </Button>
        </DialogActions>
      </Dialog>
    </ViewWrapper>
  );
}
