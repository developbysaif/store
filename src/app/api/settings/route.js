import { NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/db";
import { requireAdminAuth } from "@/lib/security/auth";

export async function GET() {
  try {
    const settings = getSettings();
    return NextResponse.json({ success: true, settings, data: settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/settings — Update Store Global Settings
 * STRICT SECURITY: Restricted to verified Administrators.
 */
export async function POST(request) {
  try {
    const adminSession = await requireAdminAuth(request);
    if (!adminSession) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Administrative session required to modify store settings.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const updated = updateSettings(body);
    return NextResponse.json({ success: true, settings: updated, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
