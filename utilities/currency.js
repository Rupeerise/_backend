export const currencyArray = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "INR", symbol: "₹" },
  { code: "AUD", symbol: "$" },
  { code: "CAD", symbol: "$" },
  { code: "SGD", symbol: "$" },
  { code: "JPY", symbol: "¥" },
  { code: "CNY", symbol: "¥" },
  { code: "PKR", symbol: "₨" },
  { code: "NZD", symbol: "$" },
  { code: "RUB", symbol: "₽" },
];

export const getCurrencySymbol = (currencyCode) => {
  const currency = currencyArray.find((c) => c.code === currencyCode);
  return currency ? currency.symbol : currencyCode;
};