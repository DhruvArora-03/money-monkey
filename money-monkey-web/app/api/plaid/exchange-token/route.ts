import { createPlaidAccounts } from "@/lib/db/queries";
import { NextRequest, NextResponse } from "next/server";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

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
  const { user_id, public_token } = await req.json();
  try {
    const exchangeResponse = await client.itemPublicTokenExchange({
      public_token,
    });
    console.log(`Status: ${exchangeResponse.status}`);
    if (exchangeResponse.status !== 200) {
      throw new Error("Error exchanging public token");
    }

    const accountsResponse = await client.accountsGet({
      access_token: exchangeResponse.data.access_token,
    });

    await createPlaidAccounts(
      user_id,
      exchangeResponse.data.access_token,
      accountsResponse.data.accounts.map((a) => ({
        id: a.account_id,
        name: a.name,
        mask: a.mask,
        type: a.subtype ?? a.type,
      }))
    );

    return NextResponse.json(null, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error exchanging public token" },
      { status: 500 }
    );
  }
}
