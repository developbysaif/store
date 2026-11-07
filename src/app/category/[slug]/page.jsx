import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CATEGORIES as MOCK_CATEGORIES, PRODUCTS as MOCK_PRODUCTS } from "@/lib/mock-data";
import { ProductCard } from "@/components/products/ProductCard";
import { ArrowLeft, Sparkles } from "lucide-react";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const categories = db.getCategories() || MOCK_CATEGORIES;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} — Luxury Curations`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const categories = db.getCategories() || MOCK_CATEGORIES;
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const allProducts = db.getProducts() || MOCK_PRODUCTS;
  const categoryProducts = allProducts.filter((p) => p.category === slug);

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      {/* Category Editorial Hero */}
      <div className="relative bg-[#171717] text-[#FAF8F5] py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src={category.image}
            alt={category.name}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-[#171717]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#B58A52] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Collections</span>
            </Link>

            <h1 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-[#FAF8F5]">
              {category.name}
            </h1>

            <p className="text-sm sm:text-base text-[#D4D4D8] leading-relaxed font-light">
              {category.description}
            </p>

            <div className="pt-2 text-xs text-[#A1A1AA] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#B58A52]" />
              <span>{categoryProducts.length} Exclusive Pieces Currently Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#E8E4DC]">
          <div className="text-xs uppercase tracking-wider text-[#71717A]">
            Showing all creations in <strong>{category.name}</strong>
          </div>
          <Link
            href={`/shop?category=${slug}`}
            className="text-xs uppercase tracking-wider text-[#B58A52] hover:underline font-semibold"
          >
            Filter & Sort in Shop
          </Link>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-[#E8E4DC] p-8 space-y-3">
            <h3 className="font-serif text-lg text-[#171717]">New items being added</h3>
            <p className="text-xs text-[#71717A]">Our artisans are preparing new pieces for this department.</p>
            <Link href="/shop" className="inline-block mt-3 px-6 py-2.5 bg-[#171717] text-white text-xs uppercase tracking-widest rounded-lg">
              View All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
