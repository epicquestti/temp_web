import QHGrid from "@/components/DataGridV2";
import ViewWrapper from "@/components/ViewWrapper";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function Actions() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alerMessage, setAlerMessage] = useState<string>("");

  useEffect(() => {
    (async () => {})();
  });
  return (
    <ViewWrapper
      locals={[
        {
          text: "Início",
          iconName: "home",
          href: "/",
        },
        {
          text: "Ações",
          iconName: "settings_accessibility",
          href: "/actions",
        },
      ]}
      loading={loading}
      alerMessage={alerMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      title="Ações"
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                <TextField
                  variant="standard"
                  label="ação"
                  fullWidth
                  placeholder="insira o nome da ação"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <FormControlLabel control={<Checkbox />} label="Ativo" />
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={2} xl={2}>
                <Button variant="outlined" fullWidth>
                  Salvar
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper sx={{ p: 3 }}>
            <QHGrid />
          </Paper>
        </Grid>
      </Grid>
    </ViewWrapper>
  );
}
