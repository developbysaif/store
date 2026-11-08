"use client";

import React from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { ProductCard } from "@/components/products/ProductCard";
import { Heart, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { wishlistProducts, wishlistCount } = useWishlist();

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="pb-8 mb-10 border-b border-[#E8E4DC]">
          <div className="text-xs uppercase tracking-widest text-[#B58A52] font-semibold mb-2">
            Saved Curations
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#171717]">
                Your Personal Wishlist
              </h1>
              <p className="text-xs text-[#71717A] mt-1.5">
                Saved pieces for your private consideration.
              </p>
            </div>
            <div className="text-xs text-[#71717A]">
              <strong>{wishlistCount}</strong> items saved
            </div>
          </div>
        </div>

        {/* Content */}
        {wishlistCount === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-[#E8E4DC] p-8 max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#FAF8F5] text-[#B58A52] flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 stroke-[1.2]" />
            </div>
            <h2 className="font-serif text-2xl font-normal text-[#171717]">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs text-[#71717A] leading-relaxed max-w-md mx-auto">
              You haven&apos;t saved any luxury garments, horology timepieces, or jewellery pieces yet. Explore our latest arrivals to curate your desires.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#171717] hover:bg-[#B58A52] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold rounded-lg shadow-md transition-all"
              >
                <span>Discover Creations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
