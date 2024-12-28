"use client";

import { getTransactions } from "@/app/plaid/actions";
import { Button } from "@/components/ui/button";
import { SelectPlaidAccount } from "@/lib/db/schema";

export default function LoadTransactionsButton(account: SelectPlaidAccount) {
  return (
    <Button
      onClick={() => {
        getTransactions(account);
      }}
    >
      Load transactions
    </Button>
  );
}
