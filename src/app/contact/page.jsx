import React from "react";
import { storeConfig } from "@/lib/store-config";
import { ContactClient } from "./ContactClient";

export const metadata = {
  title: `Client Concierge & Salon Contact — ${storeConfig.brandName}`,
  description:
    "Connect with our luxury fashion and horology concierge. Inquire about bespoke tailoring, watch specifications, or order assistance across Pakistan and worldwide.",
  alternates: {
    canonical: `${storeConfig.siteUrl}/contact`,
  },
  openGraph: {
    title: `Client Concierge & Salon Contact — ${storeConfig.brandName}`,
    description:
      "Connect with our luxury fashion and horology concierge. Inquire about bespoke tailoring, watch specifications, or order assistance across Pakistan and worldwide.",
    url: `${storeConfig.siteUrl}/contact`,
    siteName: storeConfig.brandName,
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
