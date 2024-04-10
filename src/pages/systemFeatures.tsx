import QHGrid from "@/components/DataGridV2";
import ViewWrapper from "@/components/ViewWrapper";
import { useApplicationContext } from "@/context/ApplicationContext";
import fetchApi from "@/lib/fetchApi";
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
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import dynamic from "next/dynamic";
import { ChangeEvent, useRef, useState } from "react";

import "suneditor/dist/css/suneditor.min.css";
import SunEditorCore from "suneditor/src/lib/core";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

export default function SystemFeatures() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alerMessage, setAlerMessage] = useState<string>("");

  const [featureId, setFeatureId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [descriptionHTML, setDescriptionHTML] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [nameSearch, setNameSearch] = useState<string>("");
  const editor = useRef<SunEditorCore>();

  const [gridArray, setGridArray] = useState<
    {
      id?: bigint;
      name: string;
      descriptionHTML: string;
    }[]
  >([]);
  const [gridLoading, setGridLoading] = useState<boolean>(false);
  const [gridCount, setGridCount] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [page, setPage] = useState<number>(0);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showDeleteQuestion, setShowDeleteQuestion] = useState<boolean>(false);

  const context = useApplicationContext();

  const getSunEditorInstance = (sunEditor: any) => {
    editor.current = sunEditor;
  };

  const createOrEditTool = async () => {
    try {
      setLoading(true);
      let apiAddress: string = "";

      if (!name) {
        setLoading(false);
        setAlerMessage("Por favor, preencha o nome da ferramenta do App.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 6000);
        return;
      }

      if (featureId) {
        apiAddress = `/systemFeatures/update/${featureId}`;
      } else {
        apiAddress = "/systemFeatures/new";
      }

      const systemFeatureObj = {
        name: name,
        descriptionHTML: descriptionHTML,
        description: description,
      };

      const controllerResponse = await fetchApi.post(
        apiAddress,
        systemFeatureObj,
        {
          headers: {
            Authorization: context.getToken(),
            "router-id": "WEB#API",
          },
        }
      );

      console.log("controllerResponse", controllerResponse);

      if (controllerResponse.success) {
        setLoading(false);
        setName("");
        setDescription("");
        setDescriptionHTML("");
        setAlerMessage(
          controllerResponse.message
            ? controllerResponse.message
            : "Ferramenta do App criada/editada com sucesso."
        );
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 6000);
        return;
      } else {
        setLoading(false);
        setAlerMessage(
          controllerResponse.message
            ? controllerResponse.message
            : "Erro ao criar/editar Ferramenta do App."
        );
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 6000);
        return;
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const searchSystemFeatures = async (
    pageParam: number | null,
    rowPerPageParam: number | null
  ) => {
    try {
      setGridLoading(true);
      setName("");
      setDescription("");
      setDescriptionHTML("");

      const listObj = {
        name: nameSearch,
        page: pageParam !== null ? pageParam : page,
        take: rowPerPageParam !== null ? rowPerPageParam : rowsPerPage,
      };

      const listResponse = await fetchApi.post("/systemFeatures", listObj, {
        headers: {
          Authorization: context.getToken(),
          "router-id": "WEB#API",
        },
      });

      if (listResponse.success) {
        setGridArray(listResponse.data.list);

        setGridCount(parseInt(listResponse.data.count));
      }

      setGridLoading(false);
    } catch (error: any) {
      console.log(error.message);
      setGridLoading(false);
      return;
    }
  };

  const catchThisFeatureToEdit = async (id: number) => {
    try {
      setLoading(true);

      const systemById = await fetchApi.get(`/systemFeatures/${id}`, {
        headers: {
          "router-id": "WEB#API",
          Authorization: context.getToken(),
        },
      });

      if (systemById.success) {
        setFeatureId(systemById.data.id);
        setName(systemById.data.name);
        setDescription(systemById.data.description);
        setDescriptionHTML(systemById.data.descriptionHTML);
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

  const catchThisFeatureToDelete = async (id: number) => {
    try {
      setLoading(true);

      const systemById = await fetchApi.get(`/systemFeatures/${id}`, {
        headers: {
          "router-id": "WEB#API",
          Authorization: context.getToken(),
        },
      });

      if (systemById.success) {
        setFeatureId(systemById.data.id);
        setName(systemById.data.name);
        setShowDeleteQuestion(true);
      }

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const deleteSystemFeature = async () => {
    try {
      setLoading(true);
      setShowDeleteQuestion(false);

      const deleteResponse = await fetchApi.del(
        `/systemFeatures/delete/${featureId}`,
        {
          headers: {
            "router-id": "WEB#API",
            Authorization: context.getToken(),
          },
        }
      );

      console.log("deleteResponse", deleteResponse);
      if (deleteResponse.success) {
        setLoading(false);
        setAlerMessage(
          deleteResponse.message
            ? deleteResponse.message
            : "Erro ao excluir Ferramenta do App."
        );
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 6000);
        searchSystemFeatures(null, null);
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
          text: "Ferramentas do App",
          iconName: "list_alt",
          href: "/systemFeatures",
        },
      ]}
      loading={loading}
      alerMessage={alerMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      title="Ferramentas do App"
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
                  Pesquisa de Ferramentas do App
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
                      label="Nome da Ferramenta"
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
                        searchSystemFeatures(null, null);
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
                          searchSystemFeatures(null, rowsPerPAge);
                        },
                        onPageChange(page) {
                          setPage(page);
                          searchSystemFeatures(page, null);
                        },
                      }}
                      hasActions
                      actionTrigger={(id: number, ruleName: string) => {
                        console.log(ruleName);
                        switch (ruleName) {
                          case "edit":
                            catchThisFeatureToEdit(id);
                            break;
                          case "delete":
                            catchThisFeatureToDelete(id);
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
                          text: "Descrição",
                          attrName: "description",
                          width: 8,
                          align: "center",
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
                  {featureId === null
                    ? "Crie Ferramentas do App"
                    : "Edite Ferramentas do App"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  variant="outlined"
                  label="Nome da Ferramenta"
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
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography
                  variant="h6"
                  sx={{ color: (theme) => theme.palette.secondary.dark }}
                >
                  Descrição da Ferramenta
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <SunEditor
                  lang="pt_br"
                  setAllPlugins
                  height="300"
                  // setOptions={{ buttonList: buttonList.complex }}
                  setContents={descriptionHTML}
                  onChange={(contents: string) => {
                    setDescriptionHTML(contents);
                    const aa = editor.current?.getText();
                    setDescription(aa ? aa : "");
                  }}
                  getSunEditorInstance={getSunEditorInstance}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Save />}
                  type="submit"
                  onClick={createOrEditTool}
                >
                  {featureId === null
                    ? "Criar Nova Ferramenta"
                    : "Editar Ferramenta"}
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
          Confirmação de exclusão de ferramenta do App.
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir a ferramenta: &quot;{name}&quot; ?
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
              deleteSystemFeature();
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
