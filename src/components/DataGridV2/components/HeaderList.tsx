import { Icon, IconButton } from "@mui/material";
import { headerList } from "../types";
import { DefaultHeader } from "./DefaultHeader";
import { LeftCheckHeader } from "./LeftCheckHeader";
import { RigthHeader } from "./RigthHeader";

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

export const HeaderList = (
  list?: headerList[],
  isSelectable?: boolean,
  headerOnChange?: () => void,
  hasAction?: boolean
) => {
  const res: JSX.Element[] | undefined = [];

  if (list && list.length > 0) {
    const start = 0;
    const end: number = list.length - 1;

    for (let i = 0; i < list.length; i++) {
      switch (i) {
        case start:
          if (isSelectable) {
            res.push(
              <LeftCheckHeader
                key={`header-first-item`}
                sx={{ width: "8.33%" }}
                align="center"
              >
                <IconButton size="small" onClick={headerOnChange}>
                  <Icon sx={{ color: "white" }}>more_horiz</Icon>
                </IconButton>
              </LeftCheckHeader>
            );
          }

          res.push(
            <DefaultHeader
              sx={{
                width:
                  list[i].width !== undefined
                    ? sizeColumn[
                        `${"C" + list[i].width}` as keyof typeof sizeColumn
                      ]
                    : "auto",
              }}
              key={`header-${i}-item-start-default`}
              align={list[i].align ? list[i].align : "left"}
            >
              {list[i].text}
            </DefaultHeader>
          );

          break;

        case end:
          if (hasAction) {
            res.push(
              <DefaultHeader
                sx={{
                  width:
                    list[i].width !== undefined
                      ? sizeColumn[
                          `${"C" + list[i].width}` as keyof typeof sizeColumn
                        ]
                      : "auto",
                }}
                key={`header-${i}-item-end`}
                align={list[i].align ? list[i].align : "left"}
              >
                {list[i].text}
              </DefaultHeader>
            );
            res.push(
              <RigthHeader key={`header-last-item`} sx={{ width: "8.33%" }} />
            );
          } else {
            res.push(
              <RigthHeader
                sx={{
                  width:
                    list[i].width !== undefined
                      ? sizeColumn[
                          `${"C" + list[i].width}` as keyof typeof sizeColumn
                        ]
                      : "auto",
                }}
                key={`header-${i}-item-has-actions`}
                align={list[i].align ? list[i].align : "left"}
              >
                {list[i].text}
              </RigthHeader>
            );
          }
          break;

        default:
          res.push(
            <DefaultHeader
              sx={{
                width:
                  list[i].width !== undefined
                    ? sizeColumn[
                        `${"C" + list[i].width}` as keyof typeof sizeColumn
                      ]
                    : "auto",
              }}
              key={`header-${i}-item-default-no-identification`}
              align={list[i].align ? list[i].align : "left"}
            >
              {list[i].text}
            </DefaultHeader>
          );
          break;
      }
    }
  }

  return res;
};
