import * as Yup from "yup";
export const NewExpenseSchema: Yup.ObjectSchema<NewExpense> = Yup.object({
  name: Yup.string()
    .required("Required!")
    .min(1, "Too short!")
    .max(50, "Too long!"),
  amount_cents: Yup.number()
    .required("Required!")
    .min(1, "Enter at least $0.01!"),
  date: Yup.date().required("Required!"),
  category_id: Yup.number()
    .required("Required!")
    .min(1, "Must select something"),
});
