import { FC } from "react";

const SpanError: FC<{ errorText?: string }> = ({ ...props }) => {
  return (
    <span style={{ fontSize: 12, color: "#F44336" }}>{props.errorText}</span>
  );
};

export default SpanError;
