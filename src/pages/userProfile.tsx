import SpanError from "@/components/SpanError";
import ViewWrapper from "@/components/ViewWrapper";
import {
  userProfileForm,
  userProfileSchema,
} from "@/schemas/userProfileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHookFormMask } from "use-mask-input";

export default function SecurityGroup() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alerMessage, setAlerMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<userProfileForm>({
    resolver: zodResolver(userProfileSchema),
  });
  const registerWithMask = useHookFormMask(register);

  function onSubmitFuction(data: userProfileForm) {
    console.log(data);
    return false;
  }

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      reset({
        name: "Algo da Api",
        cel: "16998761113",
        email: "asdad@email.com",
      });
    }, 5000);
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
        <form onSubmit={handleSubmit(onSubmitFuction)}>
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
                    <Avatar sx={{ width: 200, height: 200 }} />
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
                    placeholder="Entre com seu celular  ex: (99)699999-9999"
                    {...registerWithMask("cel", ["(99)99999-9999"])}
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
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    error={errors.city ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Cidade"
                    placeholder="Selecione a cidade"
                    {...register("city")}
                  />
                  {errors.city && <SpanError errorText={errors.city.message} />}
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    error={errors.state ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Estado"
                    placeholder="Selecione o estado"
                    {...register("state")}
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