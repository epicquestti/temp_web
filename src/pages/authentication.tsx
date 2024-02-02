import { useApplicationContext } from "@/context/ApplicationContext";
import { defaultResponse } from "@/lib/fetchApi/fetchApiProperties";
import {
  ArrowBack,
  Close,
  LinkOff,
  LinkSharp,
  Send,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios, { AxiosResponse } from "axios";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { KeyboardEvent, useState } from "react";

export async function getStaticProps() {
  return {
    props: {
      api: process.env.API,
    },
  };
}

const Authentication: NextPage<{ api: string }> = (props) => {
  const router = useRouter();
  const appContext = useApplicationContext();
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmActualPassword, setConfirmActualPassword] =
    useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [confirmRetypePassword, setConfirmRetypePassword] =
    useState<string>("");
  const [keepConnected, setKeepConnected] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [showPass, setShowPass] = useState<boolean>(false);
  const [actualPass, setActualPass] = useState<boolean>(false);
  const [newPass, setNewPass] = useState<boolean>(false);
  const [confirmPass, setconfirmNewPass] = useState<boolean>(false);
  const [showFrame, setShowFrame] = useState<"confirm" | "login" | "recovery">(
    "login"
  );
  const [recoveryContact, setRecoveryContact] = useState<string>("");
  const [recoverByEmail, setRecoverByEmail] = useState<boolean>(true);
  const [recoverByPhone, setRecoverByPhone] = useState<boolean>(false);
  const [showSnack, setShowSnack] = useState<boolean>(false);
  const [messageSnack, setMessageSnack] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const AuthorizeUser = async () => {
    try {
      if (!user) throw new Error("Entre com o usuário.");
      if (!password) throw new Error("Entre com a senha do usuário.");

      setLoading(true);

      const axiosInstance = axios.create({
        baseURL: props.api,
      });

      const response: AxiosResponse<defaultResponse> = await axiosInstance.post(
        "/users/authentication",
        {
          login: user,
          password: password,
          keepConnected: keepConnected,
        }
      );

      if (response.status === 200 && response.data.success) {
        if (response.data.data.needChange) {
          setToken(response.data.data.token);
          setShowFrame("confirm");
          setMessageSnack(
            "Sua conta necessita de atenção. Por favor altere sua senha para retomar seu acesso."
          );
          setShowSnack(true);
          setLoading(false);
          setTimeout(() => {
            setShowSnack(false);
          }, 6000);
          return;
        } else {
          appContext.login(response.data.data);
          router.push("/");
          return;
        }
      } else throw new Error(response.data.message);
    } catch (error: any) {
      setMessageSnack(error.message);
      setShowSnack(true);
      setLoading(false);
      setTimeout(() => {
        setShowSnack(false);
      }, 6000);
    }
  };

  const ConfirmNewPassword = async () => {
    try {
      if (!user) {
        setShowFrame("login");
        setUser("");
        setPassword("");
        setConfirmActualPassword("");
        setConfirmNewPassword("");
        setConfirmRetypePassword("");
        setKeepConnected(false);
        throw new Error(
          "Erro ao verificar o usuário. por favor refaça o login."
        );
      }

      if (!confirmActualPassword) throw new Error("Insirá a senha atual.");
      if (!confirmNewPassword) throw new Error("Insirá a nova senha atual.");
      if (!confirmRetypePassword)
        throw new Error("Insira a confirmação da nova senha atual.");

      if (confirmNewPassword !== confirmRetypePassword) {
        throw new Error(
          "As senhas em 'nova senha' e 'confirme sua nova senha' não coincidem, verifique."
        );
      }

      setLoading(true);

      const axiosInstance = axios.create({
        baseURL: props.api,
      });

      const response: AxiosResponse<defaultResponse> = await axiosInstance.post(
        "/users/confirm-change-my-password",
        {
          token: token,
          actualPassword: confirmActualPassword,
          newPassword: confirmNewPassword,
        }
      );

      if (response.status === 200 && response.data.success) {
        setLoading(false);
        setShowFrame("login");
        setMessageSnack(
          response.data.message || "Alteração de senha realizado com sucesso."
        );
        setShowSnack(true);

        setTimeout(() => {
          setShowSnack(false);
        }, 6000);
      } else throw new Error(response.data.message);
    } catch (error: any) {
      setLoading(false);
      setMessageSnack(error.message);
      setShowSnack(true);
      setTimeout(() => {
        setShowSnack(false);
      }, 6000);
    }
  };

  const RequestRecoveryPassword = async () => {
    try {
      if (!recoveryContact)
        throw new Error(
          `Por favor, entre com seu ${
            recoverByEmail ? "email" : recoverByPhone ? "Nº de celular" : ""
          }`
        );

      setLoading(true);

      const axiosInstance = axios.create({
        baseURL: props.api,
      });

      const response: AxiosResponse<defaultResponse> = await axiosInstance.post(
        "/users/password-recovery-request",
        {
          recoveryType: recoverByEmail ? "email" : recoverByPhone ? "cell" : "",
          recoveryContact: recoveryContact,
        }
      );

      if (response.status === 200 && response.data.success) {
        setLoading(false);
        setShowFrame("login");
        setMessageSnack(
          response.data.message || "Alteração de senha realizado com sucesso."
        );
        setShowSnack(true);

        setTimeout(() => {
          setShowSnack(false);
        }, 6000);
      } else throw new Error(response.data.message);
    } catch (error: any) {
      setLoading(false);
      setMessageSnack(error.message);
      setShowSnack(true);
      setTimeout(() => {
        setShowSnack(false);
      }, 6000);
    }
  };

  const loginByEnterKeyPress = async (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") await AuthorizeUser();
  };

  const RequestRecoveryPasswordByEnterKeyPress = async (
    e: KeyboardEvent<HTMLDivElement>
  ) => {
    if (e.key === "Enter") await RequestRecoveryPassword();
  };

  const ConfirmNewPasswordByEnterKeyPress = async (
    e: KeyboardEvent<HTMLDivElement>
  ) => {
    if (e.key === "Enter") await ConfirmNewPassword();
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        background: (theme) => theme.palette.primary.main,
      }}
    >
      <Grid container>
        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
          <Box
            sx={{
              width: "100%",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: (theme) => theme.palette.primary.light,
            }}
          >
            {showFrame === "recovery" && (
              <Paper sx={{ paddingX: 2, paddingY: 4, m: 2 }}>
                <Grid
                  container
                  justifyContent="center"
                  spacing={3}
                  textAlign="center"
                >
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography variant="h6">RECUPERAÇÃO DE ACESSO</Typography>
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography variant="body2">
                      Qual o meio voce prefere usar para recurerar sua senha ?
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={recoverByEmail}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setRecoverByEmail(e.target.checked);
                                setRecoverByPhone(false);
                              }
                            }}
                          />
                        }
                        label="email"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={recoverByPhone}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setRecoverByPhone(e.target.checked);
                                setRecoverByEmail(false);
                              }
                            }}
                          />
                        }
                        label="celular"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <TextField
                      onKeyDown={RequestRecoveryPasswordByEnterKeyPress}
                      value={recoveryContact}
                      onChange={(e) => {
                        setRecoveryContact(e.target.value);
                      }}
                      variant="standard"
                      label={
                        recoverByEmail
                          ? "e-mail"
                          : recoverByPhone
                          ? "celular"
                          : ""
                      }
                      placeholder={
                        recoverByEmail
                          ? "entre com seu e-mail"
                          : recoverByPhone
                          ? "entre com seu celular"
                          : ""
                      }
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {recoverByEmail && <Icon>alternate_email</Icon>}
                            {recoverByPhone && <Icon>phone_android</Icon>}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={RequestRecoveryPassword}
                    >
                      recuperar senha
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Button
                        startIcon={<ArrowBack />}
                        onClick={() => setShowFrame("login")}
                      >
                        voltar
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {showFrame === "login" && (
              <Paper sx={{ paddingX: 2, paddingY: 4, m: 2 }}>
                <Grid
                  container
                  justifyContent="center"
                  spacing={3}
                  textAlign="center"
                >
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Image
                      alt="condowave logo"
                      src="/logo-200x95.png"
                      width={200}
                      height={95}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography>condoApp</Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <TextField
                      value={user}
                      variant="standard"
                      label="usuário"
                      fullWidth
                      onKeyDown={loginByEnterKeyPress}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon>account_circle</Icon>
                          </InputAdornment>
                        ),
                      }}
                      onChange={(e) => setUser(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <TextField
                      value={password}
                      variant="standard"
                      label="senha"
                      fullWidth
                      onKeyDown={loginByEnterKeyPress}
                      type={showPass ? "text" : "password"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon>vpn_key</Icon>
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              color="inherit"
                              onClick={() => setShowPass(!showPass)}
                            >
                              {showPass ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={keepConnected}
                            icon={<LinkOff />}
                            checkedIcon={<LinkSharp />}
                            onChange={(e) => setKeepConnected(e.target.checked)}
                          />
                        }
                        label={
                          keepConnected
                            ? "manter conectado"
                            : "não manter conectado"
                        }
                      />
                      <Button
                        variant="text"
                        onClick={() => setShowFrame("recovery")}
                        size="small"
                      >
                        esqueci minha senha
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={AuthorizeUser}
                    >
                      Acessar
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {showFrame === "confirm" && (
              <Paper sx={{ paddingX: 2, paddingY: 4, m: 2 }}>
                <Grid
                  container
                  justifyContent="center"
                  spacing={3}
                  textAlign="center"
                >
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography variant="h6">
                      Confirmação de alteração de senha de acesso do usuário
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography variant="body2">
                      Preencha todos os campos para finalizar o processo de
                      alteração de senha de acesso do usuário.
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <TextField
                      value={confirmActualPassword}
                      onKeyDown={ConfirmNewPasswordByEnterKeyPress}
                      variant="standard"
                      label="senha atual"
                      fullWidth
                      type={actualPass ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              color="inherit"
                              onClick={() => setActualPass(!actualPass)}
                            >
                              {actualPass ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      onChange={(e) => {
                        setConfirmActualPassword(e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <TextField
                      value={confirmNewPassword}
                      variant="standard"
                      label="nova senha"
                      fullWidth
                      onKeyDown={ConfirmNewPasswordByEnterKeyPress}
                      type={newPass ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              color="inherit"
                              onClick={() => setNewPass(!newPass)}
                            >
                              {newPass ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      onChange={(e) => {
                        setConfirmNewPassword(e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <TextField
                      value={confirmRetypePassword}
                      variant="standard"
                      label="confirme sua nova senha"
                      onKeyDown={ConfirmNewPasswordByEnterKeyPress}
                      fullWidth
                      type={confirmPass ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              color="inherit"
                              onClick={() => setconfirmNewPass(!confirmPass)}
                            >
                              {confirmPass ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      onChange={(e) => {
                        setConfirmRetypePassword(e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<Send />}
                      onClick={ConfirmNewPassword}
                    >
                      Alterar minha senha
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Button
                        startIcon={<ArrowBack />}
                        onClick={() => setShowFrame("login")}
                      >
                        voltar
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={9} xl={9}>
          <Box
            sx={{
              width: "100%",
              height: "100vh",
              padding: 2,
              justifyContent: "center",
              alignContent: "center",
            }}
          ></Box>
        </Grid>
      </Grid>
      <Snackbar
        open={showSnack}
        autoHideDuration={6000}
        onClose={() => {
          setShowSnack(false);
        }}
        message={messageSnack}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => {
              setShowSnack(false);
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};
export default Authentication;
