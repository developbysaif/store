import React from "react";
import Image from "next/image";
import Link from "next/link";
import { storeConfig } from "@/lib/store-config";
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Award } from "lucide-react";

export const metadata = {
  title: `About Us — ${storeConfig.brandName} Atelier & Heritage`,
  description: "The story behind our modern luxury fashion and lifestyle house.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B58A52] block">
            The Atelier Story
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#171717] leading-tight">
            Elevating the Everyday to the Exceptional
          </h1>
          <p className="text-sm text-[#71717A] leading-relaxed">
            Founded with an uncompromising conviction that genuine luxury resides in fabric purity, precision horology, and artisanal integrity.
          </p>
        </div>

        {/* Editorial Photo Duo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#E8E4DC] shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"
              alt="Haute couture tailoring"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#E8E4DC] shadow-sm md:mt-10">
            <Image
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop"
              alt="Luxury horology craft"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Pillars */}
        <div className="space-y-6 max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl font-normal text-[#171717] text-center">
            Our Four Disciplines
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 text-xs">
            <div className="p-6 bg-white rounded-xl border border-[#E8E4DC] space-y-2">
              <Award className="w-5 h-5 text-[#B58A52]" />
              <h3 className="font-serif text-base font-medium text-[#171717]">
                1. Sartorial Tailoring & Cashmere
              </h3>
              <p className="text-[#71717A] leading-relaxed">
                We work exclusively with double-faced virgin wools, Mongolian cashmere, and artisanal raw silks crafted to Neapolitan drape proportions.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-[#E8E4DC] space-y-2">
              <ShieldCheck className="w-5 h-5 text-[#B58A52]" />
              <h3 className="font-serif text-base font-medium text-[#171717]">
                2. Fine Horology
              </h3>
              <p className="text-[#71717A] leading-relaxed">
                Engineered with surgical 316L stainless steel, scratch-resistant sapphire crystal glass, and Japanese mecha-quartz chronographs.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-[#E8E4DC] space-y-2">
              <Sparkles className="w-5 h-5 text-[#B58A52]" />
              <h3 className="font-serif text-base font-medium text-[#171717]">
                3. Anti-Tarnish 18K Jewellery
              </h3>
              <p className="text-[#71717A] leading-relaxed">
                Utilizing advanced PVD vacuum gold coating and AAA simulated stones that withstand humidity, perfume, and daily wear without dulling.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-[#E8E4DC] space-y-2">
              <HeartHandshake className="w-5 h-5 text-[#B58A52]" />
              <h3 className="font-serif text-base font-medium text-[#171717]">
                4. Full-Grain Italian Leather
              </h3>
              <p className="text-[#71717A] leading-relaxed">
                Vegetable-tanned calfskin bags and burnished wallets that develop an exquisite natural patina with every journey.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8 border-t border-[#E8E4DC]">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#171717] hover:bg-[#B58A52] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-lg shadow-md transition-colors"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
