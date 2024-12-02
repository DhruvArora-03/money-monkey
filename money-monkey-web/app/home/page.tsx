import ExpenseList from "@/components/ExpenseList";
import NewExpenseButton from "@/components/NewExpenseButton";
import { CategoryPieChart } from "@/components/CategoryPieChart";

export default async function HomePage() {
  return (
    <div className="flex w-screen flex-col md:p-6 items-center justify-start">
      <NewExpenseButton className="absolute right-0 p-3 md:pt-0 md:pr-6" />
      <div className="overflow-hidden w-full pt-16 md:pb-6 md:pt-0 border-gray-300 max-w-7xl mx-auto">
        <CategoryPieChart className="mx-auto min-h-fit" />
      </div>
      <div className="w-full md:w-2/3 overflow-hidden px-6">
        <ExpenseList />
      </div>
    </div>
  );
}
