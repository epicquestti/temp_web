import QHGrid from "@/components/DataGridV2";
import ViewWrapper from "@/components/ViewWrapper";
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
import { ChangeEvent, useState } from "react";
import "suneditor/dist/css/suneditor.min.css";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

export default function SystemFeatures() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alerMessage, setAlerMessage] = useState<string>("");

  const [toolId, setToolId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [descriptionHTML, setDescriptionHTML] = useState<string>("");

  const [nameSearch, setNameSearch] = useState<string>("");
  const [editorContent, setEditorContent] = useState<string>("");

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

  const searchTools = async (
    pageParam: number | null,
    rowPerPageParam: number | null
  ) => {};

  const catchThisToolToEdit = async (id: number) => {};

  const catchThisToolToDelete = async (id: number) => {};

  const deleteTool = async () => {};

  const createOrEditTool = async () => {};

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
                        searchTools(null, null);
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
                          searchTools(null, rowsPerPAge);
                        },
                        onPageChange(page) {
                          setPage(page);
                          searchTools(page, null);
                        },
                      }}
                      hasActions
                      actionTrigger={(id: number, ruleName: string) => {
                        console.log(ruleName);
                        switch (ruleName) {
                          case "edit":
                            catchThisToolToEdit(id);
                            break;
                          case "delete":
                            catchThisToolToDelete(id);
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
                  {toolId === null
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
              {JSON.stringify(editorContent)}
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <SunEditor
                  lang="pt_br"
                  height="300"
                  setContents={editorContent}
                  onChange={(contents) => setEditorContent(contents)}
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
                  {toolId === null
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
              deleteTool();
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
