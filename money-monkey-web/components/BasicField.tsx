import { useField } from "formik";
import { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";

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
      {props.label && <Label htmlFor={field.name}>{props.label}</Label>}
      <Input
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
