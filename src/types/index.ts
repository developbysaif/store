export type CurrencyCode = "PKR" | "USD" | "EUR" | "GBP" | "AED";

export type MarketType = "PK" | "INTL";

export type Gender = "MEN" | "WOMEN" | "UNISEX";

export type CategorySlug =
  | "mens-clothing"
  | "womens-clothing"
  | "clothing"
  | "watches"
  | "jewellery"
  | "accessories"
  | "bags-lifestyle";

export type OrderStatus =
  | "PENDING_VERIFICATION"
  | "CONFIRMED"
  | "PROCESSING"
  | "DISPATCHED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethod = "COD" | "CARD" | "BANK_TRANSFER";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
  width?: number;
  height?: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size?: string;
  color?: string;
  colorHex?: string;
  stock: number;
  priceModifierPKR?: number;
  priceModifierUSD?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  details: string[];
  careInstructions?: string[];
  category: CategorySlug;
  subCategory?: string;
  gender: Gender;
  basePricePKR: number;
  basePriceUSD: number;
  originalPricePKR?: number;
  originalPriceUSD?: number;
  images: ProductImage[];
  variants: ProductVariant[];
  stock?: number;
  featured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug | string;
  description: string;
  image: string;
  itemCount: number;
  featured?: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
  unitPricePKR: number;
  unitPriceUSD: number;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateProvince?: string;
  postalCode?: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  size?: string;
  color?: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerDetails;
  items: OrderItem[];
  currency: CurrencyCode;
  market?: MarketType;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  courierName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface StoreReview {
  id: string;
  authorName: string;
  location: string;
  rating: number;
  comment: string;
  verifiedBuyer: boolean;
  date: string;
  productName?: string;
}
