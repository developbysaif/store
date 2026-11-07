"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { PRODUCTS } from "@/lib/mock-data";
import { ArrowRight } from "lucide-react";

export function TrendingGrid() {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { label: "All Curations", value: "all" },
    { label: "Clothing", value: "clothing" },
    { label: "Watches", value: "watches" },
    { label: "Artificial Jewellery", value: "jewellery" },
    { label: "Accessories", value: "accessories" },
  ];

  const filteredProducts =
    activeTab === "all"
      ? PRODUCTS.slice(0, 8)
      : PRODUCTS.filter((p) => p.category === activeTab).slice(0, 8);

  return (
    <section className="py-20 sm:py-28 bg-[#FAF8F5] border-t border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#E8E4DC]">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B58A52] block mb-2">
              Trending Editions
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#171717]">
              The Seasonal Edit
            </h2>
          </div>

          {/* Department Tabs */}
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-1.5 text-xs uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer ${
                  activeTab === tab.value
                    ? "bg-[#171717] text-[#FAF8F5] font-semibold shadow-sm"
                    : "bg-white text-[#71717A] hover:text-[#171717] border border-[#E8E4DC]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View full collection button */}
        <div className="mt-14 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#171717] hover:bg-[#B58A52] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold rounded-lg shadow-md transition-all duration-300 group"
          >
            <span>Explore Complete Boutique</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
