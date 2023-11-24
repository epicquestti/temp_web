import QHGrid from "@/components/DataGridV2";
import ViewWrapper from "@/components/ViewWrapper";
import { Home } from "@mui/icons-material";
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useState } from "react";

export default function SecurityGroup() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alerMessage, setAlerMessage] = useState<string>("");
  const [gridLoading, setGridLoading] = useState<boolean>(false);
  const [gridCount, setGridCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [functionList, setFunctionList] = useState<
    {
      id: bigint;
      name: string;
      active: boolean;
    }[]
  >([]);
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
                  fullWidth
                  placeholder="insira o nome do grupo"
                  onChange={(e) => {}}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <TextField
                  variant="standard"
                  label="Identificação"
                  fullWidth
                  placeholder="insira a identificação"
                  onChange={(e) => {}}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <TextField
                  variant="standard"
                  label="Cor"
                  fullWidth
                  placeholder="insira o código hexadecimal da cor"
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
                    label="Super"
                  />
                </Box>
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
                  actionTrigger={(id: number, functionName: string) => {}}
                  actions={[
                    {
                      icon: <Home />,
                      name: "delete",
                      text: "excluir",
                    },
                    {
                      icon: <Home />,
                      name: "add",
                      text: "Liberar",
                    },
                  ]}
                  headers={[
                    {
                      text: "Nome",
                      width: 6,
                    },
                    {
                      text: "Identificação",
                      width: 2,
                    },
                    {
                      text: "Cor",
                      width: 2,
                    },
                    {
                      text: "Ativo",
                      width: 1,
                    },
                    {
                      text: "Super",
                      width: 1,
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
                  Crie novs grupos ou edite grupos existentes
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <TextField
                  variant="standard"
                  label="Nome do grupo"
                  fullWidth
                  placeholder="insira o nome do grupo"
                  onChange={(e) => {}}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <TextField
                  variant="standard"
                  label="Identificação"
                  fullWidth
                  placeholder="insira a identificação"
                  onChange={(e) => {}}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <TextField
                  variant="standard"
                  label="Cor"
                  fullWidth
                  placeholder="insira o código hexadecimal da cor"
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
                    label="Super"
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Autocomplete
                  options={[]}
                  renderInput={(params: AutocompleteRenderInputParams) => (
                    <TextField label={"asdasdd"} {...params} />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <QHGrid
                  data={functionList}
                  loading={gridLoading}
                  // pagination={{
                  //   count: gridCount,
                  //   page: page,
                  //   rowsPerPage: rowsPerPage,
                  //   rowsPerPageOptions: [5, 10, 20, 40, 50, 100],
                  //   onRowsPerPageChange(rowsPerPAge) {
                  //     setRowsPerPage(rowsPerPAge);
                  //     // listActionst(null, rowsPerPAge);
                  //   },
                  //   onPageChange(page) {
                  //     setPage(page);
                  //     // listActionst(page, null);
                  //   },
                  // }}
                  hasActions
                  actionTrigger={(id: number, functionName: string) => {}}
                  actions={[
                    {
                      icon: <Home />,
                      name: "delete",
                      text: "excluir",
                    },
                    {
                      icon: <Home />,
                      name: "add",
                      text: "Liberar",
                    },
                  ]}
                  headers={[
                    {
                      text: "Função",
                      width: 10,
                    },
                    {
                      text: "Livre para o grupo ? ",
                      width: 2,
                    },
                  ]}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <Button type="submit" sx={{ width: 250 }} variant="outlined">
                    Salvar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </ViewWrapper>
  );
}
