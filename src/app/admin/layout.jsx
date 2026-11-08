"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { storeConfig } from "@/lib/store-config";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Settings,
  ArrowLeft,
  LogOut,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: Layers },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F4F4F6] text-[#171717]">
      {/* Top Admin Navbar (Ecomora Style) */}
      <header className="bg-white border-b border-[#E5E5E9] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link href="/admin" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#171717] flex items-center justify-center text-[#B58A52] font-serif font-bold text-lg shadow-sm">
                  {storeConfig.brandMonogram[0]}
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-lg font-bold tracking-wider text-[#171717]">
                    {storeConfig.brandName}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-[#71717A] -mt-1 font-semibold">
                    Admin Portal
                  </span>
                </div>
              </Link>

              {/* Navigation Tabs */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-[#171717] text-[#FAF8F5] shadow-xs"
                          : "text-[#71717A] hover:bg-[#F4F4F6] hover:text-[#171717]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right: Back to Store + Profile */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-xs text-[#71717A] hover:text-[#171717] px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-[#E5E5E9] bg-white transition-colors"
                title="Visit Storefront"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Visit Storefront</span>
                <span className="sm:hidden text-[10px] font-semibold">Store</span>
              </Link>

              <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-[#E5E5E9]">
                <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-[#EFE9DD] text-[#B58A52] border border-[#B58A52]/30 flex items-center justify-center font-bold text-xs shadow-xs">
                  SA
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <div className="font-semibold text-[#171717]">Saif (Admin)</div>
                  <div className="text-[10px] text-[#10B981] font-medium">● Super Director</div>
                </div>

                <button
                  onClick={async () => {
                    await fetch("/api/admin/auth", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ action: "logout" }),
                    });
                    router.push("/admin/login");
                    router.refresh();
                  }}
                  className="p-1.5 text-[#71717A] hover:text-red-600 rounded-lg transition-colors cursor-pointer ml-1"
                  title="Sign out of Admin Console"
                  aria-label="Sign out of Admin Console"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-8">
        {children}
      </div>

      {/* Mobile Admin Bottom Navigation Bar */}
      <nav
        aria-label="Admin mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E5E9] md:hidden px-2 py-1.5 flex items-center justify-around pb-safe shadow-lg"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors min-w-[56px] ${
                isActive
                  ? "text-[#171717] font-bold"
                  : "text-[#71717A] hover:text-[#171717]"
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isActive ? "bg-[#171717] text-white" : ""
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
