import { generateRandomString } from "@/lib/helpers/random";
import { Breadcrumbs, Icon, Link } from "@mui/material";
import { FC, ReactNode } from "react";

export type local = {
  text: string;
  href: string;
  iconName: string;
};

type locationtProps = {
  children?: ReactNode;
  location?: local[];
};

const Location: FC<locationtProps> = ({ ...props }) => {
  return (
    <Breadcrumbs sx={{ color: (theme) => theme.palette.primary.light }}>
      {props.location &&
        props.location.map((local, index) => (
          <Link
            key={`breadcrumbs-ident-${generateRandomString(index.toString())}`}
            underline="hover"
            sx={{
              display: "flex",
              alignItems: "center",
              color: (theme) => theme.palette.primary.light,
            }}
            href={local.href}
          >
            <Icon sx={{ mr: 0.5 }} fontSize="inherit">
              {local.iconName}
            </Icon>
            {local.text}
          </Link>
        ))}
    </Breadcrumbs>
  );
};

export default Location;
