"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { PRODUCTS } from "@/lib/mock-data";

const WishlistContext = createContext(undefined);

export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("store_wishlist");
      if (saved) {
        setWishlistIds(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleWishlist = (productId) => {
    setWishlistIds((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      if (typeof window !== "undefined") {
        localStorage.setItem("store_wishlist", JSON.stringify(next));
      }
      return next;
    });
  };

  const isInWishlist = (productId) => wishlistIds.includes(productId);
  const wishlistProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProducts,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
