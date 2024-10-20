import { getCategorySums } from "@lib/api";
import CategoryList from "@ui/CategoryList";
import ExpenseList from "@ui/ExpenseList";
import MainSpendDisplay from "@ui/MainSpendDisplay";
import NewExpenseModal from "@ui/NewExpenseModal";

export default async function HomePage() {
  try {
    var date = new Date();
    var sums = await getCategorySums(date.getMonth() + 1, date.getFullYear());
  } catch (e) {
    return <div>Could not fetch category sums: {(e as any).message}</div>;
  }

  return (
    <div className="flex w-screen flex-col md:p-6 items-center justify-start">
      <div className="overflow-hidden flex flex-col md:flex-row gap-12 pt-6 md:pb-6 md:pt-0 border-gray-300 max-w-7xl mx-auto">
        <MainSpendDisplay sums={sums} />
        <CategoryList sums={sums} />
        <NewExpenseModal className="absolute right-0 pr-6" categories={sums} />
      </div>
      <div className="w-full md:w-2/3 overflow-hidden px-3">
        <ExpenseList />
      </div>
    </div>
  );
}
