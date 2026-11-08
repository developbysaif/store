import { NextResponse } from "next/server";
import { getProductByIdOrSlug, updateProduct, deleteProduct } from "@/lib/db";
import { requireAdminAuth } from "@/lib/security/auth";
import { productMutationSchema } from "@/lib/security/validation";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const product = getProductByIdOrSlug(id);
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product, product });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/products/[id] — Full Product Update
 * STRICT SECURITY: Restricted to verified Administrators.
 */
export async function PUT(request, { params }) {
  try {
    const adminSession = await requireAdminAuth(request);
    if (!adminSession) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Administrative session required to update products.",
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = productMutationSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Invalid product update parameters",
        },
        { status: 400 }
      );
    }

    const updated = updateProduct(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated, product: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PATCH /api/products/[id] — Quick Price / Stock Edit
 * STRICT SECURITY: Restricted to verified Administrators.
 */
export async function PATCH(request, { params }) {
  try {
    const adminSession = await requireAdminAuth(request);
    if (!adminSession) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Administrative session required to modify product inventory.",
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = productMutationSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Invalid product patch parameters",
        },
        { status: 400 }
      );
    }

    const updated = updateProduct(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated, product: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/products/[id] — Remove Product
 * STRICT SECURITY: Restricted to verified Administrators.
 */
export async function DELETE(request, { params }) {
  try {
    const adminSession = await requireAdminAuth(request);
    if (!adminSession) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Administrative session required to delete products.",
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const deleted = deleteProduct(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
