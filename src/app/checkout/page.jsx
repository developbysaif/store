"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { storeConfig } from "@/lib/store-config";
import { PAKISTAN_CITIES, INTERNATIONAL_COUNTRIES } from "@/lib/mock-data";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Building,
  Check,
  Lock,
  Globe,
  Sparkles,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalPKR, subtotalUSD, coupon, clearCart } = useCart();
  const { currency, setCurrency, format, isPakistanMarket } = useCurrency();

  // Mode: "PK" or "INTL"
  const [marketMode, setMarketMode] = useState(isPakistanMarket ? "PK" : "INTL");

  // Address State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState(marketMode === "PK" ? "Lahore" : "New York");
  const [stateProvince, setStateProvince] = useState(marketMode === "PK" ? "Punjab" : "NY");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState(marketMode === "PK" ? "Pakistan" : "United States");

  // Payment Selection: In National only COD, in International cards first!
  const [paymentMethod, setPaymentMethod] = useState(marketMode === "PK" ? "COD" : "CARD");

  // Card details state for international
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorNotice, setErrorNotice] = useState("");

  // Handle switching market mode
  const handleMarketSwitch = (mode) => {
    setMarketMode(mode);
    if (mode === "PK") {
      setCurrency("PKR");
      setCountry("Pakistan");
      setCity("Lahore");
      setPaymentMethod("COD");
    } else {
      setCurrency("USD");
      setCountry("United States");
      setCity("New York");
      setPaymentMethod("CARD");
    }
  };

  // Pricing calculations
  const discountAmountPKR = coupon ? (subtotalPKR * coupon.discountPercent) / 100 : 0;
  const discountAmountUSD = coupon ? (subtotalUSD * coupon.discountPercent) / 100 : 0;

  const shippingCostPKR =
    marketMode === "PK"
      ? subtotalPKR >= storeConfig.freeShippingThresholdPKR
        ? 0
        : storeConfig.standardShippingPKR
      : 0;

  const shippingCostUSD =
    marketMode === "INTL"
      ? subtotalUSD >= storeConfig.freeShippingThresholdUSD
        ? 0
        : storeConfig.internationalShippingUSD
      : 0;

  const finalTotalPKR = Math.max(0, subtotalPKR - discountAmountPKR + shippingCostPKR);
  const finalTotalUSD = Math.max(0, subtotalUSD - discountAmountUSD + shippingCostUSD);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorNotice("");

    if (!fullName || !email || !phone || !addressLine1) {
      setErrorNotice("Please fill in all mandatory contact and shipping fields.");
      return;
    }

    if (items.length === 0) {
      setErrorNotice("Your bag is empty. Please add items before checking out.");
      return;
    }

    // Validation for International Card
    if (marketMode === "INTL" && paymentMethod === "CARD") {
      if (!cardNumber || !cardExpiry || !cardCvc) {
        setErrorNotice("Please enter your card number, expiry, and CVC for international payment verification.");
        return;
      }
    }

    setIsSubmitting(true);

    const randomOrderDigits = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `ORD-2026-${randomOrderDigits}`;

    const orderPayload = {
      orderNumber,
      customer: {
        fullName,
        email,
        phone,
        addressLine1,
        addressLine2,
        city,
        stateProvince,
        postalCode,
        country: marketMode === "PK" ? "Pakistan" : country,
      },
      items: items.map((i) => ({
        productId: i.productId,
        productName: i.product.name,
        productImage: i.product.images[0]?.url || "",
        size: i.selectedVariant.size,
        color: i.selectedVariant.color,
        sku: i.selectedVariant.sku,
        price: marketMode === "PK" ? i.unitPricePKR : i.unitPriceUSD,
        quantity: i.quantity,
      })),
      currency: marketMode === "PK" ? "PKR" : currency,
      subtotal: marketMode === "PK" ? subtotalPKR : subtotalUSD,
      shippingCost: marketMode === "PK" ? shippingCostPKR : shippingCostUSD,
      discount: marketMode === "PK" ? discountAmountPKR : discountAmountUSD,
      total: marketMode === "PK" ? finalTotalPKR : finalTotalUSD,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "PENDING" : "PAID",
      orderStatus: paymentMethod === "COD" ? "PENDING_VERIFICATION" : "CONFIRMED",
      courierName: marketMode === "PK" ? "Leopard Courier Express" : "DHL Express Priority",
      notes: paymentMethod === "COD" ? "National Order: Cash on Delivery. Call customer for confirmation before dispatch." : "International Order: Paid via Card. Dispatched via DHL Priority.",
    };

    try {
      // POST to persistent backend API
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      const savedOrder = data.order || orderPayload;

      // Save in localStorage as well for offline confirmation view
      try {
        const existing = localStorage.getItem("store_orders");
        const ordersList = existing ? JSON.parse(existing) : [];
        ordersList.unshift(savedOrder);
        localStorage.setItem("store_orders", JSON.stringify(ordersList));
        localStorage.setItem("last_completed_order", JSON.stringify(savedOrder));
      } catch (err) {
        console.error(err);
      }

      clearCart();
      router.push(`/order-confirmation/${savedOrder.orderNumber}`);
    } catch (err) {
      console.error("Order creation error:", err);
      // Fallback redirect with generated number
      clearCart();
      router.push(`/order-confirmation/${orderNumber}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Checkout Header */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#E8E4DC]">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#B58A52] font-semibold block mb-1">
              Encrypted Checkout
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#171717]">
              Complete Your Order
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#71717A] bg-white px-3.5 py-2 rounded-lg border border-[#E8E4DC]">
            <Lock className="w-3.5 h-3.5 text-[#10B981]" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* Dual-Market Switcher Banner */}
        <div className="mb-8 p-4 bg-white rounded-xl border border-[#E8E4DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#B58A52]" />
            <div>
              <div className="text-xs font-semibold text-[#171717] uppercase tracking-wider">
                Select Your Shipping Destination
              </div>
              <div className="text-xs text-[#71717A]">
                <strong>National (Pakistan):</strong> Only Cash on Delivery (COD) available with local express couriers. <br />
                <strong>International:</strong> Instant Credit/Debit Cards payment with DHL Express priority worldwide.
              </div>
            </div>
          </div>

          <div className="flex rounded-lg p-1 bg-[#FAF8F5] border border-[#E8E4DC]">
            <button
              type="button"
              onClick={() => handleMarketSwitch("PK")}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                marketMode === "PK"
                  ? "bg-[#171717] text-[#FAF8F5] shadow-sm"
                  : "text-[#71717A] hover:text-[#171717]"
              }`}
            >
              🇵🇰 Pakistan (COD & PKR)
            </button>
            <button
              type="button"
              onClick={() => handleMarketSwitch("INTL")}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                marketMode === "INTL"
                  ? "bg-[#171717] text-[#FAF8F5] shadow-sm"
                  : "text-[#71717A] hover:text-[#171717]"
              }`}
            >
              🌍 International (Cards & DHL)
            </button>
          </div>
        </div>

        {/* Error notification */}
        {errorNotice && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {errorNotice}
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Form Fields (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Step 1: Contact Details */}
              <div className="p-6 bg-white rounded-xl border border-[#E8E4DC] space-y-4 shadow-xs">
                <h2 className="font-serif text-lg font-medium text-[#171717] pb-2 border-b border-[#F0ECE3] flex items-center justify-between">
                  <span>1. Client Information</span>
                  <span className="text-[11px] text-[#A1A1AA] uppercase font-sans font-normal">
                    Step 1 of 3
                  </span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs uppercase tracking-wider font-semibold text-[#171717] block mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ayesha Khan"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8E4DC] rounded-lg text-[#171717] focus:outline-none focus:border-[#B58A52]"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-[#171717] block mb-1.5">
                      Email Address * (For Receipt & Tracking)
                    </label>
                    <input
                      type="email"
                      placeholder="patron@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8E4DC] rounded-lg text-[#171717] focus:outline-none focus:border-[#B58A52]"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-[#171717] block mb-1.5">
                      Phone Number * {marketMode === "PK" ? "(03XX-XXXXXXX for COD verification)" : "(E.164 with country code)"}
                    </label>
                    <input
                      type="tel"
                      placeholder={marketMode === "PK" ? "0300-1234567" : "+1 555-0199"}
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8E4DC] rounded-lg text-[#171717] focus:outline-none focus:border-[#B58A52]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Destination */}
              <div className="p-6 bg-white rounded-xl border border-[#E8E4DC] space-y-4 shadow-xs">
                <h2 className="font-serif text-lg font-medium text-[#171717] pb-2 border-b border-[#F0ECE3] flex items-center justify-between">
                  <span>2. Delivery Destination</span>
                  <span className="text-[11px] text-[#A1A1AA] uppercase font-sans font-normal">
                    Step 2 of 3
                  </span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {marketMode === "PK" ? (
                    <div>
                      <label className="text-xs uppercase tracking-wider font-semibold text-[#171717] block mb-1.5">
                        Country
                      </label>
                      <input
                        type="text"
                        disabled
                        value="Pakistan (National)"
                        className="w-full text-xs px-3.5 py-2.5 bg-[#EFE9DD] border border-[#E8E4DC] rounded-lg text-[#171717] font-semibold cursor-not-allowed"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="text-xs uppercase tracking-wider font-semibold text-[#171717] block mb-1.5">
                        Destination Country *
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8E4DC] rounded-lg text-[#171717] focus:outline-none focus:border-[#B58A52]"
                      >
                        {INTERNATIONAL_COUNTRIES.map((c) => (
                          <option key={c.code} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {marketMode === "PK" ? (
                    <div>
                      <label className="text-xs uppercase tracking-wider font-semibold text-[#171717] block mb-1.5">
                        City *
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8E4DC] rounded-lg text-[#171717] focus:outline-none focus:border-[#B58A52]"
                      >
                        {PAKISTAN_CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="text-xs uppercase tracking-wider font-semibold text-[#171717] block mb-1.5">
                        City *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. London / New York / Dubai"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8E4DC] rounded-lg text-[#171717] focus:outline-none focus:border-[#B58A52]"
                      />
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <label className="text-xs uppercase tracking-wider font-semibold text-[#171717] block mb-1.5">
                      Street Address & House / Flat No. *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. House 42-B, Street 14, Sector F-7/2 or Gulberg III"
                      required
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8E4DC] rounded-lg text-[#171717] focus:outline-none focus:border-[#B58A52]"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-[#171717] block mb-1.5">
                      Area / Neighborhood
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DHA Phase 5 / Clifton"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8E4DC] rounded-lg text-[#171717] focus:outline-none focus:border-[#B58A52]"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-[#171717] block mb-1.5">
                      Postal Code / Zip Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 54000"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8E4DC] rounded-lg text-[#171717] focus:outline-none focus:border-[#B58A52]"
                    />
                  </div>
                </div>

                {/* Delivery advisory */}
                <div className="pt-2 p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E4DC] flex items-center gap-3 text-xs text-[#71717A]">
                  <Truck className="w-4 h-4 text-[#B58A52] shrink-0" />
                  <span>
                    {marketMode === "PK"
                      ? "National orders dispatched with Leopard Courier / TCS. Estimated delivery 2-4 business days."
                      : "International orders dispatched with DHL Express Priority. Estimated delivery 4-7 business days."}
                  </span>
                </div>
              </div>

              {/* Step 3: Payment Method Enforcing National = COD only & International = Cards first */}
              <div className="p-6 bg-white rounded-xl border border-[#E8E4DC] space-y-4 shadow-xs">
                <h2 className="font-serif text-lg font-medium text-[#171717] pb-2 border-b border-[#F0ECE3] flex items-center justify-between">
                  <span>3. Payment Method</span>
                  <span className="text-[11px] text-[#A1A1AA] uppercase font-sans font-normal">
                    Step 3 of 3
                  </span>
                </h2>

                <div className="space-y-3">
                  {/* NATIONAL: Cash on Delivery ONLY */}
                  {marketMode === "PK" ? (
                    <div className="space-y-3">
                      <label
                        className="flex items-start gap-3 p-4 rounded-xl border cursor-pointer border-[#B58A52] bg-[#FAF8F5] ring-2 ring-[#B58A52]/20"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="COD"
                          checked={paymentMethod === "COD"}
                          onChange={() => setPaymentMethod("COD")}
                          className="mt-0.5 text-[#B58A52] focus:ring-[#B58A52]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#171717] flex items-center gap-2">
                              <Banknote className="w-4 h-4 text-[#B58A52]" />
                              Cash on Delivery (COD) — Pakistan Exclusive
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#10B981] bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                              National Standard
                            </span>
                          </div>
                          <p className="text-xs text-[#71717A] mt-1.5 leading-relaxed">
                            Pay in cash when your luxury parcel arrives at your doorstep anywhere in Pakistan. Our order dispatch desk will verify your order via phone call before handing it over to the courier.
                          </p>
                        </div>
                      </label>

                      {/* Optional info notice about card in Pakistan */}
                      <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-lg text-[11px] text-amber-800 flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>For Pakistan national orders, Cash on Delivery is strictly enabled for fast doorstep clearance.</span>
                      </div>
                    </div>
                  ) : (
                    /* INTERNATIONAL: Cards First */
                    <div className="space-y-3">
                      <label
                        className="flex items-start gap-3 p-4 rounded-xl border cursor-pointer border-[#B58A52] bg-[#FAF8F5] ring-2 ring-[#B58A52]/20"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="CARD"
                          checked={paymentMethod === "CARD"}
                          onChange={() => setPaymentMethod("CARD")}
                          className="mt-0.5 text-[#B58A52] focus:ring-[#B58A52]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#171717] flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-[#B58A52]" />
                              International Credit / Debit Card (Visa, Mastercard, Amex)
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B58A52] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                              Instant Clearance
                            </span>
                          </div>
                          <p className="text-xs text-[#71717A] mt-1">
                            Secure 256-bit payment processing with instant confirmation for international courier booking.
                          </p>

                          {/* Card input fields */}
                          <div className="mt-4 pt-3 border-t border-[#E8E4DC] grid grid-cols-2 gap-3">
                            <div className="col-span-2">
                              <label className="text-[10px] uppercase font-semibold text-[#71717A] block mb-1">Cardholder Name</label>
                              <input
                                type="text"
                                placeholder="Full Name on Card"
                                value={cardHolder}
                                onChange={(e) => setCardHolder(e.target.value)}
                                className="w-full text-xs px-3 py-2 bg-white border border-[#E8E4DC] rounded-lg text-[#171717]"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="text-[10px] uppercase font-semibold text-[#71717A] block mb-1">Card Number</label>
                              <input
                                type="text"
                                placeholder="4000 1234 5678 9010"
                                maxLength={19}
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                className="w-full text-xs px-3 py-2 bg-white border border-[#E8E4DC] rounded-lg text-[#171717]"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-semibold text-[#71717A] block mb-1">Expiry Date</label>
                              <input
                                type="text"
                                placeholder="MM / YY"
                                maxLength={5}
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                className="w-full text-xs px-3 py-2 bg-white border border-[#E8E4DC] rounded-lg text-[#171717]"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-semibold text-[#71717A] block mb-1">CVC / Security Code</label>
                              <input
                                type="password"
                                placeholder="3 or 4 digits"
                                maxLength={4}
                                value={cardCvc}
                                onChange={(e) => setCardCvc(e.target.value)}
                                className="w-full text-xs px-3 py-2 bg-white border border-[#E8E4DC] rounded-lg text-[#171717]"
                              />
                            </div>
                          </div>
                        </div>
                      </label>

                      <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-lg text-[11px] text-blue-800 flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <span>International orders require prepaid Card checkout before DHL air waybill generation.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 bg-white rounded-xl border border-[#E8E4DC] space-y-5 shadow-xs sticky top-28">
                <h3 className="font-serif text-lg font-medium text-[#171717] pb-3 border-b border-[#E8E4DC]">
                  Order Overview ({items.length} items)
                </h3>

                {/* Items preview list */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-xs">
                      <div className="relative w-12 h-14 rounded bg-[#E8E4DC] overflow-hidden shrink-0">
                        <Image
                          src={item.product.images[0]?.url || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600"}
                          alt={item.product.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[#171717] truncate">
                          {item.product.name}
                        </div>
                        <div className="text-[11px] text-[#71717A]">
                          Qty: {item.quantity} {item.selectedVariant.size && `• Size: ${item.selectedVariant.size}`}
                        </div>
                      </div>
                      <div className="font-semibold text-[#171717] text-right">
                        {format(
                          item.unitPricePKR * item.quantity,
                          item.unitPriceUSD * item.quantity
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals Breakdown */}
                <div className="pt-4 border-t border-[#E8E4DC] space-y-2 text-xs text-[#71717A]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-[#171717]">
                      {format(subtotalPKR, subtotalUSD)}
                    </span>
                  </div>

                  {coupon && (
                    <div className="flex justify-between text-[#10B981] font-medium">
                      <span>Privilege Code ({coupon.code})</span>
                      <span>-{format(discountAmountPKR, discountAmountUSD)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>
                      {marketMode === "PK"
                        ? "Domestic Leopard/TCS Delivery"
                        : "DHL Express Worldwide Airway"}
                    </span>
                    <span>
                      {marketMode === "PK"
                        ? shippingCostPKR === 0
                          ? "Complimentary"
                          : `₨ ${shippingCostPKR}`
                        : shippingCostUSD === 0
                        ? "Complimentary"
                        : `$${shippingCostUSD}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline text-base font-semibold text-[#171717] pt-3 border-t border-[#E8E4DC]">
                    <span>Total Due</span>
                    <span className="font-serif text-2xl text-[#171717]">
                      {format(finalTotalPKR, finalTotalUSD)}
                    </span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#171717] hover:bg-[#B58A52] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 rounded-xl shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? "Recording Your Order..."
                      : marketMode === "PK"
                      ? "Confirm Order with Cash on Delivery"
                      : "Pay with Card & Book DHL Dispatch"}
                  </span>
                </button>

                <p className="text-[10px] text-center text-[#71717A] leading-relaxed">
                  By confirming your acquisition, you agree to the Atelier terms of service and our 14-day exchange privilege.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
