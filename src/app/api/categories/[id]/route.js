import { NextResponse } from "next/server";
import { getCategoryBySlug, updateCategory, deleteCategory } from "@/lib/db";
import { requireAdminAuth } from "@/lib/security/auth";
import { categoryMutationSchema } from "@/lib/security/validation";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const cat = getCategoryBySlug(id);
    if (!cat) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: cat, category: cat });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/categories/[id] — Update Category
 * STRICT SECURITY: Restricted to verified Administrators.
 */
export async function PUT(request, { params }) {
  try {
    const adminSession = await requireAdminAuth(request);
    if (!adminSession) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Administrative session required to update departments.",
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = categoryMutationSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Invalid category update parameters",
        },
        { status: 400 }
      );
    }

    const updated = updateCategory(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated, category: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/categories/[id] — Delete Category
 * STRICT SECURITY: Restricted to verified Administrators.
 */
export async function DELETE(request, { params }) {
  try {
    const adminSession = await requireAdminAuth(request);
    if (!adminSession) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Administrative session required to delete departments.",
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const deleted = deleteCategory(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
