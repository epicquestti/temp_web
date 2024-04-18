import ViewWrapper from "@/components/ViewWrapper";
import { Add, Edit, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Fab,
  FormControl,
  Grid,
  IconButton,
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
import { useState } from "react";

export default function CondoItem() {
  const router = useRouter();
  const { id } = router.query;
  const [allowEditing, setAllowEditing] = useState<boolean>(false);
  const [showEditAlert, setShowEditAlert] = useState<boolean>(false);

  const name = "Nome do Condomínio ";

  const moradores: any[] = [
    {
      id: "1",
      name: "11A",
    },
    {
      id: "22A",
      name: "Douglas Pacor",
    },
    {
      id: "33A",
      name: "José da Silva",
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
                      setShowEditAlert(true);
                    }}
                  >
                    Ativar/Desativar Edição
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  variant="outlined"
                  label="Nome do Condomínio"
                  InputLabelProps={{ shrink: true }}
                  value={name}
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
                  // value={condoCNPJ}
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
                  // value={condoAddress}
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
                  // value={addressNeighborhood}
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
                  // value={addressNumber}
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
                  // value={addressComplement}
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
                  // value={addressCEP}
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
                  // value={addressCity}
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
                    // value={selectedState}
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
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  variant="outlined"
                  label="Número de Moradias"
                  InputLabelProps={{ shrink: true }}
                  // value={numberOfHomes}
                  fullWidth
                  inputProps={{ readOnly: !allowEditing }}
                  // onChange={(
                  //   event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  // ) => {
                  //   setNumberOfHomes(numbersOnlyMask(event.target.value));
                  // }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  variant="outlined"
                  label="Número de Blocos"
                  InputLabelProps={{ shrink: true }}
                  // value={numberOfBlocks}
                  fullWidth
                  inputProps={{ readOnly: !allowEditing }}
                  // onChange={(
                  //   event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  // ) => {
                  //   setNumberOfBlocks(numbersOnlyMask(event.target.value));
                  // }}
                />
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
                    <Typography variant="h4">Habitações</Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Tooltip title="Adicionar Habitação">
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        <Fab color="primary" aria-label="add">
                          <IconButton
                            sx={{
                              color: "#fff",
                            }}
                          >
                            <Add />
                          </IconButton>
                        </Fab>
                      </Box>
                    </Tooltip>
                  </Grid>
                </Grid>
                {moradores.length > 0 &&
                  moradores.map((item, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      key={index}
                    >
                      <Tooltip title="Clique para visualizar o morador">
                        <Link
                          href={`/residentItem/${item.id}`}
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
                            <Typography sx={{ fontWeight: "bold" }}>
                              {item.name}
                            </Typography>
                            <Typography sx={{ fontWeight: "bold" }}>
                              Apartamento/Casa: {item.house}
                            </Typography>
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
      <Dialog
        open={showEditAlert}
        onClose={() => {
          setShowEditAlert(false);
        }}
        // aria-labelledby="alert-dialog-title"
        // aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          {allowEditing ? "Edição Ativada" : "Edição Desativada"}
        </DialogTitle>
        {/* <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir o plano: &quot;{name}&quot; ?
          </DialogContentText>
        </DialogContent> */}
        <DialogActions>
          <Button
            onClick={() => {
              setShowEditAlert(false);
            }}
          >
            cancelar
          </Button>
          {/* <Button
            onClick={() => {
              deletePlan();
            }}
            autoFocus
          >
            Confirmar Exclusão.
          </Button> */}
        </DialogActions>
      </Dialog>
    </ViewWrapper>
  );
}
