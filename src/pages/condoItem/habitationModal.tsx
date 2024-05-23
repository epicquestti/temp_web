import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { ChangeEvent } from "react";

type habitationModalProps = {
  name: string;
  selectedBlock: { id: string; name: string };
  setName: (name: string) => void;
  onBlockChange: (value: string) => void;
  blocksArray: any[];
};

export default function HabitationModal(props: habitationModalProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <InputLabel>Nome/Número da Casa/Apartamento</InputLabel>
            <TextField
              fullWidth
              value={props.name}
              onChange={(
                event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => {
                props.setName(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <InputLabel>Bloco</InputLabel>
            <FormControl fullWidth>
              <Select
                id="demo-controlled-open-select"
                value={props.selectedBlock.id}
                label="Bloco"
                onChange={(event: SelectChangeEvent<string>) => {
                  props.onBlockChange(event.target.value);
                }}
              >
                <MenuItem value={"0"}>Selecione um Bloco (Opcional)</MenuItem>
                {props.blocksArray &&
                  props.blocksArray.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
