import { z } from "zod";

/**
 * Basic XSS sanitizer: strips HTML tags and dangerous characters
 */
export function sanitizeString(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/<[^>]*>?/gm, "") // remove HTML tags
    .replace(/[<>"'`]/g, (char) => {
      switch (char) {
        case "<": return "&lt;";
        case ">": return "&gt;";
        case '"': return "&quot;";
        case "'": return "&#39;";
        case "`": return "&#96;";
        default: return char;
      }
    })
    .trim();
}

/**
 * Checkout Customer Schema
 */
export const customerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters")
    .transform(sanitizeString),
  email: z
    .string()
    .email("A valid email address is required")
    .max(120, "Email cannot exceed 120 characters")
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 characters")
    .max(25, "Phone number cannot exceed 25 characters")
    .regex(/^[+0-9\s-()]+$/, "Phone contains invalid characters")
    .trim(),
  addressLine1: z
    .string()
    .min(3, "Address must be at least 3 characters")
    .max(200, "Address cannot exceed 200 characters")
    .transform(sanitizeString),
  addressLine2: z
    .string()
    .max(200, "Address line 2 cannot exceed 200 characters")
    .optional()
    .nullable()
    .transform((val) => (val ? sanitizeString(val) : "")),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(80, "City cannot exceed 80 characters")
    .transform(sanitizeString),
  stateProvince: z
    .string()
    .max(80, "State/Province cannot exceed 80 characters")
    .optional()
    .nullable()
    .transform((val) => (val ? sanitizeString(val) : "")),
  postalCode: z
    .string()
    .max(20, "Postal code cannot exceed 20 characters")
    .optional()
    .nullable()
    .transform((val) => (val ? sanitizeString(val) : "")),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(80, "Country cannot exceed 80 characters")
    .transform(sanitizeString),
});

/**
 * Cart Item Submission Schema
 */
export const orderItemInputSchema = z.object({
  productId: z.string().min(1, "Product ID is required").max(100),
  variantId: z.string().max(100).optional().nullable(),
  size: z.string().max(50).optional().nullable(),
  color: z.string().max(50).optional().nullable(),
  sku: z.string().max(100).optional().nullable(),
  // Strict quantity boundary: integers 1 to 10
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1")
    .max(10, "Quantity cannot exceed 10 pieces per order"),
});

/**
 * Order Creation Schema
 */
export const createOrderSchema = z.object({
  customer: customerSchema,
  items: z.array(orderItemInputSchema).min(1, "Order must contain at least one item").max(50),
  market: z.enum(["PK", "INTL"]).optional(),
  currency: z.enum(["PKR", "USD"]).optional(),
  paymentMethod: z.enum(["COD", "CARD", "BANK_TRANSFER"]).optional(),
  couponCode: z
    .string()
    .max(30, "Coupon code cannot exceed 30 characters")
    .optional()
    .nullable()
    .transform((val) => (val ? val.trim().toUpperCase() : null)),
  notes: z
    .string()
    .max(500, "Notes cannot exceed 500 characters")
    .optional()
    .nullable()
    .transform((val) => (val ? sanitizeString(val) : "")),
});

/**
 * Order Status & Dispatch Update Schema
 */
export const orderUpdateSchema = z.object({
  orderStatus: z
    .enum([
      "PENDING_VERIFICATION",
      "CONFIRMED",
      "PROCESSING",
      "DISPATCHED",
      "DELIVERED",
      "CANCELLED",
    ])
    .optional(),
  paymentStatus: z.enum(["PENDING", "PAID", "REFUNDED", "FAILED"]).optional(),
  courierName: z
    .string()
    .max(100)
    .optional()
    .transform((val) => (val ? sanitizeString(val) : undefined)),
  trackingNumber: z
    .string()
    .max(100)
    .optional()
    .transform((val) => (val ? sanitizeString(val) : undefined)),
  notes: z
    .string()
    .max(500)
    .optional()
    .transform((val) => (val ? sanitizeString(val) : undefined)),
});

/**
 * Admin Product Mutation Schema
 */
export const productMutationSchema = z.object({
  name: z.string().min(2, "Product name is required").max(200).transform(sanitizeString),
  category: z.string().min(2, "Category is required").max(100),
  subCategory: z.string().max(100).optional().nullable(),
  tagline: z.string().max(250).optional().nullable().transform((val) => (val ? sanitizeString(val) : "")),
  description: z.string().max(5000).optional().nullable().transform((val) => (val ? sanitizeString(val) : "")),
  gender: z.enum(["MEN", "WOMEN", "UNISEX"]).optional(),
  basePricePKR: z.number().positive("Base Price (PKR) must be positive"),
  basePriceUSD: z.number().positive("Base Price (USD) must be positive"),
  stock: z.number().int().min(0).optional(),
  featured: z.boolean().optional(),
  inStock: z.boolean().optional(),
  images: z.array(z.any()).optional(),
  variants: z.array(z.any()).optional(),
});

/**
 * Admin Category Mutation Schema
 */
export const categoryMutationSchema = z.object({
  name: z.string().min(2, "Category name is required").max(100).transform(sanitizeString),
  slug: z
    .string()
    .max(100)
    .regex(/^[a-z0-9-]*$/, "Slug must only contain lowercase letters, numbers, and hyphens")
    .optional(),
  description: z.string().max(1000).optional().transform((val) => (val ? sanitizeString(val) : "")),
  image: z.string().max(500).optional(),
  featured: z.boolean().optional(),
});

/**
 * Admin Login Schema
 */
export const adminLoginSchema = z.object({
  email: z.string().email("Valid email required").toLowerCase().trim(),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
});

/**
 * Tracking Query Schema
 */
export const trackingQuerySchema = z.object({
  orderNumber: z
    .string()
    .min(5, "Order number must be at least 5 characters")
    .max(40, "Order number too long")
    .trim()
    .toUpperCase(),
  contact: z
    .string()
    .min(4, "Phone or email verification required")
    .max(100, "Contact query too long")
    .trim(),
});
