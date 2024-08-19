const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function formatMoney(amountCents: number): string {
  return usdFormatter.format(amountCents / 100)
}
