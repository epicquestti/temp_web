import ViewWrapper from "@/components/ViewWrapper";
import { Add } from "@mui/icons-material";
import { Box, Fab, Paper } from "@mui/material";
import { useState } from "react";

export default function SecurityGroup() {
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
          text: "Grupo de segurança",
          iconName: "group_work",
          href: "/securityGroup",
        },
      ]}
      loading={loading}
      alerMessage={alerMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      title="Grupos de segurança"
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
