// import { auth, clerkClient } from "@clerk/nextjs/server";
// import { formatMoney } from "@lib/money";

// export async function createUser(userId: string) {
//   const res = await fetch(`${process.env.API_BASE}/users/create`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ userId }),
//   });

//   if (res.status === 201) {
//     clerkClient().users.updateUserMetadata(userId, {
//       publicMetadata: { onboardingComplete: true },
//     });
//   }
// }

// export async function getCategories(): Promise<Category[]> {
//   const userId = auth().userId;
//   if (userId == null) {
//     throw new Error("could not find userId");
//   }

//   const res = await fetch(`${process.env.API_BASE}/categories/`, {
//     headers: { "X-User-Id": userId },
//   });
//   if (!res.ok) {
//     throw new Error(await res.text());
//   }
//   return await res.json();
// }

// export async function getExpenses(): Promise<Expense[]> {
//   const userId = auth().userId;
//   if (userId == null) {
//     throw new Error("could not find userId");
//   }

//   const res = await fetch(`${process.env.API_BASE}/expenses/`, {
//     headers: { "X-User-Id": userId },
//   });
//   if (!res.ok) {
//     throw new Error(await res.text());
//   }
//   const expenses: any[] = await res.json();
//   return expenses.map(
//     ({ date, amount_cents, ...e }) =>
//       ({
//         ...e,
//         date: new Date(date),
//         amount: formatMoney(amount_cents),
//       } satisfies Expense)
//   );
// }

// export async function getYearCategorySums(
//   year: number
// ): Promise<CategorySum[]> {
//   return getCategorySums(0, year);
// }

// export async function getCategorySums(
//   month: number,
//   year: number
// ): Promise<CategorySum[]> {
//   const userId = auth().userId;
//   if (userId == null) {
//     throw new Error("could not find userId");
//   }

//   let url = `${process.env.API_BASE}/categories/sums?year=${year}`;
//   if (month != 0) {
//     url += `&month=${month}`;
//   }

//   const res = await fetch(url, {
//     headers: { "X-User-Id": userId },
//   });
//   if (!res.ok) {
//     throw new Error(await res.text());
//   }
//   return await res.json();
// }
