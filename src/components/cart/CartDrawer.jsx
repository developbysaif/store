"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  Check,
} from "lucide-react";

export function CartDrawer() {
  const {
    items,
    isCartDrawerOpen,
    closeCartDrawer,
    removeFromCart,
    updateQuantity,
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

  if (!isCartDrawerOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const res = applyCoupon(couponCodeInput);
    setCouponFeedback(res);
    if (res.success) {
      setCouponCodeInput("");
    }
  };

  const discountAmountPKR = coupon ? (subtotalPKR * coupon.discountPercent) / 100 : 0;
  const discountAmountUSD = coupon ? (subtotalUSD * coupon.discountPercent) / 100 : 0;

  const finalSubtotalPKR = Math.max(0, subtotalPKR - discountAmountPKR);
  const finalSubtotalUSD = Math.max(0, subtotalUSD - discountAmountUSD);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-[#171717]/60 backdrop-blur-sm transition-opacity"
        onClick={closeCartDrawer}
      />

      <div className="relative w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between z-10 border-l border-[#E8E4DC] animate-in slide-in-from-right duration-300">
        <div className="p-5 sm:p-6 border-b border-[#E8E4DC] bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B58A52]" />
              <h2 className="font-serif text-lg font-medium text-[#171717]">
                Shopping Bag ({itemsCount})
              </h2>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-1.5 text-[#71717A] hover:text-[#171717] rounded-full hover:bg-[#FAF8F5] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0ECE3]">
            {isPakistanMarket ? (
              hasFreeShippingPKR ? (
                <div className="flex items-center gap-1.5 text-xs text-[#10B981] font-semibold">
                  <Sparkles className="w-4 h-4 text-[#B58A52]" />
                  <span>Complimentary Express Shipping Unlocked!</span>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between text-xs text-[#71717A] mb-1.5">
                    <span>
                      Add{" "}
                      <strong className="text-[#171717]">
                        ₨ {amountNeededForFreeShippingPKR.toLocaleString()}
                      </strong>{" "}
                      for free express shipping
                    </span>
                    <span className="font-semibold text-[#B58A52]">
                      {progressToFreeShippingPKR}%
                    </span>
                  </div>
                  <div className="w-full bg-[#E8E4DC] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#B58A52] h-full transition-all duration-500 rounded-full"
                      style={{ width: `${progressToFreeShippingPKR}%` }}
                    />
                  </div>
                </div>
              )
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-[#71717A]">
                <Sparkles className="w-3.5 h-3.5 text-[#B58A52]" />
                <span>Worldwide Express Shipping available with DHL</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#EFE9DD] flex items-center justify-center mx-auto text-[#B58A52]">
                <ShoppingBag className="w-8 h-8 stroke-[1.2]" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-[#171717]">
                  Your bag is currently empty
                </h3>
                <p className="text-xs text-[#71717A] max-w-xs mx-auto mt-1">
                  Explore our modern luxury collections across clothing, watches, jewellery and accessories.
                </p>
              </div>
              <Link
                href="/shop"
                onClick={closeCartDrawer}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-[#171717] text-[#FAF8F5] text-xs uppercase tracking-widest hover:bg-[#B58A52] transition-colors rounded"
              >
                Discover Collection
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 bg-white rounded-lg border border-[#E8E4DC] relative group"
              >
                <div className="relative w-20 h-24 rounded bg-[#E8E4DC] overflow-hidden shrink-0">
                  <Image
                    src={item.product.images[0].url}
                    alt={item.product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={closeCartDrawer}
                        className="font-serif text-sm font-medium text-[#171717] hover:text-[#B58A52] line-clamp-1 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#A1A1AA] hover:text-red-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs text-[#71717A] mt-0.5 space-x-2">
                      {item.selectedVariant?.size && (
                        <span>Size: <strong className="text-[#171717]">{item.selectedVariant.size}</strong></span>
                      )}
                      {item.selectedVariant?.color && (
                        <span>Color: <strong className="text-[#171717]">{item.selectedVariant.color}</strong></span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#F5F2EB]">
                    <div className="flex items-center border border-[#E8E4DC] rounded bg-[#FAF8F5]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-[#71717A] hover:text-[#171717] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold text-[#171717]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-[#71717A] hover:text-[#171717] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-sm font-semibold text-[#171717]">
                      {format(
                        item.unitPricePKR * item.quantity,
                        item.unitPriceUSD * item.quantity
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 sm:p-6 border-t border-[#E8E4DC] bg-white space-y-3">
            <div>
              {coupon ? (
                <div className="flex items-center justify-between text-xs bg-[#F7F3EB] border border-[#B58A52]/30 px-3 py-2 rounded text-[#171717]">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>
                      Promo code <strong className="text-[#B58A52]">{coupon.code}</strong> (-{coupon.discountPercent}%)
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-[#71717A] hover:text-red-600 underline ml-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#A1A1AA] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Promo code (e.g. LUXURY10)"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E8E4DC] rounded text-[#171717] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#B58A52]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#171717] text-[#FAF8F5] text-xs font-medium rounded hover:bg-[#B58A52] transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponFeedback && !coupon && (
                <p
                  className={`text-[11px] mt-1 ${
                    couponFeedback.success ? "text-[#10B981]" : "text-red-500"
                  }`}
                >
                  {couponFeedback.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5 text-xs text-[#71717A] pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-[#171717]">
                  {format(subtotalPKR, subtotalUSD)}
                </span>
              </div>
              {coupon && (
                <div className="flex justify-between text-[#10B981]">
                  <span>Discount ({coupon.code})</span>
                  <span>-{format(discountAmountPKR, discountAmountUSD)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {isPakistanMarket
                    ? hasFreeShippingPKR
                      ? "Free Express Delivery"
                      : "Calculated at checkout"
                    : "International DHL rate at checkout"}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#171717] pt-2 border-t border-[#F0ECE3]">
                <span>Estimated Total</span>
                <span className="font-serif text-lg text-[#171717]">
                  {format(finalSubtotalPKR, finalSubtotalUSD)}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href="/checkout"
                onClick={closeCartDrawer}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#171717] hover:bg-[#B58A52] text-[#FAF8F5] text-xs uppercase tracking-[0.15em] font-semibold transition-colors rounded shadow-lg group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/cart"
                onClick={closeCartDrawer}
                className="w-full block text-center py-2 text-xs uppercase tracking-wider text-[#71717A] hover:text-[#171717] transition-colors"
              >
                View Full Shopping Bag
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
