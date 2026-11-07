"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { storeConfig } from "@/lib/store-config";
import {
  CheckCircle2,
  Printer,
  Package,
  Truck,
  ArrowRight,
  Phone,
  MessageCircle,
  Clock,
  MapPin,
} from "lucide-react";

export function OrderConfirmationClient({ orderNumber }) {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // 1. Try local storage first
    try {
      const saved = localStorage.getItem("last_completed_order");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.orderNumber === orderNumber) {
          setOrder(parsed);
          return;
        }
      }
      const allOrders = localStorage.getItem("store_orders");
      if (allOrders) {
        const parsedAll = JSON.parse(allOrders);
        const found = parsedAll.find((o) => o.orderNumber === orderNumber);
        if (found) {
          setOrder(found);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    // 2. Fallback to API query
    fetch(`/api/orders?search=${orderNumber}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.orders && data.orders.length > 0) {
          setOrder(data.orders[0]);
        }
      })
      .catch((err) => console.error("Error loading order:", err));
  }, [orderNumber]);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Celebration Header */}
        <div className="text-center space-y-4 mb-10">
          <div className="w-16 h-16 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center mx-auto border border-[#10B981]/20">
            <CheckCircle2 className="w-9 h-9 stroke-[1.5]" />
          </div>

          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B58A52] block">
            Thank You for Patronising Our Atelier
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#171717]">
            Your Order Has Been Placed
          </h1>

          <p className="text-xs text-[#71717A] max-w-md mx-auto leading-relaxed">
            Order Reference: <strong className="text-[#171717] font-mono">{orderNumber}</strong>. A confirmation dispatch note has been sent to your registered email.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl border border-[#E8E4DC] shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
          {/* Status Box */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#B58A52] shrink-0" />
              <div>
                <div className="text-xs font-semibold text-[#171717] uppercase tracking-wider">
                  {order?.paymentMethod === "COD"
                    ? "Pending Phone Verification (COD)"
                    : "Order Confirmed & Preparing Dispatch"}
                </div>
                <div className="text-xs text-[#71717A]">
                  {order?.paymentMethod === "COD"
                    ? "Our concierge will contact you on your mobile number to confirm delivery address before dispatch."
                    : "Your items are being carefully inspected and hand-packaged in luxury presentation boxes."}
                </div>
              </div>
            </div>

            <Link
              href={`/order-tracking?order=${orderNumber}`}
              className="text-xs uppercase tracking-wider font-semibold text-[#B58A52] hover:underline shrink-0"
            >
              Track Live Timeline
            </Link>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 pb-4 border-b border-[#F0ECE3] text-xs">
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-[#71717A] mb-1">
                Shipping Destination
              </div>
              <div className="font-semibold text-[#171717]">
                {order?.customer?.fullName || "Valued Patron"}
              </div>
              <div className="text-[#71717A] mt-0.5">
                {order?.customer?.addressLine1}
                {order?.customer?.addressLine2 && `, ${order.customer.addressLine2}`}
              </div>
              <div className="text-[#71717A]">
                {order?.customer?.city}, {order?.customer?.country} {order?.customer?.postalCode}
              </div>
              <div className="text-[#71717A] mt-0.5">
                Tel: {order?.customer?.phone}
              </div>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-[#71717A] mb-1">
                Payment & Fulfillment
              </div>
              <div className="font-semibold text-[#171717]">
                Payment:{" "}
                {order?.paymentMethod === "COD"
                  ? "Cash on Delivery (National)"
                  : "Credit / Debit Card (International)"}
              </div>
              <div className="text-[#71717A] mt-0.5">
                Status: <span className="text-[#B58A52] font-semibold">{order?.orderStatus || "CONFIRMED"}</span>
              </div>
              <div className="text-[#71717A] mt-0.5">
                Courier: {order?.courierName || "Express Courier"}
              </div>
              {order?.trackingNumber && (
                <div className="text-[#71717A] mt-0.5">
                  Tracking AWB: <strong className="font-mono text-[#171717]">{order.trackingNumber}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Items Summary */}
          {order?.items && order.items.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-wider font-semibold text-[#171717]">
                Items in This Acquisition
              </div>
              <div className="divide-y divide-[#F0ECE3]">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 rounded-lg bg-[#E8E4DC] overflow-hidden shrink-0">
                        {item.productImage && (
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-[#171717]">{item.productName}</div>
                        <div className="text-[#71717A] text-[11px]">
                          Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                        </div>
                      </div>
                    </div>
                    <div className="font-semibold text-[#171717]">
                      {order.currency === "PKR" ? `₨ ${(item.price * item.quantity).toLocaleString()}` : `$${item.price * item.quantity}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-4 border-t border-[#E8E4DC] flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/shop"
              className="px-6 py-3 bg-[#171717] hover:bg-[#B58A52] text-[#FAF8F5] text-xs uppercase tracking-widest font-semibold rounded-lg transition-colors"
            >
              Continue Exploring
            </Link>

            <Link
              href={`/order-tracking?order=${orderNumber}`}
              className="text-xs uppercase tracking-wider font-semibold text-[#171717] hover:text-[#B58A52] flex items-center gap-1.5"
            >
              <span>Track Delivery Status</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
