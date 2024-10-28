import { getCategorySums, getExpenses } from "@lib/api";
import CategoryList from "@ui/CategoryList";
import ExpenseList from "@ui/ExpenseList";
import MainSpendDisplay from "@ui/MainSpendDisplay";
import NewExpenseButton from "@ui/NewExpenseButton";

export default async function HomePage() {
  let sums: CategorySum[] = [];
  let expenses: Expense[] = [];

  try {
    const date = new Date();
    sums = await getCategorySums(date.getMonth() + 1, date.getFullYear());
  } catch (e) {
    return <div>Could not fetch category sums: {(e as any).message}</div>;
  }

  try {
    expenses = await getExpenses();
  } catch (e) {
    return <>Could not fetch expenses: {(e as any).message}</>;
  }

  return (
    <div className="flex w-screen flex-col md:p-6 items-center justify-start">
      <div className="overflow-hidden flex flex-col md:flex-row gap-12 pt-6 md:pb-6 md:pt-0 border-gray-300 max-w-7xl mx-auto">
        <MainSpendDisplay sums={sums} />
        <CategoryList sums={sums} />
        <NewExpenseButton className="absolute right-0 pr-6" />
      </div>
      <div className="w-full md:w-2/3 overflow-hidden px-3">
        <ExpenseList expenses={expenses} />
      </div>
    </div>
  );
}
