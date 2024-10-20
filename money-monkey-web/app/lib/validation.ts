import * as Yup from "yup";

export const NewExpenseSchema: Yup.ObjectSchema<NewExpense> = Yup.object({
  name: Yup.string()
    .required("Required!")
    .min(1, "Too short!")
    .max(50, "Too long!"),
  amount: Yup.string()
    .required("Required!")
    .matches(/^\d+(\.\d{1,2})?$/, "Must be a valid amount with up to 2 decimal places")
    .test("is-greater-than-minimum", "Enter at least $0.01!", value => Number.parseFloat(value || "0") > 0.01),
  date: Yup.date().required("Required!"),
  category_id: Yup.number()
    .required("Required!")
    .min(0, "Must select something"),
});
