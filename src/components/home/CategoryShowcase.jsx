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

        {/* Categories Grid with 3D Elevation & Shine Sweep */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-[#E8E4DC] shadow-md hover:shadow-2xl transition-all duration-700 ease-out hover:-translate-y-3 shine-sweep perspective-1000 border border-[#E8E4DC] hover:border-[#B58A52]/60"
            >
              {/* Background Photography with Zoom Effect */}
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-115 group-hover:rotate-1"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/90 via-[#171717]/35 to-transparent transition-opacity duration-500 group-hover:opacity-95" />

              {/* Top Category Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] uppercase font-bold tracking-widest text-[#FAF8F5] border border-white/20">
                  {category.itemCount} Designs
                </span>
              </div>

              {/* Text Overlay & Interactive Arrow */}
              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end text-[#FAF8F5] z-10">
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">
                      Atelier Vertical
                    </span>
                    <h3 className="font-serif text-2xl font-normal text-[#FAF8F5] group-hover:translate-x-1.5 transition-transform duration-300">
                      {category.name}
                    </h3>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#B58A52] group-hover:scale-115 group-hover:rotate-45 transition-all duration-300 shrink-0 shadow-lg">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-xs text-[#E5E0D8] line-clamp-2 mt-2 font-light opacity-90 leading-relaxed">
                  {category.description}
                </p>

                {/* Animated Bottom Border Indicator */}
                <div className="mt-4 w-0 group-hover:w-full h-[2px] bg-[#B58A52] transition-all duration-500 rounded-full" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
