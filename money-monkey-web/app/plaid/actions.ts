"use server";

import { createPlaidAccounts, syncPlaidTransactions } from "@/lib/db/queries";
import { InsertPlaidTransaction, SelectPlaidAccount } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import {
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  Products,
  Transaction,
} from "plaid";

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

export async function getLinkToken(): Promise<string> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Error getting user");
    }

    const response = await client.linkTokenCreate({
      user: { client_user_id: user.id },
      client_name: "Money Monkey",
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      // webhook: "https://saving-supreme-grackle.ngrok-free.app/api/plaid/webhook",
      language: "en",
    });

    return response.data.link_token;
  } catch (error) {
    console.log(error);
    return "";
  }
}

export async function exchangeToken(public_token: string): Promise<void> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Error getting user");
    }

    const exchangeResponse = await client.itemPublicTokenExchange({
      public_token,
    });

    const accountsResponse = await client.accountsGet({
      access_token: exchangeResponse.data.access_token,
    });

    await createPlaidAccounts(
      accountsResponse.data.accounts.map((a) => ({
        profile_id: user.id,
        account_id: a.account_id,
        access_token: exchangeResponse.data.access_token,
        cursor: null,
        name: a.name,
        mask: a.mask,
        type: a.subtype ?? a.type,
      }))
    );
  } catch (error) {
    console.error("Error exchanging public token:", error);
  }
}

export async function getTransactions(
  account: SelectPlaidAccount
): Promise<void> {
  console.log("Getting transactions for access token:", account.access_token);

  try {
    const convertTransaction = createTransactionConverter(
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
