"use client";

import React from "react";
import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";
import { storeConfig } from "@/lib/store-config";

export function TrustBanner() {
  const pillars = [
    {
      icon: Truck,
      title: "Complimentary Shipping",
      desc: `Orders over ₨ ${storeConfig.freeShippingThresholdPKR.toLocaleString()} in Pakistan or $${storeConfig.freeShippingThresholdUSD} internationally.`,
    },
    {
      icon: RotateCcw,
      title: "14-Day Exchange Guarantee",
      desc: "Hassle-free doorstep exchanges across Pakistan and global courier returns.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments & COD",
      desc: "Cash on Delivery available nationwide alongside encrypted 256-bit card gateways.",
    },
    {
      icon: Headphones,
      title: "Personal Concierge",
      desc: "Direct styling assistance and order support via WhatsApp and telephone.",
    },
  ];

  return (
    <section className="bg-[#FAF8F5] border-t border-[#E8E4DC] py-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center space-y-2.5">
                <div className="w-12 h-12 rounded-full bg-white border border-[#E8E4DC] flex items-center justify-center text-[#B58A52] shadow-xs">
                  <Icon className="w-5 h-5 stroke-[1.4]" />
                </div>
                <h4 className="text-xs uppercase tracking-widest font-semibold text-[#171717]">
                  {pillar.title}
                </h4>
                <p className="text-xs text-[#71717A] max-w-xs leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
