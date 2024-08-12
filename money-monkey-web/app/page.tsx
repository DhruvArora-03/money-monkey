import ExpenseList from "@ui/ExpenseList";
import MainSpendDisplay from "@ui/MainSpendDisplay";

export default function HomePage() {
   return (
    <div className="flex w-screen flex-col sm:flex-row py-6 sm:px-6 items-center sm:items-start gap-8">
      <div className="basis-full w-64 overflow-hidden sm:basis-80 ">
        <MainSpendDisplay />
      </div>
      <div className="w-full px-3">
        <ExpenseList />
      </div>
    </div>
  );
}
