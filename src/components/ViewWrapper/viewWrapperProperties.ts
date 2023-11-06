import React, { ReactNode } from "react";

export type viewWrapperProperties = {
  children?: React.ReactNode;
  title?: string;
  outsideContent?: ReactNode;
  loading?: boolean;
  showMandatoryMessage?: boolean;
  locals?: local[];
  showAlert?: boolean;
  closeAlert?: () => void;
  alerMessage?: string;
};

export type applicationBarProperties = {
  open: boolean;
};

export type local = {
  text: string;
  href: string;
  iconName: string;
};
