import { useField } from "formik";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface CheckboxFieldProps {
  name: string;
  label: string;
}

export default function SwitchField(props: CheckboxFieldProps) {
  const [field, meta, helper] = useField(props.name);

  return (
    <div>
      <div className="flex items-center gap-2">
        <Switch
          checked={field.value}
          onCheckedChange={(checked) => {
            helper.setValue(checked);
          }}
        />
        <Label htmlFor={field.name}>{props.label}</Label>
      </div>

      {meta.touched && meta.error && (
        <p className="text-red-500 text-sm" role="alert">
          {meta.error}
        </p>
      )}
    </div>
  );
}
