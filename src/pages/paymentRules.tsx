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

export default function PaymentRules() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alerMessage, setAlerMessage] = useState<string>("");

  const [methodArray, setMethodArray] = useState<
    { id: number; name: string }[]
  >([]);

  const [name, setName] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const [numberOfMonthlyPayment, setNumberOfMonthlyPayment] =
    useState<string>("0");
  const [ruleValue, setRuleValue] = useState<string>("0,00");
  const [active, setActive] = useState<boolean>(false);

  const [gridArray, setGridArray] = useState<any[]>([]);
  const [gridLoading, setGridLoading] = useState<boolean>(false);
  const [gridCount, setGridCount] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [take, setTake] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const [nameSearch, setNameSearch] = useState<string>("");
  const [methodSearch, setMethodSearch] = useState<string>("");
  const [numberOfMonthlyPaymentSearch, setnumberOfMonthlyPaymentSearch] =
    useState<number>(0);
  const [ruleValueSearch, setRuleValueSearch] = useState<string>("");

  const context = useApplicationContext();

  const initialSetup = async () => {
    const controllerResponse = await fetchApi.get(
      "/paymentRules/getAllPaymentRulesMethods"
    );

    if (controllerResponse.success) {
      setMethodArray(controllerResponse.data);
    }
  };

  useEffect(() => {
    initialSetup();
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

  const createNewRule = async () => {
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

      const listResponse = await fetchApi.post(
        "/paymentRules",
        {
          name: nameSearch,
          method: methodSearch,
          numberOfMonthlyPayment: numberOfMonthlyPaymentSearch,
          ruleValue: ruleValueSearch,
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

      console.log("listResponse", listResponse);

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
                      label="Nº Mensalidades"
                      placeholder="Número de Mensalidades"
                      onChange={(
                        event: ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ): void => {
                        setnumberOfMonthlyPaymentSearch(
                          parseInt(event.target.value)
                        );
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
                          label="Valor"
                          placeholder="Valor da Regra"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Icon>attach_money</Icon>
                              </InputAdornment>
                            ),
                          }}
                          onChange={(e) => {
                            const { value } = e.target;
                            e.target.value = moneyMask(value);
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <TextField
                          InputLabelProps={{ shrink: true }}
                          fullWidth
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
                          onChange={(e) => {
                            const { value } = e.target;
                            e.target.value = moneyMask(value);
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
                            () => {};
                            break;
                          case "delete":
                            () => {};
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
                          width: 5,
                        },
                        {
                          text: "Método",
                          attrName: "method",
                          width: 2,
                        },
                        {
                          text: "Número de Mensalidades",
                          attrName: "numberOfMonthlyPayment",
                          width: 3,
                        },
                        {
                          text: "Valor",
                          attrName: "ruleValue",
                          width: 2,
                        },
                        {
                          text: "Ativo",
                          attrName: "active",
                          width: 2,
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
                  Crie/Edite Regras de Pagamento
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
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Save />}
                  type="submit"
                  onClick={createNewRule}
                >
                  Criar Nova Regra
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </ViewWrapper>
  );
}
