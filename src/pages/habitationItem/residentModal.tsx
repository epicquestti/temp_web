import {
  Checkbox,
  FormControlLabel,
  Grid,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent } from "react";

export type residentTypeProps = {
  id?: string;
  name: string;
  cpf: string;
  phone: string;
  email?: string;
  isPropertyOwner: boolean;
  isEmployee: boolean;
  nameChange: (name: string) => void;
  cpfChange: (cpf: string) => void;
  phoneChange: (phone: string) => void;
  emailChange: (email: string) => void;
  isPropertyOwnerChange: (value: boolean) => void;
  isEmployeeChange: (value: boolean) => void;
};

export default function ResidentModal(props: residentTypeProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <InputLabel>Nome*</InputLabel>
            <TextField
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={props.name}
              fullWidth
              onChange={(
                event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => {
                props.nameChange(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <InputLabel>CPF*</InputLabel>
            <TextField
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              inputProps={{ maxLength: 15 }}
              value={props.cpf}
              fullWidth
              onChange={(
                event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => {
                props.cpfChange(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <InputLabel>Telefone*</InputLabel>
            <TextField
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              inputProps={{ maxLength: 15 }}
              value={props.phone}
              fullWidth
              onChange={(
                event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => {
                props.phoneChange(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <InputLabel>E-Mail</InputLabel>
            <TextField
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={props.email}
              fullWidth
              onChange={(
                event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => {
                props.emailChange(event.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={props.isPropertyOwner}
                  onChange={(
                    event: ChangeEvent<HTMLInputElement>,
                    checked: boolean
                  ) => {
                    props.isPropertyOwnerChange(checked);
                  }}
                />
              }
              label="Titular do Imóvel?"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={props.isEmployee}
                  onChange={(
                    event: ChangeEvent<HTMLInputElement>,
                    checked: boolean
                  ) => {
                    props.isEmployeeChange(checked);
                  }}
                />
              }
              label="Empregado do Imóvel?"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography>Os campos marcados com (*) são obrigatórios</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
