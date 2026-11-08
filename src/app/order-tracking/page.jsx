import React, { Suspense } from "react";
import { storeConfig } from "@/lib/store-config";
import { OrderTrackingClient } from "./OrderTrackingClient";

export const metadata = {
  title: `Consignment & Courier Tracking — ${storeConfig.brandName} Logistics`,
  description:
    "Track the real-time fulfillment and courier dispatch status of your luxury parcel across Leopard Courier, TCS, or DHL Express.",
  alternates: {
    canonical: `${storeConfig.siteUrl}/order-tracking`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function OrderTrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-2 border-[#B58A52] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-widest text-[#71717A]">
              Loading Tracking Portal...
            </p>
          </div>
        </div>
      }
    >
      <OrderTrackingClient />
    </Suspense>
  );
}
