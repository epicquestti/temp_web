import QHGrid from "@/components/DataGridV2";
import ViewWrapper from "@/components/ViewWrapper";
import { Delete, Edit, Search } from "@mui/icons-material";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dynamic from "next/dynamic";
import { SyntheticEvent, useState } from "react";
import "suneditor/dist/css/suneditor.min.css";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Management() {
  const [loading, setLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alerMessage, setAlerMessage] = useState<string>("");

  const [tabControl, setTabControl] = useState<number>(0);
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
          href: "/customer/management/new",
        },
      ]}
      loading={loading}
      alerMessage={alerMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      title="Cliente"
    >
      <Paper>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Box>
              <Tabs
                value={tabControl}
                onChange={(e: SyntheticEvent, newValue: number) => {
                  setTabControl(newValue);
                }}
              >
                <Tab label="1. Dados do cliente" id="tabpanel-0"></Tab>
                <Tab label="2. Personalização" id="tabpanel-1"></Tab>
                <Tab label="3. Observações" id="tabpanel-2"></Tab>
              </Tabs>
            </Box>
            {/* ### 1. Dados do cliente */}
            <CustomTabPanel value={tabControl} index={0}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: (theme) => theme.palette.secondary.light,
                    }}
                  >
                    Info. do cliente
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    // error={errors.name ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Nome"
                    placeholder="Entre com seu nome completo"
                    // {...register("name")}
                    // ToDo Add Arrors
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    // error={errors.name ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Fantasia"
                    placeholder="Entre com seu nome completo"
                    // {...register("name")}
                    // ToDo Add Arrors
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControlLabel control={<Radio />} label="Ativo" />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl>
                      <FormLabel id="dclient-type-group-label">
                        Tipo de cliente
                      </FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="dclient-type-group-label"
                        defaultValue="J"
                      >
                        <FormControlLabel
                          value="J"
                          control={<Radio />}
                          label="Jurídica"
                        />
                        <FormControlLabel
                          value="F"
                          control={<Radio />}
                          label="Física"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    // error={errors.name ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Cpf"
                    placeholder="Entre com seu nome completo"
                    // {...register("name")}
                    // ToDo Add Arrors
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Data de nascimento"
                      sx={{ width: "100%" }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    // error={errors.name ? true : false}
                    fullWidth
                    variant="outlined"
                    label="RG"
                    placeholder="Entre com seu nome completo"
                    // {...register("name")}
                    // ToDo Add Arrors
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    // error={errors.name ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Celular"
                    placeholder="Entre com seu nome completo"
                    // {...register("name")}
                    // ToDo Add Arrors
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    // error={errors.name ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Telefone"
                    placeholder="Entre com seu nome completo"
                    // {...register("name")}
                    // ToDo Add Arrors
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    // error={errors.name ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Email principal"
                    placeholder="Entre com seu nome completo"
                    // {...register("name")}
                    // ToDo Add Arrors
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    // error={errors.name ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Email financeiro"
                    placeholder="Entre com seu nome completo"
                    // {...register("name")}
                    // ToDo Add Arrors
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: (theme) => theme.palette.secondary.light,
                    }}
                  >
                    Endereço do cliente
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    // error={errors.name ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Cep"
                    placeholder="Entre com seu nome completo"
                    // {...register("name")}
                    // ToDo Add Arrors
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    // error={errors.name ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Rua"
                    placeholder="Entre com seu nome completo"
                    // {...register("name")}
                    // ToDo Add Arrors
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    // error={errors.name ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Bairro"
                    placeholder="Entre com seu nome completo"
                    // {...register("name")}
                    // ToDo Add Arrors
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    // error={errors.name ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Número"
                    placeholder="Entre com seu nome completo"
                    // {...register("name")}
                    // ToDo Add Arrors
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    // error={errors.name ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Cidade"
                    placeholder="Entre com seu nome completo"
                    // {...register("name")}
                    // ToDo Add Arrors
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    // error={errors.name ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Estado"
                    placeholder="Entre com seu nome completo"
                    // {...register("name")}
                    // ToDo Add Arrors
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    // error={errors.name ? true : false}
                    fullWidth
                    variant="outlined"
                    label="Complemento"
                    placeholder="Entre com seu nome completo"
                    // {...register("name")}
                    // ToDo Add Arrors
                  />
                </Grid>
              </Grid>
            </CustomTabPanel>
            {/* ### 2. Personalização */}
            <CustomTabPanel value={tabControl} index={1}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    variant="standard"
                    label="nome da ação para buscar"
                    fullWidth
                    // onKeyDown={listActionstByEnterKeyPress}
                    placeholder="busque pelo nome da ação."
                    // value={searchName}
                    // onChange={(e) => {
                    //   setSearchName(e.target.value);
                    // }}
                    InputProps={{
                      startAdornment: <Search />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <QHGrid
                    // data={functionList}
                    // loading={gridLoading}
                    // pagination={{
                    //   count: gridCount,
                    //   page: page,
                    //   rowsPerPage: rowsPerPage,
                    //   rowsPerPageOptions: [5, 10, 20, 40, 50, 100],
                    //   onRowsPerPageChange(rowsPerPAge) {},
                    //   onPageChange(page) {},
                    // }}
                    hasActions
                    actionTrigger={(id: number, functionName: string) => {
                      switch (functionName) {
                        case "edit":
                          break;
                        case "delete":
                          break;
                        default:
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
            </CustomTabPanel>
            {/* ### 3. Observações */}
            <CustomTabPanel value={tabControl} index={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <SunEditor lang="pt_br" height={"500"} />
                </Grid>
              </Grid>
            </CustomTabPanel>
          </Grid>
        </Grid>
      </Paper>
    </ViewWrapper>
  );
}
