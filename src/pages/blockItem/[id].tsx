import ViewWrapper from "@/components/ViewWrapper";
import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Blocks() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {}, []);

  return (
    <ViewWrapper
      locals={[
        {
          text: "Início",
          iconName: "home",
          href: "/",
        },
        {
          text: "Condomínios",
          iconName: "home_work",
          href: "/condominium",
        },
        {
          text: "Blocos",
          iconName: "apartment",
          href: "/blocks",
        },
      ]}
      loading={loading}
      alerMessage={alertMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      title="Blocos"
    >
      <Grid container spacing={2}></Grid>
    </ViewWrapper>
  );
}
