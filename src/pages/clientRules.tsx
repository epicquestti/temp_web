import QHGrid from "@/components/DataGridV2";
import SpanError from "@/components/SpanError";
import ViewWrapper from "@/components/ViewWrapper";
import {
  clientRulesForm,
  clientRulesSchema,
} from "@/schemas/clientRulesSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Delete, Edit, Save, Search } from "@mui/icons-material";
import {
  Button,
  FormControl,
  Grid,
  Icon,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ClientRules() {
  const [loading, setLoading] = useState<boolean>(false);

  const [gridLoading, setGridLoading] = useState<boolean>(false);
  const [gridCount, setGridCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);

  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alerMessage, setAlerMessage] = useState<string>("");

  const [rolesList, setRolesList] = useState<
    {
      id: bigint;
      name: string;
      active: boolean;
    }[]
  >([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<clientRulesForm>({
    resolver: zodResolver(clientRulesSchema),
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
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper sx={{ p: 3 }}>
            <form>
              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    error={errors.name ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Busca"
                    placeholder="Busque pelo nome da regra"
                    {...register("name")}
                  />
                  {errors.name && <SpanError errorText={errors.name.message} />}
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <FormControl fullWidth>
                    <InputLabel id="methodRuleId">{"Método"}</InputLabel>
                    <Select labelId="methodRuleId" label="Método">
                      <MenuItem value={0}>Selecione ...</MenuItem>
                      <MenuItem value={1}>Desconto direto R$</MenuItem>
                      <MenuItem value={2}>Desconto percentual %</MenuItem>
                      <MenuItem value={4}>Acréscimo direto R$</MenuItem>
                      <MenuItem value={5}>Acréscimo percentual %</MenuItem>
                    </Select>
                  </FormControl>
                  {errors.name && <SpanError errorText={errors.name.message} />}
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <FormControl fullWidth>
                    <InputLabel id="methodRuleId">{"Alcance"}</InputLabel>
                    <Select labelId="methodRuleId" label="Alcance">
                      <MenuItem value={0}>Selecione ...</MenuItem>
                      <MenuItem value={1}>
                        Todos os condomínios / todos as mensalidades
                      </MenuItem>
                      <MenuItem value={2}>
                        Nº de condomínios personalizaveis / todos as
                        mensalidades
                      </MenuItem>
                      <MenuItem value={3}>
                        Todos os condomínios / Nº de mensalidades
                        personalizaveis
                      </MenuItem>
                      <MenuItem value={8}>
                        Nº de condomínios e Nº de mensalidades personalizaveis.
                      </MenuItem>
                    </Select>
                  </FormControl>
                  {errors.name && <SpanError errorText={errors.name.message} />}
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Button fullWidth variant="contained" startIcon={<Search />}>
                    Salvar
                  </Button>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <QHGrid
                    data={rolesList}
                    loading={gridLoading}
                    pagination={{
                      count: gridCount,
                      page: page,
                      rowsPerPage: rowsPerPage,
                      rowsPerPageOptions: [5, 10, 20, 40, 50, 100],
                      onRowsPerPageChange(rowsPerPAge) {
                        setRowsPerPage(rowsPerPAge);
                        // listActionst(null, rowsPerPAge);
                      },
                      onPageChange(page) {
                        setPage(page);
                        // listActionst(page, null);
                      },
                    }}
                    hasActions
                    actionTrigger={(id: number, functionName: string) => {
                      switch (functionName) {
                        case "edit":
                          // catchThisFunctionToEdit(id);
                          break;
                        case "delete":
                          // catchThisFunctionToDelete(id);
                          break;
                        default:
                          setGridLoading(false);
                          setLoading(false);
                          setAlerMessage("Erro, ação não identificada");
                          setShowAlert(true);
                          setTimeout(() => {
                            setShowAlert(false);
                          }, 6000);
                          break;
                      }
                    }}
                    actions={[
                      {
                        icon: <Edit />,
                        name: "edit",
                        text: "Editar",
                      },
                      {
                        icon: <Delete />,
                        name: "delete",
                        text: "Excluir",
                      },
                    ]}
                    headers={[
                      {
                        text: "Função",
                        attrName: "name",
                        align: "center",
                      },
                      {
                        text: "Identificação",
                        attrName: "name",
                        align: "center",
                      },
                      {
                        text: "Ativo",
                        attrName: "active",
                        align: "center",
                        width: 2,
                        custom: {
                          isIcon: true,
                          icon: "add_alert",
                        },
                      },
                      {
                        text: "Visível",
                        attrName: "active",
                        align: "center",
                        width: 2,
                        custom: {
                          isIcon: true,
                          icon: "add_alert",
                        },
                      },
                    ]}
                  />
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper sx={{ p: 3 }}>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    error={errors.name ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Nome da regra"
                    placeholder="Entre com o nome da Regra"
                    {...register("name")}
                  />
                  {errors.name && <SpanError errorText={errors.name.message} />}
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <FormControl fullWidth>
                    <InputLabel id="methodRuleId">{"Método"}</InputLabel>
                    <Select labelId="methodRuleId" label="Método">
                      <MenuItem value={0}>Selecione ...</MenuItem>
                      <MenuItem value={1}>Desconto direto R$</MenuItem>
                      <MenuItem value={2}>Desconto percentual %</MenuItem>
                      <MenuItem value={4}>Acréscimo direto R$</MenuItem>
                      <MenuItem value={5}>Acréscimo percentual %</MenuItem>
                    </Select>
                  </FormControl>
                  {errors.name && <SpanError errorText={errors.name.message} />}
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <FormControl fullWidth>
                    <InputLabel id="methodRuleId">{"Alcance"}</InputLabel>
                    <Select labelId="methodRuleId" label="Alcance">
                      <MenuItem value={0}>Selecione ...</MenuItem>
                      <MenuItem value={1}>
                        Todos os condomínios / todos as mensalidades
                      </MenuItem>
                      <MenuItem value={2}>
                        Nº de condomínios personalizaveis / todos as
                        mensalidades
                      </MenuItem>
                      <MenuItem value={3}>
                        Todos os condomínios / Nº de mensalidades
                        personalizaveis
                      </MenuItem>
                      <MenuItem value={8}>
                        Nº de condomínios e Nº de mensalidades personalizaveis.
                      </MenuItem>
                    </Select>
                  </FormControl>
                  {errors.name && <SpanError errorText={errors.name.message} />}
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    // error={errors.neighborhood ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Nº Condomínios"
                    placeholder="Entro com o bairro"
                    // {...register("neighborhood")}
                  />
                  {errors.name && <SpanError errorText={errors.name.message} />}
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    // error={errors.neighborhood ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Nº Mensalidades"
                    placeholder="Entro com o bairro"
                    // {...register("neighborhood")}
                  />
                  {errors.name && <SpanError errorText={errors.name.message} />}
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    // error={errors.neighborhood ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Valor"
                    placeholder="Entro com o bairro"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon>attach_money</Icon>
                        </InputAdornment>
                      ),
                    }}
                    // {...register("neighborhood")}
                  />
                  {errors.name && <SpanError errorText={errors.name.message} />}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Button fullWidth variant="contained" startIcon={<Save />}>
                    Salvar
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </ViewWrapper>
  );
}
