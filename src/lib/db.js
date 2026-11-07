import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile(filename, defaultValue = []) {
  ensureDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), "utf8");
    return defaultValue;
  }
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return defaultValue;
  }
}

function writeJsonFile(filename, data) {
  ensureDir();
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

// Initial seed categories
const INITIAL_CATEGORIES = [
  {
    id: "cat-clothing",
    name: "Clothing",
    slug: "clothing",
    description: "Impeccably tailored coats, pure silks, merino knits and timeless contemporary silhouettes.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
    itemCount: 24,
    featured: true,
  },
  {
    id: "cat-watches",
    name: "Watches",
    slug: "watches",
    description: "Precision chronographs, minimalist dress timepieces, and hand-finished couple editions.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
    itemCount: 18,
    featured: true,
  },
  {
    id: "cat-jewellery",
    name: "Artificial Jewellery",
    slug: "jewellery",
    description: "18K gold-plated vermeil, sparkling cubic zirconia pavé, and handcrafted ceremonial statement sets.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop",
    itemCount: 32,
    featured: true,
  },
  {
    id: "cat-accessories",
    name: "Accessories",
    slug: "accessories",
    description: "Italian calfskin leather bags, burnished wallets, hand-rolled silk scarves and artisanal sunglasses.",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop",
    itemCount: 20,
    featured: true,
  },
];

// Initial seed products
const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "Double-Faced Cashmere Wool Coat",
    slug: "double-faced-cashmere-wool-coat",
    tagline: "Unstructured elegance tailored for effortless winter layering",
    description:
      "Crafted from an exquisite blend of virgin wool and Mongolian cashmere, this double-faced overcoat balances relaxed ease with sharp sartorial lines. Unlined for natural drape and lightness, it features hand-finished pick stitching along the wide lapel.",
    details: [
      "90% Virgin Wool, 10% Cashmere",
      "Hand-finished pick-stitched edges",
      "Horn button closure with hidden inner stay",
      "Deep welt hand-warmer pockets",
      "Tailored relaxed silhouette",
    ],
    careInstructions: ["Specialist dry clean only", "Do not bleach or tumble dry"],
    category: "clothing",
    subCategory: "Outerwear",
    gender: "WOMEN",
    basePricePKR: 48500,
    basePriceUSD: 175,
    originalPricePKR: 58000,
    originalPriceUSD: 210,
    images: [
      {
        id: "img-1a",
        url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop",
        alt: "Double-Faced Cashmere Wool Coat front view",
        isPrimary: true,
      },
      {
        id: "img-1b",
        url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
        alt: "Double-Faced Cashmere Wool Coat editorial pose",
      },
    ],
    variants: [
      { id: "v-1-s-camel", sku: "COAT-DF-S-CAM", size: "S", color: "Oatmeal Camel", colorHex: "#C4A482", stock: 8 },
      { id: "v-1-m-camel", sku: "COAT-DF-M-CAM", size: "M", color: "Oatmeal Camel", colorHex: "#C4A482", stock: 12 },
      { id: "v-1-m-noir", sku: "COAT-DF-M-NOIR", size: "M", color: "Midnight Noir", colorHex: "#1A1A1A", stock: 7 },
    ],
    featured: true,
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    rating: 4.9,
    reviewsCount: 38,
    tags: ["outerwear", "cashmere", "winter", "luxury"],
    createdAt: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "prod-2",
    name: "Artisanal Silk Relaxed Shirt",
    slug: "artisanal-silk-relaxed-shirt",
    tagline: "Liquid silk crepe de chine with fluid mother-of-pearl accents",
    description:
      "A fluid, breathable luxury staple tailored from 22mm Mulberry silk crepe de chine. Designed with a clean camp collar, mother-of-pearl buttons, and French seams throughout.",
    details: [
      "100% Mulberry Silk Crepe (22mm)",
      "Natural Australian mother-of-pearl buttons",
      "Reinforced French seams",
    ],
    careInstructions: ["Hand wash in cold water or dry clean"],
    category: "clothing",
    subCategory: "Shirts",
    gender: "UNISEX",
    basePricePKR: 24500,
    basePriceUSD: 89,
    images: [
      {
        id: "img-2a",
        url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop",
        alt: "Artisanal Silk Relaxed Shirt",
        isPrimary: true,
      },
    ],
    variants: [
      { id: "v-2-s-ecru", sku: "SHIRT-SLK-S-ECR", size: "S", color: "Ecru White", colorHex: "#F3EDE2", stock: 10 },
      { id: "v-2-m-ecru", sku: "SHIRT-SLK-M-ECR", size: "M", color: "Ecru White", colorHex: "#F3EDE2", stock: 15 },
    ],
    featured: true,
    isNewArrival: false,
    isBestSeller: true,
    inStock: true,
    rating: 4.8,
    reviewsCount: 24,
    tags: ["silk", "shirts", "summer", "relaxed"],
    createdAt: "2026-01-20T00:00:00.000Z",
  },
  {
    id: "prod-3",
    name: "The Sovereign Rose Gold Chronograph 41mm",
    slug: "sovereign-rose-gold-chronograph-41mm",
    tagline: "Mechanical precision engineered with hand-polished 18K rose gold casing",
    description:
      "A flagship horological piece featuring an obsidian sunray dial, tachymeter scale, triple sub-dial chronograph, and sapphire crystal with dual anti-reflective coating.",
    details: [
      "41mm 316L Surgical Grade Stainless Steel with 18K Rose Gold PVD",
      "Japanese Mecha-Quartz Movement with sweeping chrono hand",
      "Scratch-resistant Sapphire Crystal glass",
      "5 ATM / 50M Water Resistance",
    ],
    careInstructions: ["Rinse with fresh water after contact with salt"],
    category: "watches",
    subCategory: "Chronographs",
    gender: "MEN",
    basePricePKR: 38500,
    basePriceUSD: 140,
    images: [
      {
        id: "img-3a",
        url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop",
        alt: "The Sovereign Rose Gold Chronograph",
        isPrimary: true,
      },
    ],
    variants: [
      { id: "v-3-rg-blk", sku: "WTC-SOV-RG-BLK", color: "Rose Gold / Noir Leather", colorHex: "#B76E79", stock: 14 },
      { id: "v-3-rg-brn", sku: "WTC-SOV-RG-BRN", color: "Rose Gold / Cognac Leather", colorHex: "#8B4513", stock: 9 },
    ],
    featured: true,
    isNewArrival: false,
    isBestSeller: true,
    inStock: true,
    rating: 4.9,
    reviewsCount: 53,
    tags: ["watches", "chronograph", "luxury", "menswear"],
    createdAt: "2026-01-05T00:00:00.000Z",
  },
  {
    id: "prod-4",
    name: "18K Gold PVD Herringbone & Tennis Choker Set",
    slug: "18k-gold-pvd-herringbone-tennis-choker-set",
    tagline: "Heavy-duty anti-tarnish vacuum plating paired with 4mm AAA zircon stones",
    description:
      "Layering perfected. This dual necklace set features a fluid 5mm flat herringbone chain paired with a dazzling continuous prong-set cubic zirconia tennis necklace.",
    details: [
      "18K Real Gold PVD Plating over 316L Stainless Steel",
      "Guaranteed water, sweat, and perfume resistant (Anti-Tarnish)",
      "AAA Grade hand-selected simulated diamonds",
    ],
    careInstructions: ["Wipe clean after use, safe to wear daily"],
    category: "jewellery",
    subCategory: "Necklaces",
    gender: "WOMEN",
    basePricePKR: 16500,
    basePriceUSD: 60,
    images: [
      {
        id: "img-4a",
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop",
        alt: "18K Gold PVD Herringbone & Tennis Choker Set",
        isPrimary: true,
      },
    ],
    variants: [
      { id: "v-4-gld", sku: "JWL-HRB-TNS-GLD", color: "18K Yellow Gold", colorHex: "#E6CA65", stock: 22 },
      { id: "v-4-slv", sku: "JWL-HRB-TNS-SLV", color: "Rhodium White Gold", colorHex: "#E2E8F0", stock: 15 },
    ],
    featured: true,
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    rating: 4.9,
    reviewsCount: 67,
    tags: ["jewellery", "gold-plated", "necklace", "tennis-choker"],
    createdAt: "2026-01-18T00:00:00.000Z",
  },
  {
    id: "prod-5",
    name: "The Florentine Italian Calfskin Tote Bag",
    slug: "the-florentine-italian-calfskin-tote-bag",
    tagline: "Structured vegetable-tanned grain leather with hand-painted raw edges",
    description:
      "A quintessential companion for modern living. Designed in an architectural silhouette with generous volume, reinforced base studs, and a magnetic clasp closure.",
    details: [
      "100% Full-grain vegetable tanned Italian leather",
      "Hand-burnished lacquered edge coating",
      "Fits up to 15-inch laptop with ease",
    ],
    careInstructions: ["Treat with quality leather cream once a season"],
    category: "accessories",
    subCategory: "Bags",
    gender: "UNISEX",
    basePricePKR: 39500,
    basePriceUSD: 145,
    images: [
      {
        id: "img-5a",
        url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop",
        alt: "The Florentine Italian Calfskin Tote Bag",
        isPrimary: true,
      },
    ],
    variants: [
      { id: "v-5-tan", sku: "ACC-TOT-FLR-TAN", color: "Saddle Tan", colorHex: "#9B5838", stock: 8 },
      { id: "v-5-noir", sku: "ACC-TOT-FLR-BLK", color: "Onyx Black", colorHex: "#111111", stock: 12 },
    ],
    featured: true,
    isNewArrival: true,
    isBestSeller: true,
    inStock: true,
    rating: 5.0,
    reviewsCount: 39,
    tags: ["bags", "leather", "tote", "workwear"],
    createdAt: "2026-01-28T00:00:00.000Z",
  },
];

