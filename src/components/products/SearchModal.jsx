"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import { PRODUCTS } from "@/lib/mock-data";
import { useCurrency } from "@/context/CurrencyContext";

export function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { format } = useCurrency();

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length === 0) {
      setResults([]);
      return;
    }

    const filtered = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(trimmed) ||
        p.category.toLowerCase().includes(trimmed) ||
        p.subCategory?.toLowerCase().includes(trimmed) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(trimmed))) ||
        p.description.toLowerCase().includes(trimmed)
    );
    setResults(filtered);
  }, [query]);

  if (!isOpen) return null;

  const quickPills = ["Cashmere", "Chronograph", "Gold Choker", "Calfskin Tote", "Raw Silk", "Couple Watches"];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div
        className="fixed inset-0 bg-[#171717]/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-xl shadow-2xl border border-[#E8E4DC] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center px-4 sm:px-6 py-4 border-b border-[#E8E4DC] bg-white">
          <Search className="w-5 h-5 text-[#B58A52] mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search clothing, watches, jewellery, accessories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-base sm:text-lg bg-transparent text-[#171717] placeholder:text-[#A1A1AA] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-[#A1A1AA] hover:text-[#171717] p-1 text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 ml-2 text-[#71717A] hover:text-[#171717] rounded-full hover:bg-[#F4EFE6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
          {query.trim().length === 0 ? (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#71717A] mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#B58A52]" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickPills.map((pill) => (
                  <button
                    key={pill}
                    onClick={() => setQuery(pill)}
                    className="text-xs px-3 py-1.5 rounded-full bg-white border border-[#E8E4DC] text-[#171717] hover:border-[#B58A52] hover:text-[#B58A52] transition-colors"
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              <div className="text-xs text-[#71717A] pb-1 border-b border-[#E8E4DC] flex justify-between">
                <span>{results.length} pieces found</span>
                <Link
                  href={`/shop?search=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="text-[#B58A52] hover:underline flex items-center gap-1"
                >
                  View full catalog <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-2.5 rounded-lg bg-white hover:bg-[#F7F3EB] border border-transparent hover:border-[#E8E4DC] transition-all group"
                  >
                    <div className="relative w-14 h-16 rounded overflow-hidden bg-[#E8E4DC] shrink-0">
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        sizes="56px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] uppercase tracking-wider text-[#B58A52] font-medium">
                        {product.category} {product.subCategory ? `• ${product.subCategory}` : ""}
                      </div>
                      <h4 className="text-sm font-medium text-[#171717] truncate font-serif">
                        {product.name}
                      </h4>
                      <p className="text-xs text-[#71717A] truncate">
                        {product.tagline}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-semibold text-[#171717]">
                        {format(product.basePricePKR, product.basePriceUSD)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-[#71717A]">
                No luxury items matched &ldquo;{query}&rdquo;.
              </p>
              <p className="text-xs text-[#A1A1AA] mt-1">
                Try searching for &quot;Coat&quot;, &quot;Watch&quot;, &quot;Earrings&quot;, or &quot;Tote&quot;.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
