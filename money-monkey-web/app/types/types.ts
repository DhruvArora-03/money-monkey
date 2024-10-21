/**
 * Represents an expense.
 *
 * @interface Expense
 * @property {string} id - The unique identifier for the expense.
 * @property {string} name - The name or description of the expense.
 * @property {Date} date - The date when the expense occurred.
 * @property {string} amount - The amount of the expense as a string.
 * @property {string} category_name - The name of the category the expense belongs to.
 */
interface Expense {
  id: string;
  name: string;
  date: Date;
  amount: string;
  category_name: string;
}

/**
 * Represents a new expense to be added.
 *
 * @interface NewExpense
 * @property {string} name - The name or description of the expense.
 * @property {Date} date - The date when the expense occurred.
 * @property {string} amount - The amount of the expense as a string.
 * @property {number} category_id - The ID of the category the expense belongs to.
 */
interface NewExpense {
  name: string;
  date: Date;
  amount: string;
  category_id: number;
}

/**
 * Represents the total sum of expenses for a category.
 *
 * @interface CategorySum
 * @property {number} category_id - The unique identifier for the category.
 * @property {string} name - The name of the category.
 * @property {number} total_cents - The total amount in cents for the category.
 * @property {string} color - The color associated with the category.
 */
interface CategorySum {
  category_id: number;
  name: string;
  total_cents: number;
  color: string;
}

/**
 * Represents an expense category.
 *
 * @interface Category
 * @property {number} id - The unique identifier for the category.
 * @property {string} name - The name of the category.
 * @property {string} color - The color associated with the category.
 */
interface Category {
  id: number;
  name: string;
  color: string;
}
