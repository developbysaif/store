"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { storeConfig } from "@/lib/store-config";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCurrency } from "@/context/CurrencyContext";
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Globe,
} from "lucide-react";
import { SearchModal } from "@/components/products/SearchModal";

export function Navbar() {
  const pathname = usePathname();
  const { itemsCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { currency } = useCurrency();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const departments = [
    {
      label: "New Arrivals",
      href: "/shop?filter=new",
      isNewBadge: true,
      subcategories: ["Spring/Summer 2026", "Atelier Exclusives", "Trending Now", "Curator's Choice"],
      previewImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop",
      highlight: "Inaugural Seasonal Launch",
    },
    {
      label: "Clothing",
      href: "/category/clothing",
      subcategories: ["Cashmere Overcoats", "Mulberry Silk Shirts", "Italian Wool Blazers", "Raw Silk Kurta Sets"],
      previewImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop",
      highlight: "Virgin Wool & Pure Silk",
    },
    {
      label: "Watches",
      href: "/category/watches",
      subcategories: ["Rose Gold Chronographs", "Mother of Pearl 32mm", "Milanese Mesh Couple Pairs", "Minimalist Dress Watches"],
      previewImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop",
      highlight: "Sapphire Crystal & Mecha-Quartz",
    },
    {
      label: "Jewellery",
      href: "/category/jewellery",
      subcategories: ["18K PVD Gold Chokers", "Tennis Necklaces", "Pavé Ribbed Hoops", "Eternity Cocktail Rings"],
      previewImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop",
      highlight: "Guaranteed Anti-Tarnish Lifetime",
    },
    {
      label: "Accessories",
      href: "/category/accessories",
      subcategories: ["Florentine Calfskin Totes", "Full-Grain Wallets", "Pure Silk Twill Scarves", "Acetate Sunglasses"],
      previewImage: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop",
      highlight: "Vegetable-Tanned Italian Leather",
    },
    {
      label: "Women",
      href: "/shop?gender=WOMEN",
    },
    {
      label: "Men",
      href: "/shop?gender=MEN",
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-xl border-b border-[#E8E4DC] transition-all duration-300 shadow-xs">
        {/* Tier 1: Main Header (Search - Brand - Actions) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-22">
            {/* Left: Mobile hamburger & Desktop Live Search Pill */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 text-[#171717] hover:text-[#B58A52] transition-colors lg:hidden"
                aria-label="Open navigation drawer"
              >
                <Menu className="w-6 h-6 stroke-[1.5]" />
              </button>

              <button
                onClick={() => setSearchOpen(true)}
                className="hidden lg:flex items-center gap-3 px-3.5 py-2 rounded-full bg-white/80 border border-[#E8E4DC] hover:border-[#B58A52] text-[#71717A] hover:text-[#171717] transition-all shadow-xs group w-64"
              >
                <Search className="w-4 h-4 text-[#B58A52] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-light">Search luxury pieces...</span>
                <kbd className="ml-auto text-[10px] bg-[#FAF8F5] border border-[#E8E4DC] px-1.5 py-0.5 rounded text-[#A1A1AA] font-mono">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Center: Brand Identity */}
            <div className="text-center px-4">
              <Link href="/" className="inline-block group py-1">
                <div className="flex items-center justify-center gap-2">
                  <span className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-[0.22em] font-normal text-[#171717] group-hover:text-[#B58A52] transition-colors duration-300">
                    {storeConfig.brandName}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B58A52] group-hover:scale-125 transition-transform" />
                </div>
                <div className="text-[9px] uppercase tracking-[0.35em] text-[#71717A] group-hover:text-[#171717] transition-colors font-medium mt-0.5">
                  Haute Couture & Lifestyle Atelier
                </div>
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="lg:hidden p-2 text-[#171717] hover:text-[#B58A52] transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 stroke-[1.5]" />
              </button>

              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#E8E4DC] text-xs font-semibold text-[#171717]">
                <Globe className="w-3.5 h-3.5 text-[#B58A52]" />
                <span>{currency}</span>
              </div>

              <Link
                href="/wishlist"
                className="p-2 text-[#171717] hover:text-[#B58A52] transition-colors relative group"
                title="Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.5] group-hover:scale-110 transition-transform" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#B58A52] text-[#FAF8F5] text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/admin"
                className="hidden md:flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-[#171717] hover:text-[#B58A52] px-3 py-1.5 border border-[#E8E4DC] hover:border-[#B58A52] rounded-full bg-white shadow-xs transition-all hover:shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#B58A52]" />
                <span>Admin</span>
              </Link>

              <button
                onClick={openCartDrawer}
                className="p-2 text-[#171717] hover:text-[#B58A52] transition-colors relative flex items-center group"
                aria-label="Shopping bag"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 stroke-[1.5] group-hover:scale-110 transition-transform duration-200" />
                  {itemsCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 bg-[#171717] text-[#FAF8F5] text-[10px] font-bold rounded-full flex items-center justify-center shadow-md border border-white">
                      {itemsCount}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Tier 2: Navigation Links */}
        <div className="hidden lg:block border-t border-[#E8E4DC]/80 bg-[#FAF8F5]/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-center gap-8 h-12 relative">
              {departments.map((dept) => {
                const isActive = pathname === dept.href;
                const isHovered = activeDropdown === dept.label;

                return (
                  <div
                    key={dept.label}
                    className="relative py-2"
                    onMouseEnter={() => dept.subcategories && setActiveDropdown(dept.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={dept.href}
                      className={`text-[12px] tracking-[0.16em] uppercase font-semibold transition-all duration-200 flex items-center gap-1.5 py-1 ${
                        isActive || isHovered
                          ? "text-[#B58A52]"
                          : "text-[#171717] hover:text-[#B58A52]"
                      }`}
                    >
                      <span>{dept.label}</span>
                      {dept.isNewBadge && (
                        <span className="text-[9px] bg-[#B58A52] text-white px-1.5 py-0.2 rounded-full font-bold tracking-normal animate-pulse">
                          NEW
                        </span>
                      )}
                      {dept.subcategories && (
                        <ChevronDown
                          className={`w-3 h-3 text-[#A1A1AA] transition-transform duration-200 ${
                            isHovered ? "rotate-180 text-[#B58A52]" : ""
                          }`}
                        />
                      )}
                    </Link>

                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-[#B58A52] transition-all duration-300 rounded-full ${
                        isActive || isHovered ? "w-full" : "w-0"
                      }`}
                    />

                    {dept.subcategories && isHovered && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-[520px] bg-white rounded-xl shadow-2xl border border-[#E8E4DC] p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="grid grid-cols-2 gap-6 items-center">
                          <div className="space-y-3">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B58A52] block">
                              Curated Collections
                            </span>
                            <div className="space-y-1.5">
                              {dept.subcategories.map((sub) => (
                                <Link
                                  key={sub}
                                  href={`${dept.href}?sub=${encodeURIComponent(sub)}`}
                                  className="block text-xs font-medium text-[#171717] hover:text-[#B58A52] hover:translate-x-1 transition-all py-1 border-b border-[#F5F2EB]"
                                >
                                  {sub}
                                </Link>
                              ))}
                            </div>
                            <Link
                              href={dept.href}
                              className="inline-flex items-center gap-1.5 text-xs text-[#B58A52] font-semibold hover:underline pt-2"
                            >
                              <span>Explore All {dept.label}</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>

                          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#E8E4DC] group/card shadow-sm">
                            <Image
                              src={dept.previewImage}
                              alt={dept.label}
                              fill
                              sizes="240px"
                              className="object-cover group-hover/card:scale-108 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-3.5 text-white">
                              <span className="text-[9px] uppercase tracking-wider font-bold text-[#D4AF37] block">
                                Atelier Highlight
                              </span>
                              <div className="font-serif text-sm font-medium text-white">
                                {dept.highlight}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-[#171717]/65 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between py-6 px-6 z-50 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E8E4DC]">
                <div>
                  <span className="font-serif text-xl font-bold tracking-wider block">
                    {storeConfig.brandName}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-[#71717A]">
                    Haute Couture Atelier
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#71717A] hover:text-[#171717] rounded-full hover:bg-white transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              <div className="py-6 space-y-3">
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#B58A52]">
                  Explore Collections
                </div>
                {departments.map((dept) => (
                  <Link
                    key={dept.label}
                    href={dept.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between text-sm font-semibold text-[#171717] hover:text-[#B58A52] py-2 border-b border-[#F0ECE3]"
                  >
                    <span className="flex items-center gap-2">
                      {dept.label}
                      {dept.isNewBadge && (
                        <span className="text-[9px] bg-[#B58A52] text-white px-1.5 py-0.2 rounded font-bold">
                          NEW
                        </span>
                      )}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#A1A1AA]" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#E8E4DC] space-y-3">
              <Link
                href="/order-tracking"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs uppercase tracking-wider text-[#71717A] hover:text-[#171717]"
              >
                Track Your Consignment
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#B58A52] font-semibold"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin & Store Analytics</span>
              </Link>
              <p className="text-[11px] text-[#A1A1AA]">
                Concierge: {storeConfig.contactPhone}
              </p>
            </div>
          </div>
        </div>
      )}

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
