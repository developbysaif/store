"use client";

import React, { useState, useEffect } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { storeConfig } from "@/lib/store-config";
import { ChevronDown, Globe, Sparkles } from "lucide-react";

export function AnnouncementBar() {
  const { currency, setCurrency, isPakistanMarket } = useCurrency();
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMsgIndex((prev) => (prev + 1) % storeConfig.announcementMessages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#171717] text-[#FAF8F5] text-xs py-2 px-4 border-b border-[#2A2A2A] relative z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Market indicator */}
        <div className="hidden sm:flex items-center gap-2 text-[#A1A1AA]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B58A52] animate-pulse"></span>
          <span>{isPakistanMarket ? "🇵🇰 Pakistan Domestic Store" : "🌍 International Priority Store"}</span>
        </div>

        {/* Rotating message */}
        <div className="flex-1 text-center font-medium tracking-wide flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#B58A52] inline-block" />
          <span className="transition-all duration-500 ease-in-out">
            {storeConfig.announcementMessages[currentMsgIndex]}
          </span>
        </div>

        {/* Currency Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 text-xs text-[#FAF8F5] hover:text-[#B58A52] transition-colors py-0.5 px-2 rounded border border-[#333333] hover:border-[#B58A52]"
            aria-label="Select currency"
          >
            <Globe className="w-3.5 h-3.5 text-[#B58A52]" />
            <span className="font-semibold">{currency}</span>
            <ChevronDown className="w-3 h-3 text-[#A1A1AA]" />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-1.5 w-44 bg-[#1F1F1F] border border-[#333333] rounded shadow-2xl py-1 z-50 text-[#FAF8F5]">
                <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-[#888888] border-b border-[#2C2C2C]">
                  Select Market / Currency
                </div>
                {storeConfig.supportedCurrencies.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCurrency(c.code);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#2C2C2C] transition-colors ${
                      currency === c.code ? "text-[#B58A52] font-semibold bg-[#262626]" : ""
                    }`}
                  >
                    <span>
                      {c.name} ({c.symbol})
                    </span>
                    <span className="text-[11px] text-[#A1A1AA]">{c.code}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
