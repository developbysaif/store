"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/products/ProductCard";
import { PRODUCTS, CATEGORIES } from "@/lib/mock-data";
import { Filter, SlidersHorizontal, X, RotateCcw } from "lucide-react";

export function ShopClient() {
  const searchParams = useSearchParams();

  const [productsList, setProductsList] = useState(PRODUCTS);

  // Fetch latest products from API
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.products && data.products.length > 0) {
          setProductsList(data.products);
        }
      })
      .catch((err) => console.error("Error fetching live products:", err));
  }, []);

  const initialCategory = searchParams.get("category");
  const initialGender = searchParams.get("gender");
  const initialSearch = searchParams.get("search") || "";
  const initialFilter = searchParams.get("filter") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "all");
  const [selectedGender, setSelectedGender] = useState(initialGender || "all");
  const [sortBy, setSortBy] = useState(() => (
    initialFilter === "new" ? "newest" : initialFilter === "bestseller" ? "rating" : "featured"
  ));
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state if URL query params change
  const [prevParams, setPrevParams] = useState({
    category: initialCategory,
    gender: initialGender,
    search: initialSearch,
    filter: initialFilter,
  });

  if (
    prevParams.category !== initialCategory ||
    prevParams.gender !== initialGender ||
    prevParams.search !== initialSearch ||
    prevParams.filter !== initialFilter
  ) {
    setPrevParams({
      category: initialCategory,
      gender: initialGender,
      search: initialSearch,
      filter: initialFilter,
    });
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialGender) setSelectedGender(initialGender);
    if (initialSearch) setSearchQuery(initialSearch);
    if (initialFilter === "new") setSortBy("newest");
    if (initialFilter === "bestseller") setSortBy("rating");
  }

  const filteredProducts = useMemo(() => {
    return productsList
      .filter((product) => {
        // Category filter
        if (selectedCategory !== "all" && product.category !== selectedCategory) {
          return false;
        }
        // Gender filter
        if (selectedGender !== "all" && product.gender !== selectedGender && product.gender !== "UNISEX") {
          return false;
        }
        // Stock filter
        if (inStockOnly && !product.inStock) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = product.name.toLowerCase().includes(q);
          const matchesDesc = product.description.toLowerCase().includes(q);
          const matchesTags = Array.isArray(product.tags) && product.tags.some((t) => t.toLowerCase().includes(q));
          const matchesSubcat = product.subCategory?.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesTags && !matchesSubcat) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") {
          return a.basePricePKR - b.basePricePKR;
        }
        if (sortBy === "price-desc") {
          return b.basePricePKR - a.basePricePKR;
        }
        if (sortBy === "rating") {
          return b.rating - a.rating;
        }
        if (sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // default: featured
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [productsList, selectedCategory, selectedGender, inStockOnly, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedGender("all");
    setSearchQuery("");
    setInStockOnly(false);
    setSortBy("featured");
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedGender !== "all" ||
    searchQuery.trim().length > 0 ||
    inStockOnly;

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8 pb-6 border-b border-[#E8E4DC]">
          <div className="text-xs uppercase tracking-widest text-[#B58A52] font-semibold mb-2">
            The Catalog
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#171717]">
                {selectedCategory === "all"
                  ? "All Luxury Collections"
                  : CATEGORIES.find((c) => c.slug === selectedCategory)?.name || "Collection"}
              </h1>
              <p className="text-xs text-[#71717A] mt-1.5 max-w-xl">
                Elevated apparel, precision horology, 18K gold-plated jewellery, and Italian leather accessories.
              </p>
            </div>

            {/* Sort & Mobile filter trigger */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 text-xs uppercase tracking-wider font-medium bg-white border border-[#E8E4DC] rounded-lg"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters {hasActiveFilters && "•"}</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#71717A] uppercase tracking-wider hidden sm:inline">
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs bg-white border border-[#E8E4DC] rounded-lg px-3 py-2 text-[#171717] focus:outline-none focus:border-[#B58A52]"
                >
                  <option value="featured">Featured Curations</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Layout Grid: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6">
            {/* Filter Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E4DC]">
              <span className="text-xs uppercase font-bold tracking-widest text-[#171717] flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#B58A52]" />
                Filter Pieces
              </span>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-[#B58A52] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset All
                </button>
              )}
            </div>

            {/* Search filter input */}
            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#71717A] block mb-2">
                Keyword Search
              </label>
              <input
                type="text"
                placeholder="Search pieces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-white border border-[#E8E4DC] rounded-lg px-3 py-2 text-[#171717] focus:outline-none focus:border-[#B58A52]"
              />
            </div>

            {/* Category selection */}
            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#71717A] block mb-2">
                Departments
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition-colors flex items-center justify-between ${
                    selectedCategory === "all"
                      ? "bg-[#171717] text-[#FAF8F5] font-semibold"
                      : "text-[#71717A] hover:bg-white hover:text-[#171717]"
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[10px]">{productsList.length}</span>
                </button>
                {CATEGORIES.map((c) => {
                  const count = productsList.filter((p) => p.category === c.slug).length;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition-colors flex items-center justify-between ${
                        selectedCategory === c.slug
                          ? "bg-[#171717] text-[#FAF8F5] font-semibold"
                          : "text-[#71717A] hover:bg-white hover:text-[#171717]"
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className="text-[10px]">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gender selection */}
            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#71717A] block mb-2">
                Gender / Audience
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "All", value: "all" },
                  { label: "Women", value: "WOMEN" },
                  { label: "Men", value: "MEN" },
                  { label: "Unisex", value: "UNISEX" },
                ].map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setSelectedGender(g.value)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                      selectedGender === g.value
                        ? "bg-[#B58A52] text-[#FAF8F5] border-[#B58A52] font-medium"
                        : "bg-white text-[#71717A] border-[#E8E4DC] hover:text-[#171717]"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock status toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#171717]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-[#E8E4DC] text-[#B58A52] focus:ring-[#B58A52]"
                />
                <span>In Stock Available Only</span>
              </label>
            </div>
          </aside>

          {/* Product Listing Main Area */}
          <main className="lg:col-span-3">
            {/* Active filters pill bar */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white rounded-lg border border-[#E8E4DC]">
                <span className="text-[11px] text-[#71717A] uppercase tracking-wider">
                  Active Filters:
                </span>
                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-[#F7F3EB] text-[#171717] border border-[#B58A52]/30">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory("all")}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedGender !== "all" && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-[#F7F3EB] text-[#171717] border border-[#B58A52]/30">
                    Audience: {selectedGender}
                    <button onClick={() => setSelectedGender("all")}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery.trim() && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-[#F7F3EB] text-[#171717] border border-[#B58A52]/30">
                    &ldquo;{searchQuery}&rdquo;
                    <button onClick={() => setSearchQuery("")}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#B58A52] hover:underline ml-auto"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Results count */}
            <div className="text-xs text-[#71717A] mb-4">
              Showing <strong>{filteredProducts.length}</strong> luxurious designs
            </div>

            {/* Product Grid: 2 cols on mobile, 3 cols on tablet/desktop */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-[#E8E4DC] p-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#FAF8F5] text-[#B58A52] flex items-center justify-center mx-auto">
                  <Filter className="w-6 h-6 stroke-[1.4]" />
                </div>
                <h3 className="font-serif text-xl font-medium text-[#171717]">
                  No Matching Products Found
                </h3>
                <p className="text-xs text-[#71717A] max-w-sm mx-auto">
                  No products matched your exact filter combination. Try clearing your filters to see all available items.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-[#171717] text-[#FAF8F5] text-xs uppercase tracking-widest font-semibold rounded-lg hover:bg-[#B58A52] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Slide-In Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div
            className="fixed inset-0 bg-[#171717]/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-full max-w-xs sm:max-w-sm bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between py-6 px-5 sm:px-6 z-10 overflow-y-auto pb-safe">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E4DC]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#B58A52]" />
                  <h3 className="font-serif text-lg font-bold text-[#171717]">
                    Refine Catalog
                  </h3>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 text-[#71717A] hover:text-[#171717] rounded-full hover:bg-white"
                  aria-label="Close filters drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Department Categories Filter */}
              <div className="py-4 border-b border-[#F0ECE3] space-y-2">
                <label className="text-[11px] uppercase tracking-wider font-bold text-[#71717A] block">
                  Department
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors ${
                      selectedCategory === "all"
                        ? "bg-[#171717] text-white font-semibold"
                        : "text-[#171717] hover:bg-[#F0ECE3]"
                    }`}
                  >
                    <span>All Departments</span>
                    <span className="text-[10px]">{productsList.length}</span>
                  </button>
                  {CATEGORIES.map((cat) => {
                    const count = productsList.filter((p) => p.category === cat.slug).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors ${
                          selectedCategory === cat.slug
                            ? "bg-[#171717] text-white font-semibold"
                            : "text-[#171717] hover:bg-[#F0ECE3]"
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px]">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Audience / Gender Filter */}
              <div className="py-4 border-b border-[#F0ECE3] space-y-2">
                <label className="text-[11px] uppercase tracking-wider font-bold text-[#71717A] block">
                  Audience / Gender
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "All", value: "all" },
                    { label: "Women", value: "WOMEN" },
                    { label: "Men", value: "MEN" },
                    { label: "Unisex", value: "UNISEX" },
                  ].map((g) => (
                    <button
                      key={g.value}
                      onClick={() => setSelectedGender(g.value)}
                      className={`text-xs py-2 px-3 rounded-lg border text-center font-medium transition-colors ${
                        selectedGender === g.value
                          ? "bg-[#B58A52] text-white border-[#B58A52]"
                          : "bg-white text-[#71717A] border-[#E8E4DC]"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By inside drawer */}
              <div className="py-4 border-b border-[#F0ECE3] space-y-2">
                <label className="text-[11px] uppercase tracking-wider font-bold text-[#71717A] block">
                  Sort Order
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full text-xs bg-white border border-[#E8E4DC] rounded-lg px-3 py-2 text-[#171717] focus:outline-none focus:border-[#B58A52]"
                >
                  <option value="featured">Featured Curations</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

              {/* In stock available only */}
              <div className="pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#171717]">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-[#E8E4DC] text-[#B58A52] focus:ring-[#B58A52] w-4 h-4"
                  />
                  <span>In Stock Available Only</span>
                </label>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="pt-6 border-t border-[#E8E4DC] flex items-center gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 bg-white border border-[#E8E4DC] text-[#171717] text-xs uppercase tracking-wider font-semibold rounded-xl hover:bg-[#FAF8F5] transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 bg-[#171717] hover:bg-[#B58A52] text-white text-xs uppercase tracking-wider font-bold rounded-xl transition-colors shadow-sm"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
