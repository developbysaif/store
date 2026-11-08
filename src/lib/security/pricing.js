import { getProducts, getSettings } from "../db.js";
import { storeConfig } from "../store-config.js";

/**
 * Server-Side Authorized Promotional Coupons
 * Prevents client-side discount forgery and coupon manipulation
 */
export const VALID_COUPONS = {
  LUXURY10: {
    code: "LUXURY10",
    discountPercent: 10,
    maxDiscountPKR: 15000,
    maxDiscountUSD: 60,
    description: "10% Inaugural Privilege Discount",
  },
  ATELIER15: {
    code: "ATELIER15",
    discountPercent: 15,
    maxDiscountPKR: 25000,
    maxDiscountUSD: 100,
    description: "15% VIP Private Client Invitation",
  },
  WELCOME: {
    code: "WELCOME",
    discountPercent: 10,
    maxDiscountPKR: 10000,
    maxDiscountUSD: 40,
    description: "10% Welcome to Maison Atelier",
  },
};

/**
 * Recalculate and Authoritatively Price an Order on the Server
 * NEVER trusts client-submitted prices, discounts, shipping, or totals.
 *
 * @param {Array} rawItems Array of { productId, variantId, size, color, quantity }
 * @param {string} couponCode Optional discount code
 * @param {string} market "PK" or "INTL"
 * @param {string} requestedPaymentMethod "COD", "CARD", or "BANK_TRANSFER"
 * @returns {Object} Verified pricing breakdown and line items
 */
export function calculateAuthoritativeOrder(rawItems, couponCode, market = "PK", requestedPaymentMethod = "COD") {
  const products = getProducts();
  const settings = getSettings();

  const isPK = market === "PK";
  const currency = isPK ? "PKR" : "USD";

  const freeShippingThreshold = isPK
    ? settings.freeShippingThresholdPKR || storeConfig.freeShippingThresholdPKR || 7500
    : settings.freeShippingThresholdUSD || storeConfig.freeShippingThresholdUSD || 150;

  const standardShipping = isPK
    ? settings.standardShippingPKR || storeConfig.standardShippingPKR || 299
    : settings.standardShippingUSD || storeConfig.internationalShippingUSD || 15;

  let verifiedSubtotal = 0;
  const verifiedItems = [];

  for (const rawItem of rawItems) {
    const product = products.find((p) => p.id === rawItem.productId || p.slug === rawItem.productId);

    if (!product) {
      throw new Error(`Product not found or unavailable in atelier catalog: ${rawItem.productId}`);
    }

    // Determine unit base price from server catalog
    let unitPrice = isPK ? Number(product.basePricePKR) : Number(product.basePriceUSD);

    // Check variant price adjustment if applicable
    let selectedVariant = null;
    if (product.variants && product.variants.length > 0) {
      if (rawItem.variantId) {
        selectedVariant = product.variants.find((v) => v.id === rawItem.variantId || v.sku === rawItem.variantId);
      } else if (rawItem.sku) {
        selectedVariant = product.variants.find((v) => v.sku === rawItem.sku);
      } else if (rawItem.size || rawItem.color) {
        selectedVariant = product.variants.find(
          (v) => (!rawItem.size || v.size === rawItem.size) && (!rawItem.color || v.color === rawItem.color)
        );
      }

      if (selectedVariant && selectedVariant.priceAdjustment) {
        unitPrice += Number(selectedVariant.priceAdjustment);
      }
    }

    // Ensure unit price is positive and sane
    if (isNaN(unitPrice) || unitPrice <= 0) {
      unitPrice = isPK ? 1000 : 10;
    }

    const quantity = Math.max(1, Math.min(10, Math.floor(Number(rawItem.quantity) || 1)));
    const lineTotal = unitPrice * quantity;
    verifiedSubtotal += lineTotal;

    verifiedItems.push({
      productId: product.id,
      productName: product.name,
      productImage: product.images?.[0]?.url || "",
      size: rawItem.size || selectedVariant?.size || null,
      color: rawItem.color || selectedVariant?.color || null,
      sku: selectedVariant?.sku || rawItem.sku || product.slug,
      price: unitPrice,
      quantity,
      lineTotal,
    });
  }

  // 2. Authoritative Coupon Verification
  let verifiedDiscount = 0;
  let appliedCoupon = null;

  if (couponCode) {
    const normalizedCode = couponCode.trim().toUpperCase();
    const validCoupon = VALID_COUPONS[normalizedCode];

    if (validCoupon) {
      appliedCoupon = validCoupon;
      const rawDiscount = (verifiedSubtotal * validCoupon.discountPercent) / 100;
      const cap = isPK ? validCoupon.maxDiscountPKR : validCoupon.maxDiscountUSD;
      verifiedDiscount = Math.min(rawDiscount, cap);
    }
  }

  // 3. Authoritative Shipping Fee Calculation
  const eligibleForFreeShipping = (verifiedSubtotal - verifiedDiscount) >= freeShippingThreshold;
  const verifiedShippingCost = eligibleForFreeShipping ? 0 : standardShipping;

  // 4. Final Total Calculation
  const verifiedTotal = Math.max(0, verifiedSubtotal - verifiedDiscount + verifiedShippingCost);

  // 5. Payment Policy Enforcement
  // Pakistan -> ONLY COD or Bank Transfer
  // International -> Cards Required
  let finalPaymentMethod = requestedPaymentMethod;
  if (isPK) {
    if (finalPaymentMethod !== "COD" && finalPaymentMethod !== "BANK_TRANSFER") {
      finalPaymentMethod = "COD";
    }
  } else {
    finalPaymentMethod = "CARD";
  }

  const paymentStatus = finalPaymentMethod === "COD" ? "PENDING" : "PAID";
  const orderStatus = finalPaymentMethod === "COD" ? "PENDING_VERIFICATION" : "CONFIRMED";

  return {
    items: verifiedItems,
    currency,
    market: isPK ? "PK" : "INTL",
    subtotal: verifiedSubtotal,
    discount: verifiedDiscount,
    shippingCost: verifiedShippingCost,
    total: verifiedTotal,
    appliedCoupon: appliedCoupon ? appliedCoupon.code : null,
    paymentMethod: finalPaymentMethod,
    paymentStatus,
    orderStatus,
  };
}
