/* eslint-disable react-hooks/exhaustive-deps */
import QHGrid from "@/components/DataGridV2";
import SpanError from "@/components/SpanError";
import ViewWrapper from "@/components/ViewWrapper";
import { useApplicationContext } from "@/context/ApplicationContext";
import fetchApi from "@/lib/fetchApi";
import { functionForm, functionSchema } from "@/schemas/functionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Close, Delete, Edit, Search, Send } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { ChangeEvent, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

type serverSideModel = {
  actions: actionsType[];
  deviceComponent: deviceComponentType[];
};
type actionsType = { id: string; checked: boolean; name: string };
type deviceComponentType = { id: number; name: string };

export const getServerSideProps: GetServerSideProps<serverSideModel> = async ({
  req,
  res,
}) => {
  const { cookies } = req;

  const actionsResponse = await fetchApi.get("/actions/get-all/list", {
    headers: {
      Authorization: cookies.epicquest,
      "router-id": "WEB#API",
    },
  });

  let actions: actionsType[] = actionsResponse.success
    ? actionsResponse.data
    : [];

  const deviceResponse = await fetchApi.get(
    "/functions/devicecomponents/list",
    {
      headers: {
        Authorization: cookies.epicquest,
        "router-id": "WEB#API",
      },
    }
  );

  let deviceComponent: deviceComponentType[] = deviceResponse.success
    ? deviceResponse.data
    : [];

  return {
    props: {
      actions,
      deviceComponent,
    },
  };
};

