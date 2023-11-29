import ViewWrapper from "@/components/ViewWrapper";
import { Add } from "@mui/icons-material";
import { Box, Fab, Paper } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Customer() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
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
          text: "Clientes",
          iconName: "person_pin_circle",
          href: "/customer",
        },
      ]}
      outsideContent={
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => {
              router.push("/customer/management/new");
            }}
          >
            <Add />
          </Fab>
        </Box>
      }
      loading={loading}
      alerMessage={alerMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      title="Clientes"
    >
      <Paper>asd</Paper>
    </ViewWrapper>
  );
}
