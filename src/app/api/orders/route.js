import { NextResponse } from "next/server";
import { getOrders, createOrder } from "@/lib/db";
import { requireAdminAuth } from "@/lib/security/auth";
import { checkRateLimit, RateLimitPresets } from "@/lib/security/rate-limit";
import { createOrderSchema } from "@/lib/security/validation";
import { calculateAuthoritativeOrder } from "@/lib/security/pricing";

/**
 * GET /api/orders — List Store Consignments
 * STRICT SECURITY: Restricted to verified Administrators only to prevent PII harvesting.
 */
export async function GET(request) {
  try {
    const adminSession = await requireAdminAuth(request);
    if (!adminSession) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Administrative authentication required to access customer consignments.",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const market = searchParams.get("market");
    const search = searchParams.get("search");

    let orders = getOrders();

    if (status && status !== "ALL") {
      orders = orders.filter((o) => o.orderStatus === status);
    }

    if (market && market !== "ALL") {
      orders = orders.filter((o) => o.market === market);
    }

    if (search) {
      const q = search.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          (o.customer &&
            (o.customer.fullName?.toLowerCase().includes(q) ||
              o.customer.phone?.includes(q) ||
              o.customer.city?.toLowerCase().includes(q)))
      );
    }

    return NextResponse.json({ success: true, count: orders.length, orders, data: orders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/orders — Create Customer Consignment Order
 * STRICT SECURITY:
 * 1. Rate limited (10 orders per 10 mins per IP)
 * 2. Strict Zod schema validation
 * 3. Authoritative server-side pricing recalculation (Discards client prices & totals)
 * 4. Server-controlled payment status
 */
export async function POST(request) {
  try {
    // 1. Rate Limiting Check
    const rateLimit = checkRateLimit(request, RateLimitPresets.CHECKOUT, "checkout");
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many orders submitted in a short time. Please wait a few minutes before placing another order.",
        },
        { status: 429 }
      );
    }

    // 2. Parse and Validate Request Payload
    const rawBody = await request.json();
    const validationResult = createOrderSchema.safeParse(rawBody);

    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0];
      return NextResponse.json(
        {
          success: false,
          error: firstIssue ? `${firstIssue.path.join(".")}: ${firstIssue.message}` : "Invalid order payload",
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // 3. Determine Market
    const isPK =
      validatedData.market === "PK" ||
      validatedData.customer.country.toLowerCase().includes("pakistan");
    const market = isPK ? "PK" : "INTL";

    // 4. Server-Side Authoritative Pricing Calculation
    // Never trust client prices, totals, or payment statuses
    const verifiedPricing = calculateAuthoritativeOrder(
      validatedData.items,
      validatedData.couponCode,
      market,
      validatedData.paymentMethod || (isPK ? "COD" : "CARD")
    );

    // 5. Construct Secure Order Entity
    const verifiedOrderPayload = {
      customer: validatedData.customer,
      items: verifiedPricing.items,
      market: verifiedPricing.market,
      currency: verifiedPricing.currency,
      subtotal: verifiedPricing.subtotal,
      shippingCost: verifiedPricing.shippingCost,
      discount: verifiedPricing.discount,
      total: verifiedPricing.total,
      paymentMethod: verifiedPricing.paymentMethod,
      paymentStatus: verifiedPricing.paymentStatus,
      orderStatus: verifiedPricing.orderStatus,
      appliedCoupon: verifiedPricing.appliedCoupon,
      notes: validatedData.notes || "",
    };

    const createdOrder = createOrder(verifiedOrderPayload);

    return NextResponse.json(
      {
        success: true,
        order: createdOrder,
        data: createdOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation security error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
