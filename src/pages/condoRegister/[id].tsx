import ViewWrapper from "@/components/ViewWrapper";
import { useApplicationContext } from "@/context/ApplicationContext";
import fetchApi from "@/lib/fetchApi";
import { cepMask, cnpjMask } from "@/lib/masks";
import { Save } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import LoagindGridGif from "../../components/DataGridV2/components/assets/loading.gif";

type condominiumType = {
  name: string;
  cnpj?: string;
};

type addressType = {
  address: string;
  addressNumber?: string;
  neighborhood: string;
  cep: string;
  complement?: string;
  city: string;
  state: string;
  cityIbge: string;
};

export default function CondoRegister() {
  const context = useApplicationContext();
  const router = useRouter();
  const id = router.query.id;

  //States de Controle de Interface e comportamento
  const [loading, setLoading] = useState<boolean>(false);
  const [screenLoading, setScreenLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  //States de Armazenamento de informações
  const [condominium, setCondomimium] = useState<condominiumType>({
    name: "",
    cnpj: "",
  });
  const [addressState, setAddressState] = useState<addressType>({
    address: "",
    addressNumber: "",
    neighborhood: "",
    cep: "",
    complement: "",
    city: "",
    state: "0",
    cityIbge: "",
  });
  const [statesArray, setStatesArray] = useState<
    { ibge: number; acronym: string; name: string }[]
  >([]);

  //Funções
  const initialSetup = async () => {
    const statesResponse = await fetchApi.get("/global/tools/get-all-states", {
      headers: {
        Authorization: context.getToken(),
        "router-id": "WEB#API",
      },
    });

    if (statesResponse.success) {
      setStatesArray(statesResponse.data);
    }
  };

  const getCep = async (cep: string) => {
    try {
      setLoading(true);

      const cepResponse = await fetchApi.get(`/global/tools/get-cep/${cep}`, {
        headers: {
          Authorization: context.getToken(),
          "router-id": "WEB#API",
        },
      });
      console.log(cepResponse);

      if (cepResponse.success) {
        const response = cepResponse.data.data;
        setAddressState((prev) => ({
          address: response.logradouro,
          cep: cep,
          neighborhood: response.bairro,
          complement: response.complemento,
          city: response.localidade,
          state: response.ibge.substring(0, 2),
          cityIbge: response.ibge,
          addressNumber: addressState.addressNumber,
        }));
      }

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error.message);
    }
  };

  useEffect(() => {
    initialSetup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateAndAlert = (condition: boolean, message: string): boolean => {
    if (condition) {
      setLoading(false);
      setAlertMessage(message);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 6000);
      return true;
    }
    return false;
  };

  const condoValidation = async () => {
    try {
      setLoading(true);

      if (
        validateAndAlert(
          condominium.name === "",
          "Por favor, preencha o nome do condomínio"
        ) ||
        validateAndAlert(
          addressState.address === "",
          "Por favor, preencha o endereço do condomínio"
        ) ||
        validateAndAlert(
          addressState.addressNumber === "",
          "Por favor, preencha o número do endereço do condomínio"
        ) ||
        validateAndAlert(
          addressState.neighborhood === "",
          "Por favor, preencha o bairro do endereço do condomínio"
        ) ||
        validateAndAlert(
          addressState.cep === "",
          "Por favor, preencha o cep do endereço do condomínio"
        ) ||
        validateAndAlert(
          addressState.city === "",
          "Por favor, preencha a cidade do condomínio"
        ) ||
        validateAndAlert(
          addressState.state === "0",
          "Por favor, escolha o estado do condomínio"
        )
      ) {
        return;
      } else {
        return {
          success: true,
        };
      }
    } catch (error: any) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const registerCondominium = async () => {
    try {
      setLoading(true);

      const validation = await condoValidation();

      if (validation?.success) {
        const condoObj = {
          address: addressState.address,
          addressNumber: addressState.addressNumber,
          cep: addressState.cep,
          cityIbge: parseInt(addressState.cityIbge),
          cnpj: condominium.cnpj,
          complement: addressState.complement,
          name: condominium.name,
          neighborhood: addressState.neighborhood,
          key: id,
        };

        const controllerResponse = await fetchApi.post(
          `/condominium/new`,
          condoObj,
          {
            headers: {
              Authorization: context.getToken(),
              "router-id": "WEB#API",
            },
          }
        );

        console.log("controllerResponse", controllerResponse);

        if (controllerResponse.success) {
          setLoading(false);
          setAlertMessage(
            "Condomínio cadastrado com sucesso. Redirecionando..."
          );
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
            router.push(`/condoItem/${controllerResponse.data.id}`);
          }, 3000);
        }
      }

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error.message);
    }
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
          text: "Meus Condomínios",
          iconName: "home_work",
          href: "/myCondos",
        },
        {
          text: `Cadastro de Condomínios`,
          iconName: "home",
          href: `/condoRegister/${id}`,
        },
      ]}
      alerMessage={alertMessage}
      showAlert={showAlert}
      closeAlert={() => {
        setShowAlert(false);
      }}
      loading={loading}
    >
      <Grid container spacing={2}>
        {screenLoading ? (
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Box sx={{ marginTop: "20%" }}>
              <Image
                src={LoagindGridGif}
                alt="GIF de carregamento"
                width={250}
                height={250}
                priority
              />
            </Box>
          </Grid>
        ) : (
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Paper sx={{ p: 3 }}>
              <Grid
                container
                spacing={3}
                alignItems="center"
                justifyContent="center"
              >
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h4">Cadastro do Condomínio</Typography>
                    {JSON.stringify(addressState)}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <TextField
                    variant="outlined"
                    label="Nome do Condomínio"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ maxLength: 100 }}
                    value={condominium.name}
                    fullWidth
                    onChange={(
                      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => {
                      setCondomimium((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }));
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <TextField
                    variant="outlined"
                    label="CNPJ do Condomínio"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ maxLength: 18 }}
                    value={condominium.cnpj ? cnpjMask(condominium.cnpj) : ""}
                    fullWidth
                    onChange={(
                      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => {
                      setCondomimium((prev) => ({
                        ...prev,
                        cnpj: event.target.value,
                      }));
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
                  <TextField
                    variant="outlined"
                    label="Endereço"
                    InputLabelProps={{ shrink: true }}
                    value={addressState.address}
                    fullWidth
                    onChange={(
                      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => {
                      setAddressState((prev) => ({
                        ...prev,
                        address: event.target.value,
                      }));
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                  <TextField
                    variant="outlined"
                    label="Número"
                    InputLabelProps={{ shrink: true }}
                    value={addressState.addressNumber}
                    fullWidth
                    onChange={(
                      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => {
                      setAddressState((prev) => ({
                        ...prev,
                        addressNumber: event.target.value,
                      }));
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                  <TextField
                    variant="outlined"
                    label="Bairro"
                    InputLabelProps={{ shrink: true }}
                    value={addressState.neighborhood}
                    fullWidth
                    onChange={(
                      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => {
                      setAddressState((prev) => ({
                        ...prev,
                        neighborhood: event.target.value,
                      }));
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <TextField
                    variant="outlined"
                    label="CEP"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ maxLength: 8 }}
                    value={cepMask(addressState.cep)}
                    fullWidth
                    onChange={(
                      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => {
                      getCep(event.target.value);
                      setAddressState((prev) => ({
                        ...prev,
                        cep: event.target.value,
                      }));
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <TextField
                    variant="outlined"
                    label="Complemento"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ maxLength: 100 }}
                    value={
                      addressState.complement ? addressState.complement : ""
                    }
                    fullWidth
                    onChange={(
                      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => {
                      setAddressState((prev) => ({
                        ...prev,
                        complement: event.target.value,
                      }));
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <TextField
                    variant="outlined"
                    label="Cidade"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ maxLength: 100 }}
                    value={addressState.city}
                    fullWidth
                    onChange={(
                      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => {
                      setAddressState((prev) => ({
                        ...prev,
                        city: event.target.value,
                      }));
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <FormControl fullWidth>
                    <InputLabel id="stateId">{"Estado"}</InputLabel>
                    <Select
                      labelId="stateId"
                      label="Estado"
                      value={addressState.state}
                      onChange={(event: SelectChangeEvent) => {
                        setAddressState((prev) => ({
                          ...prev,
                          state: event.target.value,
                        }));
                      }}
                    >
                      <MenuItem value={"0"}>Selecione ...</MenuItem>
                      {statesArray.length > 0 &&
                        statesArray.map(
                          (item: {
                            ibge: number;
                            acronym: string;
                            name: string;
                          }) => (
                            <MenuItem value={item.ibge} key={item.ibge}>
                              {item.acronym}
                            </MenuItem>
                          )
                        )}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Save />}
                    type="submit"
                    onClick={() => {
                      registerCondominium();
                    }}
                  >
                    Salvar
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
    </ViewWrapper>
  );
}
