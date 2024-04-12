import ViewWrapper from "@/components/ViewWrapper";
import { Grid } from "@mui/material";

export default function Residents() {
  return (
    <ViewWrapper
      locals={[
        {
          text: "Início",
          iconName: "home",
          href: "/",
        },
        {
          text: "Residentes",
          iconName: "person",
          href: "/residents",
        },
      ]}
      // loading={loading}
      // alerMessage={alerMessage}
      // showAlert={showAlert}
      // closeAlert={() => {
      //   setShowAlert(false);
      // }}
      title="Residentes"
    >
      <Grid container spacing={2}></Grid>
    </ViewWrapper>
  );
}
