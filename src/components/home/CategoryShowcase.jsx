"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { CATEGORIES } from "@/lib/mock-data";

export function CategoryShowcase() {
  return (
    <section className="py-20 sm:py-28 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#E8E4DC]">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B58A52] flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#B58A52]" />
              <span>Curated Departments</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#171717]">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="mt-4 md:mt-0 text-xs uppercase tracking-[0.16em] font-bold text-[#171717] hover:text-[#B58A52] flex items-center gap-2 transition-all hover:translate-x-1"
          >
            <span>View All Collections</span>
            <ArrowUpRight className="w-4 h-4 text-[#B58A52]" />
          </Link>
        </div>

        {/* Categories Grid: 2 cols on mobile, 3 cols on tablet, 4 cols on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-xl sm:rounded-2xl bg-[#E8E4DC] shadow-md hover:shadow-2xl transition-all duration-500 ease-out sm:hover:-translate-y-2.5 shine-sweep border border-[#E8E4DC] hover:border-[#B58A52]/60"
            >
              {/* Background Photography with Zoom Effect */}
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out sm:group-hover:scale-110"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/90 via-[#171717]/35 to-transparent transition-opacity duration-300 sm:group-hover:opacity-95" />

              {/* Top Category Badge */}
              <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 z-10">
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/20 backdrop-blur-md text-[9px] sm:text-[10px] uppercase font-bold tracking-wider sm:tracking-widest text-[#FAF8F5] border border-white/20">
                  {category.itemCount} Designs
                </span>
              </div>

              {/* Text Overlay & Interactive Arrow */}
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-6 flex flex-col justify-end text-[#FAF8F5] z-10">
                <div className="flex items-end justify-between gap-1 sm:gap-2">
                  <div className="min-w-0">
                    <span className="text-[8px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest text-[#D4AF37] font-bold block mb-0.5 sm:mb-1 truncate">
                      Atelier Vertical
                    </span>
                    <h3 className="font-serif text-sm sm:text-2xl font-normal text-[#FAF8F5] sm:group-hover:translate-x-1.5 transition-transform duration-300 truncate">
                      {category.name}
                    </h3>
                  </div>

                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white sm:group-hover:bg-[#B58A52] sm:group-hover:scale-110 sm:group-hover:rotate-45 transition-all duration-300 shrink-0 shadow-md">
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                  </div>
                </div>

                <p className="text-[11px] sm:text-xs text-[#E5E0D8] line-clamp-1 sm:line-clamp-2 mt-1 sm:mt-2 font-light opacity-90 leading-relaxed hidden sm:block">
                  {category.description}
                </p>

                {/* Animated Bottom Border Indicator */}
                <div className="mt-2 sm:mt-4 w-0 group-hover:w-full h-[2px] bg-[#B58A52] transition-all duration-500 rounded-full" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
