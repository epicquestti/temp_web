import { ReactNode } from "react";
export type customType = {
  isBox?: boolean;
  isIcon?: boolean;
  icon?: string;
  color?: string;
};

export type headerList = {
  text?: string;
  attrName?: string;
  align?: "center" | "inherit" | "justify" | "left" | "right";
  width?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  custom?: customType;
};

export type actionList = {
  text: string;
  name: string;
  icon: JSX.Element;
};

export type groupActionList = {
  text: string;
  name: string;
  icon: string;
};

export type qhGridProps = {
  children?: ReactNode;
  loading?: boolean;
  selectable?: boolean;
  hasActions?: boolean;
  headers?: headerList[];
  data?: any[];
  actions?: actionList[];
  sendExtraProp?: string;
  actionTrigger?: (
    id: number,
    actionName: string,
    sendExtraProp?: string
  ) => void;
  groupActions?: groupActionList[];
  groupActionTrigger?: (list: number[], actionName: string) => void;
  pagination?: {
    count: number;
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions?: (
      | number
      | {
          value: number;
          label: string;
        }
    )[];
    onRowsPerPageChange?: (rowsPerPAge: number) => void;
    onPageChange?: (page: number) => void;
  };
};

export type goupActionReturnModel = {
  id: number;
  [key: string]: any;
};
