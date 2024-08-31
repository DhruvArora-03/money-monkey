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
    <div className="flex w-screen flex-row md:flex-col md:py-6 md:px-6 items-start justify-center md:items-center md:justify-start gap-4">
      <div className="basis-full overflow-hidden sm:basis-80 flex flex-col md:flex-row gap-8 pt-6 md:p-6 border-gray-300">
        <MainSpendDisplay sums={sums} />
        <CategoryList sums={sums} />
      </div>
      <div className="w-fit px-3">
        <ExpenseList />
      </div>
    </div>
  );
}
