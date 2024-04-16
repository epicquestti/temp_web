import QHGrid from "@/components/DataGridV2";
import ViewWrapper from "@/components/ViewWrapper";
import { useApplicationContext } from "@/context/ApplicationContext";
import fetchApi from "@/lib/fetchApi";
import { cpfMask, noSpecialCharactersMask, phoneMask } from "@/lib/masks";
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
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

export default function Residents() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [showDeleteQuestion, setShowDeleteQuestion] = useState<boolean>(false);

  const context = useApplicationContext();

  const [residentId, setResidentId] = useState<number | null>(null);
  const [residentName, setResidentName] = useState<string>("");
  const [residentCPF, setResidentCPF] = useState<string>("");
  const [residentRG, setResidentRG] = useState<string>("");
  const [residentHomeNumber, setResidentHomeNumber] = useState<string>("");
  const [residentHomeBlock, setResidentHomeBlock] = useState<string>("");
  const [residentEmail, setResidentEmail] = useState<string>("");
  const [residentPhone, setResidentPhone] = useState<string>("");
  const [isPropertyOwner, setIsPropertyOwner] = useState<boolean>(false);
  const [isEmployee, setIsEmployee] = useState<boolean>(false);
  const [condominiumId, setCondominiumId] = useState<number>(1);

  const [residentNameSearch, setResidentNameSearch] = useState<string>("");
  const [residentCPFSearch, setResidentCPFSearch] = useState<string>("");

  const [residentsGridArray, setResidentsGridArray] = useState<
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
  const [residentsGridCount, setResidentsGridCount] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [page, setPage] = useState<number>(0);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  //Pegar o ID do condomínio
  useEffect(() => {}, []);

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

  const createOrEditResident = async () => {
    try {
      setLoading(true);

      if (
        validateAndAlert(
          !residentName,
          "Por favor, preencha o nome do residente."
        ) ||
        validateAndAlert(
          !residentCPF,
          "Por favor, preencha o CPF do residente."
        ) ||
        validateAndAlert(
          !residentPhone,
          "Por favor, preencha o telefone do residente."
        )
      ) {
        return;
      }
      let apiAddress: string = "";
      if (residentId !== null) {
        //Enviar para Editar
        apiAddress = `/residents/update/${residentId}`;
        setLoading(false);
      } else {
        //Enviar para criar novo
        apiAddress = "/residents/new";
      }

      const residentObj = {
        name: residentName,
        cpf: noSpecialCharactersMask(residentCPF),
        rg: noSpecialCharactersMask(residentRG),
        phone: noSpecialCharactersMask(residentPhone),
        isPropertyOwner: isPropertyOwner,
        isEmployee: isEmployee,
        condominiumId: 1,
        email: residentEmail,
        homeNumber: residentHomeNumber,
        homeBlock: residentHomeBlock,
      };

      const controllerResponse = await fetchApi.post(apiAddress, residentObj, {
        headers: {
          Authorization: context.getToken(),
          "router-id": "WEB#API",
        },
      });

      if (controllerResponse.success) {
        setResidentName("");
        setResidentCPF("");
        setResidentRG("");
        setResidentPhone("");
        setResidentEmail("");
        setResidentHomeNumber("");
        setResidentHomeBlock("");
        setIsEmployee(false);
        setIsPropertyOwner(false);

        setLoading(false);
        setAlertMessage(
          residentId !== null
            ? "Residente editado com sucesso."
            : "Residente criado com sucesso."
        );
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 6000);
        setResidentsGridArray([]);
        setResidentsGridCount(0);
        setShowSearch(false);
      } else {
        setLoading(false);
        setAlertMessage(
          controllerResponse.message
            ? controllerResponse.message
            : "Erro ao criar Regra de Pagamento."
        );
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 6000);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const searchResidents = async (
    pageParam: number | null,
    rowPerPageParam: number | null
  ) => {
    try {
      setGridLoading(true);
      setResidentsGridArray([]);

      const listResponse = await fetchApi.post(
        "/residents",
        {
          name: residentNameSearch,
          cpf: residentCPFSearch !== "" ? residentCPFSearch : null,
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
        setResidentsGridArray(listResponse.data.list);

        setResidentsGridCount(parseInt(listResponse.data.count));
      }

      setGridLoading(false);
    } catch (error: any) {
      console.log(error.message);
      setGridLoading(false);
    }
  };

  const catchThisResidentToEdit = async (id: number) => {
    try {
      setLoading(true);
      setResidentId(id);

      const residentById = await fetchApi.get(`/residents/${id}`, {
        headers: {
          "router-id": "WEB#API",
          Authorization: context.getToken(),
        },
      });

      if (residentById.data.id) {
        setResidentCPF(cpfMask(residentById.data.cpf));
        setResidentEmail(residentById.data.email);
        setResidentName(residentById.data.name);
        setResidentPhone(phoneMask(residentById.data.phone));
        setResidentRG(residentById.data.rg);
        setIsEmployee(residentById.data.isEmployee);
        setIsPropertyOwner(residentById.data.isPropertyOwner);
        setResidentHomeNumber(residentById.data.homeNumber);
        setResidentHomeBlock(residentById.data.homeBlock);
      }

      setLoading(false);
    } catch (error: any) {
      console.log(error.message);
      setLoading(false);
      setAlertMessage("Erro ao capturar Residente.");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 6000);
    }
  };

  const catchThisResidentToDelete = async (id: number) => {
    try {
      setLoading(true);

      const residentById = await fetchApi.get(`/residents/${id}`, {
        headers: {
          "router-id": "WEB#API",
          Authorization: context.getToken(),
        },
      });

      if (residentById.data) {
        setResidentName(residentById.data.name);
        setResidentId(residentById.data.id);
      }

      setShowDeleteQuestion(true);
      setLoading(false);
    } catch (error: any) {
      console.log(error.message);
      setLoading(false);
    }
  };
  const deleteResident = async () => {
    try {
      setLoading(true);
      setShowDeleteQuestion(false);

      const deleteResponse = await fetchApi.del(
        `/residents/delete/${residentId}/${condominiumId}`,
        {
          headers: {
            "router-id": "WEB#API",
            Authorization: context.getToken(),
          },
        }
      );

      console.log("deleteResponse", deleteResponse);

      if (deleteResponse.success) {
        setResidentName("");
        setResidentCPF("");
        setResidentRG("");
        setResidentPhone("");
        setResidentEmail("");
        setResidentHomeNumber("");
        setResidentHomeBlock("");
        setIsEmployee(false);
        setIsPropertyOwner(false);
        setResidentsGridArray([]);
        setResidentsGridCount(0);
        setShowSearch(false);

        setLoading(false);
        setAlertMessage(
          deleteResponse.message
            ? deleteResponse.message
            : "Erro ao excluir Residente."
        );
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

  return (
    <ViewWrapper
      locals={[
        {
          text: "Início",
          iconName: "home",
          href: "/",
        },
        {
          text: "Residentes",
          iconName: "person",
          href: "/residents",
        },
      ]}
      loading={loading}
      alerMessage={alertMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      title="Residentes"
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
                  Pesquisa de Residentes
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
                      label="Nome do Residente"
                      InputLabelProps={{ shrink: true }}
                      value={residentNameSearch}
                      fullWidth
                      onChange={(
                        event: ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => {
                        setResidentNameSearch(event.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <TextField
                      variant="outlined"
                      label="CPF do Residente"
                      InputLabelProps={{ shrink: true }}
                      value={residentCPFSearch}
                      fullWidth
                      onChange={(
                        event: ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => {
                        setResidentCPFSearch(event.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <QHGrid
                      data={residentsGridArray}
                      loading={gridLoading}
                      pagination={{
                        count: residentsGridCount,
                        page: page,
                        rowsPerPage: rowsPerPage,
                        rowsPerPageOptions: [5, 10, 20, 40, 50, 100],
                        onRowsPerPageChange(rowsPerPAge) {
                          setRowsPerPage(rowsPerPAge);
                          searchResidents(null, rowsPerPAge);
                        },
                        onPageChange(page) {
                          setPage(page);
                          searchResidents(page, null);
                        },
                      }}
                      hasActions
                      actionTrigger={(id: number, ruleName: string) => {
                        switch (ruleName) {
                          case "edit":
                            catchThisResidentToEdit(id);
                            break;
                          case "delete":
                            catchThisResidentToDelete(id);
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
                          text: "CPF",
                          attrName: "cpf",
                          width: 3,
                          align: "center",
                        },
                        {
                          text: "Telefone",
                          attrName: "phone",
                          width: 3,
                          align: "center",
                        },
                        {
                          text: "Titular",
                          attrName: "isPropertyOwner",
                          width: 2,
                          align: "center",
                        },
                        {
                          text: "Empregado",
                          attrName: "isEmployee",
                          width: 2,
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
                        searchResidents(null, null);
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
                  {residentId !== null
                    ? "Edite Residentes"
                    : "Crie Novos Residentes"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  variant="outlined"
                  label="Nome do Residente"
                  InputLabelProps={{ shrink: true }}
                  value={residentName}
                  fullWidth
                  onChange={(
                    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    setResidentName(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  variant="outlined"
                  label="CPF do Residente"
                  InputLabelProps={{ shrink: true }}
                  value={residentCPF}
                  fullWidth
                  onChange={(
                    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    setResidentCPF(cpfMask(event.target.value));
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  variant="outlined"
                  label="RG do Residente"
                  inputProps={{ maxLength: 9 }}
                  InputLabelProps={{ shrink: true }}
                  value={residentRG}
                  fullWidth
                  onChange={(
                    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    setResidentRG(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  variant="outlined"
                  label="Telefone do Residente"
                  inputProps={{ maxLength: 15 }}
                  InputLabelProps={{ shrink: true }}
                  value={residentPhone}
                  fullWidth
                  onChange={(
                    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    setResidentPhone(phoneMask(event.target.value));
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <TextField
                  variant="outlined"
                  label="E-Mail do Residente"
                  inputProps={{ maxLength: 15 }}
                  InputLabelProps={{ shrink: true }}
                  value={residentEmail}
                  fullWidth
                  onChange={(
                    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    setResidentEmail(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <TextField
                  variant="outlined"
                  label="Nº Casa/Apto"
                  inputProps={{ maxLength: 15 }}
                  InputLabelProps={{ shrink: true }}
                  value={residentHomeNumber}
                  fullWidth
                  onChange={(
                    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    setResidentHomeNumber(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <TextField
                  variant="outlined"
                  label="Bloco"
                  inputProps={{ maxLength: 15 }}
                  InputLabelProps={{ shrink: true }}
                  value={residentHomeBlock}
                  fullWidth
                  onChange={(
                    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => {
                    setResidentHomeBlock(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isPropertyOwner}
                      onChange={(
                        event: ChangeEvent<HTMLInputElement>,
                        checked: boolean
                      ) => {
                        setIsPropertyOwner(checked);
                      }}
                    />
                  }
                  label="Proprietário do Imóvel?"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isEmployee}
                      onChange={(
                        event: ChangeEvent<HTMLInputElement>,
                        checked: boolean
                      ) => {
                        setIsEmployee(checked);
                      }}
                    />
                  }
                  label="Funcionário do Imóvel?"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Save />}
                  type="submit"
                  onClick={() => {
                    createOrEditResident();
                  }}
                >
                  {residentId !== null ? "Editar Residente" : "Criar Residente"}
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
          Confirmação de exclusão de Residente.
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir o residente: &quot;{residentName}
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
              deleteResident();
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
