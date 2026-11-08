import { NextResponse } from "next/server";
import { getOrderByIdOrNumber, updateOrder, deleteOrder } from "@/lib/db";
import { requireAdminAuth } from "@/lib/security/auth";
import { orderUpdateSchema } from "@/lib/security/validation";

/**
 * GET /api/orders/[id] — Retrieve Order Details
 * STRICT SECURITY: Restricted to verified Administrators.
 * Public customer tracking is served via /api/orders/track with multi-factor verification & masked PII.
 */
export async function GET(request, { params }) {
  try {
    const adminSession = await requireAdminAuth(request);
    if (!adminSession) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Administrative session required to view full customer consignment.",
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const order = getOrderByIdOrNumber(id);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order, order });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PATCH /api/orders/[id] — Update Order Status / Dispatch
 * STRICT SECURITY: Restricted to verified Administrators with input schema validation.
 */
export async function PATCH(request, { params }) {
  try {
    const adminSession = await requireAdminAuth(request);
    if (!adminSession) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Administrative session required to update consignments.",
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const parsed = orderUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Invalid order update parameters",
        },
        { status: 400 }
      );
    }

    const updatePayload = { ...parsed.data };

    // If dispatching order, ensure courier and tracking number exist
    if (updatePayload.orderStatus === "DISPATCHED" && !updatePayload.trackingNumber) {
      updatePayload.trackingNumber = `TRK-EXP-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    if (updatePayload.orderStatus === "DELIVERED") {
      updatePayload.paymentStatus = "PAID";
    }

    const updated = updateOrder(id, updatePayload);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated, order: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/orders/[id] — Delete Consignment Record
 * STRICT SECURITY: Restricted to verified Administrators.
 */
export async function DELETE(request, { params }) {
  try {
    const adminSession = await requireAdminAuth(request);
    if (!adminSession) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Administrative session required to delete order records.",
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const deleted = deleteOrder(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Order record deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
