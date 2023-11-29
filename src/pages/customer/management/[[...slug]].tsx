import ViewWrapper from "@/components/ViewWrapper";
import { Search } from "@mui/icons-material";
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
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
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
                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
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
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
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
                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label="Data de nascimento" />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </CustomTabPanel>
            {/* ### 2. Personalização */}
            <CustomTabPanel value={tabControl} index={1}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
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
