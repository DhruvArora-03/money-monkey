import { Field, useField } from "formik";

export default function BasicField(props: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
}) {
  const [field, meta] = useField(props.name);
  return (
    <div>
      <label className="capitalize" htmlFor={field.name}>
        {props.label}
      </label>
      <Field id={field.name} {...field} {...props} autoComplete="off" />
      {meta.touched && <p className="text-red-500">{meta.error}</p>}
    </div>
  );
}
