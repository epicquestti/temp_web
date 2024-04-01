import ViewWrapper from "@/components/ViewWrapper";
import {
  clientRulesForm,
  clientRulesSchema,
} from "@/schemas/clientRulesSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grid, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface paymentRuleType {
  name: string;
  method: number;
  numberOfMonths: number;
  value: number;
}

export default function SubscriptionKey() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alerMessage, setAlerMessage] = useState<string>("");

  const [keyValue, setKeyValue] = useState<string>("");
  const [rulesArray, setRulesArray] = useState<paymentRuleType[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
    watch,
  } = useForm<clientRulesForm>({
    resolver: zodResolver(clientRulesSchema),
  });

  const generateSubscriptionKey = () => {
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 20; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    //Verificar se já existe uma chave com o valor gerado
    setKeyValue(result);

    //Salvar a chave gerada no banco
  };

  return (
    <ViewWrapper
      locals={[
        {
          text: "Início",
          iconName: "home",
          href: "/",
        },
        {
          text: "Chaves de Acesso",
          iconName: "vpn_key",
          href: "/subscriptionKey",
        },
      ]}
      loading={loading}
      alerMessage={alerMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      title="Chaves de Acesso"
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper sx={{ p: 3 }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography
                  variant="h6"
                  sx={{ color: (theme) => theme.palette.secondary.light }}
                >
                  Crie Chaves de Acesso
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <TextField
                  variant="outlined"
                  disabled
                  label="Valor da Chave de Acesso"
                  InputLabelProps={{ shrink: true }}
                  value={keyValue}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper sx={{ p: 3 }}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}></Grid>
          </Paper>
        </Grid>
      </Grid>
    </ViewWrapper>
  );
}
