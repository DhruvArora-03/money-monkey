interface Expense {
  id: string;
  name: string;
  date: Date;
  amount: string;
  category_name: string;
}

interface NewExpense {
  name: string;
  date: Date;
  amount: string;
  category_id: number;
}

interface CategorySum {
  category_id: number;
  name: string;
  total_cents: number;
  color: string;
}

interface Category {
  id: number;
  name: string;
  color: string;
}
