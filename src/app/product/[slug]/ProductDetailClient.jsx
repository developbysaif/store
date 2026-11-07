"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { storeConfig } from "@/lib/store-config";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductHero3D } from "@/components/products/ProductHero3D";
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  X,
  CreditCard,
  Sparkles,
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#71717A] mb-10 pb-4 border-b border-[#E8E4DC]">
          <Link href="/" className="hover:text-[#171717] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-[#171717] transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            href={`/category/${product.category}`}
            className="hover:text-[#171717] transition-colors capitalize"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#171717] font-semibold truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Size Selector & Purchase Controls (6 cols) */}
          <div className="lg:col-span-6 bg-white p-8 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE3]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B58A52] block">
                  Configuration
                </span>
                <h3 className="font-serif text-2xl text-[#171717]">
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
                <div className="flex flex-wrap gap-2.5">
                  {product.variants
                    .filter((v) => v.size)
                    .map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`min-w-14 px-4 py-2.5 text-xs uppercase tracking-wider font-bold rounded-xl border transition-all ${
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
                  className="px-3.5 py-2 text-[#71717A] hover:text-[#171717]"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-[#171717]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(selectedVariant?.stock || 10, q + 1))}
                  className="px-3.5 py-2 text-[#71717A] hover:text-[#171717]"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={(selectedVariant?.stock ?? 1) <= 0}
                className="w-full py-4 bg-[#171717] hover:bg-[#B58A52] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 rounded-xl shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{addedNotice ? "Added to Shopping Bag!" : "Add to Bag"}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={(selectedVariant?.stock ?? 1) <= 0}
                className="w-full py-3.5 bg-white border border-[#171717] hover:bg-[#171717] hover:text-[#FAF8F5] text-[#171717] text-xs uppercase tracking-[0.16em] font-semibold transition-all duration-300 rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>
                  {isPakistanMarket
                    ? "Order with Cash on Delivery (Instant Checkout)"
                    : "Instant Global Express Checkout"}
                </span>
              </button>
            </div>

            {/* Guarantees Bar */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#F0ECE3] text-center text-[11px] text-[#71717A]">
              <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E8E4DC] space-y-1">
                <Truck className="w-4 h-4 text-[#B58A52] mx-auto" />
                <span>2-4 Days Delivery</span>
              </div>
              <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E8E4DC] space-y-1">
                <RotateCcw className="w-4 h-4 text-[#B58A52] mx-auto" />
                <span>14 Days Returns</span>
              </div>
              <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E8E4DC] space-y-1">
                <ShieldCheck className="w-4 h-4 text-[#B58A52] mx-auto" />
                <span>Authentic Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right: Technical Accordion Tabs & Manifest (6 cols) */}
          <div className="lg:col-span-6 bg-white p-8 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
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
    </div>
  );
}
