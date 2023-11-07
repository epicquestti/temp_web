import {
  Box,
  CircularProgress,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { FC, MouseEvent, useState } from "react";
import { HeaderList, TableLine } from "./components";
import EmptyCotent from "./components/assets/illustration_empty_content.svg";
import LoagindGridGif from "./components/assets/loading.gif";
import { qhGridProps } from "./types";
const QHGrid: FC<qhGridProps> = ({ ...props }) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const openOptions = () => {
    setShowOptions(true);
  };
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {props.loading ? (
              <TableCell
                sx={{ backgroundColor: "secondary.main", borderRadius: "4px" }}
                colSpan={12}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CircularProgress size="20px" />
                  <Typography sx={{ ml: 3 }} variant="caption">
                    Aguarde...
                  </Typography>
                </Box>
              </TableCell>
            ) : showOptions &&
              props.groupActions &&
              props.groupActions.length > 0 ? (
              <TableCell
                sx={{
                  backgroundColor: "secondary.main",
                  color: "primary.dark",
                  border: 0,
                  paddingTop: "1px",
                  paddingBottom: "1px",
                  paddingRight: "10px",
                  borderRadius: "4px",
                }}
                colSpan={12}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignContent: "center",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    boxSizing: "border-box",
                  }}
                >
                  {props.groupActions &&
                    props.groupActions.map((gpItem, index) =>
                      gpItem.icon ? (
                        <Tooltip
                          key={`group-actions-identifier-${index}-button`}
                          title={gpItem.text ? gpItem.text : "Action"}
                          placement="top"
                        >
                          <IconButton
                            size="small"
                            onClick={() => {
                              const list = Array.from(
                                document.getElementsByName("checkBox-intendify")
                              );
                              const res: number[] = [];

                              for (let i = 0; i < list.length; i++) {
                                if (list[i].dataset.checkedState === "S") {
                                  if (
                                    typeof list[i].dataset.identificator !==
                                    "undefined"
                                  ) {
                                    if (list[i].dataset.identificator) {
                                      res.push(
                                        parseInt(
                                          list[i].dataset.identificator || "0"
                                        )
                                      );
                                    }
                                  }
                                } else {
                                  continue;
                                }
                              }

                              props.groupActionTrigger &&
                                props.groupActionTrigger(res, gpItem.name);
                              setShowOptions(false);
                            }}
                          >
                            <Icon>{gpItem.icon}</Icon>
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip
                          key={`group-actions-identifier-${index}-button`}
                          title={gpItem.text ? gpItem.text : "Action"}
                          placement="top"
                        >
                          <IconButton
                            key={`group-actions-identifier-${index}-button`}
                            size="small"
                            onClick={() => {
                              const list = Array.from(
                                document.getElementsByName("checkBox-intendify")
                              );
                              const res: number[] = [];

                              for (let i = 0; i < list.length; i++) {
                                if (list[i].dataset.checkedState === "S") {
                                  if (
                                    typeof list[i].dataset.identificator !==
                                    "undefined"
                                  ) {
                                    if (list[i].dataset.identificator) {
                                      res.push(
                                        parseInt(
                                          list[i].dataset.identificator || "0"
                                        )
                                      );
                                    }
                                  }
                                } else {
                                  continue;
                                }
                              }
                              props.groupActionTrigger &&
                                props.groupActionTrigger(res, gpItem.name);
                              setShowOptions(false);
                            }}
                          >
                            <Icon fontSize="small">help_center</Icon>
                          </IconButton>
                        </Tooltip>
                      )
                    )}

                  {props.groupActions && (
                    <Tooltip
                      key={`group-actions-identifier-close-actions-bar-button`}
                      title="Fechar"
                      placement="top"
                    >
                      <IconButton
                        size="small"
                        onClick={() => {
                          setShowOptions(false);
                        }}
                      >
                        <Icon>close</Icon>
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
            ) : (
              HeaderList(
                props.headers,
                props.selectable,
                openOptions,
                props.hasActions
              )
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.loading ? (
            <TableRow sx={{ border: "none" }}>
              <TableCell colSpan={12}>
                <Box
                  sx={{
                    width: "100%",
                    height: "250px",
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "block",
                      textAlign: "center",
                    }}
                  >
                    <Box sx={{ left: "50%" }}>
                      <Image
                        width={140}
                        height={140}
                        src={LoagindGridGif}
                        alt="Gif de carregamento"
                        priority
                      />
                    </Box>
                    <Box>
                      <Typography textAlign="center" variant="h6">
                        Aguarde...
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
          ) : !props.loading && props.data && props.data.length > 0 ? (
            TableLine(
              props.data,
              props.headers,
              props.selectable,
              props.hasActions,
              props.actions,
              props.sendExtraProp,
              props.actionTrigger
            )
          ) : (
            <TableRow sx={{ border: "none" }}>
              <TableCell colSpan={12}>
                <Box
                  sx={{
                    width: "100%",
                    height: "250px",
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "block",
                      textAlign: "center",
                    }}
                  >
                    <Box sx={{ left: "50%" }}>
                      <Image
                        width={210}
                        height={156}
                        src={EmptyCotent}
                        alt="empty grid"
                        priority
                      />
                    </Box>

                    <Box>
                      <Typography textAlign="center" variant="h6">
                        Sem registros
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {props.pagination && (
        <TablePagination
          component="div"
          count={props.pagination.count}
          page={props.pagination.page}
          rowsPerPage={props.pagination.rowsPerPage}
          rowsPerPageOptions={props.pagination.rowsPerPageOptions}
          labelRowsPerPage="Registros por página"
          labelDisplayedRows={({ from, to, count }) => {
            return `${from}-${to} de ${count !== -1 ? count : to}`;
          }}
          onRowsPerPageChange={(e) => {
            props.pagination?.onRowsPerPageChange &&
              props.pagination.onRowsPerPageChange(
                parseInt(e.target.value, 10)
              );
          }}
          onPageChange={(
            _: MouseEvent<HTMLButtonElement, globalThis.MouseEvent> | null,
            page: number
          ) => {
            props.pagination?.onPageChange &&
              props.pagination.onPageChange(page);
          }}
        />
      )}
    </TableContainer>
  );
};

export default QHGrid;
