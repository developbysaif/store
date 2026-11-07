"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { storeConfig } from "@/lib/store-config";

const CartContext = createContext(undefined);

const VALID_COUPONS = {
  LUXURY10: 10,
  WELCOME15: 15,
  MAISON20: 20,
};

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("store_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedCoupon = localStorage.getItem("store_coupon");
      if (savedCoupon) {
        setCoupon(JSON.parse(savedCoupon));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

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

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const updated = items.map((i) => (i.id === cartItemId ? { ...i, quantity } : i));
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
    const cleanCode = (code || "").trim().toUpperCase();
    if (VALID_COUPONS[cleanCode]) {
      const newCoupon = { code: cleanCode, discountPercent: VALID_COUPONS[cleanCode] };
      setCoupon(newCoupon);
      if (typeof window !== "undefined") {
        localStorage.setItem("store_coupon", JSON.stringify(newCoupon));
      }
      return { success: true, message: `Promo code ${cleanCode} applied (-${newCoupon.discountPercent}%)` };
    }
    return { success: false, message: "Invalid promo code. Try LUXURY10 or WELCOME15" };
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

  const hasFreeShippingPKR = subtotalPKR >= storeConfig.freeShippingThresholdPKR;
  const hasFreeShippingUSD = subtotalUSD >= storeConfig.freeShippingThresholdUSD;

  const progressToFreeShippingPKR = Math.min(
    100,
    Math.round((subtotalPKR / storeConfig.freeShippingThresholdPKR) * 100)
  );

  const amountNeededForFreeShippingPKR = Math.max(
    0,
    storeConfig.freeShippingThresholdPKR - subtotalPKR
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartDrawerOpen,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
        itemsCount,
        subtotalPKR,
        subtotalUSD,
        coupon,
        applyCoupon,
        removeCoupon,
        hasFreeShippingPKR,
        hasFreeShippingUSD,
        progressToFreeShippingPKR,
        amountNeededForFreeShippingPKR,
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
