import ViewWrapper from "@/components/ViewWrapper";
import { useState } from "react";

export default function ClientRules() {
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
          text: "Personalização de regras de cliente",
          iconName: "assignment_ind",
          href: "/clientRules",
        },
      ]}
      loading={loading}
      alerMessage={alerMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      title="Personalização de regras de cliente"
    ></ViewWrapper>
  );
}
