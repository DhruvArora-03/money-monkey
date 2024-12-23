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
    .min(0.01, "Amount must be at least $0.01!"),
  date: Yup.string()
    .required("Required!")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format!")
    .test("is-valid-date", "Invalid date!", (value) => {
      if (!value) return false;
      const date = new Date(value);
      return date instanceof Date && !Number.isNaN(date.getTime());
    }),
  category_id: Yup.number()
    .required("Required!")
    .nullable()
    .min(0, "Must select a category!"),
});
