import { usdFormatter } from "@lib/money";
import { unformattedMoneyRegex } from "@lib/validation";
import { useField } from "formik";

export default function MoneyField(props: { name: string; label: string }) {
  const [field, meta] = useField(props.name);

  return (
    <div>
      <label className="capitalize" htmlFor={field.name}>
        {props.label}
      </label>
      <input
        {...field}
        {...props}
        id={field.name}
        autoComplete="off"
        onFocus={() => {
          field.onChange({
            target: {
              id: field.name,
              value: field.value.replace(/[^0-9.]/g, "").replace(".00", ""), // remove all non-numeric characters
            },
          });
        }}
        onBlur={(e) => {
          if (e.target.value.match(unformattedMoneyRegex)) {
            e.target.value = usdFormatter.format(parseFloat(e.target.value));
            field.onChange(e);
          }
          field.onBlur(e);
        }}
        onChange={(e) => {
          e.target.value = e.target.value.replace(/[^0-9.]/g, ""); // remove all non-numeric characters
          if (e.target.value !== field.value) {
            field.onChange(e);
          }
        }}
        placeholder="$0.00"
      />
      {meta.touched && (meta.value satisfies string).startsWith("$") && (
        <p className="text-red-500 text-pretty truncate w-full">{meta.error}</p>
      )}
    </div>
  );
}
