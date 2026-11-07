"use client";

import React, { useState } from "react";
import Link from "next/link";
import { storeConfig } from "@/lib/store-config";
import { Mail, Phone, MapPin, CheckCircle2, ArrowRight } from "lucide-react";

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) return;
    setIsSubscribed(true);
    setNewsletterEmail("");
  };

  return (
    <footer className="bg-[#171717] text-[#FAF8F5] pt-16 pb-12 border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#2A2A2A]">
          {/* Brand Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif text-2xl tracking-[0.2em] font-medium text-[#FAF8F5] block">
              {storeConfig.brandName}
            </span>
            <p className="text-xs text-[#A1A1AA] leading-relaxed max-w-sm">
              An editorial house dedicated to elevated modern design, enduring craftsmanship, and quiet luxury. Curating fine tailored clothing, precision horology, handcrafted jewellery, and Italian leather accessories.
            </p>
            <div className="pt-2 space-y-2 text-xs text-[#A1A1AA]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#B58A52]" />
                <span>{storeConfig.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B58A52]" />
                <span>Concierge: {storeConfig.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B58A52]" />
                <span>{storeConfig.contactEmail}</span>
              </div>
            </div>
          </div>

          {/* Departments */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-semibold tracking-widest text-[#B58A52]">
              Departments
            </h4>
            <ul className="space-y-2 text-xs text-[#A1A1AA]">
              <li>
                <Link href="/category/clothing" className="hover:text-[#FAF8F5] transition-colors">
                  Clothing (Men & Women)
                </Link>
              </li>
              <li>
                <Link href="/category/watches" className="hover:text-[#FAF8F5] transition-colors">
                  Fine Horology & Watches
                </Link>
              </li>
              <li>
                <Link href="/category/jewellery" className="hover:text-[#FAF8F5] transition-colors">
                  Artificial & Fine Jewellery
                </Link>
              </li>
              <li>
                <Link href="/category/accessories" className="hover:text-[#FAF8F5] transition-colors">
                  Leather Goods & Accessories
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=new" className="hover:text-[#FAF8F5] transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Concierge & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-semibold tracking-widest text-[#B58A52]">
              Client Care
            </h4>
            <ul className="space-y-2 text-xs text-[#A1A1AA]">
              <li>
                <Link href="/order-tracking" className="hover:text-[#FAF8F5] transition-colors">
                  Track Your Shipment
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-[#FAF8F5] transition-colors">
                  Shipping & Courier Rates
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-[#FAF8F5] transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/policies/size-guide" className="hover:text-[#FAF8F5] transition-colors">
                  Sartorial Size Guide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FAF8F5] transition-colors">
                  Bespoke Inquiries
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-[#B58A52] hover:underline font-medium">
                  Merchant Admin Suite
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter signup */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-semibold tracking-widest text-[#B58A52]">
              The Journal & Privileges
            </h4>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Subscribe for private previews, seasonal drops, and quiet luxury invitations.
            </p>

            {isSubscribed ? (
              <div className="flex items-center gap-2 text-xs text-[#10B981] bg-[#10B981]/10 p-3 rounded border border-[#10B981]/20">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Welcome. Your exclusive private privilege will be sent shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="w-full bg-[#242424] text-xs text-[#FAF8F5] px-3.5 py-2.5 rounded border border-[#333333] placeholder:text-[#71717A] focus:outline-none focus:border-[#B58A52]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 p-1.5 bg-[#B58A52] text-[#FAF8F5] rounded hover:bg-[#9E743F] transition-colors"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-[#71717A]">
                  Receive 10% off your inaugural order with code <strong className="text-[#B58A52]">LUXURY10</strong>.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71717A]">
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} {storeConfig.brandName}. All rights reserved.</span>
            <span>•</span>
            <span>Pakistan & International Commerce</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-medium text-[#A1A1AA]">
            <span className="px-2 py-0.5 border border-[#333333] rounded">CASH ON DELIVERY (PK)</span>
            <span className="px-2 py-0.5 border border-[#333333] rounded">VISA</span>
            <span className="px-2 py-0.5 border border-[#333333] rounded">MASTERCARD</span>
            <span className="px-2 py-0.5 border border-[#333333] rounded">PAYFAST</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
