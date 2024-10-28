import { useField } from "formik";
import { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";

interface BasicFieldProps extends InputHTMLAttributes<HTMLInputElement> {
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
    <div>
      <label className="capitalize" htmlFor={field.name}>
        {props.label}
      </label>
      <input id={field.name} {...field} {...props} autoComplete="off" />
      {meta.touched && (
        <p className="text-red-500 text-pretty truncate w-full">{meta.error}</p>
      )}
    </div>
  );
}
