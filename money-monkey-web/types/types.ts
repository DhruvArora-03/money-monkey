interface ExpenseEdit {
  name: string;
  date: string;
  amount: number;
  category_id: number | null;
}

interface CategorySum {
  category_id: number;
  total_cents: number;
}

interface HomePageStats {
  totalCents: number;
  catagories: Record<string, number>;
}
