"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Heart, ShoppingBag, Check, Sparkles } from "lucide-react";

export function ProductCard({ product, priority = false }) {
  const { format } = useCurrency();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const primaryImg = product.images?.[0]?.url || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop";
  const secondaryImg = product.images?.[1]?.url || primaryImg;

  // Extract unique color swatches from variants
  const colorSwatches = Array.from(
    new Map(
      (product.variants || [])
        .filter((v) => v.colorHex)
        .map((v) => [v.colorHex, { hex: v.colorHex, name: v.color }])
    ).values()
  );

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const availableVariant = (product.variants || []).find((v) => v.stock > 0) || product.variants?.[0] || { id: "default", stock: 10 };
    addToCart(product, availableVariant, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1600);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      className="group relative flex flex-col p-2.5 sm:p-3 rounded-2xl bg-white border border-[#E8E4DC] hover:border-[#B58A52]/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 shine-sweep"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient Gold Bloom Glow behind image */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 sm:w-44 h-36 sm:h-44 rounded-full bg-gradient-to-tr from-[#B58A52]/30 via-[#D4AF37]/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Image Container with Smooth Elevation */}
      <div className="relative aspect-[3/4] w-full rounded-xl bg-[#F4EFE6] overflow-hidden flex items-center justify-center p-1.5 sm:p-2">
        {/* Badges */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 z-20 pointer-events-none">
          {product.isNewArrival && (
            <span className="inline-flex items-center gap-1 bg-[#171717] text-[#FAF8F5] text-[9px] sm:text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md">
              <Sparkles className="w-2.5 h-2.5 text-[#B58A52]" />
              New In
            </span>
          )}
          {product.isBestSeller && !product.isNewArrival && (
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#B58A52] to-[#9E743F] text-[#FAF8F5] text-[9px] sm:text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md">
              Atelier Choice
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 sm:top-3 right-2 sm:right-3 p-2 sm:p-2.5 rounded-full bg-white/90 backdrop-blur-md text-[#171717] hover:text-[#B58A52] hover:bg-white shadow-md transition-all duration-200 z-20 hover:scale-110 active:scale-95 cursor-pointer"
          aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-3.5 sm:w-4 h-3.5 sm:h-4 transition-all duration-200 ${
              isFavorited
                ? "fill-[#B58A52] text-[#B58A52] scale-110"
                : "stroke-[1.6]"
            }`}
          />
        </button>

        {/* Product Image */}
        <Link
          href={`/product/${product.slug}`}
          className="block w-full h-full relative z-10"
        >
          <div className="relative w-full h-full overflow-hidden rounded-lg">
            <Image
              src={isHovered && secondaryImg ? secondaryImg : primaryImg}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              className="object-cover rounded-lg transition-transform duration-500 ease-out sm:group-hover:scale-108"
            />
          </div>
        </Link>

        {/* Quick Add To Bag Floating Action Slider (Desktop/Tablet) */}
        <div className="absolute inset-x-2 sm:inset-x-3 bottom-2 sm:bottom-3 z-30 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out hidden sm:block">
          <button
            onClick={handleQuickAdd}
            className={`w-full py-2.5 sm:py-3 px-3 sm:px-4 flex items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs uppercase tracking-wider font-bold rounded-xl shadow-xl transition-all duration-300 active:scale-95 cursor-pointer ${
              addedAnimation
                ? "bg-[#10B981] text-white"
                : "bg-[#171717] hover:bg-[#B58A52] text-[#FAF8F5]"
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added To Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Metadata & Details */}
      <div className="pt-3 sm:pt-4 pb-1 px-0.5 sm:px-1 flex-1 flex flex-col justify-between space-y-1.5 sm:space-y-2 z-10">
        <div>
          {colorSwatches.length > 0 && (
            <div className="flex items-center gap-1 sm:gap-1.5 pb-1">
              {colorSwatches.slice(0, 4).map((swatch, idx) => (
                <span
                  key={idx}
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-black/15 shadow-xs"
                  style={{ backgroundColor: swatch.hex }}
                  title={swatch.name}
                />
              ))}
              {colorSwatches.length > 4 && (
                <span className="text-[9px] sm:text-[10px] text-[#71717A] font-semibold">
                  +{colorSwatches.length - 4}
                </span>
              )}
            </div>
          )}

          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest font-bold text-[#B58A52] block truncate">
            {product.category} {product.subCategory ? `• ${product.subCategory}` : ""}
          </span>

          <Link
            href={`/product/${product.slug}`}
            className="block group-hover:text-[#B58A52] transition-colors mt-0.5"
          >
            <h3 className="font-serif text-xs sm:text-sm md:text-base font-normal text-[#171717] line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          <p className="text-[11px] sm:text-xs text-[#71717A] line-clamp-1 font-light mt-0.5 hidden sm:block">
            {product.tagline}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-[#F5F2EB]">
          <div className="flex flex-wrap items-baseline gap-1 sm:gap-2">
            <span className="font-serif text-xs sm:text-base md:text-lg font-medium text-[#171717]">
              {format(product.basePricePKR, product.basePriceUSD)}
            </span>
            {product.originalPricePKR && (
              <span className="text-[10px] sm:text-xs text-[#A1A1AA] line-through font-light">
                {format(product.originalPricePKR, product.originalPriceUSD || 0)}
              </span>
            )}
          </div>

          <span className="text-[10px] sm:text-[11px] font-semibold text-[#B58A52] group-hover:underline hidden sm:inline">
            Details →
          </span>
        </div>
      </div>
    </div>
  );
}
