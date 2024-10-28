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
