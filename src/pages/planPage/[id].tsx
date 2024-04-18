import ViewWrapper from "@/components/ViewWrapper";
import { Grid, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";

export default function PlanPage() {
  const router = useRouter();
  const { id } = router.query;
  const name = "Nome do Plano";
  return (
    <ViewWrapper>
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
                <Typography variant="h3">{name}</Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="h6">
                  Descrição detalhada do plano com exibição das ferramentas
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="h6">
                  Botões com os preçõs das modalidades normal/semestral/anual
                </Typography>
                <Typography variant="h6">
                  Quando clicado deve levar para a sessão de pagamento
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </ViewWrapper>
  );
}
