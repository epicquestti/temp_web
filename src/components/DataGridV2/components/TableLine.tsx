import { TableRow } from "@mui/material";
import { actionList, headerList } from "../types";
import { TableNode } from "./TableNode";

export function TableLine(
  list: any[],
  headers?: headerList[],
  isSelectable?: boolean,
  hasActions?: boolean,
  actionList?: actionList[],
  sendExtraProp?: string,
  actionTrigger?: (id: number, name: string) => void
): JSX.Element[] | "" {
  if (headers && headers.length > 0) {
    const res: JSX.Element[] | undefined = [];
    for (let i = 0; i < list.length; i++) {
      res.push(
        <TableRow
          sx={{ border: "none" }}
          hover
          key={`grid-line-key-${list[i].id}-${parseInt(
            `${Math.random() * (999999 - 1) + 1}`
          )}`}
        >
          {list[i] &&
            TableNode(
              list[i],
              headers,
              isSelectable,
              hasActions,
              actionList,
              sendExtraProp,
              actionTrigger
            )}
        </TableRow>
      );
    }
    return res;
  } else {
    return "";
  }
}
