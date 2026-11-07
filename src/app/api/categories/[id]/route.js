import { NextResponse } from "next/server";
import { getCategoryBySlug, updateCategory, deleteCategory } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const cat = getCategoryBySlug(id);
    if (!cat) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: cat });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = updateCategory(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
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
