import { MoreVert } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  TableCell,
  Tooltip,
  Typography,
} from "@mui/material";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import { ChangeEvent } from "react";
import { actionList, headerList } from "../types";
enum sizeColumn {
  C1 = "8.33%",
  C2 = "16.66%",
  C3 = "25%",
  C4 = "33.33%",
  C5 = "41.66%",
  C6 = "50%",
  C7 = "58.33%",
  C8 = "66.66%",
  C9 = "74.99%",
  C10 = "83.33%",
  C11 = "91.66%",
  C12 = "100%",
}
export const TableNode = (
  listNode: any,
  headers: headerList[],
  isSelectable?: boolean,
  hasActions?: boolean,
  actionList?: actionList[],
  sendExtraProp?: string,
  actionTrigger?: (id: number, name: string, extra?: string) => void
): JSX.Element[] => {
  const response: JSX.Element[] | undefined = [];

  if (isSelectable) {
    response.push(
      <TableCell
        sx={{ width: "8.33333%", border: "none" }}
        key={`grid-node-key-${listNode.id}-checkbox-firts`}
        align="center"
      >
        <Checkbox
          size="small"
          name="checkBox-intendify"
          onChange={(
            event: ChangeEvent<HTMLInputElement>,
            checked: boolean
          ) => {
            event.currentTarget.dataset.checkedState = checked ? "S" : "N";
          }}
          inputProps={
            {
              "data-identificator": listNode.id,
              "data-checked-state": "N",
            } as any
          }
        />
      </TableCell>
    );
  }

  for (let i = 0; i < headers.length; i++) {
    if (!headers[i].custom) {
      response.push(
        <TableCell
          sx={{
            border: "none",
            width:
              headers[i].width !== undefined
                ? sizeColumn[
                    `${"C" + headers[i].width}` as keyof typeof sizeColumn
                  ]
                : "auto",
          }}
          key={`grid-node-key-${listNode.id}-${i}`}
          align={headers[i].align ? headers[i].align : "left"}
        >
          {listNode[headers[i].attrName as keyof typeof listNode]}
        </TableCell>
      );
    } else {
      if (headers[i].custom?.isBox) {
        response.push(
          <TableCell
            sx={{
              border: "none",
              width:
                headers[i].width !== undefined
                  ? sizeColumn[
                      `${"C" + headers[i].width}` as keyof typeof sizeColumn
                    ]
                  : "auto",
            }}
            key={`grid-node-key-${listNode.id}-${i}`}
            align={headers[i].align ? headers[i].align : "left"}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: headers[i].custom?.color,
                borderRadius: "6px",
                p: 1,
              }}
            >
              <Typography sx={{ fontSize: 10 }}>
                {listNode[headers[i].attrName as keyof typeof listNode]}
              </Typography>
            </Box>
          </TableCell>
        );
      }

      if (headers[i].custom?.isIcon) {
        response.push(
          <TableCell
            sx={{
              border: "none",
              width:
                headers[i].width !== undefined
                  ? sizeColumn[
                      `${"C" + headers[i].width}` as keyof typeof sizeColumn
                    ]
                  : "auto",
            }}
            key={`grid-node-key-${listNode.id}-${i}`}
            align={headers[i].align ? headers[i].align : "left"}
          >
            <Tooltip
              title={listNode[
                headers[i].attrName as keyof typeof listNode
              ].toString()}
            >
              <Icon sx={{ color: listNode.color }}>{listNode.icon}</Icon>
            </Tooltip>
          </TableCell>
        );
      }
    }
  }

  if (hasActions) {
    response.push(
      <TableCell
        sx={{ border: "none", width: "8.33333%" }}
        key={`grid-node-key-${listNode.id}-checkbox-last`}
        align="center"
      >
        <PopupState variant="popover" popupId="demo-popup-menu">
          {(popupState) => (
            <>
              <IconButton size="small" {...bindTrigger(popupState)}>
                <MoreVert fontSize="small" />
              </IconButton>
              <Menu {...bindMenu(popupState)}>
                {actionList &&
                  actionList.map((actionItem, index) => (
                    <MenuItem
                      key={`menu-item-grid-item-${listNode.id}-${index}`}
                      onClick={() => {
                        if (actionTrigger) {
                          if (sendExtraProp) {
                            actionTrigger(
                              listNode.id,
                              actionItem.name,
                              listNode[sendExtraProp]
                            );
                          } else {
                            actionTrigger(listNode.id, actionItem.name);
                          }
                        }

                        popupState.close();
                      }}
                    >
                      {actionItem.icon && actionItem.icon}
                      {actionItem.icon ? (
                        <Typography sx={{ marginLeft: 2 }} variant="caption">
                          {actionItem.text}
                        </Typography>
                      ) : (
                        <Typography variant="caption">
                          {actionItem.text}
                        </Typography>
                      )}
                    </MenuItem>
                  ))}
              </Menu>
            </>
          )}
        </PopupState>
      </TableCell>
    );
  }

  return response;
};
