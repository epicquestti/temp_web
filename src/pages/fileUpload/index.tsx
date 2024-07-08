import ViewWrapper from "@/components/ViewWrapper";
import { useApplicationContext } from "@/context/ApplicationContext";
import fetchApi from "@/lib/fetchApi";
import { FilePresent, Send } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import LoagindGridGif from "../../components/DataGridV2/components/assets/loading.gif";

export default function FileUpload() {
  const [screenLoading, setScreenLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<string>("Selecione um pdf.");
  const [pdfFile, setPdfFile] = useState<File | undefined>(undefined);

  const [condosArray, setCondosArray] = useState<any[]>([]);
  const [blocksArray, setBlocksArray] = useState<any[]>([]);
  const [habitationsArray, setHabitationsArray] = useState<any[]>([]);

  const [selectedCondo, setSelectedCondo] = useState<string>("");
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [selectedHabitations, setSelectedHabitations] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
      setPdfFile(file);
    }
  };

  const context = useApplicationContext();

  const initialSetup = async () => {
    try {
      setScreenLoading(true);
      const controllerResponse = await fetchApi.get(`/contractor/get-condos`, {
        headers: {
          Authorization: context.getToken(),
          "router-id": "WEB#API",
        },
      });

      if (controllerResponse.data && controllerResponse.data.length > 0) {
        setCondosArray(controllerResponse.data);
      }

      setScreenLoading(false);
    } catch (error: any) {
      setScreenLoading(false);
      console.log(error.message);
    }
  };

  useEffect(() => {
    initialSetup();
  }, []);

  const handleCondoChange = async (event: SelectChangeEvent) => {
    setSelectedCondo(event.target.value);
    const condo = await fetchApi.get(`/condominium/${event.target.value}`, {
      headers: {
        Authorization: context.getToken(),
        "router-id": "WEB#API",
      },
    });

    if (condo.success) {
      setBlocksArray(condo.data.blocks);

      const habitationObj = {
        condoId: condo.data.condo.id,
        blockId: selectedBlock,
      };

      console.log(condo);

      const habitations = await fetchApi.post(
        `habitations/get-by-condo-id`,
        habitationObj,
        {
          headers: {
            Authorization: context.getToken(),
            "router-id": "WEB#API",
          },
        }
      );

      if (habitations.message) {
        setHabitationsArray(habitations.data);
      }
      console.log("habitations", habitations);
    }
  };

  const handleBlockChange = async (event: SelectChangeEvent) => {
    setSelectedBlock(event.target.value);
    console.log("Block:", event.target.value);

    const block = await fetchApi.get(`/blocks/${event.target.value}`, {
      headers: {
        Authorization: context.getToken(),
        "router-id": "WEB#API",
      },
    });
    if (block.success) {
      // setBlocksArray(block.data.blocks);
    }
    console.log("BlockID", block);
  };

  const handleHabitationChange = (event: SelectChangeEvent<string[]>) => {
    const selectedValue = event.target.value as string; // Get the selected value

    // Update selectedHabitations based on the selection
    setSelectedHabitations((prevSelectedHabitations) => {
      if (prevSelectedHabitations.includes(selectedValue)) {
        // Remove the value if it's already selected
        return prevSelectedHabitations.filter((id) => id !== selectedValue);
      } else {
        // Add the value if it's not selected
        return [...prevSelectedHabitations, selectedValue];
      }
    });
  };

  return (
    <ViewWrapper>
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
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{ fontSize: 17 }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        hidden
                        accept="application/pdf"
                        type="file"
                        ref={fileInputRef}
                        onChange={selectFile}
                      />
                      Selecionar Arquivo
                      <FilePresent />
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <FormControl fullWidth>
                    <InputLabel>Condomínio</InputLabel>
                    <Select
                      value={selectedCondo}
                      label="Condomínio"
                      onChange={handleCondoChange}
                    >
                      {condosArray.length > 0 ? (
                        condosArray.map((item, index) => (
                          <MenuItem value={item.id} key={item.id}>
                            {item.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem>Nenhum Condomínio encontrado</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <FormControl fullWidth>
                    <InputLabel>Bloco</InputLabel>
                    <Select
                      value={selectedBlock ? selectedBlock : undefined}
                      label="Bloco"
                      onChange={handleBlockChange}
                    >
                      {blocksArray.length > 0 ? (
                        blocksArray.map((item) => (
                          <MenuItem value={item.id} key={item.id}>
                            {item.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value={0}>Nenhum Bloco Encontrado</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <FormControl fullWidth>
                    <InputLabel>Moradias</InputLabel>
                    <Select
                      multiple
                      value={selectedHabitations}
                      onChange={handleHabitationChange}
                      input={<OutlinedInput label="Moradias" />}
                      // renderValue={(selected) => selected.join(", ")}
                      // MenuProps={MenuProps}
                    >
                      {habitationsArray.map((item, index) => (
                        <MenuItem
                          key={item.habitationId}
                          value={item.habitationId}
                        >
                          <Checkbox
                            checked={item.checked}
                            onChange={(event) => {
                              item.checked = !item.checked;
                            }}
                          />
                          <ListItemText primary={item.habitationName} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/* <FormControl fullWidth>
                    <InputLabel>Moradias</InputLabel>
                    <Select
                      value={selectedHabitations}
                      label="Moradias"
                      multiple
                      // onChange={handleHabitationChange}
                    >
                      {habitationsArray.length > 0 ? (
                        habitationsArray.map((item) => (
                          <MenuItem
                            value={item.habitationId}
                            key={item.habitationId}
                          >
                            <Checkbox
                              checked={
                                selectedHabitations.indexOf(
                                  item.habitationId
                                ) !== -1
                              }
                            />
                            <ListItemText primary={item.habitationName} />
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value={0}>
                          Nenhuma moradia encontrada
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl> */}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Typography>
                    Arquivo Selecionado: <strong>{selectedFile}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
                  <Button variant="contained" fullWidth endIcon={<Send />}>
                    Enviar
                  </Button>
                </Grid>
                {JSON.stringify(habitationsArray)}
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
    </ViewWrapper>
  );
}
