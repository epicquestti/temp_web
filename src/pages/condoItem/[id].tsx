import ViewWrapper from "@/components/ViewWrapper";
import { useApplicationContext } from "@/context/ApplicationContext";
import fetchApi from "@/lib/fetchApi";
import { cepMask, cnpjMask } from "@/lib/masks";
import { Add, Edit, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Fab,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type condoType = {
  id: string;
  name: string;
  cnpj?: string;
  street: string;
  streetNumber: string;
  neighborhood: string;
  complement?: string;
  cep: string;
  city: string;
  state: string;
  stateName: string;
};

type blockType = {
  condominiumId: string;
  id: string;
  name: string;
};

export default function CondoItem() {
  const router = useRouter();
  const context = useApplicationContext();
  const condoId = router.query.id;
  const [allowEditing, setAllowEditing] = useState<boolean>(false);

  const [condoItem, setCondoItem] = useState<condoType>({
    id: "",
    name: "",
    cnpj: "",
    street: "",
    streetNumber: "",
    neighborhood: "",
    complement: "",
    cep: "",
    city: "",
    state: "",
    stateName: "",
  });

  const [blocksArray, setBlocksArray] = useState<blockType[]>([]);

  const initialSetup = async () => {
    const controllerResponse = await fetchApi.get(`/condominium/${condoId}`, {
      headers: {
        "router-id": "WEB#API",
        Authorization: context.getToken(),
      },
    });
    console.log("controllerResponse", controllerResponse);

    if (controllerResponse.success) {
      setCondoItem(controllerResponse.data.condo);
      if (controllerResponse.data.blocks.length > 0) {
        setBlocksArray(controllerResponse.data.blocks);
      }
    }
  };

  useEffect(() => {
    initialSetup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h4">Dados do Condomínio</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                {JSON.stringify(condoItem)}
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Button
                    endIcon={<Edit />}
                    variant="contained"
                    onClick={() => {
                      setAllowEditing(!allowEditing);
                    }}
                  >
                    Editar
                  </Button>
                </Box>
              </Grid>
              {allowEditing ? (
                <>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <TextField
                      variant="outlined"
                      label="Nome do Condomínio"
                      InputLabelProps={{ shrink: true }}
                      value={condoItem.name}
                      // disabled={allowEditing}
                      inputProps={{ readOnly: !allowEditing }}
                      fullWidth
                      // onChange={(
                      //   event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                      // ) => {
                      //   setCondoName(event.target.value);
                      // }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <TextField
                      variant="outlined"
                      label="CNPJ do Condomínio"
                      InputLabelProps={{ shrink: true }}
                      value={condoItem.cnpj}
                      fullWidth
                      inputProps={{ readOnly: !allowEditing }}
                      // onChange={(
                      //   event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                      // ) => {
                      //   setCondoCNPJ(cnpjMask(event.target.value));
                      // }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <TextField
                      variant="outlined"
                      label="Endereço"
                      InputLabelProps={{ shrink: true }}
                      value={condoItem.street}
                      fullWidth
                      inputProps={{ readOnly: !allowEditing }}
                      // onChange={(
                      //   event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                      // ) => {
                      //   setCondoAddress(event.target.value);
                      // }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <TextField
                      variant="outlined"
                      label="Bairro"
                      InputLabelProps={{ shrink: true }}
                      value={condoItem.neighborhood}
                      fullWidth
                      inputProps={{ readOnly: !allowEditing }}
                      // onChange={(
                      //   event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                      // ) => {
                      //   setAddressNeighborhood(event.target.value);
                      // }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <TextField
                      variant="outlined"
                      label="Número"
                      InputLabelProps={{ shrink: true }}
                      value={condoItem.streetNumber}
                      fullWidth
                      inputProps={{ readOnly: !allowEditing }}
                      // onChange={(
                      //   event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                      // ) => {
                      //   setAddressNumber(event.target.value);
                      // }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <TextField
                      variant="outlined"
                      label="Complemento"
                      InputLabelProps={{ shrink: true }}
                      value={condoItem.complement}
                      fullWidth
                      inputProps={{ readOnly: !allowEditing }}
                      // onChange={(
                      //   event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                      // ) => {
                      //   setAddressComplement(event.target.value);
                      // }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <TextField
                      variant="outlined"
                      label="CEP"
                      InputLabelProps={{ shrink: true }}
                      value={condoItem.cep}
                      fullWidth
                      inputProps={{ readOnly: !allowEditing }}
                      // onChange={(
                      //   event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                      // ) => {
                      //   getCep(event.target.value);
                      //   setAddressCEP(cepMask(event.target.value));
                      // }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <TextField
                      variant="outlined"
                      label="Cidade"
                      InputLabelProps={{ shrink: true }}
                      value={condoItem.city}
                      fullWidth
                      inputProps={{ readOnly: !allowEditing }}
                      // onChange={(
                      //   event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                      // ) => {
                      //   setAddressCity(event.target.value);
                      // }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <FormControl fullWidth>
                      <InputLabel id="stateId">{"Estado"}</InputLabel>
                      <Select
                        labelId="stateId"
                        label="Estado"
                        inputProps={{ readOnly: !allowEditing }}
                        // value={condoItem.stateIbge}
                        // onChange={(event: SelectChangeEvent) => {
                        //   setSelectedState(() => event.target.value);
                        // }}
                      >
                        <MenuItem value={0}>Selecione ...</MenuItem>
                        {/* {statesArray.length > 0 &&
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
                      )} */}
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
                        if (!allowEditing) {
                          return;
                        } else {
                          console.log("Botão Funcionando");
                        }
                      }}
                    >
                      {allowEditing ? "Salvar" : "Salvar (Desativado)"}
                    </Button>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Typography>
                      Nome: <b>{condoItem.name}</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Typography>
                      CNPJ:{" "}
                      <b>{condoItem.cnpj ? cnpjMask(condoItem.cnpj) : ""}</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Typography>
                      Endereço: <b>{condoItem.street}</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Typography>
                      Bairro: <b>{condoItem.neighborhood}</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Typography>
                      Número: <b>{condoItem.streetNumber}</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Typography>
                      Complemento: <b>{condoItem.complement}</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Typography>
                      CEP: <b>{condoItem.cep ? cepMask(condoItem.cep) : ""}</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Typography>
                      Cidade: <b>{condoItem.city}</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Typography>
                      Estado: <b>{condoItem.state}</b>
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper sx={{ p: 3 }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
                    <Typography variant="h4">Blocos</Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Tooltip title="Adicionar Bloco">
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        <Fab color="primary" aria-label="add">
                          <Add />
                        </Fab>
                      </Box>
                    </Tooltip>
                  </Grid>
                </Grid>
                {blocksArray.length > 0 &&
                  blocksArray.map((item, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      key={index}
                    >
                      <Tooltip title="Clique para visualizar o bloco">
                        <Link
                          href={`/blockItem/${item.id}`}
                          style={{
                            textDecoration: "none",
                            color: "#000",
                          }}
                        >
                          <Box
                            sx={{
                              border: (theme) =>
                                `2px solid ${theme.palette.primary.dark}`,
                              padding: 1,
                              borderRadius: 2,
                              marginTop: 1,
                            }}
                          >
                            <Typography>
                              Nome: <b>{item.name}</b>
                            </Typography>
                            {/* <Typography>
                              <b>Habitações: </b>
                            </Typography> */}
                            {/* {item.habitations &&
                              item.habitations.length > 0 &&
                              item.habitations.map((item: any, index: any) => (
                                <Typography key={index}>
                                  Apartamento/Casa: <b>{item.name}</b>
                                </Typography>
                              ))} */}
                          </Box>
                        </Link>
                      </Tooltip>
                    </Grid>
                  ))}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </ViewWrapper>
  );
}
