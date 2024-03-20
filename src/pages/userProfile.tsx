/* eslint-disable react-hooks/exhaustive-deps */
import SpanError from "@/components/SpanError";
import ViewWrapper from "@/components/ViewWrapper";
import { cepMask, phoneMask } from "@/lib/masks";
import {
  userProfileForm,
  userProfileSchema,
} from "@/schemas/userProfileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload } from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function SecurityGroup() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alerMessage, setAlerMessage] = useState<string>("");
  const [cityOptions, setCityOptions] = useState<
    { id: number; name: string }[]
  >([
    { id: 1, name: "Franca" },
    { id: 2, name: "Ribeirão Preto" },
  ]);
  const [estateOptions, setEstateOptions] = useState<
    { id: number; name: string }[]
  >([
    { id: 1, name: "São Paulo" },
    { id: 2, name: "Minas Gerais" },
  ]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<userProfileForm>({
    resolver: zodResolver(userProfileSchema),
  });

  function onSubmitFunction(data: userProfileForm) {
    console.log(data);
    return false;
  }

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      reset({
        name: "Algo da Api",
        cel: phoneMask("16998761113"),
        email: "asdad@email.com",
        city: { id: 1, name: "Franca" },
        state: { id: 1, name: "São Paulo" },
      });
    }, 3000);
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
          text: "Perfil de usuário",
          iconName: "assignment_ind",
          href: "/userProfile",
        },
      ]}
      loading={loading}
      alerMessage={alerMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      title="Perfil de usuário"
    >
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmitFunction)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: (theme) => theme.palette.secondary.light,
                    }}
                  >
                    Foto de perfíl
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Box
                    sx={{
                      width: "100%",
                      minHeight: 300,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      background: (theme) => theme.palette.primary.contrastText,
                      borderRadius: 2,
                    }}
                  >
                    <Avatar sx={{ width: "80%", minHeight: 200 }} />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Button
                    component="label"
                    variant="contained"
                    fullWidth
                    startIcon={<CloudUpload />}
                  >
                    Upload file
                    <input
                      style={{
                        clip: "rect(0 0 0 0)",
                        clipPath: "inset(50%)",
                        height: 1,
                        overflow: "hidden",
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        whiteSpace: "nowrap",
                        width: 1,
                      }}
                      type="file"
                      accept="image/*"
                    />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: (theme) => theme.palette.secondary.light,
                    }}
                  >
                    Dados pessoais
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    error={errors.name ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Nome"
                    placeholder="Entre com seu nome completo"
                    {...register("name")}
                  />
                  {errors.name && <SpanError errorText={errors.name.message} />}
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    error={errors.cel ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Celular"
                    placeholder="Entre com seu celular  ex: (99)99999-9999"
                    {...register("cel")}
                    onChange={(e) => {
                      const { value } = e.target;
                      e.target.value = phoneMask(value);
                    }}
                  />
                  {errors.cel && <SpanError errorText={errors.cel.message} />}
                </Grid>
                <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    error={errors.email ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Email"
                    placeholder="Entre com seu e-mail"
                    {...register("email")}
                  />
                  {errors.email && (
                    <SpanError errorText={errors.email.message} />
                  )}
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    error={errors.phone ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Telefone"
                    placeholder="entre com seu telefone residencial ex: (99)9999-9999"
                    {...register("phone")}
                    onChange={(e) => {
                      const { value } = e.target;
                      e.target.value = phoneMask(value);
                    }}
                  />
                  {errors.phone && (
                    <SpanError errorText={errors.phone.message} />
                  )}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: (theme) => theme.palette.secondary.light,
                    }}
                  >
                    Endereço
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    error={errors.cep ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Cep"
                    placeholder="Entre com o cep"
                    {...register("cep")}
                    onChange={(e) => {
                      const { value } = e.target;
                      e.target.value = cepMask(value);
                    }}
                  />
                  {errors.cep && <SpanError errorText={errors.cep.message} />}
                </Grid>
                <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    error={errors.street ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Rua"
                    placeholder="Entre com a rua"
                    {...register("street")}
                  />
                  {errors.street && (
                    <SpanError errorText={errors.street.message} />
                  )}
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    error={errors.number ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Nº"
                    placeholder="Entre com o Nº"
                    {...register("number")}
                  />
                  {errors.number && (
                    <SpanError errorText={errors.number.message} />
                  )}
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    error={errors.neighborhood ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Bairro"
                    placeholder="Entro com o bairro"
                    {...register("neighborhood")}
                  />
                  {errors.neighborhood && (
                    <SpanError errorText={errors.neighborhood.message} />
                  )}
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <Controller
                    name="city"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, value, onBlur } }) => (
                      <Autocomplete
                        options={cityOptions || []}
                        getOptionLabel={(option: any) =>
                          option.name ? option.name : null
                        }
                        value={value ?? null}
                        inputValue={value ? value.name : undefined}
                        onChange={(event, values, reason) => {
                          if (reason === "clear") {
                            onChange(null);
                            return;
                          }
                          onChange(values || null);
                        }}
                        isOptionEqualToValue={(optionItem, value) => {
                          return optionItem.id === value.id;
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Cidade"
                            variant="outlined"
                            value={value}
                            error={!!errors.city ? true : false}
                            helperText={errors.city && "Selecione sua cidade"}
                            onChange={(event) => {
                              onChange(event.target.value);
                            }}
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    )}
                  />
                  {errors.city && <SpanError errorText={errors.city.message} />}
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <Controller
                    name="state"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        options={estateOptions || []}
                        getOptionLabel={(option: any) =>
                          option.name ? option.name : null
                        }
                        value={value ?? null}
                        inputValue={value ? value.name : undefined}
                        onChange={(event, values, reason) => {
                          if (reason === "clear") {
                            onChange(null);
                            return;
                          }
                          onChange(values || null);
                        }}
                        isOptionEqualToValue={(optionItem, valueEqual) => {
                          return optionItem.id === valueEqual.id;
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Estado"
                            variant="outlined"
                            value={value}
                            error={!!errors.state ? true : false}
                            helperText={errors.state && "Selecione sua estado"}
                            onChange={(event) => {
                              onChange(event.target.value);
                            }}
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    )}
                  />

                  {errors.state && (
                    <SpanError errorText={errors.state.message} />
                  )}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    error={errors.obs ? true : false}
                    fullWidth
                    multiline
                    minRows={3}
                    variant="outlined"
                    label="Observação"
                    placeholder="Observação"
                    {...register("obs")}
                  />
                  {errors.obs && <SpanError errorText={errors.obs.message} />}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    <Button
                      type="submit"
                      sx={{ width: 250 }}
                      variant="outlined"
                    >
                      Salvar
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </ViewWrapper>
  );
}
