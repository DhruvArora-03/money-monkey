interface Expense {
  id: string;
  name: string;
  date: Date;
  amount_cents: number;
  category_name: string;
}

interface CategorySum {
  category_id: number;
  name: string;
  total_cents: number;
  color: string;
}