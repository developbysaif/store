import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { storeConfig } from "@/lib/store-config";
import { ArrowLeft, ShieldCheck, Truck, RotateCcw, HelpCircle } from "lucide-react";

export async function generateMetadata({ params }) {
  const { type } = await params;
  const titles = {
    shipping: "Shipping & Courier Logistics Policy",
    returns: "14-Day Returns & Exchange Privilege",
    "size-guide": "Sartorial Sizing & Fit Guide",
    terms: "Terms of Service",
    privacy: "Privacy Policy & Data Security",
  };

  return {
    title: `${titles[type] || "Store Policy"} — ${storeConfig.brandName}`,
  };
}

export default async function PolicyPage({ params }) {
  const { type } = await params;

  const validTypes = ["shipping", "returns", "size-guide", "terms", "privacy"];
  if (!validTypes.includes(type)) {
    notFound();
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#71717A] hover:text-[#171717] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Storefront</span>
        </Link>

        {type === "shipping" && (
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-6">
            <div className="flex items-center gap-3 text-[#B58A52]">
              <Truck className="w-7 h-7 stroke-[1.4]" />
              <h1 className="font-serif text-3xl text-[#171717]">
                Shipping & Delivery Logistics
              </h1>
            </div>

            <div className="text-xs text-[#71717A] leading-relaxed space-y-4">
              <h2 className="font-serif text-base font-semibold text-[#171717]">
                1. Domestic Delivery (Pakistan)
              </h2>
              <p>
                All domestic orders are fulfilled via our premium express logistics partners (Leopard Courier, TCS Express, and Trax). Consignments destined for major metropolitan areas (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad) conclude delivery within <strong>2 to 3 business days</strong>. Remote districts conclude within <strong>3 to 5 business days</strong>.
              </p>
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E4DC] text-[#171717]">
                <strong>Complimentary Delivery:</strong> Domestic orders with a cart value exceeding <strong>₨ {storeConfig.freeShippingThresholdPKR.toLocaleString()}</strong> enjoy 100% free express delivery. Standard orders incur a flat rate of ₨ {storeConfig.standardShippingPKR}.
              </div>

              <h2 className="font-serif text-base font-semibold text-[#171717] pt-2">
                2. Cash on Delivery (COD) Nationwide
              </h2>
              <p>
                We provide unconditional Cash on Delivery across Pakistan. Our concierge will initiate a prompt telephone call or WhatsApp verification to ensure the recipient is available at the provided street address prior to dispatch.
              </p>

              <h2 className="font-serif text-base font-semibold text-[#171717] pt-2">
                3. International Priority Logistics (DHL Express)
              </h2>
              <p>
                International parcels are dispatched via DHL Express with signature confirmation. Typical transit time is <strong>4 to 7 business days worldwide</strong>. Custom clearance and import duties, where applicable in destination nations, are handled smoothly by DHL.
              </p>
            </div>
          </div>
        )}

        {type === "returns" && (
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-6">
            <div className="flex items-center gap-3 text-[#B58A52]">
              <RotateCcw className="w-7 h-7 stroke-[1.4]" />
              <h1 className="font-serif text-3xl text-[#171717]">
                14-Day Exchange & Returns Privilege
              </h1>
            </div>

            <div className="text-xs text-[#71717A] leading-relaxed space-y-4">
              <p>
                We wish every patron to be thoroughly enchanted with their acquisition. If an item does not meet your exacting standards in fit or aesthetic, we offer a seamless 14-day exchange or return process.
              </p>
              <h2 className="font-serif text-base font-semibold text-[#171717]">
                Conditions for Return
              </h2>
              <ul className="list-disc list-inside space-y-1 text-[#171717]">
                <li>Merchandise must be unworn, unwashed, with all original tags attached.</li>
                <li>Horology and jewellery pieces must include their bespoke boxes, documentation, and protective seals intact.</li>
                <li>Requests must be initiated within 14 calendar days from documented receipt.</li>
              </ul>
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E4DC]">
                To initiate a courier pickup exchange, contact our Concierge team at <strong>{storeConfig.contactEmail}</strong> or via WhatsApp at <strong>{storeConfig.whatsappNumber}</strong>.
              </div>
            </div>
          </div>
        )}

        {type === "size-guide" && (
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-6">
            <div className="flex items-center gap-3 text-[#B58A52]">
              <HelpCircle className="w-7 h-7 stroke-[1.4]" />
              <h1 className="font-serif text-3xl text-[#171717]">
                Sartorial Sizing & Fit Directory
              </h1>
            </div>

            <div className="text-xs text-[#71717A] leading-relaxed space-y-4">
              <p>
                Our collections are cut with precise modern tailoring proportions. Review the metric and imperial tables below:
              </p>

              <h2 className="font-serif text-base font-semibold text-[#171717]">
                Clothing Dimensions (Inches)
              </h2>
              <table className="w-full text-left border-collapse border border-[#E8E4DC]">
                <thead>
                  <tr className="bg-[#FAF8F5] text-[#171717]">
                    <th className="p-2.5 border border-[#E8E4DC]">Size</th>
                    <th className="p-2.5 border border-[#E8E4DC]">Chest</th>
                    <th className="p-2.5 border border-[#E8E4DC]">Waist</th>
                    <th className="p-2.5 border border-[#E8E4DC]">Shoulder</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2.5 border border-[#E8E4DC] font-semibold">Small (S)</td>
                    <td className="p-2.5 border border-[#E8E4DC]">36 - 38&quot;</td>
                    <td className="p-2.5 border border-[#E8E4DC]">29 - 31&quot;</td>
                    <td className="p-2.5 border border-[#E8E4DC]">17.5&quot;</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-[#E8E4DC] font-semibold">Medium (M)</td>
                    <td className="p-2.5 border border-[#E8E4DC]">39 - 41&quot;</td>
                    <td className="p-2.5 border border-[#E8E4DC]">32 - 34&quot;</td>
                    <td className="p-2.5 border border-[#E8E4DC]">18.2&quot;</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-[#E8E4DC] font-semibold">Large (L)</td>
                    <td className="p-2.5 border border-[#E8E4DC]">42 - 44&quot;</td>
                    <td className="p-2.5 border border-[#E8E4DC]">35 - 37&quot;</td>
                    <td className="p-2.5 border border-[#E8E4DC]">19.0&quot;</td>
                  </tr>
                </tbody>
              </table>

              <h2 className="font-serif text-base font-semibold text-[#171717] pt-2">
                Horology Wrist Fit
              </h2>
              <p>
                Our 41mm chronographs suit wrist sizes between 6.2 inches and 8.0 inches. Petite 32mm mother of pearl dials are designed for wrists from 5.5 inches to 7.0 inches.
              </p>
            </div>
          </div>
        )}

        {(type === "terms" || type === "privacy") && (
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E8E4DC] shadow-xs space-y-6">
            <div className="flex items-center gap-3 text-[#B58A52]">
              <ShieldCheck className="w-7 h-7 stroke-[1.4]" />
              <h1 className="font-serif text-3xl text-[#171717]">
                {type === "terms" ? "Terms of Service" : "Privacy & Data Protection"}
              </h1>
            </div>

            <div className="text-xs text-[#71717A] leading-relaxed space-y-3">
              <p>
                This agreement governs your patronage of <strong>{storeConfig.brandName}</strong>. By visiting our boutique storefront and transacting purchases, you acknowledge and consent to our luxury standards, secure processing mechanisms, and respectful handling of patron confidentiality.
              </p>
              <p>
                Customer payment data is handled exclusively via PCI-DSS Level 1 certified tokenized gateways. We never retain unencrypted card numbers on our servers.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
