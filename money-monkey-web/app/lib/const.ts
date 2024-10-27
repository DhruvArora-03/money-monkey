export type Month =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";

export type FilterMonth = "All Months" | Month;

export const MONTHS: FilterMonth[] = [
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
