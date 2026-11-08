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
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form inputs
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formHeroTitle, setFormHeroTitle] = useState("");
  const [formHeroSubtitle, setFormHeroSubtitle] = useState("");

  const refreshData = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/products"),
      ]);
      const catData = await catRes.json();
      const prodData = await prodRes.json();

      if (catData?.categories) setCategories(catData.categories);
      if (prodData?.products) setProducts(prodData.products);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    Promise.all([fetch("/api/categories"), fetch("/api/products")])
      .then(async ([catRes, prodRes]) => {
        const catData = await catRes.json();
        const prodData = await prodRes.json();
        if (isMounted) {
          if (catData?.categories) setCategories(catData.categories);
          if (prodData?.products) setProducts(prodData.products);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load categories:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormName("");
    setFormSlug("");
    setFormDescription("");
    setFormImage("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000");
    setFormHeroTitle("");
    setFormHeroSubtitle("");
    setIsAddModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDescription(cat.description || "");
    setFormImage(cat.image || "");
    setFormHeroTitle(cat.heroTitle || "");
    setFormHeroSubtitle(cat.heroSubtitle || "");
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        refreshData();
      }
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName) return;

    const slug = formSlug.trim() || formName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const payload = {
      name: formName,
      slug,
      description: formDescription,
      image: formImage,
      heroTitle: formHeroTitle || formName,
      heroSubtitle: formHeroSubtitle || formDescription,
    };

    try {
      if (editingCategory) {
        await fetch(`/api/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setIsAddModalOpen(false);
      setEditingCategory(null);
      refreshData();
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  const filteredCategories = categories.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
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
            Store Departments & Categories
          </h1>
          <p className="text-xs text-[#71717A]">
            Add, edit, or delete store departments (Clothing, Watches, Jewellery, Accessories, or custom verticals).
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#171717] hover:bg-[#B58A52] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E5E9] shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#E5E5E9] rounded-xl text-[#171717] focus:outline-none focus:border-[#171717]"
          />
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-[#E5E5E9] p-6 h-64 animate-pulse flex flex-col justify-between">
              <div className="w-full h-32 bg-[#FAF8F5] rounded-xl" />
              <div className="space-y-2">
                <div className="w-2/3 h-4 bg-[#FAF8F5] rounded" />
                <div className="w-1/2 h-3 bg-[#FAF8F5] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((cat) => {
          const productCount = products.filter((p) => p.category === cat.slug).length;

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-[#E5E5E9] overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="relative aspect-[16/10] bg-[#E8E4DC] overflow-hidden">
                  <Image
                    src={cat.image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600"}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#171717] shadow-xs">
                    {productCount} Products
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-[#171717]">
                      {cat.name}
                    </h3>
                    <Link
                      href={`/category/${cat.slug}`}
                      target="_blank"
                      className="text-[#A1A1AA] hover:text-[#B58A52]"
                      title="View on Storefront"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="text-[11px] font-mono text-[#B58A52]">
                    /category/{cat.slug}
                  </div>

                  <p className="text-xs text-[#71717A] line-clamp-2 leading-relaxed">
                    {cat.description || "Luxury department collection."}
                  </p>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="p-4 bg-[#FAF8F5] border-t border-[#E5E5E9] flex items-center justify-between">
                <button
                  onClick={() => openEditModal(cat)}
                  className="px-3 py-1.5 bg-white border border-[#E5E5E9] hover:bg-[#171717] hover:text-white text-[#171717] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="px-3 py-1.5 bg-white border border-red-200 hover:bg-red-600 hover:text-white text-red-600 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Add / Edit Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsAddModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 z-10 border border-[#E5E5E9] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F4F4F6]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B58A52]">
                  {editingCategory ? "Department Modifier" : "New Department"}
                </span>
                <h3 className="font-bold text-lg text-[#171717]">
                  {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create New Store Department"}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#171717] block mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Leather Footwear / Fine Fragrances"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (!editingCategory) {
                      setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E5E9] rounded-xl text-xs text-[#171717]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#171717] block mb-1">
                  URL Slug * (Lowercase & hyphenated)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. footwear"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E5E9] rounded-xl text-xs font-mono text-[#171717]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#171717] block mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E5E9] rounded-xl text-xs text-[#171717]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#171717] block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Artisanal description of this department..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E5E9] rounded-xl text-xs text-[#171717]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#71717A] hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#171717] hover:bg-[#B58A52] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  {editingCategory ? "Update Department" : "Save & Publish Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
