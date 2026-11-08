import { NextResponse } from "next/server";
import { getOrderByIdOrNumber } from "@/lib/db";
import { checkRateLimit, RateLimitPresets } from "@/lib/security/rate-limit";
import { trackingQuerySchema } from "@/lib/security/validation";

/**
 * Helper to mask sensitive customer name for public tracking
 * e.g. "Saif Ahmed" -> "S*** A***"
 */
function maskName(name) {
  if (!name || typeof name !== "string") return "Client";
  return name
    .split(" ")
    .map((part) => (part.length <= 1 ? part : `${part[0]}${"*".repeat(Math.max(2, part.length - 1))}`))
    .join(" ");
}

/**
 * POST /api/orders/track
 * Secure Consignment Tracking with Multi-Factor Verification & PII Masking
 */
export async function POST(request) {
  try {
    // 1. Rate Limiting Check (Anti-Enumeration)
    const rateLimit = checkRateLimit(request, RateLimitPresets.ORDER_TRACKING, "track");
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Too many consignment tracking inquiries. Please try again shortly.",
        },
        { status: 429 }
      );
    }

    // 2. Validate input schema
    const body = await request.json();
    const parsed = trackingQuerySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Invalid tracking inquiry parameters",
        },
        { status: 400 }
      );
    }

    const { orderNumber, contact } = parsed.data;

    // 3. Query order by reference code
    const order = getOrderByIdOrNumber(orderNumber);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: "No consignment found matching this order reference and verification credential.",
        },
        { status: 404 }
      );
    }

    // 4. Verify contact match (Phone or Email) to prevent unauthorized order inspection
    const customer = order.customer || {};
    const normalizedContact = contact.toLowerCase().replace(/[^a-z0-9]/g, "");
    const customerPhoneClean = (customer.phone || "").replace(/[^0-9]/g, "");
    const customerEmailClean = (customer.email || "").toLowerCase().trim();

    const isPhoneMatch =
      normalizedContact.length >= 4 && customerPhoneClean.includes(normalizedContact);
    const isEmailMatch =
      customerEmailClean.length > 3 && customerEmailClean === contact.toLowerCase().trim();

    if (!isPhoneMatch && !isEmailMatch) {
      return NextResponse.json(
        {
          success: false,
          error: "No consignment found matching this order reference and verification credential.",
        },
        { status: 404 }
      );
    }

    // 5. Return sanitized, masked consignment record with zero street PII leak
    const sanitizedOrder = {
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      courierName: order.courierName || "Express Courier Logistics",
      trackingNumber: order.trackingNumber || null,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      customer: {
        maskedName: maskName(customer.fullName),
        city: customer.city || "Pakistan",
        country: customer.country || "Pakistan",
      },
      items: (order.items || []).map((item) => ({
        productName: item.productName,
        productImage: item.productImage,
        size: item.size || null,
        color: item.color || null,
        quantity: item.quantity,
      })),
      currency: order.currency,
      total: order.total,
    };

    return NextResponse.json({
      success: true,
      data: sanitizedOrder,
      order: sanitizedOrder,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
