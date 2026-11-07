import { NextResponse } from "next/server";
import { getOrders, createOrder } from "@/lib/db";

export async function GET(request) {
  try {
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
          (o.customer && (
            o.customer.fullName?.toLowerCase().includes(q) ||
            o.customer.phone?.includes(q) ||
            o.customer.city?.toLowerCase().includes(q)
          ))
      );
    }

    return NextResponse.json({ success: true, count: orders.length, orders, data: orders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.customer || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Customer details and at least one item are required" },
        { status: 400 }
      );
    }

    // Payment validation:
    // Pakistan (National) -> ONLY COD or Bank Transfer
    // International -> Cards First
    const isPK = body.market === "PK" || body.customer.country === "Pakistan";
    if (isPK && body.paymentMethod === "CARD") {
      body.paymentMethod = "COD"; // fallback or enforce COD
    } else if (!isPK && body.paymentMethod === "COD") {
      body.paymentMethod = "CARD"; // International requires card
    }

    const createdOrder = createOrder(body);
    return NextResponse.json({ success: true, order: createdOrder, data: createdOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
