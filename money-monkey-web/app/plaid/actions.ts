"use server";

import { syncPlaidTransactions } from "@/lib/db/queries";
import { InsertPlaidTransaction, SelectPlaidAccount } from "@/lib/db/schema";
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

export async function getLinkToken(userId: string): Promise<string> {
  try {
    const response = await fetch(
      "https://saving-supreme-grackle.ngrok-free.app/api/plaid/create-link-token",
      {
        cache: "no-store",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ client_user_id: userId }),
      }
    );
    const json = await response.json();
    return json.link_token;
  } catch (error) {
    console.error("Error generating link token:", error);
    throw error;
  }
}

export async function exchangeToken(
  user_id: string,
  public_token: string
): Promise<void> {
  try {
    const response = await fetch(
      "https://saving-supreme-grackle.ngrok-free.app/api/plaid/exchange-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          public_token,
        }),
      }
    );

    if (response.status !== 201) {
      throw new Error("Error exchanging public token");
    }
  } catch (error) {
    console.error("Error exchanging public token:", error);
  }
}

export async function getTransactions(
  account: SelectPlaidAccount
): Promise<void> {
  console.log("Getting transactions for access token:", account.access_token);

  try {
    const convertTransaction = await createTransactionConverter(
      account.profile_id,
      account.id
    );

    const added: InsertPlaidTransaction[] = [];
    const modified: InsertPlaidTransaction[] = [];
    const removed: string[] = [];
    let new_cursor = account.cursor;
    let keepGoing = false;

    do {
      const response = await client.transactionsSync({
        access_token: account.access_token,
        cursor: new_cursor ?? undefined,
      });
      added.push(
        ...response.data.added
          .filter((t) => t.account_id === account.account_id)
          .map(convertTransaction)
      );
      modified.push(
        ...response.data.modified
          .filter((t) => t.account_id === account.account_id)
          .map(convertTransaction)
      );
      removed.push(
        ...response.data.removed
          .filter((t) => t.account_id === account.account_id)
          .map((t) => t.transaction_id)
      );

      new_cursor = response.data.next_cursor;
      keepGoing = response.data.has_more;
    } while (keepGoing);

    await syncPlaidTransactions(
      account.id,
      added,
      modified,
      removed,
      new_cursor
    );
  } catch (error) {
    console.error("Error syncing transactions:", error);
  }
}

function createTransactionConverter(
  userId: string,
  plaid_account_id: number
): (t: Transaction) => InsertPlaidTransaction {
  return (t) => ({
    profile_id: userId,
    plaid_account_id: plaid_account_id,
    transaction_id: t.transaction_id,
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
  });
}
