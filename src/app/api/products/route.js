import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const gender = searchParams.get("gender");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "featured";

    let products = getProducts();

    if (category && category !== "all") {
      products = products.filter((p) => p.category === category);
    }

    if (gender && gender !== "all") {
      products = products.filter((p) => p.gender === gender || p.gender === "UNISEX");
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    if (sortBy === "price-asc") {
      products.sort((a, b) => a.basePricePKR - b.basePricePKR);
    } else if (sortBy === "price-desc") {
      products.sort((a, b) => b.basePricePKR - a.basePricePKR);
    } else if (sortBy === "rating") {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "newest") {
      products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return NextResponse.json({ success: true, count: products.length, products, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name || !body.category) {
      return NextResponse.json(
        { success: false, error: "Product name and category are required" },
        { status: 400 }
      );
    }

    const created = createProduct(body);
    return NextResponse.json({ success: true, product: created, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
