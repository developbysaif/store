"use client";

import React from "react";
import { CurrencyProvider } from "./CurrencyContext";
import { WishlistProvider } from "./WishlistContext";
import { CartProvider } from "./CartContext";

export function Providers({ children }) {
  return (
    <CurrencyProvider>
      <WishlistProvider>
        <CartProvider>{children}</CartProvider>
      </WishlistProvider>
    </CurrencyProvider>
  );
}
