const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatCurrency(value) {
  const amount = Number(value);
  return usdFormatter.format(Number.isFinite(amount) ? amount : 0);
}
