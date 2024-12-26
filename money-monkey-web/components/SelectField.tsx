import { Field, useField } from "formik";
import React, { useContext } from "react";
import { BasicFieldProps } from "@/components/BasicField";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { UserSettingsContext } from "@/lib/userSettings";

interface SelectFieldProps extends Omit<BasicFieldProps, "type" | "label" | "placeholder"> {
  options: React.ReactNode;
  label: string;
  placeholder: string;
}

export default function SelectField(props: SelectFieldProps) {
  const [field, meta, helper] = useField(props.name);
  const { categories } = useContext(UserSettingsContext);

  return (
    <div className={props.className}>
      <Select
        value={field.value}
        onValueChange={(value) => {
          helper.setValue(value);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={props.placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{props.label}</SelectLabel>
            {categories.map((c) => (
              <SelectItem key={c.id} value={"" + c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {meta.touched && meta.error && (
        <p className="text-red-500 text-sm" role="alert">
          {meta.error}
        </p>
      )}
    </div>
  );
}
