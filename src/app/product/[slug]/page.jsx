import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PRODUCTS as MOCK_PRODUCTS } from "@/lib/mock-data";
import { storeConfig } from "@/lib/store-config";
import { getProductSchema, getBreadcrumbSchema } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductDetailClient } from "./ProductDetailClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = db.getProductBySlug(slug) || MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return { title: "Piece Not Found" };

  const title = `${product.name} | ${product.category?.toUpperCase() || "LUXURY"} | ${storeConfig.brandName}`;
  const description =
    product.description && product.description.length > 50
      ? product.description.slice(0, 155)
      : `Acquire the handcrafted ${product.name}. Exquisite tailoring and fine materials by ${storeConfig.brandName}. Available nationwide in Pakistan with COD and worldwide via express DHL.`;

  const canonicalUrl = `${storeConfig.siteUrl}/product/${product.slug}`;
  const primaryImage =
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: storeConfig.brandName,
      images: [
        {
          url: primaryImage,
          width: 1000,
          height: 1250,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [primaryImage],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = db.getProductBySlug(slug) || MOCK_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const allProducts = db.getProducts() || MOCK_PRODUCTS;
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Generate Schema.org JSON-LD
  const productJsonLd = getProductSchema(product);

  const categoryName = product.category
    ? product.category.charAt(0).toUpperCase() + product.category.slice(1)
    : "Collection";

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Collections", href: "/shop" },
    { label: categoryName, href: `/category/${product.category}` },
    { label: product.name, href: `/product/${product.slug}` },
  ];

  const breadcrumbJsonLd = getBreadcrumbSchema(breadcrumbs);

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      {/* Product & Breadcrumb Schema.org Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Semantic Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
      />
    </div>
  );
}
