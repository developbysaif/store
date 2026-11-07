"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck, Award } from "lucide-react";

export function Hero() {
  return (
    <section className="relative w-full bg-[#121212] text-[#FAF8F5] overflow-hidden min-h-[86vh] flex items-center">
      {/* Editorial High-Resolution Background with Parallax Scale */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=85&w=2000&auto=format&fit=crop"
          alt="High fashion luxury editorial model in wool coat"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-50 scale-100 hover:scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Cinematic Multi-Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-36 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Headline & CTAs (7 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs tracking-widest uppercase text-[#FAF8F5] border border-white/20 animate-float shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-[#B58A52] animate-pulse" />
              <span>Spring / Summer 2026 Collection</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight text-[#FAF8F5]">
              Timeless Design. <br />
              <span className="italic font-light text-[#E8E4DC] underline decoration-[#B58A52]/60 decoration-wavy decoration-1 underline-offset-8">
                Modern Essence.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#D4D4D8] leading-relaxed font-light max-w-xl">
              Impeccably tailored coats, precision Swiss-inspired horology, 18K gold-plated jewellery, and Italian calfskin leather. Crafted for a life well-lived.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/shop?gender=WOMEN"
                className="px-9 py-4 bg-[#FAF8F5] text-[#171717] hover:bg-[#B58A52] hover:text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 rounded-lg shadow-2xl hover:scale-105 hover:-translate-y-1 shine-sweep"
              >
                Shop Women
              </Link>
              <Link
                href="/shop?gender=MEN"
                className="px-9 py-4 bg-transparent border-2 border-[#FAF8F5]/70 text-[#FAF8F5] hover:bg-white hover:text-[#171717] text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 rounded-lg backdrop-blur-sm hover:scale-105 hover:-translate-y-1"
              >
                Shop Men
              </Link>
            </div>
          </div>

          {/* Floating Luxury Quality Pill (5 cols desktop) */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-4 items-end">
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl max-w-xs space-y-3 animate-float">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <Award className="w-5 h-5" />
                <span className="text-[11px] uppercase font-bold tracking-widest text-[#FAF8F5]">
                  Sartorial Distinction
                </span>
              </div>
              <p className="text-xs text-[#E5E0D8] leading-relaxed font-light">
                Every piece undergoes a multi-point inspection in our Lahore salon before courier dispatch.
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] text-[#A1A1AA] border-t border-white/10">
                <span>Free Express Delivery</span>
                <span className="text-[#10B981] font-semibold">● In Stock</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white max-w-xs flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#B58A52] shrink-0" />
              <span>Cash on Delivery (COD) available across Pakistan & DHL worldwide.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
