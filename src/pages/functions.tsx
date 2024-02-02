/* eslint-disable react-hooks/exhaustive-deps */
import QHGrid from "@/components/DataGridV2";
import SpanError from "@/components/SpanError";
import ViewWrapper from "@/components/ViewWrapper";
import {
  functionForm,
  functionSchema,
  searchFunctionForm,
  searchFunctionSchema,
} from "@/schemas/functionSchema";
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
import { ChangeEvent, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

type serverSideModel = {
  actions: { id: number; checked: boolean; name: string }[];
  locals: { id: number; name: string }[];
};

export const getServerSideProps: GetServerSideProps<serverSideModel> = async ({
  req,
  res,
}) => {
  return {
    props: {
      actions: [{ id: 1, checked: true, name: "algoasdasd" }],
      locals: [
        {
          id: 1,
          name: "sdasad",
        },
      ],
    },
  };
};

const Functions: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ ...props }) => {
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
    defaultValues: {
      functionActions: props.actions,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "functionActions",
  });

  const {
    register: registerSearch,
    handleSubmit: handleSubmitSearch,
    reset: resetSearch,
    formState: { errors: errorsSearch },
    control: controlSearch,
  } = useForm<searchFunctionForm>({
    resolver: zodResolver(searchFunctionSchema),
  });

  useEffect(() => {}, []);

  function onSubmitSearchFuction(data: searchFunctionForm) {
    console.log("onSubmitSearchFuction");
    console.log(data);
    return false;
  }

  function onSubmitFuction(data: functionForm) {
    console.log("onSubmitFuction");
    console.log(data);
    return false;
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
          <form onSubmit={handleSubmitSearch(onSubmitSearchFuction)}>
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
                        fullWidth
                        placeholder="busque funções por nome, identificação ou url."
                        InputProps={{
                          startAdornment: <Search />,
                        }}
                        {...registerSearch("criteria")}
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
                          control={<Checkbox {...registerSearch("active")} />}
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
                          control={<Checkbox {...registerSearch("visible")} />}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Button
                        variant="outlined"
                        fullWidth
                        endIcon={<Search />}
                        type="submit"
                      >
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
          </form>
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
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    variant="standard"
                    label="Função"
                    fullWidth
                    placeholder="Nome da função"
                    {...register("name")}
                  />
                  {errors.name && <SpanError errorText={errors.name.message} />}
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
                  {errors.codeName && (
                    <SpanError errorText={errors.codeName.message} />
                  )}
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
                  {errors.icon && <SpanError errorText={errors.icon.message} />}
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
                  {errors.url && <SpanError errorText={errors.url.message} />}
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
                          fullWidth
                          {...field}
                        >
                          <MenuItem value={0}>Nenhum</MenuItem>

                          {props.locals &&
                            props.locals.map((item, index) => (
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
                  </FormControl>
                  {errors.deviceComponent && (
                    <SpanError errorText={errors.deviceComponent.message} />
                  )}
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
                      control={<Checkbox {...register("visible")} />}
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
                    {fields.map((field: any, index: number) => (
                      <FormControlLabel
                        key={index}
                        control={
                          <Checkbox
                            {...register(`functionActions.${index}.checked`)}
                          />
                        }
                        label={field.name}
                      />
                    ))}
                    {errors.functionActions && (
                      <SpanError errorText={errors.functionActions.message} />
                    )}
                    <br />
                    {JSON.stringify(errors)}
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
                  <Button
                    variant="outlined"
                    fullWidth
                    endIcon={<Send />}
                    type="submit"
                  >
                    Salvar
                  </Button>
                </Grid>
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
