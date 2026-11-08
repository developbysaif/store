"use client";

import React, { createContext, useContext, useState } from "react";
import { storeConfig } from "@/lib/store-config";

const CartContext = createContext(undefined);

const VALID_COUPONS = {
  LUXURY10: 10,
  WELCOME15: 15,
  MAISON20: 20,
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("store_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const [coupon, setCoupon] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const savedCoupon = localStorage.getItem("store_coupon");
      return savedCoupon ? JSON.parse(savedCoupon) : null;
    } catch {
      return null;
    }
  });

  const saveItems = (updated) => {
    setItems(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("store_cart", JSON.stringify(updated));
    }
  };

  const addToCart = (product, variant, quantity = 1) => {
    const cartItemId = `${product.id}-${variant?.id || "default"}`;
    const unitPricePKR = product.basePricePKR + (variant?.priceAdjustment || 0);
    const unitPriceUSD = product.basePriceUSD;

    const existingIndex = items.findIndex((i) => i.id === cartItemId);
    let updated;

    if (existingIndex > -1) {
      updated = [...items];
      updated[existingIndex].quantity += quantity;
    } else {
      const newItem = {
        id: cartItemId,
        productId: product.id,
        product,
        selectedVariant: variant,
        quantity,
        unitPricePKR,
        unitPriceUSD,
      };
      updated = [newItem, ...items];
    }

    saveItems(updated);
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    const updated = items.filter((i) => i.id !== cartItemId);
    saveItems(updated);
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const updated = items.map((i) => (i.id === cartItemId ? { ...i, quantity: newQuantity } : i));
    saveItems(updated);
  };

  const clearCart = () => {
    saveItems([]);
    setCoupon(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("store_coupon");
    }
  };

  const applyCoupon = (code) => {
    const upper = code.trim().toUpperCase();
    if (VALID_COUPONS[upper]) {
      const couponObj = { code: upper, discountPercent: VALID_COUPONS[upper] };
      setCoupon(couponObj);
      if (typeof window !== "undefined") {
        localStorage.setItem("store_coupon", JSON.stringify(couponObj));
      }
      return { success: true, message: `Privilege code applied: -${VALID_COUPONS[upper]}%` };
    }
    return { success: false, message: "Invalid promotional code" };
  };

  const removeCoupon = () => {
    setCoupon(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("store_coupon");
    }
  };

  const itemsCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotalPKR = items.reduce((acc, curr) => acc + curr.unitPricePKR * curr.quantity, 0);
  const subtotalUSD = items.reduce((acc, curr) => acc + curr.unitPriceUSD * curr.quantity, 0);

  const progressToFreeShippingPKR = Math.min(
    100,
    Math.round((subtotalPKR / storeConfig.freeShippingThresholdPKR) * 100)
  );
  const amountNeededForFreeShippingPKR = Math.max(0, storeConfig.freeShippingThresholdPKR - subtotalPKR);
  const hasFreeShippingPKR = subtotalPKR >= storeConfig.freeShippingThresholdPKR;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemsCount,
        subtotalPKR,
        subtotalUSD,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        coupon,
        applyCoupon,
        removeCoupon,
        progressToFreeShippingPKR,
        amountNeededForFreeShippingPKR,
        hasFreeShippingPKR,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
