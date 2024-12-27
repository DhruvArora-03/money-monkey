"use server";

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
  user_id: string,
  plaid_account_id: number,
  access_token: string,
  account_id: string,
  cursor: string | null
): Promise<void> {
  console.log("Getting transactions for access token:", access_token);

  try {
    const response = await fetch(
      "https://saving-supreme-grackle.ngrok-free.app/api/plaid/sync-transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          plaid_account_id,
          access_token,
          account_id,
          cursor,
        }),
      }
    );

    const json = await response.json();
    console.log("json:", json);
  } catch (error) {
    console.error("Error syncing transactions:", error);
  }
}
