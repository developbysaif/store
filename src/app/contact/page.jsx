"use client";

import React, { useState } from "react";
import { storeConfig } from "@/lib/store-config";
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B58A52] block">
            Client Concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#171717]">
            How May We Assist You?
          </h1>
          <p className="text-xs text-[#71717A]">
            Whether you seek bespoke sizing advice, watch specifications, or order assistance, our Lahore concierge is at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 bg-white p-8 rounded-2xl border border-[#E8E4DC] space-y-6 shadow-xs">
            <h2 className="font-serif text-xl font-normal text-[#171717]">
              Atelier Flagship & Private Salon
            </h2>

            <div className="space-y-4 text-xs text-[#71717A]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#B58A52] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#171717] block">Boutique Address</strong>
                  <span>{storeConfig.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#B58A52] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#171717] block">Telephone Concierge</strong>
                  <span>{storeConfig.contactPhone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#B58A52] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#171717] block">Electronic Inquiries</strong>
                  <span>{storeConfig.contactEmail}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F0ECE3]">
              <a
                href={`https://wa.me/${storeConfig.whatsappNumber}?text=Assalam-o-Alaikum,%20I%20have%20an%20inquiry%20regarding%20your%20collection`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-[#25D366] text-white text-xs uppercase tracking-wider font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-[#20ba59] transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-[#E8E4DC] shadow-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto" />
                <h3 className="font-serif text-xl text-[#171717]">
                  Thank You For Reaching Out
                </h3>
                <p className="text-xs text-[#71717A] max-w-sm mx-auto leading-relaxed">
                  Your inquiry has been routed to our senior concierge team. We typically respond within 2 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h2 className="font-serif text-xl font-normal text-[#171717] pb-2 border-b border-[#F0ECE3]">
                  Direct Message
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="uppercase tracking-wider font-semibold text-[#171717] block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Usman Sheikh"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8E4DC] rounded-lg text-[#171717]"
                    />
                  </div>
                  <div>
                    <label className="uppercase tracking-wider font-semibold text-[#171717] block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0300-1234567"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8E4DC] rounded-lg text-[#171717]"
                    />
                  </div>
                </div>

                <div>
                  <label className="uppercase tracking-wider font-semibold text-[#171717] block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patron@example.com"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8E4DC] rounded-lg text-[#171717]"
                  />
                </div>

                <div>
                  <label className="uppercase tracking-wider font-semibold text-[#171717] block mb-1">
                    Inquiry Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please specify piece names, sizing questions or order inquiries..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8E4DC] rounded-lg text-[#171717]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#171717] hover:bg-[#B58A52] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message to Concierge</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
