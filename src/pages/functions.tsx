import ViewWrapper from "@/components/ViewWrapper";
import { Add } from "@mui/icons-material";
import { Box, Fab, Paper } from "@mui/material";
import { useState } from "react";

export default function Functions() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alerMessage, setAlerMessage] = useState<string>("");
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
      outsideContent={
        <Box
          sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
        >
          <Fab color="primary" aria-label="add">
            <Add />
          </Fab>
        </Box>
      }
    >
      <Paper sx={{ p: 3 }}>asdasdas</Paper>
    </ViewWrapper>
  );
}
