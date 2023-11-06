import {
  ArrowBack,
  LinkOff,
  LinkSharp,
  Send,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import { useState } from "react";

const Authentication: NextPage = () => {
  const [keepConnected, setKeepConnected] = useState<boolean>(false);
  const [showPass, setShowPass] = useState<boolean>(false);
  const [actualPass, setActualPass] = useState<boolean>(false);
  const [newPass, setNewPass] = useState<boolean>(false);
  const [confirmPass, setconfirmNewPass] = useState<boolean>(false);
  const [showFrame, setShowFrame] = useState<"confirm" | "login" | "recovery">(
    "confirm"
  );
  const [recoverByEmail, setRecoverByEmail] = useState<boolean>(true);
  const [recoverByPhone, setRecoverByPhone] = useState<boolean>(false);

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
                    <Button fullWidth variant="contained">
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
                    <Typography>LOGO</Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography>condoApp</Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <TextField
                      variant="standard"
                      label="usuário"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon>account_circle</Icon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <TextField
                      variant="standard"
                      label="senha"
                      fullWidth
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
                    <Button fullWidth variant="contained">
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
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <TextField
                      variant="standard"
                      label="nova senha"
                      fullWidth
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
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <TextField
                      variant="standard"
                      label="confirme sua nova senha"
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
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Button fullWidth variant="contained" endIcon={<Send />}>
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
    </Box>
  );
};
export default Authentication;
