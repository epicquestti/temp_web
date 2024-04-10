import QHGrid from "@/components/DataGridV2";
import ViewWrapper from "@/components/ViewWrapper";
import { useApplicationContext } from "@/context/ApplicationContext";
import fetchApi from "@/lib/fetchApi";
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
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

export default function Plans() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alerMessage, setAlerMessage] = useState<string>("");

  const [systemFeaturesArray, setSystemFeaturesArray] = useState<
    { id: number; name: string; checked: boolean }[]
  >([]);
  const [selectedFeaturesArray, setSelectedFeaturesArray] = useState<number[]>(
    []
  );

  const [planRulesArray, setPlanRulesArray] = useState<any[]>([]);
  const [plansArray, setPlansArray] = useState<any[]>([]);

  const [planId, setPlanId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [planValue, setPlanValue] = useState<string>("0,00");

  const [groupsArray, setGroupsArray] = useState<any[]>([]);
  const [groupId, setGroupId] = useState<string>("");

  const [displayOnSite, setDisplayOnSite] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);

  const [nameSearch, setNameSearch] = useState<string>("");
  const [ruleNameSearch, setRuleNameSearch] = useState<string>("");
  const [methodSearch, setMethodSearch] = useState<string>("");
  const [numberOfMonthlyPaymentSearch, setnumberOfMonthlyPaymentSearch] =
    useState<number>(0);
  const [ruleValueSearch, setRuleValueSearch] = useState<string>("");

  const [methodArray, setMethodArray] = useState<
    { id: number; name: string }[]
  >([]);

  const [gridArray, setGridArray] = useState<
    {
      id?: bigint;
      name: string;
      descriptionHTML: string;
    }[]
  >([]);
  const [gridLoading, setGridLoading] = useState<boolean>(false);
  const [gridCount, setGridCount] = useState<number>(0);
  const [actions, setActions] = useState<
    {
      icon: JSX.Element;
      name: string;
      text: string;
    }[]
  >([
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
    {
      icon: <Add />,
      name: "inserir",
      text: "Inserir",
    },
  ]);

  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [page, setPage] = useState<number>(0);

  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showRulesSearch, setShowRulesSearch] = useState<boolean>(false);
  const [showDeleteQuestion, setShowDeleteQuestion] = useState<boolean>(false);

  const context = useApplicationContext();

  const initialSetup = async () => {
    const controllerResponse = await fetchApi.get("/systemFeatures/get-all", {
      headers: {
        Authorization: context.getToken(),
        "router-id": "WEB#API",
      },
    });

    const groupsResponse = await fetchApi.get("/groups/get-all", {
      headers: {
        Authorization: context.getToken(),
        "router-id": "WEB#API",
      },
    });

    if (groupsResponse.success) {
      setGroupsArray(groupsResponse.data);
    }

    if (controllerResponse.success) {
      setSystemFeaturesArray(controllerResponse.data);
    }
  };

  useEffect(() => {
    initialSetup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchPlans = async (
    pageParam: number | null,
    rowPerPageParam: number | null
  ) => {
    try {
      setGridLoading(true);
      setPlansArray([]);

      const listResponse = await fetchApi.post(
        "/plans",
        {
          name: nameSearch,
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

  const catchThisPlanToEdit = async (id: number) => {
    const planById = await fetchApi.get(`/plans/${id}`, {
      headers: {
        "router-id": "WEB#API",
        Authorization: context.getToken(),
      },
    });

    if (planById.success) {
      setName(planById.data.name);
      setGroupId(planById.data.group.id);
      setDisplayOnSite(planById.data.displayOnSite);
      setActive(planById.data.active);
      setPlanValue(moneyMask(parseFloat(planById.data.value).toFixed(2)));

      if (planById.data.PlansFeatures.length > 0) {
        let allFeatures = await fetchApi.get("/systemFeatures/get-all", {
          headers: {
            "router-id": "WEB#API",
            Authorization: context.getToken(),
          },
        });
        console.log("allFeatures", allFeatures);
        const planFeatures = planById.data.PlansFeatures.map((item: any) => {
          return {
            id: item.systemFeature.id,
            name: item.systemFeature.name,
          };
        });

        for (const feature of allFeatures.data) {
          // Check if the feature's id exists in planFeatures using some()
          feature.checked = planFeatures.data?.some(
            (planFeature: any) => planFeature.id === feature.id || false
          );
        }

        console.log("allFeatures.data", allFeatures.data);
      }
    }
  };

  const catchThisPlanToDelete = async (id: number) => {};

  const handleChange = (event: SelectChangeEvent<number[]>, object: any) => {
    const appFuncIndexChecked = object.props["data-this-checked"];
    const appFuncIndex = object.props["data-this-index"];
    const { value } = object.props;
    const tempSystemFeaturesArray = [...systemFeaturesArray];
    const tempSystemFeaturesArrayItem = {
      ...tempSystemFeaturesArray[appFuncIndex],
    };

    tempSystemFeaturesArrayItem.checked = !appFuncIndexChecked;
    tempSystemFeaturesArray[appFuncIndex] = tempSystemFeaturesArrayItem;

    setSystemFeaturesArray(tempSystemFeaturesArray);
  };

  // const searchRules = async (
  //   pageParam: number | null,
  //   rowPerPageParam: number | null
  // ) => {
  //   try {
  //     setGridLoading(true);

  //     const methodId =
  //       parseInt(methodSearch) < 1 ? null : parseInt(methodSearch);
  //     const numberOfMonths =
  //       numberOfMonthlyPaymentSearch < 1 ? null : numberOfMonthlyPaymentSearch;
  //     const valueSearch =
  //       parseFloat(ruleValueSearch) < 1
  //         ? null
  //         : parseFloat(ruleValueSearch.replaceAll(".", "").replace(",", "."));

  //     const listResponse = await fetchApi.post(
  //       "/paymentRules",
  //       {
  //         name: nameSearch,
  //         method: methodId,
  //         numberOfMonthlyPayment: numberOfMonths,
  //         ruleValue: valueSearch,
  //         page: pageParam !== null ? pageParam : page,
  //         take: rowPerPageParam !== null ? rowPerPageParam : rowsPerPage,
  //       },
  //       {
  //         headers: {
  //           Authorization: context.getToken(),
  //           "router-id": "WEB#API",
  //         },
  //       }
  //     );

  //     if (listResponse.success) {
  //       setGridArray(listResponse.data.list);

  //       setGridCount(parseInt(listResponse.data.count));
  //     }

  //     setGridLoading(false);
  //   } catch (error: any) {
  //     setGridLoading(false);
  //     setLoading(false);
  //     setAlerMessage(error.message);
  //     setShowAlert(true);
  //     setTimeout(() => {
  //       setShowAlert(false);
  //     }, 6000);
  //   }
  // };

  const addRuleToPlan = async (id: number, ruleName: string) => {
    try {
      setLoading(true);

      const ruleById = await fetchApi.get(`/paymentRules/${id}`, {
        headers: {
          "router-id": "WEB#API",
          Authorization: context.getToken(),
        },
      });

      if (ruleById.success) {
        const itemIndex = planRulesArray.findIndex((item) => item.id === id);
        if (itemIndex > -1) {
          setLoading(false);
          return;
        } else {
          setPlanRulesArray([
            ...planRulesArray,
            { id: ruleById.data.id, name: ruleById.data.name },
          ]);
        }
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

  const removeRuleFromPlan = async (item: any) => {
    console.log(item);

    const itemIndex = planRulesArray.findIndex((value) => value.id === item.id);
    console.log("itemIndex", itemIndex);

    if (itemIndex !== -1) {
      const temp = [...planRulesArray];
      temp.splice(itemIndex, 1);
      setPlanRulesArray(temp);
    } else {
      return;
    }
  };

  const createPlan = async () => {
    try {
      setLoading(true);
      let apiAddress: string = "";

      if (!name) {
        setLoading(false);
        setAlerMessage("Por favor, preencha o nome do plano.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 6000);
        return;
      }

      if (planId) {
        apiAddress = `/plans/update/${planId}`;
      } else {
        apiAddress = `/plans/new`;
      }

      const planObj = {
        name: name,
        features: systemFeaturesArray,
        active: active,
        displayOnSite: displayOnSite,
        groupId: groupId,
        planValue: parseFloat(planValue.replaceAll(".", "").replace(",", ".")),
      };

      const controllerResponse = await fetchApi.post(apiAddress, planObj, {
        headers: {
          Authorization: context.getToken(),
          "router-id": "WEB#API",
        },
      });

      if (controllerResponse.success) {
        setName("");
        setPlanValue("0,00");
        setSystemFeaturesArray([]);
        setGroupId("");
        setDisplayOnSite(false);
        setActive(false);
        setPlanRulesArray([]);
        setPlansArray([]);

        setLoading(false);
        setAlerMessage("Plano criado com sucesso.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 6000);
        return;
      }

      console.log("controllerResponse", controllerResponse);

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
          text: "Planos",
          iconName: "assignment",
          href: "/plans",
        },
      ]}
      loading={loading}
      alerMessage={alerMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      title="Planos"
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
                {JSON.stringify(nameSearch)}
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
                      label="Nome do Plano"
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
                      data={gridArray}
                      loading={gridLoading}
                      pagination={{
                        count: gridCount,
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
                          case "edit":
                            catchThisPlanToEdit(id);
                            break;
                          case "delete":
                            catchThisPlanToDelete(id);
                            break;
                          case "insert":
                            catchThisPlanToDelete(id);
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
        {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
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
                      setShowRulesSearch(!showRulesSearch);
                    }}
                  >
                    {showRulesSearch ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
              </Grid>
              {showRulesSearch && (
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
                        console.log(ruleName);
                        switch (ruleName) {
                          case "insert":
                            addRuleToPlan(id, ruleName);
                            break;
                          case "delete":
                            // catchThisRuleToDelete(id);
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
                          icon: <Add />,
                          name: "insert",
                          text: "Inserir no Plano",
                        },
                        // {
                        //   icon: <Delete />,
                        //   name: "delete",
                        //   text: "Excluir",
                        // },
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
        </Grid> */}
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
                  {planId === null ? "Crie Planos" : "Edite Planos"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  variant="outlined"
                  label="Nome do Plano"
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
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <FormControl fullWidth>
                  <InputLabel>{"Funcionalidades"}</InputLabel>
                  <Select
                    multiple
                    value={selectedFeaturesArray}
                    onChange={handleChange}
                    input={<OutlinedInput label="Funcionalidades" />}
                    renderValue={(selected) => `Ferramentas(s) do App.`}
                  >
                    {systemFeaturesArray.map((item, index) => (
                      <MenuItem
                        key={`app-tools-item-${index}`}
                        value={item.id}
                        data-this-index={index}
                        data-this-checked={item.checked}
                      >
                        <Checkbox checked={item.checked} />
                        <ListItemText primary={item.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <FormControl fullWidth>
                  <InputLabel id="groupId">{"Grupo"}</InputLabel>
                  <Select
                    labelId="groupId"
                    value={groupId}
                    label="Grupo"
                    onChange={(event: SelectChangeEvent) => {
                      setGroupId(() => event.target.value);
                    }}
                  >
                    <MenuItem value={0}>Selecione ...</MenuItem>
                    {groupsArray.length > 0 &&
                      groupsArray.map((item: { id: number; name: string }) => (
                        <MenuItem value={item.id} key={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <TextField
                  variant="outlined"
                  label="Valor do Plano"
                  InputLabelProps={{ shrink: true }}
                  value={planValue}
                  fullWidth
                  onChange={(
                    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    const { value } = event.target;

                    if (isNaN(parseInt(value))) {
                      setPlanValue("0,00");
                    } else {
                      setPlanValue(moneyMask(value));
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={displayOnSite}
                        onChange={(
                          event: ChangeEvent<HTMLInputElement>,
                          checked: boolean
                        ) => {
                          setDisplayOnSite(checked);
                        }}
                      />
                    }
                    label="Mostrar no Site"
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={active}
                        onChange={(
                          event: ChangeEvent<HTMLInputElement>,
                          checked: boolean
                        ) => {
                          setActive(checked);
                        }}
                      />
                    }
                    label="Ativo"
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper sx={{ p: 3 }}>
            <Grid
              container
              spacing={3}
              alignItems="flex-start"
              justifyContent="flex-start"
              alignContent="flex-start"
            >
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography
                  variant="h6"
                  sx={{ color: (theme) => theme.palette.secondary.light }}
                >
                  Resumo do Plano
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                <Typography variant="body1">
                  Nome do Plano: <b>{name}</b>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Typography variant="body1">
                  Valor do Plano: <b>R$ {planValue}</b>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Typography variant="body1">
                  Plano Ativo?: <b>{active ? "Sim" : "Não"}</b>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Typography variant="body1">
                  Exibir Plano no Site?: <b>{displayOnSite ? "Sim" : "Não"}</b>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="body1">
                  Funcionalidades do Plano:
                </Typography>
                <br />
                {systemFeaturesArray.map((item) => {
                  if (item.checked) {
                    return (
                      <Typography variant="body1" key={item.id}>
                        <b>{item.name}</b>
                      </Typography>
                    );
                  }
                })}
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Save />}
                  type="submit"
                  onClick={() => {
                    createPlan();
                  }}
                >
                  {planId !== null ? "Editar Plano" : "Criar Plano"}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </ViewWrapper>
  );
}
