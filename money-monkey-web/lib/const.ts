export const DEFAULT_CATEGORIES: NewCategory[] = [
  { name: "Other", color: "#404040" },
  { name: "Housing", color: "#FF0000" },
  { name: "Groceries", color: "#00FF00" },
  { name: "Food", color: "#0000FF" },
  { name: "Transportation", color: "#FFFF00" },
  { name: "Entertainment", color: "#00FFFF" },
  { name: "Necessities", color: "#FF00FF" },
  { name: "Clothes", color: "#E0E0E0" },
];

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
export const YEARS: number[] = (() => {
  const currentYear = new Date().getFullYear();
  if (currentYear < START_YEAR) {
    console.warn(
      `Current year ${currentYear} is less than START_YEAR ${START_YEAR}`
    );
    return [currentYear];
  }

  return Array.from(
    { length: currentYear - START_YEAR + 1 },
    (_, i) => START_YEAR + i
  );
})();
