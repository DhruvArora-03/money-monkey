import { CategoryPieChart } from "@/components/CategoryPieChart";
import ExpenseList from "@/components/ExpenseList";
import LoadTransactionsButton from "@/components/LoadTransactionsButton";
import NewExpenseButton from "@/components/NewExpenseButton";
import PlaidLinkButton from "@/components/PlaidLinkButton";
import { db } from "@/lib/db";
import { dbPlaidAccounts } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";

export default async function HomePage() {
  return (
    <div className="flex w-screen flex-col md:p-6 items-center justify-start">
      <NewExpenseButton className="absolute right-0 p-3 md:pt-0 md:pr-6" />
      <PlaidLinkButton className="absolute left-0 p-3 md:pt-0 md:pr-6" />
      <div className="overflow-hidden w-full pt-10 md:pb-6 md:pt-0 border-gray-300 max-w-7xl mx-auto">
        {/* <CategoryPieChart className="mx-auto min-h-fit" /> */}
      </div>
      <PlaidAccounts />
      <div className="w-full md:w-2/3 overflow-hidden px-6">
        <ExpenseList />
      </div>
    </div>
  );
}

const PlaidAccounts = async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    console.error(error);
    return <div>Error loading user</div>;
  }

  const accounts = await db.query.dbPlaidAccounts.findMany({
    where: eq(dbPlaidAccounts.profile_id, user!.id),
  });

  return (
    <div className="w-full md:w-2/3 overflow-hidden px-6">
      <br />
      Accounts:
      {accounts.map(a => (
        <div key={a.id}>
          <p>{a.id}</p>
          <p>{a.profile_id}</p>
          <p>{a.access_token}</p>
          <p>{a.cursor}</p>
        </div>
      ))}
    </div>
  );
}
