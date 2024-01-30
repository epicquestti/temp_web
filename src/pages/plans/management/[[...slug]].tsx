import QHGrid from "@/components/DataGridV2";
import ViewWrapper from "@/components/ViewWrapper";
import { Add, Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  FormControlLabel,
  Grid,
  Icon,
  InputAdornment,
  Paper,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useState } from "react";
import "suneditor/dist/css/suneditor.min.css";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

export default function Management() {
  const [dialogControl, setDialogControl] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alerMessage, setAlerMessage] = useState<string>("");

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
          href: "/plans/management/new",
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
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
            <TextField
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              label="Nome do plano"
              fullWidth
              placeholder="Entre com o nome do plano"
            />
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
              <FormControlLabel control={<Radio />} label="Ativo" />
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
              <FormControlLabel control={<Radio />} label="site" />
            </Box>
          </Grid>

          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <TextField
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              label="Valor base"
              fullWidth
              placeholder="valor base"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>attach_money</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <TextField
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              label="Valor site"
              fullWidth
              placeholder="valor base"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>attach_money</Icon>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
            <TextField
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              label="Percentual"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography variant="h6">%</Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <TextField
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              label="Grupo de segurança"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={12} md={11} lg={11} xl={11}>
            <Typography
              variant="subtitle1"
              sx={{
                color: (theme) => theme.palette.secondary.light,
              }}
            >
              Caracteristicas do plano
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              <Fab
                size="small"
                color="success"
                onClick={() => {
                  setDialogControl(true);
                }}
              >
                <Add />
              </Fab>
            </Box>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <QHGrid
              // data={rolesList}
              // loading={gridLoading}
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
              actionTrigger={(id: number, functionName: string) => {
                // switch (functionName) {
                //   case "edit":
                //     // catchThisFunctionToEdit(id);
                //     break;
                //   case "delete":
                //     // catchThisFunctionToDelete(id);
                //     break;
                //   default:
                //     setGridLoading(false);
                //     setLoading(false);
                //     setAlerMessage("Erro, ação não identificada");
                //     setShowAlert(true);
                //     setTimeout(() => {
                //       setShowAlert(false);
                //     }, 6000);
                //     break;
                // }
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
                  text: "Caracteristica",
                  attrName: "name",
                  align: "center",
                },
                {
                  text: "texto",
                  attrName: "name",
                  align: "center",
                },
              ]}
            />
          </Grid>
        </Grid>
      </Paper>
      <Dialog
        onClose={() => {
          setDialogControl(false);
        }}
        open={dialogControl}
      >
        <DialogTitle>Caracteristica do plano</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 400, p: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  variant="standard"
                  label="Título"
                  fullWidth
                  placeholder="Entre com o nome do plano"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <SunEditor lang="pt_br" height="300" />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Button fullWidth variant="contained">
                  Addicionar
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </ViewWrapper>
  );
}
