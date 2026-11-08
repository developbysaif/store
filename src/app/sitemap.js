import { storeConfig } from "@/lib/store-config";
import { getProducts, getCategories } from "@/lib/db";

export default async function sitemap() {
  const baseUrl = storeConfig.siteUrl;

  const staticRoutes = [
    "",
    "/shop",
    "/about",
    "/contact",
    "/order-tracking",
    "/policies/shipping",
    "/policies/returns",
    "/policies/size-guide",
    "/policies/terms",
    "/policies/privacy",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/shop" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/shop" ? 0.9 : 0.6,
  }));

  const categories = getCategories();
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const products = getProducts();
  const productRoutes = products.map((prod) => ({
    url: `${baseUrl}/product/${prod.slug}`,
    lastModified: new Date(prod.updatedAt || prod.createdAt || Date.now()),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
