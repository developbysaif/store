import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PRODUCTS as MOCK_PRODUCTS } from "@/lib/mock-data";
import { ProductDetailClient } from "./ProductDetailClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = db.getProductBySlug(slug) || MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} — Luxury Fashion & Lifestyle`,
    description: (product.description || "").slice(0, 160),
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = db.getProductBySlug(slug) || MOCK_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const allProducts = db.getProducts() || MOCK_PRODUCTS;
  // Related products from same category or complementary
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
