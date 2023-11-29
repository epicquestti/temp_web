import { AccountCircle, Close, Menu } from "@mui/icons-material";
import {
  Avatar,
  Backdrop,
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  Divider,
  Grid,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import ApplicationBar from "../ApplicationBar";
import Drawer from "../Drawer";
import LoadingBox from "../LoadingBox";
import Location from "../Location";
import UserDrawer from "../UserDrawer";
import { viewWrapperProperties } from "./viewWrapperProperties";

const ViewWrapper: FC<viewWrapperProperties> = ({ ...props }) => {
  const router = useRouter();
  const [lfOpen, setlfOpen] = useState<boolean>(false);
  const [rtOpen, setrtOpen] = useState<boolean>(false);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <ApplicationBar position="absolute" open={lfOpen}>
        <Toolbar
          sx={{
            pr: "24px",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
                setlfOpen(!lfOpen);
              }}
            >
              <Menu />
            </IconButton>
          </Box>

          <Box sx={{ display: "inline-flex", alignItems: "center" }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
                setrtOpen(!rtOpen);
              }}
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </ApplicationBar>

      <Drawer
        PaperProps={{
          sx: {
            background: (theme) => theme.palette.primary.light,
          },
        }}
        variant="permanent"
        open={lfOpen}
      >
        <Toolbar
          sx={{
            display: "inline-block",
            px: [1],
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="button">menu da aplicação</Typography>
          </Box>
          <Divider />
          {props.loading ? (
            <LoadingBox />
          ) : (
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
              }}
              component="nav"
            >
              <ListItemButton
                onClick={() => {
                  router.push("/actions");
                }}
              >
                <ListItemIcon>
                  <Icon>settings_accessibility</Icon>
                </ListItemIcon>
                <ListItemText primary="Ações" />
              </ListItemButton>

              <ListItemButton
                onClick={() => {
                  router.push("/functions");
                }}
              >
                <ListItemIcon>
                  <Icon>pending_actions</Icon>
                </ListItemIcon>
                <ListItemText primary="Funções" />
              </ListItemButton>

              <ListItemButton
                onClick={() => {
                  router.push("/securityGroup");
                }}
              >
                <ListItemIcon>
                  <Icon>group_work</Icon>
                </ListItemIcon>
                <ListItemText primary="Grupos de segurança" />
              </ListItemButton>

              <ListItemButton
                onClick={() => {
                  router.push("/clientRules");
                }}
              >
                <ListItemIcon>
                  <Icon>gavel</Icon>
                </ListItemIcon>
                <ListItemText primary="Regras personalizadas" />
              </ListItemButton>

              <ListItemButton
                onClick={() => {
                  router.push("/customer");
                }}
              >
                <ListItemIcon>
                  <Icon>person_pin_circle</Icon>
                </ListItemIcon>
                <ListItemText primary="Clientes" />
              </ListItemButton>
            </List>
          )}
        </Toolbar>
      </Drawer>

      <UserDrawer
        PaperProps={{
          sx: {
            background: (theme) => theme.palette.primary.light,
          },
        }}
        variant="permanent"
        open={rtOpen}
        anchor="right"
      >
        <Toolbar
          sx={{
            display: "block",
            width: "100%",
            px: [1],
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "65px",
              display: "flex",
              alignItems: "center",
              justifyContent: "left",
            }}
          ></Box>

          {props.loading ? (
            <LoadingBox />
          ) : (
            <List>
              <ListItem>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Avatar sx={{ width: 102, height: 102 }} />
                </Box>
              </ListItem>
              <ListItem>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <i>nome do usuário</i>
                </Box>
              </ListItem>
              <Divider />
              <ListItem>
                <Typography variant="caption">menu do usuário</Typography>
              </ListItem>
              <ListItemButton
                onClick={() => {
                  router.push("/userProfile");
                }}
              >
                <ListItemIcon>
                  <Icon>contact_page</Icon>
                </ListItemIcon>
                <ListItemText primary="Perfil" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <Icon>settings</Icon>
                </ListItemIcon>
                <ListItemText primary="Configurações" />
              </ListItemButton>
              <Divider />
              <ListItem>
                <Typography variant="caption">finalizar sessão</Typography>
              </ListItem>
              <ListItemButton>
                <ListItemIcon>
                  <Icon>close</Icon>
                </ListItemIcon>
                <ListItemText primary="Logoff" />
              </ListItemButton>
            </List>
          )}
        </Toolbar>
      </UserDrawer>

      <Box
        component="main"
        sx={{
          backgroundColor: (theme) => theme.palette.secondary.main,
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Location location={props.locals} />
            </Grid>

            {props.title && (
              <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                <Typography
                  variant="h4"
                  sx={{ color: (theme) => theme.palette.primary.light }}
                >
                  <strong>{props.title}</strong>
                </Typography>
              </Grid>
            )}

            {props.outsideContent && (
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                {props.outsideContent}
              </Grid>
            )}

            {props.showMandatoryMessage && (
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography
                  variant="caption"
                  sx={{ color: (theme) => theme.palette.primary.light }}
                >
                  Os campos marcados com * são de preenchimento obrigatório.
                </Typography>
              </Grid>
            )}

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              {props.children}
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Snackbar
        open={props.showAlert}
        autoHideDuration={6000}
        onClose={() => {
          props.closeAlert && props.closeAlert();
        }}
        message={props.alerMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => {
              props.closeAlert && props.closeAlert();
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={props.loading || false}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default ViewWrapper;
