"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductHero3D } from "@/components/products/ProductHero3D";
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  HelpCircle,
  X,
  CreditCard,
} from "lucide-react";

export function ProductDetailClient({ product, relatedProducts }) {
  const router = useRouter();
  const { format, isPakistanMarket } = useCurrency();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0
      ? product.variants[0]
      : { id: "default", name: "Standard", priceModifierPKR: 0, stock: product.stock || 10 }
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    router.push("/checkout");
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      {/* 1. Dribbble-Style 3D Floating Header & Interactive Hero */}
      <ProductHero3D
        product={product}
        selectedVariant={selectedVariant}
        onSelectVariant={setSelectedVariant}
      />

      {/* 2. Detailed Sizing, Technical Accordions, and Logistics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left: Size Selector & Purchase Controls (6 cols) */}
          <div className="lg:col-span-6 bg-white p-5 sm:p-8 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE3]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B58A52] block">
                  Configuration
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#171717]">
                  Sizing & Acquisition
                </h3>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 text-[#B58A52]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating || 5)
                          ? "fill-[#B58A52]"
                          : "text-[#D8D2C7]"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-[#71717A]">
                  {product.rating || 5} ({product.reviewsCount || 12} reviews)
                </span>
              </div>
            </div>

            {/* Size options if applicable */}
            {product.variants && product.variants.some((v) => v.size) && (
              <div>
                <div className="flex items-center justify-between text-xs text-[#171717] font-semibold uppercase tracking-wider mb-2.5">
                  <span>Select Size:</span>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-[#B58A52] hover:underline flex items-center gap-1 font-normal lowercase first-letter:uppercase"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Sartorial Sizing Guide</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {product.variants
                    .filter((v) => v.size)
                    .map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`min-w-12 sm:min-w-14 px-3 sm:px-4 py-2 sm:py-2.5 text-xs uppercase tracking-wider font-bold rounded-xl border transition-all ${
                            isSelected
                              ? "bg-[#171717] text-[#FAF8F5] border-[#171717] shadow-md scale-105"
                              : "bg-white text-[#171717] border-[#E8E4DC] hover:border-[#B58A52]"
                          }`}
                        >
                          {v.size}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="text-xs uppercase tracking-wider font-semibold text-[#171717] block mb-2">
                Quantity
              </label>
              <div className="inline-flex items-center border border-[#E8E4DC] rounded-xl bg-[#FAF8F5]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-11 h-11 flex items-center justify-center text-[#71717A] hover:text-[#171717] cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-[#171717]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(selectedVariant?.stock || 10, q + 1))}
                  aria-label="Increase quantity"
                  className="w-11 h-11 flex items-center justify-center text-[#71717A] hover:text-[#171717] cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={(selectedVariant?.stock ?? 1) <= 0}
                  className="flex-1 py-3.5 sm:py-4 bg-[#171717] hover:bg-[#B58A52] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 rounded-xl shadow-xl flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{addedNotice ? "Added to Shopping Bag!" : "Add to Bag"}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label={isFavorited ? "Remove piece from wishlist" : "Save piece to wishlist"}
                  className={`p-3.5 border rounded-xl transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    isFavorited
                      ? "bg-red-50 border-red-200 text-red-600"
                      : "bg-white border-[#E8E4DC] text-[#171717] hover:border-[#171717]"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? "fill-current text-red-500" : ""}`} />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                disabled={(selectedVariant?.stock ?? 1) <= 0}
                className="w-full py-3 sm:py-3.5 bg-white border border-[#171717] hover:bg-[#171717] hover:text-[#FAF8F5] text-[#171717] text-xs uppercase tracking-[0.16em] font-semibold transition-all duration-300 rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer min-h-[44px]"
              >
                <CreditCard className="w-4 h-4" />
                <span className="truncate">
                  {isPakistanMarket
                    ? "Order with Cash on Delivery (Instant Checkout)"
                    : "Instant Global Express Checkout"}
                </span>
              </button>
            </div>

            {/* Guarantees Bar */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-4 border-t border-[#F0ECE3] text-center text-[10px] sm:text-[11px] text-[#71717A]">
              <div className="p-2 sm:p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E8E4DC] space-y-1">
                <Truck className="w-4 h-4 text-[#B58A52] mx-auto" />
                <span className="block leading-tight">2-4 Days Delivery</span>
              </div>
              <div className="p-2 sm:p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E8E4DC] space-y-1">
                <RotateCcw className="w-4 h-4 text-[#B58A52] mx-auto" />
                <span className="block leading-tight">14 Days Returns</span>
              </div>
              <div className="p-2 sm:p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E8E4DC] space-y-1">
                <ShieldCheck className="w-4 h-4 text-[#B58A52] mx-auto" />
                <span className="block leading-tight">Authentic Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right: Technical Accordion Tabs & Manifest (6 cols) */}
          <div className="lg:col-span-6 bg-white p-5 sm:p-8 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-6">
            <div className="flex border-b border-[#E8E4DC]">
              <button
                onClick={() => setActiveTab("details")}
                className={`pb-3 px-4 text-xs uppercase tracking-wider font-semibold transition-colors relative ${
                  activeTab === "details"
                    ? "text-[#171717]"
                    : "text-[#71717A] hover:text-[#171717]"
                }`}
              >
                Material Composition
                {activeTab === "details" && (
                  <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#B58A52] rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("care")}
                className={`pb-3 px-4 text-xs uppercase tracking-wider font-semibold transition-colors relative ${
                  activeTab === "care"
                    ? "text-[#171717]"
                    : "text-[#71717A] hover:text-[#171717]"
                }`}
              >
                Care & Maintenance
                {activeTab === "care" && (
                  <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#B58A52] rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`pb-3 px-4 text-xs uppercase tracking-wider font-semibold transition-colors relative ${
                  activeTab === "shipping"
                    ? "text-[#171717]"
                    : "text-[#71717A] hover:text-[#171717]"
                }`}
              >
                Logistics & COD
                {activeTab === "shipping" && (
                  <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#B58A52] rounded-full" />
                )}
              </button>
            </div>

            <div className="text-xs text-[#71717A] leading-relaxed pt-2">
              {activeTab === "details" && (
                <div className="space-y-4">
                  <p className="text-sm font-serif text-[#171717] italic">
                    {product.description}
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-[#171717] pt-2">
                    {Array.isArray(product.details) ? (
                      product.details.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))
                    ) : (
                      <li>Premium hand-finished materials and craftsmanship.</li>
                    )}
                  </ul>
                </div>
              )}

              {activeTab === "care" && (
                <div className="space-y-3">
                  <p>
                    To retain the pristine condition and luster of this piece, observe the atelier recommendations:
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-[#171717]">
                    {product.careInstructions?.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    )) || <li>Store in original protective packaging away from direct moisture.</li>}
                  </ul>
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-3">
                  <p>
                    <strong>Pakistan Domestic Logistics:</strong> Shipped with Leopard Courier / TCS / Trax. Doorstep delivery takes 2 to 4 business days. Cash on Delivery (COD) is available nationwide.
                  </p>
                  <p>
                    <strong>International Logistics:</strong> Handled securely by DHL Express Priority. Concludes within 4 to 7 business days with signature tracking.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Pairings Carousel */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-[#E8E4DC]">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B58A52] block mb-2">
                Harmonious Pairings
              </span>
              <h2 className="font-serif text-3xl font-normal text-[#171717]">
                You May Also Admire
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sizing Guide Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#171717]/70 backdrop-blur-sm"
            onClick={() => setSizeGuideOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-2xl shadow-2xl p-6 z-10 border border-[#E8E4DC]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E4DC]">
              <h3 className="font-serif text-lg font-bold text-[#171717]">
                Atelier Sizing & Measurement Guide
              </h3>
              <button
                onClick={() => setSizeGuideOpen(false)}
                className="p-1 text-[#71717A] hover:text-[#171717]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 text-xs text-[#71717A] space-y-3">
              <p>
                Our pieces are tailored to international luxury specifications.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-[#E8E4DC]">
                  <thead>
                    <tr className="bg-[#EFE9DD] text-[#171717]">
                      <th className="p-2 border border-[#E8E4DC]">Size</th>
                      <th className="p-2 border border-[#E8E4DC]">Chest</th>
                      <th className="p-2 border border-[#E8E4DC]">Waist</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border border-[#E8E4DC] font-semibold">S</td>
                      <td className="p-2 border border-[#E8E4DC]">36 - 38&quot;</td>
                      <td className="p-2 border border-[#E8E4DC]">29 - 31&quot;</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-[#E8E4DC] font-semibold">M</td>
                      <td className="p-2 border border-[#E8E4DC]">39 - 41&quot;</td>
                      <td className="p-2 border border-[#E8E4DC]">32 - 34&quot;</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-[#E8E4DC] font-semibold">L</td>
                      <td className="p-2 border border-[#E8E4DC]">42 - 44&quot;</td>
                      <td className="p-2 border border-[#E8E4DC]">35 - 37&quot;</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="pt-2 text-right">
              <button
                onClick={() => setSizeGuideOpen(false)}
                className="px-5 py-2.5 bg-[#171717] text-white text-xs uppercase tracking-wider font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile Add to Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md px-4 py-2.5 border-t border-[#E8E4DC] lg:hidden shadow-2xl pb-safe">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-10 h-10 rounded-lg bg-[#FAF8F5] border border-[#E8E4DC] overflow-hidden shrink-0">
              <Image
                src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300"}
                alt={product.name}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[#171717] truncate">
                {product.name}
              </div>
              <div className="text-[11px] text-[#B58A52] font-medium font-serif">
                {format(
                  product.basePricePKR + (selectedVariant?.priceAdjustment || 0),
                  product.basePriceUSD
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={(selectedVariant?.stock ?? 1) <= 0}
            className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all shadow-md shrink-0 flex items-center gap-1.5 min-h-[44px] cursor-pointer ${
              addedNotice
                ? "bg-[#10B981] text-white"
                : "bg-[#171717] hover:bg-[#B58A52] text-white"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{addedNotice ? "Added" : "Add to Bag"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
