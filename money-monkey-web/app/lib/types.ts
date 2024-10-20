export const ExpenseTypes = [
  "Housing",
  "Food",
  "Groceries",
  "Entertainment",
  "Clothes",
  "Necessities",
  "Miscellaneous",
] as const;

export type ExpenseTypes = (typeof ExpenseTypes)[number];

export const ExpenseTypeOptions = ["", ...ExpenseTypes];

export type ExpenseItem = {
  id: string;
  name: string;
  date: Date;
  amountCents: number;
  type: ExpenseTypes;
};

export type HomePageStats = {
  totalCents: number;
  catagories: Record<ExpenseTypes, number>;
};

export const MONTHS = [
  "All Months",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const START_YEAR = 2024;
export const YEARS: number[] = new Array(
  new Date().getFullYear() - START_YEAR + 1
)
  .fill(START_YEAR)
  .map((x, i) => x + i);