const Functions: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ ...props }) => {
  const context = useApplicationContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alerMessage, setAlerMessage] = useState<string>("");
  const [gridLoading, setGridLoading] = useState<boolean>(false);
  const [criteria, setCriteria] = useState<string>("");
  const [active, setActive] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(true);
  const [functionList, setFunctionList] = useState<
    {
      id: bigint;
      name: string;
      active: boolean;
      codeName: string;
      visible: boolean;
    }[]
  >([]);
  const [gridCount, setGridCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowPerPage, setRowPerPage] = useState<number>(5);
  const [functionId, setFunctionId] = useState<number | undefined>(undefined);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<functionForm>({
    resolver: zodResolver(functionSchema),
    defaultValues: {
      functionActions: props.actions,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "functionActions",
  });

  async function selectByEdit(id: number) {
    try {
      setLoading(true);

      const listResponse = await fetchApi.get(`/functions/${id}`, {
        headers: {
          Authorization: context.getToken(),
          "router-id": "WEB#API",
        },
      });

      if (listResponse.success) {
        setFunctionId(listResponse.data.id);

        reset({
          active: listResponse.data.active,
          codeName: listResponse.data.codeName,
          deviceComponent: listResponse.data.deviceComponentsId,
          functionActions: listResponse.data.actions,
          icon: listResponse.data.icon,
          name: listResponse.data.name,
          url: listResponse.data.path,
          visible: listResponse.data.visible,
        });

        setLoading(false);
      } else throw new Error(listResponse.message);
    } catch (error: any) {
      setLoading(false);
      setGridLoading(false);
      setAlerMessage(error.message);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 6000);
    }
  }

  async function questionByDelete(id: number) {
    try {
    } catch (error: any) {
      setLoading(false);
      setGridLoading(false);
      setAlerMessage(error.message);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 6000);
    }
  }

  async function search(p?: number, rpp?: number) {
    try {
      setGridLoading(true);

      const listResponse = await fetchApi.post(
        "/functions",
        {
          criteria,
          active,
          visible,
          page: p === 0 ? 0 : p ? p : page,
          take: rpp === 0 ? 0 : rpp ? rpp : rowPerPage,
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

        setGridLoading(false);
      } else throw new Error(listResponse.message);
    } catch (error: any) {
      setLoading(false);
      setGridLoading(false);
      setAlerMessage(error.message);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 6000);
    }
  }

  function onSubmitFuction(data: functionForm) {
    try {
      console.log("aqui entrou");
      console.log(data);
    } catch (error: any) {
      setLoading(false);
      setAlerMessage(error.message);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 6000);
    }
  }

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
        {/* list */}
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
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      label="Buscar"
                      value={criteria}
                      onChange={(e) => {
                        setCriteria(e.target.value);
                      }}
                      fullWidth
                      placeholder="busque funções por nome, identificação ou url."
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
                        label="Ativo"
                        control={
                          <Checkbox
                            checked={active}
                            onChange={(
                              _: ChangeEvent<HTMLInputElement>,
                              checked: boolean
                            ) => {
                              setActive(checked);
                            }}
                          />
                        }
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
                        label="Visivel"
                        control={
                          <Checkbox
                            checked={visible}
                            onChange={(
                              _: ChangeEvent<HTMLInputElement>,
                              checked: boolean
                            ) => {
                              setVisible(checked);
                            }}
                          />
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Button
                      variant="outlined"
                      fullWidth
                      endIcon={<Search />}
                      onClick={() => {
                        search();
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
                    rowsPerPage: rowPerPage,
                    rowsPerPageOptions: [5, 10, 20, 40, 50, 100],
                    onRowsPerPageChange(rowsPerPAge) {
                      setRowPerPage(rowsPerPAge);
                      search(undefined, rowPerPage);
                    },
                    onPageChange(page) {
                      setPage(page);
                      search(page, undefined);
                    },
                  }}
                  hasActions
                  actionTrigger={(id: number, functionName: string) => {
                    switch (functionName) {
                      case "edit":
                        selectByEdit(id);
                        break;
                      case "delete":
                        questionByDelete(id);
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
                      attrName: "codeName",
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

        {/* manage */}
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <form onSubmit={handleSubmit(onSubmitFuction)}>
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
                  <FormControl fullWidth>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      label="Função"
                      fullWidth
                      placeholder="Nome da função"
                      {...register("name")}
                    />

                    <FormHelperText error={errors.name !== undefined}>
                      {errors.name && (
                        <SpanError errorText={errors.name.message} />
                      )}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <FormControl fullWidth>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      label="Identificação"
                      fullWidth
                      placeholder="Identificação da função"
                      {...register("codeName")}
                    />

                    <FormHelperText error={errors.codeName !== undefined}>
                      {errors.codeName && (
                        <SpanError errorText={errors.codeName.message} />
                      )}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                  <FormControl fullWidth>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      label="icone"
                      fullWidth
                      placeholder="Icone da função"
                      {...register("icon")}
                    />
                    <FormHelperText error={errors.icon !== undefined}>
                      {errors.icon && (
                        <SpanError errorText={errors.icon.message} />
                      )}
                    </FormHelperText>
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
                        <Controller
                          name="active"
                          control={control}
                          render={({
                            field: { onChange, value, ref, ...field },
                          }) => {
                            return (
                              <Checkbox
                                {...field}
                                inputRef={ref}
                                checked={!!value}
                                disableRipple
                                onChange={(
                                  event: ChangeEvent<HTMLInputElement>,
                                  checked: boolean
                                ) => {
                                  onChange(checked);
                                }}
                              />
                            );
                          }}
                        />
                      }
                      label="Ativo"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <FormControl fullWidth>
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      variant="standard"
                      label="url"
                      fullWidth
                      placeholder=" Url da função"
                      {...register("url")}
                    />
                    <FormHelperText error={errors.url !== undefined}>
                      {errors.url && (
                        <SpanError errorText={errors.url.message} />
                      )}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <FormControl fullWidth>
                    <InputLabel id="local-label-input">Local</InputLabel>
                    <Controller
                      name="deviceComponent"
                      control={control}
                      render={({ field }) => (
                        <Select
                          labelId="local-label-input"
                          label="local"
                          {...field}
                          value={field.value || `undefined`}
                        >
                          <MenuItem value={0}>Nenhum</MenuItem>

                          {props.deviceComponent &&
                            props.deviceComponent.map((item, index) => (
                              <MenuItem
                                key={`item-local-${index}-id`}
                                value={item.id}
                              >
                                {item.name}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                    />
                    <FormHelperText
                      error={errors.deviceComponent !== undefined}
                    >
                      {errors.deviceComponent && (
                        <SpanError
                          errorText={errors.deviceComponent.message as string}
                        />
                      )}
                    </FormHelperText>
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
                        <Controller
                          name="visible"
                          control={control}
                          render={({
                            field: { onChange, value, ref, ...field },
                          }) => {
                            return (
                              <Checkbox
                                {...field}
                                inputRef={ref}
                                checked={!!value}
                                disableRipple
                                onChange={(
                                  event: ChangeEvent<HTMLInputElement>,
                                  checked: boolean
                                ) => {
                                  onChange(checked);
                                }}
                              />
                            );
                          }}
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
                    <Box
                      sx={{
                        width: "100%",
                        p: 2,
                      }}
                    >
                      {fields.map((field: any, index: number) => (
                        <FormControl key={index}>
                          <FormControlLabel
                            key={index}
                            control={
                              <Checkbox
                                {...register(
                                  `functionActions.${index}.checked`
                                )}
                              />
                            }
                            label={field.name}
                          />

                          <FormHelperText
                            error={errors.functionActions !== undefined}
                          >
                            {errors.functionActions && (
                              <SpanError
                                errorText={errors.functionActions.message}
                              />
                            )}
                          </FormHelperText>
                        </FormControl>
                      ))}
                    </Box>
                  </Box>
                </Grid>

                {functionId ? (
                  <>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        endIcon={<Close />}
                        onClick={() => {
                          setFunctionId(undefined);

                          reset({
                            active: true,
                            codeName: "",
                            deviceComponent: "0",
                            functionActions: props.actions,
                            icon: "",
                            name: "",
                            url: "",
                            visible: true,
                          });
                        }}
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
                    </Grid>
                  </>
                ) : (
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Button
                      variant="outlined"
                      fullWidth
                      endIcon={<Send />}
                      type="submit"
                    >
                      Salvar
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </form>
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
};

export default Functions;