// Initial seed orders
const INITIAL_ORDERS = [
  {
    id: "ord-1",
    orderNumber: "ORD-2026-982101",
    customer: {
      fullName: "Hamza Malik",
      email: "hamza@example.com",
      phone: "0300-8451122",
      addressLine1: "House 12-A, DHA Phase 6",
      city: "Lahore",
      country: "Pakistan",
    },
    items: [
      {
        productId: "prod-3",
        productName: "The Sovereign Rose Gold Chronograph 41mm",
        productImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop",
        sku: "WTC-SOV-RG-BLK",
        price: 38500,
        quantity: 1,
      },
    ],
    market: "PK",
    currency: "PKR",
    subtotal: 38500,
    shippingCost: 0,
    discount: 0,
    total: 38500,
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    orderStatus: "PENDING_VERIFICATION",
    trackingNumber: "TRK-EXP-91283",
    courierName: "Leopard Courier",
    createdAt: "2026-03-28T10:30:00Z",
    updatedAt: "2026-03-28T10:30:00Z",
  },
  {
    id: "ord-2",
    orderNumber: "ORD-2026-982100",
    customer: {
      fullName: "Amina Tariq",
      email: "amina@example.com",
      phone: "0321-9988221",
      addressLine1: "Apartment 4, Clifton Block 4",
      city: "Karachi",
      country: "Pakistan",
    },
    items: [
      {
        productId: "prod-1",
        productName: "Double-Faced Cashmere Wool Coat",
        productImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop",
        size: "M",
        color: "Oatmeal Camel",
        sku: "COAT-DF-M-CAM",
        price: 48500,
        quantity: 1,
      },
    ],
    market: "PK",
    currency: "PKR",
    subtotal: 48500,
    shippingCost: 0,
    discount: 0,
    total: 48500,
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    orderStatus: "CONFIRMED",
    trackingNumber: "TRK-EXP-91280",
    courierName: "TCS Express",
    createdAt: "2026-03-27T14:15:00Z",
    updatedAt: "2026-03-27T14:15:00Z",
  },
  {
    id: "ord-3",
    orderNumber: "ORD-2026-982099",
    customer: {
      fullName: "Eleanor Vance",
      email: "eleanor@vance.co.uk",
      phone: "+44 20 7946 0912",
      addressLine1: "18 Kensington Gardens",
      city: "London",
      country: "United Kingdom",
    },
    items: [
      {
        productId: "prod-4",
        productName: "18K Gold PVD Herringbone & Tennis Choker Set",
        productImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop",
        sku: "JWL-HRB-TNS-GLD",
        price: 60,
        quantity: 1,
      },
    ],
    market: "INTL",
    currency: "USD",
    subtotal: 60,
    shippingCost: 35,
    discount: 0,
    total: 95,
    paymentMethod: "CARD",
    paymentStatus: "PAID",
    orderStatus: "DISPATCHED",
    trackingNumber: "TRK-DHL-448102",
    courierName: "DHL Express Priority",
    createdAt: "2026-03-26T09:20:00Z",
    updatedAt: "2026-03-26T09:20:00Z",
  },
  {
    id: "ord-4",
    orderNumber: "ORD-2026-982098",
    customer: {
      fullName: "Bilal Chaudhry",
      email: "bilal@chaudhry.pk",
      phone: "0333-5566778",
      addressLine1: "Sector F-8/3, Street 22",
      city: "Islamabad",
      country: "Pakistan",
    },
    items: [
      {
        productId: "prod-5",
        productName: "The Florentine Italian Calfskin Tote Bag",
        productImage: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop",
        sku: "ACC-TOT-FLR-TAN",
        price: 39500,
        quantity: 1,
      },
    ],
    market: "PK",
    currency: "PKR",
    subtotal: 39500,
    shippingCost: 0,
    discount: 0,
    total: 39500,
    paymentMethod: "COD",
    paymentStatus: "PAID",
    orderStatus: "DELIVERED",
    trackingNumber: "TRK-EXP-91275",
    courierName: "Trax Logistics",
    createdAt: "2026-03-25T11:45:00Z",
    updatedAt: "2026-03-25T11:45:00Z",
  },
];

