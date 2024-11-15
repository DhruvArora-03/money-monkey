interface Expense {
  id: number;
  name: string;
  date: Date;
  amount_cents: number;
  category_id: number;
}

interface ExpenseEdit {
  name: string;
  date: string;
  amount: string;
  category_id: number;
}

interface CategorySum {
  category_id: number;
  total_cents: number;
}

interface Category {
  id: number;
  name: string;
  color: string;
}

type NewCategory = Omit<Category, "id">;

interface HomePageStats {
  totalCents: number;
  catagories: Record<string, number>;
}

interface UserSettings {
  categories: Map<number, Category>;
}
