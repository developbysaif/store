"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { storeConfig } from "@/lib/store-config";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemsCount,
    subtotalPKR,
    subtotalUSD,
    coupon,
    applyCoupon,
    removeCoupon,
    progressToFreeShippingPKR,
    amountNeededForFreeShippingPKR,
    hasFreeShippingPKR,
  } = useCart();

  const { format, isPakistanMarket } = useCurrency();
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState(null);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const res = applyCoupon(couponCodeInput);
    setCouponFeedback(res);
    if (res.success) setCouponCodeInput("");
  };

  const discountAmountPKR = coupon ? (subtotalPKR * coupon.discountPercent) / 100 : 0;
  const discountAmountUSD = coupon ? (subtotalUSD * coupon.discountPercent) / 100 : 0;

  const finalSubtotalPKR = Math.max(0, subtotalPKR - discountAmountPKR);
  const finalSubtotalUSD = Math.max(0, subtotalUSD - discountAmountUSD);

  if (items.length === 0) {
    return (
      <div className="bg-[#FAF8F5] min-h-[75vh] flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md mx-auto space-y-5 bg-white p-10 rounded-2xl border border-[#E8E4DC] shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] text-[#B58A52] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8 stroke-[1.2]" />
          </div>
          <h1 className="font-serif text-2xl font-normal text-[#171717]">
            Your Shopping Bag is Empty
          </h1>
          <p className="text-xs text-[#71717A] leading-relaxed">
            Your shopping bag contains no items. Explore our modern luxury edits across clothing, precision watches, jewellery, and accessories.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#171717] hover:bg-[#B58A52] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold rounded-lg shadow-md transition-all"
            >
              <span>Explore Boutique</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 mb-8 border-b border-[#E8E4DC] flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#B58A52] font-semibold mb-2">
              Order Review
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#171717]">
              Shopping Bag ({itemsCount} items)
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-[#71717A] hover:text-red-600 underline cursor-pointer"
          >
            Clear Bag
          </button>
        </div>

        {/* Free Shipping Alert Banner */}
        <div className="mb-8 p-4 bg-white rounded-xl border border-[#E8E4DC]">
          {isPakistanMarket ? (
            hasFreeShippingPKR ? (
              <div className="flex items-center gap-2 text-xs text-[#10B981] font-semibold">
                <Sparkles className="w-4 h-4 text-[#B58A52]" />
                <span>You have unlocked Complimentary Express Shipping nationwide!</span>
              </div>
            ) : (
              <div>
                <div className="flex justify-between text-xs text-[#71717A] mb-2">
                  <span>
                    Add{" "}
                    <strong className="text-[#171717]">
                      ₨ {amountNeededForFreeShippingPKR.toLocaleString()}
                    </strong>{" "}
                    more for complimentary express delivery across Pakistan
                  </span>
                  <span className="font-semibold text-[#B58A52]">
                    {progressToFreeShippingPKR}%
                  </span>
                </div>
                <div className="w-full bg-[#E8E4DC] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#B58A52] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progressToFreeShippingPKR}%` }}
                  />
                </div>
              </div>
            )
          ) : (
            <div className="flex items-center gap-2 text-xs text-[#71717A]">
              <Sparkles className="w-4 h-4 text-[#B58A52]" />
              <span>
                International Orders: Express doorstep worldwide delivery handled securely via DHL Express.
              </span>
            </div>
          )}
        </div>

        {/* Grid: Cart Items List + Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Items Table (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-5 bg-white rounded-xl border border-[#E8E4DC] flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-24 rounded-lg bg-[#E8E4DC] overflow-hidden shrink-0">
                    <Image
                      src={item.product.images[0]?.url || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600"}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#B58A52] font-semibold">
                      {item.product.category}
                    </span>
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="font-serif text-base font-medium text-[#171717] hover:text-[#B58A52] block"
                    >
                      {item.product.name}
                    </Link>
                    <div className="text-xs text-[#71717A] mt-1 space-x-3">
                      {item.selectedVariant.size && (
                        <span>Size: <strong>{item.selectedVariant.size}</strong></span>
                      )}
                      {item.selectedVariant.color && (
                        <span>Color: <strong>{item.selectedVariant.color}</strong></span>
                      )}
                      <span className="text-[11px] text-[#A1A1AA]">
                        SKU: {item.selectedVariant.sku}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-[#F0ECE3]">
                  {/* Quantity */}
                  <div className="flex items-center border border-[#E8E4DC] rounded-lg bg-[#FAF8F5]">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1.5 text-[#71717A] hover:text-[#171717]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-semibold text-[#171717]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1.5 text-[#71717A] hover:text-[#171717]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <div className="text-base font-semibold text-[#171717]">
                      {format(
                        item.unitPricePKR * item.quantity,
                        item.unitPriceUSD * item.quantity
                      )}
                    </div>
                    <div className="text-[11px] text-[#71717A]">
                      {format(item.unitPricePKR, item.unitPriceUSD)} each
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[#A1A1AA] hover:text-red-600 p-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-white rounded-xl border border-[#E8E4DC] space-y-5 shadow-xs">
              <h3 className="font-serif text-lg font-medium text-[#171717] pb-3 border-b border-[#E8E4DC]">
                Summary of Order
              </h3>

              {/* Promo input */}
              <div>
                {coupon ? (
                  <div className="flex items-center justify-between text-xs bg-[#F7F3EB] border border-[#B58A52]/30 px-3 py-2.5 rounded-lg text-[#171717]">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>
                        Promo code <strong>{coupon.code}</strong> (-{coupon.discountPercent}%)
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-[#71717A] hover:text-red-600 underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-[#A1A1AA] absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Promo code (e.g. LUXURY10)"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#E8E4DC] rounded-lg text-[#171717] focus:outline-none focus:border-[#B58A52]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#171717] text-[#FAF8F5] text-xs font-semibold rounded-lg hover:bg-[#B58A52] transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponFeedback && !coupon && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs text-[#71717A] pt-2">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-medium text-[#171717]">
                    {format(subtotalPKR, subtotalUSD)}
                  </span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-[#10B981] font-medium">
                    <span>Privilege Discount ({coupon.code})</span>
                    <span>-{format(discountAmountPKR, discountAmountUSD)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span>
                    {isPakistanMarket
                      ? hasFreeShippingPKR
                        ? "Complimentary"
                        : `₨ ${storeConfig.standardShippingPKR}`
                      : `$${storeConfig.internationalShippingUSD}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold text-[#171717] pt-3 border-t border-[#E8E4DC]">
                  <span>Total Amount</span>
                  <span className="font-serif text-xl text-[#171717]">
                    {format(
                      finalSubtotalPKR + (hasFreeShippingPKR ? 0 : storeConfig.standardShippingPKR),
                      finalSubtotalUSD + storeConfig.internationalShippingUSD
                    )}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#171717] hover:bg-[#B58A52] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 rounded-lg shadow-lg group cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Reassurances */}
            <div className="p-5 bg-white rounded-xl border border-[#E8E4DC] space-y-3 text-xs text-[#71717A] shadow-xs">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-[#B58A52] shrink-0" />
                <span>Express courier tracking dispatched within 24 hours.</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#B58A52] shrink-0" />
                <span>Cash on Delivery & 256-bit SSL encrypted checkout.</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-4 h-4 text-[#B58A52] shrink-0" />
                <span>14-day hassle-free exchange & return privilege.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
