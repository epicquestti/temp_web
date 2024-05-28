import { FormatListBulleted } from "@mui/icons-material";
import { Box, SpeedDial, SpeedDialAction } from "@mui/material";
import { ReactNode } from "react";

export type speedDialProps = {
  actions: {
    icon: ReactNode;
    name: string;
  }[];
};

export default function SpeedDialButton(props: speedDialProps) {
  return (
    <Box sx={{ height: 330, transform: "translateZ(0px)", flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="Speed Dial"
        // direction="left"
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
        }}
        icon={<FormatListBulleted />}
      >
        {props.actions.length > 0 &&
          props.actions.map((item, index) => (
            <SpeedDialAction
              key={item.name}
              icon={item.icon}
              tooltipTitle={item.name}
              tooltipOpen
            />
          ))}
      </SpeedDial>
    </Box>
  );
}