// Initial settings
const INITIAL_SETTINGS = {
  brandName: "MAISON ATELIER",
  brandMonogram: "M·A",
  tagline: "Timeless Design. Modern Essence.",
  freeShippingThresholdPKR: 7500,
  freeShippingThresholdUSD: 150,
  standardShippingPKR: 299,
  standardShippingUSD: 15,
  internationalShippingUSD: 35,
  contactPhone: "+92 (0) 42 3578 9900",
  whatsappNumber: "+923001234567",
  contactEmail: "concierge@maisonatelier.com",
  address: "Gulberg III, M.M. Alam Road, Lahore, Pakistan",
};

// =================== DATABASE ACCESSORS ===================

// --- PRODUCTS ---
export function getProducts() {
  return readJsonFile("products.json", INITIAL_PRODUCTS);
}

export function getProductByIdOrSlug(identifier) {
  const products = getProducts();
  return products.find((p) => p.id === identifier || p.slug === identifier) || null;
}

export function getProductById(id) {
  return getProductByIdOrSlug(id);
}

export function getProductBySlug(slug) {
  return getProductByIdOrSlug(slug);
}

export function createProduct(productData) {
  const products = getProducts();
  const slug = (productData.name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const newProduct = {
    id: `prod-${Date.now()}`,
    slug: slug || `prod-${Date.now()}`,
    tagline: productData.tagline || "Handcrafted Atelier Creation",
    details: productData.details || ["Artisanal craftsmanship", "Premium inspected"],
    careInstructions: productData.careInstructions || ["Store in protective packaging"],
    gender: productData.gender || "UNISEX",
    images: productData.images || [
      {
        id: `img-${Date.now()}`,
        url: productData.imageUrl || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop",
        alt: productData.name,
        isPrimary: true,
      },
    ],
    variants: productData.variants || [
      {
        id: `v-${Date.now()}`,
        sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        size: productData.variantSize || "M",
        color: productData.variantColor || "Standard",
        colorHex: productData.colorHex || "#171717",
        stock: Number(productData.stock) || 10,
      },
    ],
    featured: Boolean(productData.featured),
    isNewArrival: Boolean(productData.isNewArrival ?? true),
    isBestSeller: Boolean(productData.isBestSeller),
    inStock: (Number(productData.stock) || 10) > 0,
    rating: 5.0,
    reviewsCount: 1,
    tags: productData.tags || [productData.category, "luxury"],
    createdAt: new Date().toISOString(),
    ...productData,
  };

  products.unshift(newProduct);
  writeJsonFile("products.json", products);
  return newProduct;
}

export function updateProduct(id, updateData) {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  products[index] = {
    ...products[index],
    ...updateData,
    updatedAt: new Date().toISOString(),
  };

  writeJsonFile("products.json", products);
  return products[index];
}

export function deleteProduct(id) {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  writeJsonFile("products.json", filtered);
  return true;
}

// --- CATEGORIES ---
export function getCategories() {
  return readJsonFile("categories.json", INITIAL_CATEGORIES);
}

export function getCategoryBySlug(slug) {
  const categories = getCategories();
  return categories.find((c) => c.slug === slug) || null;
}

export function getCategoryById(id) {
  const categories = getCategories();
  return categories.find((c) => c.id === id || c.slug === id) || null;
}

export function createCategory(catData) {
  const categories = getCategories();
  const slug = (catData.name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const newCategory = {
    id: `cat-${Date.now()}`,
    slug: catData.slug || slug,
    name: catData.name,
    description: catData.description || "Exclusive curated collection.",
    image: catData.image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
    itemCount: 0,
    featured: Boolean(catData.featured),
    createdAt: new Date().toISOString(),
  };

  categories.push(newCategory);
  writeJsonFile("categories.json", categories);
  return newCategory;
}

export function updateCategory(id, updateData) {
  const categories = getCategories();
  const index = categories.findIndex((c) => c.id === id || c.slug === id);
  if (index === -1) return null;

  categories[index] = {
    ...categories[index],
    ...updateData,
    updatedAt: new Date().toISOString(),
  };

  writeJsonFile("categories.json", categories);
  return categories[index];
}

export function deleteCategory(id) {
  const categories = getCategories();
  const filtered = categories.filter((c) => c.id !== id && c.slug !== id);
  if (filtered.length === categories.length) return false;
  writeJsonFile("categories.json", filtered);
  return true;
}

// --- ORDERS ---
export function getOrders() {
  return readJsonFile("orders.json", INITIAL_ORDERS);
}

export function getOrderByIdOrNumber(identifier) {
  const orders = getOrders();
  return orders.find((o) => o.id === identifier || o.orderNumber === identifier) || null;
}

export function getOrderById(id) {
  return getOrderByIdOrNumber(id);
}

export function getOrderByNumber(orderNumber) {
  return getOrderByIdOrNumber(orderNumber);
}

export function createOrder(orderData) {
  const orders = getOrders();
  const randomOrderDigits = Math.floor(100000 + Math.random() * 900000);
  const orderNumber = `ORD-2026-${randomOrderDigits}`;

  // Enforce payment rule:
  // Pakistan -> ONLY COD or Bank Transfer
  // International -> Cards First
  const isPK = orderData.market === "PK" || orderData.customer?.country === "Pakistan";
  let finalPaymentMethod = orderData.paymentMethod || (isPK ? "COD" : "CARD");
  if (isPK && finalPaymentMethod !== "COD" && finalPaymentMethod !== "BANK_TRANSFER") {
    finalPaymentMethod = "COD";
  }

  const newOrder = {
    id: `ord-${Date.now()}`,
    orderNumber,
    customer: orderData.customer,
    items: orderData.items || [],
    market: isPK ? "PK" : "INTL",
    currency: isPK ? "PKR" : orderData.currency || "USD",
    subtotal: Number(orderData.subtotal) || 0,
    shippingCost: Number(orderData.shippingCost) || 0,
    discount: Number(orderData.discount) || 0,
    total: Number(orderData.total) || 0,
    paymentMethod: finalPaymentMethod,
    paymentStatus: finalPaymentMethod === "COD" ? "PENDING" : "PAID",
    orderStatus: finalPaymentMethod === "COD" ? "PENDING_VERIFICATION" : "CONFIRMED",
    trackingNumber: `TRK-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
    courierName: isPK ? "Leopard Courier Express" : "DHL Express Priority",
    notes: orderData.notes || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  orders.unshift(newOrder);
  writeJsonFile("orders.json", orders);
  return newOrder;
}

export function updateOrder(id, updateData) {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === id || o.orderNumber === id);
  if (index === -1) return null;

  orders[index] = {
    ...orders[index],
    ...updateData,
    updatedAt: new Date().toISOString(),
  };

  writeJsonFile("orders.json", orders);
  return orders[index];
}

export function deleteOrder(id) {
  const orders = getOrders();
  const filtered = orders.filter((o) => o.id !== id && o.orderNumber !== id);
  if (filtered.length === orders.length) return false;
  writeJsonFile("orders.json", filtered);
  return true;
}

// --- SETTINGS ---
export function getSettings() {
  return readJsonFile("settings.json", INITIAL_SETTINGS);
}

export function updateSettings(settingsData) {
  const current = getSettings();
  const updated = { ...current, ...settingsData };
  writeJsonFile("settings.json", updated);
  return updated;
}

// --- STATS ---
export function getAdminStats() {
  const orders = getOrders();
  const products = getProducts();

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === "PENDING_VERIFICATION").length;
  const confirmedOrders = orders.filter((o) => o.orderStatus === "CONFIRMED").length;
  const processingOrders = orders.filter((o) => o.orderStatus === "PROCESSING").length;
  const dispatchedOrders = orders.filter((o) => o.orderStatus === "DISPATCHED").length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === "DELIVERED").length;
  const cancelledOrders = orders.filter((o) => o.orderStatus === "CANCELLED").length;

  const totalRevenuePKR = orders
    .filter((o) => o.currency === "PKR" && o.orderStatus !== "CANCELLED")
    .reduce((acc, curr) => acc + curr.total, 0);

  const totalRevenueUSD = orders
    .filter((o) => o.currency !== "PKR" && o.orderStatus !== "CANCELLED")
    .reduce((acc, curr) => acc + curr.total, 0);

  const totalVolume = products.reduce(
    (acc, p) => acc + (p.variants || []).reduce((vAcc, v) => vAcc + (v.stock || 0), 0),
    0
  );

  return {
    totalOrders,
    pendingOrders,
    confirmedOrders,
    processingOrders,
    dispatchedOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenuePKR,
    totalRevenueUSD,
    totalProducts: products.length,
    totalVolume,
  };
}

export const db = {
  getCategories,
  getCategoryBySlug,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getSettings,
  updateSettings,
  getAdminStats,
};

export default db;
