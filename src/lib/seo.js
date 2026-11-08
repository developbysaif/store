import { storeConfig } from "./store-config";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: storeConfig.brandName,
    url: storeConfig.siteUrl,
    logo: `${storeConfig.siteUrl}/favicon.ico`,
    description: storeConfig.subTagline,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: storeConfig.contactPhone,
        contactType: "customer service",
        areaServed: ["PK", "US", "GB", "AE", "EU"],
        availableLanguage: ["English", "Urdu"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Gulberg III, M.M. Alam Road",
      addressLocality: "Lahore",
      addressRegion: "Punjab",
      addressCountry: "PK",
    },
    sameAs: [
      storeConfig.socialLinks.instagram,
      storeConfig.socialLinks.facebook,
      storeConfig.socialLinks.pinterest,
    ],
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: storeConfig.brandName,
    url: storeConfig.siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${storeConfig.siteUrl}/shop?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function getBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href.startsWith("http") ? item.href : `${storeConfig.siteUrl}${item.href}`,
    })),
  };
}

export function getProductSchema(product) {
  const images = (product.images || []).map((img) => img.url);
  const primaryImage = images[0] || `${storeConfig.siteUrl}/images/placeholder.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: images.length > 0 ? images : [primaryImage],
    description: product.description,
    sku: product.variants?.[0]?.sku || product.slug,
    brand: {
      "@type": "Brand",
      name: storeConfig.brandName,
    },
    offers: [
      {
        "@type": "Offer",
        priceCurrency: "PKR",
        price: product.basePricePKR,
        availability:
          product.inStock && (product.stock === undefined || product.stock > 0)
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        url: `${storeConfig.siteUrl}/product/${product.slug}`,
        itemCondition: "https://schema.org/NewCondition",
        seller: {
          "@type": "Organization",
          name: storeConfig.brandName,
        },
      },
      {
        "@type": "Offer",
        priceCurrency: "USD",
        price: product.basePriceUSD,
        availability:
          product.inStock && (product.stock === undefined || product.stock > 0)
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        url: `${storeConfig.siteUrl}/product/${product.slug}`,
        itemCondition: "https://schema.org/NewCondition",
        seller: {
          "@type": "Organization",
          name: storeConfig.brandName,
        },
      },
    ],
    ...(product.rating && product.reviewsCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewsCount,
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
  };
}
