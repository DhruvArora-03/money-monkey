import { getLinkToken } from "@/lib/plaidActions";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import ExpenseList from "@/components/ExpenseList";
import LoadTransactionsButton from "@/components/LoadTransactionsButton";
import NewExpenseButton from "@/components/NewExpenseButton";
import PlaidLinkButton from "@/components/PlaidLinkButton";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { getPlaidAccounts, getPlaidTransactions } from "@/lib/db/queryActions";
import { formatMoney } from "@/lib/money";

export default async function HomePage() {
  const linkToken = await getLinkToken();

  return (
    <div className="flex w-screen flex-col md:p-6 items-center justify-start">
      <NewExpenseButton className="absolute right-0 m-3 md:mt-0 md:mr-6" />
      <PlaidLinkButton
        className="absolute left-0 m-3 md:mt-0 md:mr-6"
        linkToken={linkToken}
      />
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

  const accounts = await getPlaidAccounts(user!.id);
  const transactions = await getPlaidTransactions(user!.id);

  return (
    <div className="w-full md:w-2/3 overflow-hidden px-6">
      <br />
      Accounts:
      {accounts.map((a) => (
        <Card key={a.id}>
          <CardContent>
            <p>Id: {a.id}</p>
            <p>Account Id: {a.account_id}</p>
            <p className="text-blue-800">AccessToken: {a.access_token}</p>
            <p>Cursor: {a.cursor}</p>
            <p>Name: {a.name}</p>
            <p>Mask: {a.mask}</p>
            <p>Type: {a.type}</p>
            <LoadTransactionsButton {...a} />
            <ul>
              {transactions
                .filter((t) => t.plaid_account_id === a.id)
                .map((t) => (
                  <li key={t.transaction_id} className="p-4">
                    date: {t.date.getMonth()}/{t.date.getDate()}/
                    {t.date.getFullYear()}
                    <br />
                    name: {t.name}
                    <br />
                    merchant name:{t.merchant_name}
                    <br />
                    amount: {formatMoney(t.amount_cents)}
                    <br />
                    category: {t.suggested_category}
                    <br />
                    pending: {"" + t.pending}
                    <br />
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
