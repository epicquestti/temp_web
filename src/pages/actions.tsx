import QHGrid from "@/components/DataGridV2";
import ViewWrapper from "@/components/ViewWrapper";
import { useApplicationContext } from "@/context/ApplicationContext";
import fetchApi from "@/lib/fetchApi";
import { Delete, Edit, Search, Send } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

export default function Actions() {
  const context = useApplicationContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alerMessage, setAlerMessage] = useState<string>("");

  const [actionName, setActionName] = useState<string>("");
  const [actionActive, setActionActive] = useState<boolean>(false);

  const [searchName, setSearchName] = useState<string>("");
  const [searchActive, setSearchActive] = useState<boolean>(true);
  const [gridLoading, setGridLoading] = useState<boolean>(false);

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
          page: pageParam || page,
          take: rowPerPageParam || rowPerPage,
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

  useEffect(() => {
    listActionst();
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
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
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
              <Grid item xs={12} sm={12} md={12} lg={2} xl={2}>
                <Button variant="outlined" fullWidth endIcon={<Send />}>
                  Salvar
                </Button>
              </Grid>
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
                      listActionst(null, rowsPerPAge);
                    },

                    onPageChange(page) {
                      listActionst(page, null);
                    },
                  }}
                  hasActions
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
    </ViewWrapper>
  );
}
