import ViewWrapper from "@/components/ViewWrapper";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import Link from "next/link";

export default function PlanPrices() {
  const plans = [
    {
      id: "1",
      name: "Plano Básico",
      value: 149.9,
      features: [
        {
          id: "1",
          name: "Recebimento de Boletos",
        },
      ],
    },
    {
      id: "2",
      name: "Plano Vantagem",
      value: 149.9,
      features: [
        {
          id: "1",
          name: "Recebimento de Boletos",
        },
        {
          id: "2",
          name: "Mensagens do Síndico",
        },
      ],
    },
    {
      id: "3",
      name: "Plano VIP",
      value: 149.9,
      features: [
        {
          id: "1",
          name: "Recebimento de Boletos",
        },
        {
          id: "2",
          name: "Mensagens do Síndico",
        },
        {
          id: "3",
          name: "Comunicação com a portaria",
        },
      ],
    },
  ];

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
                <Typography variant="h3">Conheça Nossos Planos</Typography>
              </Grid>
              {plans.length > 0 &&
                plans.map((item, index) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: "flex",
                      width: `${100 / plans.length - 2}%`,
                      border: (theme) =>
                        `2px solid ${theme.palette.primary.dark}`,
                      padding: 5,
                      borderRadius: 5,
                      marginRight: 1,
                      marginLeft: 1,
                      marginTop: 5,
                      justifyContent: "space-between",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          {item.name}
                        </Typography>
                      </Grid>
                      {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          R${moneyMask(item.value.toFixed(2).toString())}
                        </Typography>
                      </Grid> */}
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          Ferramentas Inclusas:
                        </Typography>
                      </Grid>
                      {item.features.length > 0 &&
                        item.features.map((item, index) => (
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                            key={item.id}
                          >
                            <Typography
                              sx={{
                                textAlign: "center",
                              }}
                            >
                              -{item.name}
                            </Typography>
                          </Grid>
                        ))}
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Link href={`/planPage/${item.id}`}>
                          <Button variant="contained">Detalhes</Button>
                        </Link>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </ViewWrapper>
  );
}
