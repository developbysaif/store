import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/db";
import { requireAdminAuth } from "@/lib/security/auth";
import { productMutationSchema } from "@/lib/security/validation";

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

/**
 * POST /api/products — Create Catalog Product
 * STRICT SECURITY: Restricted to authenticated administrators with strict Zod validation.
 */
export async function POST(request) {
  try {
    const adminSession = await requireAdminAuth(request);
    if (!adminSession) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Administrative session required to create catalog products.",
        },
        { status: 401 }
      );
    }

    const rawBody = await request.json();
    const parsed = productMutationSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Invalid product data",
        },
        { status: 400 }
      );
    }

    const created = createProduct(parsed.data);
    return NextResponse.json({ success: true, product: created, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
