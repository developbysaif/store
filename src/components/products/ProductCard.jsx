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
      className="group relative flex flex-col p-3 rounded-2xl bg-white border border-[#E8E4DC] hover:border-[#B58A52]/50 hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-2 perspective-1000 shine-sweep"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient Gold Bloom Glow behind image */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full bg-gradient-to-tr from-[#B58A52]/30 via-[#D4AF37]/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Image Container with 3D Pop-Out Effect */}
      <div className="relative aspect-[3/4] w-full rounded-xl bg-[#F4EFE6] overflow-visible flex items-center justify-center p-2">
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-30 pointer-events-none">
          {product.isNewArrival && (
            <span className="inline-flex items-center gap-1 bg-[#171717] text-[#FAF8F5] text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full shadow-md">
              <Sparkles className="w-2.5 h-2.5 text-[#B58A52]" />
              New In
            </span>
          )}
          {product.isBestSeller && !product.isNewArrival && (
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#B58A52] to-[#9E743F] text-[#FAF8F5] text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full shadow-md">
              Atelier Choice
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-[#171717] hover:text-[#B58A52] hover:bg-white shadow-md transition-all duration-300 z-30 hover:scale-110 active:scale-95"
          aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-all duration-300 ${
              isFavorited
                ? "fill-[#B58A52] text-[#B58A52] scale-125 animate-pulse"
                : "stroke-[1.6]"
            }`}
          />
        </button>

        {/* Product Image that POPS OUT on Hover */}
        <Link
          href={`/product/${product.slug}`}
          className="block w-full h-full relative z-10"
        >
          <div className="relative w-full h-full overflow-hidden rounded-lg">
            <Image
              src={isHovered && secondaryImg ? secondaryImg : primaryImg}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={priority}
              className="object-cover rounded-lg transition-all duration-700 ease-out group-hover:scale-112 group-hover:-translate-y-3 group-hover:drop-shadow-2xl"
            />
          </div>
        </Link>

        {/* Quick Add To Bag Floating Action Slider */}
        <div className="absolute inset-x-3 bottom-3 z-30 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 ease-out">
          <button
            onClick={handleQuickAdd}
            className={`w-full py-3 px-4 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold rounded-xl shadow-xl transition-all duration-300 active:scale-95 ${
              addedAnimation
                ? "bg-[#10B981] text-white"
                : "bg-[#171717] hover:bg-[#B58A52] text-[#FAF8F5]"
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added To Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Metadata & Details with Smooth Hover Elevation */}
      <div className="pt-4 pb-2 px-1 flex-1 flex flex-col justify-between space-y-2 z-10">
        <div>
          {colorSwatches.length > 0 && (
            <div className="flex items-center gap-1.5 pb-1.5">
              {colorSwatches.slice(0, 4).map((swatch, idx) => (
                <span
                  key={idx}
                  className="w-3 h-3 rounded-full border border-black/15 shadow-xs transition-transform duration-200 hover:scale-130"
                  style={{ backgroundColor: swatch.hex }}
                  title={swatch.name}
                />
              ))}
              {colorSwatches.length > 4 && (
                <span className="text-[10px] text-[#71717A] font-semibold">
                  +{colorSwatches.length - 4} shades
                </span>
              )}
            </div>
          )}

          <span className="text-[10px] uppercase tracking-widest font-bold text-[#B58A52] block">
            {product.category} {product.subCategory ? `• ${product.subCategory}` : ""}
          </span>

          <Link
            href={`/product/${product.slug}`}
            className="block group-hover:text-[#B58A52] transition-colors mt-0.5"
          >
            <h3 className="font-serif text-sm sm:text-base font-normal text-[#171717] line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-[#71717A] line-clamp-1 font-light mt-0.5">
            {product.tagline}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#F5F2EB]">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-base sm:text-lg font-medium text-[#171717]">
              {format(product.basePricePKR, product.basePriceUSD)}
            </span>
            {product.originalPricePKR && (
              <span className="text-xs text-[#A1A1AA] line-through font-light">
                {format(product.originalPricePKR, product.originalPriceUSD || 0)}
              </span>
            )}
          </div>

          <span className="text-[11px] font-semibold text-[#B58A52] group-hover:underline flex items-center gap-0.5">
            Details →
          </span>
        </div>
      </div>
    </div>
  );
}
