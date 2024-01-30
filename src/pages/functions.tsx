/* eslint-disable react-hooks/exhaustive-deps */
import QHGrid from "@/components/DataGridV2";
import ViewWrapper from "@/components/ViewWrapper";
import { functionForm, functionSchema } from "@/schemas/functionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Delete, Edit, Search, Send } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function Functions() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alerMessage, setAlerMessage] = useState<string>("");
  const [functionId, setFunctionId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<functionForm>({
    resolver: zodResolver(functionSchema),
  });

  useEffect(() => {}, []);

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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography
                      variant="h6"
                      sx={{ color: (theme) => theme.palette.secondary.light }}
                    >
                      Busque funções existentes
                    </Typography>
                  </Grid>
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
                    <Button variant="outlined" fullWidth endIcon={<Search />}>
                      buscar
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <QHGrid
                  hasActions
                  actionTrigger={(id: number, functionName: string) => {}}
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
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography
                  variant="h6"
                  sx={{ color: (theme) => theme.palette.secondary.light }}
                >
                  Crie novas funções ou edite funções existentes
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  variant="standard"
                  label="Função"
                  fullWidth
                  placeholder="Nome da função"
                  {...register("name")}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  variant="standard"
                  label="Identificação"
                  fullWidth
                  placeholder="Identificação da função"
                  {...register("codeName")}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  variant="standard"
                  label="icone"
                  fullWidth
                  placeholder="Icone da função"
                  {...register("icon")}
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
                        {...register("active")}
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
                  InputLabelProps={{ shrink: true }}
                  variant="standard"
                  label="url"
                  fullWidth
                  placeholder=" Url da função"
                  {...register("url")}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <FormControl fullWidth>
                  <InputLabel id="local-label-input">Local</InputLabel>
                  <Controller
                    name="deviceComponent"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        labelId="local-label-input"
                        label="local"
                        fullWidth
                        onChange={(
                          event: SelectChangeEvent<number>,
                          _: ReactNode
                        ) => {}}
                      >
                        {/* {functionLocalList.map((fl, index) => (
                    <MenuItem
                      key={`menu-item-local-ident-${index}-${new Date().getMilliseconds()}`}
                      value={fl.id}
                    >
                      {fl.name}
                    </MenuItem>
                  ))} */}
                      </Select>
                    )}
                  />
                </FormControl>
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
                        {...register("visible")}
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
                <Typography
                  variant="body1"
                  sx={{ color: (theme) => theme.palette.secondary.light }}
                >
                  Ações
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Box
                  sx={{
                    width: "100%",
                    p: 2,
                    border: "0.7px solid #455A64",
                    borderRadius: 0.8,
                  }}
                >
                  Lista de ações
                </Box>
              </Grid>

              {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
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
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Button
                      variant="outlined"
                      fullWidth
                      endIcon={<Edit />}
                      onClick={() => {}}
                    >
                      Editar
                    </Button>
                  </Grid> */}

              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Button variant="outlined" fullWidth endIcon={<Send />}>
                  Salvar
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      {/* <Dialog
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
      </Dialog> */}
    </ViewWrapper>
  );
}
