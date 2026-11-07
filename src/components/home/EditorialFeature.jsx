"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export function EditorialFeature() {
  return (
    <section className="py-20 sm:py-28 bg-[#FFFFFF] border-t border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Images Duo */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 relative">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-md bg-[#E8E4DC]">
              <Image
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop"
                alt="Horology and precision timepieces"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-md bg-[#E8E4DC] mt-8 sm:mt-12">
              <Image
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop"
                alt="Fine 18K gold-plated jewellery"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 left-6 sm:left-12 bg-[#FAF8F5] border border-[#B58A52]/40 rounded-xl p-4 shadow-xl max-w-xs hidden sm:block">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#B58A52] block mb-1">
                Material Authenticity
              </span>
              <p className="font-serif text-sm text-[#171717]">
                Hypoallergenic PVD vacuum plating & certified genuine Italian leathers.
              </p>
            </div>
          </div>

          {/* Editorial Narrative */}
          <div className="space-y-6 lg:pl-6">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B58A52] block">
              The Atelier Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#171717] leading-[1.15]">
              Designed with Intention. <br />
              <span className="italic font-light text-[#71717A]">Crafted for Longevity.</span>
            </h2>
            <p className="text-sm text-[#71717A] leading-relaxed">
              We reject transient fast fashion in favour of enduring elegance. Each garment, watch, and piece of jewellery in our catalog is engineered to withstand daily wear while maintaining a quiet, confident luxury.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#F7F3EB] text-[#B58A52] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-[#171717]">
                    Sartorial Integrity & Eastern Heritage
                  </h4>
                  <p className="text-xs text-[#71717A]">
                    Pure Mongolian cashmere, Italian Super 130s wool, and hand-worked raw silks from master Pakistani artisans.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#F7F3EB] text-[#B58A52] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-[#171717]">
                    Horological Excellence
                  </h4>
                  <p className="text-xs text-[#71717A]">
                    Dual sapphire crystal glasses, mecha-quartz chronographs, and surgical 316L stainless steel cases backed by a 2-year warranty.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#F7F3EB] text-[#B58A52] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-[#171717]">
                    Anti-Tarnish Lifetime Guarantee
                  </h4>
                  <p className="text-xs text-[#71717A]">
                    Advanced PVD gold coating designed to resist sweat, water, and humidity for flawless everyday wear.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-[#171717] hover:text-[#B58A52] border-b border-[#171717] pb-1 transition-colors"
              >
                <span>Discover The Brand Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
