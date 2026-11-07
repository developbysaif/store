import { NextResponse } from "next/server";
import { getOrderByIdOrNumber, updateOrder, deleteOrder } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const order = getOrderByIdOrNumber(id);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // If dispatching order, ensure courier and tracking number exist
    if (body.orderStatus === "DISPATCHED" && !body.trackingNumber) {
      body.trackingNumber = `TRK-EXP-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    if (body.orderStatus === "DELIVERED" && body.paymentMethod === "COD") {
      body.paymentStatus = "PAID";
    }

    const updated = updateOrder(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const deleted = deleteOrder(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
