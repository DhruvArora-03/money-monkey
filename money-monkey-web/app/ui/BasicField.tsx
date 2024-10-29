import { useField } from "formik";
import { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";

export interface BasicFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

export default function BasicField(props: BasicFieldProps) {
  const [field, meta] = useField(props.name);
  return (
    <>
      <label htmlFor={field.name}>{props.label}</label>
      <input
        id={field.name}
        {...field}
        {...props}
        autoComplete="off"
        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-invalid={meta.touched && meta.error ? "true" : "false"}
      />
      {meta.touched && meta.error && (
        <p
          className="text-red-500 text-sm"
          role="alert"
        >
          {meta.error}
        </p>
      )}
    </>
  );
}
