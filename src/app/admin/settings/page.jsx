"use client";

import React, { useState, useEffect } from "react";
import { storeConfig } from "@/lib/store-config";
import { Save, Check, RefreshCw, Sparkles, Building, Globe } from "lucide-react";

export default function AdminSettingsPage() {
  const [brandName, setBrandName] = useState(storeConfig.brandName);
  const [brandMonogram, setBrandMonogram] = useState(storeConfig.brandMonogram);
  const [tagline, setTagline] = useState(storeConfig.tagline);
  const [phone, setPhone] = useState(storeConfig.contactPhone);
  const [whatsapp, setWhatsapp] = useState(storeConfig.whatsappNumber);
  const [email, setEmail] = useState(storeConfig.contactEmail);
  const [address, setAddress] = useState(storeConfig.address);
  const [freeShippingPKR, setFreeShippingPKR] = useState(storeConfig.freeShippingThresholdPKR);
  const [freeShippingUSD, setFreeShippingUSD] = useState(storeConfig.freeShippingThresholdUSD);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.settings) {
          const s = data.settings;
          if (s.brandName) setBrandName(s.brandName);
          if (s.brandMonogram) setBrandMonogram(s.brandMonogram);
          if (s.tagline) setTagline(s.tagline);
          if (s.contactPhone) setPhone(s.contactPhone);
          if (s.whatsappNumber) setWhatsapp(s.whatsappNumber);
          if (s.contactEmail) setEmail(s.contactEmail);
          if (s.address) setAddress(s.address);
          if (s.freeShippingThresholdPKR) setFreeShippingPKR(s.freeShippingThresholdPKR);
          if (s.freeShippingThresholdUSD) setFreeShippingUSD(s.freeShippingThresholdUSD);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      brandName,
      brandMonogram,
      tagline,
      contactPhone: phone,
      whatsappNumber: whatsapp,
      contactEmail: email,
      address,
      freeShippingThresholdPKR: Number(freeShippingPKR),
      freeShippingThresholdUSD: Number(freeShippingUSD),
    };

    // Update in-memory store config
    Object.assign(storeConfig, payload);

    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#171717]">
          Store Settings & Brand Configuration
        </h1>
        <p className="text-xs text-[#71717A]">
          Configure your luxury brand identity, localized shipping rules, and contact information.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600" />
          <span>Brand configuration and shipping settings saved successfully to database!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Identity Card */}
        <div className="bg-white rounded-2xl border border-[#E5E5E9] p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#171717] pb-2 border-b border-[#F0ECE3] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B58A52]" />
            Brand Identity (Configurable)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="uppercase tracking-wider font-semibold text-[#171717] block mb-1.5">
                Brand Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E5E9] rounded-xl text-[#171717] font-serif text-sm"
              />
              <span className="text-[10px] text-[#71717A] mt-1 block">
                Updates logo text in Header, Footer, and Invoices.
              </span>
            </div>

            <div>
              <label className="uppercase tracking-wider font-semibold text-[#171717] block mb-1.5">
                Brand Monogram
              </label>
              <input
                type="text"
                value={brandMonogram}
                onChange={(e) => setBrandMonogram(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E5E9] rounded-xl text-[#171717] font-serif text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="uppercase tracking-wider font-semibold text-[#171717] block mb-1.5">
                Editorial Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E5E9] rounded-xl text-[#171717]"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Thresholds Card */}
        <div className="bg-white rounded-2xl border border-[#E5E5E9] p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#171717] pb-2 border-b border-[#F0ECE3] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#B58A52]" />
            Shipping & Free Delivery Thresholds
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="uppercase tracking-wider font-semibold text-[#171717] block mb-1.5">
                Pakistan Free Express Delivery Threshold (PKR)
              </label>
              <input
                type="number"
                value={freeShippingPKR}
                onChange={(e) => setFreeShippingPKR(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E5E9] rounded-xl text-[#171717]"
              />
              <span className="text-[10px] text-[#71717A] mt-1 block">
                Current: Free delivery on domestic orders over ₨ {freeShippingPKR?.toLocaleString()}
              </span>
            </div>

            <div>
              <label className="uppercase tracking-wider font-semibold text-[#171717] block mb-1.5">
                International Free Shipping Threshold (USD)
              </label>
              <input
                type="number"
                value={freeShippingUSD}
                onChange={(e) => setFreeShippingUSD(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E5E9] rounded-xl text-[#171717]"
              />
              <span className="text-[10px] text-[#71717A] mt-1 block">
                Current: Free international DHL on orders over ${freeShippingUSD}
              </span>
            </div>
          </div>
        </div>

        {/* Contact & Location Details */}
        <div className="bg-white rounded-2xl border border-[#E5E5E9] p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#171717] pb-2 border-b border-[#F0ECE3] flex items-center gap-2">
            <Building className="w-4 h-4 text-[#B58A52]" />
            Atelier Contact & Location
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="uppercase tracking-wider font-semibold text-[#171717] block mb-1.5">
                Telephone Helpline
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E5E9] rounded-xl text-[#171717]"
              />
            </div>

            <div>
              <label className="uppercase tracking-wider font-semibold text-[#171717] block mb-1.5">
                WhatsApp Concierge Number
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E5E9] rounded-xl text-[#171717]"
              />
            </div>

            <div>
              <label className="uppercase tracking-wider font-semibold text-[#171717] block mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E5E9] rounded-xl text-[#171717]"
              />
            </div>

            <div>
              <label className="uppercase tracking-wider font-semibold text-[#171717] block mb-1.5">
                Flagship Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E5E9] rounded-xl text-[#171717]"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-[#171717] hover:bg-[#B58A52] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "Saving..." : "Save Configuration"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
