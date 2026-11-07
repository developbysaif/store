"use client";

import React from "react";
import { Star, CheckCircle } from "lucide-react";
import { RECENT_REVIEWS } from "@/lib/mock-data";

export function ReviewsSection() {
  return (
    <section className="py-20 sm:py-28 bg-[#FFFFFF] border-t border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B58A52] block mb-2">
            Client Voices
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#171717]">
            Words from Discerning Patrons
          </h2>
          <p className="text-xs text-[#71717A] mt-2">
            Trusted by style connoisseurs across Pakistan and international metropolises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {RECENT_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="p-6 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-col justify-between space-y-4 hover:border-[#B58A52]/40 transition-colors shadow-xs hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#B58A52]">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#B58A52]" />
                  ))}
                </div>
                <p className="font-serif text-sm text-[#171717] leading-relaxed italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8E4DC] flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-[#171717] flex items-center gap-1">
                    <span>{review.authorName}</span>
                    {review.verifiedBuyer && (
                      <CheckCircle className="w-3 h-3 text-[#10B981]" />
                    )}
                  </div>
                  <div className="text-[11px] text-[#71717A]">{review.location}</div>
                </div>
                <span className="text-[10px] text-[#A1A1AA]">{review.date.split(",")[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
