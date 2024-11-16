export const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatMoney(amountCents: number | string): string {
  if (typeof amountCents === "string") {
    amountCents = Number.parseInt(amountCents);
  }
  return usdFormatter.format(amountCents / 100);
}

export function moneyToCents(amount: string): number {
  return Math.round(Number.parseFloat(amount.replace("$", "")) * 100);
}
