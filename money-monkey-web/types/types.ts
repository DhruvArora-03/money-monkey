interface ExpenseEdit {
  name: string;
  date: Date;
  amount: number;
  categoryId: number | null;
  isIncome: boolean;
}

interface CategorySum {
  category_id: number;
  total_cents: number;
}

interface HomePageStats {
  totalCents: number;
  categories: Record<string, number>;
}

interface PlaidAccountResponse {
  id: string;
  name: string;
  mask: string | null;
  type: string;
}
