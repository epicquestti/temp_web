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
import { ChangeEvent, useEffect, useState } from "react";

export default function Functions() {
  const context = useApplicationContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [gridLoading, setGridLoading] = useState<boolean>(false);
  const [gridCount, setGridCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alerMessage, setAlerMessage] = useState<string>("");

  const [functionId, setFunctionId] = useState<number | undefined>(undefined);
  const [showDeleteQuestion, setShowDeleteQuestion] = useState<boolean>(false);

  const [searchName, setSearchName] = useState<string>("");
  const [searchVisible, setSearchVisible] = useState<boolean>(true);
  const [searchActive, setSearchActive] = useState<boolean>(true);

  const [functionList, setFunctionList] = useState<
    {
      id: bigint;
      name: string;
      active: boolean;
    }[]
  >([]);

  const listFunctions = async (
    pageParam: number | null,
    rowPerPageParam: number | null
  ) => {
    try {
      setGridLoading(true);
      const listResponse = await fetchApi.post(
        "/functions",
        {
          name: searchName,
          active: searchActive,
          path: searchName,
          codeName: searchName,
          visible: searchVisible,
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
        setFunctionList(listResponse.data.list);
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

  const catchThisFunctionToEdit = async (id: number) => {};

  const catchThisFunctionToDelete = async (id: number) => {};

  useEffect(() => {
    listFunctions(null, null);
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
          text: "Funções",
          iconName: "pending_actions",
          href: "/functions",
        },
      ]}
      loading={loading}
      alerMessage={alerMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      title="Funções"
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                <TextField
                  variant="standard"
                  label="Função"
                  fullWidth
                  placeholder="insira o nome da função"
                  onChange={(e) => {}}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <TextField
                  variant="standard"
                  label="Identificação"
                  fullWidth
                  placeholder="Insira o nome da função"
                  onChange={(e) => {}}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <TextField
                  variant="standard"
                  label="icone"
                  fullWidth
                  placeholder="insira um icone presente em https://materialui.co/icons"
                  onChange={(e) => {}}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
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
                        onChange={(
                          event: ChangeEvent<HTMLInputElement>,
                          checked: boolean
                        ) => {}}
                      />
                    }
                    label="Ativo"
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  variant="standard"
                  label="url"
                  fullWidth
                  placeholder="Insira a url da função"
                  onChange={(e) => {}}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
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
                        onChange={(
                          event: ChangeEvent<HTMLInputElement>,
                          checked: boolean
                        ) => {}}
                      />
                    }
                    label="Visivel"
                  />
                </Box>
              </Grid>
              {functionId ? (
                <>
                  <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      endIcon={<Close />}
                      onClick={() => {}}
                    >
                      Cancelar
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Button
                      variant="outlined"
                      fullWidth
                      endIcon={<Edit />}
                      onClick={() => {}}
                    >
                      Editar
                    </Button>
                  </Grid>
                </>
              ) : (
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <Button variant="outlined" fullWidth endIcon={<Send />}>
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
                  <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                    <TextField
                      variant="standard"
                      label="Buscar"
                      fullWidth
                      // onKeyDown={listActionstByEnterKeyPress}
                      placeholder="busque funções por nome, identificação ou url."
                      // value={searchName}
                      // onChange={(e) => {
                      //   setSearchName(e.target.value);
                      // }}
                      InputProps={{
                        startAdornment: <Search />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
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
                            // checked={searchActive}
                            onChange={(
                              event: ChangeEvent<HTMLInputElement>,
                              checked: boolean
                            ) => {}}
                          />
                        }
                        label="Ativo"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
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
                            // checked={searchActive}
                            onChange={(
                              event: ChangeEvent<HTMLInputElement>,
                              checked: boolean
                            ) => {}}
                          />
                        }
                        label="Visivel"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Button
                      variant="outlined"
                      fullWidth
                      endIcon={<Search />}
                      onClick={() => {
                        listFunctions(null, null);
                      }}
                    >
                      buscar
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <QHGrid
                  data={functionList}
                  loading={gridLoading}
                  pagination={{
                    count: gridCount,
                    page: page,
                    rowsPerPage: rowsPerPage,
                    rowsPerPageOptions: [5, 10, 20, 40, 50, 100],
                    onRowsPerPageChange(rowsPerPAge) {
                      setRowsPerPage(rowsPerPAge);
                      // listActionst(null, rowsPerPAge);
                    },
                    onPageChange(page) {
                      setPage(page);
                      // listActionst(page, null);
                    },
                  }}
                  hasActions
                  actionTrigger={(id: number, functionName: string) => {
                    switch (functionName) {
                      case "edit":
                        catchThisFunctionToEdit(id);
                        break;
                      case "delete":
                        catchThisFunctionToDelete(id);
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
                      text: "Função",
                      attrName: "name",
                      align: "center",
                    },
                    {
                      text: "Identificação",
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
                    {
                      text: "Visível",
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
            Tem certeza que deseja excluir a ação: &quot;{"asdasd"}&quot; ?
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
              // deleteAction();
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
