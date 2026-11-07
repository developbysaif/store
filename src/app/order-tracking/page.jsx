import React, { Suspense } from "react";
import { OrderTrackingClient } from "./OrderTrackingClient";

export const metadata = {
  title: "Consignment & Order Tracking — Haute Couture Logistics",
  description: "Track the real-time fulfillment status of your luxury parcel.",
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
