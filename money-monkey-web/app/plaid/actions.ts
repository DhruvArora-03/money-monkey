"use server";

import { createPlaidAccount } from "@/lib/db/queries";

export async function getLinkToken(userId: string): Promise<string> {
  try {
    const response = await fetch(
      "http://localhost:3000/api/plaid/create-link-token",
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

export async function exchangeToken(public_token: string): Promise<void> {
  try {
    const response = await fetch("http://localhost:3000/api/plaid/exchange-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        public_token,
      }),
    });

    const json = await response.json();
    console.log("Access Token:", json.access_token);

    await createPlaidAccount(json.access_token);
  } catch (error) {
    console.error("Error exchanging public token:", error);
  }
}
