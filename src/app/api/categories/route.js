import { NextResponse } from "next/server";
import { getCategories, createCategory } from "@/lib/db";
import { requireAdminAuth } from "@/lib/security/auth";
import { categoryMutationSchema } from "@/lib/security/validation";

export async function GET() {
  try {
    const categories = getCategories();
    return NextResponse.json({ success: true, count: categories.length, categories, data: categories });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/categories — Create Department Category
 * STRICT SECURITY: Restricted to verified Administrators.
 */
export async function POST(request) {
  try {
    const adminSession = await requireAdminAuth(request);
    if (!adminSession) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Administrative session required to create departments.",
        },
        { status: 401 }
      );
    }

    const rawBody = await request.json();
    const parsed = categoryMutationSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Invalid category parameters",
        },
        { status: 400 }
      );
    }

    const created = createCategory(parsed.data);
    return NextResponse.json({ success: true, category: created, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
