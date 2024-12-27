import { db } from "@/lib/db";
import {
  syncPlaidTransactions,
} from "@/lib/db/queries";
import { usdFormatter } from "@/lib/money";
import { NextRequest, NextResponse } from "next/server";
import { Configuration, PlaidApi, PlaidEnvironments, Transaction } from "plaid";

const plaidConfig = new Configuration({
  basePath:
    PlaidEnvironments[process.env.PLAID_ENV as keyof typeof PlaidEnvironments],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID || "",
      "PLAID-SECRET": process.env.PLAID_SECRET || "",
    },
  },
});
const client = new PlaidApi(plaidConfig);
export async function POST(req: NextRequest) {
  const { user_id, plaid_account_id, access_token, account_id, cursor } =
    await req.json();
  try {
    const added: PlaidTransactionResponse[] = [];
    const modified: PlaidTransactionResponse[] = [];
    const removed: string[] = [];
    let old_cursor = cursor;
    let new_cursor = cursor;
    let keepGoing = false;

    do {
      const response = await client.transactionsSync({
        access_token,
        cursor: new_cursor,
      });
      added.push(
        ...response.data.added
          .filter((t) => t.account_id === account_id)
          .map(convertTransaction)
      );
      modified.push(
        ...response.data.modified
          .filter((t) => t.account_id === account_id)
          .map(convertTransaction)
      );
      removed.push(
        ...response.data.removed
          .filter((t) => t.account_id === account_id)
          .map((t) => t.transaction_id)
      );

      new_cursor = response.data.next_cursor;
      old_cursor = cursor;
      keepGoing = response.data.has_more;
    } while (keepGoing);

    await syncPlaidTransactions(
      user_id,
      plaid_account_id,
      added,
      modified,
      removed,
      new_cursor
    );

    return NextResponse.json(null, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error exchanging public token" },
      { status: 500 }
    );
  }
}

function convertTransaction(t: Transaction): PlaidTransactionResponse {
  return {
    id: t.transaction_id,
    name: t.name,
    merchant_name: t.merchant_name ?? null,
    amount_cents: Math.round(t.amount * 100),
    date: new Date(
      t.authorized_date ?? t.authorized_datetime?.substring(10) ?? t.date
    ),
    suggested_category:
      t.personal_finance_category?.detailed ??
      t.personal_finance_category?.primary ??
      null,
    pending: t.pending,
  };
}
