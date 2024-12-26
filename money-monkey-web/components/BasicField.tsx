import { useField } from "formik";
import { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";

export interface BasicFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

export default function BasicField(props: BasicFieldProps) {
  const [field, meta, helper] = useField(props.name);
  return (
    <div>
      {props.label && <label htmlFor={field.name}>{props.label}</label>}
      <input
        id={field.name}
        {...field}
        {...props}
        onBlur={(e) => {
          if (props.type === "number" && typeof field.value === "number") {
            helper.setValue(field.value.toFixed(2).toString());
          }
          field.onBlur(e);
        }}
        autoComplete="off"
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-invalid={meta.touched && meta.error ? "true" : "false"}
      />
      {meta.touched && meta.error && (
        <p className="text-red-500 text-sm" role="alert">
          {meta.error}
        </p>
      )}
    </div>
  );
}
