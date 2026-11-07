export const CURRENCY_SYMBOLS = {
  PKR: "₨",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export const EXCHANGE_RATES = {
  USD: 1,
  PKR: 278.5,
  EUR: 0.92,
  GBP: 0.78,
};

/**
 * Format a price based on selected currency.
 */
export function formatPrice(amountPKR, amountUSD, currency = "PKR") {
  if (currency === "PKR") {
    return `₨ ${Math.round(amountPKR).toLocaleString("en-PK")}`;
  }

  const rate = EXCHANGE_RATES[currency] || 1;
  const converted = amountUSD * rate;

  const symbol = CURRENCY_SYMBOLS[currency] || "$";
  return `${symbol}${converted.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function getRawPriceInCurrency(amountPKR, amountUSD, currency) {
  if (currency === "PKR") {
    return Math.round(amountPKR);
  }
  const rate = EXCHANGE_RATES[currency] || 1;
  return Number((amountUSD * rate).toFixed(2));
}
