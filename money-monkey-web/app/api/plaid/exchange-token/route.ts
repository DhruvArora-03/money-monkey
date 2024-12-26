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
  const { public_token } = await req.json();
  try {
    const exchangeResponse = await client.itemPublicTokenExchange({ public_token });
    const { access_token } = exchangeResponse.data

    const accountsResponse = await client.accountsGet({ access_token });
    console.log(accountsResponse.data.accounts.map((a) => `${a.account_id} - ${a.name} - ${a.mask} - ${a.subtype ?? a.type}`));

    return NextResponse.json({
      access_token,
      accounts: accountsResponse.data.accounts.map(a => ({
        id: a.account_id,
        name: a.name,
        mask: a.mask,
        type: a.subtype ?? a.type,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error exchanging public token" },
      { status: 500 }
    );
  }
}
