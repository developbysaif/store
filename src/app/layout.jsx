import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/context/Providers";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { storeConfig } from "@/lib/store-config";

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
  title: `${storeConfig.brandName} — Modern Luxury Fashion & Lifestyle`,
  description: storeConfig.subTagline,
  keywords: [
    "luxury clothing",
    "watches",
    "artificial jewellery",
    "leather accessories",
    "pakistan fashion",
    "international luxury e-commerce",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable} antialiased`}
    >
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171717]">
        <Providers>
          <AnnouncementBar />
          <Navbar />
          <div className="flex-1">{children}</div>
          <CartDrawer />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
