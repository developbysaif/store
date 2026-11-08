"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Save,
  Zap,
} from "lucide-react";

export default function AdminProductsPage() {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Quick edit state (product id currently being inline-edited)
  const [quickEditId, setQuickEditId] = useState(null);
  const [quickPricePKR, setQuickPricePKR] = useState(0);
  const [quickPriceUSD, setQuickPriceUSD] = useState(0);
  const [quickStock, setQuickStock] = useState(0);

  // Add/Edit Product form state
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("clothing");
  const [formGender, setFormGender] = useState("UNISEX");
  const [formPricePKR, setFormPricePKR] = useState(25000);
  const [formPriceUSD, setFormPriceUSD] = useState(90);
  const [formDescription, setFormDescription] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop");
  const [formStock, setFormStock] = useState(15);
  const [formSize, setFormSize] = useState("M");
  const [formColor, setFormColor] = useState("Classic Noir");

  const refreshProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data && data.products) {
        setProductsList(data.products);
      }
    } catch (err) {
      console.error("Error refreshing products:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (data && data.products) {
            setProductsList(data.products);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Quick Edit Start
  const startQuickEdit = (product) => {
    setQuickEditId(product.id);
    setQuickPricePKR(product.basePricePKR || 0);
    setQuickPriceUSD(product.basePriceUSD || 0);
    const mainStock = product.variants?.[0]?.stock ?? product.stock ?? 10;
    setQuickStock(mainStock);
  };

  // Quick Edit Save (PATCH)
  const saveQuickEdit = async (productId) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          basePricePKR: Number(quickPricePKR),
          basePriceUSD: Number(quickPriceUSD),
          stock: Number(quickStock),
        }),
      });
      if (res.ok) {
        setQuickEditId(null);
        refreshProducts();
      }
    } catch (err) {
      console.error("Quick edit save failed:", err);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId, productName) => {
    if (!confirm(`Are you sure you want to permanently delete "${productName}" from the catalog?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        refreshProducts();
      }
    } catch (err) {
      console.error("Delete product error:", err);
    }
  };

  // Open Full Edit Modal
  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormGender(product.gender || "UNISEX");
    setFormPricePKR(product.basePricePKR);
    setFormPriceUSD(product.basePriceUSD);
    setFormDescription(product.description || "");
    setFormImageUrl(product.images?.[0]?.url || "");
    setFormStock(product.variants?.[0]?.stock ?? product.stock ?? 10);
    setFormSize(product.variants?.[0]?.size || "M");
    setFormColor(product.variants?.[0]?.color || "Standard");
  };

  // Save Add or Edit
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formName) return;

    const payload = {
      name: formName,
      slug: formName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: formDescription || "Exquisite tailoring and timeless materials.",
      category: formCategory,
      gender: formGender,
      basePricePKR: Number(formPricePKR),
      basePriceUSD: Number(formPriceUSD),
      images: [{ id: `img-${Date.now()}`, url: formImageUrl, alt: formName, isPrimary: true }],
      variants: [
        {
          id: `var-${Date.now()}`,
          sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
          size: formSize,
          color: formColor,
          stock: Number(formStock),
        },
      ],
      stock: Number(formStock),
      inStock: Number(formStock) > 0,
      featured: true,
      rating: 5.0,
      reviewsCount: 1,
    };

    try {
      if (editingProduct) {
        // PUT update
        await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setEditingProduct(null);
      } else {
        // POST create
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setIsAddModalOpen(false);
      }
      refreshProducts();
    } catch (err) {
      console.error("Product submit failed:", err);
    }
  };

  const filtered = productsList.filter((p) => {
    if (selectedCategory !== "ALL" && p.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (Array.isArray(p.variants) && p.variants.some((v) => v.sku?.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171717]">
            Product Catalog & Inventory
          </h1>
          <p className="text-xs text-[#71717A]">
            Manage products, quick-edit prices and stock levels, add new designs, or remove items.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setFormName("");
            setFormDescription("");
            setFormPricePKR(25000);
            setFormPriceUSD(90);
            setFormStock(15);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#171717] hover:bg-[#B58A52] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Luxury Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E5E9] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by title, SKU, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#E5E5E9] rounded-xl text-[#171717] focus:outline-none focus:border-[#171717]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["ALL", "clothing", "watches", "jewellery", "accessories"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#171717] text-white"
                  : "bg-[#FAF8F5] text-[#71717A] hover:text-[#171717] border border-[#E5E5E9]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table with Quick Edit and Actions */}
      <div className="bg-white rounded-2xl border border-[#E5E5E9] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E5E5E9] text-[#71717A]">
                <th className="py-3.5 px-4 font-semibold">Product</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Price (PKR)</th>
                <th className="py-3.5 px-4 font-semibold">Price (USD)</th>
                <th className="py-3.5 px-4 font-semibold">Stock Level</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F4F6]">
              {loading ? (
                [1, 2, 3, 4, 5].map((n) => (
                  <tr key={n} className="animate-pulse">
                    <td colSpan={6} className="py-4 px-4 h-14 bg-[#FAF8F5]/50" />
                  </tr>
                ))
              ) : (
                filtered.map((product) => {
                const isQuickEditing = quickEditId === product.id;
                const currentStock = product.variants?.[0]?.stock ?? product.stock ?? 10;

                return (
                  <tr key={product.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    {/* Product Cell */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 rounded-lg bg-[#E8E4DC] overflow-hidden shrink-0">
                          <Image
                            src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600"}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            className="font-semibold text-[#171717] hover:text-[#B58A52] flex items-center gap-1 truncate"
                          >
                            <span>{product.name}</span>
                            <ExternalLink className="w-3 h-3 text-[#A1A1AA]" />
                          </Link>
                          <div className="text-[11px] text-[#71717A] mt-0.5">
                            SKU: {product.variants?.[0]?.sku || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FAF8F5] border border-[#E5E5E9] text-[#171717]">
                        {product.category}
                      </span>
                    </td>

                    {/* Price PKR (Inline Quick Edit) */}
                    <td className="py-3.5 px-4 font-bold text-[#171717]">
                      {isQuickEditing ? (
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] text-[#71717A]">₨</span>
                          <input
                            type="number"
                            value={quickPricePKR}
                            onChange={(e) => setQuickPricePKR(e.target.value)}
                            className="w-24 px-2 py-1 text-xs border border-[#B58A52] rounded-lg bg-white"
                          />
                        </div>
                      ) : (
                        <span>₨ {product.basePricePKR?.toLocaleString()}</span>
                      )}
                    </td>

                    {/* Price USD (Inline Quick Edit) */}
                    <td className="py-3.5 px-4 text-[#71717A]">
                      {isQuickEditing ? (
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] text-[#71717A]">$</span>
                          <input
                            type="number"
                            value={quickPriceUSD}
                            onChange={(e) => setQuickPriceUSD(e.target.value)}
                            className="w-16 px-2 py-1 text-xs border border-[#B58A52] rounded-lg bg-white"
                          />
                        </div>
                      ) : (
                        <span>${product.basePriceUSD}</span>
                      )}
                    </td>

                    {/* Stock (Inline Quick Edit) */}
                    <td className="py-3.5 px-4">
                      {isQuickEditing ? (
                        <input
                          type="number"
                          value={quickStock}
                          onChange={(e) => setQuickStock(e.target.value)}
                          className="w-16 px-2 py-1 text-xs border border-[#B58A52] rounded-lg bg-white font-bold"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              currentStock > 5
                                ? "bg-green-500"
                                : currentStock > 0
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                          />
                          <span className="font-semibold">{currentStock} in stock</span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {isQuickEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => saveQuickEdit(product.id)}
                            className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Save className="w-3 h-3" />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={() => setQuickEditId(null)}
                            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-[11px] cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {/* Quick Edit Trigger */}
                          <button
                            onClick={() => startQuickEdit(product)}
                            title="Quick Edit Price & Stock Inline"
                            className="px-2 py-1 bg-[#FAF8F5] border border-[#E5E5E9] hover:border-[#B58A52] text-[#B58A52] hover:bg-[#B58A52] hover:text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Zap className="w-3 h-3" />
                            <span>Quick Edit</span>
                          </button>

                          {/* Full Edit Modal */}
                          <button
                            onClick={() => openEditModal(product)}
                            title="Edit Full Product Details"
                            className="p-1.5 text-gray-600 hover:text-[#171717] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Product */}
                          <button
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            title="Delete Product"
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => {
              setIsAddModalOpen(false);
              setEditingProduct(null);
            }}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 z-10 border border-[#E5E5E9] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#F4F4F6]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B58A52]">
                  {editingProduct ? "Product Modifier" : "Catalog Creator"}
                </span>
                <h3 className="font-bold text-lg text-[#171717]">
                  {editingProduct ? `Edit ${editingProduct.name}` : "Create New Luxury Product"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-[#171717] block mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Double-Faced Cashmere Wool Coat"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E5E9] rounded-xl text-xs text-[#171717]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#171717] block mb-1">
                    Department Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E5E9] rounded-xl text-xs text-[#171717]"
                  >
                    <option value="clothing">Clothing (Men / Women)</option>
                    <option value="watches">Watches (Horology)</option>
                    <option value="jewellery">Artificial Jewellery</option>
                    <option value="accessories">Leather & Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#171717] block mb-1">
                    Target Audience / Gender
                  </label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E5E9] rounded-xl text-xs text-[#171717]"
                  >
                    <option value="UNISEX">Unisex</option>
                    <option value="WOMEN">Women</option>
                    <option value="MEN">Men</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#171717] block mb-1">
                    Price in PKR (Pakistan) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formPricePKR}
                    onChange={(e) => setFormPricePKR(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E5E9] rounded-xl text-xs text-[#171717]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#171717] block mb-1">
                    Price in USD (International) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formPriceUSD}
                    onChange={(e) => setFormPriceUSD(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E5E9] rounded-xl text-xs text-[#171717]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-[#171717] block mb-1">
                    Image URL (High-Res Editorial Photography)
                  </label>
                  <input
                    type="url"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E5E9] rounded-xl text-xs text-[#171717]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#171717] block mb-1">
                    Total Available Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E5E9] rounded-xl text-xs text-[#171717]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#171717] block mb-1">
                    Default Size / Spec
                  </label>
                  <input
                    type="text"
                    value={formSize}
                    onChange={(e) => setFormSize(e.target.value)}
                    placeholder="e.g. M / 41mm / One Size"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E5E9] rounded-xl text-xs text-[#171717]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-[#171717] block mb-1">
                    Editorial Description
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Describe the fabric composition, craftsmanship, and fit..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E5E9] rounded-xl text-xs text-[#171717]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#F4F4F6] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-[#71717A] hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#171717] hover:bg-[#B58A52] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  {editingProduct ? "Save Changes" : "Publish to Storefront"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
