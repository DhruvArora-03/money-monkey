import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createUser(userId: string) {
  const res = await fetch(`${process.env.API_BASE}/users/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  if (res.status === 201) {
    clerkClient().users.updateUserMetadata(userId, {
      publicMetadata: { onboardingComplete: true },
    });
  }
}

export async function getExpenses(): Promise<Expense[]> {
  var userId = auth().userId
  if (userId == null) {
    throw new Error("could not find userId")
  }

  const res = await fetch(`${process.env.API_BASE}/expenses`, {
    headers: { "X-User-Id": userId }
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}