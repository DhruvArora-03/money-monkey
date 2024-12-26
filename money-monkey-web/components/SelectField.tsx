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

interface SelectFieldProps {
  name: string;
  label: string;
  placeholder: string;
  disabled?: boolean;
}

export default function SelectField(props: SelectFieldProps) {
  const [field, meta, helper] = useField(props.name);
  const { categories } = useContext(UserSettingsContext);

  return (
    <div className="w-full">
      <Select
        value={field.value ? `${field.value}` : undefined}
        onValueChange={(value) => {
          helper.setValue(Number.parseInt(value));
        }}
        disabled={props.disabled}
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
