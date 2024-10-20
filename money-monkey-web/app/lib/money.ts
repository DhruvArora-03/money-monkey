const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatMoney(amount_cents: number): string {
  return usdFormatter.format(amount_cents / 100);
}
