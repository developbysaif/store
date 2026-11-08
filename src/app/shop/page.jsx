import React, { Suspense } from "react";
import { storeConfig } from "@/lib/store-config";
import { ShopClient } from "./ShopClient";

export const metadata = {
  title: `Shop All Collections — Haute Couture, Watches, Jewellery & Accessories | ${storeConfig.brandName}`,
  description:
    "Browse our complete curation of tailored double-faced cashmere coats, precision horology timepieces, 18K gold-plated anti-tarnish jewellery, and Italian calfskin leather accessories. Free express delivery on qualifying orders.",
  alternates: {
    canonical: `${storeConfig.siteUrl}/shop`,
  },
  openGraph: {
    title: `Shop All Collections — Haute Couture, Watches & Jewellery | ${storeConfig.brandName}`,
    description:
      "Browse our complete curation of tailored coats, precision horology, 18K gold-plated jewellery, and leather accessories.",
    url: `${storeConfig.siteUrl}/shop`,
    siteName: storeConfig.brandName,
  },
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
