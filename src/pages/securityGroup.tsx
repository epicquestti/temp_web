import QHGrid from "@/components/DataGridV2";
import ViewWrapper from "@/components/ViewWrapper";
import { useApplicationContext } from "@/context/ApplicationContext";
import fetchApi from "@/lib/fetchApi";
import {
  Close,
  Delete,
  Edit,
  Home,
  PublishedWithChanges,
  Search,
  Send,
} from "@mui/icons-material";
import {
  Autocomplete,
  AutocompleteRenderInputParams,
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
  Typography,
} from "@mui/material";
import { ChangeEvent, KeyboardEvent, useState } from "react";

export default function SecurityGroup() {
  //States de Controle
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showDeleteQuestion, setShowDeleteQuestion] = useState<boolean>(false);
  const [alerMessage, setAlerMessage] = useState<string>("");
  const [gridLoading, setGridLoading] = useState<boolean>(false);
  const [gridCount, setGridCount] = useState<number>(0);
  const [functionCount, setFunctionCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [groupList, setGroupList] = useState<
    {
      id: bigint;
      name: string;
      codeName: string;
      color: string;
      active: boolean;
      super: boolean;
    }[]
  >([]);

  //States de Armazenamento
  const [groupId, setGroupId] = useState<number | null>(null);
  const [groupName, setGroupName] = useState<string | null>("");
  const [groupIdentification, setGroupIdentification] = useState<string | null>(
    ""
  );
  const [groupColor, setGroupColor] = useState<string | null>("");
  const [groupActive, setGroupActive] = useState<boolean>(false);
  const [groupSuper, setGroupSuper] = useState<boolean>(false);
  const [groupFunctions, setGroupFunctions] = useState<any[]>([]);

  const [searchName, setSearchName] = useState<string | null>("");
  const [searchIdentification, setSearchIdentification] = useState<
    string | null
  >("");
  const [searchColor, setSearchColor] = useState<string | null>("");
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const [searchSuper, setSearchSuper] = useState<boolean>(false);

  const [functionSearchName, setFunctionSearchName] = useState<string | null>(
    ""
  );
  const [autocompleteOptions, setAutocompleteOptions] = useState<any[]>([]);

  const context = useApplicationContext();

  const searchGroupsByKeyPress = async (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") await searchGroups(null, null);
  };

  const searchGroups = async (
    pageParam: number | null,
    rowPerPageParam: number | null
  ) => {
    try {
      setGridLoading(true);
      const listResponse = await fetchApi.post(
        "/groups",
        {
          name: searchName,
          codeName: searchIdentification,
          color: searchColor,
          active: searchActive,
          super: searchSuper,
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
        setGroupList(listResponse.data.list);
        setGridCount(listResponse.data.count);
        setGroupId(null);
        setGroupName("");
        setGroupActive(false);
        setGroupSuper(false);
        setGroupIdentification("");
        setGroupColor("");
        setGroupFunctions([]);
        setFunctionSearchName("");
        setAutocompleteOptions([]);
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

  const catchThisGroupToEdit = async (id: number) => {
    try {
      setLoading(true);

      const groupById = await fetchApi.get(`/groups/${id}`, {
        headers: {
          "router-id": "WEB#API",
          Authorization: context.getToken(),
        },
      });

      console.log("groupById", groupById);

      if (groupById.success) {
        setGroupId(groupById.data.group.id);
        setGroupName(groupById.data.group.name);
        setGroupIdentification(groupById.data.group.codeName);
        setGroupColor(groupById.data.group.color);
        setGroupActive(groupById.data.group.active);
        setGroupSuper(groupById.data.group.super);
        setGroupFunctions(groupById.data.groupFunctions);
        setFunctionCount(groupById.data.count);
      } else throw new Error(groupById.message);

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

  const catchThisGroupToDelete = async (id: number) => {
    try {
      setLoading(true);

      const groupById = await fetchApi.get(`/groups/${id}`, {
        headers: {
          "router-id": "WEB#API",
          Authorization: context.getToken(),
        },
      });
      setShowDeleteQuestion(true);
      setGroupName(groupById.data.group.name);
      setGroupId(groupById.data.group.id);

      // if (groupById.success) {
      //   setGroupIdentification(groupById.data.group.codeName);
      //   setGroupColor(groupById.data.group.color);
      //   setGroupActive(groupById.data.group.active);
      // } else throw new Error(groupById.message);

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

  const createGroup = async () => {
    try {
      if (!groupName) throw new Error("Insira o nome do grupo.");
      if (!groupIdentification)
        throw new Error("Insira o nome da identificação do grupo.");

      setLoading(true);

      const parsedFunctionsArray = groupFunctions.map((e) => {
        return {
          id: Number(e.id),
          freeForGroup: e.freeForGroup,
        };
      });

      const actionCreated = await fetchApi.post(
        `/groups/new`,
        {
          name: groupName,
          codeName: groupIdentification,
          color: groupColor,
          active: groupActive,
          super: groupSuper,
          createdById: 1,
          functions: parsedFunctionsArray,
        },
        {
          headers: {
            "router-id": "WEB#API",
            Authorization: context.getToken(),
          },
        }
      );

      if (actionCreated.success) {
        setGroupId(null);
        setGroupName("");
        setGroupActive(false);
        setGroupSuper(false);
        setGroupIdentification("");
        setGroupColor("");
        setGroupFunctions([]);
        setFunctionSearchName("");
        setAutocompleteOptions([]);

        setLoading(false);
        setShowAlert(true);
        setAlerMessage(actionCreated.message || "");
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

  const updateGroup = async () => {
    try {
      if (!groupName) throw new Error("Insira o nome do grupo.");
      setLoading(true);

      const functionsParsedArray = groupFunctions.map((e) => {
        return {
          id: Number(e.id),
          freeForGroup: e.freeForGroup,
        };
      });

      const updateResponse = await fetchApi.put(
        `/groups/${groupId}/update`,
        {
          id: groupId,
          name: groupName,
          codeName: groupIdentification,
          color: groupColor,
          active: groupActive,
          super: groupSuper,
          functions: functionsParsedArray,
        },
        {
          headers: {
            "router-id": "WEB#API",
            Authorization: context.getToken(),
          },
        }
      );

      if (updateResponse.success) {
        setGroupId(null);
        setGroupName("");
        setGroupActive(false);

        searchGroups(null, null);
        setLoading(false);
      } else throw new Error(updateResponse.message);
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

  const deleteGroup = async () => {
    try {
      setLoading(true);

      const deleteResponse = await fetchApi.del(`/groups/${groupId}/delete`, {
        headers: {
          "router-id": "WEB#API",
          Authorization: context.getToken(),
        },
      });

      if (deleteResponse.success) {
        setGroupId(null);
        setGroupName("");
        setGroupActive(false);
        setGroupColor("");
        setGroupIdentification("");
        setGroupFunctions([]);

        searchGroups(null, null);

        setLoading(false);
        setShowDeleteQuestion(false);
      } else throw new Error(deleteResponse.message);
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

  const searchFunctions = async (functionName: string) => {
    const apiResponse = await fetchApi.post(`/functions/get-by-name`, {
      name: functionName,
    });

    if (apiResponse.success && apiResponse.data.length > 0) {
      setAutocompleteOptions(apiResponse.data);
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
          text: "Grupo de segurança",
          iconName: "group_work",
          href: "/securityGroup",
        },
      ]}
      loading={loading}
      alerMessage={alerMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      title="Grupos de segurança"
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography
                  variant="h6"
                  sx={{ color: (theme) => theme.palette.secondary.light }}
                >
                  Busque grupos existentes
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <TextField
                  variant="standard"
                  label="Nome do grupo"
                  InputLabelProps={{ shrink: true }}
                  value={searchName}
                  fullWidth
                  onKeyDown={searchGroupsByKeyPress}
                  placeholder="Insira o nome do grupo"
                  onChange={(e) => {
                    setSearchName(e.target.value);
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <TextField
                  variant="standard"
                  label="Identificação"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={searchIdentification}
                  onKeyDown={searchGroupsByKeyPress}
                  placeholder="insira a identificação"
                  onChange={(e) => {
                    setSearchIdentification(e.target.value);
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <TextField
                  variant="standard"
                  label="Cor"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={searchColor}
                  onKeyDown={searchGroupsByKeyPress}
                  placeholder="insira o código hexadecimal da cor"
                  onChange={(e) => {
                    setSearchColor(e.target.value);
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
                        checked={searchActive}
                        onChange={(
                          event: ChangeEvent<HTMLInputElement>,
                          checked: boolean
                        ) => {
                          setSearchActive(event.target.checked);
                        }}
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
                        checked={searchSuper}
                        onChange={(
                          event: ChangeEvent<HTMLInputElement>,
                          checked: boolean
                        ) => {
                          setSearchSuper(event.target.checked);
                        }}
                      />
                    }
                    label="Super"
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Button
                  variant="outlined"
                  fullWidth
                  endIcon={<Search />}
                  onClick={() => {
                    searchGroups(null, null);
                  }}
                >
                  buscar
                </Button>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <QHGrid
                  data={groupList}
                  loading={gridLoading}
                  pagination={{
                    count: gridCount,
                    page: page,
                    rowsPerPage: rowsPerPage,
                    rowsPerPageOptions: [5, 10, 20, 40, 50, 100],
                    onRowsPerPageChange(rowsPerPAge) {
                      setRowsPerPage(rowsPerPAge);
                      searchGroups(null, rowsPerPAge);
                    },
                    onPageChange(page) {
                      setPage(page);
                      searchGroups(page, null);
                    },
                  }}
                  hasActions
                  actionTrigger={(id: number, groupName: string) => {
                    switch (groupName) {
                      case "edit":
                        catchThisGroupToEdit(id);
                        break;
                      case "delete":
                        catchThisGroupToDelete(id);
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
                      width: 6,
                    },
                    {
                      text: "Identificação",
                      attrName: "codeName",
                      width: 2,
                    },
                    {
                      text: "Cor",
                      attrName: "color",
                      align: "center",
                      width: 2,
                      custom: {
                        isBox: true,
                        color: "color",
                      },
                    },
                    {
                      text: "Ativo",
                      attrName: "active",
                      width: 2,
                      align: "center",
                      custom: {
                        isIcon: true,
                        icon: "add_alert",
                      },
                    },
                    {
                      text: "Super",
                      attrName: "super",
                      width: 2,
                      custom: {
                        isIcon: true,
                        icon: "add_alert",
                        color: "iconColor",
                      },
                    },
                  ]}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography
                  variant="h6"
                  sx={{ color: (theme) => theme.palette.secondary.light }}
                >
                  Crie novos grupos ou edite grupos existentes
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <TextField
                  variant="standard"
                  label="Nome do grupo"
                  InputLabelProps={{ shrink: true }}
                  value={groupName}
                  fullWidth
                  onKeyDown={searchGroupsByKeyPress}
                  placeholder="Insira o nome do grupo"
                  onChange={(e) => {
                    setGroupName(e.target.value);
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <TextField
                  variant="standard"
                  label="Identificação"
                  value={groupIdentification}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  onKeyDown={searchGroupsByKeyPress}
                  placeholder="Insira a identificação"
                  onChange={(e) => {
                    setGroupIdentification(e.target.value);
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <TextField
                  variant="standard"
                  label="Cor"
                  value={groupColor}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  onKeyDown={searchGroupsByKeyPress}
                  placeholder="Insira o código hexadecimal da cor"
                  onChange={(e) => {
                    setGroupColor(e.target.value);
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
                        checked={groupActive}
                        onChange={(
                          event: ChangeEvent<HTMLInputElement>,
                          checked: boolean
                        ) => {
                          setGroupActive(event.target.checked);
                        }}
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
                        checked={groupSuper}
                        onChange={(
                          event: ChangeEvent<HTMLInputElement>,
                          checked: boolean
                        ) => {
                          setGroupSuper(event.target.checked);
                        }}
                      />
                    }
                    label="Super"
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Autocomplete
                  options={autocompleteOptions}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setGroupFunctions((prev) => [
                        ...(prev || []),
                        {
                          id: newValue.id,
                          name: newValue.name,
                          icon: "clear",
                          color: "red",
                          freeForGroup: false,
                        },
                      ]);
                    }
                  }}
                  renderInput={(params: AutocompleteRenderInputParams) => (
                    <TextField
                      label={"Digite o nome da Função"}
                      {...params}
                      value={functionSearchName}
                      InputLabelProps={{ shrink: true }}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setFunctionSearchName(event.target.value);
                        searchFunctions(event.target.value);
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <QHGrid
                  data={groupFunctions}
                  loading={gridLoading}
                  pagination={{
                    count: functionCount,
                    page: page,
                    rowsPerPage: rowsPerPage,
                    rowsPerPageOptions: [5, 10, 20, 40, 50, 100],
                    onRowsPerPageChange(rowsPerPAge) {
                      setRowsPerPage(rowsPerPAge);
                      searchGroups(null, rowsPerPAge);
                    },
                    onPageChange(page) {
                      setPage(page);
                      searchGroups(page, null);
                    },
                  }}
                  hasActions
                  actionTrigger={(id: number, functionName: string) => {
                    switch (functionName) {
                      case "liberar":
                        const objIndex = groupFunctions.findIndex(
                          (item) => item.id === id
                        );

                        if (objIndex !== -1) {
                          const objCopy = {
                            ...groupFunctions[objIndex],
                          };

                          objCopy.freeForGroup = !objCopy.freeForGroup;
                          objCopy.icon = objCopy.freeForGroup
                            ? "check"
                            : "clear";
                          objCopy.color = objCopy.freeForGroup
                            ? "#43A047"
                            : "#F44336";

                          const updatedArray = [...groupFunctions];

                          updatedArray[objIndex] = objCopy;
                          setGroupFunctions(updatedArray);
                        } else {
                          console.error(`Nenhum item encontrado.`);
                        }

                        break;
                      case "delete":
                        const updatedArray = groupFunctions.filter(
                          (item) => item.id !== id
                        );
                        setGroupFunctions(updatedArray);
                    }
                  }}
                  actions={[
                    {
                      icon: <Home />,
                      name: "delete",
                      text: "excluir",
                    },
                    {
                      icon: <PublishedWithChanges />,
                      name: "liberar",
                      text: "Liberar/Bloquear",
                    },
                  ]}
                  headers={[
                    {
                      text: "Função",
                      attrName: "name",
                      width: 10,
                    },
                    {
                      text: "Livre para o grupo ? ",
                      attrName: "freeForGroup",
                      width: 2,
                      align: "center",
                      custom: {
                        isIcon: true,
                        icon: "add_alert",
                      },
                    },
                  ]}
                />
              </Grid>

              {groupId ? (
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      endIcon={<Close />}
                      onClick={() => {
                        setGroupId(null);
                        setGroupName("");
                        setGroupActive(false);
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
                        updateGroup();
                      }}
                    >
                      Editar
                    </Button>
                  </Grid>
                </Grid>
              ) : (
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Button
                      variant="outlined"
                      fullWidth
                      endIcon={<Send />}
                      onClick={createGroup}
                    >
                      Salvar
                    </Button>
                  </Grid>
                </Grid>
              )}
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
          Confirmação de exclusão de grupo.
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir o grupo: &quot;{groupName}&quot; ?
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
              deleteGroup();
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
