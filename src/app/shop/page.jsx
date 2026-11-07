import React, { Suspense } from "react";
import { ShopClient } from "./ShopClient";

export const metadata = {
  title: "Shop All Collections — Haute Couture, Watches, Jewellery & Accessories",
  description: "Browse the complete curation of luxury clothing, precision watches, 18K jewellery, and accessories.",
};

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#B58A52] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-widest text-[#71717A]">
              Opening Catalog...
            </p>
          </div>
        </div>
      }
    >
      <ShopClient />
    </Suspense>
  );
}
