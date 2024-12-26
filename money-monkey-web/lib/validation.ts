import * as Yup from "yup";

export const unformattedMoneyRegex = /^\d+(?:\.\d{0,2})?$/;
export const formattedMoneyRegex = /^\$((\d{1,3}(,\d{3})*|\d+))(\.\d{1,2})?$/;

export const ExpenseSchema: Yup.ObjectSchema<ExpenseEdit> = Yup.object({
  name: Yup.string()
    .required("Required!")
    .min(1, "Too short!")
    .max(50, "Too long!"),
  amount: Yup.number()
    .required("Required!")
    .min(0.01, "Invalid amount!"),
  date: Yup.date().required("Required!"),
  categoryId: Yup.number()
    .required("Required!")
    .when("isIncome", (isIncome, schema) => {
      return isIncome ? schema.notRequired() : schema;
    })
    .min(0, "Must select a category!"),
  isIncome: Yup.boolean().required("Required!"),
});
