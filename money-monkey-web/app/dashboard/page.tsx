
import ExpenseList from "@/components/ExpenseList";
import { getExpenses } from "@/lib/db/queries";
import { UserSettingsContext } from "@/lib/userSettings";
import { useContext } from "react";

export default async function DashboardPage() {
  var userSettings = useContext(UserSettingsContext);
  var expenses = await getExpenses(userSettings.profileId);

  return (
    <div className="w-full h-full">
      <ExpenseList expenses={expenses} />
    </div>
  );
}
