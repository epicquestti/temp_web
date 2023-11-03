import {
  ArrowBack,
  LinkOff,
  LinkSharp,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Collapse,
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
  const [showLogin, setShowLogin] = useState<boolean>(true);
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
        <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
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
            {!showLogin && (
              <Collapse in={!showLogin}>
                <Paper sx={{ paddingX: 2, paddingY: 4, m: 2 }}>
                  <Grid
                    container
                    justifyContent="center"
                    spacing={3}
                    textAlign="center"
                  >
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Typography variant="h6">
                        RECUPERAÇÃO DE ACESSO
                      </Typography>
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
                          onClick={() => setShowLogin((s) => !s)}
                        >
                          voltar
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Collapse>
            )}

            {showLogin && (
              <Collapse in={showLogin}>
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
                              onChange={(e) =>
                                setKeepConnected(e.target.checked)
                              }
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
                          onClick={() => setShowLogin((s) => !s)}
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
              </Collapse>
            )}
          </Box>
        </Grid>
        <Grid item xs={9} sm={9} md={9} lg={9} xl={9}>
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
