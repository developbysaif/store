import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CATEGORIES as MOCK_CATEGORIES, PRODUCTS as MOCK_PRODUCTS } from "@/lib/mock-data";
import { ProductCard } from "@/components/products/ProductCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { storeConfig } from "@/lib/store-config";
import { getBreadcrumbSchema } from "@/lib/seo";
import { getCategoryEditorial } from "@/lib/category-seo";
import { ArrowLeft, Sparkles, ShieldCheck, Truck, RotateCcw, HelpCircle } from "lucide-react";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const editorial = getCategoryEditorial(slug);
  const categories = db.getCategories() || MOCK_CATEGORIES;
  const category = categories.find((c) => c.slug === slug || c.slug === editorial.targetCategory);

  if (!category && !editorial) {
    return { title: "Department Not Found" };
  }

  const title = editorial.seoTitle || `${category?.name || "Collection"} — ${storeConfig.brandName}`;
  const description = editorial.metaDescription || category?.description || storeConfig.tagline;
  const canonicalUrl = `${storeConfig.siteUrl}/category/${slug}`;
  const ogImage = category?.image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200";

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
          url: ogImage,
          width: 1200,
          height: 630,
          alt: editorial.name || category?.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const editorial = getCategoryEditorial(slug);
  const categories = db.getCategories() || MOCK_CATEGORIES;
  const category = categories.find((c) => c.slug === slug || c.slug === editorial.targetCategory);

  if (!category && !editorial) {
    notFound();
  }

  const allProducts = db.getProducts() || MOCK_PRODUCTS;

  // Filter products based on category and gender targeting
  const categoryProducts = allProducts.filter((p) => {
    if (editorial.slug === "mens-clothing") {
      return p.category === "clothing" && (p.gender === "MEN" || p.gender === "UNISEX");
    }
    if (editorial.slug === "womens-clothing") {
      return p.category === "clothing" && (p.gender === "WOMEN" || p.gender === "UNISEX");
    }
    if (editorial.slug === "bags-lifestyle") {
      return p.category === "accessories";
    }
    return p.category === (editorial.targetCategory || slug);
  });

  const categoryName = editorial.name || category?.name;
  const categoryImage = category?.image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200";

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Collections", href: "/shop" },
    { label: categoryName, href: `/category/${slug}` },
  ];

  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbs);

  // FAQPage Schema if FAQs exist
  const faqSchema = editorial.faqs && editorial.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: editorial.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  } : null;

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      {/* Schema.org Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Category Editorial Hero */}
      <section className="relative bg-[#171717] text-[#FAF8F5] py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-35">
          <Image
            src={categoryImage}
            alt={categoryName}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-[#171717]/65 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#B58A52] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Collections</span>
            </Link>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#FAF8F5]">
              {editorial.heroTitle || categoryName}
            </h1>

            <p className="text-sm sm:text-base text-[#D4D4D8] leading-relaxed font-light max-w-2xl">
              {editorial.heroSubtitle || category?.description}
            </p>

            <div className="pt-2 text-xs text-[#A1A1AA] flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[#FAF8F5]">
                <Sparkles className="w-3.5 h-3.5 text-[#B58A52]" />
                <span>{categoryProducts.length} Exclusive Pieces Available</span>
              </span>
              <span className="text-[#B58A52]">•</span>
              <span>Complimentary COD in Pakistan</span>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumbs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Main Grid Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-6 mb-6 sm:mb-8 border-b border-[#E8E4DC]">
          <div className="text-xs uppercase tracking-wider text-[#71717A]">
            Showing creations in <strong>{categoryName}</strong>
          </div>
          <Link
            href={`/shop?category=${editorial.targetCategory || slug}`}
            className="text-xs uppercase tracking-wider text-[#B58A52] hover:underline font-semibold"
          >
            Refine & Sort in Catalog
          </Link>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E4DC] p-8 space-y-3">
            <h3 className="font-serif text-lg text-[#171717]">Atelier Curations in Preparation</h3>
            <p className="text-xs text-[#71717A] max-w-md mx-auto">
              Our master artisans are currently tailoring fresh creations for this department. Please explore our full catalog in the interim.
            </p>
            <Link
              href="/shop"
              className="inline-block mt-3 px-6 py-2.5 bg-[#171717] hover:bg-[#B58A52] text-white text-xs uppercase tracking-widest rounded-xl transition-colors font-semibold"
            >
              Browse Full Catalog
            </Link>
          </div>
        )}
      </section>

      {/* Editorial Narrative & Sartorial Storytelling */}
      {editorial.editorialParagraphs && editorial.editorialParagraphs.length > 0 && (
        <section className="bg-white border-y border-[#E8E4DC] py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="border-b border-[#F0ECE3] pb-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#B58A52] block">
                Atelier Notes & Heritage
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#171717] mt-1">
                The {categoryName} Manifesto
              </h2>
            </div>

            <div className="space-y-5 text-sm sm:text-base text-[#4A4A4F] leading-relaxed font-light">
              {editorial.editorialParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Quality Commitment Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#F0ECE3]">
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E4DC] flex items-start gap-3">
                <Truck className="w-5 h-5 text-[#B58A52] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="block text-[#171717] font-semibold">Prompt National Delivery</strong>
                  <span className="text-[#71717A]">2–4 business days with Leopard / TCS across Pakistan.</span>
                </div>
              </div>
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E4DC] flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-[#B58A52] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="block text-[#171717] font-semibold">14-Day Exchanges</strong>
                  <span className="text-[#71717A]">Effortless sizing exchanges and atelier concierge service.</span>
                </div>
              </div>
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E4DC] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#B58A52] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="block text-[#171717] font-semibold">Heirloom Authenticity</strong>
                  <span className="text-[#71717A]">Certified materials, anti-tarnish alloys, and genuine leathers.</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Frequently Asked Questions (FAQ) Section with Semantic Rich Markup */}
      {editorial.faqs && editorial.faqs.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center space-y-2 mb-10">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B58A52]">
              Patron Guidance
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#171717]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-[#71717A]">
              Essential details regarding sizing, fabrications, care, and nationwide fulfillment.
            </p>
          </div>

          <div className="space-y-4">
            {editorial.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 bg-white rounded-2xl border border-[#E8E4DC] shadow-xs space-y-2 hover:border-[#B58A52]/40 transition-colors"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-[#171717]">
                  <HelpCircle className="w-4 h-4 text-[#B58A52] shrink-0" />
                  <h3>{faq.question}</h3>
                </div>
                <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed pl-6 font-light">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
