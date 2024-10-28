import * as Yup from "yup";

export const unformattedMoneyRegex = /^\d+(?:\.\d{0,2})?$/;
export const formattedMoneyRegex = /^\$((\d{1,3}(,\d{3})*|\d+))(\.\d{1,2})?$/;

export const NewExpenseSchema: Yup.ObjectSchema<NewExpense> = Yup.object({
  name: Yup.string()
    .required("Required!")
    .min(1, "Too short!")
    .max(50, "Too long!"),
  amount: Yup.string()
    .required("Required!")
    .matches(/^\$((\d{1,3}(,\d{3})*|\d+))(\.\d{1,2})?$/, "Invalid format!")
    .test("is-at-least-1-cent", "Amount must be at least $0.01!", (value) => {
      const numericValue = value ? Number.parseFloat(value.slice(1)) : 0;
      return !Number.isNaN(numericValue) && numericValue >= 0.01;
    }),
  date: Yup.date().required("Required!"),
  category_id: Yup.number()
    .required("Required!")
    .min(0, "Must select a category!"),
});
