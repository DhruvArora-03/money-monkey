"use client";

import { getTransactions } from "@/app/plaid/actions";
import { Button } from "@/components/ui/button";
import { SelectPlaidAccount } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/client";

export default function LoadTransactionsButton(account: SelectPlaidAccount) {
  const supabase = createClient();

  return (
    <Button
      onClick={() => {
        supabase.auth.getUser().then(res => getTransactions(res.data.user!.id, account.id, account.access_token, account.account_id, account.cursor));
      }}
    >
      Load transactions
    </Button>
  );
}
