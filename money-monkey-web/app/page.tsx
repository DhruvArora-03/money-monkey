import ExpenseList from "@ui/ExpenseList";
import MainSpendDisplay from "@ui/MainSpendDisplay";

export default function HomePage() {
   return (
    <div className="flex flex-col sm:flex-row p-6">
      <div className="basis-full px-32 sm:basis-80 sm:px-0 ">
        <MainSpendDisplay />
      </div>
      <div>
        <ExpenseList />
      </div>
    </div>
  );
}
