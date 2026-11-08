import { NextResponse } from "next/server";
import { getAdminStats } from "@/lib/db";
import { requireAdminAuth } from "@/lib/security/auth";

/**
 * GET /api/admin/stats — Business Financial & Sales Metrics
 * STRICT SECURITY: Restricted to verified Administrators.
 */
export async function GET(request) {
  try {
    const adminSession = await requireAdminAuth(request);
    if (!adminSession) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Administrative session required to view store analytics.",
        },
        { status: 401 }
      );
    }

    const stats = getAdminStats();
    return NextResponse.json({ success: true, stats, data: stats });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
