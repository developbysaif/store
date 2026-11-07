"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { formatPrice, getRawPriceInCurrency } from "@/lib/currency";

const CurrencyContext = createContext(undefined);

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState("PKR");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("store_currency");
      if (saved && ["PKR", "USD", "EUR", "GBP"].includes(saved)) {
        setCurrencyState(saved);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const setCurrency = (c) => {
    setCurrencyState(c);
    if (typeof window !== "undefined") {
      localStorage.setItem("store_currency", c);
    }
  };

  const format = (amountPKR, amountUSD) => {
    return formatPrice(amountPKR, amountUSD, currency);
  };

  const getRawPrice = (amountPKR, amountUSD) => {
    return getRawPriceInCurrency(amountPKR, amountUSD, currency);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        format,
        getRawPrice,
        isPakistanMarket: currency === "PKR",
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
