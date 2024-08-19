import { getCategorySums, getYearCategorySums } from "@lib/api";
import CategoryList from "@ui/CategoryList";
import ExpenseList from "@ui/ExpenseList";
import MainSpendDisplay from "@ui/MainSpendDisplay";

export default async function HomePage() {
  try {
    var sums = await getCategorySums(new Date().getMonth() + 1, new Date().getFullYear());
  } catch (e) {
    return <div>Could not fetch category sums: {(e as any).message}</div>;
  }

   return (
    <div className="flex w-screen flex-col sm:flex-row py-6 sm:px-6 items-center sm:items-start gap-8">
      <div className="basis-full w-64 overflow-hidden sm:basis-80 ">
        <MainSpendDisplay sums={sums} />
        <CategoryList sums={sums} />
      </div>
      <div className="w-full px-3">
        <ExpenseList />
      </div>
    </div>
  );
}
