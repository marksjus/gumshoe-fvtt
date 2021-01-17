/** @jsx jsx */
import { CSSObject, jsx } from "@emotion/react";
import React from "react";
import { AsyncTextInput } from "./AsyncTextInput";

type FormFieldProps = {
  label: string,
  value: undefined|string,
  onChange: (newValue: string) => void,
  css?: CSSObject,
};

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  css,
}) => {
  return (
    <label
      css={{
        display: "flex",
        flexDirection: "row",
        marginBottom: "0.5em",
        ...css,
      }}
    >
    {label}
    <AsyncTextInput
      css={{
        flex: 1,
        marginLeft: "0.5em",
      }}
      value={value}
      onChange={onChange}
    />
  </label>);
};
