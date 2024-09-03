import { getCategorySums, getYearCategorySums } from "@lib/api";
import CategoryList from "@ui/CategoryList";
import ExpenseList from "@ui/ExpenseList";
import MainSpendDisplay from "@ui/MainSpendDisplay";

export default async function HomePage() {
  try {
    var date = new Date();
    var sums = await getCategorySums(date.getMonth() + 1, date.getFullYear());
  } catch (e) {
    return <div>Could not fetch category sums: {(e as any).message}</div>;
  }

  return (
    <div className="flex w-screen flex-col md:p-6 items-center justify-start">
      <div className="overflow-hidden flex flex-col md:flex-row gap-8 pt-6 md:p-6 border-gray-300">
        <MainSpendDisplay sums={sums} />
        <CategoryList sums={sums} />
      </div>
      <div className="lg:w-[900px] overflow-hidden px-3">
        <ExpenseList />
      </div>
    </div>
  );
}
