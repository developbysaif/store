import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/context/Providers";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SkipToContent } from "@/components/ui/SkipToContent";
import { storeConfig } from "@/lib/store-config";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/seo";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(storeConfig.siteUrl),
  title: {
    default: `${storeConfig.brandName} — Modern Luxury Fashion, Watches & Fine Goods`,
    template: `%s | ${storeConfig.brandName}`,
  },
  description: storeConfig.subTagline,
  keywords: [
    "luxury clothing Pakistan",
    "mens coats",
    "womens dresses",
    "precision watches",
    "anti-tarnish jewellery",
    "Italian leather bags",
    "cash on delivery Pakistan",
    "international luxury fashion",
  ],
  authors: [{ name: storeConfig.brandName, url: storeConfig.siteUrl }],
  creator: storeConfig.brandName,
  publisher: storeConfig.brandName,
  alternates: {
    canonical: storeConfig.siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: storeConfig.siteUrl,
    siteName: storeConfig.brandName,
    title: `${storeConfig.brandName} — Modern Luxury Fashion & Lifestyle`,
    description: storeConfig.subTagline,
    images: [
      {
        url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=85&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: `${storeConfig.brandName} Luxury Curations`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${storeConfig.brandName} — Modern Luxury Fashion & Lifestyle`,
    description: storeConfig.subTagline,
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=85&w=1200&auto=format&fit=crop",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  const orgSchema = getOrganizationSchema();
  const webSiteSchema = getWebSiteSchema();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171717]">
        <Providers>
          <SkipToContent />
          <AnnouncementBar />
          <Navbar />
          <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
          <CartDrawer />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
