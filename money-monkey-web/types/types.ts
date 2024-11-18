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

interface HomePageStats {
  totalCents: number;
  catagories: Record<string, number>;
}
