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

interface PlaidTransactionResponse {
  id: string;
  name: string;
  merchant_name: string | null;
  amount_cents: number;
  date: Date;
  suggested_category: string | null;
  pending: boolean;
}
