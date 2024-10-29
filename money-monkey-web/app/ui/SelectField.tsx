import { Field, useField } from "formik";
import React from "react";
import { BasicFieldProps } from "@ui/BasicField";

interface SelectFieldProps extends Omit<BasicFieldProps, "type"> {
  options: React.ReactNode;
}

export default function SelectField(props: SelectFieldProps) {
  const [field, meta] = useField(props.name);
  return (
    <div>
      <label htmlFor={field.name}>{props.label}</label>
      <Field
        id={field.name}
        as="select"
        {...field}
        {...props}
        autoComplete="off"
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-invalid={meta.touched && meta.error ? "true" : "false"}
      >
        {props.options}
      </Field>
      {meta.touched && meta.error && (
        <p className="text-red-500 text-sm" role="alert">
          {meta.error}
        </p>
      )}
    </div>
  );
}
