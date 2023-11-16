import QHGrid from "@/components/DataGridV2";
import ViewWrapper from "@/components/ViewWrapper";
import { useApplicationContext } from "@/context/ApplicationContext";
import fetchApi from "@/lib/fetchApi";
import { Close, Delete, Edit, Search, Send } from "@mui/icons-material";
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
  Paper,
  TextField,
} from "@mui/material";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";

export default function Actions() {
  const context = useApplicationContext();

  const [loading, setLoading] = useState<boolean>(false);

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alerMessage, setAlerMessage] = useState<string>("");

  const [actionId, setActionId] = useState<number | undefined>(undefined);
  const [actionName, setActionName] = useState<string>("");
  const [actionActive, setActionActive] = useState<boolean>(false);

  const [searchName, setSearchName] = useState<string>("");
  const [searchActive, setSearchActive] = useState<boolean>(true);

  const [gridLoading, setGridLoading] = useState<boolean>(false);

  const [showDeleteQuestion, setShowDeleteQuestion] = useState<boolean>(false);

  const [actionList, setActionList] = useState<
    {
      id: bigint;
      name: string;
      active: boolean;
    }[]
  >([]);
  const [gridCount, setGridCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowPerPage, setRowPerPage] = useState<number>(5);

  const listActionst = async (
    pageParam: number | null,
    rowPerPageParam: number | null
  ) => {
    try {
      setGridLoading(true);
      const listResponse = await fetchApi.post(
        "/actions",
        {
          name: searchName,
          active: searchActive,
          page: pageParam !== null ? pageParam : page,
          take: rowPerPageParam !== null ? rowPerPageParam : rowPerPage,
        },
        {
          headers: {
            Authorization: context.getToken(),
            "router-id": "WEB#API",
          },
        }
      );

      if (listResponse.success) {
        setActionList(listResponse.data.list);
        setGridCount(listResponse.data.count);
      } else throw new Error(listResponse.message);

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

  const listActionstByEnterKeyPress = async (
    e: KeyboardEvent<HTMLDivElement>
  ) => {
    if (e.key === "Enter") await listActionst(null, null);
  };

  const catchThisActionToEdit = async (id: number) => {
    try {
      setLoading(true);

      const actionById = await fetchApi.get(`/actions/${id}`, {
        headers: {
          "router-id": "WEB#API",
          Authorization: context.getToken(),
        },
      });

      if (actionById.success) {
        setActionId(actionById.data.id);
        setActionName(actionById.data.name);
        setActionActive(actionById.data.active);
      } else throw new Error(actionById.message);

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

  const catchThisActionToDelete = async (id: number) => {
    try {
      setLoading(true);

      const actionById = await fetchApi.get(`/actions/${id}`, {
        headers: {
          "router-id": "WEB#API",
          Authorization: context.getToken(),
        },
      });

      if (actionById.success) {
        setActionId(actionById.data.id);
        setActionName(actionById.data.name);
        setActionActive(actionById.data.active);
        setShowDeleteQuestion(true);
      } else throw new Error(actionById.message);

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

  const deleteAction = async () => {
    try {
      setLoading(true);

      const actionById = await fetchApi.del(`/actions/${actionId}/delete`, {
        headers: {
          "router-id": "WEB#API",
          Authorization: context.getToken(),
        },
      });

      if (actionById.success) {
        setActionId(undefined);
        setActionName("");
        setActionActive(false);

        listActionst(null, null);

        setLoading(false);
        setShowDeleteQuestion(false);
      } else throw new Error(actionById.message);
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

  const updateAction = async () => {
    try {
      if (!actionName) throw new Error("Insira o nome da ação.");
      setLoading(true);

      const actionById = await fetchApi.put(
        `/actions/${actionId}/update`,
        {
          id: actionId,
          active: actionActive,
          name: actionName,
        },
        {
          headers: {
            "router-id": "WEB#API",
            Authorization: context.getToken(),
          },
        }
      );

      if (actionById.success) {
        setActionId(undefined);
        setActionName("");
        setActionActive(false);

        listActionst(null, null);
        setLoading(false);
      } else throw new Error(actionById.message);
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

  const saveAction = async () => {
    try {
      if (!actionName) throw new Error("Insira o nome da ação.");

      setLoading(true);

      const actionCreated = await fetchApi.post(
        `/actions/new`,
        {
          active: actionActive,
          name: actionName,
        },
        {
          headers: {
            "router-id": "WEB#API",
            Authorization: context.getToken(),
          },
        }
      );

      if (actionCreated.success) {
        setActionId(undefined);
        setActionName("");
        setActionActive(false);

        listActionst(null, null);
        setLoading(false);
      } else throw new Error(actionCreated.message);
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

  useEffect(() => {
    listActionst(null, null);
  }, []);

  return (
    <ViewWrapper
      locals={[
        {
          text: "Início",
          iconName: "home",
          href: "/",
        },
        {
          text: "Ações",
          iconName: "settings_accessibility",
          href: "/actions",
        },
      ]}
      loading={loading}
      alerMessage={alerMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      title="Ações"
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                <TextField
                  variant="standard"
                  label="ação"
                  fullWidth
                  value={actionName}
                  placeholder="insira o nome da ação"
                  onChange={(e) => {
                    setActionName(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={actionActive}
                        onChange={(
                          event: ChangeEvent<HTMLInputElement>,
                          checked: boolean
                        ) => {
                          setActionActive(checked);
                        }}
                      />
                    }
                    label="Ativo"
                  />
                </Box>
              </Grid>
              {actionId ? (
                <>
                  <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      endIcon={<Close />}
                      onClick={() => {
                        setActionId(undefined);
                        setActionName("");
                        setActionActive(false);
                      }}
                    >
                      Cancelar
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Button
                      variant="outlined"
                      fullWidth
                      endIcon={<Edit />}
                      onClick={() => {
                        updateAction();
                      }}
                    >
                      Editar
                    </Button>
                  </Grid>
                </>
              ) : (
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    endIcon={<Send />}
                    onClick={saveAction}
                  >
                    Salvar
                  </Button>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                    <TextField
                      variant="standard"
                      label="nome da ação para buscar"
                      fullWidth
                      onKeyDown={listActionstByEnterKeyPress}
                      placeholder="busque pelo nome da ação."
                      value={searchName}
                      onChange={(e) => {
                        setSearchName(e.target.value);
                      }}
                      InputProps={{
                        startAdornment: <Search />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={searchActive}
                            onChange={(
                              event: ChangeEvent<HTMLInputElement>,
                              checked: boolean
                            ) => {
                              setSearchActive(checked);
                            }}
                          />
                        }
                        label="Ativo"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={2} xl={2}>
                    <Button
                      variant="outlined"
                      fullWidth
                      endIcon={<Search />}
                      onClick={() => {
                        listActionst(null, null);
                      }}
                    >
                      buscar
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <QHGrid
                  data={actionList}
                  loading={gridLoading}
                  pagination={{
                    count: gridCount,
                    page: page,
                    rowsPerPage: rowPerPage,
                    rowsPerPageOptions: [5, 10, 20, 40, 50, 100],
                    onRowsPerPageChange(rowsPerPAge) {
                      setRowPerPage(rowsPerPAge);
                      listActionst(null, rowsPerPAge);
                    },
                    onPageChange(page) {
                      setPage(page);
                      listActionst(page, null);
                    },
                  }}
                  hasActions
                  actionTrigger={(id: number, actionName: string) => {
                    switch (actionName) {
                      case "edit":
                        catchThisActionToEdit(id);
                        break;
                      case "delete":
                        catchThisActionToDelete(id);
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
                      align: "center",
                    },
                    {
                      text: "Ativo",
                      attrName: "active",
                      align: "center",
                      width: 2,
                      custom: {
                        isIcon: true,
                        icon: "add_alert",
                      },
                    },
                  ]}
                />
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
          Confirmação de exclusão de ação.
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir a ação: &quot;{actionName}&quot; ?
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
              deleteAction();
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
